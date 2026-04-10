import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourneyDefinitionStore } from '../store/useJourneyDefinitionStore';
import type { JourneyDefinition } from '../types/journey';
import JourneyEditorWithControls from './JourneyEditorWithControls';

const Dashboard: React.FC = () => {
  const {
    definitions,
    createDefinition,
    deleteDefinition,
  } = useJourneyDefinitionStore();

  const navigate = useNavigate();

  const handleCreateJourney = () => {
    const name = prompt('Nome da nova jornada:');
    if (name) {
      createDefinition(name);
      // Navigate to editor after creating
      setTimeout(() => navigate('/editor'), 100);
    }
  };

  const handleEditJourney = (definition: JourneyDefinition) => {
    // Load definition and navigate to editor
    const { loadDefinitionIntoCanvas } = useJourneyDefinitionStore.getState();
    loadDefinitionIntoCanvas(definition);
    navigate('/editor');
  };

  const handleDeleteJourney = (definition: JourneyDefinition) => {
    if (confirm(`Tem certeza que deseja excluir a jornada "${definition.name}"?`)) {
      deleteDefinition(definition.id);
    }
  };

  const handleDuplicateJourney = (definition: JourneyDefinition) => {
    const newName = prompt('Nome da jornada duplicada:', `${definition.name} (Cópia)`);
    if (newName) {
      createDefinition(newName);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#333',
          margin: 0
        }}>
          Journey Definitions
        </h1>
        <button
          onClick={handleCreateJourney}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>+</span>
          Nova Jornada
        </button>
      </div>

      {/* Table */}
      {definitions.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '2px dashed #dee2e6'
        }}>
          <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>
            Nenhuma jornada encontrada
          </h3>
          <p style={{ color: '#6c757d', margin: 0 }}>
            Crie sua primeira jornada usando o botão "Nova Jornada"
          </p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#495057',
                  fontSize: '14px'
                }}>
                  Código
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#495057',
                  fontSize: '14px'
                }}>
                  Nome
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#495057',
                  fontSize: '14px'
                }}>
                  Data de Criação
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#495057',
                  fontSize: '14px'
                }}>
                  Última Atualização
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#495057',
                  fontSize: '14px'
                }}>
                  Versão
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'center', 
                  fontWeight: '600',
                  color: '#495057',
                  fontSize: '14px'
                }}>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {definitions.map((definition, index) => (
                <tr 
                  key={definition.id}
                  style={{ 
                    borderBottom: '1px solid #dee2e6',
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                  }}
                >
                  <td style={{ 
                    padding: '12px 16px', 
                    fontSize: '13px',
                    color: '#6c757d',
                    fontFamily: 'monospace'
                  }}>
                    {definition.id.substring(0, 8)}...
                  </td>
                  <td style={{ 
                    padding: '12px 16px', 
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#212529'
                  }}>
                    {definition.name}
                  </td>
                  <td style={{ 
                    padding: '12px 16px', 
                    fontSize: '13px',
                    color: '#6c757d'
                  }}>
                    {formatDate(definition.metadata.createdAt)}
                  </td>
                  <td style={{ 
                    padding: '12px 16px', 
                    fontSize: '13px',
                    color: '#6c757d'
                  }}>
                    {formatDate(definition.metadata.updatedAt)}
                  </td>
                  <td style={{ 
                    padding: '12px 16px', 
                    fontSize: '13px',
                    color: '#6c757d'
                  }}>
                    v{definition.version}
                  </td>
                  <td style={{ 
                    padding: '12px 16px', 
                    textAlign: 'center'
                  }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEditJourney(definition)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDuplicateJourney(definition)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Duplicar
                      </button>
                      <button
                        onClick={() => handleDeleteJourney(definition)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
