import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { Role } from '@prisma/client';

export async function GET(req: Request) {
  console.log('Webhook GET request received');
  return new Response('Webhook received successfully', { status: 200 });
}

export async function POST(req: Request) {
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
  const payload = await req.json();
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

  if (eventType === 'organization.created') {
    await prisma.organization.create({
      data: {
        organizationSlug: evt.data.slug,
        name: evt.data.name,
        organizationLogo: evt.data.image_url,
        isActive: true,
        isPaid: false,
        createdAt: new Date(evt.data.created_at),
      },
    });
  }

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const {
      first_name,
      last_name,
      created_at,
      updated_at,
      id,
      email_addresses,
      image_url,
      public_metadata,
    } = evt.data;

    const roleFromMetadata = (public_metadata.role as Role) || 'STUDENT';

    // Check if the first organization exists
    let organization = await prisma.organization.findFirst();

    // If no organization exists, create the first organization
    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: 'First Organization', // Set a default name or use metadata
          organizationSlug: 'first-organization',
          organizationLogo: null, // Set a default logo if needed
          isActive: true,
          isPaid: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    const userData = await prisma.user.upsert({
      where: { id: id },
      update: {
        role: roleFromMetadata,
        organizationId: organization.id,
      },
      create: {
        firstName: first_name || '',
        lastName: last_name || '',
        email: email_addresses[0].email_address,
        profileImage: image_url,
        id: id,
        role: roleFromMetadata,
        createdAt: new Date(created_at),
        updatedAt: new Date(updated_at),
        clerkId: id,
        organizationId: organization.id,
      },
    });
    console.log('user Updated or Created in DB', userData);
  }

  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log('Webhook payload:', body);

  return new Response('Webhook received successfully', { status: 200 });
}
