import { useState } from 'react';
import type { ExecutionContextViewerProps } from '../../types/execution.types';
import { Copy, Check, Database } from 'lucide-react';

export function ExecutionContextViewer({ context }: ExecutionContextViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!context) return;
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(context, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!context || Object.keys(context).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Database className="h-8 w-8 mb-2 opacity-50" />
        <p>Nenhum contexto de execução disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {Object.keys(context).length} variável(eis)
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md hover:bg-accent transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copiar
            </>
          )}
        </button>
      </div>

      <div className="relative">
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono">
          <code>{JSON.stringify(context, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}
