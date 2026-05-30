import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiMail, FiGithub, FiLinkedin, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import { SectionHeader } from './About';

const contactLinks = [
  {
    icon: FiMail,
    label: 'Email',
    value: 'piyush.pandey@cosmofeed.com',
    href: 'mailto:piyush.pandey@cosmofeed.com',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: FiLinkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/piyushpandey',
    href: 'https://linkedin.com/in/piyushpandey',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: FiGithub,
    label: 'GitHub',
    value: 'github.com/piyushp0710',
    href: 'https://github.com/piyushp0710',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 bg-[#080810]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Get In Touch"
          title="Let's Work Together"
          subtitle="I'm open to full-time roles, contract work, and interesting collaboration opportunities."
        />

        <div ref={ref} className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Open to Opportunities</h3>
              <p className="text-gray-400 leading-relaxed">
                Whether you have a full-time role, a freelance project, or just want to talk tech —
                I'd love to hear from you. I typically respond within 24 hours.
              </p>
            </div>

            <div className="space-y-4">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#13131f] border border-white/5 hover:border-blue-500/20 transition-all group"
                >
                  <div className={`w-11 h-11 rounded-xl ${link.bg} flex items-center justify-center flex-shrink-0`}>
                    <link.icon size={20} className={link.color} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{link.label}</div>
                    <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                      {link.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {sent ? (
              <div className="p-10 rounded-2xl bg-[#13131f] border border-green-500/20 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400">Thanks for reaching out. I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#13131f] border border-white/5 space-y-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-medium">Your Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-medium">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@company.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-medium">Message</label>
                  <div className="relative">
                    <FiMessageSquare className="absolute left-4 top-4 text-gray-500" size={16} />
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell me about the opportunity or project..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all resize-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-blue-500/20"
                >
                  {loading ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <FiSend size={16} />
                  )}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
