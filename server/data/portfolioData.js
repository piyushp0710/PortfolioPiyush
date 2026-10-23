// Single source of truth for the portfolio chatbot.
//
// Every fact here comes from either the live portfolio site (src/components/*)
// or the resume (public/resume.pdf). `source` records which one. Anything not
// listed here must NOT be stated by the assistant.
//
// TODO(Piyush): review `missingOrUnverified` at the bottom and fill in / correct
// facts. Never put placeholder text into the verified sections.

export const portfolioData = {
  profile: {
    name: 'Piyush Pandey',
    headline: 'Associate Software Engineer | MERN Stack Developer',
    location: 'Mauganj, Madhya Pradesh, India (current role is remote)',
    summary:
      'Full-stack developer with experience building scalable web applications using React.js, Node.js and MongoDB. ' +
      'Skilled in developing end-to-end features, designing APIs and improving application performance. ' +
      'Passionate about problem-solving and continuous learning.',
    highlights: [
      '1+ year of professional experience building full-stack web applications (site).',
      '400+ DSA problems solved across LeetCode, CodeChef, Codeforces and GeeksforGeeks (site).',
      'Currently exploring AI-powered systems: AI Agents, LangGraph, RAG architectures and vector databases (site).',
    ],
    traits: ['Problem Solver', 'Team Player', 'Fast Learner', 'AI Enthusiast'],
    softSkills: ['Leadership', 'Logical Reasoning', 'Problem Solving', 'Time Management', 'Team Work'],
    source: 'site + resume',
  },

  education: [
    {
      degree: 'Bachelor of Technology (B.Tech), Information Technology',
      institution: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal, Madhya Pradesh',
      period: 'Oct 2021 – Jun 2025',
      result: 'CGPA 7.5',
      source: 'resume',
    },
    {
      degree: 'Higher Secondary Education (Class 12)',
      institution: 'Government Excellence Higher Secondary School, Mauganj, Madhya Pradesh',
      period: 'Jul 2020 – Apr 2021',
      result: '97.00%',
      source: 'resume',
    },
    {
      degree: 'Secondary Education (Class 10)',
      institution: 'Mahatma Gandhi High School, Mauganj, Madhya Pradesh',
      period: 'Jul 2018 – Apr 2019',
      result: '95.20%',
      source: 'resume',
    },
  ],

  skills: {
    languages: ['JavaScript', 'C++', 'HTML', 'CSS', 'SQL'],
    frontend: ['React.js', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3'],
    backend: ['Node.js', 'Express.js', 'REST APIs'],
    databases: ['MongoDB', 'MySQL'],
    tools: ['Git', 'GitHub', 'Postman', 'Docker', 'Mixpanel'],
    concepts: [
      'Data Structures & Algorithms', 'Object-Oriented Programming', 'REST API Design',
      'JWT Authentication', 'Database Design', 'System Design Fundamentals',
      'Computer Networks', 'Operating Systems', 'DBMS', 'Git Workflows', 'Agile / Scrum', 'Code Review',
    ],
    source: 'site (Skills section) + resume (Technical Skills)',
  },

  experience: [
    {
      role: 'Associate Software Engineer',
      company: 'Cosmofeed',
      type: 'Full-time',
      period: 'Aug 2025 – Present',
      location: 'Remote, India',
      resumePoints: [
        'Designed and developed a dynamic Admin Dashboard using React.js, Node.js and MongoDB, enabling flexible configuration of sidebar tabs and improving operational efficiency for internal teams by 50-60%.',
        'Built a Dispute Management system end-to-end (frontend + backend), allowing tracking, updating and resolution of disputes, improving workflow visibility and reducing manual effort by 30%.',
        'Integrated Mixpanel analytics to track user behaviour and key events, enabling data-driven decision making and performance monitoring.',
        'Built and managed multiple modular UI components and tabs within the Admin Dashboard, enhancing usability and maintainability.',
        'Diagnosed and resolved critical production issues and bugs, improving application stability and user experience.',
      ],
      sitePoints: [
        'Develops and maintains full-stack web features using React.js, Node.js, Express.js and MongoDB in an agile environment.',
        'Designed and implemented RESTful APIs serving 1000+ daily active users.',
        'Improved MongoDB query performance by 40% through indexing and aggregation pipeline optimization.',
        'Collaborates with cross-functional teams, participating in sprint planning and code reviews.',
        'Implemented JWT-based authentication and authorization to secure application endpoints.',
      ],
      stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'REST APIs', 'Git', 'Mixpanel'],
      source: 'site + resume',
    },
  ],

  projects: [
    {
      name: 'AI Game Controller',
      date: 'Nov 2024',
      description:
        'AI-powered game controller that uses computer vision and hand-gesture recognition to control in-game vehicles. ' +
        'Implements real-time camera input processing to detect and track hand movements.',
      stack: ['OpenCV', 'MediaPipe'],
      category: 'AI',
      links: null,
      source: 'resume',
    },
    {
      name: 'Restaurant Booking System',
      date: 'Aug 2022',
      description: 'Website for booking a table for breakfast, lunch or dinner at a restaurant.',
      stack: null,
      category: 'Web',
      links: null,
      source: 'resume',
    },
    {
      name: 'Creator Platform',
      description:
        'Content-creator monetization platform enabling creators to sell digital products, manage subscriptions and engage with their audience, with real-time features and payment integration.',
      stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Stripe', 'JWT'],
      category: 'Full Stack',
      links: null,
      source: 'site',
    },
    {
      name: 'Vehicle Mechanic Booking',
      description:
        'On-demand vehicle repair booking platform connecting car owners with mechanics, with real-time tracking, service history, reviews and location-based mechanic discovery.',
      stack: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Google Maps API', 'Socket.io'],
      category: 'Full Stack',
      links: null,
      source: 'site',
    },
    {
      name: 'AI Content Assistant',
      description:
        'Content generation tool powered by LLM APIs, supporting RAG-based document Q&A, blog generation, SEO suggestions and multi-format export.',
      stack: ['React.js', 'Node.js', 'LangChain', 'OpenAI API', 'Vector DB', 'MongoDB'],
      category: 'AI',
      links: null,
      source: 'site',
    },
    {
      name: 'MERN Auth Boilerplate',
      description:
        'Authentication system with JWT refresh tokens, role-based access control, email verification and password reset flows; used as a starter for other projects.',
      stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Nodemailer'],
      category: 'Backend',
      links: null,
      source: 'site',
    },
    {
      name: 'DSA Visualizer',
      description:
        'Interactive visualization tool for data structures and algorithms (sorting, graph traversal, tree operations) with animated step-by-step execution.',
      stack: ['React.js', 'JavaScript', 'CSS Animations', 'Tailwind CSS'],
      category: 'Frontend',
      links: null,
      source: 'site',
    },
    {
      name: 'Task Management API',
      description:
        'RESTful API for team task management with workspaces, project boards, task assignment, priorities, due dates and activity logging, documented with Swagger.',
      stack: ['Node.js', 'Express.js', 'MongoDB', 'Swagger', 'JWT', 'Mongoose'],
      category: 'Backend',
      links: null,
      source: 'site',
    },
  ],
  allProjectsUrl: 'https://github.com/piyushp0710',

  ai: {
    projects: ['AI Game Controller (computer vision, OpenCV, MediaPipe)', 'AI Content Assistant (LLM APIs, RAG, LangChain)'],
    currentlyLearning: [
      'AI Agents — building autonomous AI workflows (in progress)',
      'LangGraph — stateful multi-agent orchestration (in progress)',
      'RAG Systems — Retrieval-Augmented Generation (in progress)',
      'Vector Databases — Pinecone, Chroma, Weaviate (planned)',
    ],
    certifications: ['Introduction to AI', 'ML model deployment'],
    note: 'This portfolio chatbot itself is an LLM-powered assistant built into his MERN portfolio.',
    source: 'site + resume',
  },

  dsa: {
    total: '400+ problems solved',
    platforms: [
      { name: 'LeetCode', solved: '50+', url: 'https://leetcode.com/u/Piyushpandey123/' },
      { name: 'CodeChef', solved: '150+', url: 'https://www.codechef.com/users/piyushp_2003' },
      { name: 'Codeforces', solved: '50+', url: 'https://codeforces.com/profile/Piyush_pandey' },
      { name: 'GeeksforGeeks', solved: '50+', url: 'https://www.geeksforgeeks.org/profile/piyushpandeyrahana' },
    ],
    source: 'site',
  },

  achievements: {
    certifications: ['Python Intern at HiCounselor', 'Introduction to AI', 'ML model deployment'],
    awardsAndActivities: ['RGPV State Skit Art Winner', 'Member of CLUB THE NEXT LEVEL'],
    source: 'resume',
  },

  learning: {
    systemDesign: ['System Design (in progress)', 'Microservices (planned)', 'Caching Strategies (planned)', 'Message Queues (planned)'],
    devops: ['Docker (in progress)', 'CI/CD Pipelines (planned)', 'Kubernetes (planned)', 'AWS Fundamentals (planned)'],
    source: 'site (Learning Roadmap)',
  },

  contact: {
    email: 'piyushpandey.rahana@gmail.com',
    linkedin: 'https://www.linkedin.com/in/piyush-pandey-640185228/',
    github: 'https://github.com/piyushp0710',
    resume: 'Downloadable from the "Resume" button on this portfolio site.',
    responseTime: 'Typically responds within 24 hours (site).',
    source: 'site + resume',
  },

  availability: {
    status: 'Open to opportunities (site).',
    interests: 'Full-time roles, contract work and interesting collaboration opportunities (site).',
    note: 'Currently employed as an Associate Software Engineer at Cosmofeed; specifics such as notice period, relocation or salary are not stated.',
    source: 'site',
  },

  // Known gaps. The assistant must say these are not available rather than guess.
  missingOrUnverified: [
    'Project repository and live-demo links (the site currently links every project to the GitHub profile and "#").',
    'Dates for the site-listed projects (Creator Platform, Vehicle Mechanic Booking, AI Content Assistant, MERN Auth Boilerplate, DSA Visualizer, Task Management API).',
    'Notice period, preferred locations, relocation, remote preference and salary expectations.',
    'Previous employers or internships other than the HiCounselor Python internship listed under certifications.',
    'Dates and issuers for certifications.',
    'Languages spoken.',
  ],
};

export default portfolioData;
