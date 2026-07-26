import React, { useState, useEffect, useRef } from "react";
import "./App.css";
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
  TrendingUp,
  CheckCircle2,
  Circle,
  X,
  Plus,
  Trash,
  Download,
  Trash2,
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// --- 1. DEFAULT DATA ---
const defaultTimeline = [
  {
    time: "5:00",
    activity: "Wake Up & Hydrate",
    checked: false,
    notes: "",
    isStudy: false,
  },
  {
    time: "5:20",
    activity: "Quant Video / Concept",
    checked: false,
    notes: "",
    isStudy: true,
  },
  {
    time: "7:20",
    activity: "Quant PDF Practice",
    checked: false,
    notes: "",
    isStudy: true,
  },
  {
    time: "7:50",
    activity: "Breakfast & Break",
    checked: false,
    notes: "",
    isStudy: false,
  },
  {
    time: "8:20",
    activity: "Quant Video 2",
    checked: false,
    notes: "",
    isStudy: true,
  },
  {
    time: "9:00",
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
const habitList = [
  "Wake Up 5 AM",
  "Study 10 Hours",
  "Quant Practice",
  "English Read",
  "Reasoning",
  "Current Affairs",
  "Exercise",
  "Sleep 10:30",
];

const getFormattedDateStr = (d = new Date()) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// --- HELPER: CALCULATE STUDY HOURS ---
const calculateStudyMinutes = (timeline) => {
  if (!timeline) return { completedMins: 0, targetMins: 0 };
  let completedMins = 0;
  let targetMins = 0;

  for (let i = 0; i < timeline.length; i++) {
    const current = timeline[i];
    const isStudyTask =
      current.isStudy !== undefined
        ? current.isStudy
        : !/(wake|break|lunch|sleep|walk|hydrate|breakfast|dinner)/i.test(
            current.activity,
          );

    if (isStudyTask) {
      let durationMins = 60;
      if (i < timeline.length - 1) {
        const nextParts = timeline[i + 1].time.split(":");
        const currParts = current.time.split(":");
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

// --- 2. CUSTOM HOOK FOR LOCAL STORAGE ---
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

// --- 3. MAIN COMPONENT ---
export default function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState(getFormattedDateStr());

  const [appData, setAppData] = useLocalStorage("ibps_react_planner_modern", {
    theme: "light",
    history: {},
    mocks: [],
    habits: habitList.map((h) => ({ name: h, days: Array(31).fill(false) })),
    missedTasks: [],
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", appData.theme);

    // Automatically initialize missing date entries (Timeline AND Quant Rotation)
    const current = appData.history[selectedDate];
    if (!current || !current.quant) {
      setAppData((prev) => {
        const existing = prev.history[selectedDate] || {};
        if (existing.quant) return prev; // Prevent duplicate updates

        return {
          ...prev,
          history: {
            ...prev.history,
            [selectedDate]: {
              timeline: existing.timeline || [...defaultTimeline],
              notes: existing.notes || "",
              quant:
                existing.quant ||
                quantTopics.map((t) => ({
                  topic: t,
                  checked: false,
                  notes: "",
                })),
            },
          },
        };
      });
    }
  }, [selectedDate, appData.theme]);

  // Provide a safe fallback if state hasn't updated yet
  const currentHistory = appData.history[selectedDate] || {
    timeline: [...defaultTimeline],
    notes: "",
    quant: quantTopics.map((t) => ({ topic: t, checked: false, notes: "" })),
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

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">
          <div className="icon-wrap">
            <Target size={20} />
          </div>
          Planner
          <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>
            Pro
          </span>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "today", icon: CalendarCheck, label: "Daily Plan" },
            { id: "quant", icon: Calculator, label: "Quant Rotation" },
            { id: "mocks", icon: LineChart, label: "Mock Tracker" },
            { id: "habits", icon: CheckCircle, label: "Habit Tracker" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? "active" : ""}`}
              onClick={() => setActiveView(item.id)}
            >
              <item.icon size={18} /> {item.label}
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
        />

        <div className="content-area">
          {activeView === "dashboard" && (
            <Dashboard
              date={selectedDate}
              history={currentHistory}
              updateHistory={updateHistory}
              mocks={appData.mocks}
              missedTasks={appData.missedTasks}
              allHistory={appData.history}
              setMissedTasks={(tasks) =>
                setAppData((prev) => ({ ...prev, missedTasks: tasks }))
              }
            />
          )}
          {activeView === "today" && (
            <DailyPlan
              date={selectedDate}
              timeline={currentHistory.timeline}
              updateTimeline={(tl) => updateHistory({ timeline: tl })}
            />
          )}
          {activeView === "quant" && (
            <QuantRotation
              quant={currentHistory.quant}
              setQuant={(q) => updateHistory({ quant: q })}
            />
          )}
          {activeView === "mocks" && (
            <MockTracker
              mocks={appData.mocks}
              setMocks={(m) => setAppData((prev) => ({ ...prev, mocks: m }))}
              date={selectedDate}
            />
          )}
          {activeView === "habits" && (
            <HabitTracker
              habits={appData.habits}
              setHabits={(h) => setAppData((prev) => ({ ...prev, habits: h }))}
            />
          )}
          {activeView === "settings" && (
            <SettingsView appData={appData} setAppData={setAppData} />
          )}
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function Header({ theme, setTheme, selectedDate, setSelectedDate }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const istTime = new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setTime(istTime);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = getFormattedDateStr();

  return (
    <header className="header">
      <div className="header-left">
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
            className="btn btn-outline"
            style={{ padding: "8px 12px", fontSize: "13px" }}
            onClick={() => setSelectedDate(todayStr)}
          >
            Today
          </button>
        )}
      </div>
      <div className="header-right">
        <div className="clock">{time} IST</div>
        <div
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

function Dashboard({
  date,
  history,
  updateHistory,
  mocks,
  missedTasks,
  setMissedTasks,
  allHistory,
}) {
  const [newMissed, setNewMissed] = useState("");

  const totalTasks = history.timeline?.length || 0;
  const completedTasks = history.timeline?.filter((t) => t.checked).length || 0;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  const dailyStudy = calculateStudyMinutes(history.timeline);
  const dailyCompletedHours = (dailyStudy.completedMins / 60).toFixed(1);
  const dailyTargetHours = (dailyStudy.targetMins / 60).toFixed(1);

  let globalMins = 0;
  Object.values(allHistory).forEach((dayRecord) => {
    globalMins += calculateStudyMinutes(dayRecord.timeline).completedMins;
  });
  const globalHours = (globalMins / 60).toFixed(1);

  // --- Dynamic Mock Score Card Logic ---
  const totalTests = mocks.length;
  let mockCardTitle = "0";
  let mockCardSubtitle = "No Mock Tests";
  let mockCardIcon = <Crosshair size={24} />;

  if (totalTests === 1) {
    mockCardTitle = mocks[0].score || "0";
    const testName = mocks[0].name || "Unnamed Test";
    const accuracy = mocks[0].accuracy || "0";
    mockCardSubtitle = `${testName} • ${accuracy}% Acc`;
    mockCardIcon = <Target size={24} />;
  } else if (totalTests > 1) {
    const avgScore = (
      mocks.reduce((acc, m) => acc + Number(m.score || 0), 0) / totalTests
    ).toFixed(1);
    const avgAcc = (
      mocks.reduce((acc, m) => acc + Number(m.accuracy || 0), 0) / totalTests
    ).toFixed(1);
    mockCardTitle = avgScore;
    mockCardSubtitle = `Avg (${totalTests} Tests) • ${avgAcc}% Acc`;
    mockCardIcon = <TrendingUp size={24} />;
  }

  const addMissed = () => {
    if (newMissed.trim()) {
      setMissedTasks([...missedTasks, { text: newMissed, checked: false }]);
      setNewMissed("");
    }
  };

  const toggleMissed = (index) => {
    const arr = [...missedTasks];
    arr[index].checked = !arr[index].checked;
    setMissedTasks(arr);
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Welcome back.</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Here is your overview for{" "}
          {new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid-4">
        <div className="card stat-card">
          <div className="icon-wrap">
            <Clock size={24} />
          </div>
          <h3>{dailyCompletedHours}h</h3>
          <p title={`Daily Study (Target: ${dailyTargetHours}h)`}>
            Daily Study (Target: {dailyTargetHours}h)
          </p>
        </div>

        <div className="card stat-card">
          <div className="icon-wrap">
            <Award size={24} />
          </div>
          <h3>{globalHours}h</h3>
          <p title="Total All-Time Study">Total All-Time Study</p>
        </div>

        <div className="card stat-card">
          <div className="icon-wrap">
            <CheckSquare size={24} />
          </div>
          <h3>
            {completedTasks}/{totalTasks}
          </h3>
          <p title="Tasks Completed">Tasks Completed</p>
        </div>

        <div className="card stat-card">
          <div className="icon-wrap">{mockCardIcon}</div>
          <h3>{mockCardTitle}</h3>
          <p title={mockCardSubtitle}>{mockCardSubtitle}</p>
        </div>
      </div>

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
                transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
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
            <h4
              style={{
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--text-muted)",
                marginBottom: "12px",
              }}
            >
              Completed
            </h4>
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

            <h4
              style={{
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--text-muted)",
                marginBottom: "12px",
              }}
            >
              Pending
            </h4>
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
            <h3 style={{ marginBottom: "8px", fontSize: "18px" }}>Backlog</h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginBottom: "16px",
              }}
            >
              Manage partial or skipped tasks across days.
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
                    onClick={() =>
                      setMissedTasks(missedTasks.filter((_, idx) => idx !== i))
                    }
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: "16px", fontSize: "18px" }}>
              Daily Notes
            </h3>
            <textarea
              className="custom-input"
              rows="3"
              style={{ resize: "vertical" }}
              placeholder="Jot down quick thoughts..."
              value={history.notes}
              onChange={(e) => updateHistory({ notes: e.target.value })}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

function DailyPlan({ date, timeline, updateTimeline }) {
  const handleChange = (index, field, value) => {
    const newTl = [...timeline];
    newTl[index][field] = value;
    updateTimeline(newTl);
  };
  const resetToday = () =>
    window.confirm("Reset timeline checklist?") &&
    updateTimeline(timeline.map((t) => ({ ...t, checked: false })));

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "12px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px" }}>Timeline</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Your structured plan for {date}
          </p>
        </div>
        <button className="btn btn-outline" onClick={resetToday}>
          Reset Day
        </button>
      </div>

      <div className="timeline-container">
        {timeline?.map((item, i) => (
          <div
            key={i}
            className={`timeline-item ${item.checked ? "completed" : ""}`}
          >
            <div className="timeline-marker">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={item.checked}
                onChange={(e) => handleChange(i, "checked", e.target.checked)}
              />
            </div>

            <div className="time-badge">{item.time}</div>

            <div className="timeline-content">
              <div className="timeline-header">
                <span className="task-name">{item.activity}</span>
              </div>
              <input
                type="text"
                className="custom-input"
                placeholder="Add study notes, links, or remarks..."
                value={item.notes}
                onChange={(e) => handleChange(i, "notes", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuantRotation({ quant = [], setQuant }) {
  const [recommendation, setRecommendation] = useState("");

  const handleChange = (index, field, value) => {
    const arr = [...quant];
    arr[index][field] = value;
    setQuant(arr);
  };

  const handleRecommend = () => {
    if (!quant || quant.length === 0) return;
    const unread = quant.filter((q) => !q.checked);
    if (unread.length === 0) {
      setRecommendation(
        "Awesome! You've practiced every single topic for today.",
      );
    } else {
      const randomIdx = Math.floor(Math.random() * unread.length);
      setRecommendation(
        `Today's Recommended Focus: ${unread[randomIdx].topic}`,
      );
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px" }}>Quant PDF Rotation</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Track topical proficiency and mistakes for the day.
          </p>
        </div>
        <button className="btn" onClick={handleRecommend}>
          <Sparkles size={16} /> Recommend Topic
        </button>
      </div>

      {recommendation && (
        <div
          className="card"
          style={{
            marginBottom: "24px",
            padding: "16px 24px",
            background: "rgba(99, 102, 241, 0.05)",
            borderColor: "var(--accent)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "var(--accent)",
              fontWeight: 600,
              fontSize: "15px",
            }}
          >
            {recommendation}
          </span>
          <button
            onClick={() => setRecommendation("")}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--accent)",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="grid-4">
        {quant.map((item, i) => (
          <div
            key={i}
            className="card"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "24px",
              border: item.checked
                ? "1px solid rgba(16, 185, 129, 0.3)"
                : "1px solid var(--border)",
              background: item.checked
                ? "rgba(16, 185, 129, 0.02)"
                : "var(--card-bg)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <h4
                style={{
                  fontSize: "16px",
                  color: item.checked ? "var(--secondary)" : "var(--text-main)",
                }}
              >
                {item.topic}
              </h4>
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

function MockTracker({ mocks, setMocks, date }) {
  const addMock = () =>
    setMocks([
      ...mocks,
      { date, name: "", score: "", accuracy: "", percentile: "", remarks: "" },
    ]);
  const updateMock = (index, field, value) => {
    const arr = [...mocks];
    arr[index][field] = value;
    setMocks(arr);
  };
  const deleteMock = (index) => setMocks(mocks.filter((_, i) => i !== index));

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px" }}>Mock Tracker</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Log your scores to visualize progress.
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
                    placeholder="e.g. Testbook Mock 1"
                    value={m.name}
                    onChange={(e) => updateMock(i, "name", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="custom-input"
                    value={m.score}
                    onChange={(e) => updateMock(i, "score", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="custom-input"
                    value={m.accuracy}
                    onChange={(e) => updateMock(i, "accuracy", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="custom-input"
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
                    placeholder="Errors made..."
                    value={m.remarks}
                    onChange={(e) => updateMock(i, "remarks", e.target.value)}
                  />
                </td>
                <td>
                  <button
                    className="icon-btn"
                    style={{
                      width: 32,
                      height: 32,
                      background: "transparent",
                      border: "none",
                      boxShadow: "none",
                    }}
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

function HabitTracker({ habits, setHabits }) {
  const scrollRef = useRef(null);

  const toggleHabit = (hIndex, dIndex) => {
    const arr = [...habits];
    arr[hIndex].days[dIndex] = !arr[hIndex].days[dIndex];
    setHabits(arr);
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px" }}>Habits Heatmap</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Build consistency across 31 days.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="icon-btn" onClick={() => handleScroll("left")}>
            <ChevronLeft size={20} />
          </button>
          <button className="icon-btn" onClick={() => handleScroll("right")}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: "24px 0" }}>
        <div className="habit-tracker-scroll" ref={scrollRef}>
          <div className="habit-header-row">
            {Array.from({ length: 31 }, (_, i) => (
              <div key={i} className="habit-header-day">
                {i + 1}
              </div>
            ))}
          </div>
          {habits.map((h, hIndex) => (
            <div key={hIndex} className="habit-row">
              <div className="habit-name" title={h.name}>
                {h.name}
              </div>
              {h.days.map((checked, dIndex) => (
                <div
                  key={dIndex}
                  className={`habit-circle ${checked ? "active" : ""}`}
                  onClick={() => toggleHabit(hIndex, dIndex)}
                >
                  {checked && <CheckCircle2 size={12} color="#fff" />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsView({ appData, setAppData }) {
  const exportData = () => {
    const blob = new Blob([JSON.stringify(appData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IBPS_Planner_Backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (imported.history) {
          setAppData(imported);
          alert("Data Restored!");
        }
      } catch (err) {
        alert("Invalid File.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="card" style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>Settings</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
        Manage your local data.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <label style={{ fontWeight: 600, display: "block", marginBottom: 4 }}>
            Export JSON
          </label>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              marginBottom: 12,
            }}
          >
            Download an offline backup of your timeline history and trackers.
          </p>
          <button className="btn" onClick={exportData}>
            <Download size={16} /> Download Backup
          </button>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
          <label style={{ fontWeight: 600, display: "block", marginBottom: 4 }}>
            Import JSON
          </label>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              marginBottom: 12,
            }}
          >
            Restore data from a previously downloaded backup.
          </p>
          <input
            type="file"
            accept=".json"
            className="custom-input"
            onChange={importData}
            style={{ padding: "8px", cursor: "pointer" }}
          />
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
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              marginBottom: 12,
            }}
          >
            Permanently delete all LocalStorage records. This action cannot be
            undone.
          </p>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm("Delete ALL data forever?")) {
                window.localStorage.removeItem("ibps_react_planner_modern");
                window.location.reload();
              }
            }}
          >
            <Trash2 size={16} /> Factory Reset
          </button>
        </div>
      </div>
    </div>
  );
}
