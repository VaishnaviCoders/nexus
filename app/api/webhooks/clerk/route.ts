import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { Role } from '@/generated/prisma';

export async function GET(req: Request) {
  console.log('Webhook GET request received');
  return new Response('Webhook received successfully', { status: 200 });
}

function mapClerkRole(clerkRole: string): Role {
  const roleMap: Record<string, Role> = {
    'org:admin': 'ADMIN',
    'org:teacher': 'TEACHER',
    'org:student': 'STUDENT',
    'org:parent': 'PARENT',
  };

  return roleMap[clerkRole] || 'STUDENT';
}

export async function POST(req: Request) {
  console.log('🔄 Webhook POST request received');
  const CLERK_WEBHOOK_SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!CLERK_WEBHOOK_SIGNING_SECRET) {
    throw new Error(
      'Error: Please add CLERK_WEBHOOK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get body
  const payload: WebhookEvent = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;

  switch (eventType) {
    case 'organization.created':
      await prisma.organization.create({
        data: {
          id: evt.data.id,
          organizationSlug: evt.data.slug,
          name: evt.data.name,
          organizationLogo: evt.data.image_url,
          isActive: true,
          isPaid: false,
          createdAt: new Date(evt.data.created_at),
        },
      });
      break;

    case 'organization.updated':
      await prisma.organization.update({
        where: {
          id: evt.data.id,
        },
        data: {
          name: evt.data.name,
          organizationLogo: evt.data.image_url,
          isActive: true,
          isPaid: false,
          updatedAt: new Date(evt.data.updated_at),
        },
      });
      break;

    case 'organization.deleted':
      await prisma.organization.update({
        where: {
          id: evt.data.id,
        },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });
      break;

    case 'organizationMembership.created': {
      const clerkRole = evt.data.role;
      const mappedRole = mapClerkRole(clerkRole);

      await prisma.user.create({
        data: {
          clerkId: evt.data.public_user_data.user_id,
          id: evt.data.public_user_data.user_id,
          firstName: evt.data.public_user_data.first_name || '',
          lastName: evt.data.public_user_data.last_name || '',
          email: evt.data.public_user_data.identifier,
          profileImage: evt.data.public_user_data.image_url || '',
          organizationId: evt.data.organization.id,
          role: mappedRole,
          createdAt: new Date(evt.data.created_at), // Add membership creation date
          updatedAt: new Date(evt.data.updated_at),
        },
      });
      console.log(
        '✅ Membership created:',
        evt.data.public_user_data.user_id,
        'Role:',
        evt.data.role
      );
      break;
    }

    case 'organizationMembership.updated': {
      const clerkRole = evt.data.role;
      const mappedRole = mapClerkRole(clerkRole);

      await prisma.user.update({
        where: {
          id: evt.data.public_user_data.user_id,
        },
        data: {
          clerkId: evt.data.public_user_data.user_id,
          organizationId: evt.data.organization.id,
          role: mappedRole,
          firstName: evt.data.public_user_data.first_name || '',
          lastName: evt.data.public_user_data.last_name || '',
          email: evt.data.public_user_data.identifier,
          profileImage: evt.data.public_user_data.image_url || '',
          createdAt: new Date(evt.data.created_at),
          updatedAt: new Date(evt.data.updated_at),
        },
      });

      console.log(
        '✅ Membership updated:',
        evt.data.public_user_data.user_id,
        'New role:',
        mappedRole
      );
      break;
    }

    case 'user.created':
      await prisma.user.upsert({
        where: { email: evt.data.email_addresses[0].email_address }, // Use email as the unique identifier
        update: {
          clerkId: evt.data.id,
          firstName: evt.data.first_name || '',
          lastName: evt.data.last_name || '',
          profileImage: evt.data.image_url || '',
        },
        create: {
          id: evt.data.id,
          clerkId: evt.data.id,
          firstName: evt.data.first_name || '',
          lastName: evt.data.last_name || '',
          email: evt.data.email_addresses[0].email_address,
          profileImage: evt.data.image_url || '',
        },
      });
      break;

    case 'user.updated':
      await prisma.user.upsert({
        where: { email: evt.data.email_addresses[0].email_address }, // Use email as the unique identifier
        update: {
          clerkId: evt.data.id,
          firstName: evt.data.first_name || '',
          lastName: evt.data.last_name || '',
          profileImage: evt.data.image_url || '',
        },
        create: {
          id: evt.data.id,
          clerkId: evt.data.id,
          firstName: evt.data.first_name || '',
          lastName: evt.data.last_name || '',
          email: evt.data.email_addresses[0].email_address,
          profileImage: evt.data.image_url || '',
        },
      });
      break;
    default:
      break;
  }

  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log('Webhook payload:', body);

  return new Response('Webhook received successfully', { status: 200 });
}
