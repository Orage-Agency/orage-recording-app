export type Status =
  | 'draft'
  | 'ready_to_shoot'
  | 'shooting'
  | 'recorded'
  | 'edited'
  | 'live'
  | 'winner'
  | 'killed';

export type Wedge =
  | 'TIME'
  | 'TEAM'
  | 'AUTOMATION'
  | 'SCALE'
  | 'LEADS'
  | 'DEFENSIVE_MODE'
  | 'MARGIN_CLIFF'
  | 'DECISION_FATIGUE'
  | 'CASH_FLOW';

export type Format =
  | 'WHITEBOARD'
  | 'BEHIND_DESK'
  | 'WALKING'
  | 'SELFIE'
  | 'SCREEN_RECORD'
  | 'PHONE_CLOSEUP'
  | 'IRL_DEMO'
  | 'DRIVING';

export type Source = 'CLAUDE' | 'GEORGE' | 'IMPORTED';

export type SectionType = 'VISUAL_HOOK' | 'VERBAL_HOOK' | 'BODY' | 'CTA';

export interface ScriptSection {
  id: string;
  type: SectionType;
  timecode: string;
  action?: string;
  spokenLines: string[];
  completed: boolean;
}

export interface ScriptPerformance {
  hookRate?: number;
  ctr?: number;
  cpl?: number;
  notes?: string;
}

export interface Script {
  id: string;
  number: number;
  source: Source;
  title: string;
  recommended: boolean;
  priorityRank: number;

  wedge: Wedge;
  format: Format;
  length: string;
  energy: string;
  setup: string;
  shotDirections: string[];

  sections: ScriptSection[];

  status: Status;
  recordedAt?: string;
  liveAt?: string;
  performance?: ScriptPerformance;

  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type HookFormula =
  | 'SPECIFIC_NUMBER'
  | 'CONTRARIAN'
  | 'THIRD_PERSON_PROOF'
  | 'DIRECT_COMMAND'
  | 'POV_AUTHORITY';

export interface VerbalHook {
  id: string;
  text: string;
  formula: HookFormula;
  pairsWithWedges: Wedge[];
  used: boolean;
}

export interface PreHook {
  id: string;
  title: string;
  scene: string;
  action: string;
  duration: string;
  feel: string;
  pairsWithWedges: Wedge[];
  shootNotes: string;
  status: Status;
}
