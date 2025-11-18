// FeeSense AI Agent - Proper AI SDK Agent Implementation
// Uses AI Agent to orchestrate workflow intelligently

// Rules : Runs only on schedule time || Daily

import prisma from '@/lib/db';
import { Experimental_Agent as Agent, stepCountIs, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { NotificationStatus, PaymentStatus } from '@/generated/prisma/enums';

// ============================================================================
// Types & Schemas
// ============================================================================

const analysisSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  riskScore: z.number(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  paymentPattern: z.enum([
    'REGULAR',
    'IRREGULAR',
    'NEVER_PAID',
    'PARTIAL_PAYER',
  ]),
  sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'CRITICAL']),
  problems: z.array(z.string()),
  recommendedChannel: z.enum(['EMAIL', 'SMS', 'WHATSAPP', 'VOICE_CALL']),
  notificationAttempts: z.number(),
  daysSinceLastPayment: z.number(),
  pendingAmount: z.number(),
  daysOverdue: z.number(),
});

interface PaymentRecord {
  id: string;
  amount: number;
  paymentDate: Date;
  status: string;
  method: string;
}

interface NotificationRecord {
  id: string;
  channel: string;
  status: string;
  sentAt: Date;
  type: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function calculateDaysOverdue(dueDate: Date): number {
  const now = new Date();
  const diff = now.getTime() - dueDate.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function calculateDaysSinceLastPayment(payments: PaymentRecord[]): number {
  if (payments.length === 0) return 999;
  const lastPayment = payments[0].paymentDate;
  return Math.floor(
    (Date.now() - lastPayment.getTime()) / (1000 * 60 * 60 * 24)
  );
}

function detectPaymentPattern(
  payments: PaymentRecord[]
): 'REGULAR' | 'IRREGULAR' | 'NEVER_PAID' | 'PARTIAL_PAYER' {
  if (payments.length === 0) return 'NEVER_PAID';
  if (payments.length === 1) return 'PARTIAL_PAYER';

  const gaps: number[] = [];
  for (let i = 0; i < payments.length - 1; i++) {
    const diff = Math.abs(
      payments[i].paymentDate.getTime() - payments[i + 1].paymentDate.getTime()
    );
    gaps.push(diff / (1000 * 60 * 60 * 24));
  }

  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const variance =
    gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length;

  return variance < 100 ? 'REGULAR' : 'IRREGULAR';
}

function calculateRiskScore(
  pattern: string,
  daysOverdue: number,
  attempts: number,
  pendingAmount: number,
  totalFee: number
): number {
  let score = 0;

  if (pattern === 'NEVER_PAID') score += 30;
  else if (pattern === 'IRREGULAR') score += 20;
  else if (pattern === 'PARTIAL_PAYER') score += 10;

  score += Math.min(40, daysOverdue / 3);
  score += Math.min(20, attempts * 5);

  const pendingRatio = pendingAmount / totalFee;
  score += pendingRatio * 10;

  return Math.min(100, Math.round(score));
}

function mapChannelToEnum(
  channel: string
): 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' {
  const map: Record<string, 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH'> = {
    EMAIL: 'EMAIL',
    SMS: 'SMS',
    WHATSAPP: 'WHATSAPP',
    VOICE_CALL: 'PUSH',
  };
  return map[channel] || 'EMAIL';
}

// ============================================================================
// Agent Tools
// ============================================================================

const checkAgentEnabled = tool({
  name: 'checkAgentEnabled',
  description:
    'Check if FeeSense agent is enabled and get configuration. ALWAYS call this FIRST.',
  inputSchema: z.object({
    organizationId: z.string().describe('Organization ID to check'),
  }),
  execute: async ({ organizationId }: { organizationId: string }) => {
    console.log('🔍 [TOOL] checkAgentEnabled - START');
    console.log('   organizationId:', organizationId);

    const agent = await prisma.feeSenseAgent.findUnique({
      where: { organizationId },
    });

    console.log('   Agent found:', agent ? 'YES' : 'NO');
    console.log('   Agent active:', agent?.isActive);

    if (!agent || !agent.isActive) {
      console.log('❌ [TOOL] checkAgentEnabled - Agent NOT enabled');
      return {
        enabled: false,
        message: 'FeeSense agent is not active for this organization',
        shouldContinue: false,
      };
    }

    const result = {
      enabled: true,
      shouldContinue: true,
      config: {
        riskScoreLowThreshold: agent.riskScoreLowThreshold,
        riskScoreMediumThreshold: agent.riskScoreMediumThreshold,
        riskScoreHighThreshold: agent.riskScoreHighThreshold,
        maxNotificationAttempts: agent.maxNotificationAttempts,
        voiceCallThreshold: agent.voiceCallThreshold,
        enableEmailReminders: agent.enableEmailReminders,
        enableSMSReminders: agent.enableSMSReminders,
        enableVoiceCalls: agent.enableVoiceCalls,
        enableWhatsApp: agent.enableWhatsApp,
        notificationCooldownHours: 24,
      },
    };

    console.log('✅ [TOOL] checkAgentEnabled - SUCCESS');
    console.log('   Config:', JSON.stringify(result.config, null, 2));
    return result;
  },
});

const fetchOverdueFees = tool({
  name: 'fetchOverdueFees',
  description:
    'Fetch all overdue and unpaid fees with student and parent information. Call this AFTER checking agent is enabled.',
  inputSchema: z.object({
    organizationId: z.string().describe('Organization ID'),
  }),
  execute: async ({ organizationId }: { organizationId: string }) => {
    console.log('🔍 [TOOL] fetchOverdueFees - START');
    console.log('   organizationId:', organizationId);

    const fees = await prisma.fee.findMany({
      where: {
        organizationId,
        status: { in: ['UNPAID', 'OVERDUE'] },
        pendingAmount: { gt: 0 },
      },
      include: {
        student: {
          include: {
            user: true,
            parents: {
              where: { isPrimary: true },
              include: {
                parent: { include: { user: true } },
              },
              take: 1,
            },
          },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
          take: 10,
        },
      },
    });

    console.log('   Fees found:', fees.length);

    if (fees.length === 0) {
      console.log('⚠️  [TOOL] fetchOverdueFees - No overdue fees');
      return {
        count: 0,
        totalOverdue: 0,
        students: [],
        message: 'No overdue fees found',
        shouldContinue: false,
      };
    }

    const studentFeeData = [];

    for (const fee of fees) {
      const notifications = await prisma.notificationLog.findMany({
        where: {
          organizationId,
          studentId: fee.studentId,
          notificationType: 'FEE_REMINDER',
          sentAt: { gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        },
        orderBy: { sentAt: 'desc' },
      });

      const primaryParent = fee.student.parents[0]?.parent;
      const daysOverdue = calculateDaysOverdue(fee.dueDate);

      // Check if notification was sent recently (cooldown)
      const lastNotification = notifications.find(
        (n) => n.status === 'SENT' || n.status === 'DELIVERED'
      );
      const hoursSinceLastNotification = lastNotification
        ? (Date.now() - lastNotification.sentAt.getTime()) / (1000 * 60 * 60)
        : 999;

      studentFeeData.push({
        studentId: fee.student.id,
        studentName: `${fee.student.firstName} ${fee.student.lastName}`,
        studentEmail: fee.student.email,
        studentPhone: fee.student.phoneNumber,
        parentId: primaryParent?.userId || fee.student.userId,
        parentName: primaryParent
          ? `${primaryParent.firstName} ${primaryParent.lastName}`
          : 'N/A',
        parentEmail: primaryParent?.email || '',
        parentPhone: primaryParent?.phoneNumber || '',
        feeId: fee.id,
        totalFee: fee.totalFee,
        paidAmount: fee.paidAmount,
        pendingAmount: fee.pendingAmount || 0,
        dueDate: fee.dueDate.toISOString(),
        status: fee.status,
        daysOverdue,
        hoursSinceLastNotification: Math.round(hoursSinceLastNotification),
        paymentHistory: fee.payments.map((p) => ({
          id: p.id,
          amount: p.amount,
          paymentDate: p.paymentDate.toISOString(),
          status: p.status,
          method: p.paymentMethod,
        })),
        notificationHistory: notifications.map((n) => ({
          id: n.id,
          channel: n.channel,
          status: n.status,
          sentAt: n.sentAt.toISOString(),
          type: n.notificationType,
        })),
      });
    }

    const result = {
      count: studentFeeData.length,
      totalOverdue: studentFeeData.reduce((sum, s) => sum + s.pendingAmount, 0),
      students: studentFeeData,
      shouldContinue: true,
      message: `Found ${studentFeeData.length} students with overdue fees`,
    };

    console.log('✅ [TOOL] fetchOverdueFees - SUCCESS');
    console.log('   Students:', result.count);
    console.log('   Total Overdue:', result.totalOverdue);
    console.log(
      '   Sample:',
      studentFeeData.slice(0, 2).map((s) => s.studentName)
    );

    return result;
  },
});

const analyzeAndProcessStudent = tool({
  name: 'analyzeAndProcessStudent',
  description:
    'Analyze a single student, generate personalized message, and send notification. Call this for EACH student individually.',
  inputSchema: z.object({
    organizationId: z.string(),
    studentData: z.object({
      studentId: z.string(),
      studentName: z.string(),
      studentEmail: z.string(),
      parentId: z.string(),
      parentPhone: z.string(),
      parentEmail: z.string(),
      feeId: z.string(),
      pendingAmount: z.number(),
      totalFee: z.number(),
      daysOverdue: z.number(),
      dueDate: z.string(),
      hoursSinceLastNotification: z.number(),
      paymentHistory: z.array(
        z.object({
          id: z.string(),
          amount: z.number(),
          paymentDate: z.string(),
          status: z.string(),
          method: z.string(),
        })
      ),
      notificationHistory: z.array(
        z.object({
          id: z.string(),
          channel: z.string(),
          status: z.string(),
          sentAt: z.string(),
          type: z.string(),
        })
      ),
    }),
    agentConfig: z.object({
      riskScoreLowThreshold: z.number(),
      riskScoreMediumThreshold: z.number(),
      riskScoreHighThreshold: z.number(),
      maxNotificationAttempts: z.number(),
      notificationCooldownHours: z.number(),
      enableEmailReminders: z.boolean(),
      enableSMSReminders: z.boolean(),
      enableWhatsApp: z.boolean(),
      enableVoiceCalls: z.boolean(),
    }),
  }),
  execute: async ({ organizationId, studentData, agentConfig }) => {
    console.log('🔍 [TOOL] analyzeAndProcessStudent - START');
    console.log('   Student:', studentData.studentName);
    console.log('   Pending:', studentData.pendingAmount);
    console.log('   Days Overdue:', studentData.daysOverdue);
    console.log(
      '   Hours Since Last Notification:',
      studentData.hoursSinceLastNotification
    );

    // Check cooldown
    if (
      studentData.hoursSinceLastNotification <
      agentConfig.notificationCooldownHours
    ) {
      console.log('⏭️  [TOOL] analyzeAndProcessStudent - SKIPPED (cooldown)');
      return {
        success: false,
        skipped: true,
        reason: `Cooldown active (${studentData.hoursSinceLastNotification}h since last notification)`,
        studentName: studentData.studentName,
      };
    }

    // Analyze risk
    const paymentPattern = detectPaymentPattern(
      studentData.paymentHistory.map((p: any) => ({
        ...p,
        paymentDate: new Date(p.paymentDate),
      }))
    );

    const daysSinceLastPayment = calculateDaysSinceLastPayment(
      studentData.paymentHistory.map((p: any) => ({
        ...p,
        paymentDate: new Date(p.paymentDate),
      }))
    );

    const notificationAttempts = studentData.notificationHistory.filter(
      (n) => n.status === 'SENT' || n.status === 'DELIVERED'
    ).length;

    const riskScore = calculateRiskScore(
      paymentPattern,
      studentData.daysOverdue,
      notificationAttempts,
      studentData.pendingAmount,
      studentData.totalFee
    );

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (riskScore < agentConfig.riskScoreLowThreshold) riskLevel = 'LOW';
    else if (riskScore < agentConfig.riskScoreMediumThreshold)
      riskLevel = 'MEDIUM';
    else if (riskScore < agentConfig.riskScoreHighThreshold) riskLevel = 'HIGH';
    else riskLevel = 'CRITICAL';

    let sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'CRITICAL';
    if (paymentPattern === 'REGULAR' && daysSinceLastPayment < 30)
      sentiment = 'POSITIVE';
    else if (paymentPattern === 'NEVER_PAID' || daysSinceLastPayment > 90)
      sentiment = 'CRITICAL';
    else if (notificationAttempts >= 3 && daysSinceLastPayment > 60)
      sentiment = 'NEGATIVE';
    else sentiment = 'NEUTRAL';

    const problems: string[] = [];
    if (paymentPattern === 'NEVER_PAID')
      problems.push('No payment history found');
    if (notificationAttempts >= 3)
      problems.push(`${notificationAttempts} reminders sent without response`);
    if (studentData.daysOverdue > 30)
      problems.push(`Fee overdue by ${studentData.daysOverdue} days`);
    if (studentData.paymentHistory.some((p) => p.status === 'FAILED'))
      problems.push('Previous payment attempts failed');
    if (!studentData.parentPhone && !studentData.parentEmail)
      problems.push('Missing parent contact information');

    console.log('   Risk Analysis:');
    console.log('     Pattern:', paymentPattern);
    console.log('     Risk Score:', riskScore);
    console.log('     Risk Level:', riskLevel);
    console.log('     Sentiment:', sentiment);
    console.log('     Problems:', problems);

    // Determine channel
    let recommendedChannel: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'VOICE_CALL';
    if (
      notificationAttempts >= agentConfig.maxNotificationAttempts &&
      agentConfig.enableVoiceCalls
    ) {
      recommendedChannel = 'VOICE_CALL';
    } else if (riskScore >= agentConfig.riskScoreHighThreshold) {
      recommendedChannel = agentConfig.enableWhatsApp ? 'WHATSAPP' : 'SMS';
    } else if (riskScore >= agentConfig.riskScoreMediumThreshold) {
      recommendedChannel = agentConfig.enableSMSReminders ? 'SMS' : 'EMAIL';
    } else {
      recommendedChannel = agentConfig.enableEmailReminders ? 'EMAIL' : 'SMS';
    }

    console.log('   Recommended Channel:', recommendedChannel);

    const analysis = {
      studentId: studentData.studentId,
      studentName: studentData.studentName,
      riskScore,
      riskLevel,
      paymentPattern,
      sentiment,
      problems,
      recommendedChannel,
      notificationAttempts,
      daysSinceLastPayment,
      pendingAmount: studentData.pendingAmount,
      daysOverdue: studentData.daysOverdue,
    };

    // Generate message
    const urgency = riskLevel === 'CRITICAL' ? 'URGENT: ' : '';
    const message = `${urgency}Dear Parent of ${studentData.studentName},

This is a reminder that a fee payment of ₹${studentData.pendingAmount} is pending (Due: ${new Date(studentData.dueDate).toLocaleDateString()}).

${studentData.daysOverdue > 0 ? `The payment is overdue by ${studentData.daysOverdue} days. ` : ''}Please clear the dues at your earliest convenience.

${problems.length > 0 ? `Note: ${problems.join(', ')}\n\n` : ''}For any assistance, please contact the school office.

Thank you.`;

    console.log('   Message Generated (length):', message.length);

    // Send notification
    if (recommendedChannel === 'VOICE_CALL') {
      const scheduledTime = new Date(Date.now() + 3 * 60 * 60 * 1000);

      await prisma.scheduledJob.create({
        data: {
          organizationId,
          type: 'FEE_REMINDER',
          scheduledAt: scheduledTime,
          channels: ['WHATSAPP'],
          status: 'PENDING',
          data: {
            studentId: studentData.studentId,
            parentId: studentData.parentId,
            feeId: studentData.feeId,
            phoneNumber: studentData.parentPhone,
            callSummary: `Voice call needed for ${studentData.studentName}`,
            riskAnalysis: analysis,
            message,
          },
        },
      });

      console.log('📞 [TOOL] analyzeAndProcessStudent - VOICE CALL SCHEDULED');
      return {
        success: true,
        action: 'SCHEDULED_CALL',
        channel: 'VOICE_CALL',
        studentName: studentData.studentName,
        analysis,
      };
    }

    if (!studentData.parentId) {
      console.log('❌ [TOOL] analyzeAndProcessStudent - NO PARENT ID');
      return {
        success: false,
        error: 'No valid parent ID',
        studentName: studentData.studentName,
        analysis,
      };
    }

    const notification = await prisma.notificationLog.create({
      data: {
        organizationId,
        userId: studentData.parentId,
        studentId: studentData.studentId,
        channel: mapChannelToEnum(recommendedChannel),
        status: 'SENT',
        notificationType: 'FEE_REMINDER',
        sentAt: new Date(),
        retryCount: 0,
        maxRetries: 3,
      },
    });

    console.log(
      `✅ [TOOL] analyzeAndProcessStudent - ${recommendedChannel} SENT`
    );
    console.log('   Notification ID:', notification.id);

    return {
      success: true,
      action: 'SENT',
      channel: recommendedChannel,
      notificationId: notification.id,
      studentName: studentData.studentName,
      analysis,
    };
  },
});

const generateDailyReport = tool({
  name: 'generateDailyReport',
  description:
    'Generate comprehensive daily report with all analyses and metrics. Call this AFTER processing all students.',
  inputSchema: z.object({
    organizationId: z.string(),
    analyses: z.array(analysisSchema),
    totalStudents: z.number(),
    emailsSent: z.number(),
    smsSent: z.number(),
    whatsAppSent: z.number(),
    voiceCallsScheduled: z.number(),
    skipped: z.number(),
    errors: z.number(),
    totalOverdue: z.number(),
  }),
  execute: async ({
    organizationId,
    analyses,
    totalStudents,
    emailsSent,
    smsSent,
    whatsAppSent,
    voiceCallsScheduled,
    skipped,
    errors,
    totalOverdue,
  }) => {
    console.log('🔍 [TOOL] generateDailyReport - START');
    console.log('   Total Students:', totalStudents);
    console.log('   Analyses:', analyses.length);
    console.log('   Emails Sent:', emailsSent);
    console.log('   SMS Sent:', smsSent);
    console.log('   WhatsApp Sent:', whatsAppSent);
    console.log('   Voice Calls Scheduled:', voiceCallsScheduled);
    console.log('   Skipped:', skipped);
    console.log('   Errors:', errors);
    console.log('   Total Overdue:', totalOverdue);

    const agent = await prisma.feeSenseAgent.findUnique({
      where: { organizationId },
    });

    if (!agent) {
      console.log('❌ [TOOL] generateDailyReport - Agent not found');
      return { success: false, error: 'Agent not found' };
    }

    const riskCounts = {
      LOW: analyses.filter((a) => a.riskLevel === 'LOW').length,
      MEDIUM: analyses.filter((a) => a.riskLevel === 'MEDIUM').length,
      HIGH: analyses.filter((a) => a.riskLevel === 'HIGH').length,
      CRITICAL: analyses.filter((a) => a.riskLevel === 'CRITICAL').length,
    };

    console.log('   Risk Distribution:', riskCounts);

    const topRisk = analyses
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10)
      .map((a) => ({
        studentId: a.studentId,
        studentName: a.studentName,
        riskScore: a.riskScore,
        riskLevel: a.riskLevel,
        pendingAmount: a.pendingAmount,
        issue: a.problems[0] || 'No specific issue',
      }));

    const trends: string[] = [];
    const recommendations: string[] = [];

    const neverPaidCount = analyses.filter(
      (a) => a.paymentPattern === 'NEVER_PAID'
    ).length;
    if (neverPaidCount > 0) {
      trends.push(`${neverPaidCount} students have never made a payment`);
      recommendations.push(
        'Schedule personal meetings with never-paid parents'
      );
    }

    if (riskCounts.CRITICAL > 0) {
      trends.push(`${riskCounts.CRITICAL} students in critical risk`);
      recommendations.push('Immediate intervention required');
    }

    if (voiceCallsScheduled > 0) {
      trends.push(`${voiceCallsScheduled} voice calls scheduled`);
      recommendations.push('Follow up on scheduled calls within 24 hours');
    }

    const report = await prisma.feeSenseReport.create({
      data: {
        agentId: agent.id,
        reportDate: new Date(),
        totalStudentsAtRisk: totalStudents,
        lowRiskCount: riskCounts.LOW,
        mediumRiskCount: riskCounts.MEDIUM,
        highRiskCount: riskCounts.HIGH,
        totalOverdueAmount: totalOverdue,
        paymentsReceived: 0,
        emailsSent,
        smsSent,
        voiceCallsScheduled,
        responseRate: null,
        insights: {
          trends,
          recommendations,
          topRiskStudents: topRisk,
          metrics: {
            totalProcessed: totalStudents,
            skippedDueToCooldown: skipped,
            errors,
            whatsAppSent,
          },
        },
        sentToEmails: [],
      },
    });

    console.log('   Report Created:', report.id);

    // Update agent stats
    await prisma.feeSenseAgent.update({
      where: { id: agent.id },
      data: {
        lastRunAt: new Date(),
        totalRuns: { increment: 1 },
        successfulRuns: { increment: 1 },
      },
    });

    console.log('   Agent Stats Updated');

    const result = {
      success: true,
      reportId: report.id,
      summary: {
        totalStudents,
        processed: analyses.length,
        skipped,
        errors,
        criticalRisk: riskCounts.CRITICAL,
        highRisk: riskCounts.HIGH,
        emailsSent,
        smsSent,
        whatsAppSent,
        voiceCallsScheduled,
        totalOverdue,
      },
    };

    console.log('✅ [TOOL] generateDailyReport - SUCCESS');
    console.log('   Summary:', JSON.stringify(result.summary, null, 2));

    return result;
  },
});

// ============================================================================
// Create the FeeSense AI Agent
// ============================================================================

export const feeSenseAgent = new Agent({
  model: google('gemini-2.0-flash-exp'),
  system: `You are FeeSense AI, an intelligent fee collection assistant.

YOUR WORKFLOW (Follow this EXACTLY in order):

1. FIRST: Call checkAgentEnabled with organizationId
   - If not enabled, STOP and report this
   
2. SECOND: Call fetchOverdueFees with organizationId
   - If no students found, STOP and report this
   
3. THIRD: For EACH student in the results:
   - Call analyzeAndProcessStudent with the student data and config
   - Track the results (analyses, counts)
   - Continue even if some students are skipped or error
   
4. FOURTH: After processing ALL students:
   - Call generateDailyReport with all analyses and metrics
   
IMPORTANT RULES:
- Process students ONE AT A TIME (don't batch or skip)
- Keep track of: emailsSent, smsSent, whatsAppSent, voiceCallsScheduled, skipped, errors
- If a student is skipped (cooldown), INCREMENT skipped counter and continue
- If a student errors, INCREMENT error counter and continue
- Collect ALL analyses (only successful ones) for the final report
- ALWAYS call generateDailyReport at the end with complete metrics

TRACKING TEMPLATE:
- totalStudents: <from fetchOverdueFees>
- emailsSent: 0
- smsSent: 0
- whatsAppSent: 0
- voiceCallsScheduled: 0
- skipped: 0
- errors: 0
- analyses: []

After each analyzeAndProcessStudent call, update counters based on result.

Current date: ${new Date().toISOString().split('T')[0]}

Be systematic and thorough. Process EVERY student before generating the report.`,

  tools: {
    checkAgentEnabled,
    fetchOverdueFees,
    analyzeAndProcessStudent,
    generateDailyReport,
  },
  stopWhen: stepCountIs(20),
});

// ============================================================================
// Main Execution Function
// ============================================================================

export async function runFeeSenseAgent(organizationId: string) {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚀 FeeSense AI Agent Starting');
  console.log('═══════════════════════════════════════════════════════');
  console.log('Organization ID:', organizationId);
  console.log('Timestamp:', new Date().toISOString());
  console.log('');

  const prompt = `Execute the FeeSense workflow for organization: ${organizationId}

Follow the workflow exactly:
1. Check if agent is enabled
2. Fetch overdue fees
3. Process EACH student individually (all of them!)
4. Generate final report with complete metrics

Start now and process ALL students.`;

  try {
    console.log('📤 Sending prompt to AI Agent...\n');

    const result = await feeSenseAgent.generate({ prompt });

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ FeeSense Agent Completed Successfully');
    console.log('═══════════════════════════════════════════════════════');
    console.log('Steps Taken:', result.steps?.length || 0);
    console.log('Tool Calls:', result.toolCalls?.length || 0);
    console.log('\nTool Call Summary:');
    result.toolCalls?.forEach((tc, i) => {
      console.log(`  ${i + 1}. ${tc.toolName}`);
    });
    console.log('\nFinal Output:', result.text || '(none)');
    console.log('');

    return {
      success: true,
      output: result.text,
      steps: result.steps,
      toolCalls: result.toolCalls,
    };
  } catch (error) {
    console.log('\n═══════════════════════════════════════════════════════');
    console.error('❌ FeeSense Agent Failed');
    console.log('═══════════════════════════════════════════════════════');
    console.error('Error:', error);
    console.log('');

    // Log failure
    try {
      const agent = await prisma.feeSenseAgent.findUnique({
        where: { organizationId },
      });

      if (agent) {
        await prisma.feeSenseExecutionLog.create({
          data: {
            agentId: agent.id,
            startedAt: new Date(),
            completedAt: new Date(),
            status: 'FAILED',
            errorMessage:
              error instanceof Error ? error.message : 'Unknown error',
            studentsAnalyzed: 0,
            remindersGenerated: 0,
            emailsSent: 0,
            smsSent: 0,
            voiceCallsScheduled: 0,
            totalAmountOverdue: 0,
          },
        });

        await prisma.feeSenseAgent.update({
          where: { id: agent.id },
          data: {
            lastRunAt: new Date(),
            totalRuns: { increment: 1 },
            failedRuns: { increment: 1 },
          },
        });

        console.log('📝 Failure logged to database');
      }
    } catch (logError) {
      console.error('⚠️  Failed to log error:', logError);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// Run for All Active Organizations (Cron Job)
// ============================================================================

export async function runFeeSenseForAll() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║   FeeSense AI Agent - Batch Run for All Orgs         ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  const activeAgents = await prisma.feeSenseAgent.findMany({
    where: {
      isActive: true,
      runFrequency: { not: 'ON_DEMAND' },
    },
    include: { organization: true },
  });

  console.log(`🌐 Found ${activeAgents.length} active agents to run\n`);

  if (activeAgents.length === 0) {
    console.log('⚠️  No active agents found. Exiting.\n');
    return [];
  }

  const results = [];
  for (let i = 0; i < activeAgents.length; i++) {
    const agent = activeAgents[i];
    console.log(
      `\n[${i + 1}/${activeAgents.length}] 📍 Processing: ${agent.organization.name}`
    );
    console.log('─'.repeat(60));

    try {
      const result = await runFeeSenseAgent(agent.organizationId);
      results.push({
        organization: agent.organization.name,
        organizationId: agent.organizationId,
        ...result,
      });

      if (result.success) {
        console.log(`✅ Completed successfully for ${agent.organization.name}`);
      } else {
        console.log(
          `❌ Failed for ${agent.organization.name}: ${result.error}`
        );
      }
    } catch (error) {
      console.error(`❌ Exception for ${agent.organization.name}:`, error);
      results.push({
        organization: agent.organization.name,
        organizationId: agent.organizationId,
        success: false,
        error: String(error),
      });
    }
  }

  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║   Batch Run Complete - Summary                        ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${results.length}\n`);

  results.forEach((r, i) => {
    const status = r.success ? '✅' : '❌';
    console.log(`  ${i + 1}. ${status} ${r.organization}`);
  });

  console.log('');
  return results;
}
