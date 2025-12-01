'use server';
import { Knock } from '@knocklabs/node';
import { Prisma } from '@/generated/prisma/client';

type NoticeWithOrg = Prisma.NoticeGetPayload<{
  include: {
    organization: {
      select: {
        name: true;
        slug: true;
        logo: true;
        organizationType: true;
      };
    };
  };
}>;

interface NoticeUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  imageUrl: string;
  username: string | null;
}

export const sendPushNotice = async (
  notice: NoticeWithOrg,
  recipientEmails: string[],
  user: NoticeUser
) => {
  const knock = new Knock(process.env.KNOCK_API_SECRET);


  const knockResponse = await knock.workflows.trigger('notice-created', {
      recipients: recipientEmails.map((email) => ({
        id: user.id,
        email,
        name: user.firstName || '',
      })),
      data: {
        title: notice.title,
        email: user.email,
        name: user.firstName,
      },
    })
  console.log('Push Notifications sent:',  knockResponse,);

};
