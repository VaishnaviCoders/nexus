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
  Tailwind,
  Row,
  Column,
} from '@react-email/components';

interface NoticeEmailTemplateProps {
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

const NoticeEmailTemplate = ({
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
}: NoticeEmailTemplateProps) => {
  const noticeTypes = [
    {
      value: 'holiday',
      label: 'Holiday',
      color: '#FF9800',
      bgColor: '#FFF3E0',
    },
    { value: 'event', label: 'Event', color: '#4CAF50', bgColor: '#E8F5E8' },
    {
      value: 'ptm',
      label: 'Parent-Teacher Meeting',
      color: '#2196F3',
      bgColor: '#E3F2FD',
    },
    {
      value: 'trip',
      label: 'School Trip',
      color: '#9C27B0',
      bgColor: '#F3E5F5',
    },
    {
      value: 'exam',
      label: 'Examination',
      color: '#F44336',
      bgColor: '#FFEBEE',
    },
    {
      value: 'announcement',
      label: 'General Announcement',
      color: '#607D8B',
      bgColor: '#ECEFF1',
    },
  ];

  const audienceOptions = [
    { id: 'students', label: 'Students', icon: '🎓' },
    { id: 'parents', label: 'Parents', icon: '👪' },
    { id: 'teachers', label: 'Teachers', icon: '👨‍🏫' },
    { id: 'admins', label: 'Admins', icon: '👷' },
  ];

  const noticeTypeInfo =
    noticeTypes.find((type) => type.value === noticeType) || noticeTypes[5];
  const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getAudienceDisplay = () => {
    return targetAudience
      .map((audience) => {
        const audienceInfo = audienceOptions.find((opt) => opt.id === audience);
        return audienceInfo ? `${audienceInfo.icon} ${audienceInfo.label}` : '';
      })
      .filter(Boolean)
      .join(', ');
  };

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>{`${organizationName}: ${title}`}</Preview>

        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="mx-auto max-w-[600px] bg-white rounded-[12px] shadow-lg overflow-hidden">
            {/* Header Section */}
            <Section className="bg-gradient-to-r from-blue-600 to-blue-800 px-[32px] py-[40px] text-center">
              <Img
                src={organizationImage}
                alt={`${organizationName} logo`}
                width="80"
                height="80"
                className="mx-auto mb-[16px] rounded-full border-4 border-white shadow-md"
              />
              <Heading className="text-[28px] font-bold text-white m-0 mb-[8px]">
                {organizationName}
              </Heading>
              <Text className="text-blue-100 text-[16px] m-0">
                Official Notice
              </Text>
            </Section>

            {/* Notice Type Badge */}
            <Section className="px-[32px] pt-[24px] pb-0">
              <div
                className="inline-block px-[16px] py-[8px] rounded-full text-[14px] font-semibold"
                style={{
                  backgroundColor: noticeTypeInfo.bgColor,
                  color: noticeTypeInfo.color,
                  border: `2px solid ${noticeTypeInfo.color}`,
                }}
              >
                {noticeTypeInfo.label}
              </div>
            </Section>

            {/* Main Content */}
            <Section className="px-[32px] py-[24px]">
              <Heading className="text-[24px] font-bold text-gray-800 mb-[24px] leading-tight">
                {title}
              </Heading>

              {/* Notice Details */}
              <Row className="mb-[24px]">
                <Column>
                  <div className="bg-gray-50 rounded-[8px] p-[20px] border border-gray-200">
                    <Row className="mb-[12px]">
                      <Column className="w-[120px]">
                        <Text className="text-[14px] font-semibold text-gray-600 m-0">
                          📅 Duration:
                        </Text>
                      </Column>
                      <Column>
                        <Text className="text-[14px] text-gray-800 m-0">
                          {formattedStartDate}
                          {startDate.getTime() !== endDate.getTime() && (
                            <span> to {formattedEndDate}</span>
                          )}
                        </Text>
                      </Column>
                    </Row>

                    <Row>
                      <Column className="w-[120px]">
                        <Text className="text-[14px] font-semibold text-gray-600 m-0">
                          👥 Audience:
                        </Text>
                      </Column>
                      <Column>
                        <Text className="text-[14px] text-gray-800 m-0">
                          {getAudienceDisplay()}
                        </Text>
                      </Column>
                    </Row>
                  </div>
                </Column>
              </Row>

              <Hr className="border-gray-200 my-[24px]" />

              {/* Notice Content */}
              <div className="bg-white border-l-4 border-blue-500 pl-[20px] py-[4px]">
                <Text className="text-[16px] text-gray-700 leading-relaxed whitespace-pre-line">
                  {content}
                </Text>
              </div>

              {/* Call to Action Button */}
              {noticeUrl && (
                <Section className="text-center mt-[32px]">
                  <Button
                    href={noticeUrl}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-[14px] px-[32px] rounded-[8px] text-[16px] no-underline box-border"
                    style={{ textDecoration: 'none' }}
                  >
                    📋 View Full Notice
                  </Button>
                </Section>
              )}
            </Section>

            <Hr className="border-gray-200 mx-[32px]" />

            {/* Footer */}
            <Section className="px-[32px] py-[24px] bg-gray-50">
              <Row className="mb-[16px]">
                <Column>
                  <Text className="text-[14px] text-gray-600 m-0">
                    <strong>Published by:</strong> {publishedBy}
                  </Text>
                </Column>
              </Row>

              <Row>
                <Column>
                  <Text className="text-[12px] text-gray-500 m-0 leading-relaxed">
                    This is an official notice from {organizationName}. If you
                    have any questions or concerns, please contact the school
                    administration immediately.
                  </Text>
                </Column>
              </Row>

              <Hr className="border-gray-300 my-[16px]" />

              <Row>
                <Column>
                  <Text className="text-[11px] text-gray-400 m-0 text-center">
                    © {new Date().getFullYear()} {organizationName}. All rights
                    reserved.
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};



export default NoticeEmailTemplate;
