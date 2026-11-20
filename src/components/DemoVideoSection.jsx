import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import coinImage from "@/assets/reward-coin.png";
import "@/components/coin.css";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Subtitles, 
  Trophy, 
  Target, 
  Code2, 
  TrendingUp, 
  CheckCircle2, 
  Terminal, 
  Building2, 
  Search, 
  Tv, 
  Coins, 
  ChevronRight, 
  Medal, 
  Award, 
  ChevronLeft, 
  Menu, 
  X, 
  Check, 
  ArrowRight,
  Bell,
  Sparkles
} from "lucide-react";

// Fast, snappy chapters with exactly 2-second gaps between dialogues (Total: 90 seconds / 1m 30s)
const CHAPTERS = [
  {
    id: "dashboard",
    title: "1. Student Dashboard",
    timeStart: 0,
    timeEnd: 18,
    timestamp: "0:00",
    icon: Target,
    subtitles: [
      { start: 0, end: 8, text: "Welcome to CodeConnect! Logging in opens Ramu Parasa's official Student Dashboard with 540 Total Coins." },
      // 2s gap (8s - 10s)
      { start: 10, end: 18, text: "Track your solved challenges across Easy, Medium, and Hard, and jump right into practice problems." }
    ]
  },
  {
    id: "compiler",
    title: "2. Compiler (3Sum Closest)",
    timeStart: 18,
    timeEnd: 38,
    timestamp: "0:18",
    icon: Terminal,
    subtitles: [
      { start: 18, end: 26, text: "Opening '3Sum Closest' launches CodeConnect's In-Browser IDE with problem description and test inputs." },
      // 2s gap (26s - 28s)
      { start: 28, end: 36, text: "Write your solution in Java, customize stdin inputs, and click 'Run Code' to execute instantly." }
    ]
  },
  {
    id: "reward",
    title: "3. Practice Completed & Coins",
    timeStart: 38,
    timeEnd: 54,
    timestamp: "0:38",
    icon: Coins,
    subtitles: [
      { start: 38, end: 45, text: "Practice Problem Completed! Ramu Parasa earns +25 CodeCoins directly credited to the wallet balance." },
      // 2s gap (45s - 47s)
      { start: 47, end: 54, text: "Consistency is key — solve more algorithmic challenges to climb the ranks and unlock rewards." }
    ]
  },
  {
    id: "leaderboard",
    title: "4. Developer Leaderboard",
    timeStart: 54,
    timeEnd: 72,
    timestamp: "0:54",
    icon: Trophy,
    subtitles: [
      { start: 54, end: 62, text: "The Developer Leaderboard ranks top coders based on problem-solving achievements and coding excellence." },
      // 2s gap (62s - 64s)
      { start: 64, end: 72, text: "Ramu Parasa takes 1st Place Champion with 565 coins, benchmarked against top talent." }
    ]
  },
  {
    id: "companies",
    title: "5. Companies & Hiring",
    timeStart: 72,
    timeEnd: 90,
    timestamp: "1:12",
    icon: Building2,
    subtitles: [
      { start: 72, end: 80, text: "Discover leading tech companies actively hiring developers on CodeConnect, including Google, Apple, and Microsoft." },
      // 2s gap (80s - 82s)
      { start: 82, end: 90, text: "View company challenges and apply directly with your verified CodeConnect score. Start coding today!" }
    ]
  }
];

const TOTAL_DURATION = 90; // 90 seconds (1 minute 30 seconds) quick tour

export const DemoVideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [voiceNarration, setVoiceNarration] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [compilerRunning, setCompilerRunning] = useState(false);
  const [compilerPassed, setCompilerPassed] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const containerRef = useRef(null);
  const speechRef = useRef(null);
  const lastSpokenSubRef = useRef("");
  const currentTextRef = useRef("");
  const charIndexRef = useRef(0);
  const isSpeechPausedRef = useRef(false);

  const getCurrentSubtitle = useCallback(() => {
    const currentChapter = CHAPTERS[activeTab] || CHAPTERS[0];
    const sub = currentChapter.subtitles.find(
      (s) => currentTime >= s.start && currentTime < s.end
    );
    return sub ? sub.text : "";
  }, [activeTab, currentTime]);

  // Sync active chapter, compiler simulation, and reward modal with currentTime
  useEffect(() => {
    const chapterIdx = CHAPTERS.findIndex(
      (c) => currentTime >= c.timeStart && currentTime < c.timeEnd
    );
    if (chapterIdx !== -1) {
      setActiveTab((prev) => (prev !== chapterIdx ? chapterIdx : prev));
    }

    // Auto-simulation for compiler & reward modal based on timeline
    if (currentTime >= 28 && currentTime < 31) {
      setCompilerRunning(true);
    } else {
      setCompilerRunning(false);
    }

    if (currentTime >= 31 && currentTime < 54) {
      setCompilerPassed(true);
    } else if (currentTime < 28) {
      setCompilerPassed(false);
    }

    if (currentTime >= 38 && currentTime < 54) {
      setShowRewardModal(true);
    } else if (currentTime < 38 || currentTime >= 54) {
      setShowRewardModal(false);
    }
  }, [currentTime]);

  const resetSpeechState = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    isSpeechPausedRef.current = false;
    charIndexRef.current = 0;
    currentTextRef.current = "";
    lastSpokenSubRef.current = "";
  }, []);

  // Timer loop for simulation mode
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION) {
            setIsPlaying(false);
            resetSpeechState();
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, resetSpeechState]);

  // Ensure voices are initialized
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      };
    }
  }, []);

  // Select preferred soft, natural, human-sounding male voice
  const getPreferredMaleVoice = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return { voice: null, isNatural: false };
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return { voice: null, isNatural: false };

    const isExcluded = (name) => {
      const lower = name.toLowerCase();
      return (
        lower.includes("female") ||
        lower.includes("zira") ||
        lower.includes("jenny") ||
        lower.includes("aria") ||
        lower.includes("hazel") ||
        lower.includes("susan") ||
        lower.includes("catherine") ||
        lower.includes("linda") ||
        lower.includes("heera") ||
        lower.includes("sita") ||
        lower.includes("julie")
      );
    };

    // Priority 1: High-fidelity "Natural" neural male voices (Microsoft Online Natural: Ryan, Guy, Christopher, Eric)
    const naturalMaleNames = ["Ryan", "Guy", "Christopher", "Eric", "Steffan", "Brian"];
    for (const name of naturalMaleNames) {
      const match = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          v.name.includes("Natural") &&
          v.name.includes(name) &&
          !isExcluded(v.name)
      );
      if (match) return { voice: match, isNatural: true };
    }

    // Any other English Natural voice not excluded
    const anyNatural = voices.find(
      (v) => v.lang.startsWith("en") && v.name.includes("Natural") && !isExcluded(v.name)
    );
    if (anyNatural) return { voice: anyNatural, isNatural: true };

    // Priority 2: Google & Apple studio quality voices
    const studioNames = [
      "Google UK English Male",
      "Google US English",
      "Daniel",
      "Oliver",
      "Alex",
      "Microsoft David",
      "Microsoft Mark"
    ];
    for (const name of studioNames) {
      const match = voices.find(
        (v) => v.lang.startsWith("en") && v.name.includes(name) && !isExcluded(v.name)
      );
      if (match) return { voice: match, isNatural: false };
    }

    // Priority 3: Fallback English voice
    const englishMale = voices.find((v) => v.lang.startsWith("en") && !isExcluded(v.name));
    return { voice: englishMale || voices[0], isNatural: false };
  }, []);

  // Speak dialogue helper with word-level boundary tracking and soft audio tuning
  const speakDialogue = useCallback(
    (text, startChar = 0) => {
      if (!voiceNarration || isMuted || typeof window === "undefined" || !window.speechSynthesis || !text) return;

      window.speechSynthesis.cancel();

      const textToSpeak = startChar > 0 ? text.slice(startChar).trim() : text;
      if (!textToSpeak) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const { voice, isNatural } = getPreferredMaleVoice();
      if (voice) {
        utterance.voice = voice;
      }

      // Soft, warm, human narrator tone:
      // Neural natural voices remain at pitch 1.0 to preserve authentic vocal warmth
      utterance.pitch = isNatural ? 1.0 : 0.94;
      utterance.rate = (isNatural ? 0.96 : 0.94) * playbackSpeed; // Calm, gentle, human conversational pacing
      utterance.volume = 0.90; // Gentle, clear volume

      utterance.onboundary = (event) => {
        if (event.charIndex !== undefined) {
          charIndexRef.current = startChar + event.charIndex;
        }
      };

      utterance.onend = () => {
        if (!isSpeechPausedRef.current) {
          charIndexRef.current = 0;
        }
      };

      utterance.onerror = () => {
        isSpeechPausedRef.current = false;
      };

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [voiceNarration, isMuted, playbackSpeed, getPreferredMaleVoice]
  );

  // Sync narration with playback timeline and dialogue transitions
  useEffect(() => {
    if (!voiceNarration || isMuted || typeof window === "undefined" || !window.speechSynthesis) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      return;
    }

    if (!isPlaying) {
      return;
    }

    const currentSubtitle = getCurrentSubtitle();
    if (currentSubtitle && currentSubtitle !== lastSpokenSubRef.current) {
      lastSpokenSubRef.current = currentSubtitle;
      currentTextRef.current = currentSubtitle;
      charIndexRef.current = 0;
      isSpeechPausedRef.current = false;
      speakDialogue(currentSubtitle, 0);
    } else if (!currentSubtitle && lastSpokenSubRef.current) {
      // In dialogue gap:
      lastSpokenSubRef.current = "";
      currentTextRef.current = "";
      charIndexRef.current = 0;
      isSpeechPausedRef.current = false;
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    }
  }, [currentTime, voiceNarration, isMuted, isPlaying, getCurrentSubtitle, speakDialogue]);

  // Master Play / Pause Toggle with instantaneous voice pause & resume from exact position
  const togglePlay = () => {
    if (isPlaying) {
      // User clicked PAUSE:
      setIsPlaying(false);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          isSpeechPausedRef.current = true;
        }
      }
    } else {
      // User clicked START / CONTINUE:
      setIsPlaying(true);
      if (typeof window !== "undefined" && window.speechSynthesis && voiceNarration && !isMuted) {
        if (isSpeechPausedRef.current) {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setTimeout(() => {
              if (window.speechSynthesis && !window.speechSynthesis.speaking && isSpeechPausedRef.current) {
                const fullText = currentTextRef.current;
                if (fullText) {
                  speakDialogue(fullText, charIndexRef.current);
                }
              }
              isSpeechPausedRef.current = false;
            }, 120);
          } else {
            // If browser dropped utterance during pause, seamlessly speak remaining text
            const fullText = currentTextRef.current;
            if (fullText) {
              speakDialogue(fullText, charIndexRef.current);
            }
            isSpeechPausedRef.current = false;
          }
        } else {
          // If starting on a fresh subtitle
          const curSub = getCurrentSubtitle();
          if (curSub && curSub !== lastSpokenSubRef.current) {
            lastSpokenSubRef.current = curSub;
            currentTextRef.current = curSub;
            charIndexRef.current = 0;
            speakDialogue(curSub, 0);
          }
        }
      }
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    resetSpeechState();
    setCurrentTime(newTime);
  };

  const jumpToChapter = (index) => {
    const target = CHAPTERS[index];
    resetSpeechState();
    setActiveTab(index);
    setCurrentTime(target.timeStart);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleRunCodeClick = () => {
    setCompilerRunning(true);
    setCompilerPassed(false);
    setTimeout(() => {
      setCompilerRunning(false);
      setCompilerPassed(true);
      setShowRewardModal(true);
    }, 1000);
  };

  return (
    <section className="relative py-16 bg-gradient-to-b from-background via-secondary/20 to-background border-y border-border/40 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 max-w-6xl">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-4 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>Interactive 90-Second Quick Tour • CodeConnect</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            See How It Works
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Experience the real post-login application in under 2 minutes: live dashboard stats, 3Sum Closest in the compiler, 3D rotating reward coin, developer leaderboard podium, and hiring companies.
          </p>
        </div>

        {/* Video / Application Player Window */}
        <div 
          ref={containerRef}
          className="relative bg-card rounded-2xl border border-border shadow-2xl overflow-hidden transition-all duration-300 ring-1 ring-border/50"
        >
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-muted/70 border-b border-border select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-destructive/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-success/80 inline-block"></span>
              <span className="ml-2 text-xs font-mono text-muted-foreground hidden sm:inline">
                https://code-connect-sand-eta.vercel.app
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-background/80 font-mono flex items-center gap-1.5 py-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping inline-block"></span>
                <span>{isPlaying ? "PLAYING" : "PAUSED"}</span>
                <span className="text-muted-foreground">|</span>
                <span>{formatTime(currentTime)} / 1:30</span>
              </Badge>
            </div>
          </div>

          {/* Main Visual Display Area */}
          <div className="relative aspect-video w-full bg-[#f4f6f8] text-slate-800 overflow-hidden flex flex-col justify-between">
            
            {/* EXACT TOP NAVBAR FROM REAL CODECONNECT APP */}
            <div className="border-b border-slate-200/80 bg-white/95 px-6 py-3 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-lg text-[#2563eb]">
                <span className="font-mono text-base font-extrabold">&lt;/&gt;</span>
                <span className="tracking-tight">CodeConnect</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Notification Bell with red badge */}
                <div className="relative cursor-pointer text-slate-600 hover:text-slate-900">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </div>
                {/* User Avatar Circle "R" */}
                <div className="w-8 h-8 rounded-full bg-[#dbeafe] text-[#2563eb] font-bold flex items-center justify-center text-sm shadow-xs border border-blue-200">
                  R
                </div>
              </div>
            </div>

            {/* SCREEN CONTENT AREA (100% Matching User Screenshots) */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#f3f4f6]">
              
              {/* SCENE 1: STUDENT DASHBOARD (IMAGE 1) */}
              {activeTab === 0 && (
                <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
                  {/* 4 Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Card 1: Total Coins */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-slate-500 mb-1">Total Coins</div>
                        <div className="text-3xl font-extrabold text-[#f59e0b]">540</div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-[#f59e0b]">
                        <Trophy className="w-7 h-7" />
                      </div>
                    </div>

                    {/* Card 2: Easy Problems */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-slate-500 mb-1">Easy Problems</div>
                        <div className="text-3xl font-extrabold text-[#10b981]">9</div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#10b981]">
                        <Target className="w-7 h-7" />
                      </div>
                    </div>

                    {/* Card 3: Medium Problems */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-slate-500 mb-1">Medium Problems</div>
                        <div className="text-3xl font-extrabold text-[#f59e0b]">8</div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-[#f59e0b] font-mono text-xl font-bold">
                        &lt;/&gt;
                      </div>
                    </div>

                    {/* Card 4: Hard Problems */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-slate-500 mb-1">Hard Problems</div>
                        <div className="text-3xl font-extrabold text-[#ef4444]">5</div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-[#ef4444]">
                        <TrendingUp className="w-7 h-7" />
                      </div>
                    </div>
                  </div>

                  {/* Welcome Section */}
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                      Welcome back, Ramu Parasa
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Ready to solve some problems and earn more coins?
                    </p>
                  </div>

                  {/* Practice Problems Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-slate-900">Practice Problems</h2>
                      <button className="px-4 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg text-xs font-medium shadow-xs">
                        View All Problems
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 shadow-xs">
                      {/* Problem 1: Set Matrix Zeroes */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-slate-900">Set Matrix Zeroes</span>
                            <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#d97706] text-[11px] font-semibold">
                              Medium
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">Topics: Matrix</div>
                        </div>

                        <div className="flex sm:flex-col items-end gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#10b981] text-white text-[11px] font-medium">
                            <Check className="w-3 h-3" /> Solved
                          </span>
                          <button className="px-3.5 py-1.5 bg-[#4f46e5] text-white rounded-lg text-xs font-medium shadow-xs hover:bg-[#4338ca]">
                            Practice Again
                          </button>
                        </div>
                      </div>

                      {/* Problem 2: 3Sum */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-slate-900">3Sum</span>
                            <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#d97706] text-[11px] font-semibold">
                              Medium
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">Topics: Array, Two Pointers, So...</div>
                        </div>

                        <div className="flex sm:flex-col items-end gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#10b981] text-white text-[11px] font-medium">
                            <Check className="w-3 h-3" /> Solved
                          </span>
                          <button className="px-3.5 py-1.5 bg-[#4f46e5] text-white rounded-lg text-xs font-medium shadow-xs hover:bg-[#4338ca]">
                            Practice Again
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 2 & 3: IN-BROWSER COMPILER & 3D ROTATING COIN OUTCOME MODAL (IMAGE 2 & 3) */}
              {(activeTab === 1 || activeTab === 2) && (
                <div className="space-y-3 max-w-5xl mx-auto animate-fadeIn relative">
                  {/* Problem Top Header */}
                  <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <ChevronLeft className="w-4 h-4 text-slate-600 cursor-pointer" />
                      <span className="font-bold text-sm text-slate-900">3Sum Closest</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#d97706] text-[11px] font-semibold">
                        Medium
                      </span>
                    </div>
                    <Menu className="w-4 h-4 text-slate-600 cursor-pointer" />
                  </div>

                  {/* Two Column Layout: Description & Code Editor */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 min-h-[360px]">
                    
                    {/* Left: Problem Description */}
                    <div className="md:col-span-6 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between text-xs space-y-3">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-2 border-b border-slate-100 pb-2">
                          <span className="font-mono text-primary font-bold">&lt;/&gt;</span>
                          <span>Problem Description</span>
                        </div>
                        <p className="text-slate-600 mb-3 leading-relaxed text-[11px]">
                          Given an integer array nums and a target value, return the sum of three integers in nums closest to the target.
                        </p>
                        
                        <div className="space-y-1.5 text-[11px] text-slate-600 mb-3">
                          <div className="font-semibold text-slate-800">Input:</div>
                          <div>First line contains n.</div>
                          <div>Second line contains n integers.</div>
                          <div>Third line contains target.</div>
                          <div className="font-semibold text-slate-800 pt-1">Output:</div>
                          <div>Print the closest sum.</div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <div className="font-semibold text-slate-800 text-[11px] mb-1">Input:</div>
                            <div className="bg-[#f8fafc] p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 whitespace-pre">
4
-1 2 1 -4
1
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold text-slate-800 text-[11px] mb-1">Output:</div>
                            <div className="bg-[#f8fafc] p-2 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
2
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                        <span className="font-semibold text-slate-700">Topics:</span> Array, Two Pointers
                      </div>
                    </div>

                    {/* Right: Code Editor & Execution */}
                    <div className="md:col-span-6 flex flex-col gap-3">
                      
                      {/* Language & Actions Bar */}
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                          Java (OpenJDK 13.0.1) ▾
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" /> Reset
                          </button>
                          <button 
                            onClick={handleRunCodeClick}
                            disabled={compilerRunning}
                            className="px-4 py-1.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                          >
                            {compilerRunning ? (
                              <>
                                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Running...
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 fill-current" /> Run Code
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Code Editor Body */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex-1 flex flex-col justify-between font-mono text-xs text-slate-800 relative">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] border-b border-slate-100 pb-1.5 mb-2">
                          <span>&gt;_ Code Editor</span>
                        </div>
                        <div className="relative flex-1">
                          <div className="space-y-0.5 leading-relaxed text-[11px] text-slate-700 overflow-y-auto max-h-[165px] pr-4">
                            <div><span className="text-[#9333ea]">import</span> java.util.*;</div>
                            <div><span className="text-[#9333ea]">public class</span> <span className="text-[#2563eb]">Main</span> &#123;</div>
                            <div className="pl-3"><span className="text-[#9333ea]">public static void</span> <span className="text-[#2563eb]">main</span>(String[] args) &#123;</div>
                            <div className="pl-6">Scanner sc = <span className="text-[#9333ea]">new</span> Scanner(System.in);</div>
                            <div className="pl-6"><span className="text-[#9333ea]">int</span> n = sc.nextInt();</div>
                            <div className="pl-6"><span className="text-[#9333ea]">int</span>[] nums = <span className="text-[#9333ea]">new int</span>[n];</div>
                            <div className="pl-6"><span className="text-[#9333ea]">for</span> (<span className="text-[#9333ea]">int</span> i = 0; i &lt; n; i++) nums[i] = sc.nextInt();</div>
                            <div className="pl-6"><span className="text-[#9333ea]">int</span> target = sc.nextInt();</div>
                            <div className="pl-6">Arrays.sort(nums);</div>
                            <div className="pl-6"><span className="text-[#9333ea]">int</span> closest = nums[0] + nums[1] + nums[2];</div>
                            <div className="pl-6"><span className="text-[#9333ea]">for</span> (<span className="text-[#9333ea]">int</span> i = 0; i &lt; n - 2; i++) &#123;</div>
                            <div className="pl-9"><span className="text-[#9333ea]">int</span> l = i + 1, r = n - 1;</div>
                            <div className="pl-9"><span className="text-[#9333ea]">while</span> (l &lt; r) &#123;</div>
                            <div className="pl-12"><span className="text-[#9333ea]">int</span> sum = nums[i] + nums[l] + nums[r];</div>
                            <div className="pl-12"><span className="text-[#9333ea]">if</span> (Math.abs(target - sum) &lt; Math.abs(target - closest)) closest = sum;</div>
                            <div className="pl-12"><span className="text-[#9333ea]">if</span> (sum &lt; target) l++;</div>
                            <div className="pl-12"><span className="text-[#9333ea]">else if</span> (sum &gt; target) r--;</div>
                            <div className="pl-12"><span className="text-[#9333ea]">else</span> &#123; closest = sum; break; &#125;</div>
                            <div className="pl-9">&#125;</div>
                            <div className="pl-6">&#125;</div>
                            <div className="pl-6">System.out.println(closest);</div>
                            <div className="pl-3">&#125;</div>
                            <div>&#125;</div>
                          </div>
                          {/* Visible Scrollbar Mock on Right matching deployed screenshot */}
                          <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-slate-100 rounded-full flex flex-col justify-start p-0.5 pointer-events-none">
                            <div className="w-full h-14 bg-slate-400/80 rounded-full shadow-xs"></div>
                          </div>
                        </div>
                      </div>

                      {/* Input (stdin) and Output side-by-side */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                          <div className="text-[10px] font-semibold text-slate-500 mb-1">Input (stdin)</div>
                          <div className="font-mono text-[11px] text-slate-700 whitespace-pre">
4
-1 2 1 -4
1
                          </div>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                          <div className="text-[10px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
                            <span>Output</span>
                            {compilerPassed && <span className="text-emerald-500 font-semibold">● 200 OK</span>}
                          </div>
                          <div className="font-mono text-[11px] text-slate-700">
                            {compilerRunning ? (
                              <span className="text-slate-400">Compiling on judge...</span>
                            ) : compilerPassed ? (
                              <span className="font-bold text-emerald-600">2</span>
                            ) : (
                              <span className="text-slate-400">Output will appear here</span>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* SCENE 3: EXACT 3D ROTATING COIN REWARD MODAL (IMAGE 3 & OutcomeModal.jsx) */}
                  {showRewardModal && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-xs rounded-xl p-4 animate-in fade-in duration-200">
                      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center border border-slate-200 animate-modal-float">
                        {/* Close button */}
                        <button 
                          onClick={() => setShowRewardModal(false)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        {/* Title with green check */}
                        <div className="flex items-center gap-2 justify-center mb-3 text-left">
                          <div className="w-5 h-5 rounded-full bg-[#10b981] text-white flex items-center justify-center text-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span className="font-bold text-sm text-slate-900">Practice Problem Completed!</span>
                        </div>

                        {/* Coins Earned */}
                        <div className="text-lg font-bold text-slate-900 mb-1">
                          Coins Earned: <span className="text-[#f59e0b]">25</span>
                        </div>

                        <p className="text-xs text-slate-500 mb-2">
                          Consistency is key, Keep practicing and solve more problems
                        </p>

                        {/* REAL 3D ROTATING CONTINUOUS COIN WITH EXTRUSION (MATCHING OUTCOMEMODAL.JSX) */}
                        <div className="relative w-28 h-28 my-2 mx-auto" style={{ perspective: "1000px" }}>
                          <div className="coin-3d-container">
                            {[...Array(12)].map((_, index) => (
                              <img
                                key={index}
                                src={coinImage}
                                alt="Reward Coin"
                                className="coin-layer drop-shadow-sm"
                                style={{
                                  transform: `translateZ(-${index}px)`,
                                  pointerEvents: 'none'
                                }}
                              />
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* SCENE 4: DEVELOPER LEADERBOARD & PODIUM (IMAGE 4 & 5) */}
              {activeTab === 3 && (
                <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
                  {/* Top Header */}
                  <div className="text-center pt-2">
                    <div className="w-14 h-14 rounded-full bg-[#3b82f6] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                      <Trophy className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a8a] mb-1">
                      Developer Leaderboard
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                      Discover top talent ranked by their problem-solving achievements and coding excellence
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="max-w-md mx-auto">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input 
                        readOnly
                        placeholder="Search developers..."
                        className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Top 3 Podium Cards */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 items-end max-w-2xl mx-auto pt-2">
                    {/* 2nd Place: Hamilton */}
                    <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 text-center shadow-xs">
                      <div className="w-7 h-7 mx-auto mb-1 text-slate-400">
                        <Medal className="w-7 h-7" />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center mx-auto mb-2 text-base">
                        H
                      </div>
                      <div className="font-bold text-xs text-slate-900 truncate">Hamilton</div>
                      <div className="flex items-center justify-center gap-1 text-xs text-slate-600 mt-0.5">
                        <Coins className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="font-bold">35</span>
                      </div>
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-slate-300 text-slate-800 text-[10px] font-semibold">
                        2nd Place
                      </span>
                    </div>

                    {/* 1st Place: Ramu Parasa (Yellow Elevated Card) */}
                    <div className="bg-[#fef9c3] p-5 rounded-2xl border-2 border-[#facc15] text-center shadow-md transform sm:-translate-y-2">
                      <div className="w-8 h-8 mx-auto mb-1 text-[#eab308]">
                        <Trophy className="w-8 h-8" />
                      </div>
                      <div className="w-14 h-14 rounded-full bg-[#facc15] text-slate-900 font-bold flex items-center justify-center mx-auto mb-2 text-lg shadow-xs">
                        R
                      </div>
                      <div className="font-bold text-sm text-slate-900 truncate">Ramu Parasa</div>
                      <div className="flex items-center justify-center gap-1 text-xs text-slate-800 mt-0.5">
                        <Coins className="w-4 h-4 text-yellow-600" />
                        <span className="font-extrabold text-sm">565</span>
                      </div>
                      <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#eab308] text-white text-[10px] font-bold">
                        Champion
                      </span>
                    </div>

                    {/* 3rd Place: Phani */}
                    <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 text-center shadow-xs">
                      <div className="w-7 h-7 mx-auto mb-1 text-amber-600">
                        <Award className="w-7 h-7" />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center mx-auto mb-2 text-base">
                        P
                      </div>
                      <div className="font-bold text-xs text-slate-900 truncate">Phani</div>
                      <div className="flex items-center justify-center gap-1 text-xs text-slate-600 mt-0.5">
                        <Coins className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="font-bold">20</span>
                      </div>
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-semibold">
                        3rd Place
                      </span>
                    </div>
                  </div>

                  {/* All Rankings Table (Image 5) */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
                    <h2 className="text-base font-bold text-slate-900 mb-2">All Rankings</h2>

                    {[
                      { rank: 1, icon: Trophy, iconColor: "text-yellow-500", letter: "R", name: "Ramu Parasa", email: "ramuparasa02@gmail.com", coins: 565, pillColor: "bg-[#eab308] text-white" },
                      { rank: 2, icon: Medal, iconColor: "text-slate-400", letter: "H", name: "Hamilton", email: "lewis@gmail.com", coins: 35, pillColor: "bg-slate-300 text-slate-800" },
                      { rank: 3, icon: Award, iconColor: "text-amber-600", letter: "P", name: "Phani", email: "phaniswarjanyavula@gmail.com", coins: 20, pillColor: "bg-amber-500 text-white" },
                      { rank: 4, label: "#4", letter: "S", name: "Satya", email: "satya@gmail.com", coins: 10, pillColor: "bg-slate-200 text-slate-700" },
                      { rank: 5, label: "#5", letter: "B", name: "Balu Parasa", email: "baluparasa3@gmail.com", coins: 10, pillColor: "bg-slate-200 text-slate-700" }
                    ].map((row, idx) => {
                      const IconComp = row.icon;
                      return (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-6 flex items-center justify-center">
                              {IconComp ? (
                                <IconComp className={`w-5 h-5 ${row.iconColor}`} />
                              ) : (
                                <span className="text-xs font-bold text-slate-400">{row.label}</span>
                              )}
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                              {row.letter}
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-900">{row.name}</div>
                              <div className="text-[11px] text-slate-400">{row.email}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 font-bold text-xs text-slate-700">
                              <Coins className="w-3.5 h-3.5 text-yellow-500" />
                              <span>{row.coins}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${row.pillColor}`}>
                              #{row.rank}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SCENE 5: COMPANIES (IMAGE 6) */}
              {activeTab === 4 && (
                <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                      Companies
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Discover top companies hiring developers
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Google */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-full bg-[#dbeafe] text-[#2563eb] font-bold text-lg flex items-center justify-center mb-3">
                          G
                        </div>
                        <h2 className="font-bold text-base text-slate-900 mb-1">Google</h2>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          Start your journey with us and be part of a team that creates innovative technologies shaping the future of the digital world.
                        </p>
                      </div>
                      <button className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
                        View Profile <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Apple */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-full bg-[#dbeafe] text-[#2563eb] font-bold text-lg flex items-center justify-center mb-3">
                          A
                        </div>
                        <h2 className="font-bold text-base text-slate-900 mb-1">Apple</h2>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          Start your journey with us and become part of a team building innovative technologies that shape the future of the digital...
                        </p>
                      </div>
                      <button className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
                        View Profile <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Microsoft */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-full bg-[#dbeafe] text-[#2563eb] font-bold text-lg flex items-center justify-center mb-3">
                          M
                        </div>
                        <h2 className="font-bold text-base text-slate-900 mb-1">Microsoft</h2>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          Begin your journey with us and join a team creating innovative technologies that drive digital transformation and global...
                        </p>
                      </div>
                      <button className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
                        View Profile <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Subtitles Overlay - Placed Bottom Middle Cleanly */}
            {showSubtitles && (
              <div className="absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 w-11/12 max-w-2xl pointer-events-none z-30">
                <div className="bg-black/90 backdrop-blur-md text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-xl border border-white/10 text-center shadow-2xl transition-all duration-300 leading-relaxed">
                  <span className="inline-block mr-1 text-primary">💬</span>
                  {getCurrentSubtitle()}
                </div>
              </div>
            )}

            {/* Controls Bar */}
            <div className="relative z-30 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-2.5 sm:p-3 text-slate-200">
              
              {/* Timeline Scrubber */}
              <div className="relative w-full flex items-center mb-2 group">
                <input
                  type="range"
                  min="0"
                  max={TOTAL_DURATION}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Video scrubber"
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary group-hover:h-2 transition-all"
                />
                {CHAPTERS.map((c, i) => (
                  <div
                    key={i}
                    title={c.title}
                    style={{ left: `${(c.timeStart / TOTAL_DURATION) * 100}%` }}
                    className="absolute top-1/2 -translate-y-1/2 w-1 h-2.5 bg-white/40 pointer-events-none rounded"
                  />
                ))}
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={togglePlay}
                    className="h-8 w-8 p-0 text-white hover:text-primary hover:bg-slate-800 rounded-lg"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      resetSpeechState();
                      setCurrentTime(0);
                      setActiveTab(0);
                    }}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                    title="Restart from beginning"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>

                  <span className="text-xs font-mono text-slate-400 ml-1">
                    {formatTime(currentTime)} <span className="text-slate-600">/</span> {formatTime(TOTAL_DURATION)}
                  </span>

                  <span className="text-xs font-medium text-slate-300 hidden md:inline ml-2 pl-2 border-l border-slate-800">
                    {CHAPTERS[activeTab]?.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Speed selector */}
                  <div className="flex items-center text-xs bg-slate-900 border border-slate-800 rounded-md overflow-hidden">
                    {[1, 1.25, 1.5].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-2 py-1 transition-colors ${
                          playbackSpeed === spd ? "bg-primary text-white font-bold" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  {/* Subtitle Toggle */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSubtitles(!showSubtitles)}
                    className={`h-8 px-2 text-xs rounded-md ${
                      showSubtitles ? "bg-primary/20 text-primary border border-primary/40" : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                    title="Toggle Subtitles"
                  >
                    <Subtitles className="w-3.5 h-3.5 mr-1" />
                    <span className="hidden sm:inline">CC</span>
                  </Button>

                  {/* Voice Narration Audio Toggle */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const next = !voiceNarration;
                      setVoiceNarration(next);
                      if (!next) {
                        resetSpeechState();
                      } else {
                        setIsMuted(false);
                        if (isPlaying) {
                          const curSub = getCurrentSubtitle();
                          if (curSub) {
                            lastSpokenSubRef.current = curSub;
                            currentTextRef.current = curSub;
                            charIndexRef.current = 0;
                            speakDialogue(curSub, 0);
                          }
                        }
                      }
                    }}
                    className={`h-8 px-2 text-xs rounded-md ${
                      voiceNarration ? "bg-success/20 text-success border border-success/40" : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                    title="Toggle Voiceover Narration"
                  >
                    {voiceNarration && !isMuted ? <Volume2 className="w-3.5 h-3.5 mr-1" /> : <VolumeX className="w-3.5 h-3.5 mr-1" />}
                    <span className="hidden sm:inline">Voice</span>
                  </Button>

                  {/* Fullscreen Toggle */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleFullscreen}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                    title="Toggle Fullscreen"
                  >
                    {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter Quick Jump Bar */}
          <div className="bg-muted/40 border-t border-border p-3">
            <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center justify-between">
              <span>EXPLORE CODECONNECT SECTIONS (CLICK TO JUMP)</span>
              <span className="text-[11px] text-primary">Snappy 90s Quick Tour</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CHAPTERS.map((chap, idx) => {
                const Icon = chap.icon;
                const isActive = activeTab === idx;
                return (
                  <button
                    key={chap.id}
                    onClick={() => jumpToChapter(idx)}
                    className={`flex flex-col items-start p-2.5 rounded-xl text-left transition-all text-xs border ${
                      isActive 
                        ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                        : "bg-card hover:bg-muted border-border text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full mb-1">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                      <span className={`text-[10px] font-mono opacity-80 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`}>
                        {chap.timestamp}
                      </span>
                    </div>
                    <span className="font-semibold text-[11px] truncate w-full">
                      {chap.title.split(". ")[1]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DemoVideoSection;
