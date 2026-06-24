import type { ExecutionHistoryTimelineProps } from '../../types/execution.types';
import { formatDate } from '../../lib/dateUtils';
import { Clock, ArrowRight } from 'lucide-react';

export function ExecutionHistoryTimeline({
  history,
  onLoadMore,
  hasMore,
  isLoading,
}: ExecutionHistoryTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Clock className="h-8 w-8 mb-2 opacity-50" />
        <p>Nenhuma transição registrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        {/* Timeline items */}
        <div className="space-y-4">
          {history.map((entry, index) => (
            <div key={entry.id || index} className="relative pl-10">
              {/* Timeline dot */}
              <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />

              <div className="p-4 border rounded-lg bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {entry.event?.type || 'Evento'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(entry.timestamp)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-0.5 bg-muted rounded text-muted-foreground">
                    {entry.fromState || 'Inicial'}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="px-2 py-0.5 bg-primary/10 rounded text-primary">
                    {entry.toState}
                  </span>
                </div>

                {entry.event?.data && Object.keys(entry.event.data).length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Dados do evento:</span>{' '}
                    <span className="font-mono">{JSON.stringify(entry.event.data)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-4 py-2 text-sm border rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Carregando...' : 'Carregar mais'}
          </button>
        </div>
      )}
    </div>
  );
}
