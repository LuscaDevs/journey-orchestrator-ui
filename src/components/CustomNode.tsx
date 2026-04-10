import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeData } from '../store/useJourneyStore';

const CustomNode: React.FC<{ data: NodeData, selected?: boolean }> = ({ data, selected }) => {
  const getNodeColor = () => {
    switch (data.type) {
      case 'INITIAL': return '#4caf50';
      case 'FINAL': return '#f44336';
      case 'INTERMEDIATE': return '#2196f3';
      default: return '#2196f3';
    }
  };

  return (
    <div
      style={{
        padding: '10px 15px',
        background: selected ? '#e3f2fd' : '#fff',
        border: selected ? `3px solid ${getNodeColor()}` : `2px solid ${getNodeColor()}`,
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        minWidth: '120px',
        textAlign: 'center',
        boxShadow: selected ? '0 4px 8px rgba(33, 150, 243, 0.3)' : '0 2px 5px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Connection handles on all sides */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#555',
          width: '10px',
          height: '10px',
          border: '2px solid #fff',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#555',
          width: '10px',
          height: '10px',
          border: '2px solid #fff',
        }}
      />
      
      <div>{data.name}</div>
      
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#555',
          width: '10px',
          height: '10px',
          border: '2px solid #fff',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#555',
          width: '10px',
          height: '10px',
          border: '2px solid #fff',
        }}
      />
    </div>
  );
};

export default CustomNode;
