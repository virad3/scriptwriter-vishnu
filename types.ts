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
  voice?: string;
}

export interface AppState {
  view: 'write' | 'outline' | 'analysis' | 'characters';
  projectTitle: string;
  script: ScriptElement[];
  beats: BeatCard[];
  characters: CharacterProfile[];
  sidebarOpen: boolean;
  aiPanelOpen: boolean;
}

export enum AnalysisType {
  STRUCTURE = 'STRUCTURE',
  CHARACTERS = 'CHARACTERS',
  SUGGESTIONS = 'SUGGESTIONS'
}