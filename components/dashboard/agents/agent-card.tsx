import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { ActivationModal } from '@/components/dashboard/agents/activate-agent-modal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FeeSenseAgent } from '@/generated/prisma/client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ConfigureAgentSheet from './configure-agent-sheet';

interface AgentCardProps {
  agent: FeeSenseAgent;
}

const getSuccessRate = (total: number, successful: number) => {
  if (total === 0) return 0;
  return Math.round((successful / total) * 100);
};

export default function AgentCard({ agent }: AgentCardProps) {
  const successRate = getSuccessRate(agent.totalRuns, agent.successfulRuns);

  return (
    <Card className="group relative overflow-hidden border border-border bg-card hover:border-border/80 transition-all duration-200">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-medium text-foreground truncate">
              {agent.name}
            </h2>
            {agent.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {agent.description}
              </p>
            )}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Switch
                  checked={agent.isActive}
                  aria-label={`Toggle ${agent.name} agent`}
                />
                <span className="text-xs text-muted-foreground select-none">
                  {agent.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {agent.isActive ? 'Deactivate' : 'Activate'} Agent
                </DialogTitle>
                <DialogDescription>
                  {agent.name} will be{' '}
                  {agent.isActive ? 'deactivated and stop' : 'activated and'}{' '}
                  run automatically according to its schedule and send
                  notifications accordingly.
                </DialogDescription>
              </DialogHeader>
              <ActivationModal agent={agent} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-3 gap-3 py-3 border-t border-b border-border/50">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
            <p className="text-sm font-semibold text-foreground">
              {successRate}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Failed Runs</p>
            <p className="text-sm font-semibold text-foreground">
              {agent.failedRuns}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Frequency</p>
            <p className="text-sm font-semibold text-foreground capitalize">
              {agent.runFrequency?.toLowerCase() || '—'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Settings className="w-4 h-4" />
              Configure
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full overflow-y-auto sm:max-w-lg p-2"
          >
            <SheetHeader className="p-2">
              <SheetTitle>Configure {agent.name}</SheetTitle>
              <SheetDescription>
                Customize how this agent operates
              </SheetDescription>
            </SheetHeader>

            <ConfigureAgentSheet agent={agent} />
          </SheetContent>
        </Sheet>
      </div>
    </Card>
  );
}
