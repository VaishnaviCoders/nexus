import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Img,
} from '@react-email/components';

interface NoticeEmailTempProps {
  title: string;
  content: string;
  noticeType: string;
  startDate: Date;
  endDate: Date;
  targetAudience: string[];
  organizationName: string;
  publishedBy: string;
  organizationImage: string;
  noticeUrl?: string;
}

const noticeTypes = [
  { value: 'holiday', label: 'Holiday', color: '#FF9800' },
  { value: 'event', label: 'Event', color: '#4CAF50' },
  { value: 'ptm', label: 'Parent-Teacher Meeting', color: '#2196F3' },
  { value: 'trip', label: 'School Trip', color: '#9C27B0' },
  { value: 'exam', label: 'Examination', color: '#F44336' },
  { value: 'announcement', label: 'General Announcement', color: '#607D8B' },
];

const audienceOptions = [
  { id: 'students', label: 'Students', icon: '🎓' },
  { id: 'parents', label: 'Parents', icon: '👪' },
  { id: 'teachers', label: 'Teachers', icon: '👨‍🏫' },
  { id: 'admins', label: 'Admins', icon: '👷' },
];

export const NoticeEmailTemplate: React.FC<Readonly<NoticeEmailTempProps>> = ({
  title,
  content,
  noticeType,
  startDate,
  endDate,
  targetAudience,
  organizationName,
  publishedBy,
  organizationImage,
  noticeUrl,
}) => {
  const noticeTypeInfo =
    noticeTypes.find((type) => type.value === noticeType) || noticeTypes[5];

  const formattedStartDate = new Date(startDate).toDateString(); // Simple, deterministic
  const formattedEndDate = new Date(endDate).toDateString();

  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>

      <Body className="bg-gray-100 font-sans">
        <Container className="mx-auto my-10 max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
          <Section className="bg-gray-800 p-6 text-center">
            <Img
              src={organizationImage}
              alt={organizationName}
              width="100"
              height="100"
              className="mx-auto mb-4 rounded-full"
            />
            <Heading className="text-2xl font-bold text-white m-0">
              {organizationName}
            </Heading>
          </Section>

          <Section className="px-8 py-6">
            <Heading className="text-2xl font-bold mb-2">{title}</Heading>
            <div
              className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4"
              style={{
                backgroundColor: noticeTypeInfo.color,
                color: '#ffffff',
              }}
            >
              {noticeTypeInfo.label}
            </div>

            <Text className="text-gray-700 mb-4">
              <strong>Date:</strong> {formattedStartDate} - {formattedEndDate}
            </Text>

            <Text className="text-gray-700 mb-4">
              <strong>Target Audience:</strong>{' '}
              {targetAudience.map((audience) => {
                const audienceInfo = audienceOptions.find(
                  (opt) => opt.id === audience
                );
                return audienceInfo
                  ? `${audienceInfo.icon} ${audienceInfo.label} `
                  : '';
              })}
            </Text>

            <Hr className="border-gray-300 my-6" />

            <Text className="text-gray-700 mb-6 whitespace-pre-line">
              {content}
            </Text>

            {noticeUrl && (
              <Button
                href={noticeUrl}
                className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-center block w-full"
              >
                View Full Notice
              </Button>
            )}
          </Section>

          <Hr className="border-gray-300 my-6 mx-8 " />

          <Section className="px-8 py-6 bg-gray-100 text-center rounded-md">
            <Text className="text-gray-700 mb-6 whitespace-pre-line">
              Note: This notice was sent from {organizationName}. Published by{' '}
              {publishedBy}.
            </Text>
            <Text className="text-sm text-gray-600">
              If you have any questions, please contact the school
              administration.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NoticeEmailTemplate;
