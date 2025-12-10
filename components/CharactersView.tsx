import React from 'react';
import { CharacterProfile } from '../types';
import { User, Plus, Trash2, Mic, AlignLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CharactersViewProps {
  characters: CharacterProfile[];
  setCharacters: (chars: CharacterProfile[]) => void;
}

const CharactersView: React.FC<CharactersViewProps> = ({ characters, setCharacters }) => {
  const addCharacter = () => {
    const newChar: CharacterProfile = {
      id: uuidv4(),
      name: 'New Character',
      role: 'Protagonist',
      traits: [],
      voice: '',
      bio: ''
    };
    setCharacters([...characters, newChar]);
  };

  const updateCharacter = (id: string, field: keyof CharacterProfile, value: any) => {
    setCharacters(characters.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const deleteCharacter = (id: string) => {
    if(confirm('Delete this character?')) {
        setCharacters(characters.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-[#0f172a] text-white">
      <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Character Notes</h2>
          <p className="text-slate-400 text-sm">Define the souls of your story.</p>
        </div>
        <button 
          onClick={addCharacter}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Character
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {characters.map(char => (
          <div key={char.id} className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 shadow-sm hover:border-slate-500 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 border border-indigo-700/50">
                  <User size={20} />
                </div>
                <div>
                   <input 
                      type="text" 
                      value={char.name}
                      onChange={(e) => updateCharacter(char.id, 'name', e.target.value)}
                      className="bg-transparent font-bold text-lg text-white focus:outline-none focus:border-b border-blue-500 w-full"
                      placeholder="Character Name"
                   />
                   <input 
                      type="text" 
                      value={char.role}
                      onChange={(e) => updateCharacter(char.id, 'role', e.target.value)}
                      className="bg-transparent text-sm text-slate-400 focus:outline-none focus:border-b border-slate-500 w-full"
                      placeholder="Role (e.g. Antagonist)"
                   />
                </div>
              </div>
              <button onClick={() => deleteCharacter(char.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                     <AlignLeft size={12} /> Bio & Backstory
                  </label>
                  <textarea 
                    value={char.bio || ''}
                    onChange={(e) => updateCharacter(char.id, 'bio', e.target.value)}
                    className="w-full bg-[#0f172a] rounded p-2 text-sm text-slate-300 border border-slate-700 focus:border-blue-500 outline-none resize-none h-20"
                    placeholder="Brief biography..."
                  />
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                     <Mic size={12} /> Voice
                  </label>
                  <input 
                    type="text" 
                    value={char.voice || ''}
                    onChange={(e) => updateCharacter(char.id, 'voice', e.target.value)}
                    className="w-full bg-[#0f172a] rounded p-2 text-sm text-slate-300 border border-slate-700 focus:border-blue-500 outline-none"
                    placeholder="How do they speak?"
                  />
               </div>
               
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Traits</label>
                 <div className="flex flex-wrap gap-2">
                    {char.traits.map((trait, i) => (
                        <span key={i} className="bg-slate-700 px-2 py-1 rounded text-xs text-slate-300 flex items-center gap-1">
                            {trait}
                            <button onClick={() => updateCharacter(char.id, 'traits', char.traits.filter((_, idx) => idx !== i))} className="hover:text-white"><Trash2 size={10} /></button>
                        </span>
                    ))}
                    <input 
                        type="text" 
                        placeholder="+ Add" 
                        className="bg-transparent text-xs text-slate-400 border border-slate-600 rounded px-2 py-1 w-16 focus:w-24 focus:border-blue-500 outline-none transition-all"
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') {
                                const val = (e.target as HTMLInputElement).value;
                                if(val) {
                                    updateCharacter(char.id, 'traits', [...char.traits, val]);
                                    (e.target as HTMLInputElement).value = '';
                                }
                            }
                        }}
                    />
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharactersView;