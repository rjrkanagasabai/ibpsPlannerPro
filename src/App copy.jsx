/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

// --- SUPABASE IMPORT ---
// Import the Supabase client from your existing file.
// Change the path ('./supabase') if your file is named differently.
import { supabase } from "./supabase";

// --- 1. DEFAULT DATA ---
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

const compressImage = (file, callback) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL("image/jpeg", 0.7));
    };
  };
};

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);
  return [storedValue, setStoredValue];
}

// --- SUB-COMPONENTS ---

function UsernameModal({ isOpen, onSubmit, initialName }) {
  const [name, setName] = useState(
    initialName === "Guest User" ? "" : initialName || "",
  );

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (name.trim().length < 2) return;
    onSubmit(name.trim());
  };

  return (
    <div
      className="modal-overlay"
      style={{ zIndex: 999999, backdropFilter: "blur(10px)" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="modal-card"
      >
        <h3
          className="modal-title"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <User color="var(--accent)" /> Identity Required
        </h3>
        <p className="modal-message">
          Please enter your username. This is required to sync your dictionary
          entries and progress to the cloud.
        </p>
        <div style={{ marginTop: "20px", marginBottom: "24px" }}>
          <input
            autoFocus
            type="text"
            className="custom-input"
            placeholder="Enter your username..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{ width: "100%", fontSize: "16px", padding: "12px 16px" }}
          />
        </div>
        <div className="modal-actions" style={{ justifyContent: "flex-end" }}>
          <button
            className="btn"
            onClick={handleSubmit}
            disabled={name.trim().length < 2}
            style={{ opacity: name.trim().length < 2 ? 0.5 : 1 }}
          >
            Save & Continue <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function GlobalSearchModal({ isOpen, onClose, appData }) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const results = [];
  if (searchTerm.length > 2) {
    const lower = searchTerm.toLowerCase();
    appData.vocab?.forEach((v) => {
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

function PomodoroTimer({ premiumData, setPremiumData, notify }) {
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
      new Notification("Study Timer Complete", {
        body: `Great job! Take a break.`,
      });
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

function ToastContainer({ toasts }) {
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

function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onCancel} style={{ zIndex: 10000 }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="modal-title">Confirmation Required</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function VocabModal({
  isOpen,
  onClose,
  onSave,
  notify,
  initialData = null,
  selectedDate,
}) {
  const [word, setWord] = useState("");
  const [type, setType] = useState("Vocabulary");
  const [meaning, setMeaning] = useState("");
  const [synonyms, setSynonyms] = useState("");
  const [antonyms, setAntonyms] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initialData) {
      setWord(initialData.word);
      setType(initialData.type || "Vocabulary");
      setMeaning(initialData.meaning || "");
      setSynonyms(initialData.synonyms || "");
      setAntonyms(initialData.antonyms || "");
      setNotes(initialData.notes || "");
    } else {
      setWord("");
      setType("Vocabulary");
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
            gridTemplateColumns: "2fr 1fr",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div>
            <label style={labelStyle}>Word / Phrase / Idiom</label>
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
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Meaning / Definition</label>
          <textarea
            className="custom-input"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            rows="2"
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
            <label style={labelStyle}>Synonyms</label>
            <input
              type="text"
              className="custom-input"
              value={synonyms}
              onChange={(e) => setSynonyms(e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Antonyms</label>
            <input
              type="text"
              className="custom-input"
              value={antonyms}
              onChange={(e) => setAntonyms(e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginBottom: "32px" }}>
          <label style={labelStyle}>Example Sentence / Context</label>
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
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState(getFormattedDateStr());
  const [toasts, setToasts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });
  const [showUserModal, setShowUserModal] = useState(false);

  const [appData, setAppData] = useLocalStorage("ibps_react_planner_modern", {
    theme: "light",
    profile: { name: "Guest User" },
    baseTimeline: defaultTimeline,
    baseHabits: defaultHabitList,
    history: {},
    mocks: [],
    habits: {},
    vocab: [],
  });

  const [premiumData, setPremiumData] = useLocalStorage("ibps_premium_data", {
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    totalStudyMinutes: 0,
    bookmarks: [],
    revisions: {},
    examDate: "2026-10-01",
    lastMonthlyQuizMonth: new Date().toISOString().substring(0, 7),
  });

  const notify = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000,
    );
  };

  const requestConfirm = (message, onConfirm) =>
    setConfirmDialog({ isOpen: true, message, onConfirm });
  const closeConfirm = () =>
    setConfirmDialog({ isOpen: false, message: "", onConfirm: null });

  // Handle Username enforcement
  useEffect(() => {
    if (!appData.profile?.name || appData.profile.name === "Guest User") {
      setShowUserModal(true);
    }
  }, [appData.profile?.name]);

  const handleUpdateUser = (newName) => {
    setAppData((prev) => ({
      ...prev,
      profile: { ...prev.profile, name: newName },
    }));
    setShowUserModal(false);
    notify(`Welcome, ${newName}! Syncing data...`, "success");
  };

  // Sync Vocab from Supabase
  useEffect(() => {
    const fetchVocab = async () => {
      if (!appData.profile?.name || appData.profile.name === "Guest User")
        return;
      try {
        const { data, error } = await supabase
          .from("dictionary")
          .select("*")
          .eq("username", appData.profile.name);

        if (error) {
          console.error("Error fetching dictionary:", error);
        } else if (data) {
          setAppData((prev) => ({ ...prev, vocab: data }));
        }
      } catch (err) {
        console.error("Supabase fetch error:", err);
      }
    };
    fetchVocab();
  }, [appData.profile?.name, setAppData]);

  useEffect(() => {
    const today = getFormattedDateStr();
    if (premiumData.lastStudyDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getFormattedDateStr(yesterday);

    let newStreak = premiumData.currentStreak;
    if (premiumData.lastStudyDate === yesterdayStr) newStreak += 1;
    else if (premiumData.lastStudyDate !== null) newStreak = 1;

    if (newStreak === 7 && premiumData.currentStreak < 7)
      notify("Achievement Unlocked: 7 Day Streak! 🔥", "success");
    if (newStreak === 30 && premiumData.currentStreak < 30)
      notify("Achievement Unlocked: 30 Day Streak! 🏆", "success");

    setPremiumData((prev) => ({
      ...prev,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, prev.longestStreak),
      lastStudyDate: today,
    }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", appData.theme);
    setAppData((prev) => {
      const existing = prev.history[selectedDate] || {};
      if (
        existing.quant &&
        existing.reasoning &&
        existing.timeline &&
        existing.missedTasks &&
        existing.imageNotes &&
        existing.vocabStats
      )
        return prev;
      return {
        ...prev,
        history: {
          ...prev.history,
          [selectedDate]: {
            timeline: (
              existing.timeline ||
              prev.baseTimeline ||
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
  }, [selectedDate, appData.theme]);

  const currentHistory = appData.history[selectedDate] || {
    timeline: (appData.baseTimeline || defaultTimeline).map((t) => ({ ...t })),
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

  const updateHistory = (newHistoryData) => {
    setAppData((prev) => ({
      ...prev,
      history: {
        ...prev.history,
        [selectedDate]: { ...prev.history[selectedDate], ...newHistoryData },
      },
    }));
  };

  const updateVocabStats = (isCorrect, wordId) => {
    setAppData((prev) => {
      const todayHist = prev.history[selectedDate] || {};
      const stats = todayHist.vocabStats || {
        score: 0,
        correct: 0,
        wrong: 0,
        quizzesCompleted: 0,
      };
      return {
        ...prev,
        history: {
          ...prev.history,
          [selectedDate]: {
            ...todayHist,
            vocabStats: {
              ...stats,
              score: isCorrect
                ? stats.score + 10
                : Math.max(0, stats.score - 2),
              correct: isCorrect ? stats.correct + 1 : stats.correct,
              wrong: isCorrect ? stats.wrong : stats.wrong + 1,
            },
          },
        },
      };
    });

    if (wordId && isCorrect) {
      setPremiumData((prev) => {
        const revs = { ...prev.revisions };
        const currentCount = revs[wordId]?.count || 0;
        const intervals = [1, 3, 7, 15, 30];
        const nextInterval =
          intervals[Math.min(currentCount, intervals.length - 1)];
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + nextInterval);
        revs[wordId] = {
          count: currentCount + 1,
          nextReview: getFormattedDateStr(nextDate),
        };
        return { ...prev, revisions: revs };
      });
    }
  };

  const incrementQuizCount = () => {
    setAppData((prev) => {
      const todayHist = prev.history[selectedDate] || {};
      const stats = todayHist.vocabStats || {
        score: 0,
        correct: 0,
        wrong: 0,
        quizzesCompleted: 0,
      };
      return {
        ...prev,
        history: {
          ...prev.history,
          [selectedDate]: {
            ...todayHist,
            vocabStats: {
              ...stats,
              quizzesCompleted: stats.quizzesCompleted + 1,
            },
          },
        },
      };
    });
  };

  return (
    <div className="app-container">
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <PomodoroTimer
        premiumData={premiumData}
        setPremiumData={setPremiumData}
        notify={notify}
      />
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        appData={appData}
      />

      <UsernameModal
        isOpen={showUserModal}
        onSubmit={handleUpdateUser}
        initialName={appData.profile?.name}
      />

      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="logo">
          <div className="icon-wrap">
            <Target size={20} />
          </div>{" "}
          <span style={{ fontWeight: 500, color: "#18181b" }}>
            IBPS Planner{" "}
            <span style={{ fontWeight: 300, color: "#18181b" }}>PRO </span>
          </span>
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
            { id: "notes", icon: FileText, label: "Image Notes" },
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
          theme={appData.theme}
          setTheme={(t) => setAppData((prev) => ({ ...prev, theme: t }))}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
        <div className="content-area">
          {activeView === "dashboard" && (
            <Dashboard
              userName={appData.profile?.name}
              date={selectedDate}
              history={currentHistory}
              updateHistory={updateHistory}
              mocks={appData.mocks}
              missedTasks={currentHistory.missedTasks || []}
              setMissedTasks={(tasks) => updateHistory({ missedTasks: tasks })}
              vocab={appData.vocab || []}
              vocabStats={currentHistory.vocabStats}
              updateVocabStats={updateVocabStats}
              incrementQuizCount={incrementQuizCount}
              notify={notify}
              premiumData={premiumData}
              setPremiumData={setPremiumData}
            />
          )}
          {activeView === "today" && (
            <DailyPlan
              date={selectedDate}
              timeline={currentHistory.timeline}
              updateTimeline={(tl) => updateHistory({ timeline: tl })}
              saveAsDefault={() =>
                setAppData((prev) => ({
                  ...prev,
                  baseTimeline: currentHistory.timeline.map((t) => ({
                    ...t,
                    checked: false,
                  })),
                }))
              }
              notify={notify}
              requestConfirm={requestConfirm}
            />
          )}
          {activeView === "vocab" && (
            <VocabTracker
              vocab={appData.vocab || []}
              setVocab={(v) => setAppData((prev) => ({ ...prev, vocab: v }))}
              selectedDate={selectedDate}
              notify={notify}
              requestConfirm={requestConfirm}
              premiumData={premiumData}
              setPremiumData={setPremiumData}
              userName={appData.profile?.name} // Passed down to handle Supabase DB links
            />
          )}
          {activeView === "notes" && (
            <ImageNotesView
              date={selectedDate}
              imageNotes={currentHistory.imageNotes || []}
              setImageNotes={(notes) => updateHistory({ imageNotes: notes })}
              notify={notify}
              requestConfirm={requestConfirm}
            />
          )}
          {activeView === "quant" && (
            <QuantRotation
              quant={currentHistory.quant}
              setQuant={(q) => updateHistory({ quant: q })}
              notify={notify}
            />
          )}
          {activeView === "reasoning" && (
            <ReasoningRotation
              reasoning={currentHistory.reasoning}
              setReasoning={(r) => updateHistory({ reasoning: r })}
              notify={notify}
            />
          )}
          {activeView === "mocks" && (
            <MockTracker
              mocks={appData.mocks}
              setMocks={(m) => setAppData((prev) => ({ ...prev, mocks: m }))}
              date={selectedDate}
              notify={notify}
            />
          )}
          {activeView === "habits" && (
            <HabitTracker
              selectedDate={selectedDate}
              habitsData={
                Array.isArray(appData.habits) ? {} : appData.habits || {}
              }
              baseHabits={appData.baseHabits || defaultHabitList}
              setAppData={setAppData}
              notify={notify}
              requestConfirm={requestConfirm}
            />
          )}
          {activeView === "settings" && (
            <SettingsView
              appData={appData}
              setAppData={setAppData}
              notify={notify}
              requestConfirm={requestConfirm}
              premiumData={premiumData}
              setPremiumData={setPremiumData}
              openUserModal={() => setShowUserModal(true)}
            />
          )}
        </div>
      </main>

      <ToastContainer toasts={toasts} />
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function Header({
  theme,
  setTheme,
  selectedDate,
  setSelectedDate,
  toggleSidebar,
  onOpenSearch,
}) {
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
        <div
          className="hide-on-mobile"
          style={{
            width: "1px",
            height: "20px",
            background: "var(--border)",
            margin: "0 8px",
          }}
        ></div>
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}

function VocabQuiz({
  vocab,
  selectedDate,
  updateVocabStats,
  incrementQuizCount,
  notify,
  premiumData,
  setPremiumData,
}) {
  const [quizState, setQuizState] = useState("idle");
  const [quizMode, setQuizMode] = useState("daily");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [scoreThisRound, setScoreThisRound] = useState(0);

  const todayDate = getFormattedDateStr();
  const dueRevisionIds = Object.keys(premiumData?.revisions || {}).filter(
    (id) => premiumData.revisions[id].nextReview <= todayDate,
  );

  const currentMonthStr = selectedDate.substring(0, 7);
  const isNewMonth =
    premiumData?.lastMonthlyQuizMonth &&
    premiumData.lastMonthlyQuizMonth !== currentMonthStr &&
    vocab.length >= 4;

  const fetchDictionaryContextSentence = async (word) => {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`,
      );
      if (!res.ok) return null;
      const data = await res.json();
      let foundExample = null;
      if (data && data[0] && data[0].meanings) {
        for (let m of data[0].meanings) {
          for (let d of m.definitions) {
            if (d.example && d.example.length > 15) {
              foundExample = d.example;
              break;
            }
          }
          if (foundExample) break;
        }
      }
      if (foundExample) {
        let root = word.length > 4 ? word.substring(0, word.length - 2) : word;
        const regex = new RegExp(`\\b${root}\\w*\\b`, "gi");
        if (regex.test(foundExample)) {
          let masked = foundExample.replace(regex, "________");
          return masked.charAt(0).toUpperCase() + masked.slice(1);
        }
      }
    } catch (e) {}
    return null;
  };

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
    } else if (modeToUse === "monthly") {
      pool = vocab.filter((v) => v.dateAdded < selectedDate);
      pool = shuffleArray(pool);
    } else {
      pool = vocab.filter((v) => v.dateAdded && v.dateAdded < selectedDate);
      pool.sort((a, b) => {
        const aDue = dueRevisionIds.includes(a.id) ? 1 : 0;
        const bDue = dueRevisionIds.includes(b.id) ? 1 : 0;
        return bDue - aDue;
      });
    }

    const maxQs = modeToUse === "daily" ? 15 : 50;
    const selectedWords = pool.slice(0, maxQs);

    if (selectedWords.length < 4)
      return notify(
        `Need at least 4 saved words to generate a ${modeToUse} quiz!`,
        "error",
      );
    if (modeToUse !== quizMode) setQuizMode(modeToUse);

    setQuizState("generating");
    let generatedQs = [];
    for (let target of selectedWords) {
      let qType = "meaning";
      const hasAntonyms = target.antonyms && target.antonyms.trim().length > 0;
      const rand = Math.random();
      if (rand > 0.6) qType = "context";
      else if (rand > 0.3 && hasAntonyms) qType = "antonym";

      let questionText, correctOption, distractors;
      if (qType === "context") {
        let contextStr = null;
        if (target.notes && target.notes.length > 10) {
          const root =
            target.word.length > 4
              ? target.word.substring(0, target.word.length - 2)
              : target.word;
          const regex = new RegExp(`\\b${root}\\w*\\b`, "gi");
          contextStr = target.notes.replace(regex, "________");
        }
        if (!contextStr)
          contextStr = await fetchDictionaryContextSentence(target.word);

        if (contextStr && contextStr.includes("________")) {
          questionText = `Read the sentence and fill in the blank contextually:\n\n"${contextStr}"`;
          correctOption = target.word;
          distractors = shuffleArray(vocab.filter((v) => v.id !== target.id))
            .slice(0, 3)
            .map((v) => v.word);
        } else {
          qType = hasAntonyms && Math.random() > 0.5 ? "antonym" : "meaning";
        }
      }
      if (qType === "antonym") {
        const antList = target.antonyms
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a);
        correctOption = antList[0];
        questionText = `Choose the word which is most opposite in meaning (ANTONYM) to:\n\n"${target.word.toUpperCase()}"`;
        distractors = shuffleArray(vocab.filter((v) => v.id !== target.id))
          .slice(0, 3)
          .map((v) => v.word);
      } else if (qType === "meaning") {
        questionText = `What is the precise meaning of the ${target.type.toLowerCase()}:\n\n"${target.word}"?`;
        correctOption = target.meaning;
        distractors = shuffleArray(vocab.filter((v) => v.id !== target.id))
          .slice(0, 3)
          .map((v) => v.meaning);
      }
      generatedQs.push({
        targetId: target.id,
        targetWord: target.word,
        targetMeaning: target.meaning,
        targetAntonym: target.antonyms,
        targetNotes: target.notes,
        type: qType,
        questionText,
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
    updateVocabStats(isCorrect, questions[currentIndex].targetId);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      incrementQuizCount();
      setQuizState("finished");
      if (quizMode === "monthly" && setPremiumData) {
        setPremiumData((prev) => ({
          ...prev,
          lastMonthlyQuizMonth: currentMonthStr,
        }));
      }
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
            {dueRevisionIds.length > 0 && quizMode === "daily" && (
              <span
                style={{
                  fontSize: "12px",
                  background: "#facc15",
                  color: "#000",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                }}
              >
                {dueRevisionIds.length} Due
              </span>
            )}
          </h2>
          <p
            style={{
              opacity: 0.9,
              fontSize: "14px",
              maxWidth: "500px",
              lineHeight: "1.5",
            }}
          >
            Test your memory based on Spaced Repetition, or trigger targeted
            weekly & monthly revisions.
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
            <option value="monthly" style={{ color: "black" }}>
              Monthly Revision (50 Qs)
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

  if (quizState === "generating") {
    return (
      <div
        className="card"
        style={{
          marginBottom: "32px",
          textAlign: "center",
          padding: "40px 20px",
        }}
      >
        <Loader2
          size={40}
          className="spinner"
          color="var(--accent)"
          style={{
            margin: "0 auto 16px auto",
            animation: "spin 1s linear infinite",
          }}
        />
        <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
          Generating {quizMode} IBPS Quiz...
        </h2>
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
          You scored {scoreThisRound} out of {questions.length} on your{" "}
          {quizMode} revision.
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
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span>
          IBPS Pattern:{" "}
          {currentQ.type === "context"
            ? "Cloze Test"
            : currentQ.type === "antonym"
              ? "Antonym"
              : "Meaning"}
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
          fontStyle: currentQ.type === "context" ? "italic" : "normal",
        }}
      >
        {currentQ.questionText}
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {currentQ.options.map((opt, i) => {
          let btnStyle = {
            textAlign: "left",
            height: "auto",
            padding: "14px 16px",
            fontSize: "14px",
            fontWeight: "500",
            lineHeight: "1.5",
            justifyContent: "flex-start",
            whiteSpace: "normal",
          };
          let btnClass = "btn btn-outline";
          if (isAnswered) {
            if (opt === currentQ.correctOption) {
              btnClass = "btn";
              btnStyle.background = "var(--secondary)";
              btnStyle.color = "white";
              btnStyle.borderColor = "var(--secondary)";
            } else if (opt === selectedOption) {
              btnClass = "btn";
              btnStyle.background = "var(--danger)";
              btnStyle.color = "white";
              btnStyle.borderColor = "var(--danger)";
            } else {
              btnStyle.opacity = 0.5;
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
        <div
          style={{
            background: "rgba(99, 102, 241, 0.05)",
            borderLeft: "4px solid var(--accent)",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "24px",
            animation: "fadeIn 0.4s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              color:
                selectedOption === currentQ.correctOption
                  ? "var(--secondary)"
                  : "var(--danger)",
              fontWeight: "700",
            }}
          >
            {selectedOption === currentQ.correctOption ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {selectedOption === currentQ.correctOption
              ? "Correct!"
              : "Incorrect! Here's how to improve:"}
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-main)",
              lineHeight: "1.6",
            }}
          >
            The correct word is <strong>{currentQ.correctOption}</strong>.<br />
            <strong>{currentQ.targetWord}</strong> means{" "}
            <em>{currentQ.targetMeaning}</em>.<br />
            {currentQ.type === "antonym" && currentQ.targetAntonym && (
              <span style={{ display: "block", marginTop: "4px" }}>
                <strong>Other Antonyms:</strong> {currentQ.targetAntonym}
              </span>
            )}
            {currentQ.targetNotes && currentQ.type !== "antonym" && (
              <span style={{ display: "block", marginTop: "8px" }}>
                <strong>Context / Note:</strong> {currentQ.targetNotes}
              </span>
            )}
          </p>
        </div>
      )}
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

function Dashboard({
  userName,
  date,
  history,
  updateHistory,
  mocks,
  missedTasks,
  setMissedTasks,
  vocab,
  vocabStats,
  updateVocabStats,
  incrementQuizCount,
  notify,
  premiumData,
  setPremiumData,
}) {
  const [newMissed, setNewMissed] = useState("");
  const mockScrollRef = useRef(null);

  const totalTasks = history.timeline?.length || 0;
  const completedTasks = history.timeline?.filter((t) => t.checked).length || 0;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  const dailyStudy = calculateStudyMinutes(history.timeline);
  const dailyCompletedHours = (dailyStudy.completedMins / 60).toFixed(1);
  const dailyTargetHours = (dailyStudy.targetMins / 60).toFixed(1);
  const dateMocks = mocks.filter((m) => m.date === date);

  const totalAnswers = (vocabStats?.correct || 0) + (vocabStats?.wrong || 0);
  const vocabAccuracy =
    totalAnswers === 0
      ? 0
      : Math.round(((vocabStats?.correct || 0) / totalAnswers) * 100);
  const score = vocabStats?.score || 0;

  let masteryLevel = "Novice";
  let masteryColor = "var(--text-muted)";
  if (score >= 100) {
    masteryLevel = "Master";
    masteryColor = "var(--warning)";
  } else if (score >= 30) {
    masteryLevel = "Scholar";
    masteryColor = "var(--accent)";
  }

  const addMissed = () => {
    if (newMissed.trim()) {
      setMissedTasks([...missedTasks, { text: newMissed, checked: false }]);
      setNewMissed("");
      notify("Task added to backlog", "info");
    }
  };
  const toggleMissed = (index) =>
    setMissedTasks(
      missedTasks.map((t, i) =>
        i === index ? { ...t, checked: !t.checked } : t,
      ),
    );

  const handleMockScroll = (direction) => {
    if (mockScrollRef.current)
      mockScrollRef.current.scrollBy({
        left: direction === "left" ? -460 : 460,
        behavior: "smooth",
      });
  };

  const renderMockCard = (mock, idx, isFlexible) => (
    <div
      key={idx}
      className="mock-banner-modern"
      style={
        isFlexible ? { flex: 1, minWidth: "300px", maxWidth: "500px" } : {}
      }
    >
      <div className="mock-banner-left">
        <span className="mock-date">{mock.date || "Unknown Date"}</span>
        <div className="mock-score-giant">{mock.score || 0}</div>
        <div className="mock-badge">{mock.name || "Unnamed Test"}</div>
      </div>
      <div className="mock-banner-right">
        <div className="mock-stat-block">
          <span className="mock-stat-label">Accuracy</span>
          <span className="mock-stat-value">{mock.accuracy || 0}%</span>
          <div className="accuracy-progress">
            <div
              className="accuracy-fill"
              style={{ width: `${mock.accuracy || 0}%` }}
            ></div>
          </div>
        </div>
        <div className="mock-stat-block">
          <span className="mock-stat-label">Remarks</span>
          <span className="mock-remarks">
            {mock.remarks || "No remarks provided."}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h1>Welcome back{userName ? `, ${userName}` : ""}.</h1>
          <p>
            Here is your overview for{" "}
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <UpcomingExamsWidget />

      <VocabQuiz
        vocab={vocab}
        selectedDate={date}
        updateVocabStats={updateVocabStats}
        incrementQuizCount={incrementQuizCount}
        notify={notify}
        premiumData={premiumData}
        setPremiumData={setPremiumData}
      />

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
        <div
          className="card stat-card"
          style={{ position: "relative", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              opacity: 0.05,
              transform: "rotate(15deg)",
            }}
          >
            <Award size={140} />
          </div>
          <div
            className="icon-wrap"
            style={{
              background: "rgba(245, 158, 11, 0.1)",
              color: "var(--warning)",
            }}
          >
            <Award size={24} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div>
              <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {score}{" "}
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--text-muted)",
                  }}
                >
                  XP Today
                </span>
              </h3>
              <p
                style={{
                  color: masteryColor,
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: "12px",
                  marginTop: "6px",
                }}
              >
                Daily Rank: {masteryLevel}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "16px", fontWeight: "700" }}>
                {vocabAccuracy}%
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Quiz Accuracy
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: 600 }}>
          Daily Performance History
        </h3>
        {dateMocks.length > 2 && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="icon-btn"
              style={{ width: 32, height: 32 }}
              onClick={() => handleMockScroll("left")}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="icon-btn"
              style={{ width: 32, height: 32 }}
              onClick={() => handleMockScroll("right")}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
      {dateMocks.length === 0 ? (
        <div
          className="mock-banner-modern"
          style={{
            borderLeftColor: "var(--border)",
            flex: 1,
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              color: "var(--text-muted)",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Crosshair size={18} /> No mock tests logged for {date}.
          </p>
        </div>
      ) : dateMocks.length <= 2 ? (
        <div className="mock-flex-modern">
          {[...dateMocks]
            .reverse()
            .map((mock, idx) => renderMockCard(mock, idx, true))}
        </div>
      ) : (
        <div className="mock-carousel-container" ref={mockScrollRef}>
          {[...dateMocks]
            .reverse()
            .map((mock, idx) => renderMockCard(mock, idx, false))}
        </div>
      )}

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
            style={{
              flex: 1,
              overflowY: "auto",
              maxHeight: "300px",
              paddingRight: "8px",
            }}
          >
            <h4 className="section-subtitle">Completed</h4>
            <div style={{ marginBottom: "24px" }}>
              {history.timeline
                ?.filter((t) => t.checked)
                .map((t, i) => (
                  <div key={i} className="dash-list-item checked">
                    <CheckCircle2 size={16} color="var(--secondary)" />{" "}
                    <span>{t.time}</span>{" "}
                    <ArrowRight size={14} color="var(--border)" /> {t.activity}
                  </div>
                ))}
              {completedTasks === 0 && (
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  No tasks completed yet.
                </span>
              )}
            </div>
            <h4 className="section-subtitle">Pending</h4>
            <div>
              {history.timeline
                ?.filter((t) => !t.checked)
                .map((t, i) => (
                  <div key={i} className="dash-list-item">
                    <Circle size={16} color="var(--text-muted)" />{" "}
                    <span>{t.time}</span>{" "}
                    <ArrowRight size={14} color="var(--border)" /> {t.activity}
                  </div>
                ))}
              {completedTasks === totalTasks && totalTasks > 0 && (
                <span style={{ fontSize: 13, color: "var(--secondary)" }}>
                  All tasks completed!
                </span>
              )}
            </div>
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
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginBottom: "16px",
              }}
            >
              Manage partial or skipped tasks for this day.
            </p>
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
              {missedTasks.map((t, i) => (
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
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {t.text}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setMissedTasks(missedTasks.filter((_, idx) => idx !== i));
                      notify("Task removed", "info");
                    }}
                    className="icon-btn-minimal"
                  >
                    <X size={16} />
                  </button>
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
              {history.notes?.length > 0 && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <CheckCircle2 size={12} /> Saved
                </span>
              )}
            </div>
            <textarea
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                resize: "vertical",
                minHeight: "140px",
                padding: "24px",
                fontSize: "15px",
                lineHeight: "1.7",
                color: "var(--text-main)",
                outline: "none",
              }}
              placeholder="Reflect on your day, jot down key takeaways, or plan for tomorrow..."
              value={history.notes}
              onChange={(e) => updateHistory({ notes: e.target.value })}
            />
            <div
              style={{
                padding: "12px 24px",
                background: "var(--bg)",
                borderTop: "1px dashed var(--border)",
                fontSize: "12px",
                color: "var(--text-muted)",
                textAlign: "right",
              }}
            >
              {history.notes?.length || 0} characters
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VocabTracker({
  vocab,
  setVocab,
  selectedDate,
  notify,
  requestConfirm,
  premiumData,
  setPremiumData,
  userName,
}) {
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
        let partOfSpeech = entry.meanings?.[0]?.partOfSpeech || "word";
        entry.meanings?.forEach((m) => {
          if (m.synonyms) synonymsList.push(...m.synonyms);
          if (m.antonyms) antonymsList.push(...m.antonyms);
          m.definitions?.forEach((def) => {
            if (def.definition) meaningsList.push(def.definition);
            if (def.example) examplesList.push(def.example);
            if (def.synonyms) synonymsList.push(...def.synonyms);
            if (def.antonyms) antonymsList.push(...def.antonyms);
          });
        });
        let detectedType = "Vocabulary";
        if (term.trim().split(" ").length > 1)
          detectedType =
            term.trim().split(" ").length > 2 ? "Idiom" : "Phrasal Verb";
        const audioUrl = entry.phonetics?.find((p) => p.audio)?.audio || "";
        setSearchResult({
          word: entry.word || term,
          type: detectedType,
          partOfSpeech: partOfSpeech,
          meaning: meaningsList[0] || "No definition found.",
          synonyms: Array.from(new Set(synonymsList)).slice(0, 5).join(", "),
          antonyms: Array.from(new Set(antonymsList)).slice(0, 5).join(", "),
          notes: examplesList[0] ? `"${examplesList[0]}"` : "",
          audio: audioUrl,
        });
      } else {
        setSearchError(
          `No online entry found for "${term}". Click below to add it manually!`,
        );
      }
    } catch (err) {
      setSearchError("Unable to connect to dictionary API.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveSearchResult = async () => {
    if (!searchResult) return;
    const newNote = {
      id: Date.now().toString(),
      word: searchResult.word,
      type: searchResult.type,
      meaning: searchResult.meaning,
      synonyms: searchResult.synonyms,
      antonyms: searchResult.antonyms,
      notes: searchResult.notes,
      dateAdded: selectedDate,
      username: userName,
    };

    try {
      const { error } = await supabase.from("dictionary").insert([newNote]);
      if (error) throw error;
      setVocab([newNote, ...vocab]);
      notify(`Saved "${searchResult.word}" for ${selectedDate}!`, "success");
      setSearchResult(null);
      setQuery("");
    } catch (err) {
      console.error(err);
      notify("Error saving to cloud. Data may not be synced.", "error");
    }
  };

  const handleSaveModalNote = async (noteObj) => {
    const finalNote = { ...noteObj, username: userName };
    try {
      const exists = vocab.find((v) => v.id === finalNote.id);
      const { error } = await supabase.from("dictionary").upsert([finalNote]);
      if (error) throw error;

      if (exists) {
        setVocab(vocab.map((v) => (v.id === finalNote.id ? finalNote : v)));
        notify("Study note updated in cloud successfully", "success");
      } else {
        setVocab([finalNote, ...vocab]);
        notify(`Added new study note to cloud for ${selectedDate}`, "success");
      }
    } catch (err) {
      console.error(err);
      notify("Failed to save to cloud database.", "error");
    }
  };

  const handleDelete = (id) => {
    requestConfirm(
      "Are you sure you want to delete this study note from the cloud?",
      async () => {
        try {
          const { error } = await supabase
            .from("dictionary")
            .delete()
            .match({ id: id, username: userName });
          if (error) throw error;
          setVocab(vocab.filter((v) => v.id !== id));
          notify("Study note deleted from cloud", "info");
        } catch (err) {
          console.error(err);
          notify("Failed to delete note from cloud database.", "error");
        }
      },
    );
  };

  const toggleBookmark = (id) => {
    setPremiumData((prev) => {
      const isBookmarked = prev.bookmarks.includes(id);
      return {
        ...prev,
        bookmarks: isBookmarked
          ? prev.bookmarks.filter((bId) => bId !== id)
          : [...prev.bookmarks, id],
      };
    });
    notify("Bookmark updated", "info");
  };

  const playAudio = (url) => {
    if (!url) return;
    const audio = new Audio(url);
    audio.play();
  };

  let filteredVocab = vocab.filter((v) => v.dateAdded === selectedDate);
  if (filterType === "Bookmarks") {
    filteredVocab = vocab.filter((v) => premiumData.bookmarks.includes(v.id));
  } else if (filterType !== "All") {
    filteredVocab = filteredVocab.filter((v) => v.type === filterType);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: "28px" }}>Dictionary & Vocab List</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Search and save cloud-synced terms for{" "}
            <strong>{selectedDate}</strong>.
          </p>
        </div>
        <button
          className="btn"
          onClick={() => {
            setEditingNote(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} /> Custom Note
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
            border: "1px solid var(--border)",
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
            placeholder="Search any word, phrasal verb, or idiom..."
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
            style={{ padding: "8px 20px" }}
            onClick={() => handleSearch()}
            disabled={isSearching}
          >
            {isSearching ? <Clock size={16} /> : "Search"}
          </button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div
            className="card"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 100,
              marginTop: "8px",
              padding: "8px 0",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                className="dash-list-item"
                onClick={() => {
                  setQuery(s.word);
                  handleSearch(s.word);
                }}
              >
                <Search size={14} color="var(--text-muted)" /> {s.word}
              </div>
            ))}
          </div>
        )}
      </div>

      {searchError && (
        <div
          className="card"
          style={{
            marginBottom: "32px",
            borderLeft: "4px solid var(--danger)",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "var(--text-main)", fontSize: "14px" }}>
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
              <Plus size={14} /> Add Manually
            </button>
          </div>
        </div>
      )}

      {searchResult && (
        <div
          className="card"
          style={{
            marginBottom: "32px",
            borderLeft: "4px solid var(--accent)",
            padding: "28px",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <h2 style={{ fontSize: "24px", margin: 0 }}>
                  {searchResult.word}
                </h2>
                <span
                  className="tier-badge"
                  style={{
                    margin: 0,
                    background: "rgba(99, 102, 241, 0.1)",
                    color: "var(--accent)",
                  }}
                >
                  {searchResult.type} • {searchResult.partOfSpeech}
                </span>
                {searchResult.audio && (
                  <button
                    className="icon-btn"
                    style={{ width: 32, height: 32 }}
                    onClick={() => playAudio(searchResult.audio)}
                    title="Listen"
                  >
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
            </div>
            <button className="btn" onClick={handleSaveSearchResult}>
              <Plus size={16} /> Save to Cloud
            </button>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div style={{ fontSize: "15px", lineHeight: "1.6" }}>
              <strong>Meaning: </strong>{" "}
              <span style={{ color: "var(--text-main)" }}>
                {searchResult.meaning}
              </span>
            </div>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {searchResult.synonyms && (
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.5",
                    color: "var(--secondary)",
                  }}
                >
                  <strong>Synonyms: </strong> {searchResult.synonyms}
                </div>
              )}
              {searchResult.antonyms && (
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.5",
                    color: "var(--danger)",
                  }}
                >
                  <strong>Antonyms: </strong> {searchResult.antonyms}
                </div>
              )}
            </div>
            {searchResult.notes && (
              <div
                style={{
                  background: "rgba(99, 102, 241, 0.05)",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontStyle: "italic",
                  borderLeft: "3px solid var(--accent)",
                }}
              >
                Example: {searchResult.notes}
              </div>
            )}
          </div>
        </div>
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
              }}
              onClick={() => setFilterType(type)}
            >
              {type === "Bookmarks" && (
                <Bookmark size={14} style={{ marginRight: 4 }} />
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
          <BookText
            size={48}
            style={{
              opacity: 0.2,
              margin: "0 auto 16px auto",
              display: "block",
            }}
          />
          No saved study notes found in this category.
        </div>
      ) : (
        <div className="grid-2">
          {filteredVocab.map((item) => {
            const isBookmarked = premiumData.bookmarks.includes(item.id);
            return (
              <div
                key={item.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "20px",
                        margin: "0 0 6px 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {item.word}
                      <span
                        className="tier-badge"
                        style={{
                          fontSize: "10px",
                          padding: "4px 8px",
                          margin: 0,
                          background: "rgba(99, 102, 241, 0.1)",
                          color: "var(--accent)",
                        }}
                      >
                        {item.type}
                      </span>
                    </h3>
                    <div
                      style={{ fontSize: "12px", color: "var(--text-muted)" }}
                    >
                      Added: {item.dateAdded}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      className="icon-btn-minimal"
                      onClick={() => toggleBookmark(item.id)}
                      title="Bookmark"
                    >
                      <Bookmark
                        size={16}
                        fill={isBookmarked ? "var(--warning)" : "none"}
                        color={
                          isBookmarked ? "var(--warning)" : "var(--text-muted)"
                        }
                      />
                    </button>
                    <button
                      className="icon-btn-minimal"
                      onClick={() => {
                        setEditingNote(item);
                        setIsModalOpen(true);
                      }}
                      title="Edit Note"
                    >
                      <Edit3 size={16} color="var(--text-muted)" />
                    </button>
                    <button
                      className="icon-btn-minimal"
                      onClick={() => handleDelete(item.id)}
                      title="Delete Note"
                    >
                      <Trash2 size={16} color="var(--text-muted)" />
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    flex: 1,
                  }}
                >
                  <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                    <span
                      style={{ fontWeight: "700", color: "var(--text-main)" }}
                    >
                      Meaning:{" "}
                    </span>{" "}
                    <span style={{ color: "var(--text-muted)" }}>
                      {item.meaning}
                    </span>
                  </div>
                  {(item.synonyms || item.antonyms) && (
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                        fontSize: "13px",
                        lineHeight: "1.5",
                      }}
                    >
                      {item.synonyms && (
                        <span style={{ color: "var(--secondary)" }}>
                          <strong>Syn:</strong> {item.synonyms}
                        </span>
                      )}
                      {item.antonyms && (
                        <span style={{ color: "var(--danger)" }}>
                          <strong>Ant:</strong> {item.antonyms}
                        </span>
                      )}
                    </div>
                  )}
                  {item.notes && (
                    <div
                      style={{
                        marginTop: "auto",
                        background: "rgba(99, 102, 241, 0.04)",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        borderLeft: "3px solid var(--accent)",
                        fontSize: "13px",
                        lineHeight: "1.5",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--text-main)",
                          fontStyle: "italic",
                        }}
                      >
                        {item.notes}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <VocabModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModalNote}
        notify={notify}
        initialData={editingNote}
        selectedDate={selectedDate}
      />
    </div>
  );
}

function ImageNotesView({
  date,
  imageNotes,
  setImageNotes,
  notify,
  requestConfirm,
}) {
  const [topic, setTopic] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024)
        notify("Compressing large image...", "info");
      compressImage(file, (base64) => setImagePreview(base64));
    }
  };

  const handleAddNote = () => {
    if (!topic.trim()) return notify("Please specify a topic.", "error");
    if (!imagePreview) return notify("Please upload an image.", "error");
    const newNote = {
      id: Date.now().toString(),
      topic,
      image: imagePreview,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setImageNotes([...imageNotes, newNote]);
    setTopic("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    notify("Image Note Added!", "success");
  };

  const handleDelete = (id) => {
    requestConfirm("Delete this image note?", () => {
      setImageNotes(imageNotes.filter((note) => note.id !== id));
      notify("Note deleted", "info");
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: "28px" }}>Image Notes</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Capture visual notes for {date}
          </p>
        </div>
      </div>
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3
          style={{
            marginBottom: "16px",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <UploadCloud size={18} /> Add New Image Note
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: "1", minWidth: "250px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "6px",
              }}
            >
              Topic / Subject
            </label>
            <input
              type="text"
              className="custom-input"
              placeholder="e.g., Number Series Formula..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "6px",
                marginTop: "16px",
              }}
            >
              Select Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="custom-input"
              style={{ padding: "8px", cursor: "pointer" }}
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            <button
              className="btn"
              onClick={handleAddNote}
              style={{ marginTop: "16px", width: "100%" }}
            >
              <Plus size={16} /> Save Image Note
            </button>
          </div>
          <div
            style={{
              flex: "1",
              minWidth: "250px",
              border: "1px dashed var(--border)",
              borderRadius: "12px",
              minHeight: "180px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              background: "var(--bg)",
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "250px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "13px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <ImageIcon size={24} /> Image Preview
              </p>
            )}
          </div>
        </div>
      </div>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        Saved Visuals ({imageNotes.length})
      </h3>
      {imageNotes.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "40px",
            color: "var(--text-muted)",
          }}
        >
          No image notes stored for this date.
        </div>
      ) : (
        <div className="grid-2">
          {imageNotes.map((note) => (
            <div
              key={note.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "16px",
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
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600" }}>
                    {note.topic}
                  </h4>
                  <span
                    style={{ fontSize: "12px", color: "var(--text-muted)" }}
                  >
                    Added at {note.timestamp}
                  </span>
                </div>
                <button
                  className="icon-btn-minimal"
                  onClick={() => handleDelete(note.id)}
                  title="Delete Note"
                >
                  <Trash2 size={16} color="var(--text-muted)" />
                </button>
              </div>
              <div
                style={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "var(--bg)",
                  display: "flex",
                  justifyContent: "center",
                  border: "1px solid var(--border)",
                }}
              >
                <img
                  src={note.image}
                  alt={note.topic}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                    cursor: "zoom-in",
                  }}
                  onClick={() => {
                    const w = window.open("");
                    w.document.write(
                      `<img src="${note.image}" style="width:100%; height:100%; object-fit:contain; background:#000;" />`,
                    );
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DailyPlan({
  date,
  timeline,
  updateTimeline,
  saveAsDefault,
  notify,
  requestConfirm,
}) {
  const handleChange = (index, field, value) =>
    updateTimeline(
      timeline.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  const deleteTask = (index) => {
    updateTimeline(timeline.filter((_, i) => i !== index));
    notify("Task removed", "info");
  };
  const addTask = () => {
    updateTimeline([
      ...timeline,
      {
        time: "12:00",
        activity: "New Custom Task",
        checked: false,
        notes: "",
        isStudy: true,
      },
    ]);
    notify("New task added", "info");
  };
  const resetToday = () => {
    requestConfirm("Reset all tasks?", () => {
      updateTimeline(timeline.map((t) => ({ ...t, checked: false })));
      notify("Day reset successfully", "success");
    });
  };
  const handleSaveDefault = () => {
    requestConfirm("Set as default template?", () => {
      saveAsDefault();
      notify("Template saved!", "success");
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: "28px" }}>Daily Timeline</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Structurize your day for {date}
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button className="btn btn-outline" onClick={handleSaveDefault}>
            <Save size={16} />{" "}
            <span className="hide-on-mobile">Set Template</span>
          </button>
          <button className="btn" onClick={addTask}>
            <Plus size={16} /> Add Task
          </button>
          <button className="btn btn-outline" onClick={resetToday}>
            Reset
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
        {/* Continuous Vertical Line */}
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
          <AnimatePresence>
            {timeline?.map((item, i) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                key={i}
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "flex-start",
                  position: "relative",
                  zIndex: 1,
                  opacity: item.checked ? 0.6 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                {/* Checkbox Node */}
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
                    flexShrink: 0,
                    zIndex: 2,
                    boxShadow: item.checked
                      ? "0 0 10px rgba(16, 185, 129, 0.4)"
                      : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {item.checked && <CheckCircle2 size={16} color="white" />}
                </div>

                {/* Timeline Card */}
                <div
                  className="card"
                  style={{
                    flex: 1,
                    margin: 0,
                    padding: "16px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    borderLeft: `4px solid ${item.isStudy ? "var(--accent)" : "var(--warning)"}`,
                    boxShadow: item.checked ? "none" : "var(--shadow-md)",
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
                        onChange={(e) =>
                          handleChange(i, "time", e.target.value)
                        }
                        style={{
                          background: "rgba(99, 102, 241, 0.08)",
                          border: "none",
                          color: "var(--text-main)",
                          fontWeight: 600,
                          padding: "6px 10px",
                          borderRadius: "8px",
                          outline: "none",
                          fontSize: "14px",
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
                          background: "transparent",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: item.checked
                            ? "var(--text-muted)"
                            : "var(--text-main)",
                          textDecoration: item.checked
                            ? "line-through"
                            : "none",
                          flex: 1,
                          outline: "none",
                        }}
                        placeholder="Task Title..."
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
                        onClick={() =>
                          handleChange(i, "isStudy", !item.isStudy)
                        }
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
                        {item.isStudy ? "Study Session" : "Break / Other"}
                      </button>
                      <button
                        className="icon-btn-minimal"
                        onClick={() => deleteTask(i)}
                        title="Delete Task"
                      >
                        <Trash2 size={16} color="var(--text-muted)" />
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function QuantRotation({ quant = [], setQuant, notify }) {
  const [recommendation, setRecommendation] = useState("");
  const handleChange = (index, field, value) =>
    setQuant(
      quant.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  const handleRecommend = () => {
    if (!quant || quant.length === 0) return;
    const unread = quant.filter((q) => !q.checked);
    if (unread.length === 0) {
      setRecommendation(
        "Awesome! You've practiced every single topic for today.",
      );
      notify("All topics completed!", "success");
    } else {
      const randomIdx = Math.floor(Math.random() * unread.length);
      setRecommendation(
        `Today's Recommended Focus: ${unread[randomIdx].topic}`,
      );
      notify(`Recommendation: ${unread[randomIdx].topic}`, "info");
    }
  };
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: "28px" }}>Quant PDF Rotation</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Track topical proficiency and mistakes for the day.
          </p>
        </div>
        <button className="btn" onClick={handleRecommend}>
          <Sparkles size={16} />{" "}
          <span className="hide-on-mobile">Recommend Topic</span>
        </button>
      </div>
      {recommendation && (
        <div className="recommendation-banner">
          <span>{recommendation}</span>
          <button
            onClick={() => setRecommendation("")}
            className="icon-btn-minimal"
          >
            <X size={18} />
          </button>
        </div>
      )}
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
              placeholder="Mistakes/Notes..."
              value={item.notes}
              onChange={(e) => handleChange(i, "notes", e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReasoningRotation({ reasoning = [], setReasoning, notify }) {
  const [recommendation, setRecommendation] = useState("");
  const handleChange = (index, field, value) =>
    setReasoning(
      reasoning.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  const handleRecommend = () => {
    if (!reasoning || reasoning.length === 0) return;
    const unread = reasoning.filter((q) => !q.checked);
    if (unread.length === 0) {
      setRecommendation(
        "Incredible! You've practiced every reasoning topic for today.",
      );
      notify("All topics completed!", "success");
    } else {
      const rec = unread[Math.floor(Math.random() * unread.length)];
      setRecommendation(`Recommended Focus: ${rec.topic} (${rec.tier})`);
    }
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
        <button className="btn" onClick={handleRecommend}>
          <Sparkles size={16} />{" "}
          <span className="hide-on-mobile">Recommend Topic</span>
        </button>
      </div>
      {recommendation && (
        <div className="recommendation-banner">
          <span>{recommendation}</span>
          <button
            onClick={() => setRecommendation("")}
            className="icon-btn-minimal"
          >
            <X size={18} />
          </button>
        </div>
      )}
      <div className="grid-4">
        {reasoning.map((item, i) => (
          <div
            key={i}
            className={`topic-card ${item.checked ? "checked" : ""}`}
          >
            <div
              className="topic-card-header"
              style={{ marginBottom: "16px", alignItems: "flex-start" }}
            >
              <div>
                <span className={`tier-badge tier-${item.tier.slice(-1)}`}>
                  {item.tier}
                </span>
                <h4 style={{ fontSize: "15px", lineHeight: "1.4" }}>
                  {item.topic}
                </h4>
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
              placeholder="Mistakes/Notes..."
              value={item.notes}
              onChange={(e) => handleChange(i, "notes", e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function MockTracker({ mocks, setMocks, date, notify }) {
  const addMock = () => {
    setMocks([
      ...mocks,
      { date, name: "", score: "", accuracy: "", percentile: "", remarks: "" },
    ]);
    notify("Mock log entry created", "info");
  };
  const updateMock = (index, field, value) =>
    setMocks(mocks.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  const deleteMock = (index) => {
    setMocks(mocks.filter((_, i) => i !== index));
    notify("Mock result removed", "info");
  };
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: "28px" }}>Global Mock Tracker</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Log your scores across all dates to visualize progress.
          </p>
        </div>
        <button className="btn" onClick={addMock}>
          <Plus size={16} /> Add Result
        </button>
      </div>
      <div className="card table-wrapper" style={{ padding: "0" }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Test Name</th>
              <th>Score</th>
              <th>Accuracy(%)</th>
              <th>%ile</th>
              <th>Remarks</th>
              <th style={{ width: "60px" }}></th>
            </tr>
          </thead>
          <tbody>
            {mocks.map((m, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="date"
                    className="custom-input"
                    value={m.date}
                    onChange={(e) => updateMock(i, "date", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="custom-input"
                    placeholder="Name"
                    value={m.name}
                    onChange={(e) => updateMock(i, "name", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="custom-input"
                    placeholder="Score"
                    value={m.score}
                    onChange={(e) => updateMock(i, "score", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="custom-input"
                    placeholder="Acc"
                    value={m.accuracy}
                    onChange={(e) => updateMock(i, "accuracy", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="custom-input"
                    placeholder="%ile"
                    value={m.percentile}
                    onChange={(e) =>
                      updateMock(i, "percentile", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="custom-input"
                    placeholder="Errors..."
                    value={m.remarks}
                    onChange={(e) => updateMock(i, "remarks", e.target.value)}
                  />
                </td>
                <td>
                  <button
                    className="icon-btn-minimal"
                    onClick={() => deleteMock(i)}
                  >
                    <Trash size={16} color="var(--text-muted)" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {mocks.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--text-muted)",
            }}
          >
            No mock tests recorded yet. Hit 'Add Result' to start tracking.
          </div>
        )}
      </div>
    </div>
  );
}

function HabitTracker({
  selectedDate,
  habitsData,
  baseHabits,
  setAppData,
  notify,
  requestConfirm,
}) {
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
    habitsData[monthKey] ||
    (baseHabits || []).map((h) => ({
      name: h,
      days: Array(daysInMonth).fill(""),
    }));
  currentHabits.forEach((h) => {
    if (h.days)
      h.days = h.days.map((d) => (d === true ? "done" : d === false ? "" : d));
  });

  const updateHabits = (newHabits) =>
    setAppData((prev) => ({
      ...prev,
      baseHabits: newHabits.map((h) => h.name),
      habits: {
        ...(Array.isArray(prev.habits) ? {} : prev.habits || {}),
        [monthKey]: newHabits,
      },
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
  const handleScroll = (direction) => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({
        left: direction === "left" ? -350 : 350,
        behavior: "smooth",
      });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: "28px" }}>Habits Heatmap</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Consistency tracker for <strong>{monthName}</strong> ({daysInMonth}{" "}
            Days)
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            className={`btn ${isEditing ? "" : "btn-outline"}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <CheckSquare size={16} /> : <Edit3 size={16} />}{" "}
            <span className="hide-on-mobile">
              {isEditing ? "Done Editing" : "Edit Habits"}
            </span>
          </button>
          <button className="btn" onClick={addHabit}>
            <Plus size={16} /> <span className="hide-on-mobile">Add Habit</span>
          </button>
          <button
            className="icon-btn hide-on-mobile"
            onClick={() => handleScroll("left")}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="icon-btn hide-on-mobile"
            onClick={() => handleScroll("right")}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="card" style={{ padding: "24px 0" }}>
        <div className="habit-tracker-scroll" ref={scrollRef}>
          <div className="habit-header-row">
            {Array.from({ length: daysInMonth }, (_, i) => (
              <div key={i} className="habit-header-day">
                {i + 1}
              </div>
            ))}
          </div>
          {currentHabits.map((h, hIndex) => (
            <div key={hIndex} className="habit-row">
              {isEditing ? (
                <div className="habit-row-controls">
                  <input
                    type="text"
                    className="habit-name-input"
                    value={h.name}
                    onChange={(e) => handleNameChange(hIndex, e.target.value)}
                  />
                  <button
                    className="habit-delete-btn"
                    onClick={() => deleteHabit(hIndex)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <div className="habit-name" title={h.name}>
                  {h.name}
                </div>
              )}
              {Array.from({ length: daysInMonth }, (_, dIndex) => {
                const state = h.days && h.days[dIndex];
                const isDone = state === "done" || state === true,
                  isPartial = state === "partial",
                  isMissed = state === "missed";
                return (
                  <div
                    key={dIndex}
                    className={`habit-circle ${isDone ? "done" : ""} ${isPartial ? "partial" : ""} ${isMissed ? "missed" : ""}`}
                    onClick={() => toggleHabit(hIndex, dIndex)}
                  >
                    {isDone && <CheckCircle2 size={12} color="#fff" />}
                    {isPartial && (
                      <Minus size={12} color="#fff" strokeWidth={3} />
                    )}
                    {isMissed && <X size={12} color="#fff" strokeWidth={3} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="habit-legend">
          <div className="legend-item">
            <div
              className="habit-circle done"
              style={{
                width: 18,
                height: 18,
                pointerEvents: "none",
                transform: "none",
              }}
            >
              <CheckCircle2 size={10} color="#fff" />
            </div>
            <span>Done</span>
          </div>
          <div className="legend-item">
            <div
              className="habit-circle partial"
              style={{
                width: 18,
                height: 18,
                pointerEvents: "none",
                transform: "none",
              }}
            >
              <Minus size={10} color="#fff" strokeWidth={3} />
            </div>
            <span>Partial</span>
          </div>
          <div className="legend-item">
            <div
              className="habit-circle missed"
              style={{
                width: 18,
                height: 18,
                pointerEvents: "none",
                transform: "none",
              }}
            >
              <X size={10} color="#fff" strokeWidth={3} />
            </div>
            <span>Missed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsView({
  appData,
  setAppData,
  notify,
  requestConfirm,
  premiumData,
  setPremiumData,
  openUserModal,
}) {
  const exportData = () => {
    const combined = { ...appData, _premiumData: premiumData };
    const blob = new Blob([JSON.stringify(combined, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IBPS_Planner_Pro_Backup.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify("Full backup downloaded successfully!", "success");
  };
  return (
    <div className="card" style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>Settings</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
        Manage your local data and profile.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{ borderBottom: "1px solid var(--border)", paddingBottom: 24 }}
        >
          <label style={{ fontWeight: 600, display: "block", marginBottom: 4 }}>
            User Profile
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            <div
              className="icon-btn"
              style={{
                pointerEvents: "none",
                background: "rgba(99, 102, 241, 0.1)",
                color: "var(--accent)",
                border: "none",
              }}
            >
              <User size={18} />
            </div>
            <input
              type="text"
              className="custom-input"
              placeholder="Enter your name..."
              value={appData.profile?.name || ""}
              readOnly
              style={{ maxWidth: "300px", cursor: "not-allowed", opacity: 0.7 }}
            />
            <button
              className="btn btn-outline"
              onClick={openUserModal}
              style={{ padding: "6px 12px", fontSize: "13px" }}
            >
              <Edit3 size={14} /> Update Identity
            </button>
          </div>
        </div>
        <div
          style={{ borderBottom: "1px solid var(--border)", paddingBottom: 24 }}
        >
          <label style={{ fontWeight: 600, display: "block", marginBottom: 4 }}>
            Target Exam Date
          </label>
          <input
            type="date"
            className="custom-input"
            value={premiumData?.examDate || ""}
            onChange={(e) =>
              setPremiumData((p) => ({ ...p, examDate: e.target.value }))
            }
            style={{ maxWidth: "300px", marginTop: 12 }}
          />
        </div>
        <div>
          <button className="btn" onClick={exportData}>
            <Download size={16} /> Download Backup (Includes Premium Data)
          </button>
        </div>
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: 24,
            marginTop: 8,
          }}
        >
          <label
            style={{
              fontWeight: 600,
              color: "#EF4444",
              display: "block",
              marginBottom: 4,
            }}
          >
            Danger Zone
          </label>
          <button
            className="btn btn-danger"
            style={{ marginTop: "12px" }}
            onClick={() => {
              requestConfirm(
                "Delete ALL data forever? This action cannot be undone.",
                () => {
                  window.localStorage.clear();
                  notify("All data wiped. Refreshing...", "error");
                  setTimeout(() => window.location.reload(), 1500);
                },
              );
            }}
          >
            <Trash2 size={16} /> Factory Reset
          </button>
        </div>
      </div>
    </div>
  );
}
