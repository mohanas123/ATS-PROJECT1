export interface SamplePreset {
  id: string;
  title: string;
  jobTitle: string;
  fileName: string;
  resumeText: string;
  jobDescription: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developer (React / TS)',
    jobTitle: 'Senior Frontend Developer',
    fileName: 'Alex_Morgan_Frontend_Resume.pdf',
    resumeText: `ALEX MORGAN
alex.morgan@email.com • (555) 234-5678 • San Francisco, CA • linkedin.com/in/alexmorgan • github.com/alexmorgan

PROFESSIONAL SUMMARY
Senior Frontend Developer with 6+ years of experience architecting high-performance React and TypeScript applications. Passionate about web accessibility, design systems, and state management. Proven track record of reducing bundle size by 35% and improving page load performance across high-traffic SaaS products.

SKILLS
• Languages & Frameworks: TypeScript, JavaScript (ES6+), React 18, Next.js, HTML5, CSS3, Tailwind CSS
• State & Architecture: Redux Toolkit, React Query, Zustand, REST APIs, GraphQL, Micro-frontends
• Testing & Tooling: Jest, React Testing Library, Cypress, Vite, Webpack, Git, CI/CD pipelines
• Core Competencies: Responsive Design, Web Vitals, Web Accessibility (WCAG 2.1 AA), Cross-browser compatibility

WORK EXPERIENCE
Senior Frontend Engineer | CloudScale Tech, San Francisco, CA | 2022 – Present
• Spearheaded migration of legacy AngularJS dashboard to React 18 & TypeScript, improving time-to-interactive by 42% for 120,000+ daily active users.
• Architected modular design system using Tailwind CSS and Radix UI, adopted across 5 product engineering teams and reducing feature development turnaround by 25%.
• Implemented automated end-to-end testing suite with Playwright and Cypress, increasing code coverage from 54% to 88% and eliminating critical release regressions.
• Responsible for managing junior engineers and conducting weekly code reviews and mentoring sessions.
• Worked on optimizing client bundle splitting and lazy loading strategies, saving 1.2MB in initial payload.

Frontend Software Engineer | Apex Digital Solutions, Austin, TX | 2019 – 2022
• Developed and maintained 14 customer-facing SaaS web modules using React, Redux, and RESTful APIs.
• Collaborated with UX designers and backend engineers to launch an interactive data analytics dashboard generating $2.4M in annual recurring revenue.
• Improved Lighthouse SEO and accessibility scores from 68 to 96 across core landing pages.
• Helped with database query tuning and GraphQL API payload integration.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2015 – 2019
• Dean's Honor List, GPA: 3.8/4.0

PROJECTS
• PulseUI Component Library: Open-source accessible UI library built with TypeScript and Tailwind (1,200+ GitHub stars).
• DevMetrics App: Developer productivity tracker integrating GitHub API, GraphQL, and Recharts.

CERTIFICATIONS
• AWS Certified Cloud Practitioner (2023)
• Meta Certified Frontend Developer Specialization (2022)

ACHIEVEMENTS
• Winner of CloudScale 2023 Annual Innovation Hackathon (1st place out of 28 engineering teams).
• Published technical article on React 18 concurrent features with 45,000+ views.`,
    jobDescription: `Job Title: Senior Frontend Developer
Location: San Francisco, CA (Hybrid / Remote options)
Company: NextGen SaaS Platforms

About the Role:
We are looking for a Senior Frontend Developer to lead the architecture and user experience of our flagship enterprise analytics platform. You will build highly responsive, accessible web interfaces that delight enterprise customers, working closely with Product, Design, and Backend teams.

Key Responsibilities:
• Architect, build, and optimize scalable web applications using React, TypeScript, and modern state management (React Query / Redux).
• Collaborate with UI/UX designers to implement scalable component libraries and responsive web designs using Tailwind CSS.
• Optimize application performance, Core Web Vitals, and load times for data-intensive dashboards.
• Write robust unit, integration, and end-to-end tests using Jest, React Testing Library, and Cypress.
• Champion web accessibility (WCAG AA compliance) and cross-browser reliability.
• Mentor junior and mid-level engineers, conduct high-standard code reviews, and drive engineering best practices.
• Integrate with GraphQL and RESTful APIs, handling caching, error states, and optimistic UI updates.

Required Qualifications:
• 5+ years of professional software engineering experience specializing in modern JavaScript, TypeScript, and React.
• Deep expertise in state management, asynchronous data fetching, and micro-frontend or modular component architectures.
• Proven track record of performance optimization (Lighthouse, Core Web Vitals, bundle reduction).
• Strong hands-on experience with modern testing libraries (Jest, Cypress, or Playwright).
• Solid understanding of CI/CD pipelines, Docker, and modern build tooling (Vite, Webpack).
• Strong communication skills and experience working in agile, cross-functional engineering teams.

Preferred Qualifications:
• Familiarity with Next.js or server-side rendering (SSR).
• Experience with cloud deployments on AWS or Google Cloud.
• Passion for accessible user interfaces and open-source contributions.`
  },
  {
    id: 'product-manager',
    title: 'Product Manager (B2B SaaS)',
    jobTitle: 'Product Manager',
    fileName: 'Jordan_Lee_Product_Manager_Resume.pdf',
    resumeText: `JORDAN LEE
jordan.lee@example.com • (555) 987-6543 • New York, NY • linkedin.com/in/jordanlee

PROFESSIONAL SUMMARY
Results-driven Product Manager with 4+ years leading agile product development for high-growth B2B SaaS platforms. Skilled in customer discovery, roadmap prioritization, user research, and data-driven product analytics. Led cross-functional squads to launch 3 flagship products from 0 to 1, increasing user retention by 28%.

SKILLS
• Product Strategy: Product Roadmap, OKRs, Customer Journey Mapping, Competitive Analysis, Go-To-Market (GTM)
• Discovery & Research: User Interviews, A/B Testing, Usability Studies, Feature Prioritization (RICE/MoSCoW)
• Tools & Analytics: Jira, Confluence, Mixpanel, Amplitude, Figma, SQL, Google Analytics
• Methodologies: Agile Scrum, Kanban, Sprint Planning, Stakeholder Management

WORK EXPERIENCE
Product Manager | HyperGrowth Software, New York, NY | 2021 – Present
• Owned the core workflow automation product line, managing a dedicated cross-functional team of 8 engineers and 2 product designers.
• Defined product roadmap and prioritized sprint backlog based on customer telemetry and revenue impact, delivering 18 major product releases.
• Launched new automated onboarding flow that reduced time-to-first-value by 40% and improved 30-day user retention by 22%.
• Conducted over 60 qualitative customer discovery interviews to identify top workflow friction points.
• Responsible for managing stakeholder syncs across Sales, Customer Success, and Executive leadership.

Associate Product Manager | NovaTech Solutions, Boston, MA | 2019 – 2021
• Assisted in product strategy for enterprise reporting suite used by 450+ enterprise clients.
• Analyzed user engagement funnels using Amplitude and SQL, identifying drop-offs that informed two high-impact UX redesign sprints.
• Worked on writing detailed user stories, acceptance criteria, and PRDs for engineering execution.

EDUCATION
Bachelor of Arts in Economics & Media Studies | New York University | 2015 – 2019

PROJECTS & CERTIFICATIONS
• Certified Scrum Product Owner (CSPO) – Scrum Alliance
• Pragmatic Institute Certified (PMC-III)`,
    jobDescription: `Job Title: Product Manager – Enterprise SaaS
Location: New York, NY
Company: ScaleVelocity

About the Role:
We are seeking a talented Product Manager to drive product innovation across our core B2B enterprise collaboration suite. You will define product vision, execute roadmaps, and collaborate with engineering and design to build products customers love.

Responsibilities:
• Define product strategy, quarterly OKRs, and detailed feature specifications (PRDs).
• Lead agile ceremonies including sprint planning, backlog grooming, and user story mapping.
• Execute customer discovery interviews, user surveys, and quantitative product analytics (Mixpanel, SQL).
• Partner with Go-to-Market, Sales, and Marketing teams on product launches and enablement.
• Track and report on key SaaS metrics: retention, churn, MRR, adoption, and NPS.

Requirements:
• 3+ years of product management experience in a SaaS or technology company.
• Demonstrated success launching features that drove measurable customer retention or ARR growth.
• Proficiency with product analytics tools (Mixpanel, Amplitude, Heap) and SQL.
• Excellent communication and stakeholder alignment skills.`
  }
];
