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
  Link,
} from '@react-email/components';
import { NoticePriority, NoticeType } from '@/generated/prisma/enums';
import { formatDateIN } from '@/lib/utils';
import { FileSchemaType } from '@/lib/schemas';

interface NoticeEmailTemplateProps {
  id: string;
  title: string;
  content: string;
  summary: string;
  noticeType: NoticeType;
  priority: NoticePriority;
  startDate: Date;
  endDate: Date;
  isUrgent: boolean;
  targetAudience: string[];
  organizationName: string;
  publishedBy: string;
  organizationImage: string;
  createdBy: string;
  publishedAt: Date;
  // attachments: FileSchemaType[];
}

const NoticeEmailTemplate = (props: NoticeEmailTemplateProps) => {
  const {
    id,
    title,
    content,
    summary,
    noticeType,
    priority,
    startDate,
    endDate,
    createdBy,
    publishedAt,
    isUrgent,
    // attachments,
    organizationName,
    targetAudience,
  } = props;

  const getPriorityColor = (priority: NoticePriority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-600';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MEDIUM':
        return 'bg-blue-500';
      case 'LOW':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getNoticeTypeLabel = (type: NoticeType) => {
    switch (type) {
      case 'GENERAL':
        return 'General Notice';
      case 'TRIP':
        return 'Educational Trip';
      case 'EVENT':
        return 'Event Announcement';
      case 'EXAM':
        return 'Examination Notice';
      case 'HOLIDAY':
        return 'Holiday Notice';
      case 'DEADLINE':
        return 'Important Deadline';
      case 'TIMETABLE':
        return 'Timetable Update';
      case 'RESULT':
        return 'Result Declaration';
      default:
        return 'Notice';
    }
  };

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>
          {summary || `${getNoticeTypeLabel(noticeType)}: ${title}`}
        </Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-lg max-w-[600px] mx-auto">
            {/* Header */}
            <Section className="bg-blue-600 text-white text-center py-[24px] rounded-t-[8px]">
              <Heading className="text-[24px] font-bold m-0 mb-[8px]">
                {organizationName}
              </Heading>
              <Text className="text-[14px] m-0 opacity-90">
                Official Notice Communication
              </Text>
            </Section>

            {/* Priority Badge */}
            {(isUrgent || priority === 'URGENT' || priority === 'HIGH') && (
              <Section className="px-[32px] pt-[24px]">
                <div
                  className={`inline-block px-[16px] py-[8px] rounded-[20px] text-white text-[12px] font-bold ${getPriorityColor(priority)}`}
                >
                  {isUrgent ? '🚨 URGENT' : `${priority} PRIORITY`}
                </div>
              </Section>
            )}

            {/* Notice Content */}
            <Section className="px-[32px] py-[24px]">
              <div className="mb-[16px]">
                <Text className="text-[12px] text-gray-600 m-0 mb-[4px] font-semibold">
                  {getNoticeTypeLabel(noticeType)}
                </Text>
                <Heading className="text-[20px] font-bold text-gray-900 m-0 leading-[1.3]">
                  {title}
                </Heading>
              </div>

              {summary && (
                <div className="bg-blue-50 border-l-[4px] border-blue-500 p-[16px] mb-[24px]">
                  <Text className="text-[14px] text-blue-800 m-0 font-medium">
                    📋 Summary: {summary}
                  </Text>
                </div>
              )}

              <div className="mb-[24px]">
                <Text className="text-[14px] text-gray-700 leading-[1.6] m-0 whitespace-pre-line">
                  {content}
                </Text>
              </div>

              {/* Date Information */}
              <div className="bg-gray-50 rounded-[8px] p-[16px] mb-[24px] ">
                <Text className="text-[12px] font-semibold text-gray-600 m-0 mb-[8px]">
                  📅 Important Dates
                </Text>
                {startDate && (
                  <Text className="text-[13px] text-gray-700 m-0 mb-[4px]">
                    <strong>Start Date:</strong> {formatDateIN(startDate)}
                  </Text>
                )}
                {endDate && (
                  <Text className="text-[13px] text-gray-700 m-0 mb-[4px]">
                    <strong>End Date:</strong> {formatDateIN(endDate)}
                  </Text>
                )}
                <Text className="text-[13px] text-gray-700 m-0">
                  <strong>Published:</strong> {formatDateIN(publishedAt)}
                </Text>
              </div>

              {/* Target Audience */}
              {targetAudience && targetAudience.length > 0 && (
                <div className="mb-[24px]">
                  <Text className="text-[12px] font-semibold text-gray-600 m-0 mb-[8px]">
                    👥 Notice For
                  </Text>
                  <Text className="text-[13px] text-gray-700 m-0">
                    {targetAudience.join(', ')}
                  </Text>
                </div>
              )}

              {/* Attachments */}
              {/* {attachments && attachments.length > 0 && (
                <div className="mb-[24px]">
                  <Text className="text-[12px] font-semibold text-gray-600 m-0 mb-[12px]">
                    📎 Attachments
                  </Text>
                  {attachments.map((attachment, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-[6px] p-[12px] mb-[8px]">
                      <Link
                        href={attachment.url}
                        className="text-blue-600 text-[13px] font-medium no-underline hover:underline"
                      >
                        📄 {attachment.fileName}
                      </Link>
                      <Text className="text-[11px] text-gray-500 m-0 mt-[4px]">
                        {attachment.fileType.toUpperCase()} • {Math.round(attachment.fileSize / 1024)} KB
                      </Text>
                    </div>
                  ))}
                </div>
              )} */}

              {/* Call to Action */}
              <div className="text-center mb-[24px]">
                <Button
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/notices/${id}}`}
                  className="bg-blue-600 text-white px-[32px] py-[12px] rounded-[6px] text-[14px] font-semibold no-underline box-border"
                >
                  View Full Notice
                </Button>
              </div>
            </Section>

            <Hr className="border-gray-200 mx-[32px]" />

            {/* Footer */}
            <Section className="px-[32px] py-[24px] text-center">
              <Text className="text-[11px] text-gray-500 m-0 mb-[8px]">
                <strong>Notice issued by:</strong> {createdBy}
              </Text>
              <Text className="text-[11px] text-gray-500 m-0 mb-[16px]">
                This is an official communication from {organizationName}
              </Text>

              <Text className="text-[10px] text-gray-400 m-0 mb-[4px]">
                {organizationName}
              </Text>
              <Text className="text-[10px] text-gray-400 m-0 mb-[8px]">
                Education Campus, Academic District, Pune, Maharashtra 411001
              </Text>

              <Link
                href="#"
                className="text-[10px] text-blue-600 no-underline hover:underline"
              >
                Unsubscribe from notices
              </Link>
              <Text className="text-[10px] text-gray-400 m-0 mt-[8px]">
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

export default NoticeEmailTemplate;
