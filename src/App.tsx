import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { lazy, Suspense, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import Cursor from "./components/ui/Cursor";
import Loader from "./components/ui/Loader";
import ScrollProgress from "./components/ui/ScrollProgress";
import Hero from "./components/hero/Hero";
import { site } from "./config/site";
import { useLenis } from "./hooks/useLenis";
import { interests, projects, skillGroups, type Project } from "./data/portfolio";

const Scene = lazy(() => import("./components/Scene"));
const filters = ["All", ...new Set(projects.flatMap((project) => project.categories))];

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24, filter: "blur(7px)" }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  detail,
}: {
  eyebrow: string;
  title: string;
  detail: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="section-heading"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      <p className="section-detail">{detail}</p>
    </motion.div>
  );
}

function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="dialog-backdrop"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <motion.section
        ref={dialogRef}
        className="project-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.99 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <button ref={closeButtonRef} className="dialog-close" type="button" onClick={onClose} aria-label="Close project details">
          ×
        </button>
        <p className="eyebrow">{project.category}</p>
        <div className="dialog-title-row">
          <h2 id="dialog-title">{project.title}</h2>
          <span className={`status-badge status-${project.status === "Deployed" ? "deployed" : project.status === "Planned concept" ? "planned" : "development"}`}>
            {project.status}
          </span>
        </div>
        <p className="dialog-description">{project.description}</p>
        <div className="dialog-columns">
          <div>
            <h3>The challenge</h3>
            <p>{project.problem}</p>
          </div>
          <div>
            <h3>Project direction</h3>
            <p>{project.solution}</p>
          </div>
        </div>
        <h3 className="dialog-section-title">Features & concepts</h3>
        <ul className="feature-list">
          {project.features.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
        <h3 className="dialog-section-title">Technology</h3>
        <div className="project-tags">
          {project.stack.map((item) => <span className="skill-pill" key={item}>{item}</span>)}
        </div>
        {project.liveUrl && (
          <a className="button button-primary dialog-live-link" href={project.liveUrl} target="_blank" rel="noreferrer">
            Visit live project <span aria-hidden="true">↗</span>
          </a>
        )}
      </motion.section>
    </motion.div>
  );
}

export default function App() {
  useLenis();
  const reduceMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formMessage, setFormMessage] = useState("");

  const visibleProjects = useMemo(
    () => activeFilter === "All"
      ? projects
      : projects.filter((project) => project.categories.includes(activeFilter)),
    [activeFilter],
  );

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    if (!site.email) {
      setFormMessage("Email is not set up yet. Add your email in src/config/site.ts to enable the mailto contact form.");
      return;
    }

    const values = new FormData(form);
    const subject = String(values.get("subject"));
    const message = [
      `From: ${String(values.get("name"))} (${String(values.get("email"))})`,
      "",
      String(values.get("message")),
    ].join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    setFormMessage("Your email app should open with the message ready to send.");
  };

  return (
    <>
      <Loader />
      <Cursor />
      <ScrollProgress />
      <Suspense fallback={null}><Scene /></Suspense>

      <main className="relative">
        <Hero />

        <section id="about" className="content-section">
          <div className="section-inner">
            <SectionHeading
              eyebrow="About me"
              title="Beyond the code."
              detail="I’m a technology-driven BCA student at KLE, Mahalingpur, interested in software development, artificial intelligence, and building practical digital solutions."
            />
            <div className="about-layout">
              <Reveal className="about-copy">
                <p>
                  My development journey is about learning by building. I explore
                  frontend and backend technologies, connect application pieces,
                  and experiment with AI to turn ideas into useful products.
                </p>
                <p>
                  I enjoy working through complex challenges with curiosity,
                  creativity, and a focus on practical problem-solving. My ambition
                  is to grow into a skilled software engineer and contribute to
                  products that create meaningful impact.
                </p>
                <div className="about-values">
                  {["Innovation", "Problem-solving", "Continuous learning", "Teamwork"].map((value) => (
                    <span className="value-tag" key={value}>{value}</span>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <aside className="portrait-card">
                  <img
                    src="/images/irappa-mali-portrait.jpg"
                    alt="Irappa Mali at a college event"
                    width="816"
                    height="1020"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="portrait-overlay">
                    <p className="eyebrow">Currently studying · KLE, Mahalingpur</p>
                    <div className="portrait-caption">
                      <div>
                        <h3>{site.name}</h3>
                        <p>Bachelor of Computer Applications</p>
                      </div>
                      <span>04<small>TH SEM</small></span>
                    </div>
                  </div>
                </aside>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="skills" className="content-section section-alt">
          <div className="section-inner">
            <SectionHeading
              eyebrow="Technology"
              title="Tools for the ideas ahead."
              detail="A growing toolkit across frontend, backend, databases, and AI. I’m continuing to learn through projects and hands-on practice."
            />
            <div className="skills-grid">
              {skillGroups.map((group, index) => (
                <motion.article
                  className="skill-card"
                  key={group.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                >
                  <span className="skill-index">0{index + 1}</span>
                  <h3>{group.title}</h3>
                  <p>{group.focus}</p>
                  <div className="project-tags">
                    {group.skills.map((skill) => (
                      <span className="skill-pill" key={skill}>{skill}</span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
            <p className="skill-footnote">Skills reflect an actively growing student toolkit, not a claim of expert-level proficiency.</p>
          </div>
        </section>

        <section id="projects" className="content-section">
          <div className="section-inner">
            <SectionHeading
              eyebrow="Selected work"
              title="Ideas, shaped into projects."
              detail="A mix of deployed work, in-progress builds, and concepts. Each card includes its current status so it’s clear what’s live and what’s still taking shape."
            />
            <Reveal className="featured-project">
              <div className="featured-art" aria-hidden="true">
                <span className="featured-grid" />
                <span className="featured-orbit featured-orbit-one" />
                <span className="featured-orbit featured-orbit-two" />
                <span className="featured-core">WR<span>AI</span></span>
                <span className="featured-coordinate">16°27&apos; N&nbsp; 75°01&apos; E</span>
                <span className="featured-zone zone-red">RISK</span>
                <span className="featured-zone zone-green">SAFE</span>
              </div>
              <div className="featured-copy">
                <div className="project-meta">
                  <span className="eyebrow">Flagship concept · Public safety</span>
                  <span className="status-badge status-development">In development</span>
                </div>
                <h3>WariRakshak <span>AI</span></h3>
                <p>
                  Exploring how crowd awareness and coordinated emergency
                  response could support the Pandharpur Wari pilgrimage.
                </p>
                <div className="project-tags">
                  {["Crowd awareness", "Emergency response", "AI"].map((tag) => (
                    <span className="skill-pill" key={tag}>{tag}</span>
                  ))}
                </div>
                <button className="text-link" type="button" onClick={() => setSelectedProject(projects[0])}>
                  Explore the project <span aria-hidden="true">↗</span>
                </button>
              </div>
            </Reveal>

            <div className="project-toolbar">
              <p className="eyebrow">Project archive <span className="project-count">{visibleProjects.length.toString().padStart(2, "0")} projects</span></p>
              <div className="filter-list" aria-label="Filter projects">
                {filters.map((filter) => (
                  <motion.button
                    className={`filter-button${activeFilter === filter ? " active" : ""}`}
                    type="button"
                    key={filter}
                    aria-pressed={activeFilter === filter}
                    onClick={() => setActiveFilter(filter)}
                    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  >
                    {filter}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.div className="projects-grid" layout aria-live="polite">
              <AnimatePresence mode="popLayout">
              {visibleProjects.map((project, index) => (
                <motion.button
                  key={project.id}
                  layout
                  className={`project-card${project.featured ? " project-card-featured" : ""}`}
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -10, scale: 0.98 }}
                  whileHover={reduceMotion ? undefined : { y: -5, transition: { duration: 0.18 } }}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  transition={{ layout: { duration: 0.36, ease: [0.22, 1, 0.36, 1] }, duration: 0.32, delay: reduceMotion ? 0 : index % 3 * 0.045 }}
                  aria-label={`View details for ${project.title}, ${project.status}`}
                >
                  <span className={`project-card-art art-${index % 5}`} aria-hidden="true">
                    <span>{project.title.split(/[—–]/)[0].trim()}</span>
                    <i>{project.id === "warirakshak-ai" ? "WR / AI" : project.id.slice(0, 2).toUpperCase()}</i>
                  </span>
                  <span className="project-card-body">
                    <span className="project-card-meta">
                      <span>{project.category}</span>
                      <span className={`status-dot-small status-dot-${project.status === "Deployed" ? "deployed" : project.status === "Planned concept" ? "planned" : "development"}`} />
                    </span>
                    <span className="project-card-title">{project.title}</span>
                    <span className="project-card-description">{project.description}</span>
                    <span className="project-card-footer">
                      <span className={`status-badge status-${project.status === "Deployed" ? "deployed" : project.status === "Planned concept" ? "planned" : "development"}`}>{project.status}</span>
                      <span className="card-arrow" aria-hidden="true">↗</span>
                    </span>
                  </span>
                </motion.button>
              ))}
              </AnimatePresence>
            </motion.div>
            {visibleProjects.length === 0 && <p className="empty-projects">No projects in this category yet.</p>}
          </div>
        </section>

        <section id="journey" className="content-section section-alt">
          <div className="section-inner">
            <SectionHeading
              eyebrow="The process"
              title="Learning today. Building tomorrow."
              detail="My path is still unfolding. I focus on steady progress, practical experiments, and learning from every project and collaboration."
            />
            <Reveal className="journey-timeline">
              {[
                ["01", "Foundations", "Started learning programming and web technologies."],
                ["02", "Frontend", "Explored interface development and interactive experiences."],
                ["03", "Full stack", "Moved into backend development and MERN applications."],
                ["04", "AI exploration", "Began experimenting with AI and Generative AI integrations."],
                ["05", "Build & improve", "Applying new skills to education and real-world problem ideas."],
              ].map(([number, title, detail]) => (
                <motion.div
                  className="timeline-step"
                  key={number}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: reduceMotion ? 0 : Number(number) * 0.07 }}
                >
                  <span className="timeline-number">{number}</span>
                  <div><h3>{title}</h3><p>{detail}</p></div>
                </motion.div>
              ))}
            </Reveal>
          </div>
        </section>

        <section id="achievements" className="content-section">
          <div className="section-inner">
            <SectionHeading
              eyebrow="Participation & growth"
              title="Showing up to learn."
              detail="I value the experience of working with others, building under a deadline, and learning from the developer community."
            />
            <Reveal className="achievement-panel">
              <span className="achievement-number">~06</span>
              <div className="achievement-copy">
                <p className="eyebrow">Hackathons attended</p>
                <h3>Learning through the challenge.</h3>
                <p>I’ve attended around six hackathons, using each experience to practice collaboration, explore ideas, and keep growing as a builder.</p>
              </div>
              <span className="achievement-icon" aria-hidden="true">↗</span>
            </Reveal>
            <p className="achievement-note">No awards or certifications are listed because none have been provided for this portfolio.</p>
          </div>
        </section>

        <section id="interests" className="content-section section-alt">
          <div className="section-inner">
            <SectionHeading
              eyebrow="What inspires me"
              title="Curiosity, with a purpose."
              detail="Areas I’m excited to explore further as I grow my skills and build useful, thoughtful technology."
            />
            <div className="interest-grid">
              {interests.map((interest) => (
                <motion.article
                  className="interest-card"
                  key={interest.number}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.48, delay: reduceMotion ? 0 : Number(interest.number) * 0.06 }}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                >
                  <span className="skill-index">{interest.number}</span>
                  <h3>{interest.title}</h3>
                  <p>{interest.description}</p>
                  <span className="interest-arrow" aria-hidden="true">↗</span>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="section-inner contact-inner">
            <p className="eyebrow">Open to learning & collaboration</p>
            <h2 className="contact-title">
              Let’s build
              <br />
              <span className="text-gradient">something meaningful.</span>
            </h2>
            <p className="contact-description">
              I’m excited to connect with developers, learn from experienced
              professionals, collaborate on projects and hackathons, and explore
              opportunities to grow as a software engineer.
            </p>
            <Reveal className="contact-layout">
              <div className="contact-invitation">
                <span className="contact-invitation-mark" aria-hidden="true">✳</span>
                <h3>Have a project or idea?</h3>
                <p>Let’s talk about development, technology, or a challenge worth solving together.</p>
                {site.email ? (
                  <a className="button button-primary" href={`mailto:${site.email}`}>Email me <span aria-hidden="true">↗</span></a>
                ) : (
                  <p className="config-hint">Add your email to <code>src/config/site.ts</code> to publish a direct contact link.</p>
                )}
                {site.socials.length > 0 && (
                  <div className="social-links">
                    {site.socials.map((social) => (
                      <a href={social.url} key={social.label} target="_blank" rel="noreferrer">{social.label} <span aria-hidden="true">↗</span></a>
                    ))}
                  </div>
                )}
              </div>
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <label>
                  Name
                  <input name="name" autoComplete="name" required placeholder="Your name" />
                </label>
                <label>
                  Email
                  <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
                </label>
                <label>
                  Subject
                  <input name="subject" required placeholder="What would you like to discuss?" />
                </label>
                <label>
                  Message
                  <textarea name="message" rows={4} required placeholder="Tell me a little about it..." />
                </label>
                <button className="button button-primary form-submit" type="submit">Prepare email <span aria-hidden="true">↗</span></button>
                <p className="form-status" role="status" aria-live="polite">{formMessage}</p>
              </form>
            </Reveal>
            <footer className="footer-row">
              <span>© {new Date().getFullYear()} {site.name}</span>
              <a href="#hero" className="back-to-top">Back to top <span aria-hidden="true">↑</span></a>
              <span>From ideas to impact.</span>
            </footer>
          </div>
        </section>
      </main>
      <AnimatePresence>
        {selectedProject && <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </>
  );
}
