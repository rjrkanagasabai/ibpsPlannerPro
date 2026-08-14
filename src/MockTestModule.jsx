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
} from "lucide-react";

// --- SUPABASE CLIENT IMPORT ---
import { supabase } from "./supabase";

export default function MockTestModule({ onSaveScore }) {
  // --- STATES ---
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Exam States
  const [view, setView] = useState("list"); // 'list' | 'exam' | 'result'
  const [activeTest, setActiveTest] = useState(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [sectionTimeLeft, setSectionTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FETCH MOCK TESTS STRICTLY FROM SUPABASE BACKEND ---
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

      if (data && data.length > 0) {
        setTests(data);
      } else {
        setTests([]);
      }
    } catch (err) {
      console.error("Error fetching mock tests from Supabase:", err);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  // --- SECTIONAL TIMER ENGINE ---
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

  // Section Time Expired / Auto-Advance Logic
  const handleSectionTimeout = () => {
    if (!activeTest) return;

    if (activeSectionIndex < activeTest.sections.length - 1) {
      // Advance to next section automatically
      const nextSectionIdx = activeSectionIndex + 1;
      setActiveSectionIndex(nextSectionIdx);
      setCurrentIndex(0);
      setSectionTimeLeft(activeTest.sections[nextSectionIdx].duration * 60);
    } else {
      // Final section completed -> Submit Exam
      submitExam();
    }
  };

  // --- ACTIONS ---
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
      setView("result");
    }, 800);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // --- FILTERED TEST LIST ---
  const filteredTests = tests.filter((t) => {
    if (categoryFilter !== "ALL" && t.category !== categoryFilter) return false;
    if (typeFilter !== "ALL" && t.exam_type !== typeFilter) return false;
    return true;
  });

  // =========================================================================
  // VIEW 1: TEST SELECTION SCREEN
  // =========================================================================
  if (view === "list") {
    return (
      <div style={{ animation: "fadeIn 0.4s ease" }}>
        <div className="page-header">
          <div>
            <h1 style={{ fontSize: "28px" }}>Mock Test</h1>
            {/* <p style={{ color: "var(--text-muted)" }}>
              Take exam-pattern tests with strict sectional timings for IBPS,
              SBI, and RRB.
            </p> */}
          </div>
        </div>

        {/* FILTERS */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "24px",
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
          ></div>
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

        {/* LOADING & EMPTY STATES */}
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
              style={{ margin: "0 auto 12px auto" }}
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
            <p style={{ fontSize: "13px" }}>
              Please add mock tests to your Supabase database to see them here.
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

              return (
                <motion.div
                  whileHover={{ y: -4 }}
                  key={test.id}
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "24px",
                    borderRadius: "16px",
                    border: "1px solid var(--border)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
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

                  {/* Sectional Breakdown Preview */}
                  <div
                    style={{
                      background: "rgba(0,0,0,0.02)",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      marginBottom: "20px",
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
                    className="btn"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      marginTop: "auto",
                      padding: "10px",
                    }}
                    onClick={() => startExam(test)}
                  >
                    <Play size={16} /> Start Test
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: LIVE EXAM INTERFACE (STRICT SECTIONAL TIMING)
  // =========================================================================
  if (view === "exam" && activeTest) {
    const activeSection = activeTest.sections[activeSectionIndex];
    const currentQuestion = activeSection.questions[currentQuestionIndex];
    const isAnswered = !!answers[currentQuestion.id];
    const isMarked = !!markedForReview[currentQuestion.id];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(120vh - 0px)",
          background: "var(--bg)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {/* TOP BAR: EXAM INFO & SECTION TIMER */}
        <div
          style={{
            padding: "12px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justify: "space-between",
            alignItems: "center",
            background: "rgba(0,0,0,0.02)",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 800,
                margin: 0,
                color: "var(--text-main)",
              }}
            >
              {activeTest.name}
            </h2>
            <span
              style={{
                fontSize: "12px",
                color: "var(--accent)",
                fontWeight: 700,
              }}
            >
              Section {activeSectionIndex + 1} of {activeTest.sections.length}:{" "}
              {activeSection.name}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Section Timer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(239, 68, 68, 0.1)",
                color: "var(--danger)",
                padding: "6px 14px",
                borderRadius: "8px",
                fontWeight: 800,
                fontFamily: "monospace",
                fontSize: "16px",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <Clock size={16} /> {formatTime(sectionTimeLeft)}
            </div>

            <button
              className="btn btn-outline"
              style={{
                borderColor: "var(--danger)",
                color: "var(--danger)",
                fontSize: "12px",
                padding: "6px 12px",
              }}
              onClick={submitExam}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Entire Test"}
            </button>
          </div>
        </div>

        {/* SECTION TABS (LOCKED REGARDING REAL IBPS RULES) */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border)",
            background: "rgba(0,0,0,0.01)",
            padding: "0 16px",
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
                  padding: "12px 20px",
                  fontSize: "13px",
                  fontWeight: 700,
                  borderBottom: isActive ? "3px solid var(--accent)" : "none",
                  color: isActive
                    ? "var(--accent)"
                    : isCompleted
                      ? "var(--secondary)"
                      : "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "transparent",
                  cursor: "default",
                  whiteSpace: "nowrap",
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

        {/* MAIN BODY: QUESTION & PALETTE */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* QUESTION CONTAINER */}
          <div
            style={{
              flex: 1,
              padding: "28px",
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
                alignItems: "center",
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
                Question {currentQuestionIndex + 1} of{" "}
                {activeSection.questions.length}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  background: "rgba(99, 102, 241, 0.08)",
                  color: "var(--accent)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontWeight: 700,
                }}
              >
                +1.00 | -0.25 Marks
              </span>
            </div>

            <h3
              style={{
                fontSize: "17px",
                lineHeight: 1.6,
                fontWeight: 600,
                color: "var(--text-main)",
                marginBottom: "28px",
                whiteSpace: "pre-wrap",
              }}
            >
              {currentQuestion.text}
            </h3>

            {/* OPTIONS */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "28px",
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
                      gap: "12px",
                      padding: "14px 18px",
                      border: isSelected
                        ? "2px solid var(--accent)"
                        : "1px solid var(--border)",
                      background: isSelected
                        ? "rgba(99,102,241,0.06)"
                        : "var(--bg)",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name={`q-${currentQuestion.id}`}
                      value={opt}
                      checked={isSelected}
                      onChange={() => {}}
                      style={{
                        width: "16px",
                        height: "16px",
                        accentColor: "var(--accent)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
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

            {/* ACTION FOOTER */}
            <div
              style={{
                marginTop: "auto",
                paddingTop: "20px",
                borderTop: "1px dashed var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn btn-outline"
                  style={{ fontSize: "12px", padding: "8px 14px" }}
                  onClick={() => toggleMarkForReview(currentQuestion.id)}
                >
                  <Bookmark size={14} />{" "}
                  {isMarked ? "Unmark Review" : "Mark for Review"}
                </button>
                <button
                  className="btn btn-outline"
                  style={{ fontSize: "12px", padding: "8px 14px" }}
                  onClick={() => clearResponse(currentQuestion.id)}
                  disabled={!isAnswered}
                >
                  Clear Response
                </button>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn btn-outline"
                  onClick={() =>
                    setCurrentIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentQuestionIndex === 0}
                  style={{ padding: "8px 14px", fontSize: "13px" }}
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                {currentQuestionIndex < activeSection.questions.length - 1 ? (
                  <button
                    className="btn"
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    style={{ padding: "8px 16px", fontSize: "13px" }}
                  >
                    Save & Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    className="btn"
                    onClick={handleNextSectionManual}
                    style={{
                      background: "var(--secondary)",
                      color: "white",
                      padding: "8px 16px",
                      fontSize: "13px",
                      border: "none",
                    }}
                  >
                    {activeSectionIndex < activeTest.sections.length - 1
                      ? "Submit Section & Proceed"
                      : "Submit Test"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* PALETTE SIDEBAR */}
          <div
            style={{
              width: "260px",
              borderLeft: "1px solid var(--border)",
              background: "rgba(0,0,0,0.015)",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid var(--border)",
                fontWeight: 800,
                fontSize: "13px",
                color: "var(--text-main)",
              }}
            >
              {activeSection.name} Palette
            </div>

            <div
              style={{
                padding: "16px",
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignContent: "flex-start",
              }}
            >
              {activeSection.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAns = !!answers[q.id];
                const isMrk = !!markedForReview[q.id];

                let bg = "var(--bg)";
                let color = "var(--text-main)";
                let border = "1px solid var(--border)";

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

                if (isCurrent) border = "2px solid var(--accent)";

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "6px",
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

            {/* LEGEND */}
            <div
              style={{
                padding: "14px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#10b981",
                    borderRadius: "3px",
                  }}
                ></div>{" "}
                Answered
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#f59e0b",
                    borderRadius: "3px",
                  }}
                ></div>{" "}
                Marked for Review
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "3px",
                  }}
                ></div>{" "}
                Unanswered
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: RESULT & SECTIONAL ANALYTICS
  // =========================================================================
  if (view === "result" && activeTest) {
    let totalScore = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalUnattempted = 0;

    const sectionStats = activeTest.sections.map((sec) => {
      let secCorrect = 0;
      let secIncorrect = 0;
      let secUnattempted = 0;

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
        <div className="page-header">
          <div>
            <h1 style={{ fontSize: "28px" }}>Sectional Performance Report</h1>
            <p style={{ color: "var(--text-muted)" }}>
              Detailed scorecard for {activeTest.name}
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button className="btn btn-outline" onClick={() => setView("list")}>
              <RotateCcw size={16} /> Back to Test List
            </button>
            {onSaveScore && (
              <button
                className="btn"
                onClick={() => {
                  onSaveScore({
                    name: activeTest.name,
                    score: totalScore.toFixed(2),
                    remarks: `Score: ${totalScore.toFixed(2)} (${totalCorrect}C / ${totalIncorrect}W)`,
                  });
                  setView("list");
                }}
              >
                <Save size={16} /> Save Score to Log
              </button>
            )}
          </div>
        </div>

        {/* OVERALL STATS */}
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
            style={{ textAlign: "center", padding: "24px" }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Total Score
            </span>
            <h2
              style={{
                fontSize: "40px",
                fontWeight: 800,
                color: "var(--accent)",
                margin: "8px 0",
              }}
            >
              {totalScore.toFixed(2)}
            </h2>
          </div>
          <div
            className="card"
            style={{ textAlign: "center", padding: "24px" }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Accuracy
            </span>
            <h2
              style={{
                fontSize: "40px",
                fontWeight: 800,
                color: "var(--secondary)",
                margin: "8px 0",
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
            style={{ textAlign: "center", padding: "24px" }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Attempted
            </span>
            <h2
              style={{
                fontSize: "40px",
                fontWeight: 800,
                color: "var(--text-main)",
                margin: "8px 0",
              }}
            >
              {totalCorrect + totalIncorrect}
            </h2>
          </div>
        </div>

        {/* SECTIONAL BREAKDOWN TABLE */}
        <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "16px" }}>
          Section-Wise Score Card
        </h3>
        <div
          className="card"
          style={{ padding: 0, overflow: "hidden", marginBottom: "32px" }}
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
                  <th style={{ padding: "14px 20px" }}>Section Name</th>
                  <th style={{ padding: "14px 20px" }}>Questions</th>
                  <th style={{ padding: "14px 20px" }}>Correct</th>
                  <th style={{ padding: "14px 20px" }}>Incorrect</th>
                  <th style={{ padding: "14px 20px" }}>Unattempted</th>
                  <th style={{ padding: "14px 20px" }}>Score</th>
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
                        padding: "16px 20px",
                        fontWeight: 700,
                        color: "var(--text-main)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sec.name}
                    </td>
                    <td style={{ padding: "16px 20px" }}>{sec.totalQ}</td>
                    <td
                      style={{
                        padding: "16px 20px",
                        color: "var(--secondary)",
                        fontWeight: 700,
                      }}
                    >
                      {sec.correct}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        color: "var(--danger)",
                        fontWeight: 700,
                      }}
                    >
                      {sec.incorrect}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {sec.unattempted}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        fontWeight: 800,
                        color: "var(--accent)",
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

  return null;
}
