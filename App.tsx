import React, { useState, useEffect } from 'react';
import ScriptEditor from './components/ScriptEditor';
import BeatBoard from './components/BeatBoard';
import AnalysisDashboard from './components/AnalysisDashboard';
import LoginScreen from './components/LoginScreen';
import { Logo } from './components/Logo';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppState, ScriptElement, BeatCard, ScriptFormat } from './types';
import { v4 as uuidv4 } from 'uuid';
import { 
  FileText, Layout, Users, Settings, Bot,
  PanelRightClose, Share2, Download, Cloud,
  Columns, LogOut, Loader2, Menu
} from 'lucide-react';
import { generateScriptContinuation } from './services/geminiService';

const MainApp = () => {
  const { user, signOut } = useAuth();
  
  // --- State ---
  const [script, setScript] = useState<ScriptElement[]>([
    { id: uuidv4(), type: 'scene-heading', content: 'INT. STARTUP OFFICE - DAY' },
    { id: uuidv4(), type: 'action', content: 'A messy desk. Coffee cups everywhere. Cables snake across the floor like vines in a tech jungle.' },
    { id: uuidv4(), type: 'character', content: 'DAVE' },
    { id: uuidv4(), type: 'dialogue', content: 'We need to ship this today. Or we are dead.' },
    { id: uuidv4(), type: 'action', content: 'He smashes the enter key.' },
    { id: uuidv4(), type: 'character', content: 'SARAH' },
    { id: uuidv4(), type: 'parenthetical', content: '(looking up)' },
    { id: uuidv4(), type: 'dialogue', content: 'Relax. It works on my machine.' }
  ]);
  
  const [beats, setBeats] = useState<BeatCard[]>([]);
  const [view, setView] = useState<AppState['view']>('write');
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Saved');
  const [scriptFormat, setScriptFormat] = useState<ScriptFormat>('standard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Mock Auto-Save ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setSyncStatus('Saving...');
      localStorage.setItem('writeroom-script', JSON.stringify(script));
      setTimeout(() => setSyncStatus('All changes saved'), 800);
    }, 2000);
    return () => clearTimeout(timer);
  }, [script, beats]);

  // --- AI Handler ---
  const handleAiAssist = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    const newElements = await generateScriptContinuation(script, aiPrompt);
    if (newElements.length > 0) {
        const readyElements = newElements.map(e => ({...e, id: uuidv4()}));
        setScript([...script, ...readyElements]);
        setAiPrompt('');
    }
    setAiLoading(false);
  };

  return (
    <div className="flex h-screen w-screen bg-[#121212] text-white font-sans overflow-hidden">
      
      {/* --- Sidebar --- */}
      <nav className={`w-16 flex flex-col items-center py-6 bg-[#1a1a1a] border-r border-gray-800 z-20 transition-all ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed md:relative h-full`}>
        <div className="mb-8 p-2 rounded-lg">
           <Logo className="w-10 h-10" />
        </div>
        
        <div className="flex flex-col gap-6 w-full">
            <SidebarIcon icon={<FileText size={20} />} active={view === 'write'} onClick={() => setView('write')} label="Script" />
            <SidebarIcon icon={<Layout size={20} />} active={view === 'outline'} onClick={() => setView('outline')} label="Outline" />
            <SidebarIcon icon={<ActivityIcon />} active={view === 'analysis'} onClick={() => setView('analysis')} label="Analysis" />
            <SidebarIcon icon={<Users size={20} />} active={false} onClick={() => {}} label="Team" />
        </div>

        <div className="mt-auto flex flex-col gap-6 items-center w-full pb-4">
            <SidebarIcon icon={<Settings size={20} />} active={false} onClick={() => {}} label="Settings" />
            
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-600 hover:border-blue-500 transition-colors cursor-pointer group relative">
                {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xs font-bold">{user?.displayName?.[0] || 'U'}</span>
                )}
                
                {/* Logout Tooltip/Button */}
                <div className="absolute left-10 bottom-0 bg-gray-900 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 z-50">
                    <button onClick={signOut} className="flex items-center gap-2 px-2 py-1 text-xs whitespace-nowrap hover:text-red-400">
                        <LogOut size={12} /> Sign Out
                    </button>
                </div>
            </div>
        </div>
      </nav>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col relative h-full">
        
        {/* Top Header */}
        <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-[#1a1a1a]">
           <div className="flex items-center gap-4">
               {/* Hamburger / Menu Icon for Mobile */}
               <button 
                className="text-gray-400 hover:text-white md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               >
                   <Menu size={24} />
               </button>
               
               {/* Logo next to Hamburger on all screens if desired, but typically branding is sidebar or top left */}
               <div className="flex items-center gap-3">
                   {/* Optional small logo in header for mobile branding */}
                   <Logo className="w-6 h-6 md:hidden" />
                   <h1 className="font-bold text-gray-200">Untitled Screenplay</h1>
               </div>
               
               <span className="text-xs text-gray-500 flex items-center gap-1 hidden sm:flex">
                   <Cloud size={12} /> {syncStatus}
               </span>
           </div>

           <div className="flex items-center gap-3">
               {/* View Toggle */}
               {view === 'write' && (
                   <div className="bg-gray-800 rounded-lg p-1 flex mr-2">
                       <button 
                           onClick={() => setScriptFormat('standard')}
                           className={`px-3 py-1 text-xs font-medium rounded ${scriptFormat === 'standard' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                       >
                           Standard
                       </button>
                       <button 
                           onClick={() => setScriptFormat('split')}
                           className={`px-3 py-1 text-xs font-medium rounded flex items-center gap-1 ${scriptFormat === 'split' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                           title="Split / Malayalam Format"
                       >
                           <Columns size={12} /> Split
                       </button>
                   </div>
               )}

               <div className="flex -space-x-2 mr-4 hidden sm:flex">
                   {/* Collaborative users placeholders */}
                   <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#1a1a1a]" title="Alice"></div>
                   <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-[#1a1a1a]" title="Bob"></div>
               </div>
               
               <button 
                  onClick={() => setAiPanelOpen(!aiPanelOpen)}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${aiPanelOpen ? 'bg-purple-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
                >
                   <Bot size={18} /> <span className="hidden sm:inline">AI Tools</span>
               </button>

               <button className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded text-sm font-medium flex items-center gap-2">
                   <Share2 size={14} /> <span className="hidden sm:inline">Share</span>
               </button>
               <button className="text-gray-400 hover:text-white p-2">
                   <Download size={18} />
               </button>
           </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-hidden relative bg-[#121212] flex">
            {/* Center Panel */}
            <div className={`flex-1 h-full overflow-y-auto ${view === 'write' ? 'bg-[#262626]' : 'bg-[#1e1e1e]'} transition-all`}>
                {view === 'write' && (
                    <ScriptEditor 
                        script={script} 
                        setScript={setScript} 
                        activeElementId={activeElementId}
                        setActiveElementId={setActiveElementId}
                        scriptFormat={scriptFormat}
                    />
                )}
                {view === 'outline' && <BeatBoard beats={beats} setBeats={setBeats} />}
                {view === 'analysis' && <AnalysisDashboard script={script} />}
            </div>

            {/* AI Side Panel */}
            {aiPanelOpen && (
                <div className="w-80 bg-[#1a1a1a] border-l border-gray-800 flex flex-col shadow-2xl z-30 absolute right-0 h-full md:relative">
                    <div className="p-4 border-b border-gray-800 font-bold flex justify-between items-center text-purple-400">
                        <span>AI Co-Writer</span>
                        <button onClick={() => setAiPanelOpen(false)}><PanelRightClose size={16} /></button>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="bg-gray-800 p-3 rounded text-sm text-gray-300 mb-4">
                            Need help with a scene? Select text or just ask me to continue the story.
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-800 bg-[#202020]">
                        <textarea 
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="e.g., 'Make dialogue funnier', 'Continue next scene'"
                            className="w-full bg-[#121212] rounded p-3 text-sm text-gray-200 border border-gray-700 focus:border-purple-500 outline-none resize-none h-24 mb-2"
                        />
                        <button 
                            onClick={handleAiAssist}
                            disabled={aiLoading}
                            className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded text-sm font-medium flex justify-center items-center gap-2 disabled:opacity-50"
                        >
                            {aiLoading ? <span className="animate-pulse">Generating...</span> : <><Bot size={16} /> Generate</>}
                        </button>
                    </div>
                </div>
            )}
        </div>

      </main>
    </div>
  );
};

const SidebarIcon = ({ icon, active, onClick, label }: { icon: any, active: boolean, onClick: () => void, label: string }) => (
    <div className="relative group flex flex-col items-center cursor-pointer" onClick={onClick}>
        <div className={`p-3 rounded-xl transition-all ${active ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'}`}>
            {icon}
        </div>
        <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {label}
        </div>
    </div>
);

const ActivityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

const App = () => {
    return (
        <AuthProvider>
            <AuthWrapper />
        </AuthProvider>
    );
};

const AuthWrapper = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-screen bg-[#121212] flex items-center justify-center text-white flex-col gap-4">
                <Loader2 className="animate-spin text-purple-500" size={40} />
                <span className="text-gray-500 text-sm">Loading WriteRoom...</span>
            </div>
        );
    }

    if (!user) {
        return <LoginScreen />;
    }

    return <MainApp />;
};

export default App;
