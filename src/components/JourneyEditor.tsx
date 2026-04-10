import React, { useCallback, useEffect, useRef } from 'react';
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

import { useJourneyDefinitionStore } from '../store/useJourneyDefinitionStore';
import StateNode from './StateNode';

// Define nodeTypes outside component to prevent recreation
const nodeTypes: NodeTypes = {
  stateNode: StateNode,
};

// Define NodeData interface locally since we removed it from the store
interface NodeData {
  name: string;
  type: 'INITIAL' | 'INTERMEDIATE' | 'FINAL';
}

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
    getNodes,
    getEdges,
    addNode,
    removeNode,
    addEdge,
    removeEdge,
    updateNodeName,
    updateCurrentDefinition,
  } = useJourneyDefinitionStore();

  // Use refs to track previous state and prevent infinite loops
  const prevNodesRef = useRef<Node[]>([]);
  const prevEdgesRef = useRef<Edge[]>([]);

  // Get derived state
  const nodes = getNodes();
  const edges = getEdges();

  // Use React Flow local state
  const [nodesState, setNodesState, onNodesChange] = useNodesState(nodes);
  const [edgesState, setEdgesState, onEdgesChange] = useEdgesState(edges);

  // Sync React Flow state with store when store changes, but prevent infinite loops
  useEffect(() => {
    const nodesChanged = JSON.stringify(prevNodesRef.current) !== JSON.stringify(nodes);
    const edgesChanged = JSON.stringify(prevEdgesRef.current) !== JSON.stringify(edges);

    if (nodesChanged || edgesChanged) {
      setNodesState(nodes);
      setEdgesState(edges);
      prevNodesRef.current = nodes;
      prevEdgesRef.current = edges;
    }
  }, [nodes, edges, setNodesState, setEdgesState]);

  const onConnect = useCallback(
    (params: Connection) => {
      console.log('onConnect called:', params);
      
      if (params.source && params.target) {
        // Get current nodes for validation
        const currentNodes = getNodes();
        // Validate connection before creating edge
        if (validateConnection(params, currentNodes)) {
          addEdge(params.source, params.target, 'transition');
        } else {
          console.warn('Invalid connection attempted:', params);
          // Optionally show user feedback about invalid connection
        }
      }
    },
    [addEdge, getNodes]
  );

  const onSelectionChange = useCallback(
    (params: OnSelectionChangeParams) => {
      const selectedNodes = params.nodes;
      const selectedEdges = params.edges;

      console.log('onSelectionChange:', { selectedNodes, selectedEdges });

      // Selection is handled locally in JourneyEditorWithControls
      // We don't need to update the store for selection
    },
    []
  );

  const onNodesChangeHandler = useCallback(
    (changes: any[]) => {
      onNodesChange(changes);
      
      // Get updated state and update JourneyDefinition store
      const currentNodes = getNodes();
      const currentEdges = getEdges();
      const updatedNodes = applyNodeChanges(changes, currentNodes);
      updateCurrentDefinition(updatedNodes, currentEdges);
    },
    [onNodesChange, getNodes, getEdges, updateCurrentDefinition]
  );

  const onEdgesChangeHandler = useCallback(
    (changes: any[]) => {
      onEdgesChange(changes);
      
      // Get updated state and update JourneyDefinition store
      const currentNodes = getNodes();
      const currentEdges = getEdges();
      const updatedEdges = applyEdgeChanges(changes, currentEdges);
      updateCurrentDefinition(currentNodes, updatedEdges);
    },
    [onEdgesChange, getNodes, getEdges, updateCurrentDefinition]
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
        isValidConnection={(connection) => validateConnection(connection, nodesState)}
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
