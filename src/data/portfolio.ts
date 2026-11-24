export type ProjectStatus = "Deployed" | "In development" | "Planned concept";

export type Project = {
  id: string;
  title: string;
  category: string;
  categories: string[];
  status: ProjectStatus;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  stack: string[];
  liveUrl?: string;
  featured?: boolean;
};

export const skillGroups = [
  {
    title: "Frontend",
    focus: "Interfaces & user experiences",
    skills: ["HTML5", "CSS3", "JavaScript", "React", "Vite", "Bootstrap", "Tailwind CSS"],
  },
  {
    title: "Backend",
    focus: "Application logic & APIs",
    skills: ["Node.js", "Express.js", "Python", "FastAPI", "Flask", "REST APIs"],
  },
  {
    title: "Data",
    focus: "Storage & analysis",
    skills: ["MongoDB", "Mongoose", "SQL", "3LC analysis"],
  },
  {
    title: "AI & real-time",
    focus: "Connected, intelligent applications",
    skills: ["Generative AI", "Gemini API", "AI chatbots", "RAG concepts", "AI agent concepts", "Socket.IO"],
  },
  {
    title: "Tools & deployment",
    focus: "Building, testing & shipping",
    skills: ["Git", "GitHub", "VS Code", "Postman", "Vercel", "Render", "Docker (learning)"],
  },
];

export const projects: Project[] = [
  {
    id: "warirakshak-ai",
    title: "WariRakshak AI",
    category: "AI · Public safety",
    categories: ["AI", "Full-stack", "Social impact"],
    status: "In development",
    featured: true,
    description: "An AI-powered crowd monitoring and emergency response platform concept for the Pandharpur Wari pilgrimage in Maharashtra.",
    problem: "Large pilgrimages need clear crowd awareness, a way to report emergencies, and support for coordinating resources.",
    solution: "A centralized platform concept for zone-level crowd risk monitoring and emergency coordination.",
    features: [
      "AI-based crowd risk classification",
      "Red, orange, yellow, and green safety zones",
      "Warkari SOS emergency reporting",
      "Admin dashboard and zone management",
      "Emergency monitoring and resource coordination",
      "Role-based access control",
      "Real-time communication architecture",
    ],
    stack: ["React", "Node.js", "Express.js", "MongoDB", "Python FastAPI", "Socket.IO"],
  },
  {
    id: "kle-aura",
    title: "KLE AURA — AI-AURA 2K26",
    category: "Web · College events",
    categories: ["Web", "Events"],
    status: "Deployed",
    description: "A college event website showcasing AI-AURA 2K26 and giving students a digital event experience.",
    problem: "Students need one clear place to find event details and registration information.",
    solution: "A responsive event site with event information, cards, and a student registration experience.",
    features: [
      "Event landing page and information",
      "Student registration experience",
      "Event cards, rules, and information sections",
      "Responsive design",
      "3D trophy showcase concept",
    ],
    stack: ["React", "JavaScript", "CSS", "Vercel", "Render", "GitHub"],
    liveUrl: "https://kle-aura.vercel.app",
  },
  {
    id: "quizmaster",
    title: "KLE BBA AI Mind Masters — QuizMaster",
    category: "Education · Quiz platform",
    categories: ["Education", "Web"],
    status: "Deployed",
    description: "An online quiz platform for the KLE Society's College of BBA AI Mind Masters competition.",
    problem: "The competition needed a digital way to present and manage a structured quiz.",
    solution: "A quiz interface organized around a 60-question, 60-mark assessment format.",
    features: [
      "Multiple-choice question system",
      "60-question quiz structure",
      "60-mark assessment format",
      "Answer management",
      "Quiz interface and dashboard functionality",
    ],
    stack: ["React", "JavaScript", "Node.js"],
    liveUrl: "https://kle-bba-cluster-event-quizmaster.vercel.app",
  },
  {
    id: "kle-hackathon",
    title: "KLE Hackathon 2K26",
    category: "Full-stack · Events",
    categories: ["Full-stack", "Events"],
    status: "In development",
    description: "A hackathon event management website concept focused on registration, team coordination, communication, and administration.",
    problem: "Hackathon participants and organizers need a shared place for event details, teams, and announcements.",
    solution: "A full-stack event platform concept with participant workflows and an administration dashboard.",
    features: [
      "Team registration and user authentication",
      "Admin dashboard",
      "Announcements management",
      "Domains and problem statements",
      "Interactive 3D components",
    ],
    stack: ["React", "Node.js", "Express.js", "MongoDB", "Three.js", "JavaScript"],
  },
  {
    id: "lifeline-plus",
    title: "LifeLine+ — Smart Healthcare Assistant",
    category: "Healthcare · AI",
    categories: ["AI", "Full-stack", "Social impact"],
    status: "In development",
    description: "A smart healthcare assistant concept exploring digital tools for patient healthcare management.",
    problem: "Patients may need simpler ways to organize health information, appointments, and reminders.",
    solution: "A healthcare assistant concept that brings patient records and care workflows into one digital experience.",
    features: [
      "Electronic health records",
      "Appointment management",
      "Medication reminder and missed-dose notification concepts",
      "Emergency SOS concept",
      "Telemedicine and wearable integration concepts",
    ],
    stack: ["MongoDB", "Express.js", "React", "Node.js", "Python", "AI integrations"],
  },
  {
    id: "myara",
    title: "Myara — WhatsApp AI Assistant",
    category: "AI · Chatbot",
    categories: ["AI", "Automation"],
    status: "In development",
    description: "An AI-powered assistant project exploring intelligent conversational experiences through WhatsApp.",
    problem: "People want conversational assistance through messaging tools they already use.",
    solution: "A WhatsApp-connected assistant concept using a Python AI backend and a messaging bridge.",
    features: [
      "WhatsApp integration",
      "AI-powered response concept",
      "Python backend and Node.js WhatsApp bridge",
      "QR-based connection",
      "Multilingual conversation concept",
    ],
    stack: ["Python", "FastAPI", "Node.js", "Baileys", "Gemini API"],
  },
  {
    id: "ultron",
    title: "Ultron — AI Desktop Assistant",
    category: "AI · Desktop",
    categories: ["AI", "Automation"],
    status: "In development",
    description: "A Windows desktop assistant project exploring intelligent assistance and automation.",
    problem: "Desktop workflows can benefit from a more accessible, conversational assistant.",
    solution: "An assistant concept combining a desktop interface with an AI service.",
    features: [
      "AI assistant interface",
      "Gemini integration exploration",
      "Python backend and Flask API",
      "React frontend",
      "Desktop assistant functionality",
    ],
    stack: ["Python", "Flask", "React", "Vite", "Tailwind CSS", "Gemini API"],
  },
  {
    id: "edumind-ai",
    title: "EduMind AI — Student Learning Assistant",
    category: "Education · Generative AI",
    categories: ["AI", "Education"],
    status: "Planned concept",
    description: "A proposed learning platform concept for AI-powered educational assistance.",
    problem: "Students need flexible learning support that can adapt to different study tasks.",
    solution: "A planned assistant combining study tools, document Q&A, and multilingual learning support.",
    features: [
      "AI study assistant",
      "PDF question answering and notes generation",
      "Quiz generation and coding assistance",
      "Resume and interview preparation",
      "Study planning and multilingual support",
    ],
    stack: ["MERN stack", "Gemini API", "Python FastAPI", "RAG"],
  },
];

export const interests = [
  {
    number: "01",
    title: "Artificial Intelligence",
    description: "Exploring intelligent systems, AI assistants, and Generative AI applications.",
  },
  {
    number: "02",
    title: "Full-Stack Development",
    description: "Building complete web applications with modern frontend and backend technologies.",
  },
  {
    number: "03",
    title: "Real-World Problem Solving",
    description: "Transforming practical challenges into useful digital solutions.",
  },
  {
    number: "04",
    title: "Creative Technology",
    description: "Combining modern design, interactive experiences, and innovative ideas.",
  },
];
