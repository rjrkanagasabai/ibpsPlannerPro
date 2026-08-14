/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { create } from "zustand";
import * as htmlToImage from "html-to-image";
import { ClipboardCheck } from "lucide-react";
import "./App.css";
import {
  Target,
  LayoutDashboard,
  CalendarCheck,
  Calculator,
  CheckCircle,
  Settings,
  Moon,
  Sun,
  Calendar,
  Clock,
  CheckSquare,
  CheckCircle2,
  Circle,
  X,
  Plus,
  Trash2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Brain,
  User,
  Lightbulb,
  BookOpen,
  Save,
  Edit3,
  AlertCircle,
  Menu,
  Minus,
  FileText,
  UploadCloud,
  BookText,
  Search,
  Volume2,
  Trophy,
  Award,
  Zap,
  Loader2,
  Play,
  Pause,
  RotateCcw,
  Bookmark,
  Timer,
  LineChart,
  CalendarDays,
  BellRing,
  Coffee,
  LogOut,
  Lock,
  Key,
  ShieldCheck,
  BookMarked,
  ShieldAlert,
  MessageSquare,
  Maximize,
  Minimize,
  PenTool,
  Tag,
  Layers,
  Filter,
  GripHorizontal,
  GripVertical,
  LayoutGrid,
  SortAsc,
  SortDesc,
  Bell,
  VolumeX,
  Folder,
  Download,
} from "lucide-react";

// --- SUPABASE CLIENT IMPORT ---
import { supabase } from "./supabase";
import MockTestModule, { MockTracker } from "./MockTestModule";
let syncTimeout = null;

// --- AUDIO NOTIFICATION ENGINE ---
const playBeep = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    gain1.gain.setValueAtTime(0.1, ctx.currentTime);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.15);

    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1046.5, ctx.currentTime);
      gain2.gain.setValueAtTime(0.1, ctx.currentTime);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.2);
    }, 200);
  } catch (e) {
    console.log(
      "Audio play failed. Browser may require user interaction first.",
      e,
    );
  }
};

export const triggerSystemNotification = (
  title,
  body,
  settings,
  forceSilent = false,
) => {
  if (settings?.audio && !forceSilent) {
    playBeep();
  }
  if (
    settings?.notifications &&
    "Notification" in window &&
    Notification.permission === "granted"
  ) {
    new Notification(title, {
      body,
      icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      silent: true,
    });
  }
};

// --- DEFAULT CONFIG DATA ---
const defaultTimeline = [
  {
    time: "05:00",
    activity: "Wake Up & Hydrate",
    checked: false,
    notes: "",
    isStudy: false,
  },
  {
    time: "05:20",
    activity: "Quant Video / Concept",
    checked: false,
    notes: "",
    isStudy: true,
  },
  {
    time: "07:20",
    activity: "Quant PDF Practice",
    checked: false,
    notes: "",
    isStudy: true,
  },
  {
    time: "07:50",
    activity: "Breakfast & Break",
    checked: false,
    notes: "",
    isStudy: false,
  },
  {
    time: "08:20",
    activity: "Quant Video 2",
    checked: false,
    notes: "",
    isStudy: true,
  },
  {
    time: "09:00",
    activity: "Quant Questions",
    checked: false,
    notes: "",
    isStudy: true,
  },
  {
    time: "10:30",
    activity: "English Video",
    checked: false,
    notes: "",
    isStudy: true,
  },
  {
    time: "11:30",
    activity: "English Practice",
    checked: false,
    notes: "",
    isStudy: true,
  },
  {
    time: "13:00",
    activity: "Lunch & Walk",
    checked: false,
    notes: "",
    isStudy: false,
  },
  {
    time: "13:45",
    activity: "Reasoning Puzzles",
    checked: false,
    notes: "",
    isStudy: true,
  },
  {
    time: "16:45",
    activity: "Current Affairs",
    checked: false,
    notes: "",
    isStudy: true,
  },
  {
    time: "17:45",
    activity: "Full Mock Test",
    checked: false,
    notes: "",
    isStudy: true,
  },
  {
    time: "18:45",
    activity: "Mock Analysis",
    checked: false,
    notes: "",
    isStudy: true,
  },
  {
    time: "20:00",
    activity: "General Revision",
    checked: false,
    notes: "",
    isStudy: true,
  },
  {
    time: "22:15",
    activity: "Tomorrow Planning & Sleep",
    checked: false,
    notes: "",
    isStudy: false,
  },
];

const quantTopics = [
  "Simplification",
  "Quadratic Eq",
  "Number Series",
  "Percentage",
  "Profit Loss",
  "Ratio",
  "Mixture",
  "Time & Work",
  "Pipes",
  "Speed Dist",
  "SI & CI",
  "Probability",
];

const reasoningTopics = [
  { topic: "Floor-Based Puzzle", tier: "Tier 1" },
  { topic: "Seating Arrangement", tier: "Tier 1" },
  { topic: "Box Puzzle", tier: "Tier 1" },
  { topic: "Scheduling Puzzle", tier: "Tier 1" },
  { topic: "Comparison Puzzle", tier: "Tier 1" },
  { topic: "Input-Output", tier: "Tier 2" },
  { topic: "Critical Reasoning", tier: "Tier 2" },
  { topic: "Data Sufficiency", tier: "Tier 2" },
  { topic: "Logical Reasoning Sets", tier: "Tier 2" },
  { topic: "Blood Relations", tier: "Tier 3" },
  { topic: "Direction Sense", tier: "Tier 3" },
  { topic: "Order & Ranking", tier: "Tier 3" },
  { topic: "Coding-Decoding", tier: "Tier 3" },
  { topic: "Syllogism", tier: "Tier 3" },
  { topic: "Inequality", tier: "Tier 3" },
  { topic: "Machine Input", tier: "Tier 4" },
  { topic: "Statement & Assumption", tier: "Tier 4" },
  { topic: "Statement & Conclusion", tier: "Tier 4" },
  { topic: "Statement & Argument", tier: "Tier 4" },
  { topic: "Course of Action", tier: "Tier 4" },
  { topic: "Decision Making", tier: "Tier 4" },
  { topic: "Analytical Reasoning", tier: "Tier 4" },
];

const defaultHabitList = [
  "Wake Up 5 AM",
  "Study 10 Hours",
  "Quant Practice",
  "English Read",
  "Reasoning",
  "Current Affairs",
  "Exercise",
  "Sleep 10:30",
];

const upcomingExamsList = [
  { name: "IBPS PO Pre", date: "22/23 AUG", category: "IBPS" },
  { name: "IBPS PO Mains", date: "4 OCT", category: "IBPS" },
  { name: "IBPS Clerk Pre", date: "10/11 OCT", category: "IBPS" },
  { name: "IBPS Clerk Mains", date: "27 DEC", category: "IBPS" },
  { name: "RRB PO Pre", date: "21/22 NOV", category: "RRB" },
  { name: "RRB PO Mains", date: "20 DEC", category: "RRB" },
  { name: "RRB Clerk Pre", date: "6/12/13 DEC", category: "RRB" },
  { name: "RRB Clerk Mains", date: "30 JAN", category: "RRB" },
  { name: "SBI PO Pre", date: "1/2 AUG (Exp)", category: "SBI" },
  { name: "SBI PO Mains", date: "12 SEP (Exp)", category: "SBI" },
  { name: "SBI Clerk Pre", date: "27 SEP (Exp)", category: "SBI" },
  { name: "SBI Clerk Mains", date: "7 NOV (Exp)", category: "SBI" },
];

const expectedNotifications = [
  "FCI",
  "NIACL/NICL Assistant",
  "LIC Assistant",
  "UIICL AO",
];

const NOTE_TOPICS = [
  "Quants",
  "Reasoning",
  "English",
  "Current Affairs",
  "Static GK",
  "Banking Awareness",
  "General",
];

const MONTHS_LIST = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CA_TOPICS_LIST = [
  "Sports",
  "National",
  "International",
  "Banking & Economy",
  "Appointments",
  "Awards",
  "Defense",
  "Science & Tech",
  "Important Days",
  "Miscellaneous",
];

const getFormattedDateStr = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const calculateStudyMinutes = (timeline) => {
  if (!timeline || timeline.length === 0)
    return { completedMins: 0, targetMins: 0 };
  const sortedTimeline = [...timeline].sort((a, b) => {
    const aMins =
      parseInt((a.time || "00:00").split(":")[0]) * 60 +
      parseInt((a.time || "00:00").split(":")[1]);
    const bMins =
      parseInt((b.time || "00:00").split(":")[0]) * 60 +
      parseInt((b.time || "00:00").split(":")[1]);
    return aMins - bMins;
  });

  let completedMins = 0;
  let targetMins = 0;
  for (let i = 0; i < sortedTimeline.length; i++) {
    const current = sortedTimeline[i];
    const isStudyTask =
      current.isStudy !== undefined
        ? current.isStudy
        : !/(wake|break|lunch|sleep|walk|hydrate|breakfast|dinner)/i.test(
            current.activity,
          );
    if (isStudyTask) {
      let durationMins = 60;
      if (i < sortedTimeline.length - 1) {
        const nextParts = (sortedTimeline[i + 1].time || "00:00").split(":");
        const currParts = (current.time || "00:00").split(":");
        const nextTime = parseInt(nextParts[0]) * 60 + parseInt(nextParts[1]);
        const currTime = parseInt(currParts[0]) * 60 + parseInt(currParts[1]);
        durationMins = nextTime - currTime;
        if (durationMins < 0) durationMins += 24 * 60;
      }
      targetMins += durationMins;
      if (current.checked) completedMins += durationMins;
    }
  }
  return { completedMins, targetMins };
};

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// --- ZUSTAND STORE ---
export const useAppStore = create((set, get) => ({
  user: null,
  session: null,
  authLoading: true,
  theme: "light",
  activeView: "dashboard",
  selectedDate: getFormattedDateStr(),
  toasts: [],
  confirmDialog: { isOpen: false, message: "", onConfirm: null },
  settings: { notifications: true, audio: false },
  baseTimeline: defaultTimeline,
  baseHabits: defaultHabitList,
  history: {},
  mocks: [],
  habits: {},
  vocab: [],
  digitalNotes: [],
  isSyncing: false,
  premiumData: {
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    totalStudyMinutes: 0,
    bookmarks: [],
    revisions: {},
    examDate: "2026-10-01",
    lastMonthlyQuizMonth: new Date().toISOString().substring(0, 7),
  },

  // --- NEW SUPABASE SYNC ENGINE ---
  fetchUserDataFromCloud: async () => {
    const user = get().user;
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("user_data")
        .select("app_state")
        .eq("user_id", user.id)
        .single();

      if (data && data.app_state) {
        const cloudState = data.app_state;
        set({
          theme: cloudState.theme || "light",
          history: cloudState.history || {},
          mocks: cloudState.mocks || [],
          habits: cloudState.habits || {},
          baseTimeline: cloudState.baseTimeline || defaultTimeline,
          baseHabits: cloudState.baseHabits || defaultHabitList,
          premiumData: cloudState.premiumData || get().premiumData,
          settings: cloudState.settings || {
            notifications: true,
            audio: false,
          },
        });
        document.body.setAttribute("data-theme", cloudState.theme || "light");
      }
    } catch (err) {
      console.error("Failed to load user state from cloud:", err);
    }
  },

  syncStateToCloud: () => {
    const state = get();
    if (!state.user) return;

    // Debounce the API call so rapid typing doesn't spam Supabase
    if (syncTimeout) clearTimeout(syncTimeout);

    syncTimeout = setTimeout(async () => {
      const app_state = {
        theme: state.theme,
        history: state.history,
        mocks: state.mocks,
        habits: state.habits,
        baseTimeline: state.baseTimeline,
        baseHabits: state.baseHabits,
        premiumData: state.premiumData,
        settings: state.settings,
      };

      await supabase
        .from("user_data")
        .upsert(
          { user_id: state.user.id, app_state },
          { onConflict: "user_id" },
        );
    }, 1500); // 1.5 second delay after the last state change
  },

  // --- STATE MUTATORS (Now with Cloud Sync) ---
  setTheme: (theme) => {
    document.body.setAttribute("data-theme", theme);
    set({ theme });
    get().syncStateToCloud();
  },
  setActiveView: (view) => set({ activeView: view }),
  setSelectedDate: (date) => set({ selectedDate: date }),

  updateSettings: (newSettings) => {
    set((state) => ({ settings: { ...state.settings, ...newSettings } }));
    get().syncStateToCloud();
  },

  notify: (message, type = "success") => {
    const id = Date.now() + Math.random();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(
      () =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
      3000,
    );
  },

  requestConfirm: (message, onConfirm) =>
    set({ confirmDialog: { isOpen: true, message, onConfirm } }),
  closeConfirm: () =>
    set({ confirmDialog: { isOpen: false, message: "", onConfirm: null } }),

  initAuth: async () => {
    set({ authLoading: true });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, user: session?.user || null, authLoading: false });

    if (session?.user) {
      get().fetchUserDataFromCloud();
      get().fetchVocabFromCloud();
      get().fetchDigitalNotesFromCloud();
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = get().user;
      set({ session, user: session?.user || null, authLoading: false });
      if (session?.user && session.user.id !== currentUser?.id) {
        get().fetchUserDataFromCloud();
        get().fetchVocabFromCloud();
        get().fetchDigitalNotesFromCloud();
      } else if (!session?.user) {
        // Reset state on logout
        set({
          vocab: [],
          digitalNotes: [],
          history: {},
          mocks: {},
          habits: {},
        });
      }
    });
  },

  generateInternalEmail: (username) =>
    `${username
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")}@ibpsplanner.internal`,

  loginWithUsername: async (username, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: get().generateInternalEmail(username),
      password,
    });
    if (error) throw error;
    set({ user: data.user, session: data.session });

    get().fetchUserDataFromCloud();
    get().fetchVocabFromCloud();
    get().fetchDigitalNotesFromCloud();
    return data;
  },

  signUpWithUsername: async (username, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: get().generateInternalEmail(username),
      password,
      options: { data: { display_username: username.trim() } },
    });
    if (error) throw error;
    return data;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      session: null,
      vocab: [],
      digitalNotes: [],
      history: {},
      mocks: [],
      habits: {},
    });
    get().notify("Logged out successfully.", "info");
  },

  deleteAccount: async () => {
    const user = get().user;
    if (user) {
      try {
        const { error } = await supabase.rpc("delete_user");
        if (error) {
          await supabase.from("dictionary").delete().eq("user_id", user.id);
          await supabase.from("digital_notes").delete().eq("user_id", user.id);
          await supabase.from("user_data").delete().eq("user_id", user.id);
        }
        await supabase.auth.signOut();
      } catch (err) {}
    }
    set({
      user: null,
      session: null,
      vocab: [],
      history: {},
      mocks: [],
      habits: {},
      digitalNotes: [],
      premiumData: { bookmarks: [] },
    });
    get().notify(
      "Your account and all cloud data have been permanently deleted.",
      "info",
    );
  },

  /* ... Keep existing fetchVocabFromCloud to clearDigitalNotes methods here exactly as they are ... */
  fetchVocabFromCloud: async () => {
    const user = get().user;
    if (!user) return;
    set({ isSyncing: true });
    try {
      const { data, error } = await supabase
        .from("dictionary")
        .select("*")
        .eq("user_id", user.id)
        .order("dateAdded", { ascending: false });
      if (error) throw error;
      if (data) set({ vocab: data });
    } catch (err) {
    } finally {
      set({ isSyncing: false });
    }
  },
  addVocabNote: async (newNote) => {
    const user = get().user;
    if (!user) return;
    const noteWithUser = { ...newNote, user_id: user.id };
    set((state) => ({ vocab: [noteWithUser, ...state.vocab] }));
    get().notify(`Saved "${newNote.word}" to Cloud!`, "success");
    try {
      const { error } = await supabase
        .from("dictionary")
        .insert([noteWithUser]);
      if (error) {
        set((state) => ({
          vocab: state.vocab.filter((v) => v.id !== newNote.id),
        }));
        throw error;
      }
    } catch (err) {
      get().notify("Failed to save entry.", "error");
    }
  },
  updateVocabNote: async (noteObj) => {
    const user = get().user;
    if (!user) return;
    const noteWithUser = { ...noteObj, user_id: user.id };
    set((state) => ({
      vocab: state.vocab.map((v) => (v.id === noteObj.id ? noteWithUser : v)),
    }));
    get().notify("Note updated instantly!", "success");
    try {
      const { error } = await supabase
        .from("dictionary")
        .upsert([noteWithUser]);
      if (error) throw error;
    } catch (err) {
      get().notify("Failed to sync update to cloud.", "error");
    }
  },
  deleteVocabNote: async (id) => {
    const user = get().user;
    if (!user) return;
    set((state) => ({ vocab: state.vocab.filter((v) => v.id !== id) }));
    get().notify("Entry removed.", "info");
    try {
      const { error } = await supabase
        .from("dictionary")
        .delete()
        .match({ id: id, user_id: user.id });
      if (error) throw error;
    } catch (err) {
      get().notify("Failed to delete entry from cloud.", "error");
    }
  },
  fetchDigitalNotesFromCloud: async () => {
    const user = get().user;
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("digital_notes")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;
      if (data) set({ digitalNotes: data });
    } catch (err) {}
  },
  addDigitalNote: async (note) => {
    const user = get().user;
    if (!user) return;
    const noteWithUser = { ...note, user_id: user.id };
    set((state) => ({
      digitalNotes: [...(state.digitalNotes || []), noteWithUser],
    }));
    try {
      const { error } = await supabase
        .from("digital_notes")
        .insert([noteWithUser]);
      if (error) throw error;
    } catch (err) {
      get().notify("Failed to save canvas note to cloud.", "error");
    }
  },
  updateDigitalNote: async (id, updates) => {
    const user = get().user;
    if (!user) return;
    set((state) => ({
      digitalNotes: state.digitalNotes.map((n) =>
        n.id === id ? { ...n, ...updates } : n,
      ),
    }));
    try {
      const updatedNote = get().digitalNotes.find((n) => n.id === id);
      if (updatedNote) {
        const { error } = await supabase
          .from("digital_notes")
          .upsert([updatedNote]);
        if (error) throw error;
      }
    } catch (err) {
      get().notify("Failed to sync canvas update.", "error");
    }
  },
  deleteDigitalNote: async (id) => {
    const user = get().user;
    if (!user) return;
    set((state) => ({
      digitalNotes: state.digitalNotes.filter((n) => n.id !== id),
    }));
    try {
      const { error } = await supabase
        .from("digital_notes")
        .delete()
        .match({ id, user_id: user.id });
      if (error) throw error;
    } catch (err) {
      get().notify("Failed to delete canvas note from cloud.", "error");
    }
  },
  clearDigitalNotes: async () => {
    const user = get().user;
    if (!user) return;
    set({ digitalNotes: [] });
    get().notify("Canvas cleared.", "info");
    try {
      const { error } = await supabase
        .from("digital_notes")
        .delete()
        .eq("user_id", user.id);
      if (error) throw error;
    } catch (err) {
      get().notify("Failed to clear cloud notes.", "error");
    }
  },

  // --- CORE APP STATE WITH AUTO-SYNC ---
  updateHistory: (newHistoryData) => {
    const date = get().selectedDate;
    set((state) => ({
      history: {
        ...state.history,
        [date]: { ...state.history[date], ...newHistoryData },
      },
    }));
    get().syncStateToCloud();
  },

  setMocks: (mocks) => {
    set({ mocks });
    get().syncStateToCloud();
  },

  setPremiumData: (fn) => {
    set((state) => ({ premiumData: fn(state.premiumData) }));
    get().syncStateToCloud();
  },

  setAppData: (fn) => {
    set((state) => fn(state));
    get().syncStateToCloud();
  },
}));

function DigitalNotesBoard() {
  const {
    digitalNotes,
    addDigitalNote,
    updateDigitalNote,
    deleteDigitalNote,
    clearDigitalNotes,
    notify,
    requestConfirm,
  } = useAppStore();

  const [topicFilter, setTopicFilter] = useState("All");
  const [subtopicFilter, setSubtopicFilter] = useState("All");

  const [draftNote, setDraftNote] = useState(null);
  const boardRef = useRef(null);
  const datalistId = "subtopics-datalist";

  useEffect(() => {
    setSubtopicFilter("All");
  }, [topicFilter]);

  const currentSubtopics = [
    "All",
    ...new Set(
      digitalNotes
        .filter((n) => topicFilter === "All" || n.topic === topicFilter)
        .map((n) => n.subtopic)
        .filter((st) => st && st.trim() !== ""),
    ),
  ];

  const filteredNotes = digitalNotes.filter((n) => {
    if (topicFilter !== "All" && n.topic !== topicFilter) return false;
    if (subtopicFilter !== "All" && n.subtopic !== subtopicFilter) return false;
    return true;
  });

  useEffect(() => {
    const handlePaste = (e) => {
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      ) {
        const hasImage = Array.from(e.clipboardData?.items || []).some(
          (item) => item.type.indexOf("image") !== -1,
        );
        if (!hasImage) return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          const reader = new FileReader();
          reader.onload = (event) => {
            const scrollContainer = boardRef.current;
            const x = scrollContainer ? scrollContainer.scrollLeft + 150 : 150;
            const y = scrollContainer ? scrollContainer.scrollTop + 150 : 150;

            const defaultTopic = topicFilter !== "All" ? topicFilter : "Quants";
            const defaultSub = subtopicFilter !== "All" ? subtopicFilter : "";

            setDraftNote({
              id: Date.now().toString(),
              x,
              y,
              imageBase64: event.target.result,
              text: "",
              topic: defaultTopic,
              subtopic: defaultSub,
              type: "image",
              width: 320,
              height: "auto",
            });
            notify("Image pasted! Fill in tags and save.", "success");
          };
          reader.readAsDataURL(blob);
          break;
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [topicFilter, subtopicFilter, notify]);

  const handleBoardClick = (e) => {
    if (draftNote) return;
    if (
      e.target.closest(".saved-note-card") ||
      e.target.closest(".board-toolbar")
    )
      return;

    const rect = boardRef.current.getBoundingClientRect();
    const scrollLeft = boardRef.current.scrollLeft;
    const scrollTop = boardRef.current.scrollTop;

    const defaultTopic = topicFilter !== "All" ? topicFilter : "Quants";
    const defaultSub = subtopicFilter !== "All" ? subtopicFilter : "";

    setDraftNote({
      id: Date.now().toString(),
      x: e.clientX - rect.left + scrollLeft,
      y: e.clientY - rect.top + scrollTop,
      imageBase64: null,
      text: "",
      topic: defaultTopic,
      subtopic: defaultSub,
      type: "text",
      width: 280,
      height: "auto",
    });
  };

  const handleSaveDraft = () => {
    if (!draftNote.text.trim() && draftNote.type !== "image") {
      return notify("Enter some text or paste an image.", "error");
    }
    addDigitalNote({ ...draftNote, date: new Date().toISOString() });
    setDraftNote(null);
    notify("Note saved to cloud!", "success");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 80px)",
        background: "var(--bg)",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
      }}
    >
      <datalist id={datalistId}>
        {currentSubtopics
          .filter((s) => s !== "All")
          .map((s) => (
            <option key={s} value={s} />
          ))}
      </datalist>

      <div
        className="board-toolbar"
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--bg)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              padding: "10px",
              background: "rgba(99, 102, 241, 0.1)",
              borderRadius: "12px",
              color: "var(--accent)",
            }}
          >
            <LayoutGrid size={22} />
          </div>
          <div>
            <h2
              style={{
                fontSize: "18px",
                margin: "0 0 4px 0",
                fontWeight: 800,
                color: "var(--text-main)",
              }}
            >
              Smart Notes Canvas
            </h2>
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              Click to type • <strong>Ctrl+V</strong> to paste images
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(0,0,0,0.03)",
              padding: "6px 16px",
              borderRadius: "24px",
              border: "1px solid var(--border)",
            }}
          >
            <Filter size={14} color="var(--text-muted)" />
            <select
              className="custom-input"
              style={{
                border: "none",
                background: "transparent",
                padding: "0",
                fontSize: "13px",
                outline: "none",
                fontWeight: 600,
                color: "var(--text-main)",
                cursor: "pointer",
              }}
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
            >
              <option value="All">All Main Topics</option>
              {NOTE_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {digitalNotes.length > 0 && (
            <button
              className="icon-btn-minimal"
              title="Clear Entire Canvas"
              style={{
                color: "var(--danger)",
                background: "rgba(239, 68, 68, 0.1)",
                padding: "8px",
                borderRadius: "8px",
              }}
              onClick={() =>
                requestConfirm(
                  "Clear the entire canvas from cloud? This deletes all notes.",
                  clearDigitalNotes,
                )
              }
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {currentSubtopics.length > 1 && (
        <div
          className="board-toolbar scroll-area"
          style={{
            padding: "12px 24px",
            borderBottom: "1px solid var(--border)",
            background: "rgba(0,0,0,0.015)",
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            zIndex: 9,
          }}
        >
          {currentSubtopics.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubtopicFilter(sub)}
              style={{
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: subtopicFilter === sub ? 700 : 500,
                border:
                  subtopicFilter === sub
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border)",
                background:
                  subtopicFilter === sub ? "var(--accent)" : "var(--bg)",
                color: subtopicFilter === sub ? "#fff" : "var(--text-main)",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {sub === "All" ? "All Sub-boards" : sub}
            </button>
          ))}
        </div>
      )}

      <div
        ref={boardRef}
        onClick={handleBoardClick}
        style={{
          flex: 1,
          overflow: "auto",
          position: "relative",
          cursor: draftNote ? "default" : "crosshair",
          backgroundImage:
            "radial-gradient(rgba(99, 102, 241, 0.15) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          backgroundColor: "var(--bg)",
        }}
      >
        <div
          style={{
            width: "3000px",
            height: "3000px",
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        ></div>

        {filteredNotes.map((note) => (
          <DraggableItem
            key={note.id}
            initialX={note.x}
            initialY={note.y}
            dragHandleClass="drag-handle"
            onDragEnd={(x, y) => updateDigitalNote(note.id, { x, y })}
          >
            <div
              className="saved-note-card"
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                width: note.width || 320,
                minWidth: "180px",
                height: note.height || "auto",
                minHeight: "100px",
                resize: "both",
                overflow: "hidden",
              }}
            >
              <div
                className="drag-handle"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "rgba(99, 102, 241, 0.04)",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                  cursor: "grab",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <GripHorizontal
                    size={14}
                    color="var(--text-muted)"
                    style={{ opacity: 0.7 }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "var(--accent)",
                      textTransform: "uppercase",
                    }}
                  >
                    {note.topic}
                  </span>
                </div>
                <button
                  className="icon-btn-minimal"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDigitalNote(note.id);
                  }}
                  style={{
                    padding: "4px",
                    color: "var(--danger)",
                    opacity: 0.6,
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              <div
                style={{
                  padding: "14px",
                  flex: 1,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {note.type === "image" && note.imageBase64 && (
                  <img
                    src={note.imageBase64}
                    alt="Pasted"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      border: "1px solid rgba(0,0,0,0.05)",
                      objectFit: "contain",
                    }}
                    draggable="false"
                  />
                )}
                {note.text && (
                  <p
                    style={{
                      fontSize: "15px",
                      margin: 0,
                      color: "#1f2937",
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.6,
                      fontWeight: 500,
                    }}
                  >
                    {note.text}
                  </p>
                )}

                {note.subtopic && (
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "rgba(99, 102, 241, 0.1)",
                        color: "var(--accent)",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      <Tag size={12} /> {note.subtopic}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </DraggableItem>
        ))}

        {draftNote && (
          <DraggableItem
            initialX={draftNote.x}
            initialY={draftNote.y}
            dragHandleClass="drag-handle"
            onDragEnd={(x, y) => setDraftNote({ ...draftNote, x, y })}
          >
            <div
              className="saved-note-card"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "320px",
                padding: "0",
                borderRadius: "16px",
                background: "var(--bg)",
                border: "2px solid var(--accent)",
                boxShadow: "0 24px 48px rgba(99, 102, 241, 0.2)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div
                className="drag-handle"
                style={{
                  background: "var(--accent)",
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "grab",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Edit3 size={14} />{" "}
                  {draftNote.type === "image"
                    ? "Save Image Board"
                    : "Save Text Board"}
                </span>
                <button
                  className="icon-btn-minimal"
                  style={{ color: "#fff" }}
                  onClick={() => setDraftNote(null)}
                >
                  <X size={16} />
                </button>
              </div>

              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="custom-input"
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      fontSize: "13px",
                      fontWeight: 600,
                      background: "rgba(0,0,0,0.02)",
                    }}
                    value={draftNote.topic}
                    onChange={(e) =>
                      setDraftNote({ ...draftNote, topic: e.target.value })
                    }
                  >
                    {NOTE_TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  list={datalistId}
                  type="text"
                  className="custom-input"
                  placeholder="Sub-topic (e.g. Syllogism Rule 2)..."
                  style={{
                    padding: "10px 12px",
                    fontSize: "13px",
                    fontWeight: 600,
                    background: "rgba(0,0,0,0.02)",
                  }}
                  value={draftNote.subtopic}
                  onChange={(e) =>
                    setDraftNote({ ...draftNote, subtopic: e.target.value })
                  }
                />

                {draftNote.type === "image" && draftNote.imageBase64 && (
                  <div
                    style={{
                      border: "1px dashed var(--border)",
                      padding: "4px",
                      borderRadius: "8px",
                      background: "rgba(0,0,0,0.02)",
                    }}
                  >
                    <img
                      src={draftNote.imageBase64}
                      alt="Draft Preview"
                      style={{ width: "100%", borderRadius: "4px" }}
                    />
                  </div>
                )}

                <textarea
                  className="custom-input"
                  placeholder={
                    draftNote.type === "image"
                      ? "Optional description or formula..."
                      : "Start typing your notes here..."
                  }
                  rows="3"
                  style={{
                    padding: "12px",
                    fontSize: "14px",
                    resize: "none",
                    lineHeight: 1.5,
                    background: "rgba(0,0,0,0.02)",
                  }}
                  value={draftNote.text}
                  autoFocus={draftNote.type === "text"}
                  onChange={(e) =>
                    setDraftNote({ ...draftNote, text: e.target.value })
                  }
                />
                <button
                  className="btn"
                  onClick={handleSaveDraft}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "12px",
                    fontSize: "14px",
                    marginTop: "4px",
                  }}
                >
                  <Save size={16} /> Pin to Board
                </button>
              </div>
            </div>
          </DraggableItem>
        )}
      </div>
    </div>
  );
}

function VocabModal({ isOpen, onClose, onSave, initialData = null }) {
  const { selectedDate, notify } = useAppStore();
  const [word, setWord] = useState("");
  const [type, setType] = useState("Vocabulary");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [meaning, setMeaning] = useState("");
  const [synonyms, setSynonyms] = useState("");
  const [antonyms, setAntonyms] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initialData) {
      setWord(initialData.word);
      setType(initialData.type || "Vocabulary");
      setPartOfSpeech(initialData.partOfSpeech || "");
      setMeaning(initialData.meaning || "");
      setSynonyms(initialData.synonyms || "");
      setAntonyms(initialData.antonyms || "");
      setNotes(initialData.notes || "");
    } else {
      setWord("");
      setType("Vocabulary");
      setPartOfSpeech("");
      setMeaning("");
      setSynonyms("");
      setAntonyms("");
      setNotes("");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!word.trim() || !meaning.trim())
      return notify("Word and Meaning required.", "error");
    onSave({
      id: initialData ? initialData.id : Date.now().toString(),
      word,
      type,
      partOfSpeech,
      meaning,
      synonyms,
      antonyms,
      notes,
      dateAdded: initialData ? initialData.dateAdded : selectedDate,
    });
    onClose();
  };
  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "var(--text-main)",
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-card"
        style={{ maxWidth: "550px", width: "90%", padding: "32px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="modal-title"
          style={{ marginBottom: "28px", fontSize: "20px" }}
        >
          {initialData ? "Edit Study Note" : "Custom Study Note"}
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div>
            <label style={labelStyle}>Word / Phrase</label>
            <input
              type="text"
              className="custom-input"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select
              className="custom-input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Vocabulary">Vocabulary</option>
              <option value="Phrasal Verb">Phrasal Verb</option>
              <option value="Idiom">Idiom</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Part of Speech</label>
            <input
              type="text"
              className="custom-input"
              placeholder="noun, verb"
              value={partOfSpeech}
              onChange={(e) => setPartOfSpeech(e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Meaning / Definition</label>
          <textarea
            className="custom-input"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            rows="4"
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div>
            <label style={labelStyle}>Synonyms (comma separated)</label>
            <input
              type="text"
              className="custom-input"
              value={synonyms}
              onChange={(e) => setSynonyms(e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Antonyms (comma separated)</label>
            <input
              type="text"
              className="custom-input"
              value={antonyms}
              onChange={(e) => setAntonyms(e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginBottom: "32px" }}>
          <label style={labelStyle}>Usage Context / Example Sentence</label>
          <textarea
            className="custom-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
          />
        </div>
        <div
          className="modal-actions"
          style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
        >
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" onClick={handleSave}>
            <Save size={16} /> Save Note
          </button>
        </div>
      </div>
    </div>
  );
}

function VocabTracker() {
  const {
    vocab,
    selectedDate,
    requestConfirm,
    addVocabNote,
    updateVocabNote,
    deleteVocabNote,
    premiumData,
    setPremiumData,
  } = useAppStore();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.datamuse.com/sug?s=${encodeURIComponent(query)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.slice(0, 5));
        }
      } catch (e) {}
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async (termToSearch) => {
    const term = termToSearch || query;
    if (!term.trim()) return;
    setIsSearching(true);
    setSearchError("");
    setSearchResult(null);
    setShowSuggestions(false);
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term.trim().toLowerCase())}`,
      );
      if (res.ok) {
        const data = await res.json();
        const entry = data[0];
        let meaningsList = [];
        let synonymsList = [];
        let antonymsList = [];
        let examplesList = [];
        let partsOfSpeechSet = new Set();
        entry.meanings?.forEach((m) => {
          const pos = m.partOfSpeech || "";
          if (pos) partsOfSpeechSet.add(pos);
          if (m.synonyms) synonymsList.push(...m.synonyms);
          if (m.antonyms) antonymsList.push(...m.antonyms);
          const firstDef = m.definitions?.[0]?.definition;
          if (firstDef)
            meaningsList.push(`${pos ? `[${pos}] ` : ""}${firstDef}`);
          m.definitions?.forEach((def) => {
            if (def.example) examplesList.push(def.example);
            if (def.synonyms) synonymsList.push(...def.synonyms);
            if (def.antonyms) antonymsList.push(...def.antonyms);
          });
        });
        let detectedType = "Vocabulary";
        const wordCount = term.trim().split(" ").length;
        if (wordCount > 2) detectedType = "Idiom";
        else if (wordCount === 2) detectedType = "Phrasal Verb";
        setSearchResult({
          word: entry.word || term,
          type: detectedType,
          partOfSpeech: Array.from(partsOfSpeechSet).join(", ") || "word",
          meaning: meaningsList.join("\n") || "No definition found.",
          synonyms: Array.from(new Set(synonymsList)).slice(0, 5).join(", "),
          antonyms: Array.from(new Set(antonymsList)).slice(0, 5).join(", "),
          notes: examplesList[0] ? `"${examplesList[0]}"` : "",
          // audio: entry.phonetics?.find((p) => p.audio)?.audio || "",
        });
      } else
        setSearchError(
          `No direct online entry for "${term}". You can add it manually!`,
        );
    } catch (err) {
      setSearchError("Unable to connect to dictionary API.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveSearchResult = () => {
    if (!searchResult) return;
    addVocabNote({
      id: Date.now().toString(),
      ...searchResult,
      dateAdded: selectedDate,
    });
    setSearchResult(null);
    setQuery("");
  };

  const toggleBookmark = (id) => {
    setPremiumData((prev) => {
      const isBookmarked = prev.bookmarks?.includes(id);
      return {
        ...prev,
        bookmarks: isBookmarked
          ? prev.bookmarks.filter((bId) => bId !== id)
          : [...(prev.bookmarks || []), id],
      };
    });
  };

  let filteredVocab = vocab.filter((v) => v.dateAdded === selectedDate);
  if (filterType === "Bookmarks")
    filteredVocab = vocab.filter((v) => premiumData?.bookmarks?.includes(v.id));
  else if (filterType !== "All")
    filteredVocab = filteredVocab.filter((v) => v.type === filterType);
  const renderPills = (textStr) => {
    if (!textStr) return null;
    return textStr
      .split(",")
      .map((w) => w.trim())
      .filter((w) => w)
      .map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            background: "var(--bg)",
            border: "1px solid var(--border)",
            color: "var(--text-main)",
          }}
        >
          {w}
        </span>
      ));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: "28px" }}>Word Power</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Master vocabulary, idioms, and phrasal verbs with modern cards.
          </p>
        </div>
        <button
          className="btn"
          onClick={() => {
            setEditingNote(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} /> Custom Entry
        </button>
      </div>
      <div
        style={{
          position: "relative",
          marginBottom: "32px",
          maxWidth: "700px",
        }}
      >
        <div
          className="card"
          style={{
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <Search size={20} style={{ color: "var(--accent)" }} />
          <input
            type="text"
            className="custom-input"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "16px",
              padding: "8px 0",
            }}
            placeholder="Type any word, phrasal verb, or idiom..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          {query && (
            <button
              className="icon-btn-minimal"
              onClick={() => {
                setQuery("");
                setSearchResult(null);
                setSearchError("");
              }}
            >
              <X size={18} />
            </button>
          )}
          <button
            className="btn"
            onClick={() => handleSearch()}
            disabled={isSearching}
          >
            {isSearching ? <Loader2 size={16} className="spinner" /> : "Search"}
          </button>
        </div>
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 100,
                marginTop: "8px",
                padding: "8px 0",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }}
            >
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                  className="dash-list-item"
                  onClick={() => {
                    setQuery(s.word);
                    handleSearch(s.word);
                  }}
                >
                  <Search size={14} color="var(--text-muted)" />
                  <span style={{ color: "var(--text-main)" }}>{s.word}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {searchError && (
        <div
          className="card"
          style={{
            marginBottom: "32px",
            borderLeft: "4px solid var(--danger)",
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "var(--text-main)",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {searchError}
          </span>
          <button
            className="btn btn-outline"
            style={{ padding: "6px 12px", fontSize: "13px" }}
            onClick={() => {
              setEditingNote({ word: query, meaning: "", notes: "" });
              setIsModalOpen(true);
            }}
          >
            <Plus size={14} /> Add Custom Entry
          </button>
        </div>
      )}

      {searchResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card"
          style={{
            marginBottom: "32px",
            borderRadius: "20px",
            border: "1px solid var(--border)",
            padding: "28px",
            background: "var(--bg)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "12px",
            }}
          >
            <h2
              style={{
                fontSize: "30px",
                margin: 0,
                fontWeight: 800,
                color: "var(--text-main)",
                letterSpacing: "-0.5px",
              }}
            >
              {searchResult.word}
            </h2>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {/* {searchResult.audio && (
                <button
                  className="icon-btn-minimal"
                  onClick={() => new Audio(searchResult.audio).play()}
                  title="Listen Pronunciation"
                  style={{ color: "var(--accent)" }}
                >
                  <Volume2 size={18} />
                </button>
              )} */}
              <button
                className="btn"
                style={{
                  borderRadius: "12px",
                  padding: "8px 16px",
                  marginLeft: "12px",
                }}
                onClick={handleSaveSearchResult}
              >
                <Plus size={16} /> Save to Cloud
              </button>
            </div>
          </div>
          <div style={{ marginBottom: "24px" }}>
            <span
              style={{
                background: "rgba(99, 102, 241, 0.1)",
                color: "var(--accent)",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "4px 12px",
                borderRadius: "16px",
                letterSpacing: "0.5px",
              }}
            >
              {searchResult.type}
              {searchResult.partOfSpeech
                ? ` • ${searchResult.partOfSpeech}`
                : ""}
            </span>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Meaning
              </span>
              <p
                style={{
                  fontFamily: "serif",
                  fontSize: "17px",
                  lineHeight: "1.6",
                  color: "var(--text-main)",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                }}
              >
                {searchResult.meaning}
              </p>
            </div>
            {(searchResult.synonyms || searchResult.antonyms) && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "24px",
                  marginTop: "12px",
                  paddingTop: "20px",
                  borderTop: "1px dashed var(--border)",
                }}
              >
                {searchResult.synonyms && (
                  <div style={{ flex: 1, minWidth: "150px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Synonyms
                    </span>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                    >
                      {renderPills(searchResult.synonyms)}
                    </div>
                  </div>
                )}
                {searchResult.antonyms && (
                  <div style={{ flex: 1, minWidth: "150px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Antonyms
                    </span>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                    >
                      {renderPills(searchResult.antonyms)}
                    </div>
                  </div>
                )}
              </div>
            )}
            {searchResult.notes && (
              <div
                style={{
                  background: "rgba(99, 102, 241, 0.04)",
                  padding: "16px",
                  borderRadius: "12px",
                  borderLeft: "4px solid var(--accent)",
                  marginTop: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    fontWeight: 700,
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Usage Context
                </span>
                <span
                  style={{
                    fontStyle: "italic",
                    fontSize: "15px",
                    color: "var(--text-main)",
                    lineHeight: "1.5",
                  }}
                >
                  {searchResult.notes}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {["All", "Vocabulary", "Phrasal Verb", "Idiom", "Bookmarks"].map(
          (type) => (
            <button
              key={type}
              className={`btn ${filterType === type ? "" : "btn-outline"}`}
              style={{
                padding: "8px 18px",
                fontSize: "13px",
                borderRadius: "20px",
                fontWeight: filterType === type ? 700 : 500,
              }}
              onClick={() => setFilterType(type)}
            >
              {type === "Bookmarks" && (
                <Bookmark size={14} style={{ marginRight: 6 }} />
              )}{" "}
              {type}
            </button>
          ),
        )}
      </div>

      {filteredVocab.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--text-muted)",
          }}
        >
          <BookMarked
            size={48}
            style={{
              opacity: 0.2,
              margin: "0 auto 16px auto",
              display: "block",
            }}
          />
          <p style={{ fontSize: "15px" }}>
            No saved study notes found in this category.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredVocab.map((item) => {
            const isBookmarked = premiumData?.bookmarks?.includes(item.id);
            return (
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                key={item.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "28px",
                  borderRadius: "20px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                  background: "var(--bg)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isBookmarked && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: "var(--warning)",
                    }}
                  ></div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "28px",
                      margin: 0,
                      fontWeight: 800,
                      color: "var(--text-main)",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {item.word}
                  </h3>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      className="icon-btn-minimal"
                      onClick={() => toggleBookmark(item.id)}
                      title="Bookmark"
                      style={{
                        color: isBookmarked
                          ? "var(--warning)"
                          : "var(--text-muted)",
                      }}
                    >
                      <Bookmark
                        size={18}
                        fill={isBookmarked ? "var(--warning)" : "none"}
                      />
                    </button>
                    <button
                      className="icon-btn-minimal"
                      onClick={() => {
                        setEditingNote(item);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      className="icon-btn-minimal"
                      onClick={() =>
                        requestConfirm("Delete this cloud entry?", () =>
                          deleteVocabNote(item.id),
                        )
                      }
                      style={{ color: "var(--danger)" }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <span
                    style={{
                      background: "rgba(99, 102, 241, 0.1)",
                      color: "var(--accent)",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item.type}
                    {item.partOfSpeech ? ` • ${item.partOfSpeech}` : ""}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    flex: 1,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        fontSize: "11px",
                        display: "block",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                      }}
                    >
                      Meaning
                    </span>
                    <p
                      style={{
                        color: "var(--text-main)",
                        fontFamily: "serif",
                        fontSize: "16px",
                        lineHeight: "1.6",
                        margin: 0,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {item.meaning}
                    </p>
                  </div>
                  {(item.synonyms || item.antonyms) && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "24px",
                        marginTop: "auto",
                        paddingTop: "20px",
                        borderTop: "1px dashed var(--border)",
                      }}
                    >
                      {item.synonyms && (
                        <div style={{ flex: 1, minWidth: "120px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "var(--text-muted)",
                              textTransform: "uppercase",
                              display: "block",
                              marginBottom: "8px",
                            }}
                          >
                            Synonyms
                          </span>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "6px",
                            }}
                          >
                            {renderPills(item.synonyms)}
                          </div>
                        </div>
                      )}
                      {item.antonyms && (
                        <div style={{ flex: 1, minWidth: "120px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "var(--text-muted)",
                              textTransform: "uppercase",
                              display: "block",
                              marginBottom: "8px",
                            }}
                          >
                            Antonyms
                          </span>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "6px",
                            }}
                          >
                            {renderPills(item.antonyms)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {item.notes && (
                    <div
                      style={{
                        marginTop: "8px",
                        background: "rgba(99, 102, 241, 0.04)",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        borderLeft: "3px solid var(--accent)",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--text-main)",
                          fontStyle: "italic",
                        }}
                      >
                        "{item.notes}"
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      <VocabModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(note) =>
          editingNote ? updateVocabNote(note) : addVocabNote(note)
        }
        initialData={editingNote}
      />
    </div>
  );
}

// --- HELPER DRAGGABLE COMPONENT ---
function DraggableItem({
  initialX,
  initialY,
  children,
  onDragEnd,
  dragHandleClass = "drag-handle",
}) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });

  const onPointerDown = (e) => {
    if (dragHandleClass && !e.target.closest(`.${dragHandleClass}`)) return;
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initX: pos.x,
      initY: pos.y,
    };
    e.target.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };
  const onPointerMove = (e) => {
    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({ x: dragRef.current.initX + dx, y: dragRef.current.initY + dy });
  };
  const onPointerUp = (e) => {
    if (!dragRef.current.isDragging) return;
    dragRef.current.isDragging = false;
    e.target.releasePointerCapture(e.pointerId);
    if (onDragEnd) onDragEnd(pos.x, pos.y);
  };
  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        pointerEvents: "auto",
        zIndex: 100,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}
    </div>
  );
}

// --- BACKGROUND NOTIFICATION ENGINE ---
function TimelineNotificationEngine() {
  const { history, settings } = useAppStore();
  const [notified, setNotified] = useState(new Set());

  useEffect(() => {
    if (!settings?.notifications && !settings?.audio) return;
    const interval = setInterval(() => {
      const now = new Date();
      const todayStr = getFormattedDateStr(now);
      const currentHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const todaysHistory = history[todayStr];
      if (!todaysHistory || !todaysHistory.timeline) return;

      todaysHistory.timeline.forEach((task) => {
        if (task.time === currentHHMM) {
          const taskId = `${todayStr}-${task.time}-${task.activity}`;
          if (!notified.has(taskId)) {
            triggerSystemNotification(
              "Study Block Started",
              `${task.time} - ${task.activity}`,
              settings,
            );
            setNotified((prev) => new Set(prev).add(taskId));
          }
        }
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [history, settings, notified]);
  return null;
}

// --- READING TIMER ENDED POPUP MODAL ---
function ReadingTimerModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ zIndex: 100000, backdropFilter: "blur(6px)" }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="modal-card"
        style={{
          textAlign: "center",
          padding: "36px 28px",
          maxWidth: "420px",
          width: "90%",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.12)",
            color: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
          }}
        >
          <BellRing size={30} />
        </div>
        <h3
          style={{
            fontSize: "22px",
            fontWeight: 800,
            margin: "0 0 10px 0",
            color: "var(--text-main)",
          }}
        >
          Reading Time's Up!
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            margin: "0 0 28px 0",
            lineHeight: 1.5,
          }}
        >
          Your fast-reading session is complete. Take a quick break or proceed
          to note down your takeaways!
        </p>
        <button
          className="btn"
          style={{
            width: "100%",
            justifyContent: "center",
            padding: "12px",
            fontSize: "14px",
            fontWeight: 700,
          }}
          onClick={onClose}
        >
          Continue Reading
        </button>
      </motion.div>
    </div>
  );
}

function AuthModal() {
  const { loginWithUsername, signUpWithUsername, notify, setActiveView } =
    useAppStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Privacy & Captcha States
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const canvasRef = useRef(null);

  // Captcha Generator Engine
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    setCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
  }, [isSignUp]);

  useEffect(() => {
    if (!canvasRef.current || !captchaText) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(99, 102, 241, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw interference lines
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    // Draw interference dots
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1.5,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = "rgba(99, 102, 241, 0.4)";
      ctx.fill();
    }
    // Draw skewed text
    ctx.font = "bold 24px monospace";
    ctx.fillStyle = "var(--text-main)";
    ctx.setTransform(1, -0.05, 0.1, 1, 0, 0);
    ctx.fillText(captchaText, 25, 32);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [captchaText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim().length < 3)
      return notify("Aspirant ID must be at least 3 characters.", "error");

    // --- CAPTCHA VALIDATION ---
    if (captchaInput !== captchaText) {
      notify("Invalid Security CAPTCHA. Please try again.", "error");
      generateCaptcha();
      return;
    }

    // --- SIGN UP RESTRICTIONS ---
    if (isSignUp) {
      // Strong Password Check (8+ chars, upper, lower, number, special)
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!strongPasswordRegex.test(password)) {
        return notify(
          "Weak Password! Must be 8+ chars and include an uppercase letter, a number, and a special character (@$!%*?&).",
          "error",
        );
      }
      // Privacy Check
      if (!privacyAccepted) {
        return notify(
          "You must read and accept the Privacy Guidelines to create an account.",
          "error",
        );
      }
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithUsername(username, password);
        notify("Account created securely! Logging in...", "success");
        await loginWithUsername(username, password);
        setActiveView("dashboard");
      } else {
        // Multi-Login Client Notification
        if (localStorage.getItem("active_session_token")) {
          notify("Terminating previous active sessions...", "info");
        }
        await loginWithUsername(username, password);
        notify(`Welcome back, ${username}!`, "success");
        setActiveView("dashboard");
      }
    } catch (err) {
      notify(
        err.message || "Authentication failed. Check credentials.",
        "error",
      );
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{ zIndex: 999, backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="modal-card"
        style={{
          maxWidth: "440px",
          width: "90%",
          padding: "32px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            className="icon-wrap"
            style={{
              margin: "0 auto 12px auto",
              width: "48px",
              height: "48px",
              background: "rgba(99, 102, 241, 0.1)",
              color: "var(--accent)",
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <h2 style={{ fontSize: "22px", margin: "0 0 6px 0" }}>
            {isSignUp ? "Secure Aspirant Registration" : "Aspirant Login"}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Aspirant ID / Username
            </label>
            <div style={{ position: "relative" }}>
              <User
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="text"
                className="custom-input"
                style={{ paddingLeft: "36px" }}
                placeholder="e.g. Aspirant_Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Key
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="password"
                className="custom-input"
                style={{ paddingLeft: "36px" }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* CAPTCHA SECTION */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Security Verification
            </label>
            <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
              <canvas
                ref={canvasRef}
                width="140"
                height="45"
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  background: "var(--bg)",
                }}
              />
              <button
                type="button"
                className="icon-btn-minimal"
                onClick={generateCaptcha}
                title="Refresh CAPTCHA"
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "0 14px",
                }}
              >
                <RotateCcw size={16} />
              </button>
            </div>
            <input
              type="text"
              className="custom-input"
              placeholder="Enter the text shown above"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
            />
          </div>

          {/* PRIVACY GUIDELINES (SIGN-UP ONLY) - UPDATED WITH EXPLICIT STORAGE BREAKDOWN */}
          {isSignUp && (
            <div
              style={{
                marginTop: "4px",
                background: "rgba(0,0,0,0.02)",
                border: "1px solid var(--border)",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              <h4
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  marginBottom: "6px",
                  color: "var(--text-main)",
                }}
              >
                Privacy & Data Guidelines
              </h4>
              <ul
                style={{
                  margin: "0 0 10px 16px",
                  padding: 0,
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                <li>
                  <strong style={{ color: "var(--text-main)" }}>
                    Cloud Storage (Synced):
                  </strong>{" "}
                  Your Dictionary terms, Smart Canvas Notes, and PDF Takeaways
                  are securely synced to our cloud database.
                </li>
                <li>
                  <strong style={{ color: "var(--text-main)" }}>
                    Local Storage (Private):
                  </strong>{" "}
                  Your Daily Timelines, Habit Tracking, and Mock Test scores
                  never leave your browser memory. They will not sync across
                  devices.
                </li>
                {/* <li>
                  <strong style={{ color: "var(--text-main)" }}>
                    Session Limits:
                  </strong>{" "}
                  To protect integrity, multiple simultaneous logins are
                  prohibited. New logins automatically terminate older sessions.
                </li> */}
              </ul>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  paddingTop: "8px",
                  borderTop: "1px dashed var(--border)",
                }}
              >
                <input
                  type="checkbox"
                  className="custom-checkbox-check"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                />
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--text-main)",
                    fontWeight: 600,
                  }}
                >
                  I accept the Privacy Guidelines & Storage Policies.
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              justifyContent: "center",
            }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="spinner" size={18} />
            ) : isSignUp ? (
              "Sign Up Securely"
            ) : (
              "Log In Securely"
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "13px",
            color: "var(--text-muted)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div>
            {isSignUp
              ? "Already have an Aspirant ID?"
              : "Don't have an Aspirant ID yet?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
              }}
            >
              {isSignUp ? "Log In" : "Create Account"}
            </button>
          </div>
          {/* {!isSignUp && (
            <div style={{ fontSize: "11px", opacity: 0.7 }}>
              Authorized Admin Access? Enter existing Admin ID to review notes &
              PDFs.
            </div>
          )} */}
        </div>
      </motion.div>
    </div>
  );
}

function GlobalSearchModal({ isOpen, onClose }) {
  const { vocab } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  if (!isOpen) return null;
  const results = [];
  if (searchTerm.length > 2) {
    const lower = searchTerm.toLowerCase();
    vocab?.forEach((v) => {
      if (
        v.word.toLowerCase().includes(lower) ||
        v.meaning.toLowerCase().includes(lower)
      ) {
        results.push({
          type: "Vocab/Dictionary",
          text: v.word,
          sub: v.meaning,
        });
      }
    });
  }
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ zIndex: 99999, backdropFilter: "blur(4px)" }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="modal-card"
        style={{ maxWidth: 600, width: "90%", marginTop: "10vh", padding: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Search size={20} color="var(--accent)" />
          <input
            autoFocus
            type="text"
            placeholder="Search vocabulary, notes, or tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "18px",
              background: "transparent",
              color: "var(--text-main)",
            }}
          />
          <button className="icon-btn-minimal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div style={{ maxHeight: "400px", overflowY: "auto", padding: "12px" }}>
          {results.length === 0 && searchTerm.length > 2 && (
            <p
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                padding: "20px",
              }}
            >
              No results found.
            </p>
          )}
          {results.map((r, i) => (
            <div
              key={i}
              className="dash-list-item"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 4,
                padding: "12px 16px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--accent)",
                  fontWeight: 600,
                }}
              >
                {r.type}
              </div>
              <div style={{ fontSize: "16px", fontWeight: 500 }}>{r.text}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {r.sub}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function PomodoroTimer() {
  const { setPremiumData, settings } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState(25);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0)
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    else if (isActive && timeLeft === 0) {
      setIsActive(false);
      triggerSystemNotification(
        "Focus Timer Finished!",
        `You completed a ${mode} minute session. Time for a quick break!`,
        settings,
      );
      setPremiumData((prev) => ({
        ...prev,
        totalStudyMinutes: prev.totalStudyMinutes + mode,
      }));
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, settings]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode * 60);
  };
  const changeMode = (m) => {
    setIsActive(false);
    setMode(m);
    setTimeLeft(m * 60);
  };
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 9000 }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="card"
            style={{
              marginBottom: "16px",
              width: "300px",
              padding: "20px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              backdropFilter: "blur(10px)",
              background: "var(--bg)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h4
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  margin: 0,
                }}
              >
                <Timer size={18} color="var(--accent)" /> Focus Timer
              </h4>
              <button
                className="icon-btn-minimal"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "20px",
                justifyContent: "center",
              }}
            >
              {[25, 45, 60].map((m) => (
                <button
                  key={m}
                  onClick={() => changeMode(m)}
                  className={`btn ${mode === m ? "" : "btn-outline"}`}
                  style={{
                    padding: "4px 12px",
                    fontSize: "12px",
                    borderRadius: "20px",
                  }}
                >
                  {m}m
                </button>
              ))}
            </div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: "800",
                textAlign: "center",
                fontFamily: "monospace",
                color: "var(--text-main)",
                marginBottom: "20px",
                letterSpacing: "2px",
              }}
            >
              {formatTime(timeLeft)}
            </div>
            <div
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <button
                onClick={toggleTimer}
                className="btn"
                style={{
                  flex: 1,
                  padding: "10px",
                  background: isActive ? "var(--warning)" : "var(--secondary)",
                  color: "white",
                }}
              >
                {isActive ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={resetTimer}
                className="btn btn-outline"
                style={{ padding: "10px" }}
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "var(--accent)",
          color: "white",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
          cursor: "pointer",
          float: "right",
        }}
      >
        <Timer size={24} />
      </motion.button>
    </div>
  );
}

function ToastContainer() {
  const { toasts } = useAppStore();
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            key={t.id}
            className={`toast ${t.type}`}
          >
            <div className="toast-icon">
              {t.type === "success" && <CheckCircle2 size={16} />}
              {t.type === "error" && <AlertCircle size={16} />}
              {t.type === "info" && <Lightbulb size={16} />}
            </div>
            <span className="toast-message">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ConfirmModal() {
  const { confirmDialog, closeConfirm } = useAppStore();
  if (!confirmDialog.isOpen) return null;
  return (
    <div
      className="modal-overlay"
      onClick={closeConfirm}
      style={{ zIndex: 10000 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="modal-title">Confirmation Required</h3>
        <p className="modal-message">{confirmDialog.message}</p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={closeConfirm}>
            Cancel
          </button>
          <button
            className="btn"
            onClick={() => {
              confirmDialog.onConfirm();
              closeConfirm();
            }}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Header({ toggleSidebar, onOpenSearch }) {
  const { theme, setTheme, selectedDate, setSelectedDate, user, logout } =
    useAppStore();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);
  const todayStr = getFormattedDateStr();
  const displayName = user?.user_metadata?.display_username || "Aspirant";

  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn mobile-menu-btn" onClick={toggleSidebar}>
          <Menu size={18} />
        </button>
        <div className="date-picker-wrap">
          <Calendar size={16} style={{ color: "var(--text-muted)" }} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        {selectedDate !== todayStr && (
          <button
            className="btn btn-outline hide-on-mobile"
            style={{ padding: "8px 12px", fontSize: "13px" }}
            onClick={() => setSelectedDate(todayStr)}
          >
            Today
          </button>
        )}
      </div>
      <div className="header-right">
        <div
          className="btn btn-outline hide-on-mobile"
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            gap: "6px",
            borderColor: "rgba(99, 102, 241, 0.3)",
            pointerEvents: "none",
          }}
        >
          <User size={14} color="var(--accent)" />
          <span>{displayName}</span>
        </div>
        <button
          className="btn btn-outline hide-on-mobile"
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            padding: "6px 12px",
            fontSize: "12px",
            background: "var(--bg)",
            border: "1px solid var(--border)",
          }}
          onClick={onOpenSearch}
        >
          <Search size={14} /> Search (Ctrl+K)
        </button>
        <div className="clock hide-on-mobile">{time}</div>
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="icon-btn" onClick={logout} title="Sign Out">
          <LogOut size={18} color="var(--danger)" />
        </button>
      </div>
    </header>
  );
}

function UpcomingExamsWidget() {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case "IBPS":
        return { bg: "rgba(236, 72, 153, 0.1)", text: "#ec4899" };
      case "RRB":
        return { bg: "rgba(16, 185, 129, 0.1)", text: "#10b981" };
      case "SBI":
        return { bg: "rgba(99, 102, 241, 0.1)", text: "var(--accent)" };
      default:
        return { bg: "rgba(245, 158, 11, 0.1)", text: "#f59e0b" };
    }
  };
  return (
    <div
      className="card"
      style={{ padding: "0", overflow: "hidden", marginBottom: "32px" }}
    >
      <div
        style={{
          padding: "20px",
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.05), rgba(236,72,153,0.05))",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CalendarDays size={20} color="var(--accent)" /> UPCOMING EXAMS 2026
        </h3>
      </div>
      <div
        style={{ maxHeight: "360px", overflowY: "auto", padding: "12px 20px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
            paddingBottom: "16px",
          }}
        >
          {upcomingExamsList.map((exam, i) => {
            const colors = getCategoryColor(exam.category);
            return (
              <motion.div
                whileHover={{ scale: 1.02 }}
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                }}
              >
                <div>
                  <h4
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "15px",
                      fontWeight: 600,
                    }}
                  >
                    {exam.name}
                  </h4>
                  <span
                    style={{
                      background: colors.bg,
                      color: colors.text,
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {exam.category}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "var(--text-main)",
                    }}
                  >
                    {exam.date}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      marginTop: "4px",
                    }}
                  >
                    Expected
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div
          style={{
            borderTop: "1px dashed var(--border)",
            paddingTop: "20px",
            marginTop: "8px",
          }}
        >
          <h4
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <BellRing size={14} /> Expected Notifications (Not Confirmed)
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {expectedNotifications.map((notif, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 12px",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {notif}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VocabQuiz() {
  const { vocab, selectedDate, notify, premiumData } = useAppStore();
  const [quizState, setQuizState] = useState("idle");
  const [quizMode, setQuizMode] = useState("daily");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [scoreThisRound, setScoreThisRound] = useState(0);

  const startQuiz = async (overrideMode) => {
    const modeToUse =
      typeof overrideMode === "string" ? overrideMode : quizMode;
    let pool = [];
    if (modeToUse === "bookmarks") {
      pool = vocab.filter((v) => premiumData?.bookmarks?.includes(v.id));
      pool = shuffleArray(pool);
    } else if (modeToUse === "weekly") {
      const sevenDaysAgo = new Date(selectedDate);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const cutoff = getFormattedDateStr(sevenDaysAgo);
      pool = vocab.filter(
        (v) => v.dateAdded >= cutoff && v.dateAdded <= selectedDate,
      );
      if (pool.length < 4)
        pool = vocab.filter((v) => v.dateAdded <= selectedDate);
      pool = shuffleArray(pool);
    } else {
      pool = vocab.filter((v) => v.dateAdded && v.dateAdded <= selectedDate);
    }

    const selectedWords = pool.slice(0, modeToUse === "daily" ? 15 : 50);
    if (selectedWords.length < 4)
      return notify(`Need at least 4 saved words to generate a quiz!`, "error");

    setQuizState("generating");
    let generatedQs = [];
    for (let target of selectedWords) {
      let correctOption = target.meaning;
      let distractors = shuffleArray(vocab.filter((v) => v.id !== target.id))
        .slice(0, 3)
        .map((v) => v.meaning);
      generatedQs.push({
        targetId: target.id,
        targetWord: target.word,
        targetMeaning: target.meaning,
        questionText: `What is the precise meaning of:\n\n"${target.word}"?`,
        options: shuffleArray([correctOption, ...distractors]),
        correctOption,
      });
    }
    setQuestions(generatedQs);
    setCurrentIndex(0);
    setScoreThisRound(0);
    setQuizState("playing");
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const handleOptionClick = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === questions[currentIndex].correctOption)
      setScoreThisRound((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      setQuizState("finished");
    }
  };

  if (quizState === "idle") {
    return (
      <div
        className="card"
        style={{
          marginBottom: "32px",
          background: "linear-gradient(135deg, var(--primary), var(--accent))",
          color: "white",
          padding: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h2
            style={{
              fontSize: "22px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Zap size={24} color="#facc15" /> Smart Revision Quiz
          </h2>
          <p
            style={{
              opacity: 0.9,
              fontSize: "14px",
              maxWidth: "500px",
              lineHeight: "1.5",
            }}
          >
            Test your memory based on your cloud-synced dictionary terms.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
            maxWidth: "220px",
          }}
        >
          <select
            className="custom-input"
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "none",
              fontWeight: 600,
            }}
            value={quizMode}
            onChange={(e) => setQuizMode(e.target.value)}
          >
            <option value="daily" style={{ color: "black" }}>
              Daily SR Quiz (15 Qs)
            </option>
            <option value="weekly" style={{ color: "black" }}>
              Weekly Revision (50 Qs)
            </option>
            <option value="bookmarks" style={{ color: "black" }}>
              Bookmarked Only
            </option>
          </select>
          <button
            className="btn"
            style={{
              background: "white",
              color: "var(--primary)",
              fontSize: "15px",
              padding: "12px 24px",
              borderRadius: "30px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              width: "100%",
            }}
            onClick={() => startQuiz()}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizState === "finished") {
    return (
      <div
        className="card"
        style={{
          marginBottom: "32px",
          textAlign: "center",
          padding: "40px 20px",
        }}
      >
        <Trophy
          size={48}
          color="var(--warning)"
          style={{ margin: "0 auto 16px auto" }}
        />
        <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>
          Quiz Completed!
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
          You scored {scoreThisRound} out of {questions.length} on your
          revision.
        </p>
        <button className="btn" onClick={() => setQuizState("idle")}>
          Close Revision
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  return (
    <div
      className="card"
      style={{
        marginBottom: "32px",
        borderTop: "4px solid var(--accent)",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
          fontSize: "13px",
          color: "var(--text-muted)",
          fontWeight: "600",
        }}
      >
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>
      <h3
        style={{
          fontSize: "17px",
          lineHeight: "1.7",
          marginBottom: "24px",
          whiteSpace: "pre-wrap",
          color: "var(--text-main)",
          fontWeight: "500",
        }}
      >
        {currentQ?.questionText}
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {currentQ?.options.map((opt, i) => {
          let btnStyle = {
            textAlign: "left",
            padding: "14px 16px",
            fontSize: "14px",
            fontWeight: "500",
            whiteSpace: "pre-wrap",
            lineHeight: "1.5",
          };
          let btnClass = "btn btn-outline";
          if (isAnswered) {
            if (opt === currentQ.correctOption) {
              btnClass = "btn";
              btnStyle.background = "var(--secondary)";
              btnStyle.color = "white";
            } else if (opt === selectedOption) {
              btnClass = "btn";
              btnStyle.background = "var(--danger)";
              btnStyle.color = "white";
            }
          }
          return (
            <button
              key={i}
              className={btnClass}
              style={btnStyle}
              onClick={() => handleOptionClick(opt)}
              disabled={isAnswered}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {isAnswered && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn" onClick={handleNext}>
            {currentIndex < questions.length - 1
              ? "Next Question"
              : "Finish Quiz"}{" "}
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function Dashboard({ history }) {
  const { user, selectedDate, updateHistory, notify } = useAppStore();
  const [newMissed, setNewMissed] = useState("");

  const totalTasks = history.timeline?.length || 0;
  const completedTasks = history.timeline?.filter((t) => t.checked).length || 0;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  const dailyStudy = calculateStudyMinutes(history.timeline);
  const dailyCompletedHours = (dailyStudy.completedMins / 60).toFixed(1);
  const dailyTargetHours = (dailyStudy.targetMins / 60).toFixed(1);

  const addMissed = () => {
    if (newMissed.trim()) {
      updateHistory({
        missedTasks: [
          ...(history.missedTasks || []),
          { text: newMissed, checked: false },
        ],
      });
      setNewMissed("");
      notify("Task added to backlog", "info");
    }
  };
  const toggleMissed = (index) => {
    const updated = (history.missedTasks || []).map((t, i) =>
      i === index ? { ...t, checked: !t.checked } : t,
    );
    updateHistory({ missedTasks: updated });
  };
  const userName = user?.user_metadata?.display_username || "Aspirant";

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h1>Welcome back, {userName}.</h1>
          <p>
            Here is your overview for{" "}
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
      <VocabQuiz />
      <div className="grid-3" style={{ marginBottom: "32px" }}>
        <div className="card stat-card">
          <div
            className="icon-wrap"
            style={{
              background: "rgba(16, 185, 129, 0.1)",
              color: "var(--secondary)",
            }}
          >
            <Clock size={24} />
          </div>
          <h3>{dailyCompletedHours}h</h3>
          <p>Daily Study (Target: {dailyTargetHours}h)</p>
        </div>
        <div className="card stat-card">
          <div className="icon-wrap">
            <CheckSquare size={24} />
          </div>
          <h3>
            {completedTasks}/{totalTasks}
          </h3>
          <p>Tasks Completed</p>
        </div>
        <div className="card stat-card">
          <div
            className="icon-wrap"
            style={{
              background: "rgba(245, 158, 11, 0.1)",
              color: "var(--warning)",
            }}
          >
            <Award size={24} />
          </div>
          <h3>{Math.round(progress)}%</h3>
          <p>Overall Day Progress</p>
        </div>
      </div>
      <UpcomingExamsWidget />
      <div className="grid-2">
        <div
          className="card"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <h3 style={{ marginBottom: "16px", fontSize: "18px" }}>
            Timeline Status
          </h3>
          <div
            style={{
              height: "8px",
              background: "var(--bg)",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "var(--secondary)",
                transition: "width 0.8s",
              }}
            ></div>
          </div>
          <div
            className="scroll-area"
            style={{ flex: 1, overflowY: "auto", maxHeight: "300px" }}
          >
            {history.timeline?.map((t, i) => (
              <div
                key={i}
                className={`dash-list-item ${t.checked ? "checked" : ""}`}
              >
                {t.checked ? (
                  <CheckCircle2 size={16} color="var(--secondary)" />
                ) : (
                  <Circle size={16} color="var(--text-muted)" />
                )}
                <span>{t.time}</span>{" "}
                <ArrowRight size={14} color="var(--border)" /> {t.activity}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            className="card"
            style={{ display: "flex", flexDirection: "column", flex: 1 }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "18px" }}>
              Daily Backlog
            </h3>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <input
                type="text"
                className="custom-input"
                placeholder="Add a backlog task..."
                value={newMissed}
                onChange={(e) => setNewMissed(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addMissed()}
              />
              <button className="btn" onClick={addMissed}>
                Add
              </button>
            </div>
            <div
              className="scroll-area"
              style={{ flex: 1, overflowY: "auto", maxHeight: "160px" }}
            >
              {history.missedTasks?.map((t, i) => (
                <div
                  key={i}
                  className="missed-task-item"
                  style={{ opacity: t.checked ? 0.5 : 1 }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={t.checked}
                      onChange={() => toggleMissed(i)}
                    />
                    <span
                      style={{
                        textDecoration: t.checked ? "line-through" : "none",
                      }}
                    >
                      {t.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="card"
            style={{ display: "flex", flexDirection: "column", padding: "0" }}
          >
            <div
              style={{
                background: "rgba(99, 102, 241, 0.03)",
                padding: "20px 24px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Edit3 size={18} color="var(--accent)" /> Daily Journal
              </h3>
            </div>
            <textarea
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                resize: "vertical",
                minHeight: "120px",
                padding: "24px",
                outline: "none",
              }}
              placeholder="Reflect on your day..."
              value={history.notes || ""}
              onChange={(e) => updateHistory({ notes: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DailyPlan({ timeline }) {
  const { updateHistory, notify, vocab, selectedDate, user } = useAppStore();
  const reportRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = timeline.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    updateHistory({ timeline: updated });
  };

  const deleteTask = (index) => {
    updateHistory({ timeline: timeline.filter((_, i) => i !== index) });
    notify("Task removed", "info");
  };

  const addTask = () => {
    updateHistory({
      timeline: [
        ...timeline,
        {
          time: "12:00",
          activity: "New Custom Task",
          checked: false,
          notes: "",
          isStudy: true,
        },
      ],
    });
  };

  // Ultra-Clear "Off-Screen to Image" Generator
  const generateDailyReportImage = async () => {
    if (!reportRef.current) return;
    try {
      setIsGenerating(true);
      notify("Capturing high-resolution report...", "info");

      // We explicitly capture the full scrollHeight to prevent clipping
      const targetElement = reportRef.current;
      const originalHeight = targetElement.style.height;
      targetElement.style.height = "max-content"; // Force expansion

      const dataUrl = await htmlToImage.toPng(targetElement, {
        pixelRatio: 2, // 2x resolution for retina-crisp text
        backgroundColor: "#f1f5f9",
        width: 1400, // Fixed wide canvas
      });

      // Restore original style
      targetElement.style.height = originalHeight;

      const link = document.createElement("a");
      link.download = `IBPS_Planner_Report_${selectedDate}.png`;
      link.href = dataUrl;
      link.click();

      notify("Report downloaded successfully!", "success");
    } catch (err) {
      console.error(err);
      notify("Failed to generate image.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Data Aggregation
  const studySessions = timeline.filter((t) => t.isStudy);
  const completedStudy = studySessions.filter((t) => t.checked);
  const wordsLearned = vocab.filter((v) => v.dateAdded === selectedDate);
  const dailyStudy = calculateStudyMinutes(timeline);
  const completedHrs = (dailyStudy.completedMins / 60).toFixed(1);
  const targetHrs = (dailyStudy.targetMins / 60).toFixed(1);
  const completionRate =
    studySessions.length > 0
      ? Math.round((completedStudy.length / studySessions.length) * 100)
      : 0;
  const userName = user?.user_metadata?.display_username || "Aspirant";

  // Filter for report: Include only tasks that are both completed AND marked as a study session (no breaktimes)
  const completedTasksForReport = timeline.filter(
    (t) => t.checked && t.isStudy,
  );

  return (
    <div>
      {/* UI HEADER */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: "28px" }}>Daily Timeline</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Structure and execute your study routine block by block.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            className="btn"
            style={{
              background: "linear-gradient(135deg, #1e293b, #0f172a)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 15px rgba(15, 23, 42, 0.2)",
            }}
            onClick={generateDailyReportImage}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="spinner" size={16} />
            ) : (
              <Download size={16} />
            )}
            {isGenerating ? "Processing..." : "Export Image"}
          </button>
          <button className="btn" onClick={addTask}>
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>

      {/* TIMELINE UI LIST */}
      <div
        style={{
          position: "relative",
          paddingLeft: "16px",
          marginTop: "24px",
          maxWidth: "800px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "28px",
            top: "10px",
            bottom: "10px",
            width: "3px",
            background: "var(--border)",
            borderRadius: "3px",
          }}
        ></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {timeline?.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
                opacity: item.checked ? 0.6 : 1,
              }}
            >
              <div
                onClick={() => handleChange(i, "checked", !item.checked)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: item.checked ? "var(--secondary)" : "var(--bg)",
                  border: `2px solid ${item.checked ? "var(--secondary)" : "var(--border)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 2,
                  transition: "all 0.2s ease",
                }}
              >
                {item.checked && <CheckCircle2 size={16} color="white" />}
              </div>
              <div
                className="card"
                style={{
                  flex: 1,
                  padding: "16px 20px",
                  borderLeft: `4px solid ${item.isStudy ? "var(--accent)" : "var(--warning)"}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flex: 1,
                    }}
                  >
                    <input
                      type="time"
                      value={item.time}
                      onChange={(e) => handleChange(i, "time", e.target.value)}
                      style={{
                        background: "rgba(99, 102, 241, 0.08)",
                        border: "none",
                        color: "var(--text-main)",
                        fontWeight: 600,
                        padding: "6px 10px",
                        borderRadius: "8px",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    />
                    <input
                      type="text"
                      value={item.activity}
                      onChange={(e) =>
                        handleChange(i, "activity", e.target.value)
                      }
                      style={{
                        border: "none",
                        fontWeight: 600,
                        flex: 1,
                        marginLeft: "12px",
                        background: "transparent",
                        color: item.checked
                          ? "var(--text-muted)"
                          : "var(--text-main)",
                        textDecoration: item.checked ? "line-through" : "none",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <button
                      onClick={() => handleChange(i, "isStudy", !item.isStudy)}
                      style={{
                        background: item.isStudy
                          ? "rgba(99, 102, 241, 0.1)"
                          : "rgba(245, 158, 11, 0.1)",
                        color: item.isStudy
                          ? "var(--accent)"
                          : "var(--warning)",
                        border: "none",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {item.isStudy ? (
                        <BookOpen size={12} />
                      ) : (
                        <Coffee size={12} />
                      )}{" "}
                      {item.isStudy ? "Study Session" : "Break"}
                    </button>
                    <button
                      className="icon-btn-minimal"
                      onClick={() => deleteTask(i)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "var(--bg)",
                    borderRadius: "8px",
                    padding: "0 12px",
                    marginTop: "12px",
                  }}
                >
                  <FileText size={14} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Add specific notes, targets, or links for this block..."
                    value={item.notes}
                    onChange={(e) => handleChange(i, "notes", e.target.value)}
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      padding: "10px",
                      fontSize: "13px",
                      color: "var(--text-main)",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- INVISIBLE DOM ELEMENT FOR HIGH-RES IMAGE GENERATION --- */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "-9999px",
          zIndex: -1,
        }}
      >
        <div
          ref={reportRef}
          style={{
            width: "1400px",
            minHeight: "1000px",
            padding: "60px",
            background: "#f1f5f9",
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#0f172a",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              borderRadius: "24px",
              padding: "40px 56px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "white",
              marginBottom: "40px",
              boxShadow: "0 20px 40px -10px rgba(15, 23, 42, 0.4)",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "44px",
                  fontWeight: 800,
                  margin: "0 0 12px 0",
                  letterSpacing: "-1px",
                }}
              >
                IBPS Planner PRO
              </h1>
              <p
                style={{
                  margin: 0,
                  color: "#94a3b8",
                  fontSize: "20px",
                  fontWeight: 500,
                }}
              >
                Daily Execution & Vocabulary Analytics Profile
              </p>
            </div>
            <div
              style={{
                textAlign: "right",
                background: "rgba(255,255,255,0.1)",
                padding: "20px 32px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#38bdf8",
                  marginBottom: "8px",
                }}
              >
                {selectedDate}
              </div>
              <div
                style={{
                  fontSize: "16px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#cbd5e1",
                  fontWeight: 700,
                }}
              >
                Aspirant: {userName}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "32px",
              marginBottom: "48px",
            }}
          >
            {[
              {
                label: "Study Time",
                val: `${completedHrs}`,
                sub: `/ ${targetHrs}h`,
              },
              {
                label: "Sessions Completed",
                val: `${completedStudy.length}`,
                sub: `/ ${studySessions.length}`,
              },
              { label: "Completion Rate", val: `${completionRate}%`, sub: "" },
              {
                label: "New Words Mastered",
                val: wordsLearned.length,
                sub: "",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  background: "white",
                  padding: "32px",
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 20px -5px rgba(0,0,0,0.05)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 800,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "12px",
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: "44px",
                    fontWeight: 800,
                    color: idx === 0 || idx === 3 ? "#6366f1" : "#0f172a",
                  }}
                >
                  {stat.val}{" "}
                  <span
                    style={{
                      fontSize: "22px",
                      color: "#94a3b8",
                      fontWeight: 600,
                    }}
                  >
                    {stat.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Two Column Content */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "48px",
              alignItems: "start",
            }}
          >
            {/* Left Column: Timeline */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: "28px",
                  borderBottom: "3px solid #e2e8f0",
                  paddingBottom: "16px",
                }}
              >
                ✅ Completed Tasks
              </h2>
              {completedTasksForReport.length === 0 ? (
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "20px",
                    fontStyle: "italic",
                  }}
                >
                  No tasks completed yet.
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {completedTasksForReport.map((s, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "white",
                        padding: "24px",
                        borderRadius: "16px",
                        border: "1px solid #e2e8f0",
                        borderLeft: "8px solid #10b981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                        }}
                      >
                        <div
                          style={{
                            background: "#f1f5f9",
                            color: "#475569",
                            padding: "10px 18px",
                            borderRadius: "10px",
                            fontWeight: 800,
                            fontSize: "18px",
                          }}
                        >
                          {s.time}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "22px",
                              fontWeight: 800,
                              color: "#1e293b",
                            }}
                          >
                            {s.activity}
                          </div>
                          {s.notes && (
                            <div
                              style={{
                                fontSize: "16px",
                                color: "#475569",
                                marginTop: "8px",
                                fontWeight: 500,
                              }}
                            >
                              📝 {s.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          background: "#dcfce7",
                          color: "#15803d",
                          padding: "10px 20px",
                          borderRadius: "30px",
                          fontSize: "15px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Done
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Vocab */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: "28px",
                  borderBottom: "3px solid #e2e8f0",
                  paddingBottom: "16px",
                }}
              >
                🧠 Vocabulary Mastered
              </h2>
              {wordsLearned.length === 0 ? (
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "20px",
                    fontStyle: "italic",
                  }}
                >
                  No vocabulary logged today.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {wordsLearned.map((v, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "linear-gradient(145deg, #ffffff, #f8fafc)",
                        padding: "24px",
                        borderRadius: "20px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "4px",
                          background:
                            "linear-gradient(90deg, #6366f1, #a855f7)",
                        }}
                      ></div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "16px",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: 800,
                            color: "#0f172a",
                            lineHeight: 1.2,
                            wordBreak: "break-word",
                          }}
                        >
                          {v.word}
                        </div>
                        {/* <div
                          style={{
                            background: "rgba(99, 102, 241, 0.1)",
                            color: "#4f46e5",
                            padding: "6px 12px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            flexShrink: 0,
                          }}
                        >
                          {v.type || "Vocabulary"}
                        </div> */}
                      </div>
                      {/* <div
                        style={{
                          fontSize: "16px",
                          color: "#334155",
                          lineHeight: 1.6,
                          fontWeight: 500,
                        }}
                      >
                        {v.meaning}
                      </div> */}

                      {/* SYNONYMS AND ANTONYMS SECTION ADDED HERE */}
                      {(v.synonyms || v.antonyms) && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "12px",
                            marginTop: "16px",
                            paddingTop: "12px",
                            borderTop: "1px dashed #cbd5e1",
                          }}
                        >
                          {v.synonyms && (
                            <div style={{ flex: 1, minWidth: "100px" }}>
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 800,
                                  color: "#64748b",
                                  textTransform: "uppercase",
                                }}
                              >
                                Synonyms
                              </span>
                              <div
                                style={{
                                  fontSize: "14px",
                                  color: "#334155",
                                  fontWeight: 600,
                                }}
                              >
                                {v.synonyms}
                              </div>
                            </div>
                          )}
                          {v.antonyms && (
                            <div style={{ flex: 1, minWidth: "100px" }}>
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 800,
                                  color: "#64748b",
                                  textTransform: "uppercase",
                                }}
                              >
                                Antonyms
                              </span>
                              <div
                                style={{
                                  fontSize: "14px",
                                  color: "#334155",
                                  fontWeight: 600,
                                }}
                              >
                                {v.antonyms}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* {v.notes && (
                        <div
                          style={{
                            background: "rgba(0,0,0,0.02)",
                            padding: "14px",
                            borderRadius: "12px",
                            borderLeft: "3px solid #38bdf8",
                            fontSize: "14px",
                            color: "#475569",
                            fontStyle: "italic",
                            marginTop: "16px",
                            fontWeight: 500,
                            lineHeight: 1.5,
                          }}
                        >
                          "{v.notes}"
                        </div>
                      )} */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "60px",
              paddingTop: "32px",
              borderTop: "3px solid #e2e8f0",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: 700,
              color: "#94a3b8",
            }}
          >
            Generated via IBPS Planner PRO • Report Date:{" "}
            {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
function FastReadingTimer({ onTimerEnded }) {
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      triggerSystemNotification(
        "Reading Time's Up!",
        "Your fast reading session is complete.",
        {},
        true,
      );
      if (onTimerEnded) onTimerEnded();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimerEnded]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const adjustTime = (mins) => {
    if (!isActive) setTimeLeft(Math.max(60, timeLeft + mins * 60));
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        background: "rgba(99,102,241,0.08)",
        padding: "4px 8px",
        borderRadius: "12px",
        border: "1px solid rgba(99,102,241,0.2)",
      }}
    >
      <button
        className="icon-btn-minimal"
        onClick={() => adjustTime(-1)}
        disabled={isActive}
        style={{ padding: "4px", color: "var(--accent)" }}
      >
        <Minus size={12} />
      </button>
      <span
        style={{
          fontWeight: 800,
          color: "var(--accent)",
          fontFamily: "monospace",
          fontSize: "14px",
          minWidth: "48px",
          textAlign: "center",
          letterSpacing: "1px",
        }}
      >
        {formatTime(timeLeft)}
      </span>
      <button
        className="icon-btn-minimal"
        onClick={() => adjustTime(1)}
        disabled={isActive}
        style={{ padding: "4px", color: "var(--accent)" }}
      >
        <Plus size={12} />
      </button>
      <div
        style={{
          width: "1px",
          height: "14px",
          background: "rgba(99,102,241,0.3)",
          margin: "0 4px",
        }}
      ></div>
      <button
        className="icon-btn-minimal"
        onClick={() => setIsActive(!isActive)}
        style={{
          padding: "4px",
          color: isActive ? "var(--warning)" : "var(--accent)",
        }}
      >
        {isActive ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <button
        className="icon-btn-minimal"
        onClick={() => {
          setIsActive(false);
          setTimeLeft(5 * 60);
        }}
        style={{ padding: "4px", color: "var(--text-muted)" }}
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
}

function QuantRotation({ quant = [] }) {
  const { updateHistory } = useAppStore();
  const handleChange = (index, field, value) =>
    updateHistory({
      quant: quant.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    });
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: "28px" }}>Quant Rotation</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Track quantitative aptitude proficiency and formula revisions.
          </p>
        </div>
      </div>
      <div className="grid-4">
        {quant.map((item, i) => (
          <div
            key={i}
            className={`topic-card ${item.checked ? "checked" : ""}`}
          >
            <div className="topic-card-header">
              <h4>{item.topic}</h4>
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={item.checked}
                onChange={(e) => handleChange(i, "checked", e.target.checked)}
              />
            </div>
            <input
              type="text"
              className="custom-input"
              placeholder="Formula / Errors..."
              value={item.notes}
              onChange={(e) => handleChange(i, "notes", e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReasoningRotation({ reasoning = [] }) {
  const { updateHistory } = useAppStore();
  const handleChange = (index, field, value) =>
    updateHistory({
      reasoning: reasoning.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    });
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: "28px" }}>Reasoning Rotation</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Master high-priority reasoning concepts daily.
          </p>
        </div>
      </div>
      <div className="grid-4">
        {reasoning.map((item, i) => (
          <div
            key={i}
            className={`topic-card ${item.checked ? "checked" : ""}`}
          >
            <div className="topic-card-header">
              <div>
                <span className={`tier-badge tier-${item.tier?.slice(-1)}`}>
                  {item.tier}
                </span>
                <h4>{item.topic}</h4>
              </div>
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={item.checked}
                onChange={(e) => handleChange(i, "checked", e.target.checked)}
              />
            </div>
            <input
              type="text"
              className="custom-input"
              placeholder="Tricks / Notes..."
              value={item.notes}
              onChange={(e) => handleChange(i, "notes", e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// export function MockTracker() {
//   // Replace these with your actual store hooks/methods.
//   // const { mocks, setMocks, selectedDate, notify } = useAppStore();

//   // Local state for demonstration (remove if using useAppStore)
//   const [mocks, setMocks] = useState([]);
//   const selectedDate = new Date().toISOString().split("T")[0];
//   const notify = (msg, type) => console.log(`[${type}] ${msg}`);

//   const addMock = () => {
//     setMocks([
//       {
//         id: Date.now().toString(),
//         date: selectedDate,
//         name: "",
//         score: "",
//         remarks: "",
//       },
//       ...mocks,
//     ]);
//     notify("New Mock Test card added.", "info");
//   };

//   const updateMock = (id, field, value) =>
//     setMocks(mocks.map((m) => (m.id === id ? { ...m, [field]: value } : m)));

//   const deleteMock = (id) => {
//     setMocks(mocks.filter((m) => m.id !== id));
//     notify("Mock Test deleted.", "info");
//   };

//   return (
//     <div style={{ marginTop: "40px" }}>
//       <div className="page-header" style={{ marginBottom: "24px" }}>
//         <div>
//           <h2 style={{ fontSize: "24px", fontWeight: 800 }}>
//             Mock Test Analytics
//           </h2>
//           <p style={{ color: "var(--text-muted)" }}>
//             Log mock tests to analyze your performance growth.
//           </p>
//         </div>
//         <button className="btn" onClick={addMock}>
//           <Plus size={16} /> Log New Test
//         </button>
//       </div>

//       {mocks.length === 0 ? (
//         <div
//           className="card"
//           style={{
//             textAlign: "center",
//             padding: "60px 20px",
//             color: "var(--text-muted)",
//             borderRadius: "16px",
//           }}
//         >
//           <LineChart
//             size={48}
//             style={{
//               opacity: 0.2,
//               margin: "0 auto 16px auto",
//               display: "block",
//             }}
//           />
//           No mock tests logged yet. Click "Log New Test" to begin tracking.
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//           {mocks.map((m) => (
//             <div
//               key={m.id}
//               className="card"
//               style={{
//                 padding: 0,
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//                 borderRadius: "16px",
//               }}
//             >
//               <div
//                 style={{
//                   padding: "16px 24px",
//                   background: "rgba(0,0,0,0.02)",
//                   borderBottom: "1px solid var(--border)",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   flexWrap: "wrap",
//                   gap: "16px",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "16px",
//                     flex: 1,
//                     minWidth: "300px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       width: "140px",
//                     }}
//                   >
//                     <label
//                       style={{
//                         fontSize: "11px",
//                         color: "var(--text-muted)",
//                         fontWeight: 700,
//                         textTransform: "uppercase",
//                         marginBottom: "4px",
//                       }}
//                     >
//                       Date Taken
//                     </label>
//                     <input
//                       type="date"
//                       className="custom-input"
//                       value={m.date}
//                       onChange={(e) => updateMock(m.id, "date", e.target.value)}
//                       style={{
//                         padding: "8px",
//                         fontSize: "13px",
//                         borderRadius: "6px",
//                         border: "1px solid var(--border)",
//                       }}
//                     />
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       flex: 1,
//                     }}
//                   >
//                     <label
//                       style={{
//                         fontSize: "11px",
//                         color: "var(--text-muted)",
//                         fontWeight: 700,
//                         textTransform: "uppercase",
//                         marginBottom: "4px",
//                       }}
//                     >
//                       Test Name / Provider
//                     </label>
//                     <input
//                       type="text"
//                       className="custom-input"
//                       placeholder="e.g. IBPS PO Prelims Mock 1"
//                       value={m.name}
//                       onChange={(e) => updateMock(m.id, "name", e.target.value)}
//                       style={{
//                         padding: "8px",
//                         fontSize: "15px",
//                         fontWeight: 600,
//                         border: "none",
//                         background: "transparent",
//                         outline: "none",
//                       }}
//                     />
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => deleteMock(m.id)}
//                   style={{
//                     color: "var(--danger)",
//                     background: "rgba(239,68,68,0.1)",
//                     border: "none",
//                     borderRadius: "8px",
//                     width: "36px",
//                     height: "36px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>

//               <div
//                 style={{
//                   display: "flex",
//                   gap: "24px",
//                   padding: "24px",
//                   alignItems: "center",
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     width: "150px",
//                   }}
//                 >
//                   <label
//                     style={{
//                       fontSize: "12px",
//                       color: "var(--text-muted)",
//                       fontWeight: 600,
//                       marginBottom: "8px",
//                     }}
//                   >
//                     Score / Marks
//                   </label>
//                   <input
//                     type="number"
//                     className="custom-input"
//                     placeholder="00.00"
//                     value={m.score}
//                     onChange={(e) => updateMock(m.id, "score", e.target.value)}
//                     style={{
//                       fontSize: "24px",
//                       fontWeight: 800,
//                       padding: "12px",
//                       color: "var(--text-main)",
//                       borderRadius: "8px",
//                       border: "1px solid var(--border)",
//                     }}
//                   />
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     flex: 1,
//                     minWidth: "250px",
//                   }}
//                 >
//                   <label
//                     style={{
//                       fontSize: "12px",
//                       color: "var(--text-muted)",
//                       fontWeight: 600,
//                       marginBottom: "8px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "6px",
//                     }}
//                   >
//                     <Edit3 size={14} /> Mistakes & Learnings
//                   </label>
//                   <textarea
//                     className="custom-input"
//                     placeholder="What went wrong? e.g. Silly mistake in Syllogism..."
//                     value={m.remarks}
//                     onChange={(e) =>
//                       updateMock(m.id, "remarks", e.target.value)
//                     }
//                     rows="2"
//                     style={{
//                       background: "rgba(99, 102, 241, 0.03)",
//                       border: "1px dashed var(--border)",
//                       borderRadius: "8px",
//                       padding: "12px",
//                       resize: "vertical",
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

function HabitTracker() {
  const {
    selectedDate,
    habits,
    baseHabits,
    setAppData,
    notify,
    requestConfirm,
  } = useAppStore();
  const scrollRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const dateParts = (selectedDate || getFormattedDateStr()).split("-");
  const year = parseInt(dateParts[0], 10),
    month = parseInt(dateParts[1], 10) - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  const currentHabits =
    habits[monthKey] ||
    (baseHabits || []).map((h) => ({
      name: h,
      days: Array(daysInMonth).fill(""),
    }));
  const updateHabits = (newHabits) =>
    setAppData((state) => ({
      ...state,
      baseHabits: newHabits.map((h) => h.name),
      habits: { ...state.habits, [monthKey]: newHabits },
    }));

  const toggleHabit = (hIndex, dIndex) => {
    const newHabits = [...currentHabits];
    const existingDays = newHabits[hIndex].days
      ? [...newHabits[hIndex].days]
      : Array(daysInMonth).fill("");
    while (existingDays.length < daysInMonth) existingDays.push("");
    const currentState = existingDays[dIndex];
    let nextState = "";
    if (currentState === "done" || currentState === true) nextState = "partial";
    else if (currentState === "partial") nextState = "missed";
    else if (currentState === "missed") nextState = "";
    else nextState = "done";
    existingDays[dIndex] = nextState;
    newHabits[hIndex] = { ...newHabits[hIndex], days: existingDays };
    updateHabits(newHabits);
  };
  const handleNameChange = (hIndex, val) => {
    const newHabits = [...currentHabits];
    newHabits[hIndex].name = val;
    updateHabits(newHabits);
  };
  const deleteHabit = (hIndex) => {
    requestConfirm("Remove this habit?", () => {
      updateHabits(currentHabits.filter((_, i) => i !== hIndex));
      notify("Habit deleted", "info");
    });
  };
  const addHabit = () => {
    updateHabits([
      ...currentHabits,
      { name: "New Habit", days: Array(daysInMonth).fill("") },
    ]);
    setIsEditing(true);
    notify("New habit added", "success");
  };
  const handleScroll = (amount) => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };
  const leftColWidth = 200;
  const cellSize = 34;
  const cellGap = 8;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: "28px" }}>Habits Heatmap</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Consistency calendar for <strong>{monthName}</strong> ({daysInMonth}{" "}
            Days)
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            className={`btn ${isEditing ? "" : "btn-outline"}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <CheckSquare size={16} /> : <Edit3 size={16} />}{" "}
            <span>{isEditing ? "Done Editing" : "Edit Habits"}</span>
          </button>
          <button className="btn" onClick={addHabit}>
            <Plus size={16} /> Add Habit
          </button>
        </div>
      </div>
      <div
        className="card"
        style={{ padding: "24px", overflow: "hidden", position: "relative" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <button
            className="icon-btn-minimal"
            onClick={() => handleScroll(-300)}
            style={{ border: "1px solid var(--border)" }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="icon-btn-minimal"
            onClick={() => handleScroll(300)}
            style={{ border: "1px solid var(--border)" }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div style={{ display: "flex", width: "100%" }}>
          <div
            style={{
              flex: `0 0 ${leftColWidth}px`,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              borderRight: "1px solid var(--border)",
              paddingRight: "16px",
              zIndex: 2,
            }}
          >
            <div style={{ height: "24px", marginBottom: "16px" }}></div>
            {currentHabits.map((h, hIndex) => (
              <div
                key={hIndex}
                style={{
                  height: `${cellSize}px`,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isEditing ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      width: "100%",
                    }}
                  >
                    <input
                      type="text"
                      className="custom-input"
                      style={{
                        padding: "4px 8px",
                        fontSize: "13px",
                        width: "100%",
                      }}
                      value={h.name}
                      onChange={(e) => handleNameChange(hIndex, e.target.value)}
                    />
                    <button
                      className="icon-btn-minimal"
                      onClick={() => deleteHabit(hIndex)}
                    >
                      <Trash2 size={14} color="var(--danger)" />
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={h.name}
                  >
                    {h.name}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowX: "auto",
              paddingLeft: "16px",
              scrollBehavior: "smooth",
            }}
          >
            <div style={{ minWidth: "max-content", paddingRight: "16px" }}>
              <div
                style={{
                  display: "flex",
                  gap: `${cellGap}px`,
                  marginBottom: "16px",
                }}
              >
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const isToday =
                    i + 1 === new Date().getDate() &&
                    month === new Date().getMonth();
                  return (
                    <div
                      key={i}
                      style={{
                        width: `${cellSize}px`,
                        textAlign: "center",
                        fontSize: "12px",
                        fontWeight: isToday ? 800 : 600,
                        color: isToday ? "var(--accent)" : "var(--text-muted)",
                        background: isToday
                          ? "rgba(99, 102, 241, 0.1)"
                          : "transparent",
                        borderRadius: "6px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {currentHabits.map((h, hIndex) => (
                  <div
                    key={hIndex}
                    style={{ display: "flex", gap: `${cellGap}px` }}
                  >
                    {Array.from({ length: daysInMonth }, (_, dIndex) => {
                      const state = h.days && h.days[dIndex];
                      let cellBg = "var(--bg)";
                      let cellBorder = "1px solid var(--border)";
                      let content = null;
                      if (state === "done" || state === true) {
                        cellBg = "#10b981";
                        cellBorder = "1px solid #10b981";
                        content = <CheckCircle2 size={16} color="#fff" />;
                      } else if (state === "partial") {
                        cellBg = "#f59e0b";
                        cellBorder = "1px solid #f59e0b";
                        content = (
                          <Minus size={16} color="#fff" strokeWidth={3} />
                        );
                      } else if (state === "missed") {
                        cellBg = "#ef4444";
                        cellBorder = "1px solid #ef4444";
                        content = <X size={16} color="#fff" strokeWidth={3} />;
                      }
                      return (
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          key={dIndex}
                          onClick={() => toggleHabit(hIndex, dIndex)}
                          style={{
                            width: `${cellSize}px`,
                            height: `${cellSize}px`,
                            borderRadius: "8px",
                            background: cellBg,
                            border: cellBorder,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {content}
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  const {
    user,
    logout,
    premiumData,
    setPremiumData,
    requestConfirm,
    deleteAccount,
  } = useAppStore();
  const displayName = user?.user_metadata?.display_username || "Aspirant";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="card" style={{ maxWidth: 800 }}>
        <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
          Account & System Settings
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
          Manage your profile credentials, notifications, and local data
          preference.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div
              style={{
                borderBottom: "1px solid var(--border)",
                paddingBottom: 24,
              }}
            >
              <label
                style={{
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 12,
                  fontSize: "15px",
                  color: "var(--text-main)",
                }}
              >
                Active Aspirant Account
              </label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    background: "rgba(99, 102, 241, 0.1)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                  }}
                >
                  <ShieldCheck size={28} />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "22px",
                      color: "var(--text-main)",
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {displayName}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#10b981",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    Cloud Real-Time Sync Active
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                borderBottom: "1px solid var(--border)",
                paddingBottom: 24,
              }}
            >
              <label
                style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
              >
                Target Exam Date
              </label>
              <input
                type="date"
                className="custom-input"
                value={premiumData?.examDate || ""}
                onChange={(e) =>
                  setPremiumData((p) => ({ ...p, examDate: e.target.value }))
                }
                style={{ maxWidth: "300px" }}
              />
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button className="btn btn-outline" onClick={logout}>
                <LogOut size={16} /> Sign Out Account
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "32px",
            paddingTop: "24px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <h3
            style={{
              color: "var(--danger)",
              fontSize: "16px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShieldAlert size={18} /> Danger Zone
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              marginBottom: "16px",
              lineHeight: "1.6",
            }}
          >
            This will immediately and permanently delete your account, wipe all
            your cloud dictionary entries, and clear your local storage.
          </p>
          <button
            className="btn btn-danger"
            style={{
              background: "var(--danger)",
              color: "white",
              border: "none",
            }}
            onClick={() =>
              requestConfirm(
                "Delete your account and wipe ALL cloud data permanently? This CANNOT be undone.",
                deleteAccount,
              )
            }
          >
            <Trash2 size={16} /> Delete Account & Data
          </button>
        </div>
      </div>
    </div>
  );
}

// --- REDESIGNED ALIGNED STUDY MATERIALS / PDF LIBRARY MODULE ---
// --- REDESIGNED ALIGNED STUDY MATERIALS / PDF & IMAGE LIBRARY MODULE ---
function StudyMaterialsModule() {
  const { user, notify } = useAppStore();
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [notes, setNotes] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("Current Affairs");
  const [uploadMonth, setUploadMonth] = useState("July");
  const [uploadSubCategory, setUploadSubCategory] = useState("Sports");
  const [uploadTitleOverride, setUploadTitleOverride] = useState("");

  const [newNote, setNewNote] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [showLibrary, setShowLibrary] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("Current Affairs");
  const [navPath, setNavPath] = useState([]);
  const [isTimerEndedModalOpen, setIsTimerEndedModalOpen] = useState(false);

  const [draggedDocId, setDraggedDocId] = useState(null);
  const [dragOverDocId, setDragOverDocId] = useState(null);

  const isAdmin =
    user?.user_metadata?.display_username ===
    import.meta.env.VITE_ADMIN_USERNAME;

  useEffect(() => {
    fetchDocuments();

    const documentsSubscription = supabase
      .channel("public:documents")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents" },
        () => fetchDocuments(),
      )
      .subscribe();

    const pollInterval = setInterval(() => {
      fetchDocuments();
    }, 5000);

    return () => {
      supabase.removeChannel(documentsSubscription);
      clearInterval(pollInterval);
    };
  }, []);

  useEffect(() => {
    if (selectedDoc) fetchNotes(selectedDoc.id);
  }, [selectedDoc]);

  useEffect(() => {
    setNavPath([]);
  }, [activeTab]);

  const fetchDocuments = async () => {
    const { data, error } = await supabase.from("documents").select("*");
    if (error) {
      console.error("Failed to load documents.", error);
    } else if (data) {
      setDocuments(data);
    }
  };

  const fetchNotes = async (docId) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("document_notes")
      .select("*")
      .eq("document_id", docId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error) setNotes(data || []);
  };

  const handleFileUpload = async (event) => {
    if (!isAdmin) return notify("Only the admin can upload files.", "error");
    try {
      setUploading(true);
      const file = event.target.files[0];

      if (!file) return;

      const isPdf = file.type === "application/pdf";
      const isImage = file.type.startsWith("image/");

      if (!isPdf && !isImage) {
        return notify("Please select a valid PDF or Image file.", "error");
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("pdf-files") // Keep using the same bucket or change if you have a general one
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("pdf-files")
        .getPublicUrl(filePath);

      const finalCategory =
        uploadCategory === "Current Affairs"
          ? `Current Affairs::${uploadMonth}::${uploadSubCategory}`
          : uploadCategory;
      const finalTitle =
        uploadTitleOverride.trim() || file.name.replace(`.${fileExt}`, "");
      const maxOrder = documents.reduce(
        (max, d) => Math.max(max, d.order_index || 0),
        0,
      );

      const { error: dbError } = await supabase.from("documents").insert([
        {
          title: finalTitle,
          file_path: filePath,
          file_url: urlData.publicUrl,
          category: finalCategory,
          order_index: maxOrder + 1,
        },
      ]);
      if (dbError) throw dbError;

      notify("File uploaded successfully!", "success");
      setUploadTitleOverride("");
      fetchDocuments();
    } catch (error) {
      notify("Upload failed: " + error.message, "error");
    } finally {
      setUploading(false);
      event.target.value = null;
    }
  };

  const handleDeleteDoc = async (id, filePath) => {
    if (!isAdmin) return;
    try {
      await supabase.storage.from("pdf-files").remove([filePath]);
      await supabase.from("documents").delete().eq("id", id);
      notify("Document removed.", "info");
      if (selectedDoc?.id === id) setSelectedDoc(null);
      fetchDocuments();
    } catch (err) {
      notify("Failed to delete document.", "error");
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedDoc || !user) return;
    const { error } = await supabase.from("document_notes").insert([
      {
        document_id: selectedDoc.id,
        user_id: user.id,
        content: newNote,
        page_number: parseInt(pageNumber) || 1,
      },
    ]);
    if (error) notify("Failed to save note.", "error");
    else {
      setNewNote("");
      fetchNotes(selectedDoc.id);
      notify("Note saved!", "success");
    }
  };

  const handleDeleteNote = async (id) => {
    await supabase.from("document_notes").delete().eq("id", id);
    fetchNotes(selectedDoc.id);
  };

  const handleDragStart = (e, doc) => {
    if (!isAdmin) return;
    e.stopPropagation();
    setDraggedDocId(doc.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, doc) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (dragOverDocId !== doc.id) setDragOverDocId(doc.id);
  };

  const handleDragLeave = (e, doc) => {
    if (!isAdmin) return;
    e.stopPropagation();
    if (dragOverDocId === doc.id) setDragOverDocId(null);
  };

  const handleDrop = async (e, targetDoc) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin || !draggedDocId || draggedDocId === targetDoc.id) {
      setDragOverDocId(null);
      setDraggedDocId(null);
      return;
    }

    const currentList = [...displayItems];
    const draggedIndex = currentList.findIndex((d) => d.id === draggedDocId);
    const targetIndex = currentList.findIndex((d) => d.id === targetDoc.id);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDragOverDocId(null);
      setDraggedDocId(null);
      return;
    }

    const newList = [...currentList];
    const [removed] = newList.splice(draggedIndex, 1);
    newList.splice(targetIndex, 0, removed);

    const updates = newList.map((doc, index) => ({
      id: doc.id,
      order_index: index + 1,
    }));

    setDocuments((prev) => {
      const docMap = new Map(prev.map((d) => [d.id, d]));
      updates.forEach((u) => docMap.set(u.id, { ...docMap.get(u.id), ...u }));
      return Array.from(docMap.values());
    });

    setDragOverDocId(null);
    setDraggedDocId(null);

    try {
      const results = await Promise.all(
        updates.map((u) =>
          supabase
            .from("documents")
            .update({ order_index: u.order_index })
            .eq("id", u.id),
        ),
      );

      const hasError = results.some((res) => res.error);
      if (hasError) throw new Error("403 Forbidden Check RLS");
    } catch (err) {
      console.error(err);
      notify(
        "Failed to save new order to database. Check Supabase RLS.",
        "error",
      );
      fetchDocuments();
    }
  };

  const dynamicTabs = Array.from(
    new Set([
      "Grammar Rule",
      "Editorial",
      "English",
      "Current Affairs",
      "Government Schemes",
      ...documents.map(
        (d) => (d.category || "Government Schemes").split("::")[0],
      ),
    ]),
  );

  const mainCategoryDocs = useMemo(() => {
    let filtered = documents.filter(
      (doc) =>
        (doc.category || "Government Schemes").split("::")[0] === activeTab,
    );
    filtered.sort((a, b) => {
      const orderA = a.order_index ?? 0;
      const orderB = b.order_index ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      if (
        activeTab === "Grammar Rule" ||
        activeTab === "English" ||
        activeTab === "Current Affairs"
      )
        return dateA - dateB;
      else return dateB - dateA;
    });
    return filtered;
  }, [documents, activeTab]);

  let displayItems = [];
  let viewMode = "docs";

  if (activeTab === "Current Affairs") {
    if (navPath.length === 0) {
      viewMode = "folders";
      displayItems = [
        ...new Set(
          mainCategoryDocs
            .map((d) => d.category.split("::")[1] || "Uncategorized")
            .filter(Boolean),
        ),
      ];
    } else if (navPath.length === 1) {
      viewMode = "folders";
      const m = navPath[0];
      displayItems = [
        ...new Set(
          mainCategoryDocs
            .filter((d) => (d.category.split("::")[1] || "Uncategorized") === m)
            .map((d) => d.category.split("::")[2] || "General")
            .filter(Boolean),
        ),
      ];
    } else if (navPath.length === 2) {
      viewMode = "docs";
      const m = navPath[0];
      const sc = navPath[1];
      displayItems = mainCategoryDocs.filter(
        (d) =>
          (d.category.split("::")[1] || "Uncategorized") === m &&
          (d.category.split("::")[2] || "General") === sc,
      );
    }
  } else {
    viewMode = "docs";
    displayItems = mainCategoryDocs;
  }

  // Check if the selected document is an image format
  const isSelectedDocImage = selectedDoc?.file_url?.match(
    /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i,
  );

  return (
    <div
      style={
        isFullscreen
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99999,
              display: "flex",
              background: "var(--bg)",
              animation: "fadeIn 0.2s",
            }
          : {
              display: "flex",
              height: "calc(150vh - 0px)",
              background: "var(--bg)",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid var(--border)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              animation: "fadeIn 0.5s ease",
            }
      }
    >
      <ReadingTimerModal
        isOpen={isTimerEndedModalOpen}
        onClose={() => setIsTimerEndedModalOpen(false)}
      />
      {showLibrary && (
        <div
          style={{
            width: "300px",
            minWidth: "280px",
            maxWidth: "320px",
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            background: "var(--bg)",
            flexShrink: 0,
            zIndex: 2,
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 800,
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-main)",
              }}
            >
              <BookOpen size={18} color="var(--accent)" /> Study Library
            </h2>
            <button
              className="icon-btn-minimal"
              onClick={() => setShowLibrary(false)}
              title="Close Library"
            >
              <X size={16} />
            </button>
          </div>
          {isAdmin && (
            <div
              style={{
                padding: "14px 16px",
                background: "rgba(99, 102, 241, 0.04)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <h4
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: "10px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  letterSpacing: "0.5px",
                }}
              >
                <ShieldCheck size={14} /> Admin Tools
              </h4>
              <select
                className="custom-input"
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                style={{
                  width: "100%",
                  marginBottom: "8px",
                  fontSize: "12px",
                  padding: "6px 8px",
                  fontWeight: 600,
                }}
              >
                <option value="Current Affairs">Current Affairs</option>
                <option value="Grammar Rule">120 Rules of Grammar</option>
                <option value="Editorial">Editorial</option>
                <option value="English">English</option>
                <option value="Government Schemes">Government Schemes</option>
              </select>
              {uploadCategory === "Current Affairs" && (
                <div
                  style={{ display: "flex", gap: "6px", marginBottom: "8px" }}
                >
                  <select
                    className="custom-input"
                    value={uploadMonth}
                    onChange={(e) => setUploadMonth(e.target.value)}
                    style={{
                      width: "50%",
                      fontSize: "12px",
                      padding: "6px 8px",
                      fontWeight: 600,
                    }}
                  >
                    {MONTHS_LIST.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    className="custom-input"
                    value={uploadSubCategory}
                    onChange={(e) => setUploadSubCategory(e.target.value)}
                    style={{
                      width: "50%",
                      fontSize: "12px",
                      padding: "6px 8px",
                      fontWeight: 600,
                    }}
                  >
                    {CA_TOPICS_LIST.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <input
                type="text"
                className="custom-input"
                placeholder="Title Override (Optional)"
                value={uploadTitleOverride}
                onChange={(e) => setUploadTitleOverride(e.target.value)}
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  fontSize: "12px",
                  padding: "6px 8px",
                  fontWeight: 600,
                }}
              />
              <label
                className="btn"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "8px",
                  fontSize: "12px",
                  cursor: uploading ? "not-allowed" : "pointer",
                }}
              >
                {uploading ? (
                  <Loader2 size={14} className="spinner" />
                ) : (
                  <UploadCloud size={14} />
                )}
                {uploading ? "Uploading..." : "Upload File (PDF/Image)"}
                <input
                  type="file"
                  accept="application/pdf, image/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  disabled={uploading}
                />
              </label>
            </div>
          )}
          <div
            className="scroll-area"
            style={{
              display: "flex",
              overflowX: "auto",
              padding: "12px 14px",
              flexWrap: "wrap",
              gap: "6px",
              borderBottom: "1px solid var(--border)",
              background: "rgba(0,0,0,0.01)",
            }}
          >
            {dynamicTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  background: activeTab === tab ? "var(--accent)" : "var(--bg)",
                  border:
                    activeTab === tab
                      ? "1px solid var(--accent)"
                      : "1px solid var(--border)",
                  color: activeTab === tab ? "#fff" : "var(--text-muted)",
                  fontWeight: activeTab === tab ? 700 : 500,
                  fontSize: "11px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  boxShadow:
                    activeTab === tab
                      ? "0 4px 10px rgba(99, 102, 241, 0.2)"
                      : "none",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(0,0,0,0.015)",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {displayItems.length}{" "}
              {viewMode === "folders" ? "Folders" : "Documents"}
            </span>
          </div>
          <div
            className="scroll-area"
            style={{
              flex: 1,
              padding: "12px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {activeTab === "Current Affairs" && navPath.length > 0 && (
              <button
                onClick={() => setNavPath(navPath.slice(0, -1))}
                className="btn btn-outline"
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  marginBottom: "8px",
                  alignSelf: "flex-start",
                  gap: "4px",
                }}
              >
                <ChevronLeft size={14} /> Back
              </button>
            )}
            {displayItems.length === 0 && !uploading && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  marginTop: "24px",
                }}
              >
                No items found here.
              </p>
            )}
            {viewMode === "folders"
              ? displayItems.map((folderName) => (
                  <div
                    key={folderName}
                    onClick={() => setNavPath([...navPath, folderName])}
                    style={{
                      cursor: "pointer",
                      background: "rgba(99, 102, 241, 0.03)",
                      border: "1px solid rgba(99, 102, 241, 0.15)",
                      borderRadius: "10px",
                      padding: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      transition: "all 0.15s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(99, 102, 241, 0.08)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(99, 102, 241, 0.03)")
                    }
                  >
                    <div
                      style={{
                        background: "var(--accent)",
                        color: "white",
                        padding: "8px",
                        borderRadius: "8px",
                        display: "flex",
                      }}
                    >
                      <Folder size={16} fill="currentColor" />
                    </div>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "var(--text-main)",
                      }}
                    >
                      {folderName}
                    </span>
                  </div>
                ))
              : displayItems.map((doc) => (
                  <div
                    key={doc.id}
                    draggable={isAdmin && viewMode === "docs"}
                    onDragStart={(e) => handleDragStart(e, doc)}
                    onDragOver={(e) => handleDragOver(e, doc)}
                    onDragLeave={(e) => handleDragLeave(e, doc)}
                    onDrop={(e) => handleDrop(e, doc)}
                    onClick={() => setSelectedDoc(doc)}
                    style={{
                      cursor: isAdmin ? "grab" : "pointer",
                      background:
                        selectedDoc?.id === doc.id
                          ? "rgba(99,102,241,0.08)"
                          : "var(--bg)",
                      border:
                        dragOverDocId === doc.id
                          ? "2px dashed var(--accent)"
                          : selectedDoc?.id === doc.id
                            ? "1px solid var(--accent)"
                            : "1px solid var(--border)",
                      opacity: draggedDocId === doc.id ? 0.5 : 1,
                      borderRadius: "10px",
                      padding: "10px 12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        overflow: "hidden",
                        pointerEvents: "none",
                      }}
                    >
                      {isAdmin && (
                        <div
                          style={{
                            color: "var(--text-muted)",
                            opacity: 0.5,
                            cursor: "grab",
                          }}
                        >
                          <GripVertical size={16} />
                        </div>
                      )}
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          background:
                            selectedDoc?.id === doc.id
                              ? "var(--accent)"
                              : "rgba(0,0,0,0.04)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FileText
                          size={16}
                          color={
                            selectedDoc?.id === doc.id
                              ? "white"
                              : "var(--text-muted)"
                          }
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          overflow: "hidden",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: selectedDoc?.id === doc.id ? 700 : 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color:
                              selectedDoc?.id === doc.id
                                ? "var(--accent)"
                                : "var(--text-main)",
                          }}
                        >
                          {doc.title}
                        </span>
                      </div>
                    </div>
                    {isAdmin && (
                      <button
                        className="icon-btn-minimal"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDoc(doc.id, doc.file_path);
                        }}
                        style={{ color: "var(--danger)", padding: "4px" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
          </div>
        </div>
      )}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          height: "100%",
          background: "var(--bg)",
        }}
      >
        {selectedDoc ? (
          <>
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                minHeight: "56px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flex: 1,
                  minWidth: "180px",
                  overflow: "hidden",
                }}
              >
                {!showLibrary && (
                  <button
                    className="icon-btn-minimal"
                    onClick={() => setShowLibrary(true)}
                    title="Open Library"
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "6px",
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen size={16} />
                  </button>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "var(--text-main)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {selectedDoc.title}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    {(selectedDoc.category || "Other").split("::").join(" • ")}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexShrink: 0,
                }}
              >
                <FastReadingTimer
                  onTimerEnded={() => setIsTimerEndedModalOpen(true)}
                />
                <span
                  style={{
                    fontSize: "11px",
                    padding: "4px 8px",
                    background: "rgba(245,158,11,0.1)",
                    color: "var(--warning)",
                    borderRadius: "8px",
                    fontWeight: 800,
                    letterSpacing: "0.5px",
                  }}
                >
                  READ ONLY
                </span>
                <button
                  className="icon-btn-minimal"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Viewer"}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "6px",
                  }}
                >
                  {isFullscreen ? (
                    <Minimize size={16} />
                  ) : (
                    <Maximize size={16} />
                  )}
                </button>
                {!showNotes && (
                  <button
                    className="icon-btn-minimal"
                    onClick={() => setShowNotes(true)}
                    title="Show Notes"
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "6px",
                    }}
                  >
                    <Edit3 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Viewer Area (Protected from Downloads) */}
            <div
              onContextMenu={(e) => e.preventDefault()} // Block Right Clicks Globally on Content
              style={{
                flex: 1,
                padding: isFullscreen ? "0" : "12px",
                background: "rgba(0,0,0,0.04)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {isSelectedDocImage ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    overflowY: "auto",
                    overflowX: "hidden",
                    borderRadius: isFullscreen ? "0" : "10px",
                    border: isFullscreen ? "none" : "1px solid var(--border)",
                    boxShadow: isFullscreen
                      ? "none"
                      : "0 8px 24px rgba(0,0,0,0.06)",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={selectedDoc.file_url}
                    alt={selectedDoc.title}
                    draggable="false" // Disable Drag to Desktop
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                      pointerEvents: "none", // Neutralizes "Save Image As" actions on touch devices
                      display: "block",
                    }}
                  />
                </div>
              ) : (
                <object
                  data={`${selectedDoc.file_url}#toolbar=0&navpanes=0`}
                  type="application/pdf"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: isFullscreen ? "0" : "10px",
                    border: isFullscreen ? "none" : "1px solid var(--border)",
                    boxShadow: isFullscreen
                      ? "none"
                      : "0 8px 24px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "var(--text-muted)",
                      padding: "20px",
                      background: "var(--bg)",
                    }}
                  >
                    <p>Unable to render PDF preview directly.</p>
                    <p
                      style={{
                        fontSize: "12px",
                        fontStyle: "italic",
                        marginTop: "8px",
                      }}
                    >
                      Direct downloads are disabled for this document due to
                      security settings.
                    </p>
                  </div>
                </object>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--text-muted)",
            }}
          >
            <Layers size={48} style={{ opacity: 0.2, marginBottom: "16px" }} />
            <p style={{ fontSize: "14px", fontWeight: 500 }}>
              Select a document from the library to start reading.
            </p>
            {!showLibrary && (
              <button
                className="btn btn-outline"
                style={{ marginTop: "16px" }}
                onClick={() => setShowLibrary(true)}
              >
                <BookOpen size={16} /> Open Library
              </button>
            )}
          </div>
        )}
      </div>

      {showNotes && (
        <div
          style={{
            width: "300px",
            minWidth: "280px",
            maxWidth: "320px",
            borderLeft: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            background: "var(--bg)",
            flexShrink: 0,
            zIndex: 2,
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Edit3 size={18} color="var(--accent)" />
              <h3 style={{ fontSize: "16px", fontWeight: 800, margin: 0 }}>
                My Notes
              </h3>
            </div>
            <button
              className="icon-btn-minimal"
              onClick={() => setShowNotes(false)}
              title="Close Notes"
            >
              <X size={16} />
            </button>
          </div>
          <form
            onSubmit={handleAddNote}
            style={{
              padding: "14px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              background: "rgba(0,0,0,0.01)",
            }}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                }}
              >
                Page
              </span>
              <input
                type="number"
                min="1"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
                className="custom-input"
                style={{
                  width: "60px",
                  padding: "6px",
                  textAlign: "center",
                  fontWeight: 700,
                }}
              />
            </div>
            <textarea
              rows="3"
              placeholder="Write personal takeaways here..."
              className="custom-input"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              style={{ resize: "none", fontSize: "13px" }}
            />
            <button
              type="submit"
              className="btn"
              disabled={!selectedDoc || !newNote.trim()}
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "8px",
                fontSize: "13px",
              }}
            >
              <Plus size={14} /> Save Note
            </button>
          </form>
          <div
            className="scroll-area"
            style={{
              flex: 1,
              padding: "14px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {notes.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--text-muted)",
                  marginTop: "20px",
                  padding: "10px",
                }}
              >
                <MessageSquare
                  size={32}
                  style={{ opacity: 0.2, margin: "0 auto 8px auto" }}
                />
                <p style={{ fontSize: "12px" }}>
                  No notes saved for this document.
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="card"
                  style={{
                    padding: "12px",
                    background: "rgba(0,0,0,0.015)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 800,
                        color: "var(--accent)",
                        background: "rgba(99,102,241,0.1)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      PAGE {note.page_number}
                    </span>
                    <button
                      className="icon-btn-minimal"
                      onClick={() => handleDeleteNote(note.id)}
                      style={{ color: "var(--text-muted)", padding: 0 }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      margin: 0,
                      lineHeight: 1.5,
                      color: "var(--text-main)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {note.content}
                  </p>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "var(--text-muted)",
                      marginTop: "2px",
                    }}
                  >
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const {
    user,
    authLoading,
    initAuth,
    theme,
    activeView,
    setActiveView,
    selectedDate,
    setAppData,
    history,
  } = useAppStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const contentArea = document.querySelector(".content-area");
    if (contentArea) contentArea.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeView]);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    setAppData((state) => {
      const existing = state.history[selectedDate] || {};
      if (
        existing.quant &&
        existing.reasoning &&
        existing.timeline &&
        existing.missedTasks &&
        existing.imageNotes &&
        existing.vocabStats
      )
        return state;
      return {
        ...state,
        history: {
          ...state.history,
          [selectedDate]: {
            timeline: (
              existing.timeline ||
              state.baseTimeline ||
              defaultTimeline
            ).map((t) => ({ ...t })),
            notes: existing.notes || "",
            quant: (
              existing.quant ||
              quantTopics.map((t) => ({ topic: t, checked: false, notes: "" }))
            ).map((q) => ({ ...q })),
            reasoning: (
              existing.reasoning ||
              reasoningTopics.map((t) => ({ ...t, checked: false, notes: "" }))
            ).map((r) => ({ ...r })),
            missedTasks: (existing.missedTasks || []).map((m) => ({ ...m })),
            imageNotes: (existing.imageNotes || []).map((n) => ({ ...n })),
            vocabStats: existing.vocabStats || {
              score: 0,
              correct: 0,
              wrong: 0,
              quizzesCompleted: 0,
            },
          },
        },
      };
    });
  }, [selectedDate, setAppData]);

  if (authLoading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <Loader2
          className="spinner"
          size={40}
          color="var(--accent)"
          style={{ animation: "spin 1s linear infinite" }}
        />
      </div>
    );
  if (!user)
    return (
      <div className="app-container">
        <AuthModal />
        <ToastContainer />
      </div>
    );

  const currentHistory = history[selectedDate] || {
    timeline: defaultTimeline.map((t) => ({ ...t })),
    notes: "",
    quant: quantTopics.map((t) => ({ topic: t, checked: false, notes: "" })),
    reasoning: reasoningTopics.map((t) => ({
      ...t,
      checked: false,
      notes: "",
    })),
    missedTasks: [],
    imageNotes: [],
    vocabStats: { score: 0, correct: 0, wrong: 0, quizzesCompleted: 0 },
  };

  return (
    <div className="app-container">
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <TimelineNotificationEngine />
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="logo">
          <div className="icon-wrap">
            <Target size={20} />
          </div>{" "}
          IBPS Planner{" "}
          <span style={{ fontWeight: 400, color: "var(--accent)" }}>PRO</span>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {[
            {
              id: "dashboard",
              icon: LayoutDashboard,
              label: "Dashboard & Quiz",
            },
            { id: "today", icon: CalendarCheck, label: "Daily Plan" },
            { id: "digital_notes", icon: PenTool, label: "Smart Notes Canvas" },
            {
              id: "materials",
              icon: BookOpen,
              label: "Study Materials / PDFs",
            },
            { id: "mockTest", icon: ClipboardCheck, label: "Mock Test" },
            { id: "vocab", icon: BookText, label: "Dictionary & Vocab" },
            { id: "quant", icon: Calculator, label: "Quant Rotation" },
            { id: "reasoning", icon: Brain, label: "Reasoning Rotation" },

            { id: "habits", icon: CheckCircle, label: "Habit Tracker" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveView(item.id);
                setIsSidebarOpen(false);
              }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <Header
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
        <div className="content-area">
          {activeView === "dashboard" && <Dashboard history={currentHistory} />}
          {activeView === "today" && (
            <DailyPlan timeline={currentHistory.timeline} />
          )}
          {activeView === "mockTest" && <MockTestModule />}
          {activeView === "digital_notes" &&
            (typeof DigitalNotesBoard !== "undefined" ? (
              <DigitalNotesBoard />
            ) : (
              <div>Digital Notes UI Component</div>
            ))}
          {activeView === "materials" && <StudyMaterialsModule />}
          {activeView === "vocab" && <VocabTracker />}

          {activeView === "quant" && (
            <QuantRotation quant={currentHistory.quant} />
          )}
          {activeView === "reasoning" && (
            <ReasoningRotation reasoning={currentHistory.reasoning} />
          )}

          {activeView === "habits" && <HabitTracker />}
          {activeView === "settings" && <SettingsView />}
        </div>
      </main>
      <ToastContainer />
      <ConfirmModal />
    </div>
  );
}
