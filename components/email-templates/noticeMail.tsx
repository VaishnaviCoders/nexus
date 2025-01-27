import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Img,
} from '@react-email/components';
import * as React from 'react';

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
  { id: 'all', label: 'All', icon: '👥' },
  { id: 'students', label: 'Students', icon: '🎓' },
  { id: 'parents', label: 'Parents', icon: '👪' },
  { id: 'teachers', label: 'Teachers', icon: '👨‍🏫' },
  { id: 'staff', label: 'Staff', icon: '👷' },
];

const getNoticeTypeLabel = (value: string) => {
  const type = noticeTypes.find((t) => t.value === value);
  return type ? type.label : value;
};

const getNoticeTypeColor = (value: string) => {
  const type = noticeTypes.find((t) => t.value === value);
  return type ? type.color : '#000000';
};

const getAudienceLabels = (audiences: string[]) => {
  return audiences
    .map((a) => {
      const audience = audienceOptions.find((opt) => opt.id === a);
      return audience ? `${audience.icon} ${audience.label}` : a;
    })
    .join(' • ');
};

export const NoticeEmailTemp = ({
  content,
  noticeType,
  startDate,
  publishedBy,
  targetAudience,
  title,
  organizationName,
  endDate,
  noticeUrl,
  organizationImage,
}: NoticeEmailTempProps) => {
  const previewText = `New ${getNoticeTypeLabel(noticeType)} from ${organizationName}: ${title}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Img
            src={organizationImage}
            width="120"
            height="auto"
            alt={organizationName}
            style={logo}
          />
          <Section style={headerSection}>
            <Heading style={heading}>{title}</Heading>
            <Text
              style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                backgroundColor: getNoticeTypeColor(noticeType),
              }}
            >
              {getNoticeTypeLabel(noticeType)}
            </Text>
          </Section>
          <Section style={noticeContainer}>
            <Text style={noticeDate}>
              📅{' '}
              {new Intl.DateTimeFormat('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }).format(startDate)}
              {startDate.toDateString() !== endDate.toDateString() && (
                <>
                  {' '}
                  -{' '}
                  {new Intl.DateTimeFormat('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }).format(endDate)}
                </>
              )}
            </Text>
            <Text style={noticeAudience}>
              {getAudienceLabels(targetAudience)}
            </Text>
            <Text style={noticeContent}>{content}</Text>
            <Button style={button} href={noticeUrl}>
              View Full Notice
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            This notice was sent from {organizationName}. Published by{' '}
            {publishedBy}.
          </Text>
          <Text style={footer}>
            If you have any questions, please{' '}
            <Link
              href={`mailto:support@${organizationName.toLowerCase()}.com`}
              style={link}
            >
              contact support
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f0f4f8',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '100%',
  maxWidth: '600px',
};

const logo = {
  margin: '0 auto 32px',
  display: 'block',
};

const headerSection = {
  padding: '32px',
  backgroundColor: '#ffffff',
  borderRadius: '8px 8px 0 0',
  textAlign: 'center' as const,
};

const heading = {
  fontSize: '28px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#1a202c',
};

const noticeType = {
  display: 'inline-block',
  padding: '6px 12px',
  borderRadius: '16px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#ffffff',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

const noticeContainer = {
  backgroundColor: '#ffffff',
  borderRadius: '0 0 8px 8px',
  padding: '32px',
};

const noticeDate = {
  fontSize: '16px',
  color: '#4a5568',
  marginBottom: '16px',
};

const noticeAudience = {
  fontSize: '16px',
  color: '#4a5568',
  marginBottom: '24px',
};

const noticeContent = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#2d3748',
  marginBottom: '32px',
};

const button = {
  backgroundColor: '#4299e1',
  borderRadius: '4px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px 0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 0',
};

const footer = {
  color: '#718096',
  fontSize: '14px',
  lineHeight: '24px',
  textAlign: 'center' as const,
};

const link = {
  color: '#4299e1',
  textDecoration: 'underline',
};

export default NoticeEmailTemp;
