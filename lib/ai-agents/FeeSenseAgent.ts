import prisma from '@/lib/db';

// ============================================================================
// STEP 1: CHECK IF FEE FUNCTIONALITY IS ENABLED

//  1.1 Query organization settings from database
//  1.2 Check if feeSenseAgent is enabled
//  1.3 Check if aiFeesSenseNotificationsEnabled is enabled
//  1.4 Verify subscription plan includes fee management features
//  1.5 If not enabled, log and exit workflow
//  1.6 If enabled, proceed to next step

// ============================================================================

// ============================================================================
// STEP 2: COLLECT ALL FEE-RELATED DATA
//  2.1 Query all fees with status UNPAID or OVERDUE
//  2.2 Filter fees where pendingAmount > 0
//  2.3 Include related student information (name, contact, email)
//  2.4 Include related parent information (name, phone, email)
//  2.5 Fetch payment history for each fee (last 10-20 payments)
//      Include: amount, paymentDate, status, paymentMethod, transactionId
//  2.6 Fetch notification history for each student (last 30-60 days)
//      Include: channel, status, sentAt, notificationType, retryCount
//  2.7 Include fee category and academic year details
//  2.8 Calculate days overdue (current date - dueDate)
//  2.9 Store all collected data in structured format for Ai analysis

// ============================================================================

// ============================================================================
// STEP 3: AI ANALYSIS - IDENTIFY PATTERNS, SENTIMENT & PROBLEMS
// ============================================================================
/**
 * 3.1 PAYMENT PATTERN ANALYSIS
 *     - Who Is Paying (student or primary parent or which parent), How Often, How Much
 *     - Identify pattern type:
 *       • regular: consistent payment intervals with low variance
 *       • irregular: inconsistent payment timing
 *       • partial_payer: makes payments but not in full
 *       • never_paid: no payment history found
 *
 * 3.2 SENTIMENT ANALYSIS
 *     - Analyze payment behavior and responsiveness
 *     - Categorize sentiment:
 *       • positive: regular payments, responsive to reminders
 *       • neutral: occasional delays but eventually pays
 *       • negative: frequent delays, multiple reminders needed
 *       • critical: no response, severe overdue, payment failures
 *
 * 3.3 PROBLEM IDENTIFICATION
 *     - Check for missing contact information
 *     - Identify failed payment attempts
 *     - Calculate days overdue
 *     - Count notification attempts without response
 *     - Detect if never paid vs stopped paying
 *     - Check for partial payment patterns
 *     - List all identified issues
 *
 * 3.4 RISK SCORE CALCULATION (0-100)
 *     - Payment pattern risk (0-30 points)
 *       • never_paid: 30 points
 *       • irregular: 20 points
 *       • partial_payer: 10 points
 *     - Days overdue risk (0-40 points)
 *       • Calculate based on days past due date
 *     - Notification attempts risk (0-20 points)
 *       • 5 points per failed notification attempt
 *     - Pending amount ratio risk (0-10 points)
 *       • Based on pendingAmount / totalFee ratio
 *
 * 3.5 RECOMMENDED ACTION DETERMINATION
 *     - If notification attempts after overdue >= 3: schedule voice_call
 *     - If riskScore > 70: use whatsapp
 *     - If riskScore > 40: use sms
 *     - If riskScore <= 40: use email
 *
 * 3.6 PERSONALIZED MESSAGE GENERATION
 *     - Use AI (OpenAI/Claude API) to generate contextual message
 *     - Include student name, pending amount, due date
 *     - Reference payment history if applicable
 *     - Mention identified problems
 *     - Add supportive tone for genuine issues
 *     - Add urgency for critical cases
 *     - Keep message concise and actionable
 *
 * 3.7 Store all analysis results for each fee/student
 */

// ============================================================================
// STEP 4: SEND NOTIFICATIONS BASED ON AI ANALYSIS
// ============================================================================
/**
 * 4.1 Loop through all analyzed fees
 *
 * 4.2 For each fee, check notification attempt count:
 *     - If attempts < 3: proceed with notification
 *     - If attempts >= 3: skip to voice call scheduling (Step 5)
 *
 * 4.3 Select notification channel based on recommended action:
 *     - email → EMAIL channel
 *     - sms → SMS channel
 *     - whatsapp → WHATSAPP channel
 *
 * 4.4 Create NotificationLog entry:
 *     - Set organizationId
 *     - Set userId (parent or student)
 *     - Set studentId
 *     - Set channel (EMAIL, SMS, WHATSAPP)
 *     - Set notificationType: FEE_REMINDER
 *     - Set status: PENDING
 *     - Set retryCount: 0
 *     - Set maxRetries: 3
 *
 * 4.5 Queue notification for delivery:
 *     - For EMAIL: use email service (SendGrid, AWS SES)
 *     - For SMS: use SMS gateway (Twilio, AWS SNS)
 *     - For WHATSAPP: use WhatsApp Business API
 *     - Include personalized message from AI analysis
 *     - Include payment link if available
 *
 * 4.6 Handle delivery status:
 *     - Update NotificationLog status to SENT or FAILED
 *     - If FAILED: increment retryCount
 *     - If retryCount < maxRetries: schedule retry
 *
 * 4.7 Track costs and units for each notification sent
 */

// ============================================================================
// STEP 5: SCHEDULE VOICE CALLS (AFTER 3 NOTIFICATION ATTEMPTS)
// ============================================================================
/**
 * 5.1 Filter fees where notificationAttempts >= 3
 *
 * 5.2 For each high-priority case:
 *
 * 5.3 Generate personalized voice call summary:
 *     - Student name and class
 *     - Total fee and pending amount
 *     - Original due date and days overdue
 *     - Payment history summary
 *     - Risk score and priority level
 *     - All identified problems
 *     - Previous notification attempts and channels used
 *
 * 5.4 Create ScheduledJob entry:
 *     - Set type: FEE_REMINDER
 *     - Set scheduledAt: 2-4 hours from current time
 *     - Set channels: ['WHATSAPP'] or ['VOICE_CALL']
 *     - Set status: PENDING
 *     - Store complete context in data JSON:
 *       • studentId, parentId, feeId
 *       • contact information (phone, email)
 *       • voice call summary
 *       • AI analysis results
 *       • suggested talking points
 *
 * 5.5 When job executes:
 *     - Update status to PROCESSING
 *     - Initiate voice call via telephony service
 *     - Or send detailed WhatsApp message with call request
 *     - Update status to COMPLETED or FAILED
 *     - Store result and any error messages
 *
 * 5.6 Create NotificationLog entry for voice call attempt
 */

// ============================================================================
// STEP 6: GENERATE END-OF-DAY AI REPORT
// ============================================================================
/**
 * 6.1 AGGREGATE STATISTICS
 *     - Count total overdue fees processed
 *     - Sum total pending amount across all fees
 *     - Count notifications sent by channel (email, sms, whatsapp)
 *     - Count voice calls scheduled
 *     - Calculate payment pattern distribution
 *     - Calculate risk score distribution (low, medium, high, critical)
 *
 * 6.2 IDENTIFY TOP CONCERNS
 *     - Sort all fees by risk score (descending)
 *     - Select top 10-20 highest risk cases
 *     - Include: student name, pending amount, risk score, main issue
 *
 * 6.3 GENERATE AI INSIGHTS
 *     - Calculate collection efficiency rate
 *     - Identify trends in payment patterns
 *     - Highlight critical risk students needing immediate attention
 *     - Analyze notification effectiveness (response rates)
 *     - Compare with previous day/week performance
 *     - Suggest action items for admin
 *
 * 6.4 CREATE REPORT STRUCTURE
 *     - Report date and organization ID
 *     - Executive summary with key metrics
 *     - Payment pattern breakdown
 *     - Risk distribution charts
 *     - Top concerns table
 *     - AI insights and recommendations
 *     - Notification delivery statistics
 *     - Scheduled voice calls list
 *
 * 6.5 SAVE REPORT TO DATABASE
 *     - Create FeeReport record with:
 *       • date, organizationId
 *       • complete report data as JSON
 *       • summary metrics
 *       • createdAt timestamp
 *
 * 6.6 SEND REPORT TO ADMIN
 *     - Query all users with ADMIN role
 *     - Format report as HTML email with:
 *       • Clean, professional layout
 *       • Summary cards with key metrics
 *       • Charts and visualizations
 *       • Top concerns table
 *       • AI insights section
 *       • Action items highlighted
 *     - Send email to each admin
 *
 * 6.7 UPDATE DASHBOARD
 *     - Store report data for dashboard display
 *     - Update real-time metrics
 *     - Create notifications for critical items
 */

// ============================================================================
// STEP 7: WORKFLOW ORCHESTRATION & SCHEDULING
// ============================================================================
/**
 * 7.1 MAIN WORKFLOW FUNCTION
 *     - Execute all steps in sequence
 *     - Handle errors at each step
 *     - Log progress and completion
 *     - Return workflow summary
 *
 * 7.2 ERROR HANDLING
 *     - Wrap each step in try-catch
 *     - Log errors with context
 *     - Continue workflow where possible
 *     - Alert admin if critical failure
 *
 * 7.3 DAILY CRON JOB SETUP
 *     - Schedule to run at end of day (e.g., 11:00 PM)
 *     - Query all organizations with feeManagementEnabled: true
 *     - Run workflow for each organization sequentially
 *     - Track execution time and success/failure
 *     - Send summary email to system admins
 *
 * 7.4 MANUAL TRIGGER OPTION
 *     - Provide API endpoint for manual workflow execution
 *     - Allow admins to run workflow on-demand
 *     - Support single organization or all organizations
 *
 * 7.5 MONITORING & LOGGING
 *     - Log start and end times
 *     - Track number of fees processed
 *     - Count notifications sent by type
 *     - Record any errors or warnings
 *     - Monitor API rate limits
 *     - Alert on unusual patterns
 */

// ============================================================================
// ADDITIONAL CONSIDERATIONS
// ============================================================================
/**
 * RATE LIMITING
 *     - Respect email service rate limits
 *     - Throttle SMS sending to avoid carrier blocks
 *     - Batch WhatsApp messages appropriately
 *
 * COST TRACKING
 *     - Track cost per notification by channel
 *     - Calculate daily/monthly communication costs
 *     - Include costs in report
 *
 * PRIVACY & COMPLIANCE
 *     - Ensure GDPR/data protection compliance
 *     - Allow parents to opt-out of communications
 *     - Store consent records
 *     - Provide unsubscribe mechanism
 *
 * TESTING
 *     - Create test mode flag to avoid sending real notifications
 *     - Test with sample data
 *     - Validate AI analysis logic
 *     - Verify report generation
 *
 * OPTIMIZATION
 *     - Cache frequently accessed data
 *     - Use database indexes for performance
 *     - Batch database operations
 *     - Implement retry logic with exponential backoff
 */

export const FEE_AI_WORKFLOW_STEPS = {
  step1: 'Check if feeSenseAgent is enabled',
  step2: 'Collect and aggregate all fee-related data',
  step3: 'AI analysis: patterns, sentiment, problems',
  step4: 'Send notifications based on analysis',
  step5: 'Schedule voice calls after 3 attempts',
  step6: 'Generate and send end-of-day AI report',
  step7: 'Orchestrate workflow with error handling',
};
// 7:00 AM	Fetch all unpaid fees, overdue students
// 8:00 AM	Generate summary for admin dashboard
// 9:00 AM	Send first reminders (based on tone logic)
// 12:00 PM	Check payments → mark effective reminders
// 3:00 PM	Prepare next-day schedule if pending exists
// End of Day	Generate insights: total collected, reminders sent, pending summary

// Steps for Fee Sense Agent

// [1] Check feature enabled for this organization
// [2] Fetch fee data
// [3] Analyze patterns per student
// [4] Identify sentiment & problems
// [5] Decide reminder channel & tone
// [6] Send reminders or schedule call
// [7] Log and monitor responses
// [8] Generate end-of-day report

/**
 * Fee Management AI Workflow
 * Complete workflow for fee collection, analysis, and automated notifications
 */

// ============================================================================
// STEP 1: Check if Fee Functionality is Enabled
// ============================================================================

interface OrganizationFeatures {
  feeManagementEnabled: boolean;
  aiNotificationsEnabled: boolean;
  voiceCallEnabled: boolean;
}

async function checkFeeFeatureEnabled(
  organizationId: string
): Promise<boolean> {
  // Query organization settings
  //   const org = await prisma.organization.findUnique({
  //     where: { id: organizationId },
  //     select: {
  //       features: true, // Assuming features are stored in organization
  //       subscriptionPlan: true,
  //     },
  //   });

  //   if (!org?.features?.feeManagementEnabled) {
  //     console.log(`Fee management not enabled for org: ${organizationId}`);
  //     return false;
  //   }

  return true;
}

// ============================================================================
// STEP 2: Collect and Aggregate Fee Data
// ============================================================================

interface FeeAnalysisData {
  fee: {
    id: string;
    totalFee: number;
    paidAmount: number;
    pendingAmount: number;
    dueDate: Date;
    status: string;
    studentId: string;
  };
  student: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  parent: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  paymentHistory: Array<{
    id: string;
    amount: number;
    paymentDate: Date;
    status: string;
    paymentMethod: string;
  }>;
  notificationHistory: Array<{
    id: string;
    channel: string;
    status: string;
    sentAt: Date;
    notificationType: string;
  }>;
}

async function collectFeeData(
  organizationId: string
): Promise<FeeAnalysisData[]> {
  const overdueAndPendingFees = await prisma.fee.findMany({
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
            select: {
              parent: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phoneNumber: true,
                },
              },
            },
          },
        },
      },
      payments: {
        orderBy: { paymentDate: 'desc' },
        take: 10, // Last 10 payments
      },
      feeCategory: true,
      academicYear: true,
    },
  });

  // Get notification history for each fee/student
  const analysisData: FeeAnalysisData[] = [];

  for (const fee of overdueAndPendingFees) {
    const notificationHistory = await prisma.notificationLog.findMany({
      where: {
        organizationId,
        studentId: fee.studentId,
        notificationType: 'FEE_REMINDER',
        sentAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      orderBy: { sentAt: 'desc' },
    });

    analysisData.push({
      fee: {
        id: fee.id,
        totalFee: fee.totalFee,
        paidAmount: fee.paidAmount,
        pendingAmount: fee.pendingAmount || 0,
        dueDate: fee.dueDate,
        status: fee.status,
        studentId: fee.studentId,
      },
      student: {
        id: fee.student.id,
        firstName: fee.student.firstName || '',
        lastName: fee.student.lastName || '',
        phone: fee.student.phoneNumber || '',
        email: fee.student.user.email || '',
      },
      parent: {
        id: fee.student.parents[0].parent.id || '',
        firstName: fee.student.parents[0].parent.firstName || '',
        lastName: fee.student.parents[0].parent.lastName || '',
        phone: fee.student.parents[0].parent.phoneNumber || '',
        email: fee.student.parents[0].parent.email || '',
      },
      paymentHistory: fee.payments.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        paymentDate: payment.paymentDate,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
      })),
      notificationHistory: notificationHistory.map((notification) => ({
        id: notification.id,
        channel: notification.channel,
        status: notification.status,
        sentAt: notification.sentAt,
        notificationType: notification.notificationType,
      })),
    });
  }

  return analysisData;
}

// ============================================================================
// STEP 3: AI Analysis - Identify Patterns, Sentiments, and Problems
// ============================================================================

interface AIAnalysisResult {
  studentId: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'critical';
  paymentPattern: 'regular' | 'irregular' | 'never_paid' | 'partial_payer';
  problemsIdentified: string[];
  riskScore: number; // 0-100
  recommendedAction: 'email' | 'sms' | 'whatsapp' | 'voice_call';
  personalizedMessage: string;
  daysSinceLastPayment: number;
  notificationAttempts: number;
  lastNotificationDate: Date | null;
}

async function analyzeFeePatternsWithAI(
  data: FeeAnalysisData[]
): Promise<AIAnalysisResult[]> {
  const results: AIAnalysisResult[] = [];

  for (const record of data) {
    // Calculate payment patterns
    const paymentPattern = detectPaymentPattern(record.paymentHistory);
    const daysSinceLastPayment = calculateDaysSinceLastPayment(
      record.paymentHistory
    );
    const notificationAttempts = record.notificationHistory.filter(
      (n) => n.status === 'SENT' || n.status === 'DELIVERED'
    ).length;

    // Determine sentiment and risk
    const sentiment = determineSentiment(
      paymentPattern,
      daysSinceLastPayment,
      notificationAttempts
    );
    const riskScore = calculateRiskScore(
      record.fee,
      paymentPattern,
      daysSinceLastPayment,
      notificationAttempts
    );

    // Identify problems
    const problems = identifyProblems(
      record,
      paymentPattern,
      notificationAttempts
    );

    // Recommend action based on attempts and risk
    const recommendedAction = determineRecommendedAction(
      notificationAttempts,
      riskScore,
      sentiment
    );

    // Generate personalized message using AI
    const personalizedMessage = await generatePersonalizedMessage(
      record,
      paymentPattern,
      problems
    );

    results.push({
      studentId: record.student.id,
      sentiment,
      paymentPattern,
      problemsIdentified: problems,
      riskScore,
      recommendedAction,
      personalizedMessage,
      daysSinceLastPayment,
      notificationAttempts,
      lastNotificationDate: record.notificationHistory[0]?.sentAt || null,
    });
  }

  return results;
}

// Helper functions for AI analysis
function detectPaymentPattern(
  payments: Array<{ paymentDate: Date; amount: number }>
): 'regular' | 'irregular' | 'never_paid' | 'partial_payer' {
  if (payments.length === 0) return 'never_paid';
  if (payments.length === 1) return 'partial_payer';

  // Calculate time gaps between payments
  const gaps: number[] = [];
  for (let i = 0; i < payments.length - 1; i++) {
    const diff = Math.abs(
      payments[i].paymentDate.getTime() - payments[i + 1].paymentDate.getTime()
    );
    gaps.push(diff / (1000 * 60 * 60 * 24)); // Convert to days
  }

  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const variance =
    gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length;

  if (variance < 100) return 'regular'; // Low variance = regular
  return 'irregular';
}

function calculateDaysSinceLastPayment(
  payments: Array<{ paymentDate: Date }>
): number {
  if (payments.length === 0) return 999; // Never paid
  const lastPayment = payments[0].paymentDate;
  return Math.floor(
    (Date.now() - lastPayment.getTime()) / (1000 * 60 * 60 * 24)
  );
}

function determineSentiment(
  pattern: string,
  daysSinceLastPayment: number,
  notificationAttempts: number
): 'positive' | 'neutral' | 'negative' | 'critical' {
  if (pattern === 'regular' && daysSinceLastPayment < 30) return 'positive';
  if (pattern === 'never_paid' || daysSinceLastPayment > 90) return 'critical';
  if (notificationAttempts >= 3 && daysSinceLastPayment > 60) return 'negative';
  return 'neutral';
}

function calculateRiskScore(
  fee: any,
  pattern: string,
  daysSinceLastPayment: number,
  notificationAttempts: number
): number {
  let score = 0;

  // Payment pattern risk (0-30)
  if (pattern === 'never_paid') score += 30;
  else if (pattern === 'irregular') score += 20;
  else if (pattern === 'partial_payer') score += 10;

  // Days overdue risk (0-40)
  const daysOverdue = Math.max(0, daysSinceLastPayment - 30);
  score += Math.min(40, daysOverdue / 3);

  // Notification attempts risk (0-20)
  score += Math.min(20, notificationAttempts * 5);

  // Pending amount risk (0-10)
  const pendingRatio = fee.pendingAmount / fee.totalFee;
  score += pendingRatio * 10;

  return Math.min(100, Math.round(score));
}

function identifyProblems(
  record: FeeAnalysisData,
  pattern: string,
  attempts: number
): string[] {
  const problems: string[] = [];

  if (pattern === 'never_paid') {
    problems.push('No payment history found');
  }

  if (attempts >= 3) {
    problems.push('Multiple reminders sent without response');
  }

  const daysOverdue = Math.floor(
    (Date.now() - record.fee.dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysOverdue > 30) {
    problems.push(`Fee overdue by ${daysOverdue} days`);
  }

  if (record.paymentHistory.some((p) => p.status === 'FAILED')) {
    problems.push('Previous payment attempts failed');
  }

  if (!record.parent.phone && !record.parent.email) {
    problems.push('Missing contact information');
  }

  return problems;
}

function determineRecommendedAction(
  attempts: number,
  riskScore: number,
  sentiment: string
): 'email' | 'sms' | 'whatsapp' | 'voice_call' {
  // After 3 attempts, schedule voice call
  if (attempts >= 3) return 'voice_call';

  // High risk = WhatsApp (more personal)
  if (riskScore > 70) return 'whatsapp';

  // Medium risk = SMS
  if (riskScore > 40) return 'sms';

  // Low risk = Email
  return 'email';
}

async function generatePersonalizedMessage(
  record: FeeAnalysisData,
  pattern: string,
  problems: string[]
): Promise<string> {
  // In production, this would call an AI API (OpenAI, Claude, etc.)
  // For now, we'll create a template-based personalized message

  const studentName = record.student.firstName + ' ' + record.student.lastName;
  const pendingAmount = record.fee.pendingAmount;
  const dueDate = record.fee.dueDate.toLocaleDateString();

  let message = `Dear Parent of ${studentName},\n\n`;

  if (pattern === 'regular') {
    message += `We appreciate your consistent payment history. `;
  } else if (pattern === 'never_paid') {
    message += `We noticed that the fee payment is still pending. `;
  }

  message += `A fee of ₹${pendingAmount} is pending with due date ${dueDate}.\n\n`;

  if (problems.length > 0) {
    message += `Please note: ${problems.join(', ')}.\n\n`;
  }

  message += `For any assistance, please contact the school office.\n\nThank you.`;

  return message;
}

// ============================================================================
// STEP 4: Send Notifications Based on Analysis
// ============================================================================

async function sendNotifications(
  organizationId: string,
  analysisResults: AIAnalysisResult[],
  feeData: FeeAnalysisData[]
): Promise<void> {
  for (let i = 0; i < analysisResults.length; i++) {
    const analysis = analysisResults[i];
    const data = feeData[i];

    // Skip if already attempted 3 times (will schedule voice call instead)
    if (analysis.notificationAttempts >= 3) {
      await scheduleVoiceCall(organizationId, data, analysis);
      continue;
    }

    // Send notification via recommended channel
    const channel = mapActionToChannel(analysis.recommendedAction);

    try {
      await prisma.notificationLog.create({
        data: {
          organizationId,
          userId: data.parent.id || data.student.id,
          studentId: data.student.id,
          channel,
          status: 'PENDING',
          notificationType: 'FEE_REMINDER',
          retryCount: 0,
          maxRetries: 3,
        },
      });

      // Queue actual notification sending (implement with your provider)
      await queueNotification(
        channel,
        data.parent,
        analysis.personalizedMessage
      );
    } catch (error) {
      console.error(`Failed to send notification: ${error}`);
    }
  }
}

function mapActionToChannel(
  action: string
): 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' {
  const mapping: Record<string, 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH'> = {
    email: 'EMAIL',
    sms: 'SMS',
    whatsapp: 'WHATSAPP',
    voice_call: 'WHATSAPP', // Use WhatsApp for initial contact
  };
  return mapping[action] || 'EMAIL';
}

async function queueNotification(
  channel: string,
  parent: any,
  message: string
): Promise<void> {
  // Implement actual notification sending logic here
  // This would integrate with services like:
  // - Twilio (SMS)
  // - SendGrid (Email)
  // - WhatsApp Business API
  console.log(
    `Queuing ${channel} notification to ${parent.phone || parent.email}`
  );
}

// ============================================================================
// STEP 5: Schedule Voice Calls for High-Priority Cases
// ============================================================================

async function scheduleVoiceCall(
  organizationId: string,
  data: FeeAnalysisData,
  analysis: AIAnalysisResult
): Promise<void> {
  // Create personalized voice call summary
  const voiceSummary = generateVoiceCallSummary(data, analysis);

  // Schedule the voice call job
  await prisma.scheduledJob.create({
    data: {
      organizationId,
      type: 'FEE_REMINDER',
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      status: 'PENDING',
      channels: ['WHATSAPP'], // Can add VOICE_CALL when available
      data: {
        studentId: data.student.id,
        parentId: data.parent.id,
        feeId: data.fee.id,
        phoneNumber: data.parent.phone,
        voiceSummary,
        analysis: JSON.parse(JSON.stringify(analysis)),
      },
    },
  });

  console.log(
    `Voice call scheduled for student: ${data.student.firstName + ' ' + data.student.lastName}`
  );
}

function generateVoiceCallSummary(
  data: FeeAnalysisData,
  analysis: AIAnalysisResult
): string {
  return `
    Student: ${data.student.firstName + ' ' + data.student.lastName}
    Pending Amount: ₹${data.fee.pendingAmount}
    Due Date: ${data.fee.dueDate.toLocaleDateString()}
    Days Overdue: ${analysis.daysSinceLastPayment}
    Risk Level: ${analysis.riskScore}/100
    Payment Pattern: ${analysis.paymentPattern}
    Issues: ${analysis.problemsIdentified.join(', ')}
  `.trim();
}

// ============================================================================
// STEP 6: Generate End-of-Day AI Reports
// ============================================================================

interface DailyFeeReport {
  date: Date;
  organizationId: string;
  summary: {
    totalOverdueFees: number;
    totalPendingAmount: number;
    notificationsSent: number;
    voiceCallsScheduled: number;
    paymentPatterns: Record<string, number>;
    riskDistribution: Record<string, number>;
  };
  topConcerns: Array<{
    studentName: string;
    pendingAmount: number;
    riskScore: number;
    issue: string;
  }>;
  aiInsights: string[];
}

async function generateDailyReport(
  organizationId: string,
  analysisResults: AIAnalysisResult[],
  feeData: FeeAnalysisData[]
): Promise<DailyFeeReport> {
  const report: DailyFeeReport = {
    date: new Date(),
    organizationId,
    summary: {
      totalOverdueFees: feeData.length,
      totalPendingAmount: feeData.reduce(
        (sum, d) => sum + d.fee.pendingAmount,
        0
      ),
      notificationsSent: analysisResults.filter(
        (a) => a.notificationAttempts < 3
      ).length,
      voiceCallsScheduled: analysisResults.filter(
        (a) => a.notificationAttempts >= 3
      ).length,
      paymentPatterns: {},
      riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
    },
    topConcerns: [],
    aiInsights: [],
  };

  // Aggregate payment patterns
  analysisResults.forEach((a) => {
    report.summary.paymentPatterns[a.paymentPattern] =
      (report.summary.paymentPatterns[a.paymentPattern] || 0) + 1;
  });

  // Aggregate risk distribution
  analysisResults.forEach((a) => {
    if (a.riskScore < 30) report.summary.riskDistribution.low++;
    else if (a.riskScore < 60) report.summary.riskDistribution.medium++;
    else if (a.riskScore < 80) report.summary.riskDistribution.high++;
    else report.summary.riskDistribution.critical++;
  });

  // Identify top 10 concerns
  const concerns = analysisResults
    .map((a, i) => ({
      studentName:
        feeData[i].student.firstName + ' ' + feeData[i].student.lastName,
      pendingAmount: feeData[i].fee.pendingAmount,
      riskScore: a.riskScore,
      issue: a.problemsIdentified[0] || 'No specific issue',
    }))
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 10);

  report.topConcerns = concerns;

  // Generate AI insights
  report.aiInsights = generateAIInsights(report, analysisResults);

  return report;
}

function generateAIInsights(
  report: DailyFeeReport,
  analyses: AIAnalysisResult[]
): string[] {
  const insights: string[] = [];

  // Collection efficiency
  const collectionRate =
    (1 -
      report.summary.totalPendingAmount /
        (report.summary.totalPendingAmount * 1.5)) *
    100;
  insights.push(`Current collection efficiency: ${collectionRate.toFixed(1)}%`);

  // Pattern insights
  const neverPaidCount = report.summary.paymentPatterns.never_paid || 0;
  if (neverPaidCount > 0) {
    insights.push(
      `${neverPaidCount} students have never made a payment - requires immediate attention`
    );
  }

  // Risk insights
  const criticalCount = report.summary.riskDistribution.critical;
  if (criticalCount > 0) {
    insights.push(
      `${criticalCount} students in critical risk category - consider personal intervention`
    );
  }

  // Notification effectiveness
  const avgAttempts =
    analyses.reduce((sum, a) => sum + a.notificationAttempts, 0) /
    analyses.length;
  insights.push(
    `Average notification attempts: ${avgAttempts.toFixed(1)} - ${avgAttempts > 2 ? 'consider alternative channels' : 'within normal range'}`
  );

  return insights;
}

async function saveDailyReportToDB(report: DailyFeeReport): Promise<void> {
  // Save to a FeeReport model (you'll need to create this in your schema)
  await prisma.$executeRaw`
    INSERT INTO fee_reports (date, organization_id, report_data, created_at)
    VALUES (${report.date}, ${report.organizationId}, ${JSON.stringify(report)}, NOW())
  `;
}

async function sendReportToAdmin(
  organizationId: string,
  report: DailyFeeReport
): Promise<void> {
  // Get admin emails
  const admins = await prisma.user.findMany({
    where: {
      organizationId,
      role: 'ADMIN',
    },
    select: { email: true },
  });

  const emailHtml = formatReportAsHTML(report);

  for (const admin of admins) {
    // Send email (implement with your email service)
    await sendEmail({
      to: admin.email,
      subject: `Daily Fee Report - ${report.date.toLocaleDateString()}`,
      html: emailHtml,
    });
  }
}

function formatReportAsHTML(report: DailyFeeReport): string {
  return `
    <h1>Daily Fee Collection Report</h1>
    <p>Date: ${report.date.toLocaleDateString()}</p>
    
    <h2>Summary</h2>
    <ul>
      <li>Total Overdue Fees: ${report.summary.totalOverdueFees}</li>
      <li>Total Pending Amount: ₹${report.summary.totalPendingAmount.toLocaleString()}</li>
      <li>Notifications Sent: ${report.summary.notificationsSent}</li>
      <li>Voice Calls Scheduled: ${report.summary.voiceCallsScheduled}</li>
    </ul>

    <h2>AI Insights</h2>
    <ul>
      ${report.aiInsights.map((insight) => `<li>${insight}</li>`).join('')}
    </ul>

    <h2>Top Concerns</h2>
    <table border="1">
      <tr>
        <th>Student</th>
        <th>Pending Amount</th>
        <th>Risk Score</th>
        <th>Issue</th>
      </tr>
      ${report.topConcerns
        .map(
          (c) => `
        <tr>
          <td>${c.studentName}</td>
          <td>₹${c.pendingAmount}</td>
          <td>${c.riskScore}</td>
          <td>${c.issue}</td>
        </tr>
      `
        )
        .join('')}
    </table>
  `;
}

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  // Implement with SendGrid, AWS SES, or other email service
  console.log(`Sending email to: ${params.to}`);
}

// ============================================================================
// MAIN WORKFLOW ORCHESTRATOR
// ============================================================================

export async function runDailyFeeAIWorkflow(
  organizationId: string
): Promise<void> {
  console.log(`Starting Fee AI Workflow for organization: ${organizationId}`);

  try {
    // Step 1: Check if feature is enabled
    const isEnabled = await checkFeeFeatureEnabled(organizationId);
    if (!isEnabled) {
      console.log('Fee management not enabled. Skipping workflow.');
      return;
    }

    // Step 2: Collect fee data
    console.log('Collecting fee data...');
    const feeData = await collectFeeData(organizationId);
    console.log(`Collected data for ${feeData.length} fees`);

    if (feeData.length === 0) {
      console.log('No overdue fees found. Workflow complete.');
      return;
    }

    // Step 3: Analyze with AI
    console.log('Analyzing payment patterns with AI...');
    const analysisResults = await analyzeFeePatternsWithAI(feeData);

    // Step 4: Send notifications
    console.log('Sending notifications...');
    await sendNotifications(organizationId, analysisResults, feeData);

    // Step 5: Generate daily report
    console.log('Generating daily report...');
    const report = await generateDailyReport(
      organizationId,
      analysisResults,
      feeData
    );

    // Step 6: Save and send report
    await saveDailyReportToDB(report);
    await sendReportToAdmin(organizationId, report);

    console.log('Fee AI Workflow completed successfully!');
  } catch (error) {
    console.error('Error in Fee AI Workflow:', error);
    throw error;
  }
}

// ============================================================================
// CRON JOB SETUP (Run at end of each day)
// ============================================================================

export async function scheduleDailyFeeWorkflow(): Promise<void> {
  // This would be set up in your cron job or task scheduler
  // Example: Run at 11:00 PM every day
  //   const organizations = await prisma.organization.findMany({
  //     where: {
  //       features: {
  //         path: ['feeManagementEnabled'],
  //         equals: true,
  //       },
  //     },
  //     select: { id: true },
  //   });
  //   for (const org of organizations) {
  //     await runDailyFeeAIWorkflow(org.id);
  //   }
}
