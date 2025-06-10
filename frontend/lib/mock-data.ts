export interface User {
  id: number;
  email: string;
  openaiApiKey: string;
}

export interface Chatbot {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
  totalQuestions: number;
  status: 'active' | 'inactive';
  description?: string;
  instructions?: string;
}

export interface Analytics {
  question: string;
  answer: string;
  timestamp: string;
}

// Generate unique IDs using timestamp + random numbers to ensure uniqueness
const generateUniqueId = () => Date.now() + Math.floor(Math.random() * 1000);

export const mockUser: User = {
  id: generateUniqueId(),
  email: 'demo@botly.com',
  openaiApiKey: 'sk-mock-api-key-for-demo-purposes-only'
};

export const mockChatbots: Chatbot[] = [
  {
    id: generateUniqueId(),
    name: 'Customer Support Bot',
    userId: mockUser.id,
    createdAt: '2024-01-15T10:30:00Z',
    totalQuestions: 127,
    status: 'active',
    description: 'Handles customer support inquiries and provides helpful responses',
    instructions: 'Be helpful, professional, and empathetic. Always try to resolve customer issues quickly.'
  },
  {
    id: generateUniqueId(),
    name: 'Product FAQ Bot',
    userId: mockUser.id,
    createdAt: '2024-01-20T14:22:00Z',
    totalQuestions: 89,
    status: 'active',
    description: 'Answers frequently asked questions about our products and services',
    instructions: 'Focus on product features, benefits, and technical specifications. Be accurate and detailed.'
  },
  {
    id: generateUniqueId(),
    name: 'Documentation Bot',
    userId: mockUser.id,
    createdAt: '2024-01-25T09:15:00Z',
    totalQuestions: 45,
    status: 'inactive',
    description: 'Helps developers navigate through technical documentation',
    instructions: 'Be technical and precise. Provide code examples when possible and link to relevant documentation.'
  },
  {
    id: generateUniqueId(),
    name: 'Sales Assistant Bot',
    userId: mockUser.id,
    createdAt: '2024-02-01T16:45:00Z',
    totalQuestions: 203,
    status: 'active',
    description: 'Assists with sales inquiries and lead qualification',
    instructions: 'Be persuasive but not pushy. Focus on understanding customer needs and providing value.'
  },
  {
    id: generateUniqueId(),
    name: 'HR Onboarding Bot',
    userId: mockUser.id,
    createdAt: '2024-02-05T11:30:00Z',
    totalQuestions: 67,
    status: 'active',
    description: 'Guides new employees through the onboarding process',
    instructions: 'Be welcoming and informative. Help new hires feel comfortable and prepared.'
  }
];

export const mockAnalytics: Record<number, Analytics[]> = {
  [mockChatbots[0].id]: [
    {
      question: 'What are your business hours?',
      answer: 'Our business hours are Monday to Friday, 9 AM to 6 PM EST. We also offer limited support on weekends for urgent matters.',
      timestamp: '2024-01-28T10:30:00Z'
    },
    {
      question: 'How can I reset my password?',
      answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page and following the instructions sent to your email.',
      timestamp: '2024-01-28T11:15:00Z'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all our services. Please contact our support team to process a refund.',
      timestamp: '2024-01-28T14:20:00Z'
    },
    {
      question: 'How do I contact technical support?',
      answer: 'You can reach our technical support team via email at support@botly.com, through our live chat, or by calling 1-800-BOTLY-HELP.',
      timestamp: '2024-01-29T09:45:00Z'
    },
    {
      question: 'Can I upgrade my plan mid-cycle?',
      answer: 'Absolutely! You can upgrade your plan at any time. The change takes effect immediately and you\'ll be charged the prorated difference.',
      timestamp: '2024-01-29T15:20:00Z'
    }
  ],
  [mockChatbots[1].id]: [
    {
      question: 'What features are included in the Pro plan?',
      answer: 'The Pro plan includes unlimited chatbots, 10,000 messages per month, advanced analytics, custom branding, priority support, and API access.',
      timestamp: '2024-01-28T09:45:00Z'
    },
    {
      question: 'Can I upgrade my plan anytime?',
      answer: 'Yes, you can upgrade your plan at any time. The changes will take effect immediately and you\'ll only pay the prorated difference.',
      timestamp: '2024-01-28T16:30:00Z'
    },
    {
      question: 'Does the chatbot support multiple languages?',
      answer: 'Yes, our chatbots support over 50 languages. You can configure the primary language and enable automatic translation for international customers.',
      timestamp: '2024-01-29T13:15:00Z'
    },
    {
      question: 'How accurate are the AI responses?',
      answer: 'Our chatbots achieve 95%+ accuracy when properly trained with your data. The accuracy improves over time as the AI learns from interactions.',
      timestamp: '2024-01-30T10:22:00Z'
    }
  ],
  [mockChatbots[2].id]: [
    {
      question: 'How do I integrate the chatbot into my website?',
      answer: 'You can integrate the chatbot by copying the embed code from your dashboard and pasting it into your website\'s HTML. It takes less than 5 minutes to set up.',
      timestamp: '2024-01-27T13:10:00Z'
    },
    {
      question: 'Can I customize the chatbot appearance?',
      answer: 'Yes, you can customize colors, fonts, position, and branding to match your website\'s design. Pro plans include advanced customization options.',
      timestamp: '2024-01-28T16:45:00Z'
    }
  ],
  [mockChatbots[3].id]: [
    {
      question: 'What is your pricing model?',
      answer: 'We offer three plans: Starter ($19/month), Pro ($49/month), and Enterprise (custom pricing). Each plan includes different features and message limits.',
      timestamp: '2024-02-02T11:30:00Z'
    },
    {
      question: 'Do you offer a free trial?',
      answer: 'Yes! We offer a 14-day free trial with full access to Pro features. No credit card required to start.',
      timestamp: '2024-02-02T14:15:00Z'
    },
    {
      question: 'Can I see a demo of the product?',
      answer: 'Absolutely! You can book a personalized demo with our team or try our interactive demo on the homepage. Both options show the full capabilities.',
      timestamp: '2024-02-03T09:20:00Z'
    }
  ],
  [mockChatbots[4].id]: [
    {
      question: 'What documents do I need for onboarding?',
      answer: 'Please prepare your ID, tax forms (W-4 or equivalent), bank details for direct deposit, and emergency contact information.',
      timestamp: '2024-02-06T08:30:00Z'
    },
    {
      question: 'When is my first day?',
      answer: 'Your first day is scheduled for next Monday. Please arrive at 9 AM at the main office reception. You\'ll receive a welcome email with directions.',
      timestamp: '2024-02-06T12:15:00Z'
    },
    {
      question: 'Who will be my manager?',
      answer: 'Your direct manager will be Sarah Johnson from the Product team. She\'ll reach out to you before your start date to welcome you and answer any questions.',
      timestamp: '2024-02-07T10:45:00Z'
    }
  ]
};

export const mockActivityData = [
  {
    type: 'question',
    content: 'New question received in Customer Support Bot',
    time: '2 minutes ago',
    chatbot: mockChatbots[0].name,
    chatbotId: mockChatbots[0].id
  },
  {
    type: 'upload',
    content: 'PDF uploaded to Product FAQ Bot',
    time: '15 minutes ago',
    chatbot: mockChatbots[1].name,
    chatbotId: mockChatbots[1].id
  },
  {
    type: 'view',
    content: 'Chatbot embedded on new website',
    time: '1 hour ago',
    chatbot: mockChatbots[2].name,
    chatbotId: mockChatbots[2].id
  },
  {
    type: 'question',
    content: 'Multiple questions answered in Sales Assistant Bot',
    time: '2 hours ago',
    chatbot: mockChatbots[3].name,
    chatbotId: mockChatbots[3].id
  },
  {
    type: 'create',
    content: 'HR Onboarding Bot created',
    time: '1 day ago',
    chatbot: mockChatbots[4].name,
    chatbotId: mockChatbots[4].id
  }
];

// Usage statistics for dashboard
export const mockUsageStats = {
  totalChatbots: mockChatbots.length,
  activeChatbots: mockChatbots.filter(bot => bot.status === 'active').length,
  totalQuestions: mockChatbots.reduce((sum, bot) => sum + bot.totalQuestions, 0),
  thisMonthQuestions: 847,
  responseRate: 98.5,
  avgResponseTime: '0.8s',
  userSatisfaction: 4.7
};