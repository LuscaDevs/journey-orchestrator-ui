import { useParams, useNavigate } from 'react-router-dom';
import { useJourneyInstanceDetails } from '../hooks/useJourneyInstanceDetails';
import { ExecutionInfoPanel } from '../components/execution/ExecutionInfoPanel';
import { ExecutionFlowViewer } from '../components/execution/ExecutionFlowViewer';
import { ExecutionHistoryTimeline } from '../components/execution/ExecutionHistoryTimeline';
import { ExecutionContextViewer } from '../components/execution/ExecutionContextViewer';
import { Loader2, ArrowLeft } from 'lucide-react';

export function JourneyInstanceDetailsPage() {
  const { instanceId } = useParams<{ instanceId: string }>();
  const navigate = useNavigate();
  const { data, loading, error, refetch, loadMoreHistory, hasMoreHistory, isLoadingMoreHistory } = useJourneyInstanceDetails(instanceId || '');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando detalhes da instância...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">Erro ao carregar instância</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4 mr-2 inline" />
            Voltar para Dashboard
          </button>
          <button
            onClick={refetch}
            className="px-4 py-2 border border-input rounded-md hover:bg-accent"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!data.instance) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Instância não encontrada</h2>
          <p className="text-muted-foreground mb-4">
            A instância solicitada não existe ou foi removida.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4 mr-2 inline" />
          Voltar para Dashboard
        </button>
      </div>
    );
  }

  if (!data.definition) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Definição da jornada não encontrada</h2>
          <p className="text-muted-foreground mb-4">
            A definição da jornada para esta instância não está disponível.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4 mr-2 inline" />
          Voltar para Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-accent rounded-md"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-semibold">Detalhes da Instância</h1>
      </div>

      {/* Placeholder for components to be added in later tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          {data.definition && (
            <ExecutionInfoPanel instance={data.instance} definition={data.definition} />
          )}
        </div>

        {data.definition && (
          <div className="lg:col-span-2 p-6 border rounded-lg bg-card">
            <h2 className="text-lg font-semibold mb-4">Visualização Gráfica</h2>
            <ExecutionFlowViewer
              definition={data.definition}
              executionNodeStates={data.executionNodeStates}
            />
          </div>
        )}

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-4">Histórico de Transições</h2>
          <ExecutionHistoryTimeline
            history={data.history}
            onLoadMore={loadMoreHistory}
            hasMore={hasMoreHistory}
            isLoading={isLoadingMoreHistory}
          />
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-4">Contexto da Execução</h2>
          <ExecutionContextViewer context={data.instance?.context || null} />
        </div>
      </div>
    </div>
  );
}
