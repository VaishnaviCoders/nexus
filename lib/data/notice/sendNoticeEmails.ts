'use server';
import { Resend } from 'resend';
import { Knock } from '@knocklabs/node';
import { User } from '@clerk/nextjs/server';
import { NoticeEmailTemplate } from '@/components/email-templates/noticeMail';
import { OrganizationType, Prisma } from '@/lib/generated/prisma';
import { render, TailwindConfig } from '@react-email/components';

type NoticeWithOrg = Prisma.NoticeGetPayload<{
  include: {
    Organization: {
      select: {
        name: true;
        organizationSlug: true;
        organizationLogo: true;
        organizationType: true;
      };
    };
  };
}>;

export const sendNoticeEmails = async (
  notice: NoticeWithOrg,
  recipientEmails: string[],
  user: User
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const knock = new Knock(process.env.KNOCK_API_SECRET);

  const [knockResponse, resendResponse] = await Promise.all([
    knock.workflows.trigger('notice-created', {
      recipients: recipientEmails.map((email) => ({
        id: user.id,
        email,
        name: user.firstName || '',
      })),
      data: {
        title: notice.title,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName,
      },
    }),
    resend.emails.send({
      from: 'notices@shiksha.cloud',
      to: recipientEmails,
      subject: `Notice: ${notice.title}`,
      text: 'Hey',
    }),
  ]);
  console.log('Notifications sent:', { knockResponse, resendResponse });
};
