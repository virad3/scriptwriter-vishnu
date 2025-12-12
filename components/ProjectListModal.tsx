import React from 'react';
import { Project } from '../types';
import { X, FileText, Calendar, Trash2, Plus } from 'lucide-react';

interface ProjectListModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onCreateProject: () => void;
}

const ProjectListModal: React.FC<ProjectListModalProps> = ({ 
  isOpen, 
  onClose, 
  projects, 
  onOpenProject, 
  onDeleteProject,
  onCreateProject
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-600 w-[600px] max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Projects</h3>
          <div className="flex items-center gap-3">
             <button 
                onClick={onCreateProject}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
             >
                <Plus size={16} /> New Project
             </button>
             <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-700">
                <X size={20} />
             </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto min-h-[300px] pr-2">
          {projects.length === 0 ? (
            <div className="text-center text-slate-500 py-10 flex flex-col items-center">
                <FileText size={48} className="mb-4 opacity-20" />
                <p className="mb-4">No projects found.</p>
                <button 
                  onClick={onCreateProject}
                  className="text-blue-400 hover:text-blue-300 text-sm hover:underline"
                >
                  Create your first project
                </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {projects.map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-[#0f172a] rounded-lg border border-slate-700 hover:border-blue-500 transition-all group">
                  <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => onOpenProject(p)}>
                    <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-blue-400 group-hover:bg-blue-900/30 transition-colors">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{p.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Calendar size={12} />
                        Last edited: {new Date(p.lastModified).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                          e.stopPropagation();
                          onOpenProject(p);
                      }}
                      className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded text-sm hover:bg-blue-600 hover:text-white transition-colors font-medium"
                    >
                      Open
                    </button>
                    <button 
                      onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(p.id);
                      }}
                      className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectListModal;