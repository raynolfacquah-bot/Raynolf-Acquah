/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Monitor,
  Chrome,
  Compass,
  Terminal,
  Sparkles,
  Laptop,
  CheckCircle2,
  Copy,
  Cpu,
  Settings,
  AppWindow,
  CheckSquare,
  FileText,
  Plus,
  Trash2,
  Search,
  Check,
  AlertCircle,
  HelpCircle,
  QrCode,
  Smartphone,
  Share2,
  ExternalLink
} from "lucide-react";

type BrowserType = "chrome" | "edge" | "safari";
type ThemeAccent = "emerald" | "violet" | "cyber" | "amber";
type ActiveView = "tasks" | "notes" | "guide" | "share";

interface ThemeConfig {
  primary: string;
  border: string;
  badge: string;
  glow: string;
  text: string;
  gradient: string;
  button: string;
}

const THEMES: Record<ThemeAccent, ThemeConfig> = {
  emerald: {
    primary: "from-emerald-500 to-teal-400",
    border: "border-emerald-500/30 hover:border-emerald-400/60 bg-emerald-950/20",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glow: "rgba(16, 185, 129, 0.15)",
    text: "text-emerald-400",
    gradient: "from-emerald-500 to-teal-400",
    button: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30"
  },
  violet: {
    primary: "from-violet-500 to-purple-400",
    border: "border-violet-500/30 hover:border-violet-400/60 bg-violet-950/20",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    glow: "rgba(139, 92, 246, 0.15)",
    text: "text-violet-400",
    gradient: "from-violet-500 to-purple-400",
    button: "bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/30"
  },
  cyber: {
    primary: "from-cyan-500 to-blue-400",
    border: "border-cyan-500/30 hover:border-cyan-400/60 bg-cyan-950/20",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    glow: "rgba(6, 182, 212, 0.15)",
    text: "text-cyan-400",
    gradient: "from-cyan-500 to-blue-400",
    button: "bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-cyan-900/30"
  },
  amber: {
    primary: "from-amber-500 to-orange-400",
    border: "border-amber-500/30 hover:border-amber-400/60 bg-amber-950/20",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    glow: "rgba(245, 158, 11, 0.15)",
    text: "text-amber-400",
    gradient: "from-amber-500 to-orange-400",
    button: "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30"
  }
};

// Task and Note Interfaces
interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: number;
}

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: number;
}

const NOTE_COLORS = [
  "bg-slate-900 border-slate-800",
  "bg-blue-950/40 border-blue-500/30",
  "bg-emerald-950/40 border-emerald-500/30",
  "bg-violet-950/40 border-violet-500/30",
  "bg-amber-950/40 border-amber-500/30"
];

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>("tasks");
  const [activeBrowser, setActiveBrowser] = useState<BrowserType>("chrome");
  const [activeTheme, setActiveTheme] = useState<ThemeAccent>("cyber");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [mobileUrl, setMobileUrl] = useState(() => {
    const metadataPreUrl = "https://ais-pre-hidddzpdnmkgmhjykogyui-625054584362.europe-west2.run.app";
    try {
      if (typeof window !== "undefined" && window.location) {
        const origin = window.location.origin;
        if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
          return metadataPreUrl;
        }
        // If within an iframe, check parent or stick to absolute URL
        return window.location.href;
      }
    } catch (e) {}
    return metadataPreUrl;
  });

  // --- TASK STATE ---
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("workspace_tasks");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      { id: "1", text: "Explore the live AI Workspace App", completed: true, priority: "high", createdAt: Date.now() - 60000 },
      { id: "2", text: "Install this web app to desktop using the Setup Guide", completed: false, priority: "medium", createdAt: Date.now() },
      { id: "3", text: "Create a custom task to test live React states", completed: false, priority: "low", createdAt: Date.now() + 60000 }
    ];
  });
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [taskFilter, setTaskFilter] = useState<"all" | "active" | "completed">("all");

  // --- NOTE STATE ---
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("workspace_notes");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: "1",
        title: "Workspace Credentials",
        content: "API keys are securely hidden inside Server variables. You don't need to manually inject secrets in the client code!",
        color: "bg-blue-950/40 border-blue-500/30",
        createdAt: Date.now() - 3600000
      },
      {
        id: "2",
        title: "Developer Notes",
        content: "Every modification you request gets built instantly. You can easily view structural code files or create your own custom features.",
        color: "bg-slate-900 border-slate-800",
        createdAt: Date.now()
      }
    ];
  });
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteColor, setNewNoteColor] = useState(NOTE_COLORS[0]);
  const [noteSearch, setNoteSearch] = useState("");

  // Sync to Local Storage
  useEffect(() => {
    localStorage.setItem("workspace_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("workspace_notes", JSON.stringify(notes));
  }, [notes]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // --- TASK HANDLERS ---
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const task: Task = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
      priority: newTaskPriority,
      createdAt: Date.now()
    };
    setTasks([task, ...tasks]);
    setNewTaskText("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === "active") return !t.completed;
    if (taskFilter === "completed") return t.completed;
    return true;
  });

  // --- NOTE HANDLERS ---
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() && !newNoteContent.trim()) return;
    const note: Note = {
      id: crypto.randomUUID(),
      title: newNoteTitle.trim() || "Untitled Note",
      content: newNoteContent.trim(),
      color: newNoteColor,
      createdAt: Date.now()
    };
    setNotes([note, ...notes]);
    setNewNoteTitle("");
    setNewNoteContent("");
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const filteredNotes = notes.filter(n => {
    const search = noteSearch.toLowerCase();
    return n.title.toLowerCase().includes(search) || n.content.toLowerCase().includes(search);
  });

  const selectedTheme = THEMES[activeTheme];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-slate-800 selection:text-white overflow-x-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />
      
      {/* Decorative Top Mesh Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      <main className="relative max-w-5xl mx-auto px-4 py-8 md:py-12">
        
        {/* Top Status Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-900">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              Live Workspace Hub
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500">Theme accent:</span>
            <div className="flex gap-2">
              {(Object.keys(THEMES) as ThemeAccent[]).map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => setActiveTheme(themeKey)}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    themeKey === "emerald" ? "bg-emerald-500" :
                    themeKey === "violet" ? "bg-violet-500" :
                    themeKey === "cyber" ? "bg-cyan-500" : "bg-amber-500"
                  } ${
                    activeTheme === themeKey
                      ? "ring-2 ring-offset-2 ring-offset-slate-950 ring-slate-400 scale-110"
                      : "opacity-65 hover:opacity-100"
                  }`}
                  aria-label={`Select ${themeKey} theme`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-3 bg-slate-900/50 border-slate-800 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Application Space</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Welcome to <span className={`bg-gradient-to-r bg-clip-text text-transparent ${selectedTheme.primary}`}>Raynolf Acquah</span>
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed">
            A complete suite of functional workspace utilities built for organizing tasks, taking secure sticky notes, and managing standalone deployment settings instantly.
          </p>
        </motion.div>

        {/* Main Application Selector Bar */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-900/70 p-1.5 rounded-xl border border-slate-800/80 flex flex-wrap justify-center gap-1">
            <button
              onClick={() => setActiveView("tasks")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeView === "tasks"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              id="btn-nav-tasks"
            >
              <CheckSquare className="w-4 h-4 text-emerald-400" /> Task Planner
            </button>
            <button
              onClick={() => setActiveView("notes")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeView === "notes"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              id="btn-nav-notes"
            >
              <FileText className="w-4 h-4 text-violet-400" /> Sticky Notes
            </button>
            <button
              onClick={() => setActiveView("guide")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeView === "guide"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              id="btn-nav-guide"
            >
              <Monitor className="w-4 h-4 text-cyan-400" /> Desktop Setup Guide
            </button>
            <button
              onClick={() => setActiveView("share")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeView === "share"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              id="btn-nav-share"
            >
              <Smartphone className="w-4 h-4 text-amber-400" /> Share to Phone
            </button>
          </div>
        </div>

        {/* Dynamic App Content Display */}
        <div className="min-h-[450px]">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: TASK PLANNER */}
            {activeView === "tasks" && (
              <motion.div
                key="tasks-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Left Side: Creation Form */}
                <div className="lg:col-span-4 bg-slate-900/30 p-6 rounded-2xl border border-slate-900/80">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-slate-400" /> Add New Task
                  </h3>

                  <form onSubmit={handleAddTask} className="space-y-4">
                    <div>
                      <label htmlFor="task-input" className="block text-xs font-medium text-slate-400 mb-1.5">Task Description</label>
                      <input
                        id="task-input"
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        placeholder="What needs to be done?"
                        className="w-full bg-slate-950 border border-slate-800/85 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-slate-700 transition"
                      />
                    </div>

                    <div>
                      <span className="block text-xs font-medium text-slate-400 mb-1.5">Priority Level</span>
                      <div className="grid grid-cols-3 gap-2">
                        {(["low", "medium", "high"] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setNewTaskPriority(p)}
                            className={`py-1.5 rounded-lg text-xs font-medium border capitalize transition ${
                              newTaskPriority === p
                                ? p === "high" ? "bg-red-950/40 border-red-500 text-red-400" :
                                  p === "medium" ? "bg-amber-950/40 border-amber-500 text-amber-400" :
                                  "bg-emerald-950/40 border-emerald-500 text-emerald-400"
                                : "bg-slate-950/50 border-slate-850 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`w-full font-medium py-2 rounded-lg text-xs transition shadow-md flex items-center justify-center gap-1.5 mt-2 cursor-pointer ${selectedTheme.button}`}
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Task
                    </button>
                  </form>
                </div>

                {/* Right Side: Task List */}
                <div className="lg:col-span-8 bg-slate-900/30 p-6 rounded-2xl border border-slate-900/80 flex flex-col justify-between">
                  <div>
                    {/* List Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-900">
                      <h3 className="text-base font-semibold text-white flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-emerald-400" /> Active Planner
                      </h3>

                      {/* Filters */}
                      <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-850">
                        {(["all", "active", "completed"] as const).map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setTaskFilter(filter)}
                            className={`px-3 py-1 rounded-md text-[11px] font-medium capitalize transition ${
                              taskFilter === filter
                                ? "bg-slate-900 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Task Render */}
                    {filteredTasks.length === 0 ? (
                      <div className="text-center py-12">
                        <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">No tasks found in this view.</p>
                        <p className="text-xs text-slate-500 mt-1">Try creating a new one on the left!</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                        <AnimatePresence initial={false}>
                          {filteredTasks.map((task) => (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className={`flex items-center justify-between p-3 rounded-lg border bg-slate-950/80 transition-colors ${
                                task.completed
                                  ? "border-slate-900/60 opacity-60"
                                  : "border-slate-900 hover:border-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => toggleTask(task.id)}
                                  className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
                                    task.completed
                                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                                      : "border-slate-800 hover:border-slate-700 bg-slate-900"
                                  }`}
                                >
                                  {task.completed && <Check className="w-3 h-3" />}
                                </button>
                                
                                <span className={`text-xs md:text-sm font-medium transition-all ${
                                  task.completed ? "line-through text-slate-500" : "text-slate-200"
                                }`}>
                                  {task.text}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                {/* Priority badge */}
                                <span className={`text-[10px] px-2 py-0.5 rounded font-medium capitalize ${
                                  task.priority === "high" ? "bg-red-950/60 text-red-400 border border-red-950" :
                                  task.priority === "medium" ? "bg-amber-950/60 text-amber-400 border border-amber-950" :
                                  "bg-emerald-950/60 text-emerald-400 border border-emerald-950"
                                }`}>
                                  {task.priority}
                                </span>

                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-950/10 rounded transition"
                                  title="Delete task"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-900/60 text-xs text-slate-500 flex justify-between items-center">
                    <span>{tasks.filter(t => !t.completed).length} items remaining</span>
                    <span>State fully synced with localStorage</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 2: STICKY NOTES */}
            {activeView === "notes" && (
              <motion.div
                key="notes-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Left: Create Note */}
                <div className="lg:col-span-4 bg-slate-900/30 p-6 rounded-2xl border border-slate-900/80">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-slate-400" /> Create Note
                  </h3>

                  <form onSubmit={handleAddNote} className="space-y-4">
                    <div>
                      <label htmlFor="note-title" className="block text-xs font-medium text-slate-400 mb-1.5">Note Title</label>
                      <input
                        id="note-title"
                        type="text"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        placeholder="Project Outline, Idea..."
                        className="w-full bg-slate-950 border border-slate-800/85 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-slate-700 transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="note-content" className="block text-xs font-medium text-slate-400 mb-1.5">Content</label>
                      <textarea
                        id="note-content"
                        rows={4}
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="Write down some details..."
                        className="w-full bg-slate-950 border border-slate-800/85 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-slate-700 transition resize-none"
                      />
                    </div>

                    <div>
                      <span className="block text-xs font-medium text-slate-400 mb-1.5">Note Style</span>
                      <div className="flex gap-2">
                        {NOTE_COLORS.map((col) => (
                          <button
                            key={col}
                            type="button"
                            onClick={() => setNewNoteColor(col)}
                            className={`w-6 h-6 rounded-full border transition-all ${col} ${
                              newNoteColor === col ? "ring-2 ring-offset-2 ring-offset-slate-950 ring-slate-400 scale-110" : ""
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`w-full font-medium py-2 rounded-lg text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${selectedTheme.button}`}
                    >
                      <Plus className="w-3.5 h-3.5" /> Save Note
                    </button>
                  </form>
                </div>

                {/* Right: Notes Board */}
                <div className="lg:col-span-8 bg-slate-900/30 p-6 rounded-2xl border border-slate-900/80 flex flex-col justify-between">
                  <div>
                    {/* Header with Search */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-900">
                      <h3 className="text-base font-semibold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-violet-400" /> Sticky Notes Board
                      </h3>

                      {/* Search */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={noteSearch}
                          onChange={(e) => setNoteSearch(e.target.value)}
                          placeholder="Search notes..."
                          className="bg-slate-950 border border-slate-850 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-slate-800 transition w-full sm:w-48"
                        />
                      </div>
                    </div>

                    {/* Note Render Grid */}
                    {filteredNotes.length === 0 ? (
                      <div className="text-center py-12">
                        <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">No notes found.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
                        <AnimatePresence initial={false}>
                          {filteredNotes.map((note) => (
                            <motion.div
                              key={note.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className={`p-4 rounded-xl border flex flex-col justify-between min-h-[140px] transition ${note.color}`}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h4 className="text-xs font-bold text-white uppercase tracking-wider line-clamp-1">
                                    {note.title}
                                  </h4>
                                  <button
                                    onClick={() => deleteNote(note.id)}
                                    className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800/40 rounded transition"
                                    title="Delete note"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-4">
                                  {note.content}
                                </p>
                              </div>

                              <div className="pt-4 border-t border-slate-900/20 text-[10px] text-slate-500 font-mono">
                                {new Date(note.createdAt).toLocaleDateString()}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-900/60 text-xs text-slate-500">
                    Showing {filteredNotes.length} notes • Synced securely inside LocalStorage
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 3: DESKTOP SETUP GUIDE */}
            {activeView === "guide" && (
              <motion.div
                key="guide-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-900/40 rounded-xl border border-slate-900 p-6 md:p-8 space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-900">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                      <AppWindow className="w-5 h-5 text-cyan-400" /> Standalone Desktop Application (PWA)
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400">
                      Modern browsers allow you to save this AI Studio application to your desktop, letting it run in its own dedicated, clean window without browser navigation search bars.
                    </p>
                  </div>
                  
                  {/* Browser Selector Pills */}
                  <div className="flex flex-wrap gap-1.5 self-start bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setActiveBrowser("chrome")}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                        activeBrowser === "chrome"
                          ? "bg-slate-900 text-cyan-400"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                      id="btn-browser-chrome"
                    >
                      <Chrome className="w-3.5 h-3.5" /> Google Chrome
                    </button>
                    <button
                      onClick={() => setActiveBrowser("edge")}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                        activeBrowser === "edge"
                          ? "bg-slate-900 text-cyan-400"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                      id="btn-browser-edge"
                    >
                      <Laptop className="w-3.5 h-3.5" /> Microsoft Edge
                    </button>
                    <button
                      onClick={() => setActiveBrowser("safari")}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                        activeBrowser === "safari"
                          ? "bg-slate-900 text-cyan-400"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                      id="btn-browser-safari"
                    >
                      <Compass className="w-3.5 h-3.5" /> Safari (macOS)
                    </button>
                  </div>
                </div>

                {/* Step Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {activeBrowser === "chrome" && (
                    <>
                      <div className="bg-slate-950/60 p-5 rounded-lg border border-slate-850 hover:border-slate-800 transition">
                        <div className="h-7 w-7 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center font-mono text-xs font-semibold mb-3">1</div>
                        <h4 className="text-sm font-semibold text-white mb-2">Locate the Option</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Look at the right side of the browser URL address bar for the <span className="text-slate-200">Install</span> icon (a monitor with a down arrow).
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          Alternatively, click the menu button (three vertical dots <span className="text-slate-200">⋮</span>) at the top right of your Chrome browser.
                        </p>
                      </div>
                      <div className="bg-slate-950/60 p-5 rounded-lg border border-slate-850 hover:border-slate-800 transition">
                        <div className="h-7 w-7 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center font-mono text-xs font-semibold mb-3">2</div>
                        <h4 className="text-sm font-semibold text-white mb-2">Create Shortcut</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Click <span className="text-slate-200">"Save and share"</span> and choose <span className="text-slate-200">"Install page as app..."</span>.
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          If that is not visible, click <span className="text-slate-200">"More tools"</span> → <span className="text-slate-200">"Create shortcut..."</span>, and make sure to tick <span className="text-slate-200">"Open as window"</span>.
                        </p>
                      </div>
                      <div className="bg-slate-950/60 p-5 rounded-lg border border-slate-850 hover:border-slate-800 transition">
                        <div className="h-7 w-7 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center font-mono text-xs font-semibold mb-3">3</div>
                        <h4 className="text-sm font-semibold text-white mb-2">Launch Standalone</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Click the <span className="text-slate-200">"Create"</span> or <span className="text-slate-200">"Install"</span> button. Chrome will save a clean desktop application icon.
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          Double-click the new desktop icon anytime to immediately preview and test your creations!
                        </p>
                      </div>
                    </>
                  )}

                  {activeBrowser === "edge" && (
                    <>
                      <div className="bg-slate-950/60 p-5 rounded-lg border border-slate-850 hover:border-slate-800 transition">
                        <div className="h-7 w-7 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center font-mono text-xs font-semibold mb-3">1</div>
                        <h4 className="text-sm font-semibold text-white mb-2">Locate App Menu</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Look at the browser address bar for the <span className="text-slate-200">App Available</span> icon (three squares with a plus icon) and click it.
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          Or click the horizontal three dots (<span className="text-slate-200">⋯</span>) in Edge, and hover over <span className="text-slate-200">"Apps"</span>.
                        </p>
                      </div>
                      <div className="bg-slate-950/60 p-5 rounded-lg border border-slate-850 hover:border-slate-800 transition">
                        <div className="h-7 w-7 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center font-mono text-xs font-semibold mb-3">2</div>
                        <h4 className="text-sm font-semibold text-white mb-2">Install App</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Click <span className="text-slate-200">"Install this site as an app"</span> in the pop-up menu. Edge will ask you to confirm.
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          Give it a name such as <span className="text-slate-200">"AI Studio Workspace"</span> and click <span className="text-slate-200">"Install"</span>.
                        </p>
                      </div>
                      <div className="bg-slate-950/60 p-5 rounded-lg border border-slate-850 hover:border-slate-800 transition">
                        <div className="h-7 w-7 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center font-mono text-xs font-semibold mb-3">3</div>
                        <h4 className="text-sm font-semibold text-white mb-2">Pin to Taskbar</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Edge will open the application in a beautiful, borderless window. You can check options to <span className="text-slate-200">"Pin to taskbar"</span> or <span className="text-slate-200">"Create Desktop shortcut"</span>.
                        </p>
                      </div>
                    </>
                  )}

                  {activeBrowser === "safari" && (
                    <>
                      <div className="bg-slate-950/60 p-5 rounded-lg border border-slate-850 hover:border-slate-800 transition">
                        <div className="h-7 w-7 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center font-mono text-xs font-semibold mb-3">1</div>
                        <h4 className="text-sm font-semibold text-white mb-2">Open Share Menu</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          While viewing this page in Safari, click the <span className="text-slate-200">Share</span> button (the square icon with an upward arrow) in the toolbar.
                        </p>
                      </div>
                      <div className="bg-slate-950/60 p-5 rounded-lg border border-slate-850 hover:border-slate-800 transition">
                        <div className="h-7 w-7 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center font-mono text-xs font-semibold mb-3">2</div>
                        <h4 className="text-sm font-semibold text-white mb-2">Add to Dock</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Select the <span className="text-slate-200">"Add to Dock..."</span> option in the dropdown list.
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          This packages any high-quality web applet directly as a native-feeling macOS dock item.
                        </p>
                      </div>
                      <div className="bg-slate-950/60 p-5 rounded-lg border border-slate-850 hover:border-slate-800 transition">
                        <div className="h-7 w-7 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center font-mono text-xs font-semibold mb-3">3</div>
                        <h4 className="text-sm font-semibold text-white mb-2">Access in macOS</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Assign a title like <span className="text-slate-200">"AI Studio Workspace"</span> and click <span className="text-slate-200">"Add"</span>. 
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          The icon is immediately available in your macOS Dock and Launchpad, ready to open in its own clean window.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="border-t border-slate-900 pt-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-cyan-400" /> Export and Run on Your Local Computer
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400">
                      Want to run this full-stack React + Tailwind + Vite app on your physical machine? It only takes a few standard terminal commands.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Step list */}
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-850 border border-slate-800 text-slate-300 flex items-center justify-center text-xs font-semibold font-mono">1</div>
                        <div>
                          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-0.5">Download the Codebase</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Click the <span className="text-slate-200 font-semibold">Settings / Export icon</span> in the upper right corner of the Google AI Studio UI, then choose <span className="text-slate-200">"Export ZIP"</span> or connect to <span className="text-slate-200">"GitHub"</span>.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-850 border border-slate-800 text-slate-300 flex items-center justify-center text-xs font-semibold font-mono">2</div>
                        <div>
                          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-0.5">Extract & Open Terminal</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Extract the downloaded ZIP file, open your system terminal, and navigate into the project directory:
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-850 border border-slate-800 text-slate-300 flex items-center justify-center text-xs font-semibold font-mono">3</div>
                        <div>
                          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-0.5">Install & Run Developer Server</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Execute commands shown on the right to install packages and start the Vite dev server at <code className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-1 py-0.5">http://localhost:3000</code>.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Terminal Block */}
                    <div className="bg-slate-950 rounded-lg border border-slate-850 overflow-hidden flex flex-col justify-between">
                      <div className="border-b border-slate-900 bg-slate-900/40 px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                          <span className="text-xs font-mono text-slate-500 ml-2">local-terminal</span>
                        </div>
                        
                        <button
                          onClick={() => copyToClipboard("npm install\nnpm run dev", "terminal")}
                          className="p-1 hover:bg-slate-850 text-slate-400 hover:text-white rounded transition cursor-pointer"
                          title="Copy commands"
                        >
                          {copiedText === "terminal" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="p-4 font-mono text-xs text-slate-300 space-y-3 leading-relaxed overflow-x-auto">
                        <div>
                          <span className="text-slate-600"># 1. Install all project packages</span>
                          <div className="text-emerald-400 mt-1">npm install</div>
                        </div>
                        <div>
                          <span className="text-slate-600"># 2. Start the local server</span>
                          <div className="text-emerald-400 mt-1">npm run dev</div>
                        </div>
                        <div className="pt-2 border-t border-slate-900/60 text-[10px] text-slate-500">
                          * Note: configure local <code className="text-[10px] font-mono text-slate-400">.env</code> keys when integrating Gemini API endpoints or secrets.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 4: SHARE TO PHONE */}
            {activeView === "share" && (
              <motion.div
                key="share-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-900/40 rounded-xl border border-slate-900 p-6 md:p-8"
              >
                {/* Left Column: QR Code & Copy */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6 bg-slate-950/40 p-6 rounded-xl border border-slate-850">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-amber-950/60 border border-amber-800 text-amber-400 flex items-center justify-center mb-3">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold text-white">Scan to Open</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Point your smartphone camera at the QR code below to immediately open this app.
                    </p>
                  </div>

                  {/* QR Code Container with Theme Glow */}
                  <div 
                    className="p-4 bg-white rounded-2xl shadow-xl transition-all relative overflow-hidden"
                    style={{ boxShadow: `0 0 25px ${selectedTheme.glow}` }}
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(mobileUrl)}`}
                      alt="Workspace App QR Code"
                      className="w-[220px] h-[220px] select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Editable / Copyable Link Section */}
                  <div className="w-full space-y-2">
                    <label className="block text-xs font-medium text-slate-400">Shareable Application Link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={mobileUrl}
                        onChange={(e) => setMobileUrl(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800/85 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-slate-700 transition"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(mobileUrl);
                          setCopiedText("mobile-link");
                          setTimeout(() => setCopiedText(null), 2000);
                        }}
                        className={`px-4 rounded-lg flex items-center justify-center transition text-xs font-semibold ${selectedTheme.button}`}
                      >
                        {copiedText === "mobile-link" ? (
                          <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Copied</span>
                        ) : (
                          <span className="flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> Copy</span>
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 text-center">
                      * If you generated a custom preview link or are using a custom domain, paste it above to refresh the QR code!
                    </p>
                  </div>
                </div>

                {/* Right Column: Platform Installation Guides */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-amber-400" /> Share & Install on Mobile (PWA)
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">
                      You can save this application to your iPhone, iPad, or Android home screen. It will launch full-screen, without browser bars, behaving like a native mobile app!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* iOS Guide */}
                    <div className="bg-slate-950/60 p-5 rounded-lg border border-slate-850">
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-900">
                        <div className="h-6 w-6 rounded-full bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono">🍎</div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Apple iOS (Safari)</h4>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-2.5">
                          <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded h-fit">Step 1</span>
                          <p className="text-xs text-slate-300">
                            Scan the QR code or open the copied link inside the default <strong className="text-white">Safari Browser</strong>.
                          </p>
                        </div>
                        <div className="flex gap-2.5">
                          <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded h-fit">Step 2</span>
                          <p className="text-xs text-slate-300">
                            Tap the <strong className="text-white">Share</strong> button (the square icon with an upward-pointing arrow) in Safari's toolbar.
                          </p>
                        </div>
                        <div className="flex gap-2.5">
                          <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded h-fit">Step 3</span>
                          <p className="text-xs text-slate-300">
                            Scroll through the options list and select <strong className="text-white">"Add to Home Screen"</strong>.
                          </p>
                        </div>
                        <div className="flex gap-2.5">
                          <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded h-fit">Step 4</span>
                          <p className="text-xs text-slate-300">
                            Name the application icon (e.g. "My Workspace") and tap <strong className="text-white">"Add"</strong>.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Android Guide */}
                    <div className="bg-slate-950/60 p-5 rounded-lg border border-slate-850">
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-900">
                        <div className="h-6 w-6 rounded-full bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono">🤖</div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Google Android (Chrome)</h4>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-2.5">
                          <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded h-fit">Step 1</span>
                          <p className="text-xs text-slate-300">
                            Scan the QR code or paste the URL inside the <strong className="text-white">Google Chrome Browser</strong>.
                          </p>
                        </div>
                        <div className="flex gap-2.5">
                          <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded h-fit">Step 2</span>
                          <p className="text-xs text-slate-300">
                            Tap the <strong className="text-white">Menu</strong> button (three vertical dots <strong className="text-white">⋮</strong>) at the top-right corner.
                          </p>
                        </div>
                        <div className="flex gap-2.5">
                          <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded h-fit">Step 3</span>
                          <p className="text-xs text-slate-300">
                            Select <strong className="text-white">"Install app"</strong> or <strong className="text-white">"Add to Home screen"</strong> from the menu.
                          </p>
                        </div>
                        <div className="flex gap-2.5">
                          <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded h-fit">Step 4</span>
                          <p className="text-xs text-slate-300">
                            Confirm the installation pop-up. The applet will render fully responsive on your phone screen!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prototyping Note */}
                  <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded-xl flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold text-white">Full Responsive State Synchronization</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        Any tasks and notes you create on your phone or desktop are persisted securely. Since this workspace uses localStorage, each client maintains its separate secure board.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer / Informational Box */}
        <footer className="text-center pt-8 border-t border-slate-900 text-xs text-slate-500 mt-12">
          <p className="mb-2">
            Raynolf Acquah — Crafted with modern React, Tailwind, and Lucide Icons.
          </p>
          <div className="flex justify-center gap-4 text-slate-600 font-mono">
            <span>React 19 + Vite 6</span>
            <span>•</span>
            <span>Local Time: {new Date().toLocaleDateString()}</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
