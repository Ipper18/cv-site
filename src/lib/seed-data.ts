export type PersonalInfoSeed = {
  fullName: string;
  title: string;
  photoUrl: string;
  shortBio: string;
  email: string;
  city: string;
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl?: string;
};

export type EducationSeed = {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description: string;
  order: number;
};

export type SkillCategorySeed = {
  name: string;
  order: number;
  skills: Array<{ name: string; level?: string; order: number }>;
};

export type ExperienceSeed = {
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string;
  order: number;
};

export type ProjectLinkSeed = {
  label: string;
  url: string;
  order: number;
};

export type ProjectImageSeed = {
  imageUrl: string;
  altText: string;
  order: number;
};

export type ProjectSeed = {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  techStack: string;
  order: number;
  links: ProjectLinkSeed[];
  images: ProjectImageSeed[];
};

export type CvSeedData = {
  personalInfo: PersonalInfoSeed;
  education: EducationSeed[];
  skillCategories: SkillCategorySeed[];
  experiences: ExperienceSeed[];
  projects: ProjectSeed[];
};

export const seedData: CvSeedData = {
  personalInfo: {
    fullName: "Jordan Carter",
    title: "Automation & Software Engineer",
    photoUrl: "/images/igor-profile.jpeg",
    shortBio:
      "Engineer crafting resilient automation platforms, developer tooling, and cloud-native services that keep distributed teams shipping with confidence.",
    email: "hello@sample.dev",
    city: "Lisbon, Portugal",
    githubUrl: "https://github.com/sample",
    linkedinUrl: "https://www.linkedin.com/in/jordan-carter-swe",
    websiteUrl: "https://sample.dev",
  },
  education: [
    {
      school: "Georgia Institute of Technology",
      degree: "M.S. Computer Science",
      field: "Interactive Intelligence",
      startDate: "2016-08-01",
      endDate: "2018-05-01",
      description:
        "Research focused on automation safety, machine perception, and distributed control systems for industrial robotics.",
      order: 1,
    },
    {
      school: "University of Tennessee",
      degree: "B.S. Mechanical Engineering",
      field: "Automation & Controls",
      startDate: "2012-08-01",
      endDate: "2016-05-01",
      description:
        "Graduated magna cum laude with a concentration in manufacturing systems and embedded software design.",
      order: 2,
    },
  ],
  skillCategories: [
    {
      name: "Programming",
      order: 1,
      skills: [
        { name: "TypeScript", level: "Advanced", order: 1 },
        { name: "Node.js", level: "Advanced", order: 2 },
        { name: "Python", level: "Intermediate", order: 3 },
        { name: "Go", level: "Intermediate", order: 4 },
      ],
    },
    {
      name: "Automation & DevOps",
      order: 2,
      skills: [
        { name: "PLC/SCADA", order: 1 },
        { name: "Kubernetes", order: 2 },
        { name: "CI/CD (GitHub Actions, Argo)", order: 3 },
        { name: "Observability", order: 4 },
      ],
    },
    {
      name: "Leadership & Collaboration",
      order: 3,
      skills: [
        { name: "Technical Strategy", order: 1 },
        { name: "Mentorship", order: 2 },
        { name: "Stakeholder Alignment", order: 3 },
        { name: "Remote Facilitation", order: 4 },
      ],
    },
  ],
  experiences: [
    {
      company: "Northwind Automation",
      role: "Principal Automation Engineer",
      location: "Remote",
      startDate: "2021-01-01",
      description:
        "Architected telemetry pipelines and developer platforms supporting multi-region automation fleets while mentoring distributed squads.",
      technologies: "TypeScript, GraphQL, PostgreSQL, Azure",
      order: 1,
    },
    {
      company: "Atlas Robotics",
      role: "Senior Software & Controls Engineer",
      location: "Berlin, Germany",
      startDate: "2018-06-01",
      endDate: "2020-12-01",
      description:
        "Implemented motion-planning services powering autonomous warehouse robots across Europe and unified PLC/ROS/cloud services.",
      technologies: "Python, ROS, Kubernetes, Kafka",
      order: 2,
    },
  ],
  projects: [
    {
      slug: "ops-canvas",
      name: "OpsCanvas",
      shortDescription: "Incident-ready runbook builder connected to live telemetry.",
      longDescription:
        "OpsCanvas provides a collaborative space to sketch operational workflows, attach live dashboards, and ship guardrails directly into production. Teams orchestrate cloud automation with ready-made blueprints and instantly roll back if telemetry drifts.",
      techStack: "Next.js, Tailwind CSS, WebSockets, Redis",
      order: 1,
      links: [
        { label: "Live Demo", url: "https://opscanvas.dev", order: 1 },
        { label: "GitHub", url: "https://github.com/sample/opscanvas", order: 2 },
      ],
      images: [
        {
          imageUrl: "/images/ops-canvas-1.svg",
          altText: "OpsCanvas dashboard",
          order: 1,
        },
        {
          imageUrl: "/images/ops-canvas-2.svg",
          altText: "Automation workflow",
          order: 2,
        },
      ],
    },
    {
      slug: "telemetry-kit",
      name: "Telemetry Kit",
      shortDescription: "Unified toolkit for instrumenting automation cells.",
      longDescription:
        "Telemetry Kit standardizes how robotics teams capture signals from PLCs, IIoT gateways, and cloud services. It ships adapters, schema validators, and ready-to-use dashboards so insights arrive in minutes, not weeks.",
      techStack: "TypeScript, gRPC, Docker, Prometheus",
      order: 2,
      links: [
        { label: "Repository", url: "https://github.com/sample/telemetry-kit", order: 1 },
      ],
      images: [
        {
          imageUrl: "/images/telemetry-kit.svg",
          altText: "Metrics grid",
          order: 1,
        },
      ],
    },
  ],
};
