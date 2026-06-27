import type { ExecutionInfoPanelProps } from '../../types/execution.types';
import { formatDate } from '../../lib/dateUtils';
import { StatusBadge } from '../ui/StatusBadge';

export function ExecutionInfoPanel({ instance, definition }: ExecutionInfoPanelProps) {
  if (!instance || !definition) {
    return null;
  }

  return (
    <div className="p-6 border rounded-lg bg-card space-y-4">
      <h2 className="text-lg font-semibold">Informações Gerais</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">ID da Instância</p>
          <p className="font-mono text-sm">{instance.instanceId || '-'}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Journey Definition</p>
          <p className="font-medium">{definition.name || definition.journeyCode || '-'}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Versão da Jornada</p>
          <p className="font-medium">{instance.version || definition.version || '-'}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Status</p>
          <StatusBadge status={instance.status} />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Estado Atual</p>
          <p className="font-medium">{instance.currentState || '-'}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Data de Início</p>
          <p className="font-medium">{formatDate(instance.createdAt)}</p>
        </div>

        <div className="space-y-1 md:col-span-2 lg:col-span-1">
          <p className="text-sm text-muted-foreground">Última Atualização</p>
          <p className="font-medium">{formatDate(instance.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
}
