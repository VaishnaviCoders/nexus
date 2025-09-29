import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr,
  Tailwind,
} from '@react-email/components';

const DocumentVerifiedEmail = (props: {
  name: string;
  documentName: string;
  studentId?: string;
  supportEmail: string;
}) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            {/* Header Section */}
            <Section className="text-center mb-[32px]">
              <div className="inline-flex items-center justify-center w-[80px] h-[80px] bg-green-100 rounded-full mb-[16px]">
                <Text className="text-[40px] m-0">✅</Text>
              </div>
              <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[8px]">
                Document Successfully Verified!
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                Your submission has been reviewed and approved
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-900 mb-[16px] m-0">
                Dear {props.name},
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[16px] m-0 leading-[24px]">
                We're pleased to inform you that your{' '}
                <strong>{props.documentName}</strong> has been successfully
                verified and approved by our team.
              </Text>

              {props.studentId && (
                <div className="bg-gray-50 rounded-[8px] p-[16px] mb-[16px]">
                  <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                    Student ID:
                  </Text>
                  <Text className="text-[16px] font-semibold text-gray-900 m-0">
                    {props.studentId}
                  </Text>
                </div>
              )}

              <Text className="text-[16px] text-gray-700 mb-[24px] m-0 leading-[24px]">
                <strong>What happens next?</strong>
                <br />
                No further action is required from your side. Your document is
                now part of your verified records, and you can proceed with your
                enrollment process.
              </Text>

              <div className="bg-green-50 border-l-[4px] border-solid border-green-500 p-[16px] rounded-r-[4px]">
                <Text className="text-[14px] text-green-800 m-0 font-medium">
                  ✓ Document Status: Verified and Approved
                </Text>
              </div>
            </Section>

            {/* Action Button */}
            <Section className="text-center mb-[32px]">
              <Button
                href="#"
                className="bg-blue-600 text-white px-[32px] py-[12px] rounded-[6px] text-[16px] font-medium no-underline box-border"
              >
                View Your Dashboard
              </Button>
            </Section>

            <Hr className="border-gray-200 my-[24px]" />

            {/* Support Section */}
            <Section className="mb-[24px]">
              <Text className="text-[14px] text-gray-600 m-0 mb-[8px]">
                Need help or have questions?
              </Text>
              <Text className="text-[14px] text-gray-700 m-0">
                Contact our support team at{' '}
                <a
                  href={`mailto:${props.supportEmail}`}
                  className="text-blue-600 no-underline"
                >
                  {props.supportEmail}
                </a>
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-solid border-gray-200 pt-[24px]">
              <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                © 2025 Educational Institution. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0">
                123 Education Street, Learning City, LC 12345
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

DocumentVerifiedEmail.PreviewProps = {
  name: 'Priya Sharma',
  documentName: 'Birth Certificate',
  studentId: 'STU2025001',
  supportEmail: 'support@school.edu',
};

export default DocumentVerifiedEmail;
