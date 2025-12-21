import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@/api/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Play, RotateCcw, ChevronLeft, Code2, Terminal, CheckCircle2, XCircle, Loader2, Clock, Trophy, Menu, Timer, Pause, Settings } from "lucide-react";
import OutcomeModal from "@/components/OutcomeModal";
import { CompilerSettingsDialog } from "@/components/CompilerSettingsDialog";
import CodeEditor from "@/components/CodeEditor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGES = [
  { id: 54, name: "C++ (GCC 9.2.0)", extension: "cpp" },
  { id: 62, name: "Java (OpenJDK 13.0.1)", extension: "java" },
  { id: 71, name: "Python (3.8.1)", extension: "py" },
  { id: 63, name: "JavaScript (Node.js 12.14.0)", extension: "js" },
  { id: 50, name: "C (GCC 9.2.0)", extension: "c" },
  { id: 72, name: "Ruby (2.7.0)", extension: "rb" },
  { id: 73, name: "Rust (1.40.0)", extension: "rs" },
  { id: 60, name: "Go (1.13.5)", extension: "go" },
  { id: 74, name: "TypeScript (3.7.4)", extension: "ts" },
];

const DEFAULT_CODE = {
  54: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    cout << "Hello, World!" << endl;
    return 0;
}`,
  62: `public class Main {
    public static void main(String[] args) {
        // Your code here
        System.out.println("Hello, World!");
    }
}`,
  71: `# Your code here
print("Hello, World!")`,
  63: `// Your code here
console.log("Hello, World!");`,
  50: `#include <stdio.h>

int main() {
    // Your code here
    printf("Hello, World!\\n");
    return 0;
}`,
  72: `# Your code here
puts "Hello, World!"`,
  73: `fn main() {
    // Your code here
    println!("Hello, World!");
}`,
  60: `package main

import "fmt"

func main() {
    // Your code here
    fmt.Println("Hello, World!")
}`,
};

const Compiler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("71");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [status, setStatus] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [memory, setMemory] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [coinsAwarded, setCoinsAwarded] = useState(0);

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardData, setRewardData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('compilerSettings');
      return saved ? JSON.parse(saved) : {
        layout: "toolbar",
        fontFamily: "Default",
        fontSize: "14px",
        wordWrap: true,
        shortcuts: {
          runCode: true,
          submit: true,
          fullScreen: true
        }
      };
    } catch (e) {
      console.error("Failed to parse settings:", e);
      return {
        layout: "toolbar",
        fontFamily: "Default",
        fontSize: "14px",
        wordWrap: true,
        shortcuts: {
          runCode: true,
          submit: true,
          fullScreen: true
        }
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('compilerSettings', JSON.stringify(settings));
  }, [settings]);

  // Stopwatch & Timer State
  const [activeTab, setActiveTab] = useState('stopwatch'); // 'stopwatch' | 'timer'
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);

  const [timerInput, setTimerInput] = useState({ hours: 0, minutes: 0 });
  const [countdownTime, setCountdownTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [showStopwatch, setShowStopwatch] = useState(false); // false = Start View, true = Active View (Inline)
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let interval;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 1);
      }, 1000);
    } else if (isTimerRunning && countdownTime > 0) {
      interval = setInterval(() => {
        setCountdownTime((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false); // Timer finished

            // Play Alarm Sound
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
            audio.play().catch(err => console.error("Audio play failed:", err));

            toast({
              title: "Time's up!",
              description: "The countdown timer has finished.",
            });

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning, isTimerRunning]);

  // ... inside render ...




  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchProblem = async () => {
      const source = searchParams.get("source");
      const problemId = searchParams.get("problemId");

      // Handling Logic based on Source
      if (source === "local" && problemId) {
        try {
          // Fetch problem details from backend
          const { data } = await api.get(`/problems/${problemId}`);
          setProblem({
            ...data,
            type: 'local',
            tags: data.topics || [],
            inputExample: data.input,
            outputExample: data.output
          });

          if (data.input) setInput(data.input);
          if (data.output) setExpectedOutput(data.output);

          // Check if solved
          checkSolved(problemId);

        } catch (error) {
          console.error("Failed to fetch problem", error);
          toast({
            title: "Error",
            description: "Failed to load problem details",
            variant: "destructive"
          });
        }
      }
      else if (source === "company") {
        // Handle company challenge from URL params
        const title = searchParams.get("title");
        const description = searchParams.get("description");
        const difficulty = searchParams.get("difficulty");
        const topic = searchParams.get("topic");
        const inputExample = searchParams.get("inputExample");
        const outputExample = searchParams.get("outputExample");

        setProblem({
          _id: problemId || 'company-challenge',
          title: title || "Company Challenge",
          description: description || "No description provided.",
          difficulty: difficulty || "medium",
          topics: topic ? [topic] : [],
          inputExample: inputExample || "",
          outputExample: outputExample || "",
          type: 'company',
          company: searchParams.get("company") // Add company name
        });

        if (inputExample) setInput(inputExample);
        if (outputExample) setExpectedOutput(outputExample);

        // Check if solved (load previous code)
        if (problemId) {
          checkSolved(problemId);
        }
      }
    };

    fetchProblem();
    setCode(DEFAULT_CODE[71]);
  }, [searchParams]);

  const checkSolved = async (problemId) => {
    try {
      const { data: submissions } = await api.get('/submissions/my');

      // Filter for this problem (check both problem and challenge fields)
      const problemSubmissions = submissions.filter(s =>
        (s.problem?._id === problemId || s.problem === problemId) ||
        (s.challenge?._id === problemId || s.challenge === problemId)
      );

      if (problemSubmissions.length > 0) {
        // Check if any passed
        const passedSubmission = problemSubmissions.find(s => s.status === 'passed');
        const latestSubmission = problemSubmissions[0]; // Assumes sorted by createdAt desc from backend

        const submissionToLoad = passedSubmission || latestSubmission;

        // Set Solved Status
        if (passedSubmission) {
          setProblem(prev => ({ ...prev, isSolved: true }));
        }

        // Set Code and Language
        if (submissionToLoad && submissionToLoad.code) {
          setCode(submissionToLoad.code);
          // Find language ID by name
          const lang = LANGUAGES.find(l => l.name === submissionToLoad.language);
          if (lang) {
            setLanguage(lang.id.toString());
          }
        }
      }
    } catch (error) {
      console.error("Failed to check solved status", error);
    }
  };

  const handleLanguageChange = (langId) => {
    setLanguage(langId);
    setCode(DEFAULT_CODE[parseInt(langId)] || "");
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE[parseInt(language)] || "");
    setOutput("");
    setStatus(null);
    setExecutionTime(null);
    setMemory(null);
    setIsCorrect(null);
    setCoinsAwarded(0);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  const saveSubmission = async (status, difficulty) => {
    const problemId = searchParams.get("problemId");
    if (!problemId) return null;

    // Determine type based on source
    const source = searchParams.get("source");
    const type = source === "company" ? "challenge" : "problem";

    try {
      const payload = {
        problem_id: problemId,
        code: code,
        language: LANGUAGES.find(l => l.id === parseInt(language))?.name || "Unknown",
        status: status,
        type: type // Send type to backend
      };

      const { data } = await api.post('/submissions', payload);
      return data;
    } catch (error) {
      console.error("Failed to save submission", error);
      return null;
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    setStatus(null);
    setExecutionTime(null);
    setMemory(null);
    setIsCorrect(null);
    setCoinsAwarded(0);

    try {
      const response = await fetch("https://ce.judge0.com/submissions?base64_encoded=false&wait=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_code: code,
          language_id: parseInt(language),
          stdin: input,
        }),
      });

      const result = await response.json();

      let programOutput = "";
      if (result.stdout) {
        programOutput = result.stdout.trim();
        setOutput(result.stdout);
        setStatus("success");
      } else if (result.stderr) {
        setOutput(result.stderr);
        setStatus("error");
      } else if (result.compile_output) {
        setOutput(result.compile_output);
        setStatus("error");
      } else {
        programOutput = "";
        setOutput("No output");
        setStatus("success");
      }

      if (result.time) setExecutionTime(result.time);
      if (result.memory) setMemory(result.memory);

      if (expectedOutput && result.stdout) {
        const normalize = (str) => str.replace(/\s+/g, '');
        const expectedNormalized = normalize(expectedOutput);
        const outputNormalized = normalize(programOutput);

        if (expectedNormalized === outputNormalized) {
          setIsCorrect(true);
          const saveResult = await saveSubmission("passed", problem?.difficulty);

          if (saveResult && saveResult.coinsAwarded !== undefined) {
            // Show Reward Modal
            setRewardData({
              type: problem?.type === 'company' ? 'challenge' : 'problem',
              coinsEarned: saveResult.coinsAwarded
            });
            setShowRewardModal(true);
          } else {
            // Fallback if save failed or old backend
            toast({
              title: "🎉 Correct Answer!",
              description: "Great job! Coins have been added to your profile.",
            });
          }

        } else {
          setIsCorrect(false);
          await saveSubmission("failed", problem?.difficulty);
          toast({
            title: "❌ Wrong Answer",
            description: "Your output doesn't match the expected output. Try again!",
            variant: "destructive",
          });
        }
      } else if (!expectedOutput) {
        toast({
          title: "Execution Complete",
          description: "Code ran successfully!",
        });
      }

    } catch (error) {
      console.error("Error running code:", error);
      setOutput("Error: Failed to execute code.");
      setStatus("error");
    } finally {
      setIsRunning(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const d = difficulty?.toLowerCase();
    if (d === "easy") return "bg-success text-success-foreground";
    if (d === "medium") return "bg-accent text-accent-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  const handleKeyDown = (e) => {
    const { value, selectionStart, selectionEnd } = e.target;

    // 1. Tab Key Support
    if (e.key === "Tab") {
      e.preventDefault();
      const tab = "  "; // Hardcoded for now as simple textarea doesn't support easy dynamic tab size
      const newValue = value.substring(0, selectionStart) + tab + value.substring(selectionEnd);
      setCode(newValue);
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + tab.length;
      });
    }

    // Shortcuts
    if (settings.shortcuts.runCode && e.ctrlKey && e.key === "'") {
      e.preventDefault();
      runCode();
      return;
    }
    if (settings.shortcuts.submit && e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      runCode();
      return;
    }
    if (settings.shortcuts.fullScreen && e.altKey && (e.key === "f" || e.key === "F")) {
      e.preventDefault();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }

    // 2. Auto-indentation on Enter
    if (e.key === "Enter") {
      e.preventDefault();
      const beforeCursor = value.substring(0, selectionStart);
      const afterCursor = value.substring(selectionEnd);

      const lastLineStart = beforeCursor.lastIndexOf("\n") + 1;
      const lastLine = beforeCursor.substring(lastLineStart);

      const currentIndent = lastLine.match(/^\s*/)[0];

      // Check for opening characters that need extra indent
      const needsExtraIndent = /[{([]\s*$/.test(lastLine);
      const extraIndent = needsExtraIndent ? "  " : "";
      const totalIndent = currentIndent + extraIndent;

      // Special case: pressing Enter between { and }
      // We want:
      // {
      //   |
      // }
      if (needsExtraIndent && afterCursor.trim().startsWith("}")) {
        const newValue = beforeCursor + "\n" + totalIndent + "\n" + currentIndent + afterCursor;
        setCode(newValue);
        requestAnimationFrame(() => {
          e.target.selectionStart = e.target.selectionEnd = selectionStart + 1 + totalIndent.length;
        });
        return;
      }

      const newValue = beforeCursor + "\n" + totalIndent + afterCursor;
      setCode(newValue);

      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 1 + totalIndent.length;
      });
    }

    // 3. Auto-closing Brackets and Quotes
    const closePairs = {
      "(": ")",
      "{": "}",
      "[": "]",
      '"': '"',
      "'": "'",
    };

    if (closePairs[e.key]) {
      e.preventDefault();
      const closeChar = closePairs[e.key];
      const newValue = value.substring(0, selectionStart) + e.key + closeChar + value.substring(selectionEnd);
      setCode(newValue);
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;
      });
    }

    // 4. Handle closing bracket overwrite (if typing ) when already at ), just move cursor)
    const closeChars = Object.values(closePairs);
    if (closeChars.includes(e.key) && value[selectionStart] === e.key) {
      e.preventDefault();
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <OutcomeModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        data={rewardData}
      />
      <CompilerSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onSettingsChange={setSettings}
      />
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6 relative h-12">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Main Title Section - Hidden when bar is expanded on mobile/small screens if needed, 
              but since bar expands to w-1/2 on large screens, it won't cover title if title is on left.
              Actually w-1/2 overlaps the right side. The title is on left. It's fine.
          */}
          <div className="flex-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{problem?.title || "Code Editor"}</h1>
                {problem?.difficulty && (
                  <Badge className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                )}
                {problem?.isSolved && (
                  <Badge className="bg-success text-success-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Solved
                  </Badge>
                )}
              </div>
              {problem?.company && (
                <span className="text-muted-foreground font-medium">
                  by {problem.company}
                </span>
              )}
            </div>
          </div>

          {/* Expanding Menu Bar (Sidebar Toggle) */}
          <div
            className={`absolute right-0 top-0 h-12 flex items-center justify-end transition-all duration-500 ease-in-out z-50 rounded-full border border-transparent ${isSidebarOpen
              ? 'w-full lg:w-[calc(50%-0.75rem)] bg-white dark:bg-card border-border shadow-xl'
              : 'w-12 bg-transparent'
              }`}
          >
            {/* Stopwatch/Timer Widget (Inside Menu Bar) */}
            <div className={`flex items-center gap-2 mr-4 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {showStopwatch ? (
                /* Active View - Inline Controls */
                <div className={`flex items-center gap-0.5 border rounded-full px-2 py-1 shadow-sm backdrop-blur-sm ${isExiting
                  ? 'animate-out slide-out-to-right-4 fade-out zoom-out-95 duration-500'
                  : 'animate-in fade-in zoom-in-95 duration-500'
                  } ${activeTab === 'timer' ? 'bg-orange-50/80 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800' : 'bg-blue-50/80 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800'}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsExiting(true);
                      setTimeout(() => {
                        setShowStopwatch(false);
                        setIsExiting(false);
                      }, 450);
                    }}
                    className="h-7 w-7 hover:bg-muted rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className={`h-4 w-px mx-0.5 ${activeTab === 'timer' ? 'bg-orange-200 dark:bg-orange-800' : 'bg-blue-200 dark:bg-blue-800'}`} />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (activeTab === 'timer') setIsTimerRunning(!isTimerRunning);
                      else setIsStopwatchRunning(!isStopwatchRunning);
                    }}
                    className="h-7 w-7 hover:bg-muted rounded-full"
                  >
                    {(activeTab === 'timer' ? isTimerRunning : isStopwatchRunning) ? <Pause className={`h-4 w-4 ${activeTab === 'timer' ? 'text-orange-600' : 'text-blue-600'}`} /> : <Play className={`h-4 w-4 ${activeTab === 'timer' ? 'text-orange-600' : 'text-blue-600'}`} />}
                  </Button>
                  <span className={`font-mono text-sm font-medium min-w-[70px] text-center ${activeTab === 'timer' ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`}>
                    {formatTime(activeTab === 'timer' ? countdownTime : stopwatchTime)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (activeTab === 'timer') {
                        setIsTimerRunning(false);
                        setCountdownTime(timerInput.hours * 3600 + timerInput.minutes * 60); // Reset to input
                      } else {
                        setIsStopwatchRunning(false);
                        setStopwatchTime(0);
                      }
                    }}
                    className="h-7 w-7 hover:bg-muted rounded-full"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                /* Icon View - Separate Dropdowns */
                <div className={`flex items-center gap-3 ${!isSidebarOpen ? 'pointer-events-none' : ''}`}>
                  {/* 1. Timer Dropdown (Orange) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-900/40 text-orange-600 hover:text-orange-600"
                      >
                        <Clock className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      sideOffset={8}
                      className="w-52 p-3 bg-background border-border shadow-xl rounded-xl data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-2 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-500"
                    >
                      <div className="mb-2">
                        <div className="flex flex-col items-center justify-center p-2 gap-2 border-2 border-orange-500/20 bg-orange-500/10 rounded-lg cursor-default">
                          <Clock className="h-8 w-8 text-orange-500" />
                          <span className="text-sm font-semibold text-foreground">Timer</span>
                        </div>
                      </div>

                      <div className="mb-3 flex items-center justify-center gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="99"
                            placeholder="00"
                            className="w-12 h-12 rounded-lg border border-input bg-background text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={timerInput.hours}
                            onChange={(e) => setTimerInput(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                          />
                          <span className="text-sm text-muted-foreground font-medium">hr</span>
                        </div>
                        <span className="text-xl font-bold text-muted-foreground">:</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="59"
                            placeholder="00"
                            className="w-12 h-12 rounded-lg border border-input bg-background text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={timerInput.minutes}
                            onChange={(e) => setTimerInput(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                          />
                          <span className="text-sm text-muted-foreground font-medium">min</span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
                        onClick={() => {
                          const totalSeconds = (timerInput.hours * 3600) + (timerInput.minutes * 60);
                          if (totalSeconds > 0) {
                            setCountdownTime(totalSeconds);
                            setIsTimerRunning(true);
                            setActiveTab('timer'); // Set active mode
                            setStopwatchTime(0); setIsStopwatchRunning(false); // Reset other
                            setTimeout(() => { setShowStopwatch(true); }, 400);
                          }
                        }}
                      >
                        <Play className="h-3 w-3 mr-2 fill-current" />
                        Start Timer
                      </Button>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* 2. Stopwatch Dropdown (Blue) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-900/40 text-blue-600 hover:text-blue-600"
                      >
                        <Timer className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      sideOffset={8}
                      className="w-52 p-4 bg-background border-border shadow-xl rounded-xl data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-2 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-500"
                    >
                      <div className="mb-4">
                        <div className="flex flex-col items-center justify-center p-4 gap-2 border-2 border-blue-500/20 bg-blue-500/10 rounded-lg cursor-default">
                          <Timer className="h-8 w-8 text-blue-500" />
                          <span className="text-sm font-semibold text-foreground">Stopwatch</span>
                          {stopwatchTime > 0 && (
                            <span className="text-xs font-mono text-blue-600 dark:text-blue-400 mt-1">
                              {formatTime(stopwatchTime)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                          onClick={() => {
                            setTimeout(() => {
                              setActiveTab('stopwatch'); // Set active mode
                              setIsTimerRunning(false); // Reset other
                              setShowStopwatch(true);
                              setIsStopwatchRunning(true);
                            }, 400);
                          }}
                        >
                          <Play className="h-3 w-3 mr-2 fill-current" />
                          {stopwatchTime > 0 ? "Resume Timer" : "Start Stopwatch"}
                        </Button>

                        {stopwatchTime > 0 && (
                          <Button
                            variant="outline"
                            className="w-full border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            onClick={() => {
                              setStopwatchTime(0);
                              setIsStopwatchRunning(false);
                            }}
                          >
                            <RotateCcw className="h-3 w-3 mr-2" />
                            Restart Timer
                          </Button>
                        )}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Settings Icon */}
            <div className={`mr-1 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>

            {/* Toggle Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`transition-transform duration-300 shrink-0 rounded-full ${isSidebarOpen ? 'rotate-0' : 'rotate-90'}`}
              style={{ width: '48px', height: '48px' }}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ minHeight: "calc(100vh - 180px)" }}>
          {/* Problem Description */}
          <Card className="flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Problem Description</h2>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              {problem ? (
                <div className="space-y-4">
                  <p className="whitespace-pre-wrap">{problem.description}</p>
                  {problem.inputExample && (
                    <div>
                      <strong>Input:</strong>
                      <pre className="mt-2 p-3 bg-muted rounded-md font-mono text-sm">{problem.inputExample}</pre>
                    </div>
                  )}
                  {problem.outputExample && (
                    <div>
                      <strong>Output:</strong>
                      <pre className="mt-2 p-3 bg-muted rounded-md font-mono text-sm">{problem.outputExample}</pre>
                    </div>
                  )}
                  {problem?.topics && problem.topics.length > 0 && (
                    <div className="pt-4 border-t border-border mt-4 flex items-center gap-2">
                      <strong>Topics:</strong>
                      <span className="text-sm text-foreground">
                        {problem.topics.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Loading problem...</p>
              )}
            </ScrollArea>
          </Card>

          {/* Code Editor */}
          <div className="flex flex-col gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between gap-4">
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id.toString()}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  {settings.layout === 'toolbar' && (
                    <>
                      <Button variant="outline" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-2" /> Reset
                      </Button>
                      <Button variant="hero" onClick={runCode} disabled={isRunning}>
                        {isRunning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                        {isRunning ? "Running..." : "Run Code"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>

            <Card className="flex flex-col overflow-hidden relative" style={{ minHeight: "350px" }}>
              <div className="p-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Code Editor</span>
                </div>
              </div>
              {settings.syntaxHighlighting === 'Highlighted' ? (
                <div className="flex-1 overflow-auto bg-card" style={{ minHeight: '300px' }}>
                  <CodeEditor
                    code={code}
                    setCode={setCode}
                    language={language}
                    placeholder="Write your code here..."
                    onKeyDown={handleKeyDown}
                    style={{
                      fontFamily: settings.fontFamily === 'Default' ? 'monospace' : `"${settings.fontFamily}", monospace`,
                      fontSize: settings.fontSize,
                    }}
                  />
                </div>
              ) : (
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 resize-none border-0 rounded-none focus-visible:ring-0 bg-card leading-6"
                  placeholder="Write your code here..."
                  style={{
                    minHeight: "300px",
                    fontFamily: settings.fontFamily === 'Default' ? 'monospace' : `"${settings.fontFamily}", monospace`,
                    fontSize: settings.fontSize,
                    whiteSpace: settings.wordWrap ? 'pre-wrap' : 'pre',
                  }}
                />
              )}
              {settings.layout === 'editor' && (
                <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                  <Button variant="secondary" onClick={handleReset} className="shadow-lg bg-zinc-800 text-zinc-100 hover:bg-zinc-700">
                    <RotateCcw className="h-4 w-4 mr-2" /> Reset
                  </Button>
                  <Button variant="hero" onClick={runCode} disabled={isRunning} className="shadow-lg">
                    {isRunning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                    {isRunning ? "Running..." : "Run Code"}
                  </Button>
                </div>
              )}
            </Card>

            {/* I/O */}
            <Card className="flex flex-col" style={{ minHeight: "220px" }}>
              <div className="grid grid-cols-2 divide-x divide-border h-full">
                <div className="flex flex-col">
                  <div className="p-3 border-b border-border bg-muted/30">
                    <span className="text-sm font-medium">Input (stdin)</span>
                  </div>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 font-mono text-sm resize-none border-0 rounded-none focus-visible:ring-0"
                    placeholder="Enter input here..."
                    style={{ minHeight: "150px" }}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="p-3 border-b border-border bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Output</span>
                      {isCorrect === true && <CheckCircle2 className="h-4 w-4 text-success" />}
                      {isCorrect === false && <XCircle className="h-4 w-4 text-destructive" />}
                    </div>
                  </div>
                  <ScrollArea className="flex-1 p-3" style={{ minHeight: "150px" }}>
                    <pre className={`font-mono text-sm whitespace-pre-wrap break-all ${status === "error" ? "text-destructive" : ""}`}>
                      {output || "Output will appear here..."}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;