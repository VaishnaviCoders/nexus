PrismaClientInitializationError: Engine is not yet connected.

Root Technical Issue
Prisma Client relies on a long-lived TCP connection (via its internal query engine) to PostgreSQL.

In your environment (Next.js 15 App Router + multi-tenant + likely Supabase/Neon), one or more of these events is breaking that connection before a query is executed:

Process restarts / hot reload

Next.js in dev mode reloads server code on each save, instantiating new PrismaClient objects before the old connection fully initializes or closes.

This can leave the query engine in a DISCONNECTED state when the next query runs.

Database idle connection termination

Providers like Supabase/Neon automatically kill idle connections (5–15 min typical).

The Prisma engine doesn't attempt an implicit reconnect before the next query, so the first request after idle time fails.

Serverless / cold starts

In Vercel/Netlify serverless runtimes, each invocation may start a fresh Node.js instance.

If the query executes before the Prisma engine finishes starting, you get Engine is not yet connected.

Middleware query timing (multi-tenant)

If your prisma.$use() runs a query immediately on client initialization (e.g., to inject organizationId), it may fire before the engine handshake completes, causing the failure.

import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
console.warn('🔄 Initializing new PrismaClient...');
return new PrismaClient({
log:
process.env.NODE_ENV === 'production'
? ['error']
: ['query', 'warn', 'error'],
});
}

let prismaClient = globalForPrisma.prisma || createPrismaClient();

const prisma = new Proxy(prismaClient, {
get(target, prop: keyof PrismaClient) {
const orig = target[prop];
if (typeof orig === 'function') {
return async (...args: any[]) => {
try {
return await (orig as Function).apply(target, args);
} catch (err: any) {
if (err.message?.includes('Engine is not yet connected')) {
prismaClient = createPrismaClient();
return (prismaClient as any)[prop](...args);
}
throw err;
}
};
}
return orig;
},
});

if (process.env.NODE_ENV !== 'production') {
globalForPrisma.prisma = prismaClient;
}

export default prisma;
