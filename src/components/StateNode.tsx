import React, { useState, useCallback } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useJourneyDefinitionStore } from '../store/useJourneyDefinitionStore';

// Define NodeData interface locally
interface NodeData {
  name: string;
  type: 'INITIAL' | 'INTERMEDIATE' | 'FINAL';
}

const StateNode: React.FC<NodeProps<NodeData>> = ({ data, selected, id }) => {
  const { updateNodeName } = useJourneyDefinitionStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(data.name);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditName(data.name);
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Only update the store - JourneyDefinition is the single source of truth
      updateNodeName(id, editName);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(data.name);
    }
  }, [editName, id, updateNodeName, data.name]);

  const handleBlur = useCallback(() => {
    // Only update the store - JourneyDefinition is the single source of truth
    updateNodeName(id, editName);
    setIsEditing(false);
  }, [editName, id, updateNodeName]);
  const getNodeColors = () => {
    switch (data.type) {
      case 'INITIAL': return {
        bg: 'oklch(0.65 0.18 160 / 0.1)',
        border: 'oklch(0.65 0.18 160)',
        text: 'oklch(0.75 0.18 160)',
        handle: 'oklch(0.65 0.18 160)',
        selectedBg: 'oklch(0.65 0.18 160 / 0.2)',
      };
      case 'FINAL': return {
        bg: 'oklch(0.52 0.22 27 / 0.1)',
        border: 'oklch(0.52 0.22 27)',
        text: 'oklch(0.52 0.22 27)',
        handle: 'oklch(0.52 0.22 27)',
        selectedBg: 'oklch(0.52 0.22 27 / 0.2)',
      };
      case 'INTERMEDIATE': return {
        bg: 'oklch(0.62 0.19 255 / 0.1)',
        border: 'oklch(0.62 0.19 255)',
        text: 'oklch(0.62 0.19 255)',
        handle: 'oklch(0.62 0.19 255)',
        selectedBg: 'oklch(0.62 0.19 255 / 0.2)',
      };
      default: return {
        bg: 'oklch(0.62 0.19 255 / 0.1)',
        border: 'oklch(0.62 0.19 255)',
        text: 'oklch(0.62 0.19 255)',
        handle: 'oklch(0.62 0.19 255)',
        selectedBg: 'oklch(0.62 0.19 255 / 0.2)',
      };
    }
  };

  const colors = getNodeColors();

  return (
    <div
      style={{
        padding: '12px 16px',
        background: selected ? colors.selectedBg : colors.bg,
        border: selected ? `2px solid ${colors.border}` : `1px solid ${colors.border}`,
        borderRadius: '0.5rem',
        fontSize: '14px',
        fontWeight: '500',
        minWidth: '140px',
        textAlign: 'center',
        boxShadow: selected 
          ? `0 4px 12px ${colors.handle}30` 
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        backdropFilter: 'blur(8px)',
      }}
      onDoubleClick={handleDoubleClick}
    >
      {/* Handle de entrada (apenas para INTERMEDIATE e FINAL) */}
      {data.type !== 'INITIAL' && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: colors.handle,
            width: '12px',
            height: '12px',
            border: '2px solid oklch(0.118 0 0)',
            borderRadius: '50%',
          }}
        />
      )}
      
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
            padding: '4px 8px',
            border: `1px solid ${colors.border}`,
            borderRadius: '0.25rem',
            fontSize: '14px',
            fontWeight: '500',
            textAlign: 'center',
            background: 'oklch(0.155 0 0)',
            color: 'oklch(0.94 0 0)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div style={{ 
          color: 'oklch(0.94 0 0)',
          fontSize: '14px',
          fontWeight: '500',
          lineHeight: '1.4'
        }}>
          {data.name}
        </div>
      )}
      
      {/* Handle de saída (apenas para INTERMEDIATE e FINAL) */}
      {data.type !== 'FINAL' && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: colors.handle,
            width: '12px',
            height: '12px',
            border: '2px solid oklch(0.118 0 0)',
            borderRadius: '50%',
          }}
        />
      )}
    </div>
  );
};

export default StateNode;
