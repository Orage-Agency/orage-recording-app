import type { Format, Status, Wedge, Source, HookFormula } from './types';

export const ALL_STATUSES: Status[] = [
  'draft',
  'ready_to_shoot',
  'shooting',
  'recorded',
  'edited',
  'live',
  'winner',
  'killed',
];

export const ALL_WEDGES: Wedge[] = [
  'TIME',
  'TEAM',
  'AUTOMATION',
  'SCALE',
  'LEADS',
  'DEFENSIVE_MODE',
  'MARGIN_CLIFF',
  'DECISION_FATIGUE',
  'CASH_FLOW',
];

export const ALL_FORMATS: Format[] = [
  'WHITEBOARD',
  'BEHIND_DESK',
  'WALKING',
  'SELFIE',
  'SCREEN_RECORD',
  'PHONE_CLOSEUP',
  'IRL_DEMO',
  'DRIVING',
];

export const ALL_SOURCES: Source[] = ['CLAUDE', 'GEORGE', 'IMPORTED'];

export const ALL_FORMULAS: HookFormula[] = [
  'SPECIFIC_NUMBER',
  'CONTRARIAN',
  'THIRD_PERSON_PROOF',
  'DIRECT_COMMAND',
  'POV_AUTHORITY',
];

export const FORMAT_LABEL: Record<Format, string> = {
  WHITEBOARD: 'Whiteboard',
  BEHIND_DESK: 'Behind desk',
  WALKING: 'Walking',
  SELFIE: 'Selfie',
  SCREEN_RECORD: 'Screen record',
  PHONE_CLOSEUP: 'Phone closeup',
  IRL_DEMO: 'IRL demo',
  DRIVING: 'Driving',
};

export const WEDGE_LABEL: Record<Wedge, string> = {
  TIME: 'Time',
  TEAM: 'Team',
  AUTOMATION: 'Automation',
  SCALE: 'Scale',
  LEADS: 'Leads',
  DEFENSIVE_MODE: 'Defensive mode',
  MARGIN_CLIFF: 'Margin cliff',
  DECISION_FATIGUE: 'Decision fatigue',
  CASH_FLOW: 'Cash flow',
};

export const FORMULA_LABEL: Record<HookFormula, string> = {
  SPECIFIC_NUMBER: 'Specific number',
  CONTRARIAN: 'Contrarian',
  THIRD_PERSON_PROOF: 'Third-person proof',
  DIRECT_COMMAND: 'Direct command',
  POV_AUTHORITY: 'POV authority',
};
