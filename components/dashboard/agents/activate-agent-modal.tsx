'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { FeeSenseAgent } from '@/generated/prisma/client';
import { toggleAgentActivation } from '@/lib/data/agents/toggle-agent-activation';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface ActivationModalProps {
  agent: FeeSenseAgent;
}

export function ActivationModal({ agent }: ActivationModalProps) {
  const [isPending, startTransition] = useTransition();
  // local state so UI can reflect the change immediately after toggle
  const [isActive, setIsActive] = useState<boolean>(!!agent.isActive);

  const onSubmit = () => {
    // optimistic UX but only flip after success
    startTransition(() => {
      toggleAgentActivation(agent.id)
        .then(() => {
          // toggle local state to reflect backend change
          setIsActive((prev) => {
            const newState = !prev;
            if (newState) {
              toast.success('Agent activated!', {
                description: `The agent "${agent.name}" has been activated.`,
              });
            } else {
              toast.info('Agent deactivated!', {
                description: `The agent "${agent.name}" has been deactivated.`,
              });
            }
            return newState;
          });
        })
        .catch((error) => {
          console.error('Failed to toggle agent activation:', error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred';
          toast.error('Something went wrong', {
            description: errorMessage || 'Please try again later.',
          });
        });
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full">
      {/* Content */}
      <div className="p-6 space-y-5">
        {/* Agent Name */}
        <div>
          <h3 className="font-medium text-foreground mb-1">{agent.name}</h3>
          {agent.description && (
            <p className="text-sm text-muted-foreground">{agent.description}</p>
          )}
        </div>

        {/* Capabilities */}
        {agent.capabilities && agent.capabilities.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              What this agent does
            </p>
            <ul className="space-y-2">
              {agent.capabilities.map((capability, index) => (
                <li key={index} className="flex gap-2 items-start">
                  {isActive ? (
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-sm text-foreground">{capability}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Info Box */}
        <div
          className={`border rounded p-3 ${isActive ? 'text-blue-500 bg-blue-50 border-blue-200 ' : 'text-amber-500 bg-amber-50 border-amber-200'}`}
        >
          {isActive ? (
            <p className="text-xs">
              This agent is currently active. Deactivating will stop its
              scheduled runs and notifications.
            </p>
          ) : (
            <p className="text-xs">
              This agent is currently inactive. Activating will enable scheduled
              runs and notifications.
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 p-6 border-t border-border/50">
        <DialogClose asChild>
          <Button id="close-activation-dialog" variant="outline">
            Cancel
          </Button>
        </DialogClose>

        <Button
          onClick={onSubmit}
          className={`flex-1 ${
            isActive
              ? 'bg-destructive hover:bg-destructive/90'
              : 'bg-primary hover:bg-primary/90'
          }`}
          disabled={isPending}
        >
          {isPending
            ? isActive
              ? 'Deactivating...'
              : 'Activating...'
            : isActive
              ? 'Deactivate'
              : 'Activate'}
        </Button>
      </div>
    </div>
  );
}
