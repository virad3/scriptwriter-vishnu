import React, { useState } from 'react';
import { BeatCard } from '../types';
import { generateBeats } from '../services/geminiService';
import { Plus, Wand2, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface BeatBoardProps {
  beats: BeatCard[];
  setBeats: (b: BeatCard[]) => void;
}

const BeatBoard: React.FC<BeatBoardProps> = ({ beats, setBeats }) => {
  const [loading, setLoading] = useState(false);
  const [premise, setPremise] = useState('');

  const handleGenBeats = async () => {
    if(!premise) return;
    setLoading(true);
    const newBeats = await generateBeats(premise);
    if (newBeats.length > 0) {
        setBeats(newBeats);
    }
    setLoading(false);
  };

  const acts = ['1', '2a', '2b', '3'];

  return (
    <div className="p-8 h-full overflow-y-auto bg-[#0f172a]">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Structure & Beats</h2>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={premise}
                    onChange={e => setPremise(e.target.value)}
                    placeholder="Enter story premise for AI..."
                    className="bg-[#1e293b] text-sm px-4 py-2 rounded-lg border border-slate-600 text-white w-64 focus:outline-none focus:border-blue-500"
                />
                <button 
                    onClick={handleGenBeats}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Wand2 size={16} />
                    {loading ? 'Thinking...' : 'AI Generate'}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-4 gap-6 min-w-[1000px]">
            {acts.map(act => (
                <div key={act} className="flex flex-col gap-4">
                    <div className="text-slate-400 font-bold uppercase text-xs tracking-widest border-b border-slate-700 pb-2 mb-2">
                        Act {act.toUpperCase()}
                    </div>
                    {beats.filter(b => b.act === act).map(beat => (
                        <div key={beat.id} className="bg-[#1e293b] p-4 rounded-lg border border-slate-700 hover:border-slate-500 cursor-grab group relative shadow-md">
                            <div className="w-full h-1 absolute top-0 left-0 rounded-t-lg" style={{ background: beat.color || '#4b5563' }}></div>
                            <div className="flex justify-between items-start mb-2 mt-2">
                                <h4 className="font-bold text-slate-200 text-sm">{beat.title}</h4>
                                <button 
                                    onClick={() => setBeats(beats.filter(b => b.id !== beat.id))}
                                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed">{beat.synopsis}</p>
                        </div>
                    ))}
                    <button 
                        onClick={() => {
                            const newBeat: BeatCard = {
                                id: uuidv4(),
                                title: 'New Beat',
                                synopsis: 'Description...',
                                act: act as any,
                                color: '#3b82f6'
                            };
                            setBeats([...beats, newBeat]);
                        }}
                        className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-600 hover:border-slate-500 hover:text-slate-400 flex justify-center items-center transition-all"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
};

export default BeatBoard;