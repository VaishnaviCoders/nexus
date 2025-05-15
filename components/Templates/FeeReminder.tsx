export const FeeReminderTemplates = [
  {
    id: 'friendly-reminder',
    name: 'Friendly Reminder',
    subject: 'Friendly Reminder: Fee Payment Due',
    message:
      'Dear Parent,\n\nThis is a friendly reminder that the fee payment for {STUDENT_NAME} is due. The total outstanding amount is {AMOUNT}.\n\nPlease make the payment at your earliest convenience to avoid any late fees.\n\nThank you for your cooperation.\n\nRegards,\nSchool Administration',
  },
  {
    id: 'first-notice',
    name: 'First Notice',
    subject: 'First Notice: Fee Payment Overdue',
    message:
      'Dear Parent,\n\nThis is to inform you that the fee payment for {STUDENT_NAME} is now overdue. The total outstanding amount is {AMOUNT}.\n\nPlease make the payment within 7 days to avoid any additional late fees.\n\nIf you have already made the payment, please disregard this notice.\n\nThank you for your cooperation.\n\nRegards,\nSchool Administration',
  },
  {
    id: 'final-notice',
    name: 'Final Notice',
    subject: 'URGENT: Final Notice for Fee Payment',
    message:
      'Dear Parent,\n\nThis is a FINAL NOTICE regarding the overdue fee payment for {STUDENT_NAME}. The total outstanding amount is {AMOUNT}.\n\nPlease note that failure to make the payment within 3 days may result in administrative actions as per school policy.\n\nIf you are facing any financial difficulties, please contact the school administration to discuss possible arrangements.\n\nThank you for your prompt attention to this matter.\n\nRegards,\nSchool Administration',
  },
  {
    id: 'custom',
    name: 'Custom Message',
    subject: '',
    message: '',
  },
];
