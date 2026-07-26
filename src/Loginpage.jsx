/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { createClient } from "@supabase/supabase-js";
import {
  Target,
  LayoutDashboard,
  CalendarCheck,
  Calculator,
  LineChart,
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
  Lock,
  LogOut,
  Shield,
  File,
  Upload,
  Key,
} from "lucide-react";

// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- YOUR SECRET PASSCODE ---
const ADMIN_PASSCODE = "admin123"; // Change this to your preferred password

// ... [KEEP ALL YOUR EXISTING DEFAULT DATA AND HELPER FUNCTIONS HERE] ...

// --- SIMPLE PASSCODE MODAL ---
function PasscodeModal({ isOpen, onClose, onLoginSuccess, notify }) {
  const [passcode, setPasscode] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      notify("Admin access granted!", "success");
      onLoginSuccess();
      onClose();
      setPasscode("");
    } else {
      notify("Incorrect passcode", "error");
      setPasscode("");
    }
  };

  return (
    <div
      className="modal-overlay auth-overlay"
      onClick={onClose}
      style={{ zIndex: 10000 }}
    >
      <div
        className="modal-card auth-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auth-header">
          <Key
            size={40}
            color="var(--accent)"
            style={{ marginBottom: "16px" }}
          />
          <h2>Admin Access</h2>
          <p>Enter the master passcode to upload PDFs</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Passcode</label>
            <input
              type="password"
              className="custom-input"
              placeholder="••••••••"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              autoFocus
              required
            />
          </div>
          <button type="submit" className="btn btn-block auth-btn">
            Unlock Admin Features
          </button>
        </form>

        <button className="icon-btn-minimal close-auth" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

// --- GRAMMAR PDF LIBRARY COMPONENT ---
function GrammarLibrary({ notify, isAdmin }) {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const { data, error } = await supabase
        .from("grammar_pdfs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPdfs(data || []);
    } catch (error) {
      notify("Failed to load PDFs", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!title.trim() || !file) {
      return notify("Please provide a title and select a PDF file.", "error");
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("grammar_pdfs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("grammar_pdfs").getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("grammar_pdfs").insert([
        {
          title: title.trim(),
          file_name: file.name,
          file_url: publicUrl,
          size_kb: Math.round(file.size / 1024),
        },
      ]);

      if (dbError) throw dbError;

      notify("PDF Uploaded successfully!", "success");
      setTitle("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchPDFs();
    } catch (error) {
      notify(error.message || "Error uploading file", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, fileUrl) => {
    if (!window.confirm("Delete this PDF permanently?")) return;

    try {
      const fileName = fileUrl.split("/").pop();
      await supabase.storage.from("grammar_pdfs").remove([fileName]);
      await supabase.from("grammar_pdfs").delete().eq("id", id);

      notify("PDF deleted", "info");
      setPdfs(pdfs.filter((p) => p.id !== id));
    } catch (error) {
      notify("Failed to delete PDF", "error");
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: "28px" }}>English Grammar Library</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Access curated grammar materials, rules, and practice sets.
          </p>
        </div>
      </div>

      {isAdmin && (
        <div
          className="card admin-upload-card"
          style={{ marginBottom: "32px", border: "2px dashed var(--accent)" }}
        >
          <div className="admin-badge">
            <Shield size={14} /> Admin Mode Active
          </div>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <UploadCloud size={20} color="var(--accent)" /> Upload New Grammar
            PDF
          </h3>

          <div className="upload-grid">
            <div>
              <label className="input-label">Document Title</label>
              <input
                type="text"
                className="custom-input"
                placeholder="e.g. 120 Rules of Grammar"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">Select PDF File</label>
              <input
                type="file"
                accept=".pdf"
                className="custom-input file-input"
                onChange={(e) => setFile(e.target.files[0])}
                ref={fileInputRef}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                className="btn btn-block"
                onClick={handleUpload}
                disabled={uploading}
                style={{ height: "42px" }}
              >
                {uploading ? (
                  <Loader2 size={16} className="spinner" />
                ) : (
                  <>
                    <Upload size={16} /> Publish PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Loader2 size={40} className="spinner" color="var(--accent)" />
          <p style={{ marginTop: "16px", color: "var(--text-muted)" }}>
            Loading Library...
          </p>
        </div>
      ) : pdfs.length === 0 ? (
        <div className="card empty-state">
          <FileText size={48} />
          <h3>Library is Empty</h3>
          <p>No grammar PDFs have been uploaded yet.</p>
        </div>
      ) : (
        <div className="pdf-grid">
          {pdfs.map((pdf) => (
            <div key={pdf.id} className="card pdf-card">
              <div className="pdf-icon-wrapper">
                <File size={32} color="#EF4444" />
              </div>
              <div className="pdf-info">
                <h4 className="pdf-title" title={pdf.title}>
                  {pdf.title}
                </h4>
                <div className="pdf-meta">
                  <span>{new Date(pdf.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{pdf.size_kb} KB</span>
                </div>
              </div>
              <div className="pdf-actions">
                <a
                  href={pdf.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline pdf-btn"
                >
                  <BookOpen size={14} /> Read
                </a>
                <a href={pdf.file_url} download className="btn pdf-btn">
                  <Download size={14} />
                </a>
                {isAdmin && (
                  <button
                    className="icon-btn-minimal"
                    onClick={() => handleDelete(pdf.id, pdf.file_url)}
                    style={{ marginLeft: "auto", color: "var(--danger)" }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState(getFormattedDateStr());
  const [toasts, setToasts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  // BASIC ADMIN STATE
  const [isAdmin, setIsAdmin] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // ... [KEEP YOUR EXISTING LocalStorage LOGIC HERE: appData, currentHistory, updateHistory, notify, etc] ...

  return (
    <div className="app-container">
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="logo">
          <div className="icon-wrap">
            <Target size={20} />
          </div>
          IBPS Planner{" "}
          <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>
            Pro
          </span>
        </div>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          {[
            {
              id: "dashboard",
              icon: LayoutDashboard,
              label: "Dashboard & Quiz",
            },
            { id: "today", icon: CalendarCheck, label: "Daily Plan" },
            { id: "vocab", icon: BookText, label: "Dictionary & Vocab" },
            { id: "grammar", icon: BookOpen, label: "Grammar PDFs" },
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
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>

        {/* BASIC PASSWORD FOOTER IN SIDEBAR */}
        <div className="sidebar-footer">
          {isAdmin ? (
            <div className="user-profile-badge">
              <div className="user-info">
                <Shield size={16} color="var(--accent)" />
                <span>Admin Mode</span>
              </div>
              <button
                className="icon-btn-minimal"
                onClick={() => {
                  setIsAdmin(false);
                  notify("Admin mode locked", "info");
                }}
                title="Lock"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-outline btn-block"
              onClick={() => setAuthModalOpen(true)}
              style={{ justifyContent: "center" }}
            >
              <Lock size={16} /> Unlock Admin
            </button>
          )}
        </div>
      </aside>

      <main className="main-content">
        {/* ... [KEEP EXISTING HEADER COMPONENT HERE] ... */}

        <div className="content-area">
          {/* ... [KEEP EXISTING VIEW RENDERS HERE] ... */}

          {activeView === "grammar" && (
            <GrammarLibrary notify={notify} isAdmin={isAdmin} />
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

      {/* PASSCODE MODAL */}
      <PasscodeModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        notify={notify}
        onLoginSuccess={() => setIsAdmin(true)}
      />
    </div>
  );
}

// ... [KEEP ALL OTHER COMPONENTS: Header, VocabQuiz, Dashboard, etc.] ...
