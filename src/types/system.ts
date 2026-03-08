export type AlterRole = 'hôte' | 'protecteur' | 'persécuteur' | 'gardien' | 'observateur' | 'trauma holder' | 'autre';

export interface Alter {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  roleType: AlterRole;
  apparentAge?: string;
  pronouns: string;
  personality: string;
  strengths: string;
  difficulties: string;
  relations: string;
  internalNotes: string;
  isPublic: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  alterId: string;
  title: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  isPrivateAlterJournal: boolean;
}

export interface MoodEntry {
  id: string;
  date: string;
  alterId: string;
  mood: string;
  energyLevel: number;
  notes: string;
}

export interface FrontEntry {
  id: string;
  alterId: string;
  timestamp: string;
  notes: string;
}

export interface Citation {
  id: string;
  text: string;
  alterId: string;
  date: string;
  isPublic: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  link: string;
  category: 'livres' | 'films' | 'séries' | 'musique' | 'articles';
  isPublic: boolean;
}

export interface InnerWorldPlace {
  id: string;
  name: string;
  description: string;
  image?: string;
  significance: string;
  linkedAlterIds: string[];
  isPublic: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  alterId: string;
  isPublic: boolean;
}

export interface AlterRelation {
  id: string;
  fromAlterId: string;
  toAlterId: string;
  type: 'allié' | 'protecteur' | 'conflit' | 'influence' | 'famille interne';
}

export interface LexiconEntry {
  id: string;
  term: string;
  definition: string;
  category: string;
  isPublic: boolean;
}

export interface SystemInfo {
  name: string;
  description: string;
  currentFrontAlterId: string;
  moodOfDay: string;
  homepageImage?: string;
}

export interface SystemData {
  systemInfo: SystemInfo;
  alters: Alter[];
  journal: JournalEntry[];
  moods: MoodEntry[];
  frontHistory: FrontEntry[];
  citations: Citation[];
  resources: Resource[];
  innerWorld: InnerWorldPlace[];
  timeline: TimelineEvent[];
  relations: AlterRelation[];
  lexicon: LexiconEntry[];
  adminPassword: string;
}
