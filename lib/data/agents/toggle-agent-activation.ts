'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const toggleAgentActivation = async (agentId: string) => {
  const agent = await prisma.feeSenseAgent.findUnique({
    where: {
      id: agentId,
    },
  });

  if (!agent) {
    throw new Error('Agent not found');
  }

  await prisma.feeSenseAgent.update({
    where: {
      id: agentId,
    },
    data: {
      isActive: !agent.isActive,
    },
  });

  revalidatePath('/dashboard/agents');
};
