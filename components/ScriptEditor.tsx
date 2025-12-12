import React, { useRef, useEffect } from 'react';
import { ScriptElement, ElementType, ScriptFormat } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Keyboard } from 'lucide-react';

interface ScriptEditorProps {
  script: ScriptElement[];
  setScript: (s: ScriptElement[]) => void;
  activeElementId: string | null;
  setActiveElementId: (id: string) => void;
  scriptFormat: ScriptFormat;
  zoomLevel?: number;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ 
    script, 
    setScript, 
    activeElementId, 
    setActiveElementId, 
    scriptFormat,
    zoomLevel = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Optional scroll logic
  }, [activeElementId]);

  const updateElement = (id: string, content: string) => {
    setScript(script.map(el => el.id === id ? { ...el, content } : el));
  };

  const cycleType = (currentType: ElementType, direction: 'forward' | 'backward'): ElementType => {
    switch (currentType) {
      case 'scene-heading': return 'action';
      case 'action': return 'character';
      case 'character': return 'transition';
      case 'transition': return 'scene-heading';
      case 'dialogue': return 'parenthetical';
      case 'parenthetical': return 'dialogue';
      case 'shot': return 'action';
      default: return 'action';
    }
  };

  const getNextTypeOnEnter = (currentType: ElementType): ElementType => {
    switch (currentType) {
      case 'scene-heading': return 'action';
      case 'character': return 'dialogue';
      case 'parenthetical': return 'dialogue';
      case 'dialogue': return 'character';
      case 'transition': return 'scene-heading';
      default: return 'action';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number, element: ScriptElement) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const newType = cycleType(element.type, e.shiftKey ? 'backward' : 'forward');
      setScript(script.map(el => el.id === element.id ? { ...el, type: newType } : el));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const nextType = getNextTypeOnEnter(element.type);
      const newElement: ScriptElement = {
        id: uuidv4(),
        type: nextType,
        content: ''
      };
      const newScript = [...script];
      newScript.splice(index + 1, 0, newElement);
      setScript(newScript);
      setActiveElementId(newElement.id);
      setTimeout(() => {
        document.getElementById(`input-${newElement.id}`)?.focus();
      }, 10);
    } else if (e.key === 'Backspace' && element.content === '' && script.length > 1) {
      e.preventDefault();
      const prevId = script[index - 1]?.id;
      const newScript = script.filter(el => el.id !== element.id);
      setScript(newScript);
      if (prevId) {
        setActiveElementId(prevId);
        setTimeout(() => {
             document.getElementById(`input-${prevId}`)?.focus();
        }, 10);
      }
    } else if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      setActiveElementId(script[index-1].id);
      document.getElementById(`input-${script[index-1].id}`)?.focus();
    } else if (e.key === 'ArrowDown' && index < script.length - 1) {
      e.preventDefault();
      setActiveElementId(script[index+1].id);
      document.getElementById(`input-${script[index+1].id}`)?.focus();
    }
  };

  const getElementStyles = (type: ElementType, isActive: boolean) => {
    let containerClass = "relative group transition-all duration-200 outline-none ";
    let inputClass = "w-full bg-transparent outline-none resize-none overflow-hidden font-script text-lg leading-relaxed ";
    let placeholder = "";

    // Highlight active line
    const activeClass = isActive 
        ? " bg-blue-50/50 rounded -mx-2 px-2 py-0.5 print:bg-transparent print:px-0" 
        : " px-2 py-0.5 border-l-2 border-transparent";

    containerClass += activeClass;

    if (scriptFormat === 'standard') {
        // --- Standard Hollywood Layout ---
        containerClass += " w-full mb-1";

        switch (type) {
            case 'scene-heading':
                containerClass += " mt-6 mb-2 font-bold text-gray-900 uppercase";
                inputClass += " uppercase tracking-wide";
                placeholder = "INT. LOCATION - DAY";
                break;
            case 'action':
                containerClass += " mb-2 text-gray-900";
                placeholder = "Action description...";
                break;
            case 'character':
                containerClass += " mt-4 mb-0 text-center uppercase font-bold text-gray-900 w-2/3 mx-auto";
                inputClass += " text-center uppercase tracking-wider";
                placeholder = "CHARACTER";
                break;
            case 'dialogue':
                containerClass += " mb-2 text-center w-3/4 mx-auto text-gray-900";
                inputClass += " text-left";
                placeholder = "Dialogue...";
                break;
            case 'parenthetical':
                containerClass += " -mt-1 mb-1 text-center w-1/2 mx-auto text-gray-600 italic";
                inputClass += " text-left lowercase";
                placeholder = "(wryly)";
                break;
            case 'transition':
                containerClass += " mt-4 mb-4 text-right font-bold uppercase text-gray-800 mr-8";
                inputClass += " text-right uppercase";
                placeholder = "CUT TO:";
                break;
            case 'shot':
                containerClass += " mt-4 mb-4 font-bold uppercase text-gray-900";
                placeholder = "ANGLE ON";
                break;
        }
    } else {
        // --- Split / Malayalam Layout ---
        switch (type) {
            case 'scene-heading':
                containerClass += " w-full mt-8 mb-4 font-bold text-gray-900 uppercase border-b border-gray-300 pb-2";
                inputClass += " uppercase tracking-wide";
                placeholder = "INT. LOCATION - DAY";
                break;
            case 'action':
                containerClass += " w-[48%] mr-auto mb-2 text-gray-900 pr-4 text-justify";
                placeholder = "Visual action...";
                break;
            case 'shot':
                containerClass += " w-[48%] mr-auto mt-2 mb-2 font-bold uppercase text-gray-900";
                placeholder = "ANGLE ON";
                break;
            case 'transition':
                containerClass += " w-[48%] mr-auto mt-2 mb-2 text-right font-bold uppercase text-gray-800";
                inputClass += " text-right uppercase";
                placeholder = "CUT TO:";
                break;
            
            // Right Side Elements
            case 'character':
                containerClass += " w-[48%] ml-auto mt-2 mb-0 text-center font-bold text-gray-900 uppercase";
                inputClass += " text-center uppercase tracking-wider";
                placeholder = "CHARACTER";
                break;
            case 'dialogue':
                containerClass += " w-[48%] ml-auto mb-2 text-gray-900 pl-4 border-l border-gray-200";
                inputClass += " text-left";
                placeholder = "Dialogue...";
                break;
            case 'parenthetical':
                containerClass += " w-[40%] ml-auto mb-0 text-center italic text-gray-600";
                inputClass += " text-center lowercase";
                placeholder = "(wryly)";
                break;
        }
    }

    return { containerClass, inputClass, placeholder };
  };

  return (
    <div className="w-full flex-1 flex justify-center pb-20 relative">
        {/* Editor Page Container */}
        <div 
            ref={containerRef}
            style={{ 
                transform: `scale(${zoomLevel})`, 
                transformOrigin: 'top center' 
            }}
            className={`bg-white shadow-2xl my-2 p-16 min-h-[1050px] text-gray-900 transition-all duration-300 print:shadow-none print:w-full print:my-0 print:p-8 ${scriptFormat === 'split' ? 'w-[1100px]' : 'w-[850px]'}`}
        >
        {script.map((el, i) => {
            const { containerClass, inputClass, placeholder } = getElementStyles(el.type, activeElementId === el.id);
            
            return (
            <div key={el.id} id={`script-element-${el.id}`} className={containerClass}>
                <div className="absolute left-[-50px] top-1 text-[10px] text-gray-300 font-sans opacity-0 group-hover:opacity-100 uppercase w-[40px] text-right select-none print:hidden">
                    {el.type === 'scene-heading' ? 'Scene' : 
                    el.type === 'character' ? 'Char' : 
                    el.type === 'dialogue' ? 'Dial' : 
                    el.type}
                </div>
                
                <textarea
                id={`input-${el.id}`}
                value={el.content}
                onChange={(e) => {
                    let val = e.target.value;
                    if (['scene-heading', 'character', 'transition', 'shot'].includes(el.type)) {
                        val = val.toUpperCase();
                    }
                    if (el.type === 'parenthetical') {
                    if(!val.startsWith('(') && val.length > 0) val = '(' + val;
                    if(!val.endsWith(')') && val.length > 1 && !val.endsWith(')')) val = val + ')';
                    }
                    updateElement(el.id, val);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                }}
                onKeyDown={(e) => handleKeyDown(e, i, el)}
                onFocus={() => setActiveElementId(el.id)}
                placeholder={placeholder}
                className={inputClass}
                rows={1}
                style={{ height: 'auto', minHeight: '1.5rem' }}
                />
            </div>
            );
        })}
        
        {script.length === 0 && (
            <div className="text-center text-gray-400 mt-20 font-sans cursor-pointer group print:hidden" onClick={() => {
                setScript([{ id: uuidv4(), type: 'scene-heading', content: 'INT. ' }]);
            }}>
                <div className="text-xl mb-2 group-hover:text-blue-500 transition-colors font-medium">Click to Start Writing...</div>
                <div className="text-sm opacity-60 italic">Your story begins with a Scene Heading.</div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg inline-block border border-gray-100 text-xs text-gray-500 font-mono">
                    INT. COFFEE SHOP - DAY
                </div>
            </div>
        )}
        </div>

        {/* Floating Hints Panel */}
        <div className="fixed bottom-6 right-6 z-40 hidden md:block print:hidden">
           <div className="bg-slate-800/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl text-xs text-slate-300 w-64 transition-all duration-300 hover:bg-slate-800 hover:border-slate-500 opacity-60 hover:opacity-100">
              <h4 className="font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2 text-[10px] border-b border-slate-700 pb-2">
                 <span className="bg-slate-700 p-1 rounded"><Keyboard size={12}/></span> 
                 Writing Shortcuts
              </h4>
              
              <div className="space-y-3">
                 <div>
                    <div className="flex justify-between mb-1 items-center">
                        <span className="font-bold text-slate-100 bg-slate-700/50 px-1.5 py-0.5 rounded font-mono text-[10px]">TAB</span>
                        <span className="text-slate-400">Change Element</span>
                    </div>
                    <div className="flex justify-between mb-1 items-center">
                        <span className="font-bold text-slate-100 bg-slate-700/50 px-1.5 py-0.5 rounded font-mono text-[10px]">ENTER</span>
                        <span className="text-slate-400">Next Line</span>
                    </div>
                 </div>

                 <div className="border-t border-slate-700 pt-2 space-y-2">
                    <div className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold shrink-0 w-8 text-right">SCENE</span>
                        <span>Start with <span className="font-mono text-slate-200">INT.</span> or <span className="font-mono text-slate-200">EXT.</span> followed by location.</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold shrink-0 w-8 text-right">CHAR</span>
                        <span>Names must be in <span className="font-bold text-slate-200">ALL CAPS</span>.</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold shrink-0 w-8 text-right">PAREN</span>
                        <span>Use <span className="font-mono text-slate-200">(wryly)</span> for tone.</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
    </div>
  );
};

export default ScriptEditor;