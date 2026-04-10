"use client"

import { useCallback, useRef, useEffect } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type NodeChange,
  type EdgeChange,
  type Node,
  type Edge,
  type NodeTypes,
  BackgroundVariant,
  type Connection,
} from "reactflow"
import "reactflow/dist/style.css"

import { useJourneyDefinitionStore } from "../../store/useJourneyDefinitionStore"
import StateNode from "../StateNode"
import { cn } from "../../lib/utils"
import { v4 as uuidv4 } from 'uuid'

// Define nodeTypes outside component to prevent recreation
const nodeTypes: NodeTypes = {
  stateNode: StateNode,
}

// Define NodeData interface locally
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

interface CanvasAreaProps {
  className?: string
}

export function CanvasArea({ className }: CanvasAreaProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const {
    getNodes: getStoreNodes,
    getEdges: getStoreEdges,
    addNode: addStoreNode,
    addEdge: addStoreEdge,
    updateCurrentDefinition,
  } = useJourneyDefinitionStore()

  // Initialize with store data
  const initialNodes = getStoreNodes()
  const initialEdges = getStoreEdges()

  // Use React Flow local state
  const [nodes, setNodes, onNodesChangeHandler] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChangeHandler] = useEdgesState(initialEdges)

  // Track if this is the initial load
  const isInitialLoad = useRef(true)

  // Track if component has been initialized
  const isInitialized = useRef(false)

  // Sync with store when nodes/edges change
  useEffect(() => {
    updateCurrentDefinition(nodes, edges)
  }, [nodes, edges, updateCurrentDefinition])

  // Use refs to track previous state and prevent infinite loops
  const prevStoreNodesRef = useRef<Node[]>(initialNodes)
  const prevStoreEdgesRef = useRef<Edge[]>(initialEdges)

  // Remove automatic store-to-reactflow sync to prevent overwriting user edits
  // The store will be updated when React Flow state changes, but we won't sync back

  const onConnect = useCallback(
    (connection: Connection) => {
      console.log('onConnect called:', connection);
      
      if (connection.source && connection.target) {
        // Validate connection before creating edge
        if (validateConnection(connection, nodes)) {
          const newEdge = {
            id: uuidv4(),
            source: connection.source,
            target: connection.target,
            type: 'smoothstep' as const,
            data: {
              event: 'transition',
            },
          }
          setEdges((eds) => addEdge(newEdge, eds))
        } else {
          console.warn('Invalid connection attempted:', connection);
        }
      }
    },
    [nodes, setEdges]
  )

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChangeHandler(changes)
    },
    [onNodesChangeHandler]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChangeHandler(changes)
    },
    [onEdgesChangeHandler]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow') as 'INITIAL' | 'INTERMEDIATE' | 'FINAL'
      
      if (typeof type === 'undefined' || !type) {
        return
      }

      // Calculate position
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      if (!reactFlowBounds) return

      const position = {
        x: event.clientX - reactFlowBounds.left - 75,
        y: event.clientY - reactFlowBounds.top - 25,
      }

      const item = {
        INITIAL: { label: 'Estado Inicial', type: 'INITIAL' as const },
        INTERMEDIATE: { label: 'Estado Intermediário', type: 'INTERMEDIATE' as const },
        FINAL: { label: 'Estado Final', type: 'FINAL' as const },
      }

      const nodeItem = item[type]
      if (nodeItem) {
        // Use store addNode function which includes validation
        addStoreNode(nodeItem.label, nodeItem.type)
        
        // Update local React Flow state to reflect the change
        const updatedNodes = getStoreNodes()
        setNodes(updatedNodes)
      }
    },
    [addStoreNode, getStoreNodes, setNodes]
  )

  return (
    <div 
      ref={reactFlowWrapper}
      className={cn("flex-1 bg-background", className)}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        isValidConnection={(connection) => validateConnection(connection, nodes)}
        fitView
        selectNodesOnDrag={false}
        panOnDrag={true}
        style={{ width: '100%', height: '100%' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
