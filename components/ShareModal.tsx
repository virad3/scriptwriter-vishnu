import React, { useState } from 'react';
import { Project } from '../types';
import { X, Copy, UserPlus, Globe, Lock, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onInvite: (email: string) => void;
  currentUserEmail?: string | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, project, onInvite, currentUserEmail }) => {
  const [email, setEmail] = useState('');
  const [accessType, setAccessType] = useState<'restricted' | 'public'>('restricted');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !project) return null;

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onInvite(email.trim());
      setEmail('');
    }
  };

  const handleCopyLink = () => {
    const dummyLink = `https://writeroom.ai/p/${project.id}`;
    navigator.clipboard.writeText(dummyLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#1e293b] rounded-xl border border-slate-600 w-[550px] shadow-2xl flex flex-col overflow-hidden">
        
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-[#1e293b]">
          <h3 className="text-xl font-bold text-white">Share "{project.title}"</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 bg-[#0f172a]">
          
          {/* Invite Section */}
          <div>
             <form onSubmit={handleInvite} className="flex gap-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Add people, groups, or emails" 
                  className="flex-1 bg-[#1e293b] border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
                <button 
                  type="submit"
                  disabled={!email}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  <UserPlus size={18} /> Invite
                </button>
             </form>
          </div>

          {/* People with Access */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">People with access</h4>
            <div className="space-y-3">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                        {currentUserEmail ? currentUserEmail[0].toUpperCase() : 'ME'}
                     </div>
                     <div>
                        <div className="text-sm font-medium text-white">{currentUserEmail || 'You'} (Owner)</div>
                        <div className="text-xs text-slate-500">{currentUserEmail || 'owner@example.com'}</div>
                     </div>
                  </div>
                  <span className="text-xs text-slate-400">Owner</span>
               </div>

               {project.collaborators?.map((collabEmail, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                            {collabEmail[0].toUpperCase()}
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-200">{collabEmail.split('@')[0]}</div>
                            <div className="text-xs text-slate-500">{collabEmail}</div>
                        </div>
                    </div>
                    <select className="bg-transparent text-xs text-slate-400 border-none outline-none cursor-pointer hover:text-blue-400">
                        <option>Editor</option>
                        <option>Viewer</option>
                        <option>Commenter</option>
                    </select>
                  </div>
               ))}
            </div>
          </div>

          {/* General Access Link */}
          <div className="pt-4 border-t border-slate-700">
             <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">General Access</h4>
             <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                        {accessType === 'restricted' ? <Lock size={20} /> : <Globe size={20} />}
                    </div>
                    <div>
                        <select 
                            value={accessType}
                            onChange={(e) => setAccessType(e.target.value as any)}
                            className="bg-transparent text-sm font-medium text-white border-none outline-none cursor-pointer hover:text-blue-400 p-0"
                        >
                            <option value="restricted">Restricted</option>
                            <option value="public">Anyone with the link</option>
                        </select>
                        <div className="text-xs text-slate-500">
                            {accessType === 'restricted' 
                                ? 'Only people with access can open with the link' 
                                : 'Anyone on the internet with the link can view'}
                        </div>
                    </div>
                 </div>
             </div>

             <div className="flex gap-2">
                 <button 
                    onClick={handleCopyLink}
                    className="flex-1 flex items-center justify-center gap-2 border border-blue-600 text-blue-400 hover:bg-blue-600/10 rounded-lg py-2 text-sm font-medium transition-colors"
                 >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Link Copied' : 'Copy Link'}
                 </button>
                 <button onClick={onClose} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm">
                    Done
                 </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShareModal;