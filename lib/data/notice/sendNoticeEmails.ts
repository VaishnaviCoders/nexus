'use server';
import { Resend } from 'resend';
import { Knock } from '@knocklabs/node';
import { User } from '@clerk/nextjs/server';
import { NoticeEmailTemplate } from '@/components/email-templates/noticeMail';
import { render } from '@react-email/render';
import { ReactElement } from 'react';
import { Prisma } from '@/app/generated/prisma/client';

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

  // Ensure all required props are provided and typed correctly
  const emailProps = {
    content: notice.content ?? '', // Provide default for nullable fields
    endDate: notice.endDate ?? new Date(), // Provide default
    noticeType: notice.noticeType ?? 'announcement', // Provide default
    organizationImage:
      notice.Organization.organizationLogo ??
      'https://brandfetch.com/clerk.com?view=library&library=default&collection=logos&asset=idOESnvCPd&utm_source=https%253A%252F%252Fbrandfetch.com%252Fclerk.com&utm_medium=copyAction&utm_campaign=brandPageReferral', // Fallback image
    organizationName: notice.Organization.name ?? 'Unknown Organization', // Provide default
    publishedBy: user.firstName ?? 'Unknown', // Provide default
    startDate: notice.startDate ?? new Date(), // Provide default
    targetAudience: notice.targetAudience ?? [], // Provide default
    title: notice.title ?? 'Untitled Notice', // Provide default
    noticeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/notices/${notice.id}`, // Ensure this is always defined
  };

  const emailComponent = NoticeEmailTemplate(emailProps) as ReactElement;

  const emailHtml = await render(emailComponent);

  // const html = await pretty(await render(<NoticeEmailTemplate />));

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
      react: emailHtml,
    }),
  ]);

  console.log('Notifications sent:', { knockResponse, resendResponse });
};
