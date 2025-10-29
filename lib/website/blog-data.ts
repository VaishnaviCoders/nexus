export interface BlogImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  // Basic Info
  slug: string;
  title: string;
  description: string;
  excerpt: string;

  // Metadata
  date: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  readTime: string;
  featured: boolean;

  // Media
  coverImage: BlogImage;
  images: BlogImage[];

  // Author
  author: BlogAuthor;

  // Content
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'school-management-systems-save-time',
    title: 'How Modern School Management Systems Save 20+ Hours Weekly',
    description:
      'Discover how 500+ Indian schools are saving 20+ hours weekly on administrative tasks through smart automation',
    excerpt:
      'Learn how schools are automating attendance, fee collection, and communication to save significant time',

    // Metadata
    date: '2024-01-15',
    updatedAt: '2024-01-20',
    category: 'Productivity',
    tags: [
      'automation',
      'time management',
      'school efficiency',
      'digital transformation',
    ],
    readTime: '6 min read',
    featured: true,

    // Media
    coverImage: {
      src: '/images/blog/school-management-systems-save-time/cover.jpg',
      alt: 'School management dashboard showing time savings analytics',
    },
    images: [
      {
        src: '/images/blog/school-management-systems-save-time/time-savings-chart.png',
        alt: 'Time savings comparison chart before and after implementation',
        caption: 'Schools report 20+ hours saved weekly',
      },
      {
        src: '/images/blog/school-management-systems-save-time/dashboard-screenshot.png',
        alt: 'Modern school management system dashboard',
        caption: 'Real-time analytics and reporting',
      },
      {
        src: '/images/blog/school-management-systems-save-time/roi-calculator.png',
        alt: 'ROI calculator showing cost savings',
        caption: '400-500% annual ROI for most schools',
      },
    ],

    // Author
    author: {
      name: 'Rajesh Kumar',
      role: 'Education Technology Expert',
      avatar: '/images/authors/rajesh-kumar.jpg',
    },

    // Content (simplified for example)
    content: `
        <h1>How Modern School Management Systems Save 20+ Hours Weekly</h1>
        <p>What if we told you that 500+ Indian schools are already saving 20+ hours every week...</p>
        
        <h2>The Hidden Time Drain</h2>
        <p>Most school administrators spend 35-40 hours weekly on tasks that should take minutes...</p>
        
        <!-- Images will be inserted here -->
        <div data-image="time-savings-chart"></div>
        
        <h2>Digital Transformation Success</h2>
        <p>Schools like St. Xavier's have completely transformed their operations...</p>
        
        <div data-image="dashboard-screenshot"></div>
        
        <h2>ROI Calculation</h2>
        <p>The financial benefits are just as impressive as the time savings...</p>
        
        <div data-image="roi-calculator"></div>
      `,
  },
  {
    slug: 'digital-fee-collection-guide',
    title: 'Complete Guide to Digital Fee Collection for Schools in 2024',
    description:
      'Step-by-step guide to implementing digital fee collection and reducing payment processing time by 80%',
    excerpt:
      'Learn how to set up online payments, automate reminders, and streamline fee management',

    // Metadata
    date: '2024-01-10',
    category: 'Finance',
    tags: [
      'fee collection',
      'online payments',
      'financial management',
      'automation',
    ],
    readTime: '5 min read',
    featured: true,

    // Media
    coverImage: {
      src: '/images/blog/digital-fee-collection/cover.jpg',
      alt: 'Digital fee collection interface showing payment options',
    },
    images: [
      {
        src: '/images/blog/digital-fee-collection/payment-flow.png',
        alt: 'Payment process flow diagram',
        caption: 'Streamlined payment process for parents',
      },
      {
        src: '/images/blog/digital-fee-collection/fee-dashboard.png',
        alt: 'Fee management dashboard',
        caption: 'Real-time fee collection tracking',
      },
    ],

    // Author
    author: {
      name: 'Priya Sharma',
      role: 'Financial Systems Specialist',
      avatar: '/images/authors/priya-sharma.jpg',
    },

    // Content
    content: `
        <h1>Complete Guide to Digital Fee Collection for Schools</h1>
        <p>Traditional fee collection methods are time-consuming and error-prone...</p>
        
        <h2>Setting Up Online Payments</h2>
        <p>Step-by-step guide to integrating payment gateways...</p>
        
        <div data-image="payment-flow"></div>
        
        <h2>Automating Fee Reminders</h2>
        <p>How to set up automatic SMS and email reminders...</p>
        
        <div data-image="fee-dashboard"></div>
      `,
  },
  {
    slug: 'parent-communication-strategies',
    title: 'Effective Parent Communication Strategies for Modern Schools',
    description:
      'Boost parent engagement and satisfaction with proven communication strategies and tools',
    excerpt:
      'Discover how to improve parent-school communication through digital platforms',

    // Metadata
    date: '2024-01-05',
    category: 'Communication',
    tags: ['parent engagement', 'communication', 'notifications', 'mobile app'],
    readTime: '4 min read',
    featured: false,

    // Media
    coverImage: {
      src: '/images/blog/parent-communication-strategies/cover.jpg',
      alt: 'Parent communication app interface',
    },
    images: [
      {
        src: '/images/blog/parent-communication-strategies/notification-system.png',
        alt: 'Multi-channel notification system',
        caption: 'Reach parents through SMS, email, and app notifications',
      },
    ],

    // Author
    author: {
      name: 'Anita Desai',
      role: 'Communication Specialist',
      avatar: '/images/authors/anita-desai.jpg',
    },

    // Content
    content: `
        <h1>Effective Parent Communication Strategies</h1>
        <p>Strong parent-school communication is crucial for student success...</p>
      `,
  },
];

// Helper functions
export function getAllPosts(): BlogPost[] {
  return blogPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter((post) => post.tags.includes(tag));
}

export function getAllCategories(): string[] {
  return [...new Set(blogPosts.map((post) => post.category))];
}

export function getAllTags(): string[] {
  const allTags = blogPosts.flatMap((post) => post.tags);
  return [...new Set(allTags)];
}
