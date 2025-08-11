'use server';
import { Resend } from 'resend';
import { Knock } from '@knocklabs/node';
import { User } from '@clerk/nextjs/server';

import { render } from '@react-email/render';
import { Prisma } from '@/generated/prisma/client';
import NoticeEmailTemplate from '@/components/email-templates/noticeMail';

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

  // Create props object once
  const emailProps = {
    content: notice.content ?? '',
    startDate: notice.startDate ?? new Date(),
    endDate: notice.endDate ?? new Date(),
    noticeType: notice.noticeType ?? 'announcement',
    organizationImage:
      notice.Organization.organizationLogo ??
      'https://brandfetch.com/clerk.com?view=library&library=default&collection=logos&asset=idOESnvCPd&utm_source=https%253A%252F%252Fbrandfetch.com%252Fclerk.com&utm_medium=copyAction&utm_campaign=brandPageReferral',
    organizationName: notice.Organization.name ?? 'Unknown Organization',
    publishedBy: `${user.firstName} ${user.lastName}` || 'System',
    targetAudience: notice.targetAudience ?? [],
    title: notice.title ?? 'Untitled Notice',
    noticeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/notices/${notice.id}`,
  };

  // Render email to HTML
  const emailHtml = await render(NoticeEmailTemplate(emailProps));

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
      from: 'no-reply@shiksha.cloud',
      to: recipientEmails,
      subject: `Notice: ${notice.title}`,
      html: emailHtml,
    }),
  ]);

  console.log('Notifications sent:', { knockResponse, resendResponse });
};
