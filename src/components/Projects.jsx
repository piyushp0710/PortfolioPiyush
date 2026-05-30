import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiCode } from 'react-icons/fi';
import { SectionHeader } from './About';

const projects = [
  {
    id: 1,
    title: 'Creator Platform',
    description: 'A full-featured content creator monetization platform enabling creators to sell digital products, manage subscriptions, and engage with their audience. Built with real-time features and payment integration.',
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Stripe', 'JWT'],
    category: 'Full Stack',
    github: 'https://github.com/piyushp0710',
    live: '#',
    gradient: 'from-blue-600/20 to-cyan-600/20',
    featured: true,
  },
  {
    id: 2,
    title: 'Vehicle Mechanic Booking',
    description: 'An on-demand vehicle repair booking platform connecting car owners with certified mechanics. Features real-time tracking, service history, reviews, and location-based mechanic discovery.',
    stack: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Google Maps API', 'Socket.io'],
    category: 'Full Stack',
    github: 'https://github.com/piyushp0710',
    live: '#',
    gradient: 'from-orange-600/20 to-amber-600/20',
    featured: true,
  },
  {
    id: 3,
    title: 'AI Content Assistant',
    description: 'An intelligent content generation tool powered by LLM APIs. Supports RAG-based document Q&A, blog generation, SEO optimization suggestions, and multi-format content export.',
    stack: ['React.js', 'Node.js', 'LangChain', 'OpenAI API', 'Vector DB', 'MongoDB'],
    category: 'AI',
    github: 'https://github.com/piyushp0710',
    live: '#',
    gradient: 'from-violet-600/20 to-purple-600/20',
    featured: true,
  },
  {
    id: 4,
    title: 'MERN Auth Boilerplate',
    description: 'Production-ready authentication system with JWT refresh tokens, role-based access control, email verification, and password reset flows. Used as a starter for multiple projects.',
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Nodemailer'],
    category: 'Backend',
    github: 'https://github.com/piyushp0710',
    live: '#',
    gradient: 'from-green-600/20 to-emerald-600/20',
    featured: false,
  },
  {
    id: 5,
    title: 'DSA Visualizer',
    description: 'Interactive visualization tool for common data structures and algorithms. Helps students understand sorting, graph traversal, and tree operations through animated step-by-step execution.',
    stack: ['React.js', 'JavaScript', 'CSS Animations', 'Tailwind CSS'],
    category: 'Frontend',
    github: 'https://github.com/piyushp0710',
    live: '#',
    gradient: 'from-pink-600/20 to-rose-600/20',
    featured: false,
  },
  {
    id: 6,
    title: 'Task Management API',
    description: 'RESTful API for team task management with workspaces, project boards, task assignment, priorities, due dates, and activity logging. Fully documented with Swagger.',
    stack: ['Node.js', 'Express.js', 'MongoDB', 'Swagger', 'JWT', 'Mongoose'],
    category: 'Backend',
    github: 'https://github.com/piyushp0710',
    live: '#',
    gradient: 'from-teal-600/20 to-cyan-600/20',
    featured: false,
  },
];

const categories = ['All', 'Full Stack', 'Frontend', 'Backend', 'AI'];

export default function Projects() {
  const [active, setActive] = useState('All');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="py-24 bg-[var(--bg1)]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="My Work"
          title="Featured Projects"
          subtitle="A selection of projects I've built — from full-stack web apps to AI-powered tools."
        />

        {/* Filter tabs */}
        <div ref={ref} className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                active === cat
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20'
                  : 'border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: inView ? i * 0.07 : 0 }}
                className="group relative p-6 rounded-2xl bg-[var(--bgcard)] border border-white/5 hover:border-blue-500/20 transition-all overflow-hidden"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      {project.featured && (
                        <span className="text-xs font-mono text-blue-400 mb-2 block">⭐ Featured</span>
                      )}
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-xs text-gray-500 mt-1">{project.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                        aria-label="GitHub"
                      >
                        <FiGithub size={16} />
                      </a>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                        aria-label="Live Demo"
                      >
                        <FiExternalLink size={16} />
                      </a>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed mb-5">
                    {project.description}
                  </p>

                  {/* Stack */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded text-xs font-mono bg-white/5 text-gray-400 border border-white/5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/piyushp0710"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/30 transition-all"
          >
            <FiGithub size={18} />
            View All on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
