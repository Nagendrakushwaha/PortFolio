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
    <footer id="contact" className="relative py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
      <div className="space-y-4 text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-blue-700 font-semibold">
          <Mail className="w-3.5 h-3.5" />
          <span>CONTACT & COLLABORATION</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight">
          Initiate Communication
        </h2>
        <p className="text-sm font-sans text-slate-600">
          Open for technical discussions, AI/ML engineering roles, internships, and data science collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* Left Column: Coordinates & Direct Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
            <h3 className="text-lg font-display font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Direct Coordinates</span>
            </h3>

            {/* Email Box with One-Click Copy */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-mono text-slate-500 block uppercase font-semibold">
                Primary Contact Destination
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs sm:text-sm text-indigo-700 font-semibold break-all select-all">
                  {profileData.contact.email}
                </span>
                <button
                  onClick={copyEmail}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-mono flex items-center space-x-1.5 transition-all shrink-0"
                  title="Copy email address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
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
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-white text-slate-800 transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <GithubIcon className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-slate-800">GitHub Profile</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">github.com/nagendrakushwaha</span>
                </a>
              )}

              {profileData.contact.linkedin && (
                <a
                  href={profileData.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-400 hover:bg-white text-slate-800 transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <LinkedinIcon className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-slate-800">LinkedIn Network</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">in/nagendrakushwaha</span>
                </a>
              )}

              {profileData.contact.phone && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-slate-800">Voice / Telemetry</span>
                  </div>
                  <span className="font-mono text-indigo-700 font-semibold">{profileData.contact.phone}</span>
                </div>
              )}

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-800">Geographic Location</span>
                </div>
                <span className="text-slate-600 font-sans">{profileData.contact.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Dispatcher Form (Mailto client builder) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleLaunchMailClient}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-200/80 shadow-xl space-y-4"
          >
            <div className="flex items-center space-x-2 text-xs font-mono text-indigo-700 pb-2 border-b border-slate-200 font-bold">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>TRANSMIT DIRECT MESSAGE DRAFT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-700 font-semibold">Your Name / Organization</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-300 focus:border-indigo-600 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-700 font-semibold">Subject Topic</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. AI Engineering Opportunity"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-300 focus:border-indigo-600 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-700 font-semibold">Message Content</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="State your technical inquiry, project opportunity, or collaboration details..."
                className="w-full p-4 rounded-xl bg-slate-50 focus:bg-white border border-slate-300 focus:border-indigo-600 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none transition-all resize-none shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-mono text-xs font-bold tracking-wider shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center space-x-2"
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
      <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-200 text-xs font-mono text-slate-600 gap-4">
        <div>
          © {new Date().getFullYear()} {profileData.name} • AI & Machine Learning Portfolio
        </div>

        <button
          onClick={onReturnToTop}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-slate-300 hover:border-indigo-500 text-slate-700 hover:text-indigo-600 shadow-sm transition-all"
        >
          <span>Return to Cosmic Awakening</span>
          <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />
        </button>
      </div>
    </footer>
  );
};
