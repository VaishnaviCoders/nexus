import prisma from "@/lib/db";

export async function getBillingSummary(organizationId:string) {

    // const organizationId = await getOrganizationId()
  // 1. Calculate notification costs
  const notifications = await prisma.notificationLog.findMany({
    where: { organizationId, status: 'SENT' },
  });

  const channelSummary = notifications.reduce(
    (acc, n) => {
      const units = n.units || 0;
      const cost = n.cost || 0;

      switch (n.channel) {
        case 'EMAIL':
          acc.email.units += units;
          acc.email.cost += cost;
          break;
        case 'SMS':
          acc.sms.units += units;
          acc.sms.cost += cost;
          break;
        case 'WHATSAPP':
          acc.whatsapp.units += units;
          acc.whatsapp.cost += cost;
          break;
        case 'PUSH':
          acc.push.units += units;
          acc.push.cost += cost;
          break;
      }
      return acc;
    },
    {
      email: { units: 0, cost: 0 },
      sms: { units: 0, cost: 0 },
      whatsapp: { units: 0, cost: 0 },
      push: { units: 0, cost: 0 },
    }
  );

  // 2. Calculate storage used (documents + notice attachments)
  const documents = await prisma.studentDocument.findMany({
    where: { organizationId },
    select: { fileSize: true },
  });

  const notices = await prisma.notice.findMany({
    where: { organizationId },
    select: {
      attachments: { select: { fileSize: true } },
    },
  });

  const totalDocSize = documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
  const totalNoticeSize = notices.reduce(
    (sum, notice) =>
      sum + (notice.attachments?.reduce((attSum, a) => attSum + (a.fileSize || 0), 0) || 0),
    0
  );

  const totalStorageMB = (totalDocSize + totalNoticeSize) / (1024 * 1024);

  // 3. Combine billing info
  const billingSummary = {
    channelSummary,
    totalStorageMB: totalStorageMB.toFixed(2),
    totalCost:
      channelSummary.email.cost +
      channelSummary.sms.cost +
      channelSummary.whatsapp.cost +
      channelSummary.push.cost,
  };

  return billingSummary;
}