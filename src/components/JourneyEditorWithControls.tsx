import React, { useState } from 'react';
import JourneyEditor from './JourneyEditor';
import { useJourneyStore } from '../store/useJourneyStore';
import { toDSL } from '../utils/dslMapper';

const JourneyEditorWithControls: React.FC = () => {
  const { addNode, selectedNode, selectedEdge, removeNode, removeEdge, selectNode, selectEdge, nodes, edges } = useJourneyStore();
  const [showNodeTypeDialog, setShowNodeTypeDialog] = useState(false);

  // Debug logging
  React.useEffect(() => {
    console.log('JourneyEditorWithControls - Selection state:', { selectedNode, selectedEdge });
  }, [selectedNode, selectedEdge]);

  const handleAddState = () => {
    addNode('Novo Estado', 'INTERMEDIATE');
  };

  const handleAddInitialState = () => {
    addNode('Estado Inicial', 'INITIAL');
  };

  const handleAddFinalState = () => {
    addNode('Estado Final', 'FINAL');
  };

  const handleExportDSL = () => {
    try {
      const dslDefinition = toDSL(nodes, edges);
      console.log('DSL Export:', JSON.stringify(dslDefinition, null, 2));
    } catch (error) {
      console.error('Error exporting DSL:', error);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedNode) {
      console.log('Deleting node:', selectedNode);
      removeNode(selectedNode);
      selectNode(null);
    } else if (selectedEdge) {
      console.log('Deleting edge:', selectedEdge);
      removeEdge(selectedEdge);
      selectEdge(null);
    }
  };

  const hasSelection = Boolean(selectedNode || selectedEdge);
  
  

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Controls Bar */}
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f5f5f5', 
        borderBottom: '1px solid #ddd',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <button
          onClick={handleAddInitialState}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            marginRight: '5px'
          }}
        >
          + Inicial
        </button>
        
        <button
          onClick={handleAddState}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            marginRight: '5px'
          }}
        >
          + Intermediário
        </button>
        
        <button
          onClick={handleAddFinalState}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            marginRight: '10px'
          }}
        >
          + Final
        </button>

        {hasSelection && (
          <button
            onClick={handleDeleteSelected}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Excluir Selecionado
          </button>
        )}

        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#666' }}>
          {selectedNode && `Node selecionado: ${selectedNode}`}
          {selectedEdge && `Edge selecionado: ${selectedEdge}`}
          {!selectedNode && !selectedEdge && 'Nenhum item selecionado'}
        </div>
      </div>

      {/* Editor Canvas */}
      <div style={{ flex: 1 }}>
        <JourneyEditor />
      </div>
    </div>
  );
};

export default JourneyEditorWithControls;
