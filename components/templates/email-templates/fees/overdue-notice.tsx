import { EmailFeeTemplateProps } from '@/components/dashboard/Fees/SendFeesReminderDialog';

export const OverdueNoticeTemplate = (props: EmailFeeTemplateProps) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fee Reminder</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .container { background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-left: 4px solid #3b82f6; }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
        .logo { font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 10px; }
        .alert-badge { background: #fef3cd; color: #856404; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; margin-bottom: 15px; }
        .student-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
        .amount-due { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px dashed #ffc107; }
        .amount { font-size: 24px; font-weight: bold; color: #dc3545; }
        .payment-methods { background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
        .btn { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${props.ORGANIZATION_NAME}</div>
            <div class="alert-badge">Friendly Fee Reminder</div>
        </div>

        <p>Dear <strong>${props.PARENT_NAME}</strong>,</p>

        <div class="student-info">
            <strong>Student:</strong> ${props.STUDENT_NAME}<br>
            <strong>Class:</strong> ${props.GRADE}-${props.SECTION}<br>
            <strong>Due Date:</strong> ${props.DUE_DATE}
        </div>

        <div class="amount-due">
            <div>Total Outstanding Amount:</div>
            <div class="amount">${props.AMOUNT}</div>
        </div>


        <div class="payment-methods">
            <strong>Quick Payment Options:</strong><br><br>
            <a href="${props.PORTAL_LINK}" class="btn">
                💳 Pay Online Now
            </a>
            <br><br>
            <strong>Other Methods:</strong>
            <ul>
                <li>Bank Transfer</li>
                <li>UPI Payment</li>
            </ul>
        </div>

        <div class="footer">
            <p><strong>${props.ORGANIZATION_NAME}</strong></p>
            <p>${props.ORGANIZATION_CONTACT_EMAIL.replace(/\n/g, '<br>')}</p>
            <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
                This is an automated message. Please do not reply to this email.<br>
                If you have any questions, please contact the school administration.
            </p>
        </div>
    </div>
</body>
</html>
`;

export const FriendlyReminderText = (props: EmailFeeTemplateProps) => `
Fee Payment Reminder - ${props.ORGANIZATION_NAME}

Dear ${props.PARENT_NAME},

This is a friendly reminder that the fee payment for ${props.STUDENT_NAME} (Class ${props.GRADE}-${props.SECTION}) is due on ${props.DUE_DATE}.

OUTSTANDING AMOUNT: ${props.AMOUNT}


Payment Methods:
• Online Portal: ${props.PORTAL_LINK}
• UPI Payment

If you have already made the payment, please ignore this reminder.

Best regards,
${props.ORGANIZATION_NAME}
${props.ORGANIZATION_CONTACT_EMAIL}
`;
