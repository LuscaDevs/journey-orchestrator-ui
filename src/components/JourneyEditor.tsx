import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  type Connection,
  type Node,
  type Edge,
  type OnSelectionChangeParams,
  BackgroundVariant,
  type NodeTypes,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useJourneyStore } from '../store/useJourneyStore';
import StateNode from './StateNode';
import type { NodeData } from '../store/useJourneyStore';

// Connection validation rules
const validateConnection = (
  connection: Connection,
  nodes: Node<NodeData>[]
): boolean => {
  const sourceNode = nodes.find(node => node.id === connection.source);
  const targetNode = nodes.find(node => node.id === connection.target);

  if (!sourceNode || !targetNode) {
    return false;
  }

  const sourceType = sourceNode.data.type;
  const targetType = targetNode.data.type;

  // Initial state: only outgoing connections, to intermediate or final
  if (sourceType === 'INITIAL') {
    return targetType === 'INTERMEDIATE' || targetType === 'FINAL';
  }

  // Final state: only incoming connections, only from intermediate
  if (sourceType === 'FINAL') {
    return false; // Final state cannot have outgoing connections
  }

  // Intermediate state: can connect to initial and final
  if (sourceType === 'INTERMEDIATE') {
    return targetType === 'INITIAL' || targetType === 'FINAL' || targetType === 'INTERMEDIATE';
  }

  return false;
};

const JourneyEditorContent: React.FC = () => {
  const {
    nodes,
    edges,
    selectedNode,
    selectedEdge,
    setNodes,
    setEdges,
    addEdge: addStoreEdge,
    selectNode,
    selectEdge,
  } = useJourneyStore();

  // Define custom node types
  const nodeTypes: NodeTypes = useMemo(() => ({
    stateNode: StateNode,
  }), []);

  const [nodesState, setNodesState, onNodesChange] = useNodesState(nodes);
  const [edgesState, setEdgesState, onEdgesChange] = useEdgesState(edges);

  // Synchronize Zustand store with ReactFlow state - single source of truth
  React.useEffect(() => {
    setNodesState(nodes);
  }, [nodes, setNodesState]);

  React.useEffect(() => {
    setEdgesState(edges);
  }, [edges, setEdgesState]);

  const onConnect = useCallback(
    (params: Connection) => {
      console.log('onConnect called:', params);
      
      if (params.source && params.target) {
        // Validate connection before creating edge
        if (validateConnection(params, nodes)) {
          addStoreEdge(params.source, params.target, 'transition');
        } else {
          console.warn('Invalid connection attempted:', params);
          // Optionally show user feedback about invalid connection
        }
      }
    },
    [addStoreEdge, nodes]
  );

  const onSelectionChange = useCallback(
    (params: OnSelectionChangeParams) => {
      const selectedNodes = params.nodes;
      const selectedEdges = params.edges;

      console.log('onSelectionChange:', { selectedNodes, selectedEdges });

      if (selectedNodes.length > 0) {
        console.log('Selecting node:', selectedNodes[0].id);
        selectNode(selectedNodes[0].id);
      } else if (selectedEdges.length > 0) {
        console.log('Selecting edge:', selectedEdges[0].id);
        selectEdge(selectedEdges[0].id);
      } else {
        console.log('Clearing selection');
        selectNode(null);
        selectEdge(null);
      }
    },
    [selectNode, selectEdge]
  );

  const onNodesChangeHandler = useCallback(
    (changes: any[]) => {
      onNodesChange(changes);
      
      // Update store with new nodes state
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
    },
    [onNodesChange, nodes, setNodes]
  );

  const onEdgesChangeHandler = useCallback(
    (changes: any[]) => {
      onEdgesChange(changes);
      
      // Update store with new edges state
      const updatedEdges = applyEdgeChanges(changes, edges);
      setEdges(updatedEdges);
    },
    [onEdgesChange, edges, setEdges]
  );

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChangeHandler}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        isValidConnection={(connection) => validateConnection(connection, nodes)}
        fitView
        selectNodesOnDrag={false}
        panOnDrag={true}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};


const JourneyEditor: React.FC = () => {
  return (
    <ReactFlowProvider>
      <JourneyEditorContent />
    </ReactFlowProvider>
  );
};

export default JourneyEditor;
