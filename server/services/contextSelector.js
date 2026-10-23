import { portfolioData } from '../data/portfolioData.js';

// Keyword routing per section. Includes common Hinglish / Hindi terms so
// "uski padhai kya hai" or "संपर्क" still pick the right facts.
const SECTION_KEYWORDS = {
  education: ['educat', 'degree', 'college', 'university', 'school', 'b.tech', 'btech', 'cgpa', 'study', 'studied', 'graduat', 'rgpv', 'padhai', 'padha', 'शिक्षा', 'पढ़ाई', 'कॉलेज', 'डिग्री'],
  skills: ['skill', 'tech', 'stack', 'language', 'framework', 'react', 'node', 'express', 'mongo', 'sql', 'docker', 'javascript', 'c++', 'tool', 'know', 'aata', 'jaanta', 'kaushal', 'स्किल', 'कौशल', 'टेक'],
  experience: ['experience', 'work', 'job', 'company', 'cosmofeed', 'role', 'employ', 'career', 'responsib', 'achiev', 'kaam', 'naukri', 'anubhav', 'अनुभव', 'काम', 'नौकरी', 'कंपनी'],
  projects: ['project', 'built', 'build', 'app', 'portfolio', 'github', 'repo', 'demo', 'banaya', 'प्रोजेक्ट'],
  ai: ['ai', 'a.i', 'llm', 'gpt', 'gemini', 'rag', 'agent', 'langgraph', 'langchain', 'machine learning', 'ml', 'vector', 'computer vision', 'opencv', 'एआई'],
  dsa: ['dsa', 'leetcode', 'codechef', 'codeforces', 'geeksforgeeks', 'gfg', 'competitive', 'algorithm', 'problem', 'coding'],
  achievements: ['achievement', 'award', 'certif', 'activit', 'club', 'intern', 'उपलब्धि'],
  learning: ['learn', 'roadmap', 'system design', 'microservice', 'kubernetes', 'aws', 'devops', 'future', 'seekh', 'सीख'],
  contact: ['contact', 'email', 'mail', 'linkedin', 'reach', 'hire', 'connect', 'resume', 'cv', 'sampark', 'संपर्क', 'ईमेल'],
  availability: ['available', 'availab', 'opportunit', 'open to', 'hiring', 'hire', 'freelance', 'contract', 'full-time', 'join', 'notice', 'relocat', 'salary', 'उपलब्ध'],
};

// Sections always sent so the model can introduce Piyush and point to contact.
const ALWAYS_INCLUDED = ['profile', 'contact'];

function matches(text, keyword) {
  // Short ASCII keywords ("ai", "ml", "cv") must match as whole words to avoid
  // false hits like "ai" inside "maintain".
  if (/^[a-z.]{1,3}$/.test(keyword)) {
    return new RegExp(`(^|[^a-z])${keyword.replace('.', '\\.')}([^a-z]|$)`).test(text);
  }
  return text.includes(keyword);
}

/**
 * Pick the portfolio sections relevant to the visitor's message.
 * Falls back to all sections when nothing matches (follow-ups like
 * "tell me more", greetings, or other languages) — the dataset is small.
 * @param {string} message
 * @param {string} [previousUserMessage] - last user turn, for follow-ups
 * @returns {string[]} section keys
 */
export function selectSections(message, previousUserMessage = '') {
  const text = `${message} ${previousUserMessage}`.toLowerCase();
  const matched = Object.entries(SECTION_KEYWORDS)
    .filter(([, keywords]) => keywords.some((k) => matches(text, k)))
    .map(([section]) => section);

  if (matched.length === 0) return Object.keys(portfolioData);

  const sections = new Set([...ALWAYS_INCLUDED, ...matched, 'missingOrUnverified']);
  if (sections.has('projects')) sections.add('allProjectsUrl');
  return [...sections];
}

/**
 * Serialize the selected sections into a compact context block.
 * @param {string[]} sections
 * @returns {string}
 */
export function buildContext(sections) {
  const subset = Object.fromEntries(sections.map((key) => [key, portfolioData[key]]));
  return JSON.stringify(subset);
}
