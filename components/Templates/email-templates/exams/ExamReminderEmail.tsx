import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
  Tailwind,
} from '@react-email/components';
import { ExamMode } from '@/generated/prisma/enums';
import { formatDateTimeIN } from '@/lib/utils';

interface ExamReminderEmailProps {
  firstName: string;
  lastName: string;
  examTitle: string;
  subject: string;
  supervisors: string[];
  organization: {
    organizationName: string;
    organizationEmail: string;
    organizationPhone: string;
  };
  startDate: Date;
  endDate: Date;
  durationInMinutes: number;
  venue: string;
  maxMarks: number;
  passingMarks: number;
  mode: ExamMode;
  instructions: string;
}

const ExamReminderEmail = ({
  firstName,
  lastName,
  examTitle,
  subject,
  startDate,
  endDate,
  durationInMinutes,
  venue,
  supervisors,
  mode,
  passingMarks,
  maxMarks,
  instructions,
  organization: { organizationName, organizationEmail, organizationPhone },
}: ExamReminderEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Important: {examTitle} in 7 days - Prepare now!</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-lg max-w-[600px] mx-auto">
            {/* Header */}
            <Section className="bg-blue-600 text-white text-center py-[32px] px-[24px] rounded-t-[8px]">
              <Heading className="text-[28px] font-bold m-0 mb-[8px]">
                📚 Exam Reminder
              </Heading>
              <Text className="text-[16px] m-0 opacity-90">7 Days to Go!</Text>
            </Section>

            {/* Main Content */}
            <Section className="px-[32px] py-[32px]">
              <Text className="text-[18px] font-semibold text-gray-800 mb-[16px]">
                Dear {firstName} {lastName},
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] leading-[24px]">
                This is a friendly reminder that your{' '}
                <strong>{examTitle}</strong> is scheduled in exactly{' '}
                <strong>7 days</strong>. It's time to finalize your preparation
                and ensure you're ready for success!
              </Text>

              {/* Exam Details Card */}
              <Section className="bg-blue-50 border border-blue-200 rounded-[8px] p-[24px] mb-[24px]">
                <Heading className="text-[20px] font-bold text-blue-800 mb-[16px] m-0">
                  📋 Exam Details
                </Heading>

                <Row className="mb-[12px]">
                  <Column className="w-[140px]">
                    <Text className="text-[14px] font-semibold text-gray-600 m-0">
                      Subject:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-[14px] text-gray-800 m-0 font-medium">
                      {subject}
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-[12px]">
                  <Column className="w-[140px]">
                    <Text className="text-[14px] font-semibold text-gray-600 m-0">
                      Date & Time:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-[14px] text-gray-800 m-0 font-medium">
                      {formatDateTimeIN(startDate)}
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-[12px]">
                  <Column className="w-[140px]">
                    <Text className="text-[14px] font-semibold text-gray-600 m-0">
                      Duration:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-[14px] text-gray-800 m-0 font-medium">
                      {durationInMinutes} minutes
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-[12px]">
                  <Column className="w-[140px]">
                    <Text className="text-[14px] font-semibold text-gray-600 m-0">
                      Mode:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-[14px] text-gray-800 m-0 font-medium">
                      {mode}
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-[12px]">
                  <Column className="w-[140px]">
                    <Text className="text-[14px] font-semibold text-gray-600 m-0">
                      Venue:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-[14px] text-gray-800 m-0 font-medium">
                      {venue}
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-[12px]">
                  <Column className="w-[140px]">
                    <Text className="text-[14px] font-semibold text-gray-600 m-0">
                      Total Marks:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-[14px] text-gray-800 m-0 font-medium">
                      {maxMarks}
                    </Text>
                  </Column>
                </Row>

                <Row>
                  <Column className="w-[140px]">
                    <Text className="text-[14px] font-semibold text-gray-600 m-0">
                      Passing Marks:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-[14px] text-gray-800 m-0 font-medium">
                      {passingMarks}
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Important Instructions */}
              {instructions && (
                <Section className="bg-yellow-50 border border-yellow-200 rounded-[8px] p-[24px] mb-[24px]">
                  <Heading className="text-[18px] font-bold text-yellow-800 mb-[12px] m-0">
                    ⚠️ Important Instructions
                  </Heading>
                  <Text className="text-[14px] text-gray-700 m-0 leading-[20px]">
                    {instructions}
                  </Text>
                </Section>
              )}

              {/* Preparation Tips */}
              <Section className="bg-green-50 border border-green-200 rounded-[8px] p-[24px] mb-[24px]">
                <Heading className="text-[18px] font-bold text-green-800 mb-[16px] m-0">
                  💡 Last Week Preparation Tips
                </Heading>
                <Text className="text-[14px] text-gray-700 mb-[12px] m-0">
                  • Review all important topics and formulas
                </Text>
                <Text className="text-[14px] text-gray-700 mb-[12px] m-0">
                  • Practice previous year questions and mock tests
                </Text>
                <Text className="text-[14px] text-gray-700 mb-[12px] m-0">
                  • Get adequate sleep and maintain a healthy routine
                </Text>
                <Text className="text-[14px] text-gray-700 mb-[12px] m-0">
                  • Prepare all required stationery and documents
                </Text>
                <Text className="text-[14px] text-gray-700 m-0">
                  • Arrive at the venue 30 minutes before exam time
                </Text>
              </Section>

              {/* Supervisors */}
              {supervisors && (
                <Section className="mb-[24px]">
                  <Text className="text-[14px] text-gray-600 mb-[8px] m-0">
                    <strong>Exam Supervisors:</strong> {supervisors}
                  </Text>
                </Section>
              )}

              <Hr className="border-gray-300 my-[24px]" />

              <Text className="text-[16px] text-gray-700 mb-[16px] leading-[24px]">
                We believe in your abilities and know you'll do great! If you
                have any questions or concerns, please don't hesitate to contact
                your teachers or the examination office.
              </Text>

              <Text className="text-[16px] font-semibold text-blue-600 mb-[8px]">
                Best of luck with your preparation! 🌟
              </Text>

              <Text className="text-[14px] text-gray-600 m-0">
                Warm regards,
                <br />
                <strong>{organizationName}</strong>
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 px-[32px] py-[24px] rounded-b-[8px] border-t border-gray-200">
              <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                {organizationName}
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                123 Education Street, Academic City, State 12345
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0">
                © {new Date().getFullYear()} {organizationName}. All rights
                reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ExamReminderEmail.PreviewProps = {
  studentName: 'Vaishnavi Raykar',
  examTitle: 'Mathematics Final Exam',
  subject: 'Advanced Mathematics',
  examDate: 'October 6, 2025',
  examTime: '10:00 AM',
  duration: '180',
  venue: 'Main Hall, Block A',
  maxMarks: '100',
  passingMarks: '40',
  examMode: 'OFFLINE',
  instructions:
    'Bring your student ID card, calculator, and blue/black pen. Mobile phones are strictly prohibited. Arrive 30 minutes before the exam starts.',
  organizationName: 'Pune Institute of Technology',
  supervisors: 'Prof. Sharma, Dr. Patel',
};

export default ExamReminderEmail;
