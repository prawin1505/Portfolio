
const SITE = {
  name: "PRAWINKUMAR S N",
  initials: "PK",
  role: "Java FullStack Developer",

  // ---- Your links----
  email: "prawinkumarsn05@gmail.com",     
  github: "https://github.com/prawin1505",     
  linkedin: "https://www.linkedin.com/in/prawinkumarsn1505",  
  resume: "RESUME(PRAWINKUMAR S N).pdf", // put your real PDF next to index.html

  // ---- Availability badge ----
  available: true,
  availabilityText: "Open to internships and placements",

  // ---- Animated role text on the home page ----
  roles: ["Full Stack Developer", "Java Developer", "Frontend Developer", "Software Engineer"],

  // ---- Statistics (edit freely) ----
  stats: [
    { value: 3,  label: "Featured projects" },
    { value: 16, label: "Technologies used" },
    { value: 3,  label: "Internship entries" }
  ],

  // ---- Pages shown in the navigation ----
  pages: [
    { label: "Home",       href: "index.html" },
    { label: "About",      href: "about.html" },
    { label: "Skills",     href: "skills.html" },
    { label: "Projects",   href: "projects.html" },
    { label: "Experience", href: "experience.html" },
    { label: "Education",  href: "education.html" },
    { label: "Contact",    href: "contact.html" }
  ],

  // ---- Skills marquee on the home page ----
  marquee: ["HTML5","CSS3","JavaScript","React.js","Java","Spring Boot","Node.js",
            "PostgreSQL","MySQL","Firebase","Python","Git","GitHub","Figma","REST APIs","JWT","WebSocket"],

  // ---- Projects (github / demo: add real URLs only) ----
  // ---- Contact form: paste a Formspree/Web3Forms URL to send for real. "" = mailto fallback ----
  formEndpoint: "",

  // ---- Skills (no fake percentages) ----
  skills: {
    "Frontend Development": ["HTML5","CSS3","JavaScript","React.js"],
    "Backend Development": ["Java","Spring Boot","RestAPIs","Node.js","Express.js"],
    "Programming Languages": ["Java","Python","JavaScript"],
    "Databases": ["PostgreSQL","MySQL","Firebase"],
    "Tools and Platforms": ["Git","GitHub","VS Code","Figma","Postman","Eclipse","visual Studio"],
    "Concepts": ["REST APIs","JWT Authentication","WebSocket","Responsive Web Design"]
  },

  // ---- Experience: use null for anything you haven't filled in yet ----
  experience: [
    { company: "Ematix Embedded and Software Solutions Pvt. Ltd.", role: "Frontend Development Internship", duration: "5 days" },
    { company: "Ediglobe", role: "Artificial Intelligence", duration: "August 2025 - October 2025" },
    { company: "Novitech Software Solutions", role: "Full Stack Development", duration: "30-day MasterClass" }
    
  ],
  projects: [
    { title: "SkillBridge", category: "fullstack",
      summary: "A full-stack platform that connects people by the skills they can teach and the skills they want to learn, with matching, authentication, connections and real-time chat.",
      tech: ["Java","Spring Boot","React.js","PostgreSQL","JWT","WebSocket","REST APIs"], github: "https://github.com/prawin1505/SkillBridge", demo: "https://skill-bridge-dun-three.vercel.app/", features: ["Skill matching between teachers and learners","User authentication with JWT","Connections between users","Real-time communication with WebSocket"] },
    { title: "Chatbot", category: "artificial intelligence",
      summary: "The chatbot is a web application that uses natural language processing to understand user queries and provide relevant responses. ",
      tech: ["Artificial Intelligence","Machine Learning","data preprocessing","Python"], github: "https://github.com/prawin1505/Air-quality-Major-project", demo: "", features: ["Digital question paper generation workflow","Organised question paper creation"] },
    { title: "Developer Portfolio", category: "frontend",
      summary: "A responsive personal portfolio showing technical skills, projects, education and contact details.",
      tech: ["HTML5","CSS3","JavaScript","Responsive Design"], github: "https://github.com/prawin1505/Portfolio", demo: "https://prawinkumarsn-portfolio.vercel.app/", features: ["Responsive layout","Sections for skills, projects, education and contact"] },
    { title: "CRT Project", category: "Artificial Intelligence",
      summary: "A CRT project is a web application that uses natural language processing to understand user click the advertisement.",
      tech: ["Artificial Intelligence","Machine Learning","data preprocessing","Python"], github: "https://github.com/prawin1505/CRT-Minor-project-", demo: "", features: ["Responsive layout","Sections for skills, projects, education and contact"] }
  ]
};
