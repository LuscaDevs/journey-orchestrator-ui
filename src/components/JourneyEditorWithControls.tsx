import React, { useState } from 'react';
import JourneyEditor from './JourneyEditor';
import { useJourneyStore } from '../store/useJourneyStore';
import { useJourneyDefinitionStore } from '../store/useJourneyDefinitionStore';
import { toDSL } from '../utils/dslMapper';

const JourneyEditorWithControls: React.FC = () => {
  const { addNode, selectedNode, selectedEdge, removeNode, removeEdge, selectNode, selectEdge } = useJourneyStore();
  const {
    currentDefinition,
    definitions,
    createDefinition,
    updateDefinition,
    deleteDefinition,
    loadDefinitionIntoCanvas,
    saveCurrentDefinition,
    discardChanges,
    hasUnsavedChanges,
  } = useJourneyDefinitionStore();
  const [showNodeTypeDialog, setShowNodeTypeDialog] = useState(false);
  const [journeyName, setJourneyName] = useState('');

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
      const { canvasNodes, canvasEdges } = useJourneyDefinitionStore.getState();
      const dslDefinition = toDSL(canvasNodes, canvasEdges);
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

  const handleCreateJourney = () => {
    const name = prompt('Nome da nova jornada:');
    if (name) {
      createDefinition(name);
    }
  };

  const handleSaveJourney = () => {
    if (currentDefinition) {
      const name = prompt('Nome da jornada:', currentDefinition.name);
      if (name) {
        updateDefinition(name);
      }
    }
  };

  const handleSelectJourney = (definitionId: string) => {
    const definition = definitions.find(d => d.id === definitionId);
    if (definition) {
      loadDefinitionIntoCanvas(definition);
    }
  };

  const handleDeleteJourney = (definitionId: string) => {
    if (confirm('Tem certeza que deseja excluir esta jornada?')) {
      deleteDefinition(definitionId);
    }
  };

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
        {/* Journey CRUD Controls */}
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <button
            onClick={handleCreateJourney}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Nova Jornada
          </button>

          {currentDefinition && (
            <>
              <button
                onClick={handleSaveJourney}
                style={{
                  padding: '8px 16px',
                  backgroundColor: hasUnsavedChanges ? '#ffc107' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {hasUnsavedChanges ? 'Salvar*' : 'Salvar'}
              </button>

              {hasUnsavedChanges && (
                <button
                  onClick={discardChanges}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Descartar
                </button>
              )}
            </>
          )}

          <select
            value={currentDefinition?.id || ''}
            onChange={(e) => e.target.value && handleSelectJourney(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            <option value="">Selecionar Jornada</option>
            {definitions.map(def => (
              <option key={def.id} value={def.id}>
                {def.name} {def.version > 1 ? `(v${def.version})` : ''}
              </option>
            ))}
          </select>

          {currentDefinition && (
            <button
              onClick={() => handleDeleteJourney(currentDefinition.id)}
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
              Excluir Jornada
            </button>
          )}
        </div>

        <div style={{ borderLeft: '1px solid #ccc', height: '30px', margin: '0 10px' }} />

        {/* Node Controls */}
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

        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentDefinition && (
            <span>
              {currentDefinition.name} {hasUnsavedChanges && '(modificado)'}
            </span>
          )}
          {selectedNode && `Node: ${selectedNode}`}
          {selectedEdge && `Edge: ${selectedEdge}`}
          {!selectedNode && !selectedEdge && !currentDefinition && 'Nenhuma jornada selecionada'}
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
