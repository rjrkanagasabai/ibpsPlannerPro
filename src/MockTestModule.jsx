import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Save,
  AlertCircle,
  FileText,
  RotateCcw,
  Lock,
  Bookmark,
  Check,
  Loader2,
  Filter,
  Eye,
  ArrowLeft,
  Info,
  Plus,
  LineChart,
  Edit3,
  Trash2,
} from "lucide-react";

// --- SUPABASE CLIENT IMPORT ---
import { supabase } from "./supabase";

// =========================================================================
// 1. PARENT DASHBOARD (Manages shared state scoped to the logged-in user)
// =========================================================================
export default function MockTestDashboard() {
  const [user, setUser] = useState(null);
  const [mocks, setMocks] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  // Initialize authenticated user and load their logs
  useEffect(() => {
    const initializeAuthAndData = async () => {
      setIsLoadingLogs(true);
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) throw authError;

        setUser(user);

        if (user) {
          await fetchMockLogs(user.id);
        } else {
          setMocks([]);
        }
      } catch (err) {
        console.error("Authentication or fetch error:", err);
      } finally {
        setIsLoadingLogs(false);
      }
    };

    initializeAuthAndData();

    // Listen for auth state changes (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          fetchMockLogs(currentUser.id);
        } else {
          setMocks([]);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch only logs belonging to the active user ID
  const fetchMockLogs = async (userId) => {
    if (!userId) return;
    setIsLoadingLogs(true);
    try {
      const { data, error } = await supabase
        .from("mock_logs")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) throw error;
      setMocks(data || []);
    } catch (err) {
      console.error("Error fetching user mock logs:", err);
      setMocks([]);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Callback passed to MockTestModule with user_id attached
  const handleSaveScore = async (result) => {
    if (!user) {
      alert("Please sign in to save your test scores.");
      return;
    }

    const newMockLog = {
      user_id: user.id, // Scope log to current user
      date: new Date().toISOString().split("T")[0],
      name: result.name,
      score: result.score,
      remarks: result.remarks,
    };

    try {
      const { data, error } = await supabase
        .from("mock_logs")
        .insert([newMockLog])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setMocks((prev) => [data[0], ...prev]);
      }
    } catch (err) {
      console.error("Error saving score to database:", err);
      setMocks((prev) => [
        { ...newMockLog, id: Date.now().toString() },
        ...prev,
      ]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        paddingBottom: "40px",
      }}
    >
      {/* EXAM MODULE */}
      <MockTestModule onSaveScore={handleSaveScore} />

      {/* DIVIDER */}
      <hr
        style={{
          border: "none",
          borderTop: "1px dashed var(--border)",
          margin: 0,
        }}
      />

      {/* TRACKER MODULE (Scoped to current user) */}
      <MockTracker
        user={user}
        mocks={mocks}
        setMocks={setMocks}
        isLoadingLogs={isLoadingLogs}
      />
    </div>
  );
}

// =========================================================================
// 2. MOCK TEST MODULE
// =========================================================================
export function MockTestModule({ onSaveScore }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [view, setView] = useState("list");
  const [activeTest, setActiveTest] = useState(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [sectionTimeLeft, setSectionTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptedTests, setAttemptedTests] = useState(new Set());

  useEffect(() => {
    fetchMockTestsFromBackend();
  }, []);

  const fetchMockTestsFromBackend = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("mock_tests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTests(data && data.length > 0 ? data : []);
    } catch (err) {
      console.error("Error fetching mock tests:", err);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer = null;
    if (view === "exam" && sectionTimeLeft > 0) {
      timer = setInterval(() => {
        setSectionTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (view === "exam" && sectionTimeLeft === 0) {
      handleSectionTimeout();
    }
    return () => clearInterval(timer);
  }, [view, sectionTimeLeft]);

  const handleSectionTimeout = () => {
    if (!activeTest) return;
    if (activeSectionIndex < activeTest.sections.length - 1) {
      const nextSectionIdx = activeSectionIndex + 1;
      setActiveSectionIndex(nextSectionIdx);
      setCurrentIndex(0);
      setSectionTimeLeft(activeTest.sections[nextSectionIdx].duration * 60);
    } else {
      submitExam();
    }
  };

  const startExam = (test) => {
    setActiveTest(test);
    setActiveSectionIndex(0);
    setCurrentIndex(0);
    setAnswers({});
    setMarkedForReview({});
    setSectionTimeLeft(test.sections[0].duration * 60);
    setView("exam");
  };

  const handleSelectOption = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const clearResponse = (qId) => {
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[qId];
      return updated;
    });
  };

  const toggleMarkForReview = (qId) => {
    setMarkedForReview((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleNextSectionManual = () => {
    if (activeSectionIndex < activeTest.sections.length - 1) {
      const nextSectionIdx = activeSectionIndex + 1;
      setActiveSectionIndex(nextSectionIdx);
      setCurrentIndex(0);
      setSectionTimeLeft(activeTest.sections[nextSectionIdx].duration * 60);
    } else {
      submitExam();
    }
  };

  const submitExam = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAttemptedTests((prev) => new Set(prev).add(activeTest.id));
      setView("result");
    }, 800);
  };

  const openSolutions = () => {
    setActiveSectionIndex(0);
    setCurrentIndex(0);
    setView("solution");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const filteredTests = tests.filter((t) => {
    if (categoryFilter !== "ALL" && t.category !== categoryFilter) return false;
    if (typeFilter !== "ALL" && t.exam_type !== typeFilter) return false;
    return true;
  });

  // --- VIEW 1: TEST LIST ---
  if (view === "list") {
    return (
      <div style={{ animation: "fadeIn 0.4s ease" }}>
        <div className="page-header" style={{ marginBottom: "24px" }}>
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "800",
                color: "var(--text-main)",
              }}
            >
              Mock Tests
            </h1>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "32px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--text-muted)",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            <Filter size={16} /> Filters:
          </div>
          {["ALL", "IBPS", "SBI", "RRB"].map((cat) => (
            <button
              key={cat}
              className={`btn ${categoryFilter === cat ? "" : "btn-outline"}`}
              style={{
                padding: "6px 16px",
                fontSize: "12px",
                borderRadius: "20px",
              }}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
          <div
            style={{
              width: "1px",
              height: "20px",
              background: "var(--border)",
              margin: "0 4px",
            }}
          />
          {["ALL", "PO", "Clerk"].map((type) => (
            <button
              key={type}
              className={`btn ${typeFilter === type ? "" : "btn-outline"}`}
              style={{
                padding: "6px 16px",
                fontSize: "12px",
                borderRadius: "20px",
              }}
              onClick={() => setTypeFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {loading ? (
          <div
            style={{
              padding: "60px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            <Loader2
              size={36}
              className="spinner"
              style={{
                margin: "0 auto 12px auto",
                animation: "spin 1s linear infinite",
              }}
            />
            <p>Loading backend test modules...</p>
          </div>
        ) : filteredTests.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--text-muted)",
              background: "var(--bg)",
              border: "1px dashed var(--border)",
              borderRadius: "16px",
            }}
          >
            <AlertCircle
              size={36}
              style={{
                opacity: 0.5,
                margin: "0 auto 12px auto",
                display: "block",
              }}
            />
            <p style={{ fontWeight: 600, fontSize: "16px" }}>
              No tests available right now.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {filteredTests.map((test) => {
              const totalMins = test.sections.reduce(
                (acc, s) => acc + (s.duration || 0),
                0,
              );
              const totalQuestions = test.sections.reduce(
                (acc, s) => acc + (s.questions?.length || 0),
                0,
              );
              const hasAttempted = attemptedTests.has(test.id);

              return (
                <motion.div
                  whileHover={{
                    y: -4,
                    boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                  }}
                  key={test.id}
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "24px",
                    borderRadius: "16px",
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    transition: "all 0.2s ease",
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
                    <h3
                      style={{
                        fontSize: "18px",
                        margin: 0,
                        fontWeight: 800,
                        color: "var(--text-main)",
                        lineHeight: 1.3,
                      }}
                    >
                      {test.name}
                    </h3>
                    <span
                      style={{
                        background: "rgba(99, 102, 241, 0.1)",
                        color: "var(--accent)",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      {test.category} {test.exam_type}
                    </span>
                  </div>

                  <div
                    style={{
                      marginBottom: "20px",
                      display: "flex",
                      gap: "16px",
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Clock size={14} color="var(--accent)" /> {totalMins} Mins
                      (Sectional)
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <FileText size={14} color="var(--secondary)" />{" "}
                      {totalQuestions} Qs
                    </span>
                  </div>

                  <div
                    style={{
                      background: "rgba(0,0,0,0.02)",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      marginBottom: "24px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Section Timings
                    </span>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                    >
                      {test.sections.map((sec, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            background: "var(--bg)",
                            border: "1px solid var(--border)",
                            borderRadius: "4px",
                            color: "var(--text-main)",
                            fontWeight: 600,
                          }}
                        >
                          {sec.name}: {sec.duration}m
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    className={`btn ${hasAttempted ? "btn-outline" : ""}`}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      marginTop: "auto",
                      padding: "12px",
                      fontWeight: 700,
                      borderRadius: "10px",
                    }}
                    onClick={() => startExam(test)}
                  >
                    {hasAttempted ? (
                      <>
                        <RotateCcw size={16} /> Reattempt Test
                      </>
                    ) : (
                      <>
                        <Play size={16} /> Start Test
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // --- VIEW 2: LIVE EXAM ---
  if (view === "exam" && activeTest) {
    const activeSection = activeTest.sections[activeSectionIndex];
    const currentQuestion = activeSection.questions[currentQuestionIndex];
    const isAnswered = !!answers[currentQuestion.id];
    const isMarked = !!markedForReview[currentQuestion.id];

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 40px)",
          minHeight: "600px",
          background: "var(--bg)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 28px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#ffffff",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 800,
                margin: 0,
                color: "var(--text-main)",
              }}
            >
              {activeTest.name}
            </h2>
            <span
              style={{
                fontSize: "13px",
                color: "var(--accent)",
                fontWeight: 700,
              }}
            >
              Section {activeSectionIndex + 1} of {activeTest.sections.length}:{" "}
              {activeSection.name}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(239, 68, 68, 0.08)",
                color: "var(--danger)",
                padding: "8px 16px",
                borderRadius: "10px",
                fontWeight: 800,
                fontFamily: "monospace",
                fontSize: "18px",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <Clock size={18} /> {formatTime(sectionTimeLeft)}
            </div>
            <button
              className="btn btn-outline"
              style={{
                borderColor: "var(--danger)",
                color: "var(--danger)",
                fontSize: "13px",
                padding: "8px 16px",
                borderRadius: "10px",
              }}
              onClick={submitExam}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Test"}
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border)",
            background: "rgba(0,0,0,0.02)",
            overflowX: "auto",
          }}
        >
          {activeTest.sections.map((sec, idx) => {
            const isActive = idx === activeSectionIndex;
            const isCompleted = idx < activeSectionIndex;
            return (
              <div
                key={idx}
                style={{
                  padding: "14px 24px",
                  fontSize: "13px",
                  fontWeight: 700,
                  borderBottom: isActive
                    ? "3px solid var(--accent)"
                    : "3px solid transparent",
                  color: isActive
                    ? "var(--accent)"
                    : isCompleted
                      ? "var(--secondary)"
                      : "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: isActive ? "#ffffff" : "transparent",
                  cursor: "default",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                }}
              >
                {isCompleted ? (
                  <Check size={14} />
                ) : idx > activeSectionIndex ? (
                  <Lock size={12} />
                ) : null}
                {sec.name} ({sec.duration}m)
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "32px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Question {currentQuestionIndex + 1}{" "}
                <span style={{ opacity: 0.5 }}>
                  / {activeSection.questions.length}
                </span>
              </span>
              <span
                style={{
                  fontSize: "12px",
                  background: "rgba(99, 102, 241, 0.08)",
                  color: "var(--accent)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontWeight: 700,
                }}
              >
                +1.00 | -0.25 Marks
              </span>
            </div>

            <h3
              style={{
                fontSize: "18px",
                lineHeight: 1.7,
                fontWeight: 600,
                color: "var(--text-main)",
                marginBottom: "32px",
                whiteSpace: "pre-wrap",
              }}
            >
              {currentQuestion.text}
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                marginBottom: "32px",
              }}
            >
              {currentQuestion.options.map((opt, i) => {
                const isSelected = answers[currentQuestion.id] === opt;
                return (
                  <label
                    key={i}
                    onClick={() => handleSelectOption(currentQuestion.id, opt)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px 20px",
                      border: isSelected
                        ? "2px solid var(--accent)"
                        : "1px solid var(--border)",
                      background: isSelected
                        ? "rgba(99,102,241,0.04)"
                        : "#ffffff",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: isSelected
                        ? "0 4px 12px rgba(99,102,241,0.1)"
                        : "none",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: isSelected
                          ? "6px solid var(--accent)"
                          : "2px solid var(--border)",
                        background: "#fff",
                        transition: "all 0.2s ease",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "var(--text-main)",
                      }}
                    >
                      {opt}
                    </span>
                  </label>
                );
              })}
            </div>

            <div
              style={{
                marginTop: "auto",
                paddingTop: "24px",
                borderTop: "1px dashed var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  className="btn btn-outline"
                  style={{
                    fontSize: "13px",
                    padding: "10px 16px",
                    borderRadius: "8px",
                  }}
                  onClick={() => toggleMarkForReview(currentQuestion.id)}
                >
                  <Bookmark
                    size={16}
                    fill={isMarked ? "currentColor" : "none"}
                  />{" "}
                  {isMarked ? "Unmark Review" : "Mark for Review"}
                </button>
                <button
                  className="btn btn-outline"
                  style={{
                    fontSize: "13px",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    opacity: isAnswered ? 1 : 0.5,
                  }}
                  onClick={() => clearResponse(currentQuestion.id)}
                  disabled={!isAnswered}
                >
                  Clear Response
                </button>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  className="btn btn-outline"
                  onClick={() =>
                    setCurrentIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentQuestionIndex === 0}
                  style={{
                    padding: "10px 16px",
                    fontSize: "14px",
                    borderRadius: "8px",
                  }}
                >
                  <ChevronLeft size={18} /> Prev
                </button>
                {currentQuestionIndex < activeSection.questions.length - 1 ? (
                  <button
                    className="btn"
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    style={{
                      padding: "10px 20px",
                      fontSize: "14px",
                      borderRadius: "8px",
                    }}
                  >
                    Save & Next <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    className="btn"
                    onClick={handleNextSectionManual}
                    style={{
                      background: "var(--secondary)",
                      color: "white",
                      padding: "10px 20px",
                      fontSize: "14px",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  >
                    {activeSectionIndex < activeTest.sections.length - 1
                      ? "Submit Section & Proceed"
                      : "Final Submit Test"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              width: "280px",
              borderLeft: "1px solid var(--border)",
              background: "rgba(0,0,0,0.015)",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                padding: "18px 20px",
                borderBottom: "1px solid var(--border)",
                fontWeight: 800,
                fontSize: "14px",
                color: "var(--text-main)",
              }}
            >
              {activeSection.name} Palette
            </div>
            <div
              style={{
                padding: "20px",
                flex: 1,
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px",
                alignContent: "start",
              }}
            >
              {activeSection.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAns = !!answers[q.id];
                const isMrk = !!markedForReview[q.id];

                let bg = "#ffffff",
                  color = "var(--text-main)",
                  border = "1px solid var(--border)";
                if (isAns && isMrk) {
                  bg = "#8b5cf6";
                  color = "white";
                  border = "1px solid #8b5cf6";
                } else if (isAns) {
                  bg = "#10b981";
                  color = "white";
                  border = "1px solid #10b981";
                } else if (isMrk) {
                  bg = "#f59e0b";
                  color = "white";
                  border = "1px solid #f59e0b";
                }

                if (isCurrent) {
                  border = "2px solid var(--accent)";
                  if (!isAns && !isMrk) {
                    bg = "rgba(99,102,241,0.1)";
                    color = "var(--accent)";
                  }
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      aspectRatio: "1/1",
                      borderRadius: "8px",
                      background: bg,
                      color: color,
                      border: border,
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s ease",
                      boxShadow: isCurrent
                        ? "0 4px 8px rgba(0,0,0,0.1)"
                        : "none",
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "12px",
                fontWeight: 600,
                background: "#ffffff",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    background: "#10b981",
                    borderRadius: "4px",
                  }}
                />{" "}
                Answered
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    background: "#f59e0b",
                    borderRadius: "4px",
                  }}
                />{" "}
                Marked for Review
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    background: "#ffffff",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                  }}
                />{" "}
                Unattempted
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- VIEW 3: RESULT ---
  if (view === "result" && activeTest) {
    let totalScore = 0,
      totalCorrect = 0,
      totalIncorrect = 0,
      totalUnattempted = 0;

    const sectionStats = activeTest.sections.map((sec) => {
      let secCorrect = 0,
        secIncorrect = 0,
        secUnattempted = 0;
      sec.questions.forEach((q) => {
        const uAns = answers[q.id];
        if (!uAns) secUnattempted++;
        else if (uAns === q.correctAnswer) secCorrect++;
        else secIncorrect++;
      });
      const secScore = secCorrect * 1 - secIncorrect * 0.25;
      totalCorrect += secCorrect;
      totalIncorrect += secIncorrect;
      totalUnattempted += secUnattempted;
      totalScore += secScore;
      return {
        name: sec.name,
        totalQ: sec.questions.length,
        correct: secCorrect,
        incorrect: secIncorrect,
        unattempted: secUnattempted,
        score: secScore,
      };
    });

    return (
      <div style={{ animation: "fadeIn 0.4s ease" }}>
        <div className="page-header" style={{ marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "800" }}>
              Performance Report
            </h1>
            <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
              Detailed scorecard for {activeTest.name}
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button className="btn btn-outline" onClick={() => setView("list")}>
              <ArrowLeft size={16} /> Back to Tests
            </button>
            <button
              className="btn"
              style={{ background: "var(--accent)" }}
              onClick={openSolutions}
            >
              <Eye size={16} /> View Solutions
            </button>

            {onSaveScore && (
              <button
                className="btn"
                style={{ background: "var(--secondary)" }}
                onClick={() => {
                  onSaveScore({
                    name: activeTest.name,
                    score: totalScore.toFixed(2),
                    remarks: `Score: ${totalScore.toFixed(2)} (${totalCorrect}C / ${totalIncorrect}W)`,
                  });
                  setView("list");
                }}
              >
                <Save size={16} /> Save to Tracker
              </button>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "32px",
              borderRadius: "16px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Total Score
            </span>
            <h2
              style={{
                fontSize: "48px",
                fontWeight: 800,
                color: "var(--accent)",
                margin: "12px 0 0 0",
              }}
            >
              {totalScore.toFixed(2)}
            </h2>
          </div>
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "32px",
              borderRadius: "16px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Accuracy
            </span>
            <h2
              style={{
                fontSize: "48px",
                fontWeight: 800,
                color: "var(--secondary)",
                margin: "12px 0 0 0",
              }}
            >
              {(
                (totalCorrect / (totalCorrect + totalIncorrect || 1)) *
                100
              ).toFixed(0)}
              %
            </h2>
          </div>
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "32px",
              borderRadius: "16px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Attempted
            </span>
            <h2
              style={{
                fontSize: "48px",
                fontWeight: 800,
                color: "var(--text-main)",
                margin: "12px 0 0 0",
              }}
            >
              {totalCorrect + totalIncorrect}{" "}
              <span
                style={{
                  fontSize: "20px",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                / {totalCorrect + totalIncorrect + totalUnattempted}
              </span>
            </h2>
          </div>
        </div>

        <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "16px" }}>
          Section-Wise Breakdown
        </h3>
        <div
          className="card"
          style={{
            padding: 0,
            overflow: "hidden",
            marginBottom: "32px",
            borderRadius: "16px",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "rgba(0,0,0,0.03)",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  <th style={{ padding: "16px 24px" }}>Section Name</th>
                  <th style={{ padding: "16px 24px" }}>Questions</th>
                  <th style={{ padding: "16px 24px" }}>Correct</th>
                  <th style={{ padding: "16px 24px" }}>Incorrect</th>
                  <th style={{ padding: "16px 24px" }}>Unattempted</th>
                  <th style={{ padding: "16px 24px" }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {sectionStats.map((sec, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td
                      style={{
                        padding: "16px 24px",
                        fontWeight: 700,
                        color: "var(--text-main)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sec.name}
                    </td>
                    <td style={{ padding: "16px 24px" }}>{sec.totalQ}</td>
                    <td
                      style={{
                        padding: "16px 24px",
                        color: "var(--secondary)",
                        fontWeight: 700,
                      }}
                    >
                      {sec.correct}
                    </td>
                    <td
                      style={{
                        padding: "16px 24px",
                        color: "var(--danger)",
                        fontWeight: 700,
                      }}
                    >
                      {sec.incorrect}
                    </td>
                    <td
                      style={{
                        padding: "16px 24px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {sec.unattempted}
                    </td>
                    <td
                      style={{
                        padding: "16px 24px",
                        fontWeight: 800,
                        color: "var(--accent)",
                        fontSize: "16px",
                      }}
                    >
                      {sec.score.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 4: SOLUTIONS ---
  if (view === "solution" && activeTest) {
    const activeSection = activeTest.sections[activeSectionIndex];
    const currentQuestion = activeSection.questions[currentQuestionIndex];
    const userAnswer = answers[currentQuestion.id];
    const isCorrect = userAnswer === currentQuestion.correctAnswer;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 40px)",
          minHeight: "600px",
          background: "var(--bg)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 28px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#ffffff",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 800,
              margin: 0,
              color: "var(--text-main)",
            }}
          >
            Review Solutions: {activeTest.name}
          </h2>
          <button
            className="btn btn-outline"
            onClick={() => setView("result")}
            style={{
              fontSize: "13px",
              padding: "8px 16px",
              borderRadius: "10px",
            }}
          >
            <ArrowLeft size={16} /> Back to Results
          </button>
        </div>

        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border)",
            background: "rgba(0,0,0,0.02)",
            padding: "0 20px",
            overflowX: "auto",
          }}
        >
          {activeTest.sections.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveSectionIndex(idx);
                setCurrentIndex(0);
              }}
              style={{
                padding: "14px 24px",
                fontSize: "13px",
                fontWeight: 700,
                borderBottom:
                  idx === activeSectionIndex
                    ? "3px solid var(--accent)"
                    : "3px solid transparent",
                color:
                  idx === activeSectionIndex
                    ? "var(--accent)"
                    : "var(--text-muted)",
                background:
                  idx === activeSectionIndex ? "#ffffff" : "transparent",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {sec.name}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "32px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Question {currentQuestionIndex + 1}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  padding: "6px 12px",
                  borderRadius: "8px",
                  background: !userAnswer
                    ? "rgba(0,0,0,0.05)"
                    : isCorrect
                      ? "rgba(16, 185, 129, 0.1)"
                      : "rgba(239, 68, 68, 0.1)",
                  color: !userAnswer
                    ? "var(--text-muted)"
                    : isCorrect
                      ? "#10b981"
                      : "#ef4444",
                }}
              >
                {!userAnswer
                  ? "Unattempted"
                  : isCorrect
                    ? "Correct (+1.00)"
                    : "Incorrect (-0.25)"}
              </span>
            </div>

            <h3
              style={{
                fontSize: "18px",
                lineHeight: 1.7,
                fontWeight: 600,
                color: "var(--text-main)",
                marginBottom: "24px",
                whiteSpace: "pre-wrap",
              }}
            >
              {currentQuestion.text}
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                marginBottom: "32px",
              }}
            >
              {currentQuestion.options.map((opt, i) => {
                const isUsersChoice = userAnswer === opt;
                const isActualCorrect = currentQuestion.correctAnswer === opt;
                let borderColor = "var(--border)",
                  bgColor = "#ffffff",
                  icon = null;

                if (isActualCorrect) {
                  borderColor = "#10b981";
                  bgColor = "rgba(16, 185, 129, 0.05)";
                  icon = <CheckCircle2 size={20} color="#10b981" />;
                } else if (isUsersChoice && !isActualCorrect) {
                  borderColor = "#ef4444";
                  bgColor = "rgba(239, 68, 68, 0.05)";
                  icon = <XCircle size={20} color="#ef4444" />;
                }

                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                      padding: "16px 20px",
                      border: `2px solid ${borderColor}`,
                      background: bgColor,
                      borderRadius: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: isActualCorrect ? 600 : 500,
                        color: isActualCorrect ? "#10b981" : "var(--text-main)",
                      }}
                    >
                      {opt}
                    </span>
                    {icon}
                  </div>
                );
              })}
            </div>

            {/* MODERN EXPLANATION BLOCK */}
            <div
              style={{
                padding: "24px",
                background: "#F8F9FE",
                borderLeft: "6px solid #6366f1",
                borderRadius: "8px",
                marginTop: "32px",
                boxShadow: "0 2px 8px rgba(99, 102, 241, 0.04)",
              }}
            >
              <h4
                style={{
                  margin: "0 0 16px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#6366f1",
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "0.3px",
                }}
              >
                <Info size={20} strokeWidth={2.5} /> Explanation
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  lineHeight: 1.8,
                  color: "#374151",
                  whiteSpace: "pre-wrap",
                }}
              >
                {currentQuestion.explanation ||
                  `The correct answer is "${currentQuestion.correctAnswer}". No detailed explanation provided for this question.`}
              </p>
            </div>

            <div
              style={{
                paddingTop: "24px",
                marginTop: "24px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button
                className="btn btn-outline"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                style={{ padding: "10px 16px", borderRadius: "8px" }}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                className="btn btn-outline"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(activeSection.questions.length - 1, prev + 1),
                  )
                }
                disabled={
                  currentQuestionIndex === activeSection.questions.length - 1
                }
                style={{ padding: "10px 16px", borderRadius: "8px" }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div
            style={{
              width: "280px",
              borderLeft: "1px solid var(--border)",
              background: "rgba(0,0,0,0.015)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "18px 20px",
                borderBottom: "1px solid var(--border)",
                fontWeight: 800,
                fontSize: "14px",
              }}
            >
              Question Map
            </div>
            <div
              style={{
                padding: "20px",
                flex: 1,
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px",
                alignContent: "start",
              }}
            >
              {activeSection.questions.map((q, idx) => {
                const uAns = answers[q.id];
                const isCurr = idx === currentQuestionIndex;
                let bg = "#ffffff",
                  color = "var(--text-main)",
                  border = "1px solid var(--border)";

                if (!uAns) {
                  bg = "#f3f4f6";
                  border = "1px solid var(--border)";
                } else if (uAns === q.correctAnswer) {
                  bg = "#10b981";
                  color = "white";
                  border = "1px solid #10b981";
                } else {
                  bg = "#ef4444";
                  color = "white";
                  border = "1px solid #ef4444";
                }
                if (isCurr) border = "2px solid #000";

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      aspectRatio: "1/1",
                      borderRadius: "8px",
                      background: bg,
                      color: color,
                      border: border,
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}

// =========================================================================
// 3. MOCK TRACKER COMPONENT (Scoped to `user`)
// =========================================================================
export function MockTracker({ user, mocks, setMocks, isLoadingLogs }) {
  // Create a record scoped to the logged-in user
  const addMock = async () => {
    if (!user) {
      alert("Please sign in to add custom mock records.");
      return;
    }

    const newMock = {
      user_id: user.id, // Associate record with user
      date: new Date().toISOString().split("T")[0],
      name: "",
      score: "",
      remarks: "",
    };

    try {
      const { data, error } = await supabase
        .from("mock_logs")
        .insert([newMock])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setMocks((prev) => [data[0], ...prev]);
      }
    } catch (err) {
      console.error("Error creating new manual log:", err);
    }
  };

  // Update local state instantly for smooth typing
  const handleLocalUpdate = (id, field, value) => {
    setMocks((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  // Push update to DB only for user's record
  const handleDatabaseUpdate = async (id, field, value) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("mock_logs")
        .update({ [field]: value })
        .eq("id", id)
        .eq("user_id", user.id); // Guard query by user_id

      if (error) throw error;
    } catch (err) {
      console.error("Error updating database:", err);
    }
  };

  // Delete record from DB
  const deleteMock = async (id) => {
    if (!user) return;
    setMocks((prev) => prev.filter((m) => m.id !== id));

    try {
      const { error } = await supabase
        .from("mock_logs")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id); // Guard query by user_id

      if (error) throw error;
    } catch (err) {
      console.error("Error deleting log:", err);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: 800 }}>
            Mock Test Analytics
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            Log mock tests to analyze your performance growth.
          </p>
        </div>
        <button className="btn" onClick={addMock} disabled={!user}>
          <Plus size={16} /> Log Manual Test
        </button>
      </div>

      {!user ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "var(--text-muted)",
            borderRadius: "16px",
          }}
        >
          <AlertCircle
            size={36}
            style={{ margin: "0 auto 12px auto", opacity: 0.5 }}
          />
          Please log in to view and manage your mock test analytics.
        </div>
      ) : isLoadingLogs ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <Loader2
            size={36}
            className="spinner"
            style={{
              margin: "0 auto 12px auto",
              animation: "spin 1s linear infinite",
            }}
          />
          <p>Loading your logs...</p>
        </div>
      ) : mocks.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--text-muted)",
            borderRadius: "16px",
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
          No mock tests logged yet. Take a test above or click "Log Manual
          Test".
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {mocks.map((m) => (
            <div
              key={m.id}
              className="card"
              style={{
                padding: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                borderRadius: "16px",
              }}
            >
              {/* TOP HEADER ROW */}
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
                  {/* DATE */}
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
                      value={m.date || ""}
                      onChange={(e) =>
                        handleLocalUpdate(m.id, "date", e.target.value)
                      }
                      onBlur={(e) =>
                        handleDatabaseUpdate(m.id, "date", e.target.value)
                      }
                      style={{
                        padding: "8px",
                        fontSize: "13px",
                        borderRadius: "6px",
                        border: "1px solid var(--border)",
                      }}
                    />
                  </div>

                  {/* NAME */}
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
                      value={m.name || ""}
                      onChange={(e) =>
                        handleLocalUpdate(m.id, "name", e.target.value)
                      }
                      onBlur={(e) =>
                        handleDatabaseUpdate(m.id, "name", e.target.value)
                      }
                      style={{
                        padding: "8px",
                        fontSize: "15px",
                        fontWeight: 600,
                        border: "none",
                        background: "transparent",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => deleteMock(m.id)}
                  style={{
                    color: "var(--danger)",
                    background: "rgba(239,68,68,0.1)",
                    border: "none",
                    borderRadius: "8px",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* BOTTOM CONTENT ROW */}
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  padding: "24px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {/* SCORE */}
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
                    value={m.score || ""}
                    onChange={(e) =>
                      handleLocalUpdate(m.id, "score", e.target.value)
                    }
                    onBlur={(e) =>
                      handleDatabaseUpdate(m.id, "score", e.target.value)
                    }
                    style={{
                      fontSize: "24px",
                      fontWeight: 800,
                      padding: "12px",
                      color: "var(--text-main)",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                    }}
                  />
                </div>

                {/* REMARKS */}
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
                    value={m.remarks || ""}
                    onChange={(e) =>
                      handleLocalUpdate(m.id, "remarks", e.target.value)
                    }
                    onBlur={(e) =>
                      handleDatabaseUpdate(m.id, "remarks", e.target.value)
                    }
                    rows="2"
                    style={{
                      background: "rgba(99, 102, 241, 0.03)",
                      border: "1px dashed var(--border)",
                      borderRadius: "8px",
                      padding: "12px",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
