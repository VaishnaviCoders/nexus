import AgentDetailView from '@/components/dashboard/agents/fee-sense-agent-detail-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { notFound } from 'next/navigation';
import FeeSenseAgentLogs from '@/components/dashboard/agents/fee-sense-log';
import FeeSenseAgentReports from '@/components/dashboard/agents/fee-sense-reports';

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;

  const organizationId = await getOrganizationId();

  const agent = await prisma.feeSenseAgent.findUnique({
    where: {
      id: agentId,
      organizationId,
    },
  });

  const executionLogs = await prisma.feeSenseExecutionLog.findMany({
    where: {
      agentId,
    },
  });

  const reports = await prisma.feeSenseReport.findMany({
    where: {
      agentId,
    },
  });

  if (!agent) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <AgentDetailView agent={agent} />
        </TabsContent>
        <TabsContent value="logs">
          <FeeSenseAgentLogs executionLogs={executionLogs} />
        </TabsContent>
        <TabsContent value="reports">
          <FeeSenseAgentReports reports={reports} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
