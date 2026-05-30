import { FiGithub, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';

const socials = [
  { icon: FiGithub, href: 'https://github.com/piyushp0710', label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://www.linkedin.com/in/piyush-pandey-640185228/', label: 'LinkedIn' },
  { icon: SiLeetcode, href: 'https://leetcode.com/u/Piyushpandey123/', label: 'LeetCode' },
  { icon: FiMail, href: 'mailto:piyushpandey.rahana@gmail.com', label: 'Email' },
];

const navLinks = ['About', 'Skills', 'Experience', 'Projects', 'DSA', 'Contact'];

export default function Footer() {
  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--bg1)] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <div className="text-2xl font-black gradient-text mb-1">Piyush Pandey</div>
            <div className="text-sm text-gray-500">Associate Software Engineer · MERN Stack Developer</div>
          </div>
          <div className="flex gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/30 hover:bg-blue-500/10 transition-all"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-12">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              {link}
            </button>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <span>© {new Date().getFullYear()} Piyush Pandey. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with <FiHeart size={12} className="text-red-500 mx-1" /> using React + Tailwind + Framer Motion
          </span>
        </div>
      </div>
    </footer>
  );
}
