import React, { useRef, useEffect } from 'react';
import { ScriptElement, ElementType, ScriptFormat } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ScriptEditorProps {
  script: ScriptElement[];
  setScript: (s: ScriptElement[]) => void;
  activeElementId: string | null;
  setActiveElementId: (id: string) => void;
  scriptFormat: ScriptFormat;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ script, setScript, activeElementId, setActiveElementId, scriptFormat }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeElementId && containerRef.current) {
      // Optional: Auto scroll logic can go here
    }
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
    let inputClass = "w-full bg-transparent outline-none resize-none overflow-hidden font-script text-lg ";
    let placeholder = "";

    // Highlight active line
    const activeClass = isActive 
        ? " bg-gray-800/30 rounded -mx-2 px-2 py-1 shadow-sm border-l-2 border-blue-500" 
        : " px-2 py-1 border-l-2 border-transparent hover:border-gray-700";

    containerClass += activeClass;

    if (scriptFormat === 'standard') {
        // --- Standard Hollywood Layout ---
        containerClass += " w-full mb-2";

        switch (type) {
            case 'scene-heading':
                containerClass += " mt-8 mb-4 font-bold text-gray-200 uppercase";
                inputClass += " uppercase tracking-wide";
                placeholder = "INT. LOCATION - DAY";
                break;
            case 'action':
                containerClass += " mb-4 text-gray-300";
                placeholder = "Action description...";
                break;
            case 'character':
                containerClass += " mt-6 mb-0 text-center uppercase font-bold text-gray-200 w-2/3 mx-auto";
                inputClass += " text-center uppercase tracking-wider";
                placeholder = "CHARACTER";
                break;
            case 'dialogue':
                containerClass += " mb-4 text-center w-3/4 mx-auto text-gray-300";
                inputClass += " text-left";
                placeholder = "Dialogue...";
                break;
            case 'parenthetical':
                containerClass += " -mt-2 mb-2 text-center w-1/2 mx-auto text-gray-400 italic";
                inputClass += " text-left lowercase";
                placeholder = "(wryly)";
                break;
            case 'transition':
                containerClass += " mt-4 mb-4 text-right font-bold uppercase text-gray-400 mr-8";
                inputClass += " text-right uppercase";
                placeholder = "CUT TO:";
                break;
            case 'shot':
                containerClass += " mt-4 mb-4 font-bold uppercase text-gray-200";
                placeholder = "ANGLE ON";
                break;
        }
    } else {
        // --- Split / Malayalam Layout ---
        // Scene Heading is typically full width to separate segments clearly
        // Left Column: Action, Shot, Transition
        // Right Column: Character, Dialogue, Parenthetical

        switch (type) {
            case 'scene-heading':
                containerClass += " w-full mt-10 mb-6 font-bold text-gray-200 uppercase border-b border-gray-600 pb-2";
                inputClass += " uppercase tracking-wide";
                placeholder = "INT. LOCATION - DAY";
                break;
            case 'action':
                containerClass += " w-[48%] mr-auto mb-4 text-gray-300 pr-4 text-justify";
                placeholder = "Visual action...";
                break;
            case 'shot':
                containerClass += " w-[48%] mr-auto mt-4 mb-2 font-bold uppercase text-gray-200";
                placeholder = "ANGLE ON";
                break;
            case 'transition':
                containerClass += " w-[48%] mr-auto mt-4 mb-4 text-right font-bold uppercase text-gray-400";
                inputClass += " text-right uppercase";
                placeholder = "CUT TO:";
                break;
            
            // Right Side Elements
            case 'character':
                containerClass += " w-[48%] ml-auto mt-4 mb-1 text-center font-bold text-gray-200 uppercase";
                inputClass += " text-center uppercase tracking-wider";
                placeholder = "CHARACTER";
                break;
            case 'dialogue':
                containerClass += " w-[48%] ml-auto mb-4 text-gray-300 pl-4 border-l border-gray-800";
                inputClass += " text-left";
                placeholder = "Dialogue...";
                break;
            case 'parenthetical':
                containerClass += " w-[40%] ml-auto mb-1 text-center italic text-gray-400";
                inputClass += " text-center lowercase";
                placeholder = "(wryly)";
                break;
        }
    }

    return { containerClass, inputClass, placeholder };
  };

  return (
    <div 
        ref={containerRef}
        className={`w-full mx-auto bg-white min-h-[1200px] shadow-2xl my-8 p-12 pb-32 text-gray-900 transition-all duration-300 ${scriptFormat === 'split' ? 'max-w-7xl' : 'max-w-4xl'}`}
        style={{ backgroundColor: '#fcfcfc' }}
    >
      {script.map((el, i) => {
        const { containerClass, inputClass, placeholder } = getElementStyles(el.type, activeElementId === el.id);
        
        return (
          <div key={el.id} id={`script-element-${el.id}`} className={containerClass}>
            <div className="absolute left-[-40px] top-1 text-xs text-gray-400 font-sans opacity-0 group-hover:opacity-100 uppercase w-[30px] text-right select-none">
                {el.type === 'scene-heading' ? 'SH' : 
                 el.type === 'character' ? 'CH' : 
                 el.type === 'dialogue' ? 'DIA' : 
                 el.type.substring(0,3)}
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
          <div className="text-center text-gray-400 mt-20 font-sans cursor-pointer" onClick={() => {
              setScript([{ id: uuidv4(), type: 'scene-heading', content: 'INT. ' }]);
          }}>
              Click to start writing your masterpiece...
          </div>
      )}
    </div>
  );
};

export default ScriptEditor;