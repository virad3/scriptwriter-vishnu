import React from 'react';
import { ResearchItem } from '../types';
import { BookOpen, Plus, Trash2, Link, Tag } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ResearchViewProps {
  research: ResearchItem[];
  setResearch: (items: ResearchItem[]) => void;
}

const ResearchView: React.FC<ResearchViewProps> = ({ research, setResearch }) => {
  const addItem = () => {
    const newItem: ResearchItem = {
      id: uuidv4(),
      topic: 'New Topic',
      content: '',
      sourceUrl: '',
      tags: []
    };
    setResearch([...research, newItem]);
  };

  const updateItem = (id: string, field: keyof ResearchItem, value: any) => {
    setResearch(research.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const deleteItem = (id: string) => {
    if(confirm('Delete this research item?')) {
        setResearch(research.filter(r => r.id !== id));
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-[#0f172a] text-white">
      <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Research</h2>
          <p className="text-slate-400 text-sm">Facts, links, and inspiration for your script.</p>
        </div>
        <button 
          onClick={addItem}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {research.map(item => (
          <div key={item.id} className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 shadow-sm hover:border-slate-500 transition-all group relative">
             <button 
                onClick={() => deleteItem(item.id)}
                className="absolute top-4 right-4 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
             >
                <Trash2 size={16} />
             </button>

             <div className="mb-4 pr-8">
                 <input 
                    type="text" 
                    value={item.topic}
                    onChange={(e) => updateItem(item.id, 'topic', e.target.value)}
                    className="bg-transparent text-xl font-bold text-white focus:outline-none focus:border-b border-blue-500 w-full placeholder-slate-600"
                    placeholder="Topic / Title"
                 />
             </div>

             <div className="mb-4">
                 <textarea 
                    value={item.content}
                    onChange={(e) => updateItem(item.id, 'content', e.target.value)}
                    className="w-full bg-[#0f172a] rounded p-3 text-sm text-slate-300 border border-slate-700 focus:border-blue-500 outline-none resize-none h-32 leading-relaxed"
                    placeholder="Notes, facts, or snippets..."
                 />
             </div>

             <div className="space-y-3">
                 <div className="flex items-center gap-2">
                     <Link size={14} className="text-slate-500" />
                     <input 
                        type="text" 
                        value={item.sourceUrl || ''}
                        onChange={(e) => updateItem(item.id, 'sourceUrl', e.target.value)}
                        className="flex-1 bg-transparent text-xs text-blue-400 hover:underline focus:no-underline focus:outline-none focus:bg-[#0f172a] rounded px-1"
                        placeholder="https://source-url.com"
                     />
                 </div>
                 
                 <div className="flex items-center gap-2 flex-wrap">
                     <Tag size={14} className="text-slate-500" />
                     {item.tags.map((tag, i) => (
                        <span key={i} className="bg-slate-700 px-2 py-0.5 rounded-full text-[10px] text-slate-300 uppercase tracking-wide">
                            {tag}
                            <button onClick={() => updateItem(item.id, 'tags', item.tags.filter((_, idx) => idx !== i))} className="ml-1 hover:text-white">&times;</button>
                        </span>
                     ))}
                     <input 
                        type="text" 
                        placeholder="Add tag" 
                        className="bg-transparent text-xs text-slate-500 w-16 focus:w-24 focus:text-slate-300 outline-none transition-all"
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') {
                                const val = (e.target as HTMLInputElement).value;
                                if(val) {
                                    updateItem(item.id, 'tags', [...item.tags, val]);
                                    (e.target as HTMLInputElement).value = '';
                                }
                            }
                        }}
                     />
                 </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchView;