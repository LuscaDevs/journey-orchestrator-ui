import React, { useState } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { NodeData } from '../store/useJourneyStore';
import { useJourneyStore } from '../store/useJourneyStore';

const StateNode: React.FC<NodeProps<NodeData>> = ({ data, selected, id }) => {
  const { updateNodeName } = useJourneyStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(data.name);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditName(data.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (editName.trim()) {
        updateNodeName(id, editName.trim());
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(data.name);
    }
  };

  const handleBlur = () => {
    if (editName.trim()) {
      updateNodeName(id, editName.trim());
    }
    setIsEditing(false);
  };
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
      onDoubleClick={handleDoubleClick}
    >
      {/* Handle de entrada */}
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
      
      {/* Conteúdo central */}
      {isEditing ? (
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          autoFocus
          style={{
            width: '100%',
            padding: '2px',
            border: '1px solid #ccc',
            borderRadius: '3px',
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'center',
            background: '#fff',
            outline: 'none',
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div>{data.name}</div>
      )}
      
      {/* Handle de saída */}
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
    </div>
  );
};

export default StateNode;
