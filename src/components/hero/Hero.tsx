import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "../../config/site";
import { useStore } from "../../store";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export default function Hero() {
  const introLanded = useStore((s) => s.introLanded);
  const introComplete = useStore((s) => s.introComplete);
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section id="hero" className="hero-section">
      <motion.header
        className="hero-header"
        initial={reduceMotion ? false : { opacity: 0, y: -12 }}
        animate={introLanded ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: reduceMotion ? 0 : 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href="#hero" className="brand-mark" aria-label={`${site.name}, home`}>
          <span className="brand-symbol">IM</span>
          <span className="brand-caption">Portfolio <i>—</i> {new Date().getFullYear()}</span>
        </a>
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>
        <nav id="primary-navigation" className={`hero-nav${menuOpen ? " nav-open" : ""}`} aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
          ))}
        </nav>
      </motion.header>

      <motion.div
        className="hero-intro"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={introLanded ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: reduceMotion ? 0 : 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow"><span className="status-dot" /> Hello, I&apos;m {site.name}</p>
        <h1 className="hero-headline">
          Building the Future
          <br />
          Through{" "}
          <motion.span
            className="hero-highlight"
            initial={reduceMotion ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={introLanded ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ delay: reduceMotion ? 0 : 0.75, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Code &amp; Intelligence.
          </motion.span>
        </h1>
        <p className="hero-role">{site.role}</p>
        <p className="hero-tagline">
          I transform ideas into intelligent digital experiences through software
          development, artificial intelligence, and creative problem-solving.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#projects">Explore my work <span aria-hidden="true">↘</span></a>
          <a className="button button-secondary" href="#contact">Let&apos;s connect <span aria-hidden="true">↗</span></a>
        </div>
        <div className="hero-links">
          {site.socials.map((social) => (
            <a href={social.url} key={social.label} target="_blank" rel="noreferrer">{social.label} <span aria-hidden="true">↗</span></a>
          ))}
          {site.email && <a href={`mailto:${site.email}`}>Email <span aria-hidden="true">↗</span></a>}
        </div>
      </motion.div>

      <motion.div
        className="hero-bottom"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={introComplete ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="availability"><i /> Open to learning &amp; collaboration</span>
        <a href="#about" className="hero-scroll">
          <span>Scroll to explore</span>
          <span className="scroll-arrow" aria-hidden="true">↓</span>
        </a>
      </motion.div>
    </section>
  );
}
