import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SystemData, Alter, JournalEntry, MoodEntry, FrontEntry, Citation, Resource, InnerWorldPlace, TimelineEvent, AlterRelation } from '@/types/system';

const defaultData: SystemData = {
  systemInfo: {
    name: "Les Esprits du Crépuscule",
    description: "Un système pluriel naviguant entre les ombres et la lumière. Chaque alter est une flamme unique dans la nuit.",
    currentFrontAlterId: "1",
    moodOfDay: "Contemplatif",
  },
  alters: [
    {
      id: "1", name: "Luna", avatar: "", role: "Hôte principal", roleType: "hôte",
      apparentAge: "25", pronouns: "elle/la", personality: "Calme, réfléchie, mélancolique",
      strengths: "Empathie, écriture, introspection", difficulties: "Anxiété sociale, dissociation",
      relations: "Proche d'Ignis, protégée par Nyx", internalNotes: "Front le plus fréquent",
      isPublic: true,
    },
    {
      id: "2", name: "Ignis", avatar: "", role: "Protecteur émotionnel", roleType: "protecteur",
      apparentAge: "30", pronouns: "il/lui", personality: "Intense, loyal, parfois colérique",
      strengths: "Force émotionnelle, détermination", difficulties: "Gestion de la colère",
      relations: "Allié de Luna, en conflit avec Shade", internalNotes: "Apparaît en situation de stress",
      isPublic: true,
    },
    {
      id: "3", name: "Nyx", avatar: "", role: "Gardienne des souvenirs", roleType: "gardien",
      apparentAge: "Ageless", pronouns: "iel", personality: "Mystérieuse, sage, distante",
      strengths: "Mémoire, sagesse, stabilité", difficulties: "Détachement émotionnel",
      relations: "Protège Luna, observe Shade", internalNotes: "Rarement au front",
      isPublic: true,
    },
    {
      id: "4", name: "Shade", avatar: "", role: "Persécuteur en transition", roleType: "persécuteur",
      apparentAge: "??", pronouns: "il/lui", personality: "Cynique, blessé, en quête de sens",
      strengths: "Lucidité, survie", difficulties: "Auto-sabotage, isolement",
      relations: "En conflit avec Ignis, surveillé par Nyx", internalNotes: "Travail thérapeutique en cours",
      isPublic: false,
    },
  ],
  journal: [
    {
      id: "1", date: "2026-03-07", alterId: "1", title: "Premier souffle",
      content: "Aujourd'hui nous avons décidé de documenter notre existence. Chaque voix mérite d'être entendue, chaque ombre mérite sa lumière.",
      tags: ["début", "espoir"], isPublic: true, isPrivateAlterJournal: false,
    },
  ],
  moods: [
    { id: "1", date: "2026-03-07", alterId: "1", mood: "Contemplatif", energyLevel: 6, notes: "Journée calme" },
  ],
  frontHistory: [
    { id: "1", alterId: "1", timestamp: "2026-03-07T08:00:00", notes: "Début de journée" },
  ],
  citations: [
    { id: "1", text: "Nous ne sommes pas brisés. Nous sommes une mosaïque de survie.", alterId: "1", date: "2026-03-07", isPublic: true },
  ],
  resources: [
    { id: "1", title: "Understanding DID", description: "Guide complet sur le TDI", link: "https://example.com", category: "articles", isPublic: true },
  ],
  innerWorld: [
    { id: "1", name: "La Bibliothèque des Ombres", description: "Un vaste lieu rempli de livres anciens, éclairé par des bougies flottantes. C'est ici que Nyx garde les souvenirs.", image: "", significance: "Lieu de mémoire et de sagesse", linkedAlterIds: ["3"], isPublic: true },
    { id: "2", name: "La Forge d'Ignis", description: "Une forge ardente où les émotions sont transformées en force. Les flammes ne brûlent jamais ceux qui sont bienvenus.", image: "", significance: "Lieu de transformation émotionnelle", linkedAlterIds: ["2"], isPublic: true },
  ],
  timeline: [
    { id: "1", date: "2026-01-15", title: "Découverte du système", description: "Première prise de conscience de notre pluralité", alterId: "1", isPublic: true },
  ],
  relations: [
    { id: "1", fromAlterId: "1", toAlterId: "2", type: "allié" },
    { id: "2", fromAlterId: "3", toAlterId: "1", type: "protecteur" },
    { id: "3", fromAlterId: "2", toAlterId: "4", type: "conflit" },
  ],
  adminPassword: "",
};

interface SystemContextType {
  data: SystemData;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  setupAdmin: (password: string) => void;
  isFirstSetup: boolean;
  updateSystemInfo: (info: SystemData['systemInfo']) => void;
  addAlter: (alter: Alter) => void;
  updateAlter: (alter: Alter) => void;
  deleteAlter: (id: string) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (entry: JournalEntry) => void;
  deleteJournalEntry: (id: string) => void;
  addMoodEntry: (entry: MoodEntry) => void;
  addFrontEntry: (entry: FrontEntry) => void;
  addCitation: (citation: Citation) => void;
  deleteCitation: (id: string) => void;
  addResource: (resource: Resource) => void;
  deleteResource: (id: string) => void;
  addInnerWorldPlace: (place: InnerWorldPlace) => void;
  updateInnerWorldPlace: (place: InnerWorldPlace) => void;
  deleteInnerWorldPlace: (id: string) => void;
  addTimelineEvent: (event: TimelineEvent) => void;
  deleteTimelineEvent: (id: string) => void;
  addRelation: (relation: AlterRelation) => void;
  deleteRelation: (id: string) => void;
  getAlterName: (id: string) => string;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error("useSystem must be used within SystemProvider");
  return context;
};

export const SystemProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<SystemData>(() => {
    const stored = localStorage.getItem('tdi-system-data');
    return stored ? JSON.parse(stored) : defaultData;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    localStorage.setItem('tdi-system-data', JSON.stringify(data));
  }, [data]);

  const isFirstSetup = !data.adminPassword;

  const login = (password: string) => {
    if (password === data.adminPassword) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAuthenticated(false);

  const setupAdmin = (password: string) => {
    setData(prev => ({ ...prev, adminPassword: password }));
    setIsAuthenticated(true);
  };

  const updateSystemInfo = (info: SystemData['systemInfo']) => setData(prev => ({ ...prev, systemInfo: info }));

  const addAlter = (alter: Alter) => setData(prev => ({ ...prev, alters: [...prev.alters, alter] }));
  const updateAlter = (alter: Alter) => setData(prev => ({ ...prev, alters: prev.alters.map(a => a.id === alter.id ? alter : a) }));
  const deleteAlter = (id: string) => setData(prev => ({ ...prev, alters: prev.alters.filter(a => a.id !== id) }));

  const addJournalEntry = (entry: JournalEntry) => setData(prev => ({ ...prev, journal: [...prev.journal, entry] }));
  const updateJournalEntry = (entry: JournalEntry) => setData(prev => ({ ...prev, journal: prev.journal.map(j => j.id === entry.id ? entry : j) }));
  const deleteJournalEntry = (id: string) => setData(prev => ({ ...prev, journal: prev.journal.filter(j => j.id !== id) }));

  const addMoodEntry = (entry: MoodEntry) => setData(prev => ({ ...prev, moods: [...prev.moods, entry] }));
  const addFrontEntry = (entry: FrontEntry) => setData(prev => ({ ...prev, frontHistory: [...prev.frontHistory, entry], systemInfo: { ...prev.systemInfo, currentFrontAlterId: entry.alterId } }));

  const addCitation = (citation: Citation) => setData(prev => ({ ...prev, citations: [...prev.citations, citation] }));
  const deleteCitation = (id: string) => setData(prev => ({ ...prev, citations: prev.citations.filter(c => c.id !== id) }));

  const addResource = (resource: Resource) => setData(prev => ({ ...prev, resources: [...prev.resources, resource] }));
  const deleteResource = (id: string) => setData(prev => ({ ...prev, resources: prev.resources.filter(r => r.id !== id) }));

  const addInnerWorldPlace = (place: InnerWorldPlace) => setData(prev => ({ ...prev, innerWorld: [...prev.innerWorld, place] }));
  const updateInnerWorldPlace = (place: InnerWorldPlace) => setData(prev => ({ ...prev, innerWorld: prev.innerWorld.map(p => p.id === place.id ? place : p) }));
  const deleteInnerWorldPlace = (id: string) => setData(prev => ({ ...prev, innerWorld: prev.innerWorld.filter(p => p.id !== id) }));

  const addTimelineEvent = (event: TimelineEvent) => setData(prev => ({ ...prev, timeline: [...prev.timeline, event] }));
  const deleteTimelineEvent = (id: string) => setData(prev => ({ ...prev, timeline: prev.timeline.filter(t => t.id !== id) }));

  const addRelation = (relation: AlterRelation) => setData(prev => ({ ...prev, relations: [...prev.relations, relation] }));
  const deleteRelation = (id: string) => setData(prev => ({ ...prev, relations: prev.relations.filter(r => r.id !== id) }));

  const getAlterName = (id: string) => data.alters.find(a => a.id === id)?.name || 'Inconnu';

  return (
    <SystemContext.Provider value={{
      data, isAuthenticated, login, logout, setupAdmin, isFirstSetup,
      updateSystemInfo, addAlter, updateAlter, deleteAlter,
      addJournalEntry, updateJournalEntry, deleteJournalEntry,
      addMoodEntry, addFrontEntry, addCitation, deleteCitation,
      addResource, deleteResource, addInnerWorldPlace, updateInnerWorldPlace,
      deleteInnerWorldPlace, addTimelineEvent, deleteTimelineEvent,
      addRelation, deleteRelation, getAlterName,
    }}>
      {children}
    </SystemContext.Provider>
  );
};
