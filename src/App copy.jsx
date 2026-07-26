/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  Crosshair,
  CheckCircle2,
  Circle,
  X,
  Plus,
  Trash,
  Download,
  Trash2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
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
  Image as ImageIcon,
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
} from "lucide-react";

// --- SUPABASE CLIENT IMPORT ---
import { supabase } from "./supabase";

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

const getFormattedDateStr = (d = new Date()) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

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

// --- ZUSTAND STORE FOR COMPLETE STATE & REALTIME SUPABASE ---
export const useAppStore = create(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      session: null,
      authLoading: true,

      // UI State
      theme: "light",
      activeView: "dashboard",
      selectedDate: getFormattedDateStr(),
      toasts: [],
      confirmDialog: { isOpen: false, message: "", onConfirm: null },

      // App Data
      baseTimeline: defaultTimeline,
      baseHabits: defaultHabitList,
      history: {},
      mocks: [],
      habits: {},
      vocab: [],
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

      setTheme: (theme) => {
        document.body.setAttribute("data-theme", theme);
        set({ theme });
      },
      setActiveView: (view) => set({ activeView: view }),
      setSelectedDate: (date) => set({ selectedDate: date }),

      notify: (message, type = "success") => {
        const id = Date.now() + Math.random();
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => {
          set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 3000);
      },

      requestConfirm: (message, onConfirm) => {
        set({ confirmDialog: { isOpen: true, message, onConfirm } });
      },
      closeConfirm: () => {
        set({ confirmDialog: { isOpen: false, message: "", onConfirm: null } });
      },

      // --- SUPABASE AUTHENTICATION ACTIONS ---
      initAuth: async () => {
        set({ authLoading: true });
        const {
          data: { session },
        } = await supabase.auth.getSession();
        set({ session, user: session?.user || null, authLoading: false });

        if (session?.user) {
          get().fetchVocabFromCloud();
        }

        supabase.auth.onAuthStateChange((_event, session) => {
          const currentUser = get().user;
          set({ session, user: session?.user || null, authLoading: false });

          if (session?.user && session.user.id !== currentUser?.id) {
            get().fetchVocabFromCloud();
          } else if (!session?.user) {
            set({ vocab: [] });
          }
        });
      },

      generateInternalEmail: (username) => {
        return `${username
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")}@ibpsplanner.internal`;
      },

      loginWithUsername: async (username, password) => {
        const internalEmail = get().generateInternalEmail(username);
        const { data, error } = await supabase.auth.signInWithPassword({
          email: internalEmail,
          password,
        });
        if (error) throw error;
        set({ user: data.user, session: data.session });
        get().fetchVocabFromCloud();
        return data;
      },

      signUpWithUsername: async (username, password) => {
        const internalEmail = get().generateInternalEmail(username);
        const { data, error } = await supabase.auth.signUp({
          email: internalEmail,
          password,
          options: { data: { display_username: username.trim() } },
        });
        if (error) throw error;
        return data;
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null, vocab: [] });
        get().notify("Logged out successfully.", "info");
      },

      deleteAccount: async () => {
        const user = get().user;
        if (user) {
          try {
            const { error } = await supabase.rpc("delete_user");
            if (error) {
              await supabase.from("dictionary").delete().eq("user_id", user.id);
            }
            await supabase.auth.signOut();
          } catch (err) {}
        }
        window.localStorage.clear();
        set({
          user: null,
          session: null,
          vocab: [],
          history: {},
          mocks: [],
          habits: {},
          premiumData: { bookmarks: [] },
        });
        get().notify(
          "Your account and all cloud data have been permanently deleted.",
          "info",
        );
      },

      // --- DICTIONARY CLOUD CRUD WITH OPTIMISTIC UI ---
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
          get().notify("Failed to save entry. It has been removed.", "error");
        }
      },

      updateVocabNote: async (noteObj) => {
        const user = get().user;
        if (!user) return;

        const noteWithUser = { ...noteObj, user_id: user.id };

        set((state) => ({
          vocab: state.vocab.map((v) =>
            v.id === noteObj.id ? noteWithUser : v,
          ),
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

      updateHistory: (newHistoryData) => {
        const date = get().selectedDate;
        set((state) => ({
          history: {
            ...state.history,
            [date]: { ...state.history[date], ...newHistoryData },
          },
        }));
      },

      setMocks: (mocks) => set({ mocks }),
      setPremiumData: (fn) =>
        set((state) => ({ premiumData: fn(state.premiumData) })),
      setAppData: (fn) => set((state) => fn(state)),
    }),
    {
      name: "ibps_planner_auth_store",
      partialize: (state) => ({
        theme: state.theme,
        history: state.history,
        mocks: state.mocks,
        habits: state.habits,
        baseTimeline: state.baseTimeline,
        baseHabits: state.baseHabits,
        premiumData: state.premiumData,
      }),
    },
  ),
);

// --- AUTHENTICATION MODAL ---
function AuthModal() {
  const { loginWithUsername, signUpWithUsername, notify, setActiveView } =
    useAppStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim().length < 3 || password.length < 6) {
      return notify(
        "Username (> 3 chars) and Password (> 6 chars) required.",
        "error",
      );
    }
    setLoading(true);

    try {
      if (isSignUp) {
        await signUpWithUsername(username, password);
        notify("Account created! Logging in...", "success");
        await loginWithUsername(username, password);
        setActiveView("dashboard");
      } else {
        await loginWithUsername(username, password);
        notify(`Welcome back, ${username}!`, "success");
        setActiveView("dashboard");
      }
    } catch (err) {
      notify(
        err.message || "Authentication failed. Check credentials.",
        "error",
      );
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
        style={{ maxWidth: "440px", width: "90%", padding: "32px" }}
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
            <Lock size={24} />
          </div>
          <h2 style={{ fontSize: "22px", margin: "0 0 6px 0" }}>
            {isSignUp ? "Create User ID" : "Aspirant Login"}
          </h2>
          <p
            style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}
          >
            {isSignUp
              ? "Set up your credentials to sync your banking prep data."
              : "Enter your User ID and Password to access your studyspace."}
          </p>
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
              User ID / Username
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
                placeholder="e.g. User_Name"
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
              <Loader2
                className="spinner"
                size={18}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "13px",
            color: "var(--text-muted)",
          }}
        >
          {isSignUp ? "Already have a User ID?" : "Don't have a User ID yet?"}{" "}
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

        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            background: "rgba(16, 185, 129, 0.05)",
            borderRadius: "8px",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            fontSize: "11px",
            color: "var(--text-muted)",
            lineHeight: "1.5",
          }}
        >
          <strong>Privacy & Guidelines:</strong> Your scores, image notes, and
          daily records are stored safely in your device's local storage. We
          gather data related to Username and Password solely to secure your
          account, and we sync your Dictionary entries to the cloud. We do not
          track or sell your personal data.
        </div>
      </motion.div>
    </div>
  );
}

// --- GLOBAL SEARCH MODAL ---
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

// --- POMODORO TIMER ---
function PomodoroTimer() {
  const { notify, setPremiumData } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState(25);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      notify(`Time's up! You completed a ${mode} minute session.`, "success");
      setPremiumData((prev) => ({
        ...prev,
        totalStudyMinutes: prev.totalStudyMinutes + mode,
      }));
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

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

// --- MAIN APP COMPONENT ---
export default function App() {
  const {
    user,
    authLoading,
    initAuth,
    fetchVocabFromCloud,
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
    if (!user) return;

    const channel = supabase
      .channel("public:dictionary")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dictionary" },
        () => {
          fetchVocabFromCloud();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchVocabFromCloud]);

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

  if (authLoading) {
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
  }

  if (!user) {
    return (
      <div className="app-container">
        <AuthModal />
        <ToastContainer />
      </div>
    );
  }

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
      <PomodoroTimer />
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
            { id: "vocab", icon: BookText, label: "Dictionary & Vocab" },
            { id: "quant", icon: Calculator, label: "Quant Rotation" },
            { id: "reasoning", icon: Brain, label: "Reasoning Rotation" },
            { id: "mocks", icon: LineChart, label: "Mock Tracker" },
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
          {activeView === "vocab" && <VocabTracker />}
          {activeView === "quant" && (
            <QuantRotation quant={currentHistory.quant} />
          )}
          {activeView === "reasoning" && (
            <ReasoningRotation reasoning={currentHistory.reasoning} />
          )}
          {activeView === "mocks" && <MockTracker />}
          {activeView === "habits" && <HabitTracker />}
          {activeView === "settings" && <SettingsView />}
        </div>
      </main>

      <ToastContainer />
      <ConfirmModal />
    </div>
  );
}

// --- VIEW & SUB-COMPONENTS ---

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

  const displayName = user?.user_metadata?.display_username || "Candidate";

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
      pool = vocab.filter((v) => premiumData.bookmarks.includes(v.id));
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
    const isCorrect = option === questions[currentIndex].correctOption;
    if (isCorrect) setScoreThisRound((prev) => prev + 1);
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

  const userName = user?.user_metadata?.display_username || "Candidate";

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

// --- MODERNIZED IBPS DICTIONARY & VOCAB TRACKER ---
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
          if (firstDef) {
            meaningsList.push(`${pos ? `[${pos}] ` : ""}${firstDef}`);
          }

          m.definitions?.forEach((def) => {
            if (def.example) examplesList.push(def.example);
            if (def.synonyms) synonymsList.push(...def.synonyms);
            if (def.antonyms) antonymsList.push(...def.antonyms);
          });
        });

        let detectedType = "Vocabulary";
        const wordCount = term.trim().split(" ").length;
        if (wordCount > 2) {
          detectedType = "Idiom";
        } else if (wordCount === 2) {
          detectedType = "Phrasal Verb";
        }

        const audioUrl = entry.phonetics?.find((p) => p.audio)?.audio || "";
        const combinedMeaning =
          meaningsList.join("\n") || "No definition found.";
        const allPoS = Array.from(partsOfSpeechSet).join(", ") || "word";

        setSearchResult({
          word: entry.word || term,
          type: detectedType,
          partOfSpeech: allPoS,
          meaning: combinedMeaning,
          synonyms: Array.from(new Set(synonymsList)).slice(0, 5).join(", "),
          antonyms: Array.from(new Set(antonymsList)).slice(0, 5).join(", "),
          notes: examplesList[0] ? `"${examplesList[0]}"` : "",
          audio: audioUrl,
        });
      } else {
        setSearchError(
          `No direct online entry for "${term}". You can add it manually!`,
        );
      }
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
      word: searchResult.word,
      type: searchResult.type,
      partOfSpeech: searchResult.partOfSpeech,
      meaning: searchResult.meaning,
      synonyms: searchResult.synonyms,
      antonyms: searchResult.antonyms,
      notes: searchResult.notes,
      dateAdded: selectedDate,
    });
    setSearchResult(null);
    setQuery("");
  };

  const handleDelete = (id) => {
    requestConfirm("Are you sure you want to delete this cloud entry?", () => {
      deleteVocabNote(id);
    });
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

  const playAudio = (url) => {
    if (!url) return;
    new Audio(url).play();
  };

  let filteredVocab = vocab.filter((v) => v.dateAdded === selectedDate);
  if (filterType === "Bookmarks") {
    filteredVocab = vocab.filter((v) => premiumData.bookmarks?.includes(v.id));
  } else if (filterType !== "All") {
    filteredVocab = filteredVocab.filter((v) => v.type === filterType);
  }

  // Helper for rendering Pill Tags in Modern UI style
  const renderPills = (textStr, type = "syn") => {
    if (!textStr) return null;
    const words = textStr
      .split(",")
      .map((w) => w.trim())
      .filter((w) => w);
    return words.map((w, i) => (
      <span
        key={i}
        style={{
          display: "inline-block",
          padding: "4px 10px",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: 600,
          background:
            type === "syn"
              ? "rgba(16, 185, 129, 0.12)"
              : "rgba(239, 68, 68, 0.12)",
          color: type === "syn" ? "#059669" : "#dc2626",
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

      {/* MODERN PREVIEW CARD DESIGN */}
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
          {/* Top Row: Word & Actions */}
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
              {searchResult.audio && (
                <button
                  className="icon-btn-minimal"
                  onClick={() => playAudio(searchResult.audio)}
                  title="Listen Pronunciation"
                  style={{ color: "var(--accent)" }}
                >
                  <Volume2 size={18} />
                </button>
              )}
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

          {/* Badge Row */}
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
            {/* Meaning Block */}
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

            {/* Synonyms & Antonyms */}
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
                        color: "#10b981",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Synonyms
                    </span>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                    >
                      {renderPills(searchResult.synonyms, "syn")}
                    </div>
                  </div>
                )}

                {searchResult.antonyms && (
                  <div style={{ flex: 1, minWidth: "150px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#ef4444",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Antonyms
                    </span>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                    >
                      {renderPills(searchResult.antonyms, "ant")}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notes Context */}
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
            const isBookmarked = premiumData.bookmarks?.includes(item.id);
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
                {/* Top Glowing Accent Bar if bookmarked */}
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

                {/* Card Header (Matches Design Image) */}
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
                      onClick={() => handleDelete(item.id)}
                      style={{ color: "var(--danger)" }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Badge Row */}
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

                {/* Card Body */}
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
                        fontSize: "16px",
                        lineHeight: "1.6",
                        color: "var(--text-main)",
                        margin: 0,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {item.meaning}
                    </p>
                  </div>

                  {/* Modern Tag Layout for Synonyms & Antonyms */}
                  {(item.synonyms || item.antonyms) && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "24px",
                        marginTop: "auto", // pushes down to bottom
                        paddingTop: "20px",
                        borderTop: "1px dashed var(--border)",
                      }}
                    >
                      {item.synonyms && (
                        <div style={{ flex: 1, minWidth: "120px" }}>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              color: "#10b981",
                              textTransform: "uppercase",
                              display: "block",
                              marginBottom: "8px",
                              letterSpacing: "0.5px",
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
                            {renderPills(item.synonyms, "syn")}
                          </div>
                        </div>
                      )}

                      {item.antonyms && (
                        <div style={{ flex: 1, minWidth: "120px" }}>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              color: "#ef4444",
                              textTransform: "uppercase",
                              display: "block",
                              marginBottom: "8px",
                              letterSpacing: "0.5px",
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
                            {renderPills(item.antonyms, "ant")}
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

// --- MODERN TIMELINE VIEW ---
function DailyPlan({ timeline }) {
  const { updateHistory, notify } = useAppStore();

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

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: "28px" }}>Daily Timeline</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Structure and execute your study routine block by block.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn" onClick={addTask}>
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>

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
                      )}
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
    </div>
  );
}

// --- MODERN HABIT HEATMAP TRACKER VIEW ---
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
            {isEditing ? <CheckSquare size={16} /> : <Edit3 size={16} />}
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
                      const isDone = state === "done" || state === true;
                      const isPartial = state === "partial";
                      const isMissed = state === "missed";

                      let cellBg = "var(--bg)";
                      let cellBorder = "1px solid var(--border)";
                      let content = null;

                      if (isDone) {
                        cellBg = "#10b981";
                        cellBorder = "1px solid #10b981";
                        content = <CheckCircle2 size={16} color="#fff" />;
                      } else if (isPartial) {
                        cellBg = "#f59e0b";
                        cellBorder = "1px solid #f59e0b";
                        content = (
                          <Minus size={16} color="#fff" strokeWidth={3} />
                        );
                      } else if (isMissed) {
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

function QuantRotation({ quant = [] }) {
  const { updateHistory } = useAppStore();
  const handleChange = (index, field, value) => {
    const updated = quant.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    updateHistory({ quant: updated });
  };

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
  const handleChange = (index, field, value) => {
    const updated = reasoning.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    updateHistory({ reasoning: updated });
  };

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

function MockTracker() {
  const { mocks, setMocks, selectedDate, notify } = useAppStore();

  const addMock = () => {
    setMocks([
      {
        id: Date.now().toString(),
        date: selectedDate,
        name: "",
        score: "",
        remarks: "",
      },
      ...mocks,
    ]);
    notify("New Mock Test card added.", "info");
  };

  const updateMock = (id, field, value) => {
    setMocks(mocks.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const deleteMock = (id) => {
    setMocks(mocks.filter((m) => m.id !== id));
    notify("Mock Test deleted.", "info");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: "28px" }}>Mock Test Analytics</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Log mock tests to analyze your performance growth.
          </p>
        </div>
        <button className="btn" onClick={addMock}>
          <Plus size={16} /> Log New Test
        </button>
      </div>

      {mocks.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--text-muted)",
          }}
        >
          <LineChart
            size={48}
            style={{
              opacity: 0.2,
              margin: "0 auto 16px auto",
              display: "block",
            }}
          />
          No mock tests logged yet. Click "Log New Test" to begin tracking.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {mocks.map((m) => {
            return (
              <div
                key={m.id}
                className="card"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    padding: "16px 24px",
                    background: "rgba(0,0,0,0.02)",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      flex: 1,
                      minWidth: "300px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "140px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Date Taken
                      </label>
                      <input
                        type="date"
                        className="custom-input"
                        value={m.date}
                        onChange={(e) =>
                          updateMock(m.id, "date", e.target.value)
                        }
                        style={{ padding: "8px", fontSize: "13px" }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <label
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Test Name / Provider
                      </label>
                      <input
                        type="text"
                        className="custom-input"
                        placeholder="e.g. IBPS PO Prelims Mock 1"
                        value={m.name}
                        onChange={(e) =>
                          updateMock(m.id, "name", e.target.value)
                        }
                        style={{
                          padding: "8px",
                          fontSize: "15px",
                          fontWeight: 600,
                          border: "none",
                          background: "transparent",
                        }}
                      />
                    </div>
                  </div>
                  <button
                    className="icon-btn-minimal"
                    onClick={() => deleteMock(m.id)}
                    style={{
                      color: "var(--danger)",
                      background: "rgba(239,68,68,0.1)",
                      borderRadius: "8px",
                      width: "36px",
                      height: "36px",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    padding: "24px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "150px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        fontWeight: 600,
                        marginBottom: "8px",
                      }}
                    >
                      Score / Marks
                    </label>
                    <input
                      type="number"
                      className="custom-input"
                      placeholder="00.00"
                      value={m.score}
                      onChange={(e) =>
                        updateMock(m.id, "score", e.target.value)
                      }
                      style={{
                        fontSize: "24px",
                        fontWeight: 800,
                        padding: "12px",
                        color: "var(--text-main)",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      minWidth: "250px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        fontWeight: 600,
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Edit3 size={14} /> Mistakes & Learnings
                    </label>
                    <textarea
                      className="custom-input"
                      placeholder="What went wrong? e.g. Silly mistake in Syllogism..."
                      value={m.remarks}
                      onChange={(e) =>
                        updateMock(m.id, "remarks", e.target.value)
                      }
                      rows="2"
                      style={{
                        background: "rgba(99, 102, 241, 0.03)",
                        border: "1px dashed var(--border)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
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
  const displayName = user?.user_metadata?.display_username || "Candidate";

  return (
    <div className="card" style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
        Account & Application Settings
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
        Manage your profile credentials and local data preference.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{ borderBottom: "1px solid var(--border)", paddingBottom: 24 }}
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
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
          style={{ borderBottom: "1px solid var(--border)", paddingBottom: 24 }}
        >
          <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
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

        <div
          style={{
            marginTop: "24px",
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
