import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import React from 'react';
import {
  Plus,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import AgentCard from '@/components/dashboard/agents/agent-card';
// import { runFeeSenseAgent } from '@/lib/ai-agents/FeeSenseAgent';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const page = async () => {
  const organizationId = await getOrganizationId();
  const agents = await prisma.feeSenseAgent.findMany({
    where: {
      organizationId,
    },
  });
  const activeAgents = agents.filter((agent) => agent.isActive);
  const successRate =
    agents.filter((agent) => agent.lastRunAt).length / agents.length;

  // const data = await runFeeSenseAgent(organizationId);
  // console.log(data);

  // const enabledResult = await feeSenseAgent.generate({
  //   prompt: `fetch data feeSenseAgent for this organization : ${organizationId}`,
  // });

  // console.log('Agent Enabled Check:', enabledResult.content);

  return (
    <div className="px-2 space-y-4">
      {/* Header */}
      <Card className="py-4 px-2 flex items-center justify-between   ">
        <div>
          <CardTitle className="text-lg">AI Agents</CardTitle>
          <CardDescription className="text-sm">
            Manage and monitor your AI agents in real-time
          </CardDescription>
        </div>
        <Button className="gap-2">Request Agent</Button>
      </Card>

      {/* Stats Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Total Agents', value: agents.length, icon: Activity },
              {
                label: 'Active',
                value: activeAgents.length,
                icon: CheckCircle2,
              },
              {
                label: 'Success Rate',
                value: `${successRate * 100}%`,
                icon: TrendingUp,
              },
              { label: 'Last 24h Runs', value: '847', icon: AlertCircle },
            ].map((stat, idx) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <stat.icon className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agents Grid */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent, idx) => (
          <div key={agent.id}>
            <AgentCard agent={agent} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
