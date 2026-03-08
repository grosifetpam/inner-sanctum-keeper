import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SystemData, Alter, JournalEntry, MoodEntry, FrontEntry, Citation, Resource, InnerWorldPlace, TimelineEvent, AlterRelation, AlterRole, LexiconEntry } from '@/types/system';
import type { User } from '@supabase/supabase-js';

const emptyData: SystemData = {
  systemInfo: { name: '', description: '', currentFrontAlterId: '', moodOfDay: '', homepageImage: '' },
  alters: [], journal: [], moods: [], frontHistory: [], citations: [],
  resources: [], innerWorld: [], timeline: [], relations: [], lexicon: [], adminPassword: '',
};

interface SystemContextType {
  data: SystemData;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
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
  addLexiconEntry: (entry: LexiconEntry) => void;
  updateLexiconEntry: (entry: LexiconEntry) => void;
  deleteLexiconEntry: (id: string) => void;
  getAlterName: (id: string) => string;
  refreshData: () => Promise<void>;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error("useSystem must be used within SystemProvider");
  return context;
};

// Helper to map DB rows to app types
function mapAlter(row: any): Alter {
  return {
    id: row.id, name: row.name, avatar: row.avatar, role: row.role,
    roleType: row.role_type as AlterRole, apparentAge: row.apparent_age,
    pronouns: row.pronouns, personality: row.personality, strengths: row.strengths,
    difficulties: row.difficulties, relations: row.relations,
    internalNotes: row.internal_notes, isPublic: row.is_public,
  };
}

function mapJournal(row: any): JournalEntry {
  return {
    id: row.id, date: row.date, alterId: row.alter_id, title: row.title,
    content: row.content, tags: row.tags || [], isPublic: row.is_public,
    isPrivateAlterJournal: row.is_private_alter_journal,
  };
}

function mapMood(row: any): MoodEntry {
  return { id: row.id, date: row.date, alterId: row.alter_id, mood: row.mood, energyLevel: row.energy_level, notes: row.notes };
}

function mapFront(row: any): FrontEntry {
  return { id: row.id, alterId: row.alter_id, timestamp: row.timestamp, notes: row.notes };
}

function mapCitation(row: any): Citation {
  return { id: row.id, text: row.text, alterId: row.alter_id, date: row.date, isPublic: row.is_public };
}

function mapResource(row: any): Resource {
  return { id: row.id, title: row.title, description: row.description, link: row.link, category: row.category, isPublic: row.is_public };
}

function mapPlace(row: any): InnerWorldPlace {
  return { id: row.id, name: row.name, description: row.description, image: row.image, significance: row.significance, linkedAlterIds: row.linked_alter_ids || [], isPublic: row.is_public };
}

function mapTimeline(row: any): TimelineEvent {
  return { id: row.id, date: row.date, title: row.title, description: row.description, alterId: row.alter_id, isPublic: row.is_public };
}

function mapRelation(row: any): AlterRelation {
  return { id: row.id, fromAlterId: row.from_alter_id, toAlterId: row.to_alter_id, type: row.type };
}

export const SystemProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<SystemData>(emptyData);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  const isFirstSetup = false; // No longer needed with Supabase auth

  // Fetch all data (public or authenticated)
  const fetchData = useCallback(async () => {
    try {
      const [sysRes, altRes, jrnRes, moodRes, frontRes, citRes, resRes, plcRes, tlRes, relRes] = await Promise.all([
        supabase.from('system_info').select('*').limit(1).single(),
        supabase.from('alters').select('*').order('created_at'),
        supabase.from('journal_entries').select('*').order('created_at', { ascending: false }),
        supabase.from('mood_entries').select('*').order('created_at', { ascending: false }),
        supabase.from('front_entries').select('*').order('created_at', { ascending: false }),
        supabase.from('citations').select('*').order('created_at', { ascending: false }),
        supabase.from('resources').select('*').order('created_at'),
        supabase.from('inner_world_places').select('*').order('created_at'),
        supabase.from('timeline_events').select('*').order('date'),
        supabase.from('alter_relations').select('*'),
      ]);

      setData({
        systemInfo: sysRes.data ? {
          name: sysRes.data.name, description: sysRes.data.description,
          currentFrontAlterId: sysRes.data.current_front_alter_id, moodOfDay: sysRes.data.mood_of_day,
          homepageImage: (sysRes.data as any).homepage_image || '',
        } : emptyData.systemInfo,
        alters: (altRes.data || []).map(mapAlter),
        journal: (jrnRes.data || []).map(mapJournal),
        moods: (moodRes.data || []).map(mapMood),
        frontHistory: (frontRes.data || []).map(mapFront),
        citations: (citRes.data || []).map(mapCitation),
        resources: (resRes.data || []).map(mapResource),
        innerWorld: (plcRes.data || []).map(mapPlace),
        timeline: (tlRes.data || []).map(mapTimeline),
        relations: (relRes.data || []).map(mapRelation),
        adminPassword: '',
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  }, []);

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data on auth change
  useEffect(() => {
    fetchData();
  }, [user, fetchData]);

  const login = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  };

  const signup = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin }
    });
    return error ? error.message : null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Helper: ensure system_info row exists
  const ensureSystemInfo = async (info: SystemData['systemInfo']) => {
    if (!user) return;
    const { data: existing } = await supabase.from('system_info').select('id').eq('user_id', user.id).limit(1).single();
    if (existing) {
      await supabase.from('system_info').update({
        name: info.name, description: info.description,
        current_front_alter_id: info.currentFrontAlterId, mood_of_day: info.moodOfDay,
        homepage_image: info.homepageImage || '',
        updated_at: new Date().toISOString(),
      } as any).eq('id', existing.id);
    } else {
      await supabase.from('system_info').insert({
        user_id: user.id, name: info.name, description: info.description,
        current_front_alter_id: info.currentFrontAlterId, mood_of_day: info.moodOfDay,
        homepage_image: info.homepageImage || '',
      } as any);
    }
  };

  const updateSystemInfo = async (info: SystemData['systemInfo']) => {
    setData(prev => ({ ...prev, systemInfo: info }));
    await ensureSystemInfo(info);
  };

  const addAlter = async (alter: Alter) => {
    if (!user) return;
    const { data: inserted } = await supabase.from('alters').insert({
      user_id: user.id, name: alter.name, avatar: alter.avatar, role: alter.role,
      role_type: alter.roleType, apparent_age: alter.apparentAge, pronouns: alter.pronouns,
      personality: alter.personality, strengths: alter.strengths, difficulties: alter.difficulties,
      relations: alter.relations, internal_notes: alter.internalNotes, is_public: alter.isPublic,
    }).select().single();
    if (inserted) setData(prev => ({ ...prev, alters: [...prev.alters, mapAlter(inserted)] }));
  };

  const updateAlter = async (alter: Alter) => {
    if (!user) return;
    await supabase.from('alters').update({
      name: alter.name, avatar: alter.avatar, role: alter.role,
      role_type: alter.roleType, apparent_age: alter.apparentAge, pronouns: alter.pronouns,
      personality: alter.personality, strengths: alter.strengths, difficulties: alter.difficulties,
      relations: alter.relations, internal_notes: alter.internalNotes, is_public: alter.isPublic,
    }).eq('id', alter.id);
    setData(prev => ({ ...prev, alters: prev.alters.map(a => a.id === alter.id ? alter : a) }));
  };

  const deleteAlter = async (id: string) => {
    if (!user) return;
    await supabase.from('alters').delete().eq('id', id);
    setData(prev => ({ ...prev, alters: prev.alters.filter(a => a.id !== id) }));
  };

  const addJournalEntry = async (entry: JournalEntry) => {
    if (!user) return;
    const { data: inserted } = await supabase.from('journal_entries').insert({
      user_id: user.id, date: entry.date, alter_id: entry.alterId, title: entry.title,
      content: entry.content, tags: entry.tags, is_public: entry.isPublic,
      is_private_alter_journal: entry.isPrivateAlterJournal,
    }).select().single();
    if (inserted) setData(prev => ({ ...prev, journal: [mapJournal(inserted), ...prev.journal] }));
  };

  const updateJournalEntry = async (entry: JournalEntry) => {
    if (!user) return;
    await supabase.from('journal_entries').update({
      date: entry.date, alter_id: entry.alterId, title: entry.title,
      content: entry.content, tags: entry.tags, is_public: entry.isPublic,
      is_private_alter_journal: entry.isPrivateAlterJournal,
    }).eq('id', entry.id);
    setData(prev => ({ ...prev, journal: prev.journal.map(j => j.id === entry.id ? entry : j) }));
  };

  const deleteJournalEntry = async (id: string) => {
    if (!user) return;
    await supabase.from('journal_entries').delete().eq('id', id);
    setData(prev => ({ ...prev, journal: prev.journal.filter(j => j.id !== id) }));
  };

  const addMoodEntry = async (entry: MoodEntry) => {
    if (!user) return;
    const { data: inserted } = await supabase.from('mood_entries').insert({
      user_id: user.id, date: entry.date, alter_id: entry.alterId,
      mood: entry.mood, energy_level: entry.energyLevel, notes: entry.notes,
    }).select().single();
    if (inserted) setData(prev => ({ ...prev, moods: [mapMood(inserted), ...prev.moods] }));
  };

  const addFrontEntry = async (entry: FrontEntry) => {
    if (!user) return;
    const { data: inserted } = await supabase.from('front_entries').insert({
      user_id: user.id, alter_id: entry.alterId, timestamp: entry.timestamp, notes: entry.notes,
    }).select().single();
    if (inserted) {
      setData(prev => ({
        ...prev,
        frontHistory: [mapFront(inserted), ...prev.frontHistory],
        systemInfo: { ...prev.systemInfo, currentFrontAlterId: entry.alterId },
      }));
      await ensureSystemInfo({ ...data.systemInfo, currentFrontAlterId: entry.alterId });
    }
  };

  const addCitation = async (citation: Citation) => {
    if (!user) return;
    const { data: inserted } = await supabase.from('citations').insert({
      user_id: user.id, text: citation.text, alter_id: citation.alterId,
      date: citation.date, is_public: citation.isPublic,
    }).select().single();
    if (inserted) setData(prev => ({ ...prev, citations: [mapCitation(inserted), ...prev.citations] }));
  };

  const deleteCitation = async (id: string) => {
    if (!user) return;
    await supabase.from('citations').delete().eq('id', id);
    setData(prev => ({ ...prev, citations: prev.citations.filter(c => c.id !== id) }));
  };

  const addResource = async (resource: Resource) => {
    if (!user) return;
    const { data: inserted } = await supabase.from('resources').insert({
      user_id: user.id, title: resource.title, description: resource.description,
      link: resource.link, category: resource.category, is_public: resource.isPublic,
    }).select().single();
    if (inserted) setData(prev => ({ ...prev, resources: [...prev.resources, mapResource(inserted)] }));
  };

  const deleteResource = async (id: string) => {
    if (!user) return;
    await supabase.from('resources').delete().eq('id', id);
    setData(prev => ({ ...prev, resources: prev.resources.filter(r => r.id !== id) }));
  };

  const addInnerWorldPlace = async (place: InnerWorldPlace) => {
    if (!user) return;
    const { data: inserted } = await supabase.from('inner_world_places').insert({
      user_id: user.id, name: place.name, description: place.description,
      image: place.image, significance: place.significance,
      linked_alter_ids: place.linkedAlterIds, is_public: place.isPublic,
    }).select().single();
    if (inserted) setData(prev => ({ ...prev, innerWorld: [...prev.innerWorld, mapPlace(inserted)] }));
  };

  const updateInnerWorldPlace = async (place: InnerWorldPlace) => {
    if (!user) return;
    await supabase.from('inner_world_places').update({
      name: place.name, description: place.description, image: place.image,
      significance: place.significance, linked_alter_ids: place.linkedAlterIds, is_public: place.isPublic,
    }).eq('id', place.id);
    setData(prev => ({ ...prev, innerWorld: prev.innerWorld.map(p => p.id === place.id ? place : p) }));
  };

  const deleteInnerWorldPlace = async (id: string) => {
    if (!user) return;
    await supabase.from('inner_world_places').delete().eq('id', id);
    setData(prev => ({ ...prev, innerWorld: prev.innerWorld.filter(p => p.id !== id) }));
  };

  const addTimelineEvent = async (event: TimelineEvent) => {
    if (!user) return;
    const { data: inserted } = await supabase.from('timeline_events').insert({
      user_id: user.id, date: event.date, title: event.title,
      description: event.description, alter_id: event.alterId, is_public: event.isPublic,
    }).select().single();
    if (inserted) setData(prev => ({ ...prev, timeline: [...prev.timeline, mapTimeline(inserted)] }));
  };

  const deleteTimelineEvent = async (id: string) => {
    if (!user) return;
    await supabase.from('timeline_events').delete().eq('id', id);
    setData(prev => ({ ...prev, timeline: prev.timeline.filter(t => t.id !== id) }));
  };

  const addRelation = async (relation: AlterRelation) => {
    if (!user) return;
    const { data: inserted } = await supabase.from('alter_relations').insert({
      user_id: user.id, from_alter_id: relation.fromAlterId,
      to_alter_id: relation.toAlterId, type: relation.type,
    }).select().single();
    if (inserted) setData(prev => ({ ...prev, relations: [...prev.relations, mapRelation(inserted)] }));
  };

  const deleteRelation = async (id: string) => {
    if (!user) return;
    await supabase.from('alter_relations').delete().eq('id', id);
    setData(prev => ({ ...prev, relations: prev.relations.filter(r => r.id !== id) }));
  };

  const getAlterName = (id: string) => data.alters.find(a => a.id === id)?.name || 'Inconnu';

  return (
    <SystemContext.Provider value={{
      data, isAuthenticated, isLoading, user, login, signup, logout, isFirstSetup,
      updateSystemInfo, addAlter, updateAlter, deleteAlter,
      addJournalEntry, updateJournalEntry, deleteJournalEntry,
      addMoodEntry, addFrontEntry, addCitation, deleteCitation,
      addResource, deleteResource, addInnerWorldPlace, updateInnerWorldPlace,
      deleteInnerWorldPlace, addTimelineEvent, deleteTimelineEvent,
      addRelation, deleteRelation, getAlterName, refreshData: fetchData,
    }}>
      {children}
    </SystemContext.Provider>
  );
};
