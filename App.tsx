
import React, { useState, useEffect } from 'react';
import ScriptEditor from './components/ScriptEditor';
import BeatBoard from './components/BeatBoard';
import AnalysisDashboard from './components/AnalysisDashboard';
import CharactersView from './components/CharactersView';
import LocationsView from './components/LocationsView';
import ResearchView from './components/ResearchView';
import LoginScreen from './components/LoginScreen';
import ProjectSettingsModal from './components/ProjectSettingsModal';
import ProjectListModal from './components/ProjectListModal';
import ShareModal from './components/ShareModal';
import { Logo } from './components/Logo';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppState, ScriptElement, BeatCard, ScriptFormat, Project, CharacterProfile, LocationItem, ResearchItem } from './types';
import { v4 as uuidv4 } from 'uuid';
import { 
  FileText, Layout, Users, Settings, Bot,
  PanelRightClose, Share2, Download, Cloud,
  Columns, LogOut, Loader2, Menu, FolderOpen,
  PlusCircle, FileUp, FileDown, MessageSquare,
  BarChart2, Wrench, CreditCard, ChevronLeft,
  X, Trash2, Calendar, MoreVertical, Copy, Edit2, Link
} from 'lucide-react';
import { generateScriptContinuation } from './services/geminiService';

const MainApp = () => {
  const { user, signOut } = useAuth();
  
  // --- State ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  
  // Script content state
  const [script, setScript] = useState<ScriptElement[]>([]);
  const [beats, setBeats] = useState<BeatCard[]>([]);
  const [characters, setCharacters] = useState<CharacterProfile[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [research, setResearch] = useState<ResearchItem[]>([]);
  
  const [view, setView] = useState<AppState['view']>('write');
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  const [scriptFormat, setScriptFormat] = useState<ScriptFormat>('standard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectPanelOpen, setProjectPanelOpen] = useState(true);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);

  // Modals
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showProjectListModal, setShowProjectListModal] = useState(false);
  const [showProjectSettingsModal, setShowProjectSettingsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  // --- Load Projects on Mount ---
  useEffect(() => {
    const savedProjects = localStorage.getItem('writeroom-projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // --- Auto-Save ---
  useEffect(() => {
    if (!currentProject) return;

    const timer = setTimeout(() => {
      setSyncStatus('Saving...');
      localStorage.setItem(`writeroom-script-${currentProject.id}`, JSON.stringify(script));
      localStorage.setItem(`writeroom-beats-${currentProject.id}`, JSON.stringify(beats));
      localStorage.setItem(`writeroom-characters-${currentProject.id}`, JSON.stringify(characters));
      localStorage.setItem(`writeroom-locations-${currentProject.id}`, JSON.stringify(locations));
      localStorage.setItem(`writeroom-research-${currentProject.id}`, JSON.stringify(research));
      
      // Update last modified timestamp
      setProjects(prevProjects => {
          const updated = prevProjects.map(p => 
            p.id === currentProject.id ? { ...p, lastModified: Date.now() } : p
          );
          localStorage.setItem('writeroom-projects', JSON.stringify(updated));
          return updated;
      });

      setTimeout(() => setSyncStatus('Saved'), 800);
    }, 2000);
    return () => clearTimeout(timer);
  }, [script, beats, characters, locations, research]); 

  // --- Project Actions ---

  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) return;

    const newProject: Project = {
      id: uuidv4(),
      title: newProjectTitle,
      lastModified: Date.now()
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('writeroom-projects', JSON.stringify(updatedProjects));

    // Initialize fresh state
    const initialScript: ScriptElement[] = [{ id: uuidv4(), type: 'scene-heading', content: 'INT. ' }];
    setScript(initialScript);
    setBeats([]);
    setCharacters([]);
    setLocations([]);
    setResearch([]);
    
    // Save initial state
    localStorage.setItem(`writeroom-script-${newProject.id}`, JSON.stringify(initialScript));
    localStorage.setItem(`writeroom-beats-${newProject.id}`, JSON.stringify([]));
    localStorage.setItem(`writeroom-characters-${newProject.id}`, JSON.stringify([]));
    localStorage.setItem(`writeroom-locations-${newProject.id}`, JSON.stringify([]));
    localStorage.setItem(`writeroom-research-${newProject.id}`, JSON.stringify([]));

    setCurrentProject(newProject);
    setNewProjectTitle('');
    setShowNewProjectModal(false);
    setView('write');
  };

  const handleOpenProject = (project: Project) => {
    const savedScript = localStorage.getItem(`writeroom-script-${project.id}`);
    const savedBeats = localStorage.getItem(`writeroom-beats-${project.id}`);
    const savedCharacters = localStorage.getItem(`writeroom-characters-${project.id}`);
    const savedLocations = localStorage.getItem(`writeroom-locations-${project.id}`);
    const savedResearch = localStorage.getItem(`writeroom-research-${project.id}`);

    setScript(savedScript ? JSON.parse(savedScript) : []);
    setBeats(savedBeats ? JSON.parse(savedBeats) : []);
    setCharacters(savedCharacters ? JSON.parse(savedCharacters) : []);
    setLocations(savedLocations ? JSON.parse(savedLocations) : []);
    setResearch(savedResearch ? JSON.parse(savedResearch) : []);
    
    setCurrentProject(project);
    setShowProjectListModal(false);
    setView('write');
  };

  const handleDeleteProject = (projectId: string) => {
    // 1. Identify the project to delete (for the confirmation message)
    // We try to find it, but if not found in current scope, we default title.
    const projectToDelete = projects.find(p => p.id === projectId);
    const title = projectToDelete ? projectToDelete.title : 'this project';

    // 2. Confirm with user
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      
      // 3. Update State & Local Storage
      // Use functional update to avoid stale closure issues
      setProjects(prevProjects => {
          const updatedProjects = prevProjects.filter(p => p.id !== projectId);
          localStorage.setItem('writeroom-projects', JSON.stringify(updatedProjects));
          return updatedProjects;
      });
      
      // 4. Clean up Project Data
      const dataTypes = ['script', 'beats', 'characters', 'locations', 'research'];
      dataTypes.forEach(type => {
          localStorage.removeItem(`writeroom-${type}-${projectId}`);
      });

      // 5. Handle Active Project Deletion
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
        setScript([]);
        setBeats([]);
        setCharacters([]);
        setLocations([]);
        setResearch([]);
        setView('write'); 
      }
      
      setProjectMenuOpen(false);
    }
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prevProjects => {
        const updated = prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p);
        localStorage.setItem('writeroom-projects', JSON.stringify(updated));
        return updated;
    });
    setCurrentProject(updatedProject);
  };

  const handleDuplicateProject = (project: Project) => {
      const newId = uuidv4();
      const newProject: Project = {
          ...project,
          id: newId,
          title: `${project.title} (Copy)`,
          lastModified: Date.now()
      };

      // Copy local storage data deeply
      const dataKeys = ['script', 'beats', 'characters', 'locations', 'research'];
      dataKeys.forEach(key => {
          const data = localStorage.getItem(`writeroom-${key}-${project.id}`);
          if (data) {
              localStorage.setItem(`writeroom-${key}-${newId}`, data);
          }
      });

      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      localStorage.setItem('writeroom-projects', JSON.stringify(updatedProjects));
      setProjectMenuOpen(false);
      
      // Open the duplicated project immediately for better UX
      handleOpenProject(newProject);
  };

  const handleInviteCollaborator = (email: string) => {
    if (!currentProject) return;
    const collaborators = currentProject.collaborators || [];
    if (!collaborators.includes(email)) {
        const updatedProject = {
            ...currentProject,
            collaborators: [...collaborators, email]
        };
        handleUpdateProject(updatedProject);
    }
  };

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
    <div className="flex h-screen w-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden">
      
      {/* --- Icon Rail Sidebar (Leftmost) --- */}
      <nav className="w-16 flex flex-col items-center py-4 bg-[#1e293b] border-r border-slate-700 z-30 shrink-0">
        <div className="mb-6">
           <Logo className="w-8 h-8" />
        </div>
        
        <div className="flex flex-col gap-4 w-full">
            {/* Project button now opens Project List Modal */}
            <SidebarIcon icon={<FileText size={20} />} active={view === 'write' && !showProjectListModal} onClick={() => setShowProjectListModal(true)} label="Project" />
            <SidebarIcon icon={<Layout size={20} />} active={view === 'outline'} onClick={() => setView('outline')} label="Cards" />
            <SidebarIcon icon={<Users size={20} />} active={view === 'characters'} onClick={() => setView('characters')} label="Chars" />
            <SidebarIcon icon={<BarChart2 size={20} />} active={view === 'analysis'} onClick={() => setView('analysis')} label="Analysis" />
            <SidebarIcon icon={<Wrench size={20} />} active={false} onClick={() => {}} label="Tools" />
        </div>

        <div className="mt-auto flex flex-col gap-4 items-center w-full pb-4">
            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center overflow-hidden border border-slate-500 hover:border-blue-400 transition-colors cursor-pointer group relative">
                {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xs font-bold">{user?.displayName?.[0] || 'VK'}</span>
                )}
            </div>
            <SidebarIcon icon={<LogOut size={20} />} active={false} onClick={signOut} label="Sign Out" />
        </div>
      </nav>

      {/* --- Project Panel (Secondary Sidebar) --- */}
      {projectPanelOpen && (
          <div className="w-64 bg-[#1e293b] border-r border-slate-700 flex flex-col hidden md:flex shrink-0 relative">
             <div className="h-12 flex items-center px-4 border-b border-slate-700 bg-[#1e293b] justify-between">
                 <span className="font-semibold text-sm text-slate-300 truncate flex-1 mr-2">{currentProject?.title || 'No Project Open'}</span>
                 
                 {currentProject && (
                    <div className="relative">
                        <button 
                            onClick={() => setProjectMenuOpen(!projectMenuOpen)}
                            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700 transition-colors"
                            title="Project Actions"
                        >
                            <MoreVertical size={16} />
                        </button>
                        
                        {projectMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setProjectMenuOpen(false)}></div>
                                <div className="absolute right-0 top-8 w-48 bg-[#1e293b] border border-slate-600 shadow-xl rounded-lg z-50 flex flex-col py-1">
                                    <button onClick={() => { setProjectMenuOpen(false); setShowShareModal(true); }} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white text-left w-full">
                                        <Share2 size={14} /> Share Project
                                    </button>
                                    <button onClick={() => handleDuplicateProject(currentProject)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white text-left w-full">
                                        <Copy size={14} /> Duplicate Project
                                    </button>
                                    <button onClick={() => { setProjectMenuOpen(false); setShowProjectSettingsModal(true); }} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white text-left w-full">
                                        <Settings size={14} /> Project Settings
                                    </button>
                                    <div className="border-t border-slate-700 my-1"></div>
                                    <button onClick={() => handleDeleteProject(currentProject.id)} className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 text-left w-full">
                                        <Trash2 size={14} /> Delete Project
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                 )}
             </div>

             <div className="flex-1 p-4 overflow-y-auto">
                 <div className="text-xs font-bold text-slate-500 uppercase mb-3">Project Documents</div>
                 {currentProject ? (
                    <div className="space-y-1">
                        <ProjectDocLink active={view === 'write'} onClick={() => setView('write')} label="Screenplay" />
                        <ProjectDocLink active={view === 'characters'} onClick={() => setView('characters')} label="Character Notes" />
                        <ProjectDocLink active={view === 'locations'} onClick={() => setView('locations')} label="Locations" />
                        <ProjectDocLink active={view === 'research'} onClick={() => setView('research')} label="Research" />
                    </div>
                 ) : (
                    <div className="text-sm text-slate-500 italic">Open a project to see docs</div>
                 )}
             </div>

             <div className="p-4 border-t border-slate-700 space-y-2">
                 <SidebarActionButton icon={<FileUp size={16} />} label="Import" />
                 <SidebarActionButton icon={<FileDown size={16} />} label="Export" />
                 <SidebarActionButton icon={<Download size={16} />} label="Quick Export (PDF)" />
                 <div className="h-px bg-slate-700 my-2"></div>
                 <div onClick={() => setShowNewProjectModal(true)}>
                    <SidebarActionButton icon={<PlusCircle size={16} />} label="New Project" />
                 </div>
                 <div onClick={() => setShowProjectListModal(true)}>
                    <SidebarActionButton icon={<FolderOpen size={16} />} label="Open Project" />
                 </div>
                 <div className="h-px bg-slate-700 my-2"></div>
                 <SidebarActionButton icon={<Cloud size={16} />} label="Set External Backups" />
             </div>
          </div>
      )}

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col relative h-full bg-[#0f172a] overflow-hidden">
        
        {/* Top Header / Menu Bar */}
        <header className="h-14 border-b border-slate-700 flex items-center justify-between px-6 bg-[#0f172a] shadow-sm shrink-0">
           <div className="flex items-center gap-6 text-sm text-slate-300 font-medium">
               <button onClick={() => setProjectPanelOpen(!projectPanelOpen)} className="md:hidden text-slate-400 mr-2">
                   <Menu size={20} />
               </button>
               {['File', 'Edit', 'Format', 'Share', 'View', 'Tools', 'Reports', 'Revisions', 'Production', 'Customize', 'Help'].map(item => (
                   <span key={item} className="cursor-pointer hover:text-white transition-colors hidden xl:inline-block">{item}</span>
               ))}
               <span className="xl:hidden cursor-pointer hover:text-white">Menu</span>
           </div>

           <div className="flex items-center gap-4">
               {syncStatus && <span className="text-xs text-slate-500 italic">{syncStatus}</span>}
               
               {view === 'write' && currentProject && (
                   <div className="flex bg-[#1e293b] rounded-lg p-0.5 border border-slate-600">
                        <button 
                            onClick={() => setScriptFormat('standard')}
                            className={`px-3 py-1 text-xs font-medium rounded ${scriptFormat === 'standard' ? 'bg-slate-500 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Standard
                        </button>
                        <button 
                            onClick={() => setScriptFormat('split')}
                            className={`px-3 py-1 text-xs font-medium rounded flex items-center gap-1 ${scriptFormat === 'split' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Columns size={12} /> Split
                        </button>
                   </div>
               )}

               <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors shadow-lg shadow-blue-900/20">
                   Upgrade to Pro
               </button>
               
               <button 
                  onClick={() => setAiPanelOpen(!aiPanelOpen)}
                  className={`p-2 rounded-full transition-colors ${aiPanelOpen ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                  title="AI Tools"
               >
                   <Bot size={20} />
               </button>
           </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-hidden relative flex">
            
            {/* Center Panel */}
            <div className="flex-1 h-full overflow-y-auto scroll-smooth">
                {view === 'write' && (
                    <div className="min-h-full flex flex-col items-center bg-[#0f172a]"> 
                       
                       {!currentProject ? (
                           // Welcome Screen
                           <div className="mt-20 text-center w-full max-w-2xl mx-auto mb-4">
                               <Logo className="w-16 h-16 mx-auto mb-6" />
                               <h1 className="text-3xl font-bold text-white mb-2">Welcome to WriteRoom</h1>
                               <p className="text-slate-400 mb-8">Start your next masterpiece.</p>
                               <div className="flex justify-center gap-4 mb-8">
                                   <button 
                                      onClick={() => setShowNewProjectModal(true)}
                                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                                   >
                                       <PlusCircle size={20} /> New Project
                                   </button>
                                   <button 
                                      onClick={() => setShowProjectListModal(true)}
                                      className="bg-[#1e293b] hover:bg-[#2a3855] text-white border border-slate-600 px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                                   >
                                       <FolderOpen size={20} /> Open Project
                                   </button>
                               </div>
                               
                               <div className="text-left max-w-md mx-auto">
                                   <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Recent Projects</h3>
                                   <div className="bg-[#1e293b] rounded-lg border border-slate-700 overflow-hidden">
                                       {projects.length > 0 ? projects.slice(0, 3).map(p => (
                                           <div 
                                              key={p.id} 
                                              onClick={() => handleOpenProject(p)}
                                              className="p-3 border-b border-slate-700 last:border-0 hover:bg-slate-700/50 cursor-pointer flex justify-between items-center"
                                           >
                                               <span className="text-slate-200 text-sm">{p.title}</span>
                                               <span className="text-xs text-slate-500">{new Date(p.lastModified).toLocaleDateString()}</span>
                                           </div>
                                       )) : (
                                           <div className="p-4 text-center text-slate-500 text-sm italic">No projects yet.</div>
                                       )}
                                   </div>
                               </div>
                           </div>
                       ) : (
                           // Editor
                           <ScriptEditor 
                                script={script} 
                                setScript={setScript} 
                                activeElementId={activeElementId}
                                setActiveElementId={setActiveElementId}
                                scriptFormat={scriptFormat}
                            />
                       )}
                    </div>
                )}
                {view === 'outline' && <BeatBoard beats={beats} setBeats={setBeats} />}
                {view === 'analysis' && <AnalysisDashboard script={script} />}
                {view === 'characters' && <CharactersView characters={characters} setCharacters={setCharacters} />}
                {view === 'locations' && <LocationsView locations={locations} setLocations={setLocations} />}
                {view === 'research' && <ResearchView research={research} setResearch={setResearch} />}
            </div>

            {/* AI Side Panel (Right) */}
            {aiPanelOpen && (
                <div className="w-80 bg-[#1e293b] border-l border-slate-700 flex flex-col shadow-2xl z-30 absolute right-0 h-full md:relative shrink-0">
                    <div className="p-4 border-b border-slate-700 font-bold flex justify-between items-center text-purple-400 bg-[#1e293b]">
                        <span>AI Assistant</span>
                        <button onClick={() => setAiPanelOpen(false)}><PanelRightClose size={16} /></button>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto bg-[#0f172a]">
                        <div className="bg-[#1e293b] p-3 rounded text-sm text-slate-300 mb-4 border border-slate-700">
                            I'm here to help. Select text to rewrite, or ask me to generate the next scene.
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-700 bg-[#1e293b]">
                        <textarea 
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Describe what happens next..."
                            className="w-full bg-[#0f172a] rounded p-3 text-sm text-slate-200 border border-slate-600 focus:border-purple-500 outline-none resize-none h-24 mb-2"
                        />
                        <button 
                            onClick={handleAiAssist}
                            disabled={aiLoading}
                            className="w-full bg-purple-600 hover:bg-purple-500 py-2 rounded text-sm font-medium flex justify-center items-center gap-2 disabled:opacity-50 text-white"
                        >
                            {aiLoading ? <span className="animate-pulse">Thinking...</span> : <><Bot size={16} /> Generate</>}
                        </button>
                    </div>
                </div>
            )}
        </div>

      </main>

      {/* --- Modals --- */}
      
      {/* New Project Modal */}
      {showNewProjectModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-600 w-96 shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-white">New Project</h3>
                      <button onClick={() => setShowNewProjectModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                  </div>
                  <input 
                      autoFocus
                      type="text" 
                      placeholder="Project Title (e.g., The Matrix)" 
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                      className="w-full bg-[#0f172a] border border-slate-600 rounded p-3 text-white focus:border-blue-500 focus:outline-none mb-6"
                  />
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowNewProjectModal(false)} className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded">Cancel</button>
                      <button onClick={handleCreateProject} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium">Create Project</button>
                  </div>
              </div>
          </div>
      )}

      {/* Open Project Modal */}
      <ProjectListModal 
        isOpen={showProjectListModal}
        onClose={() => setShowProjectListModal(false)}
        projects={projects}
        onOpenProject={handleOpenProject}
        onDeleteProject={handleDeleteProject}
      />
      
      {/* Project Settings Modal */}
      <ProjectSettingsModal 
        isOpen={showProjectSettingsModal}
        onClose={() => setShowProjectSettingsModal(false)}
        project={currentProject}
        onSave={handleUpdateProject}
      />
      
      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        project={currentProject}
        onInvite={handleInviteCollaborator}
        currentUserEmail={user?.email}
      />

    </div>
  );
};

const SidebarIcon = ({ icon, active, onClick, label }: { icon: any, active: boolean, onClick: () => void, label: string }) => (
    <div className="relative group flex flex-col items-center cursor-pointer mb-2" onClick={onClick}>
        <div className={`p-2 transition-all ${active ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}>
            {icon}
        </div>
        <div className="text-[10px] text-slate-500 mt-1">{label}</div>
    </div>
);

const SidebarActionButton = ({ icon, label }: { icon: any, label: string }) => (
    <button className="w-full flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-700/50 p-2 rounded transition-colors text-left cursor-pointer">
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </button>
);

const ProjectDocLink = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
    <div 
        onClick={onClick}
        className={`p-2 rounded text-sm cursor-pointer transition-colors ${active ? 'bg-[#2a3855] text-blue-200 border-l-2 border-blue-500' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 border-l-2 border-transparent'}`}
    >
        {label}
    </div>
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
            <div className="h-screen w-screen bg-[#0f172a] flex items-center justify-center text-white flex-col gap-4">
                <Loader2 className="animate-spin text-purple-500" size={40} />
                <span className="text-slate-400 text-sm">Loading WriteRoom...</span>
            </div>
        );
    }

    if (!user) {
        return <LoginScreen />;
    }

    return <MainApp />;
};

export default App;
