
export type ElementType = 
  | 'scene-heading'
  | 'action'
  | 'character'
  | 'dialogue'
  | 'parenthetical'
  | 'transition'
  | 'shot';

export type ScriptFormat = 'standard' | 'split';

export interface ScriptElement {
  id: string;
  type: ElementType;
  content: string;
  notes?: string[];
  revisionColor?: string;
  locked?: boolean;
}

export interface BeatCard {
  id: string;
  title: string;
  synopsis: string;
  act: '1' | '2a' | '2b' | '3';
  color: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  traits: string[];
  voice?: string; // Description of how they speak
  bio?: string;
}

export interface LocationItem {
  id: string;
  name: string;
  description: string;
  sights: string;
  sounds: string;
}

export interface ResearchItem {
  id: string;
  topic: string;
  content: string;
  sourceUrl?: string;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  lastModified: number;
  author?: string;
  logline?: string;
  collaborators?: string[]; // List of emails
}

export interface AppState {
  view: 'write' | 'outline' | 'analysis' | 'characters' | 'locations' | 'research';
  projectTitle: string;
  script: ScriptElement[];
  beats: BeatCard[];
  characters: CharacterProfile[];
  locations: LocationItem[];
  research: ResearchItem[];
  sidebarOpen: boolean;
  aiPanelOpen: boolean;
}

export enum AnalysisType {
  STRUCTURE = 'STRUCTURE',
  CHARACTERS = 'CHARACTERS',
  SUGGESTIONS = 'SUGGESTIONS'
}
