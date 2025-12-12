import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, FolderOpen, Save, Printer, FileOutput, 
  Undo, Redo, Scissors, Copy, Clipboard, Search,
  Type, Eye, ZoomIn, ZoomOut, Moon, Sun, 
  Share2, BarChart2, Layout, BookOpen, Clock, Trash2, X
} from 'lucide-react';
import { ElementType } from '../types';

interface MenuBarProps {
  onAction: (action: string, payload?: any) => void;
  isProjectOpen: boolean;
  activeElementType?: ElementType;
  darkMode?: boolean;
}

const MenuBar: React.FC<MenuBarProps> = ({ onAction, isProjectOpen, activeElementType, darkMode }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleItemClick = (action: string, payload?: any) => {
    onAction(action, payload);
    setOpenMenu(null);
  };

  const MenuItem = ({ label, shortcut, icon: Icon, action, payload, disabled = false, danger = false }: any) => (
    <button 
      onClick={() => !disabled && handleItemClick(action, payload)}
      className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors
        ${disabled ? 'opacity-50 cursor-not-allowed text-slate-500' : 'hover:bg-blue-600 hover:text-white text-slate-200'}
        ${danger ? 'text-red-400 hover:bg-red-900/50' : ''}
      `}
      disabled={disabled}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className={disabled ? '' : (danger ? 'text-red-400' : 'text-slate-400 group-hover:text-white')} />}
        <span>{label}</span>
      </div>
      {shortcut && <span className="text-xs text-slate-500 ml-4 font-mono">{shortcut}</span>}
    </button>
  );

  const Separator = () => <div className="h-px bg-slate-700 my-1 mx-2" />;

  const menus = [
    {
      name: 'File',
      items: [
        { label: 'New Project', icon: FileText, action: 'NEW_PROJECT' },
        { label: 'Open Project', icon: FolderOpen, action: 'OPEN_PROJECT' },
        { label: 'Save', icon: Save, shortcut: 'Ctrl+S', action: 'SAVE', disabled: !isProjectOpen },
        { type: 'separator' },
        { label: 'Export PDF / Print', icon: Printer, shortcut: 'Ctrl+P', action: 'PRINT', disabled: !isProjectOpen },
        { label: 'Export JSON', icon: FileOutput, action: 'EXPORT_JSON', disabled: !isProjectOpen },
        { type: 'separator' },
        { label: 'Close Project', icon: X, action: 'CLOSE_PROJECT', disabled: !isProjectOpen }
      ]
    },
    {
      name: 'Edit',
      items: [
        { label: 'Undo', icon: Undo, shortcut: 'Ctrl+Z', action: 'UNDO', disabled: !isProjectOpen },
        { label: 'Redo', icon: Redo, shortcut: 'Ctrl+Y', action: 'REDO', disabled: !isProjectOpen },
        { type: 'separator' },
        { label: 'Find & Replace', icon: Search, shortcut: 'Ctrl+F', action: 'FIND', disabled: !isProjectOpen }
      ]
    },
    {
      name: 'Format',
      items: [
        { label: 'Scene Heading', shortcut: 'Ctrl+1', action: 'FORMAT', payload: 'scene-heading', disabled: !isProjectOpen },
        { label: 'Action', shortcut: 'Ctrl+2', action: 'FORMAT', payload: 'action', disabled: !isProjectOpen },
        { label: 'Character', shortcut: 'Ctrl+3', action: 'FORMAT', payload: 'character', disabled: !isProjectOpen },
        { label: 'Dialogue', shortcut: 'Ctrl+4', action: 'FORMAT', payload: 'dialogue', disabled: !isProjectOpen },
        { label: 'Parenthetical', shortcut: 'Ctrl+5', action: 'FORMAT', payload: 'parenthetical', disabled: !isProjectOpen },
        { label: 'Transition', shortcut: 'Ctrl+6', action: 'FORMAT', payload: 'transition', disabled: !isProjectOpen },
        { label: 'Shot', shortcut: 'Ctrl+7', action: 'FORMAT', payload: 'shot', disabled: !isProjectOpen },
      ]
    },
    {
        name: 'Share',
        items: [
            { label: 'Share Project', icon: Share2, action: 'SHARE', disabled: !isProjectOpen },
            { label: 'Invite Collaborators', icon: Share2, action: 'SHARE', disabled: !isProjectOpen }
        ]
    },
    {
      name: 'View',
      items: [
        { label: 'Zoom In', icon: ZoomIn, shortcut: 'Ctrl++', action: 'ZOOM_IN', disabled: !isProjectOpen },
        { label: 'Zoom Out', icon: ZoomOut, shortcut: 'Ctrl+-', action: 'ZOOM_OUT', disabled: !isProjectOpen },
        { label: 'Reset Zoom', icon: Eye, shortcut: 'Ctrl+0', action: 'ZOOM_RESET', disabled: !isProjectOpen },
        { type: 'separator' },
        { label: 'Toggle Sidebar', icon: Layout, action: 'TOGGLE_SIDEBAR' },
        { label: 'Toggle Theme', icon: darkMode ? Sun : Moon, action: 'TOGGLE_THEME', disabled: true } // Placeholder
      ]
    },
    {
      name: 'Tools',
      items: [
        { label: 'Beat Board', icon: Layout, action: 'VIEW', payload: 'outline', disabled: !isProjectOpen },
        { label: 'Character Notes', icon: BookOpen, action: 'VIEW', payload: 'characters', disabled: !isProjectOpen },
        { label: 'Locations', icon: Layout, action: 'VIEW', payload: 'locations', disabled: !isProjectOpen },
        { label: 'Research', icon: FolderOpen, action: 'VIEW', payload: 'research', disabled: !isProjectOpen }
      ]
    },
    {
        name: 'Reports',
        items: [
            { label: 'Script Analysis', icon: BarChart2, action: 'VIEW', payload: 'analysis', disabled: !isProjectOpen },
        ]
    },
    {
        name: 'Revisions',
        items: [
            { label: 'Clear All Revisions', icon: Trash2, action: 'CLEAR_REVISIONS', disabled: !isProjectOpen, danger: true },
            { label: 'View History', icon: Clock, action: 'VIEW_HISTORY', disabled: true }
        ]
    }
  ];

  return (
    <div className="flex items-center h-full" ref={menuRef}>
      {menus.map((menu) => (
        <div key={menu.name} className="relative h-full">
          <button
            onClick={() => handleMenuClick(menu.name)}
            onMouseEnter={() => openMenu && setOpenMenu(menu.name)}
            className={`
              h-full px-3 text-sm font-medium transition-colors flex items-center
              ${openMenu === menu.name ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}
            `}
          >
            {menu.name}
          </button>
          
          {openMenu === menu.name && (
            <div className="absolute top-full left-0 w-56 bg-[#1e293b] border border-slate-600 shadow-xl rounded-b-lg py-1 z-50">
              {menu.items.map((item: any, idx) => (
                item.type === 'separator' ? (
                  <Separator key={idx} />
                ) : (
                  <MenuItem 
                    key={idx} 
                    {...item} 
                  />
                )
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuBar;
