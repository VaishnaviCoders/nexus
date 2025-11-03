import { DocumentType } from '@/generated/prisma/enums';
import { StudentDocument } from '@/types/document';
import {
  ChartColumnBigIcon,
  CheckCircle2,
  Clock,
  DatabaseIcon,
  FileText,
  Lock,
  Search,
  TrendingUpIcon,
  WandSparklesIcon,
  XCircle,
  ZapIcon,
} from 'lucide-react';

export const indianEducationProblems = [
  {
    id: 1,
    title: 'Student Document Verification Chaos',
    subtitle: 'छात्रों के डॉक्यूमेंट वेरिफिकेशन में उलझन',
    description:
      'Aadhaar cards, birth certificates, transfer certificates - everything scattered. Manual verification takes weeks, documents get lost.',
    features: [
      'Digital document upload system',
      'Real-time verification status tracking',
      'Admin approval/rejection workflow',
      'Secure document storage & access',
    ],
  },
  {
    id: 2,
    title: 'Anonymous Complaints Management',
    subtitle: 'शिकायतों और फीडबैक का सही चैनल नहीं',
    description:
      'Students/parents fear speaking up. Serious issues like bullying, harassment go unreported. No proper resolution mechanism.',
    features: [
      'Secure anonymous complaint box',
      'Confidential issue reporting',
      'Admin investigation workflow',
      'Resolution tracking without revealing identity',
    ],
  },
  {
    id: 3,
    title: 'Manual Attendance Headache',
    subtitle: 'हाथ से अटेंडेंस लिखने की मुसीबत',
    description:
      "Paper registers, manual calculations, no real-time data. Parents don't know when their child is absent.",
    features: [
      'One-click digital attendance',
      'AI-powered attendance suggestions',
      'Real-time parent alerts via SMS/WhatsApp',
      'Automated attendance reports & analytics',
    ],
  },
  {
    id: 4,
    title: 'Fee Collection Nightmare',
    subtitle: 'फीस कलेक्शन का सबसे बड़ा तनाव',
    description:
      'Chasing parents for payments, manual receipt writing, payment tracking chaos, no transparency.',
    features: [
      'Online payments via UPI/Cards/Net Banking',
      'Automated fee reminders & receipts',
      'Real-time collection dashboard',
      'Complete payment history & audit trail',
    ],
  },
  {
    id: 5,
    title: 'Admission & Lead Management Stress',
    subtitle: 'एडमिशन सीजन में लीड मैनेजमेंट की टेंशन',
    description:
      'Leads from Google/FB/WhatsApp get lost. No proper follow-up system. Manual admission process takes hours.',
    features: [
      'Centralized lead management dashboard',
      'Automated follow-up reminders',
      'Digital admission forms & document upload',
      'Bulk student onboarding system',
    ],
  },
  {
    id: 6,
    title: 'Exam Management Complexity',
    subtitle: 'एग्जाम मैनेजमेंट में लगता है पूरा समय',
    description:
      'Creating exams, hall tickets, result entry, report cards - everything manual and time-consuming.',
    features: [
      'Bulk exam creation & management',
      'QR code hall tickets with PWA scanning',
      'Digital result entry system',
      'Auto-generated report cards with notifications',
    ],
  },
];

export const institutes = [
  {
    id: 1,
    name: 'St. Xavier’s High School',
    image: '/avatars/avatar1.jpg',
    paragraph:
      'Managing attendance and fee tracking is now a breeze with Shiksha Cloud.',
  },
  {
    id: 2,
    name: 'Bright Future Public School',
    image: '/avatars/avatar2.jpg',
    paragraph:
      'We’ve replaced paper registers with digital dashboards—parents love the updates.',
  },
  {
    id: 3,
    name: 'City Pride Junior College',
    image: '/avatars/avatar3.jpg',
    paragraph:
      'Shiksha Cloud helped us centralize student data and simplify parent communication.',
  },
  {
    id: 4,
    name: 'Little Scholars Academy',
    image: '/avatars/avatar4.jpg',
    paragraph:
      'Our teachers spend more time teaching and less time on admin work now.',
  },
  {
    id: 5,
    name: 'EduBridge Coaching Center',
    image: '/avatars/avatar5.jpg',
    paragraph:
      'Admissions, leads, and follow-ups—all managed in one place effortlessly.',
  },
  {
    id: 6,
    name: 'Sunrise International School',
    image: '/avatars/avatar6.jpg',
    paragraph: 'Parents get real-time alerts about attendance and performance.',
  },
  {
    id: 7,
    name: 'Wisdom Valley High',
    image: '/avatars/avatar7.jpg',
    paragraph:
      'We run all our branches on Shiksha Cloud—smooth, fast, and reliable.',
  },
  {
    id: 8,
    name: 'Bloomfield Montessori',
    image: '/avatars/avatar8.jpg',
    paragraph:
      'Our staff onboarding is faster than ever with digital document tracking.',
  },
  {
    id: 9,
    name: 'National Convent School',
    image: '/avatars/avatar9.jpg',
    paragraph:
      'From fee reminders to report cards, everything is automated now.',
  },
  {
    id: 10,
    name: 'Elite Coaching Classes',
    image: '/avatars/avatar10.jpg',
    paragraph:
      'CRM integration helped us increase enrollments by 30% this season.',
  },
  {
    id: 11,
    name: 'Greenwood Academy',
    image: '/avatars/avatar11.jpg',
    paragraph:
      'Shiksha Cloud simplified our attendance and fee reconciliation process.',
  },
  {
    id: 12,
    name: 'Blue Horizon Public School',
    image: '/avatars/avatar12.jpg',
    paragraph:
      'The parent dashboard keeps families updated without extra effort.',
  },
  {
    id: 13,
    name: 'Achievers Science Hub',
    image: '/avatars/avatar13.jpg',
    paragraph: 'We manage leads from Google Ads seamlessly through the CRM.',
  },
  {
    id: 14,
    name: 'Silver Oak High School',
    image: '/avatars/avatar14.jpg',
    paragraph:
      'Switching from Excel to Shiksha Cloud was the best decision for us.',
  },
  {
    id: 15,
    name: 'Future Minds Academy',
    image: '/avatars/avatar15.jpg',
    paragraph: 'Our teachers now mark attendance digitally in seconds.',
  },
  {
    id: 16,
    name: 'Harmony Public School',
    image: '/avatars/avatar16.jpg',
    paragraph: 'Shiksha Cloud made data management transparent and organized.',
  },
  {
    id: 17,
    name: 'Apex Junior College',
    image: '/avatars/avatar17.jpg',
    paragraph:
      'The online payment system is smooth and reliable for all parents.',
  },
  {
    id: 18,
    name: 'Galaxy English Medium School',
    image: '/avatars/avatar18.jpg',
    paragraph: 'Managing grades and sections has never been this easy.',
  },
  {
    id: 19,
    name: 'Scholars Den Coaching',
    image: '/avatars/avatar19.jpg',
    paragraph:
      'We track every inquiry to admission using built-in lead management.',
  },
  {
    id: 20,
    name: 'Smart Vision School',
    image: '/avatars/avatar20.jpg',
    paragraph:
      'Our admins love the analytics dashboard—it’s clear and powerful.',
  },
  {
    id: 21,
    name: 'Nirmal Jyoti High School',
    image: '/avatars/avatar21.jpg',
    paragraph: 'All student documents are now digital and securely stored.',
  },
  {
    id: 22,
    name: 'Kumar Science Academy',
    image: '/avatars/avatar22.jpg',
    paragraph: 'Shiksha Cloud gave us complete visibility across all batches.',
  },
  {
    id: 23,
    name: 'Oxford International School',
    image: '/avatars/avatar23.jpg',
    paragraph:
      'Parents appreciate getting instant alerts on attendance and grades.',
  },
  {
    id: 24,
    name: 'EduPoint Tutorials',
    image: '/avatars/avatar24.jpg',
    paragraph: 'Fee reminders go automatically—no more manual follow-ups.',
  },
  {
    id: 25,
    name: 'Heritage Convent',
    image: '/avatars/avatar25.jpg',
    paragraph: 'Our teachers collaborate better now with centralized access.',
  },
  {
    id: 26,
    name: 'Bright Scholars Academy',
    image: '/avatars/avatar26.jpg',
    paragraph:
      'Digital notices save us hours of manual communication each week.',
  },
  {
    id: 27,
    name: 'Zenith Commerce Classes',
    image: '/avatars/avatar27.jpg',
    paragraph: 'CRM tracking helped us convert more leads into admissions.',
  },
  {
    id: 28,
    name: 'Pragati Coaching Institute',
    image: '/avatars/avatar28.jpg',
    paragraph:
      'Automated reports helped us stay audit-ready throughout the year.',
  },
  {
    id: 29,
    name: 'Shree Vidya Mandir',
    image: '/avatars/avatar29.jpg',
    paragraph: 'We now run a paperless office—thanks to Shiksha Cloud.',
  },
  {
    id: 30,
    name: 'Newton’s Edge Learning',
    image: '/avatars/avatar30.jpg',
    paragraph: 'Smart tools helped us scale from 300 to 1200 students easily.',
  },
  {
    id: 31,
    name: 'Alpha Public School',
    image: '/avatars/avatar31.jpg',
    paragraph: 'Role-based dashboards make everyone’s work smoother.',
  },
  {
    id: 32,
    name: 'Mentor Academy',
    image: '/avatars/avatar32.jpg',
    paragraph: 'Our teachers track student performance with ease now.',
  },
  {
    id: 33,
    name: 'Excel Tutorials',
    image: '/avatars/avatar33.jpg',
    paragraph: 'Automated notifications improved our communication instantly.',
  },
  {
    id: 34,
    name: 'Sharda Vidyalaya',
    image: '/avatars/avatar34.jpg',
    paragraph: 'Parents can check results and attendance on their phones.',
  },
  {
    id: 35,
    name: 'TopRank Coaching',
    image: '/avatars/avatar35.jpg',
    paragraph: 'Leads from Facebook Ads directly flow into our CRM dashboard.',
  },
  {
    id: 36,
    name: 'Mount Carmel School',
    image: '/avatars/avatar36.jpg',
    paragraph: 'Everything—from attendance to documents—is cloud managed.',
  },
  {
    id: 37,
    name: 'Inspire Academy',
    image: '/avatars/avatar37.jpg',
    paragraph: 'We use analytics to monitor attendance and engagement daily.',
  },
  {
    id: 38,
    name: 'Vision Coaching Center',
    image: '/avatars/avatar38.jpg',
    paragraph: 'Our counselors track and convert inquiries faster than before.',
  },
  {
    id: 39,
    name: 'Sai International School',
    image: '/avatars/avatar39.jpg',
    paragraph: 'Shiksha Cloud reduced our admin workload by over 60%.',
  },
  {
    id: 40,
    name: 'Bright Path Junior College',
    image: '/avatars/avatar40.jpg',
    paragraph: 'Students and parents both love the new digital experience.',
  },
  {
    id: 41,
    name: 'MindSpace Coaching',
    image: '/avatars/avatar41.jpg',
    paragraph: 'Tracking leads and follow-ups has become effortless for us.',
  },
  {
    id: 42,
    name: 'Sunbeam Public School',
    image: '/avatars/avatar42.jpg',
    paragraph: 'No more lost records—every detail is securely stored online.',
  },
  {
    id: 43,
    name: 'Trinity Convent School',
    image: '/avatars/avatar43.jpg',
    paragraph: 'Online payments made collections easy for all parents.',
  },
  {
    id: 44,
    name: 'StepUp Coaching Institute',
    image: '/avatars/avatar44.jpg',
    paragraph: 'We now manage multiple batches without any confusion.',
  },
  {
    id: 45,
    name: 'Cambridge Junior College',
    image: '/avatars/avatar45.jpg',
    paragraph: 'We get accurate reports on attendance and fees instantly.',
  },
  {
    id: 46,
    name: 'Daffodil High School',
    image: '/avatars/avatar46.jpg',
    paragraph: 'Digital circulars replaced manual notice boards completely.',
  },
  {
    id: 47,
    name: 'Rising Star Academy',
    image: '/avatars/avatar47.jpg',
    paragraph:
      'Parents appreciate getting notifications instantly on WhatsApp.',
  },
  {
    id: 48,
    name: 'Alpha Tutorials',
    image: '/avatars/avatar48.jpg',
    paragraph: 'Everything runs smoothly—attendance, fees, communication.',
  },
  {
    id: 49,
    name: 'Kidz Orbit Pre-School',
    image: '/avatars/avatar49.jpg',
    paragraph: 'Managing tiny tots’ attendance is finally easy and fun.',
  },
  {
    id: 50,
    name: 'Bright Minds Learning Center',
    image: '/avatars/avatar50.jpg',
    paragraph: 'We use the mobile app daily—parents love its simplicity.',
  },
  {
    id: 51,
    name: 'City Scholars College',
    image: '/avatars/avatar51.jpg',
    paragraph: 'Fee receipts are auto-generated and error-free now.',
  },
  {
    id: 52,
    name: 'EduWave Coaching',
    image: '/avatars/avatar52.jpg',
    paragraph: 'CRM integration simplified our admission process entirely.',
  },
  {
    id: 53,
    name: 'Pioneer Convent',
    image: '/avatars/avatar53.jpg',
    paragraph: 'The dashboard is intuitive—no training required.',
  },
  {
    id: 54,
    name: 'Visionary Public School',
    image: '/avatars/avatar54.jpg',
    paragraph: 'Transparency between parents and teachers improved a lot.',
  },
  {
    id: 55,
    name: 'National Academy',
    image: '/avatars/avatar55.jpg',
    paragraph: 'Document verification takes minutes instead of days.',
  },
  {
    id: 56,
    name: 'Modern Edge Institute',
    image: '/avatars/avatar56.jpg',
    paragraph: 'We handle 5 branches from one admin dashboard now.',
  },
  {
    id: 57,
    name: 'Smart Steps Academy',
    image: '/avatars/avatar57.jpg',
    paragraph: 'All communication logs are stored neatly for future reference.',
  },
  {
    id: 58,
    name: 'Global Convent School',
    image: '/avatars/avatar58.jpg',
    paragraph: 'Our multi-branch data is synchronized automatically.',
  },
  {
    id: 59,
    name: 'Excel Academy',
    image: '/avatars/avatar59.jpg',
    paragraph: 'We save hours every week thanks to automation tools.',
  },
  {
    id: 60,
    name: 'Shanti Vidyalaya',
    image: '/avatars/avatar60.jpg',
    paragraph: 'Parents can now download fee receipts anytime they want.',
  },
  {
    id: 61,
    name: 'EduNext Coaching',
    image: '/avatars/avatar61.jpg',
    paragraph: 'Leads from WhatsApp ads are captured automatically.',
  },
  {
    id: 62,
    name: 'Springdale High School',
    image: '/avatars/avatar62.jpg',
    paragraph: 'Attendance analytics help us monitor trends quickly.',
  },
  {
    id: 63,
    name: 'MindBloom Academy',
    image: '/avatars/avatar63.jpg',
    paragraph: 'Our teachers no longer rely on paper registers.',
  },
  {
    id: 64,
    name: 'Innova Public School',
    image: '/avatars/avatar64.jpg',
    paragraph: 'The admin dashboard is our go-to for daily operations.',
  },
  {
    id: 65,
    name: 'Peak Performance Coaching',
    image: '/avatars/avatar65.jpg',
    paragraph: 'Lead management improved our admission rate significantly.',
  },
  {
    id: 66,
    name: 'Alpha Beta International School',
    image: '/avatars/avatar66.jpg',
    paragraph: 'Everything is digital, organized, and parent-friendly.',
  },
  {
    id: 67,
    name: 'Elite Edge Tutorials',
    image: '/avatars/avatar67.jpg',
    paragraph: 'With Shiksha Cloud, our teachers feel empowered and efficient.',
  },
  {
    id: 68,
    name: 'New Era Junior College',
    image: '/avatars/avatar68.jpg',
    paragraph: 'Instant notifications make communication much faster.',
  },
  {
    id: 69,
    name: 'SmartStart Academy',
    image: '/avatars/avatar69.jpg',
    paragraph: 'Fee collection tracking is now fully automated.',
  },
  {
    id: 70,
    name: 'Evergreen Public School',
    image: '/avatars/avatar70.jpg',
    paragraph: 'We trust Shiksha Cloud to run our entire school digitally.',
  },
  {
    id: 71,
    name: 'Bright Future High School',
    image: '/avatars/avatar71.jpg',
    paragraph:
      'Managing fees and attendance has never been easier. Shiksha Cloud saves us hours every week.',
  },
  {
    id: 72,
    name: 'Sunrise International School',
    image: '/avatars/avatar72.jpg',
    paragraph:
      'Parents love getting instant updates — no more WhatsApp chaos. Everything is on one dashboard.',
  },
  {
    id: 73,
    name: 'Bluebell Public School',
    image: '/avatars/avatar73.jpg',
    paragraph:
      'Our teachers find the attendance module fast and reliable. We’ve completely stopped using paper registers.',
  },
  {
    id: 74,
    name: 'Mount View Academy',
    image: '/avatars/avatar74.jpg',
    paragraph:
      'The dashboard gives us total control — from fee tracking to staff reports. Super helpful for admins.',
  },
  {
    id: 75,
    name: 'Harmony Convent School',
    image: '/avatars/avatar75.jpg',
    paragraph:
      'Setup took less than a day. Everything just works out of the box — perfect for schools like ours.',
  },
  {
    id: 76,
    name: 'Oxford Junior College',
    image: '/avatars/avatar76.jpg',
    paragraph:
      'We switched from spreadsheets to Shiksha Cloud — now everything is automated and beautifully organized.',
  },
  {
    id: 77,
    name: 'Little Champs Pre-School',
    image: '/avatars/avatar77.jpg',
    paragraph:
      'Our parents are happier than ever. Fee payments and communication are seamless now.',
  },
  {
    id: 78,
    name: 'Hillcrest Senior Secondary',
    image: '/avatars/avatar78.jpg',
    paragraph:
      'The admin dashboard gives a clear picture of daily operations. Reports are detailed and easy to export.',
  },
  {
    id: 79,
    name: 'Elite Scholars Academy',
    image: '/avatars/avatar79.jpg',
    paragraph:
      'We finally have one place for attendance, communication, and reports — all in real time.',
  },
  {
    id: 80,
    name: 'Greenfield Convent School',
    image: '/avatars/avatar80.jpg',
    paragraph:
      'Everything feels so organized now. The automation has reduced our manual work by half.',
  },
  {
    id: 81,
    name: 'Riverdale Public School',
    image: '/avatars/avatar81.jpg',
    paragraph:
      'As a principal, I love how transparent the system is. Parents and teachers are finally on the same page.',
  },
  {
    id: 82,
    name: 'Galaxy Coaching Center',
    image: '/avatars/avatar82.jpg',
    paragraph:
      'Lead management and student tracking are top-notch. We no longer lose inquiries.',
  },
  {
    id: 83,
    name: 'Knowledge Tree Academy',
    image: '/avatars/avatar83.jpg',
    paragraph:
      'Smooth interface and fast performance. Even our less tech-savvy staff adapted quickly.',
  },
  {
    id: 84,
    name: 'Inspire Learning Hub',
    image: '/avatars/avatar84.jpg',
    paragraph:
      'I’ve tried three school CRMs — Shiksha Cloud is the only one that delivers everything it promises.',
  },
  {
    id: 85,
    name: 'NextGen Tutorials',
    image: '/avatars/avatar85.jpg',
    paragraph:
      'Attendance, fees, and results — all in one place. Makes managing coaching batches effortless.',
  },
  {
    id: 86,
    name: 'Vision Valley School',
    image: '/avatars/avatar86.jpg',
    paragraph:
      'Real-time notifications to parents have completely changed how we communicate.',
  },
  {
    id: 87,
    name: 'StepUp Coaching Institute',
    image: '/avatars/avatar87.jpg',
    paragraph:
      'The lead follow-up feature helps us convert inquiries much faster than before.',
  },
  {
    id: 88,
    name: 'Starlight High School',
    image: '/avatars/avatar88.jpg',
    paragraph:
      'No more missed payments or lost documents. Shiksha Cloud keeps everything organized for us.',
  },
  {
    id: 89,
    name: 'City Edge Academy',
    image: '/avatars/avatar89.jpg',
    paragraph:
      'Our teachers love the clean interface. Attendance and reports are just a few clicks away.',
  },
  {
    id: 90,
    name: 'DreamPath International',
    image: '/avatars/avatar90.jpg',
    paragraph:
      'The parent portal is a game-changer. Parents get every update instantly.',
  },
  {
    id: 91,
    name: 'Wisdom Public School',
    image: '/avatars/avatar91.jpg',
    paragraph:
      'We’ve gone completely paperless. Shiksha Cloud made digital transformation simple.',
  },
  {
    id: 92,
    name: 'Global Heights Academy',
    image: '/avatars/avatar92.jpg',
    paragraph:
      'Support is amazing — they listen to feedback and actually roll out updates based on it.',
  },
  {
    id: 93,
    name: 'Mentor Academy',
    image: '/avatars/avatar93.jpg',
    paragraph:
      'Document verification workflow has saved us countless hours during admissions.',
  },
  {
    id: 94,
    name: 'Silver Oak Public School',
    image: '/avatars/avatar94.jpg',
    paragraph:
      'The analytics dashboard gives deep insights into attendance and fee trends. Very useful for planning.',
  },
  {
    id: 95,
    name: 'Smart Minds Junior School',
    image: '/avatars/avatar95.jpg',
    paragraph:
      'Parents appreciate the transparency. They can see everything without having to ask.',
  },
  {
    id: 96,
    name: 'Alpha Convent Academy',
    image: '/avatars/avatar96.jpg',
    paragraph:
      'We’ve reduced communication gaps between staff and parents to almost zero.',
  },
  {
    id: 97,
    name: 'Harmony Tutorial Center',
    image: '/avatars/avatar97.jpg',
    paragraph:
      'Integrating PhonePe payments has made fee collection completely stress-free.',
  },
  {
    id: 98,
    name: 'Oakridge Public School',
    image: '/avatars/avatar98.jpg',
    paragraph:
      'The anonymous complaint box was a thoughtful addition — students feel safer speaking up.',
  },
  {
    id: 99,
    name: 'Bright Scholars Institute',
    image: '/avatars/avatar99.jpg',
    paragraph:
      'Reports are accurate, quick, and easy to share with our management team.',
  },
  {
    id: 100,
    name: 'Evergreen Learning Center',
    image: '/avatars/avatar100.jpg',
    paragraph:
      'From setup to daily use, everything about Shiksha Cloud feels simple and reliable.',
  },
];

// Teacher Management:
export const subjects = [
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Physics', label: 'Physics' },
  { value: 'Chemistry', label: 'Chemistry' },
  { value: 'Biology', label: 'Biology' },
  { value: 'English', label: 'English' },
  { value: 'Marathi', label: 'Marathi' },
  { value: 'Science', label: 'Science' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'History', label: 'History' },
  { value: 'Geography', label: 'Geography' },
  { value: 'Economics', label: 'Economics' },
  { value: 'Political Science', label: 'Political Science' },
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Physical Education', label: 'Physical Education' },
  { value: 'Art', label: 'Art' },
  { value: 'Music', label: 'Music' },
];

export const grades = [
  { value: 'Grade 1', label: 'Grade 1' },
  { value: 'Grade 2', label: 'Grade 2' },
  { value: 'Grade 3', label: 'Grade 3' },
  { value: 'Grade 4', label: 'Grade 4' },
  { value: 'Grade 5', label: 'Grade 5' },
  { value: 'Grade 6', label: 'Grade 6' },
  { value: 'Grade 7', label: 'Grade 7' },
  { value: 'Grade 8', label: 'Grade 8' },
  { value: 'Grade 9', label: 'Grade 9' },
  { value: 'Grade 10', label: 'Grade 10' },
  { value: 'Grade 11', label: 'Grade 11' },
  { value: 'Grade 12', label: 'Grade 12' },
];

export const languages = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Mandarin', label: 'Mandarin' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Bengali', label: 'Bengali' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Tamil', label: 'Tamil' },
  { value: 'Marathi', label: 'Marathi' },
  { value: 'Gujarati', label: 'Gujarati' },
];

export const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const maharashtraDistricts = [
  'Ahmednagar',
  'Akola',
  'Amravati',
  'Aurangabad (Chhatrapati Sambhajinagar)',
  'Beed',
  'Bhandara',
  'Buldhana',
  'Chandrapur',
  'Dhule',
  'Gadchiroli',
  'Gondia',
  'Hingoli',
  'Jalgaon',
  'Jalna',
  'Kolhapur',
  'Latur',
  'Mumbai City',
  'Mumbai Suburban',
  'Nagpur',
  'Nanded',
  'Nandurbar',
  'Nashik',
  'Osmanabad (Dharashiv)',
  'Palghar',
  'Parbhani',
  'Pune',
  'Raigad',
  'Ratnagiri',
  'Sangli',
  'Satara',
  'Sindhudurg',
  'Solapur',
  'Thane',
  'Wardha',
  'Washim',
  'Yavatmal',
];

// Document Verification

export const documentRejectionReasons = {
  AADHAAR: [
    'The Aadhaar card image is too blurry to read the full name or DOB. Please upload a clearer version.',
    'We couldn’t verify the Aadhaar number as the last 4 digits are partially hidden. Full visibility is required.',
    'This Aadhaar card appears to be cropped or cut. Please upload the full document including barcode.',
    'The uploaded Aadhaar card seems to belong to someone else. Please ensure it matches the registered name.',
  ],
  PAN: [
    'The PAN card photo is unclear, especially the text area. Kindly upload a higher quality scan.',
    "We couldn't verify the PAN number due to partial visibility. Please make sure the full card is visible.",
    'The document appears to be a photocopy with low contrast. Please upload a scanned original.',
    'PAN name does not match the registered user’s name. Please double-check before uploading.',
  ],
  PASSPORT: [
    'The passport page with your photo and details is either missing or unreadable. Please check and re-upload.',
    'The MRZ (barcode at bottom) is not visible. Please upload the full passport page without cropping.',
    'Your passport image is too dark or poorly lit. Kindly upload a well-scanned version.',
    'The passport appears to be expired. Please upload a valid version.',
  ],
  BIRTH_CERTIFICATE: [
    'The issuing authority’s seal or stamp is not visible. Please upload a certified document.',
    'Important fields like DOB or name are unclear or cut off. Kindly upload a complete certificate.',
    'Handwritten entries on the certificate are difficult to read. Please upload a clearer copy.',
    'The birth certificate seems to be in regional language only. Please attach an English-translated copy if available.',
  ],
  TRANSFER_CERTIFICATE: [
    'The official school/college stamp is missing or unclear. Please upload a certified document.',
    'We couldn’t find the name of the issuing institution. Make sure the full certificate is uploaded.',
    'Your Transfer Certificate appears to be tampered with or edited. Please upload a fresh one.',
    'The document format doesn’t match typical TC layout. Kindly verify and re-upload.',
  ],
  BANK_PASSBOOK: [
    'The account holder name is unclear or mismatched. Please ensure it matches the registered person.',
    'The uploaded image does not include IFSC, branch name, or account number. Please include all key details.',
    'This appears to be a cropped or partial page from the bank passbook. Kindly upload the full page.',
    'The scan is poorly lit or blurred, making key information unreadable.',
  ],
  PARENT_ID: [
    'The parent ID does not contain sufficient information (Name/DOB/Photo). Please upload a complete ID.',
    'The ID seems to belong to a minor or an unrelated person. Please double-check before re-uploading.',
    'Photo or signature is missing/unclear. A valid ID is required for parent verification.',
    'We could not verify the authenticity of the ID due to low image quality. Please upload a better scan.',
  ],
  AGREEMENT: [
    'The document appears unsigned or lacks official seal/stamp. Please upload a complete agreement.',
    'Some pages seem to be missing from the agreement. Ensure all pages are uploaded.',
    'Text is too faded or faint to read clearly. Kindly upload a scanned version, not a photo.',
    'The agreement format appears invalid or incomplete. Please verify and re-upload.',
  ],
};

// Anonymous Complaints

export const statusConfig = {
  PENDING: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    description: 'Your complaint has been received and is awaiting review',
  },
  UNDER_REVIEW: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: FileText,
    description: 'Your complaint is being reviewed by our team',
  },
  INVESTIGATING: {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Search,
    description: 'An investigation is currently in progress',
  },
  RESOLVED: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2,
    description: 'Your complaint has been resolved',
  },
  REJECTED: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    description: 'Your complaint could not be processed',
  },
  CLOSED: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Lock,
    description: 'This complaint has been closed',
  },
};

export type ComplaintStatus = keyof typeof statusConfig;

export const severityConfig = {
  LOW: {
    color: 'bg-green-100 text-green-800 border-green-200',
    label: 'Low Priority',
  },
  MEDIUM: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    label: 'Medium Priority',
  },
  HIGH: {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    label: 'High Priority',
  },
  CRITICAL: {
    color: 'bg-red-100 text-red-800 border-red-200',
    label: 'Critical Priority',
  },
};

export const FEATURES = [
  {
    title: 'Enhance User Experience',
    description:
      'Efficiently manage user data and interactions with advanced AI tools',
    icon: WandSparklesIcon,
    image: '/images/feature-two.svg',
  },
  {
    title: 'Comprehensive Insights',
    description:
      'Gain deep insights into your audience and campaign performance',
    icon: ChartColumnBigIcon,
    image: '/images/feature-one.svg',
  },
  {
    title: 'Data Management',
    description: 'Manage your data with ease and efficiency',
    icon: DatabaseIcon,
    image: '/images/feature-three.svg',
  },
  {
    title: 'Real-Time Analytics',
    description: 'Track and analyze your marketing performance in real-time',
    icon: TrendingUpIcon,
    image: '/images/feature-four.svg',
  },
  {
    title: 'Dynamic Optimization',
    description: 'AI-powered optimization for smarter marketing',
    icon: ZapIcon,
    image: '/images/feature-five.svg',
  },
];
const attendanceChartData = [
  { month: 'June', attendance: 22 },
  { month: 'July', attendance: 24 },
  { month: 'August', attendance: 23 },
  { month: 'September', attendance: 26 },
  { month: 'October', attendance: 20 },
  { month: 'November', attendance: 25 },
  { month: 'December', attendance: 18 },
  { month: 'January', attendance: 23 },
  { month: 'February', attendance: 22 },
  { month: 'March', attendance: 19 },
];

// Mock attendance data
const attendanceData = [
  {
    id: 1,
    date: '2025-03-10',
    student: 'Alex Johnson',
    rollNumber: 'S001',
    section: 'A',
    status: 'present',
  },
  {
    id: 2,
    date: '2025-03-10',
    student: 'Maria Garcia',
    rollNumber: 'S002',
    section: 'A',
    status: 'absent',
  },
  {
    id: 3,
    date: '2025-03-10',
    student: 'James Wilson',
    rollNumber: 'S003',
    section: 'A',
    status: 'late',
  },
  {
    id: 4,
    date: '2025-03-10',
    student: 'Sarah Brown',
    rollNumber: 'S004',
    section: 'A',
    status: 'present',
  },
  {
    id: 5,
    date: '2025-03-10',
    student: 'David Lee',
    rollNumber: 'S005',
    section: 'A',
    status: 'present',
  },
  {
    id: 6,
    date: '2025-03-09',
    student: 'Alex Johnson',
    rollNumber: 'S001',
    section: 'A',
    status: 'present',
  },
  {
    id: 7,
    date: '2025-03-09',
    student: 'Maria Garcia',
    rollNumber: 'S002',
    section: 'A',
    status: 'present',
  },
  {
    id: 8,
    date: '2025-03-09',
    student: 'James Wilson',
    rollNumber: 'S003',
    section: 'A',
    status: 'present',
  },
  {
    id: 9,
    date: '2025-03-09',
    student: 'Sarah Brown',
    rollNumber: 'S004',
    section: 'A',
    status: 'absent',
  },
  {
    id: 10,
    date: '2025-03-09',
    student: 'David Lee',
    rollNumber: 'S005',
    section: 'A',
    status: 'late',
  },
];

const mockSectionAttendance = [
  {
    id: '1',
    section: 'Grade 1 - Section A',
    grade: 'Grade 1',
    date: '2025-03-20',
    reportedBy: 'John Smith',
    status: 'completed',
    percentage: 100,
    studentsPresent: 25,
    totalStudents: 25,
  },
  {
    id: '2',
    section: 'Grade 1 - Section B',
    grade: 'Grade 1',
    date: '2025-03-20',
    reportedBy: 'Jane Doe',
    status: 'completed',
    percentage: 96,
    studentsPresent: 24,
    totalStudents: 25,
  },
  {
    id: '3',
    section: 'Grade 2 - Section A',
    grade: 'Grade 2',
    date: '2025-03-20',
    reportedBy: 'Michael Johnson',
    status: 'pending',
    percentage: 0,
    studentsPresent: 0,
    totalStudents: 28,
  },
  {
    id: '4',
    section: 'Grade 2 - Section B',
    grade: 'Grade 2',
    date: '2025-03-20',
    reportedBy: 'Sarah Williams',
    status: 'in-progress',
    percentage: 68,
    studentsPresent: 17,
    totalStudents: 25,
  },
  {
    id: '5',
    section: 'Grade 3 - Section A',
    grade: 'Grade 3',
    date: '2025-03-20',
    reportedBy: 'Robert Brown',
    status: 'completed',
    percentage: 92,
    studentsPresent: 23,
    totalStudents: 25,
  },
];

export const mockMonthlyFeeCollectionData = [
  { month: 1, year: 2025, amount: 105000, count: 51 },
  { month: 2, year: 2025, amount: 85000, count: 38 },
  { month: 3, year: 2025, amount: 110000, count: 55 },
  { month: 4, year: 2025, amount: 75000, count: 32 },
  { month: 5, year: 2025, amount: 65000, count: 28 },
  { month: 6, year: 2025, amount: 90000, count: 41 },
  { month: 7, year: 2025, amount: 100000, count: 47 },
  { month: 8, year: 2025, amount: 115000, count: 53 },
  { month: 9, year: 2025, amount: 95000, count: 44 },
  { month: 10, year: 2025, amount: 80000, count: 36 },
  { month: 11, year: 2025, amount: 120000, count: 58 },
  { month: 12, year: 2025, amount: 95000, count: 42 },

  // Previous year data
  { month: 0, year: 2024, amount: 85000, count: 38 },
  { month: 1, year: 2024, amount: 90000, count: 42 },
  { month: 2, year: 2024, amount: 75000, count: 35 },
  { month: 3, year: 2024, amount: 0, count: 0 },
  { month: 4, year: 2024, amount: 65000, count: 30 },
  { month: 5, year: 2024, amount: 60000, count: 25 },
  { month: 6, year: 2024, amount: 80000, count: 37 },
  { month: 7, year: 2024, amount: 85000, count: 40 },
  { month: 8, year: 2024, amount: 100000, count: 48 },
  { month: 9, year: 2024, amount: 85000, count: 39 },
  { month: 10, year: 2024, amount: 70000, count: 32 },
  { month: 11, year: 2024, amount: 105000, count: 50 },
];

const mockFeeCategories = [
  { name: 'Tuition Fee', amount: 650000 },
  { name: 'Exam Fee', amount: 75000 },
  { name: 'Library Fee', amount: 50000 },
  { name: 'Lab Fee', amount: 60000 },
  { name: 'Sports Fee', amount: 40000 },
];

// Mock data - replace with actual API calls
const mockDocuments = [
  {
    id: '1',
    type: DocumentType.AADHAAR,
    fileName: 'aadhaar_card.pdf',
    fileSize: 2048576,
    fileType: 'application/pdf',
    documentUrl: '/placeholder.svg?height=400&width=600',
    studentId: 'student1',
    verified: true,
    verifiedBy: 'admin1',
    verifiedAt: new Date('2024-01-15'),
    uploadedBy: 'student1',
    uploadedAt: new Date('2024-01-10'),
    note: 'Clear copy of Aadhaar card',
    isDeleted: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    type: DocumentType.BIRTH_CERTIFICATE,
    fileName: 'birth_certificate.jpg',
    fileSize: 1536000,
    fileType: 'image/jpeg',
    documentUrl: '/placeholder.svg?height=400&width=600',
    studentId: 'student1',
    verified: false,
    uploadedBy: 'parent1',
    uploadedAt: new Date('2024-01-20'),
    note: 'Original birth certificate scan',
    isDeleted: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    type: DocumentType.TRANSFER_CERTIFICATE,
    fileName: 'tc.pdf',
    fileSize: 3072000,
    fileType: 'application/pdf',
    documentUrl: '/placeholder.svg?height=400&width=600',
    studentId: 'student1',
    verified: true,
    verifiedBy: 'admin2',
    verifiedAt: new Date('2024-01-25'),
    uploadedBy: 'student1',
    uploadedAt: new Date('2024-01-22'),
    isDeleted: false,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-25'),
  },
];
