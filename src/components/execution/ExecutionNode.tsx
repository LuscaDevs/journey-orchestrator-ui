import React from 'react';
import { Handle, Position } from 'reactflow';
import { CheckCircle, Activity, Circle, AlertCircle } from 'lucide-react';

interface ExecutionNodeData {
  name: string;
  type: string;
  executionStatus: 'COMPLETED' | 'RUNNING' | 'PENDING' | 'FAILED';
  visitedAt?: string;
}

const ExecutionNode: React.FC<{ data: ExecutionNodeData }> = ({ data }) => {
  const getNodeStyle = () => {
    switch (data.executionStatus) {
      case 'COMPLETED':
        return {
          background: '#dcfce7',
          border: '#22c55e',
          textColor: '#166534',
        };
      case 'RUNNING':
        return {
          background: '#dbeafe',
          border: '#3b82f6',
          textColor: '#1e40af',
        };
      case 'FAILED':
        return {
          background: '#fee2e2',
          border: '#ef4444',
          textColor: '#991b1b',
        };
      case 'PENDING':
      default:
        return {
          background: '#f1f5f9',
          border: '#94a3b8',
          textColor: '#475569',
        };
    }
  };

  const getIcon = () => {
    switch (data.executionStatus) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5" style={{ color: getNodeStyle().border }} />;
      case 'RUNNING':
        return <Activity className="h-5 w-5" style={{ color: getNodeStyle().border }} />;
      case 'FAILED':
        return <AlertCircle className="h-5 w-5" style={{ color: getNodeStyle().border }} />;
      case 'PENDING':
      default:
        return <Circle className="h-5 w-5" style={{ color: getNodeStyle().border }} />;
    }
  };

  const style = getNodeStyle();

  return (
    <div
      style={{
        padding: '12px 16px',
        background: style.background,
        border: `2px solid ${style.border}`,
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        minWidth: '140px',
        textAlign: 'center',
        color: style.textColor,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* Connection handles based on state type */}
      {data.type !== 'INITIAL' && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: '#64748b',
            width: '8px',
            height: '8px',
            border: '2px solid #fff',
          }}
        />
      )}

      <div className="flex items-center justify-center gap-2">
        {getIcon()}
        <span>{data.name}</span>
      </div>

      {data.type !== 'FINAL' && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: '#64748b',
            width: '8px',
            height: '8px',
            border: '2px solid #fff',
          }}
        />
      )}
    </div>
  );
};

export default ExecutionNode;
