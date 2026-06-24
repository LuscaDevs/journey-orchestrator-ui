import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { ExecutionFlowViewerProps } from '../../types/execution.types';
import ExecutionNode from './ExecutionNode';
import { CheckCircle, Activity, Circle, AlertCircle } from 'lucide-react';

const nodeTypes = {
  execution: ExecutionNode,
};

export function ExecutionFlowViewer({ definition, executionNodeStates }: ExecutionFlowViewerProps) {
  const { nodes, edges } = useMemo(() => {
    if (!definition || !definition.states || !definition.transitions) {
      return { nodes: [], edges: [] };
    }

    // Create a map from state name to state ID for edge matching
    const stateNameToId = new Map<string, string>();
    definition.states.forEach((state: any) => {
      stateNameToId.set(state.name, state.id);
    });

    // Calculate linear horizontal positions for nodes
    const NODE_SPACING = 300;
    const START_X = 50;
    const Y = 150;

    // Sort states to determine order - try to follow transition order
    const orderedStates = [...definition.states].sort((a: any, b: any) => {
      // If there's a transition from a to b, put a before b
      const hasTransition = definition.transitions.some((t: any) =>
        (t.sourceStateId === a.id || t.source === a.name) &&
        (t.targetStateId === b.id || t.target === b.name)
      );
      if (hasTransition) return -1;
      return 0;
    });

    // Convert states to React Flow nodes with linear positions
    const flowNodes: Node[] = orderedStates.map((state: any, index: number) => {
      const executionState = executionNodeStates.get(state.name);
      return {
        id: state.id,
        type: 'execution',
        position: { x: START_X + (index * NODE_SPACING), y: Y },
        data: {
          name: state.name,
          type: state.type,
          executionStatus: executionState?.executionStatus || 'PENDING',
          visitedAt: executionState?.visitedAt,
        },
      };
    });

    // Convert transitions to React Flow edges
    const flowEdges: Edge[] = definition.transitions.map((transition: any) => {
      // Use new ID fields if available, otherwise fall back to legacy name-based matching
      const sourceId = transition.sourceStateId || stateNameToId.get(transition.source);
      const targetId = transition.targetStateId || stateNameToId.get(transition.target);

      return {
        id: `${sourceId}-${targetId}`,
        source: sourceId || '',
        target: targetId || '',
        animated: false,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
        label: transition.event,
        labelStyle: { fontSize: 12, fill: '#64748b' },
        zIndex: 1000, // Render edges on top of nodes
        markerEnd: { type: 'arrowclosed', color: '#94a3b8' },
      };
    }).filter((edge: Edge) => edge.source && edge.target); // Filter out invalid edges

    return { nodes: flowNodes, edges: flowEdges };
  }, [definition, executionNodeStates]);

  if (!definition) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Definição da jornada não disponível
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="w-full h-[500px] border rounded-lg bg-background">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={true}
          panOnScroll={true}
          selectNodesOnDrag={false}
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const status = node.data.executionStatus;
              switch (status) {
                case 'COMPLETED': return '#22c55e';
                case 'RUNNING': return '#3b82f6';
                case 'FAILED': return '#ef4444';
                default: return '#94a3b8';
              }
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>Concluído</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-500" />
          <span>Em Execução</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>Falhou</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 text-gray-400" />
          <span>Pendente</span>
        </div>
      </div>
    </div>
  );
}
