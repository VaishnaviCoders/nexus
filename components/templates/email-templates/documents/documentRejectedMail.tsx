import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from '@react-email/components';

interface DocumentRejectionEmailProps {
  recipientName: string;
  documentType: string;
  documentName: string;
  rejectReason: string;
  documentUrl: string;
  organizationName: string;
  supportEmail: string;
  supportPhone: string;
}

const DocumentRejectionEmail = (props: DocumentRejectionEmailProps) => {
  const {
    recipientName = 'Student/Parent',
    documentType = 'Aadhaar Card',
    documentName = 'student_aadhaar.pdf',
    rejectReason = "The uploaded document appears to be a parent's document instead of the student's document",
    documentUrl = 'https://portal.school.edu/upload-documents',
    organizationName = 'ABC International School',
    supportEmail = 'support@school.edu',
    supportPhone = '+91-20-1234-5678',
  } = props;

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            <Preview>Document Upload Rejected - Action Required</Preview>

            <Section>
              <Heading className="text-[24px] font-bold text-gray-900 mb-[24px] mt-0">
                Document Upload Rejected
              </Heading>

              <Text className="text-[16px] text-gray-700 mb-[16px] mt-0">
                Dear {recipientName},
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] mt-0">
                We hope this email finds you well. We are writing to inform you
                that your recently uploaded document has been rejected and
                requires your immediate attention.
              </Text>
            </Section>

            <Section className="bg-red-50 border border-red-200 rounded-[8px] p-[20px] mb-[24px]">
              <Heading className="text-[18px] font-semibold text-red-800 mb-[12px] mt-0">
                Rejection Details
              </Heading>

              <Text className="text-[14px] text-red-700 mb-[8px] mt-0">
                <strong>Document Type:</strong> {documentType}
              </Text>

              <Text className="text-[14px] text-red-700 mb-[8px] mt-0">
                <strong>File Name:</strong> {documentName}
              </Text>

              <Text className="text-[14px] text-red-700 mb-0 mt-0">
                <strong>Reason for Rejection:</strong> {rejectReason}
              </Text>
            </Section>

            <Section>
              <Heading className="text-[18px] font-semibold text-gray-900 mb-[16px] mt-0">
                Required Action
              </Heading>

              <Text className="text-[16px] text-gray-700 mb-[16px] mt-0">
                To complete your document verification process, please follow
                these steps:
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[8px] mt-0">
                1. Review the rejection reason mentioned above
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[8px] mt-0">
                2. Ensure you upload the correct document type that matches the
                requirement
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[8px] mt-0">
                3. Verify that the document belongs to the correct person
                (student/parent as specified)
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] mt-0">
                4. Re-upload the correct document using the link below
              </Text>

              <Link
                href={documentUrl}
                className="bg-blue-600 text-white px-[24px] py-[12px] rounded-[6px] text-[16px] font-medium no-underline inline-block box-border"
              >
                Upload Correct Document
              </Link>
            </Section>

            <Hr className="border-gray-200 my-[32px]" />

            <Section>
              <Heading className="text-[18px] font-semibold text-gray-900 mb-[16px] mt-0">
                Need Help?
              </Heading>

              <Text className="text-[16px] text-gray-700 mb-[16px] mt-0">
                If you have any questions or need assistance with the document
                upload process, please don't hesitate to contact our support
                team:
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[8px] mt-0">
                <strong>Email:</strong>{' '}
                <Link
                  href={`mailto:${supportEmail}`}
                  className="text-blue-600 underline"
                >
                  {supportEmail}
                </Link>
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] mt-0">
                <strong>Phone:</strong>{' '}
                <Link
                  href={`tel:${supportPhone}`}
                  className="text-blue-600 underline"
                >
                  {supportPhone}
                </Link>
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] mt-0">
                Our support team is available Monday to Friday, 9:00 AM to 6:00
                PM (IST).
              </Text>
            </Section>

            <Section>
              <Text className="text-[16px] text-gray-700 mb-[24px] mt-0">
                Thank you for your cooperation and prompt attention to this
                matter.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[8px] mt-0">
                Best regards,
              </Text>

              <Text className="text-[16px] font-semibold text-gray-900 mb-[4px] mt-0">
                Document Verification Team
              </Text>

              <Text className="text-[16px] text-gray-700 mb-0 mt-0">
                {organizationName}
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[32px]" />

            <Section>
              <Text className="text-[12px] text-gray-500 text-center m-0">
                This is an automated message. Please do not reply to this email.
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

DocumentRejectionEmail.PreviewProps = {
  recipientName: 'Rajesh Kumar',
  documentType: 'Aadhaar Card',
  documentName: 'student_aadhaar.pdf',
  rejectReason:
    "The uploaded document appears to be a parent's Aadhaar card instead of the student's Aadhaar card. Please upload the student's Aadhaar card.",
  documentUrl: 'https://portal.school.edu/upload-documents',
  organizationName: 'ABC International School',
  supportEmail: 'support@school.edu',
  supportPhone: '+91-20-1234-5678',
};

export default DocumentRejectionEmail;
