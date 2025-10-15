import { EmailFeeTemplateProps } from '@/components/dashboard/Fees/SendFeesReminderDialog';

export const FriendlyReminderTemplate = (props: EmailFeeTemplateProps) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fee Payment Reminder</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .container { background: #ffffff; border-radius: 15px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); border: 1px solid #e5e7eb; }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 25px; border-bottom: 2px solid #f0f4ff; }
        .logo { font-size: 28px; font-weight: bold; color: #3b82f6; margin-bottom: 10px; }
        .alert-badge { background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; display: inline-block; margin-bottom: 15px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
        .student-info { background: #f8faff; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #3b82f6; border: 1px solid #e0e7ff; }
        .amount-due { background: linear-gradient(135deg, #ff6b6b, #ee5a24); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; color: white; box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3); }
        .amount { font-size: 32px; font-weight: bold; margin: 10px 0; }
        .payment-methods { background: #f0f9ff; padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #3b82f6; }
        .footer { margin-top: 35px; padding-top: 25px; border-top: 2px solid #f0f4ff; text-align: center; color: #6b7280; font-size: 14px; }
        .btn-primary { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; border-radius: 8px; margin: 15px 0; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); transition: all 0.3s ease; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4); }
        .btn-secondary { display: inline-block; padding: 12px 24px; background: #6b7280; color: white; text-decoration: none; border-radius: 6px; margin: 10px 5px; font-size: 14px; transition: all 0.3s ease; }
        .benefits { background: #f0fdf4; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #10b981; }
        .benefit-item { display: flex; align-items: center; margin: 10px 0; }
        .benefit-icon { color: #10b981; margin-right: 10px; font-size: 18px; }
        .urgency-badge { background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-size: 14px; display: inline-block; margin: 10px 0; }
        .online-highlight { background: linear-gradient(135deg, #dbeafe, #eff6ff); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px dashed #3b82f6; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${props.ORGANIZATION_NAME}</div>
            <div class="alert-badge">📅 Fee Payment Reminder</div>
            <div class="urgency-badge">⏰ Due Date: ${props.DUE_DATE}</div>
        </div>

        <p>Dear <strong style="color: #3b82f6;">${props.PARENT_NAME}</strong>,</p>

        <div class="student-info">
            <h3 style="color: #1e40af; margin-top: 0;">Student Information</h3>
            <p><strong>👤 Student:</strong> ${props.STUDENT_NAME}</p>
            <p><strong>🏫 Class:</strong> ${props.GRADE}-${props.SECTION}</p>
            <p><strong>📅 Due Date:</strong> ${props.DUE_DATE}</p>
        </div>

        <div class="amount-due">
            <div style="font-size: 18px; opacity: 0.9;">Total Outstanding Amount</div>
            <div class="amount">${props.AMOUNT}</div>
            <div style="font-size: 14px; opacity: 0.8;">Pay now to avoid late fees</div>
        </div>

        <div class="online-highlight">
            <h3 style="color: #3b82f6; margin-top: 0;">🚀 Recommended: Instant Online Payment</h3>
            <p>Complete payment in 2 minutes with secure online processing</p>
        </div>

        <div class="payment-methods">
            <h3 style="color: #1e40af; margin-top: 0; text-align: center;">Choose Your Payment Method</h3>
            
            <!-- Primary CTA - Online Payment -->
            <div style="text-align: center; margin: 25px 0;">
                <a href="${props.PORTAL_LINK}" class="btn-primary">
                    💳 Pay Online Now - Instant Confirmation
                </a>
            </div>

            <div class="benefits">
                <h4 style="color: #059669; margin-top: 0;">✨ Why Pay Online?</h4>
                <div class="benefit-item">
                    <span class="benefit-icon">⚡</span>
                    <span>Instant payment confirmation & receipt</span>
                </div>
                <div class="benefit-item">
                    <span class="benefit-icon">🔒</span>
                    <span>Bank-level security with SSL encryption</span>
                </div>
                <div class="benefit-item">
                    <span class="benefit-icon">📱</span>
                    <span>Pay anytime, anywhere from your device</span>
                </div>
                <div class="benefit-item">
                    <span class="benefit-icon">📄</span>
                    <span>Automatic digital receipt for your records</span>
                </div>
            </div>

            <!-- Alternative Method (Less Prominent) -->
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px dashed #d1d5db;">
                <p style="color: #6b7280; margin-bottom: 15px;">
                    <strong>Alternative Method (Not Recommended):</strong>
                </p>
                <a href="${props.PORTAL_LINK}/offline" class="btn-secondary">
                    🏫 Visit School Office
                </a>
                <p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
                    Note: Offline payments require physical visit, manual processing, and may take 24-48 hours for confirmation
                </p>
            </div>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <strong>💡 Quick Tip:</strong> Pay online now and avoid queue at school office. Get instant confirmation!
        </div>

        <div class="footer">
            <p><strong style="color: #3b82f6;">${props.ORGANIZATION_NAME}</strong></p>
            <p>📧 ${props.ORGANIZATION_CONTACT_EMAIL}</p>
            <p>📞 ${props.ORGANIZATION_CONTACT_PHONE}</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                This is an automated reminder. For payment assistance, visit our online portal.<br>
                Prefer online payments for faster processing and instant confirmation.
            </p>
        </div>
    </div>
</body>
</html>
`;

export const FriendlyReminderText = (props: EmailFeeTemplateProps) => `
FEE PAYMENT REMINDER - ${props.ORGANIZATION_NAME}

Dear ${props.PARENT_NAME},

URGENT: Fee payment for ${props.STUDENT_NAME} (Class ${props.GRADE}-${props.SECTION}) is due on ${props.DUE_DATE}.

OUTSTANDING AMOUNT: ${props.AMOUNT}

🚀 RECOMMENDED: INSTANT ONLINE PAYMENT
Pay securely online in 2 minutes with instant confirmation:
${props.PORTAL_LINK}

✨ Benefits of Online Payment:
• ⚡ Instant payment confirmation
• 🔒 Bank-level security
• 📱 Pay from any device
• 📄 Automatic digital receipt

🏫 Alternative (Not Recommended):
Visit school office with payment form (manual processing, 24-48 hour confirmation)

💡 Quick Tip: Pay online now to avoid queues and get instant confirmation!

Best regards,
${props.ORGANIZATION_NAME}
${props.ORGANIZATION_CONTACT_EMAIL}
${props.ORGANIZATION_CONTACT_PHONE}

Need help? Use our online portal for quick assistance.
`;
