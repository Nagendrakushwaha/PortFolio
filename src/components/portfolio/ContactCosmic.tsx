import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  ArrowUp, 
  Sparkles, 
  MessageSquare, 
  Globe,
  Phone
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';
import { profileData } from '../../data/profile';

interface ContactCosmicProps {
  onReturnToTop: () => void;
}

export const ContactCosmic: React.FC<ContactCosmicProps> = ({ onReturnToTop }) => {
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');

  const copyEmail = () => {
    navigator.clipboard.writeText(profileData.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLaunchMailClient = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${profileData.contact.email}?subject=${encodeURIComponent(
      subject || 'Collaboration / Inquiry regarding AI Engineering'
    )}&body=${encodeURIComponent(
      `Hello Nagendra,\n\n${message}\n\nFrom: ${senderName}`
    )}`;
    window.location.href = mailtoUrl;
  };

  return (
    <footer id="contact" className="relative py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
      <div className="space-y-4 text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Mail className="w-3.5 h-3.5" />
          <span>CONTACT & COLLABORATION</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
          Initiate Dimensional Communication
        </h2>
        <p className="text-sm font-mono text-slate-400">
          Open for technical discussions, AI/ML engineering roles, internships, and data science collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* Left Column: Coordinates & Direct Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
            <h3 className="text-lg font-display font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Direct Coordinates</span>
            </h3>

            {/* Email Box with One-Click Copy */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">
                Primary Contact Destination
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs sm:text-sm text-cyan-300 break-all select-all">
                  {profileData.contact.email}
                </span>
                <button
                  onClick={copyEmail}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center space-x-1.5 transition-all shrink-0"
                  title="Copy email address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-3 font-mono text-xs">
              {profileData.contact.github && (
                <a
                  href={profileData.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl glass-card border border-white/5 hover:border-cyan-400/50 text-slate-200 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <GithubIcon className="w-4 h-4 text-cyan-400" />
                    <span>GitHub Profile</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">github.com/nagendrakushwaha</span>
                </a>
              )}

              {profileData.contact.linkedin && (
                <a
                  href={profileData.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl glass-card border border-white/5 hover:border-purple-400/50 text-slate-200 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <LinkedinIcon className="w-4 h-4 text-purple-400" />
                    <span>LinkedIn Professional Network</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">in/nagendrakushwaha</span>
                </a>
              )}

              {profileData.contact.phone && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 text-slate-300">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-cyan-400" />
                    <span>Voice / Telemetry</span>
                  </div>
                  <span className="font-mono text-cyan-300">{profileData.contact.phone}</span>
                </div>
              )}

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 text-slate-400">
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Geographic Location</span>
                </div>
                <span className="text-slate-300">{profileData.contact.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Dispatcher Form (Mailto client builder) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleLaunchMailClient}
            className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/30 space-y-4"
          >
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300 pb-2 border-b border-white/10">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>TRANSMIT DIRECT MESSAGE DRAFT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Your Name / Organization</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full px-4 py-2.5 rounded-xl glass-panel border border-white/15 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Subject Topic</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. AI Engineering Internship"
                  className="w-full px-4 py-2.5 rounded-xl glass-panel border border-white/15 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Message Content</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="State your technical inquiry, project opportunity, or collaboration details..."
                className="w-full p-4 rounded-xl glass-panel border border-white/15 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-mono text-xs font-bold tracking-wider shadow-glow-cyan hover:shadow-cyan-400/60 transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>OPEN DIRECT IN MAIL CLIENT</span>
            </button>

            <p className="text-[11px] font-mono text-slate-500 text-center">
              * Launches your preferred email client pre-populated with verified parameters. No hidden server storage.
            </p>
          </form>
        </div>
      </div>

      {/* Return to Top Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5 text-xs font-mono text-slate-500 gap-4">
        <div>
          © {new Date().getFullYear()} {profileData.name} • A Journey Through The AI Multiverse
        </div>

        <button
          onClick={onReturnToTop}
          className="flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-white transition-all"
        >
          <span>Return to Cosmic Awakening</span>
          <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>
    </footer>
  );
};
