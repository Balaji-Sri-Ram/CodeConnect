import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/client";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, Loader2, CheckCircle2, ChevronLeft } from "lucide-react";

const AllProblems = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [displayedProblems, setDisplayedProblems] = useState([]);
  const [solvedProblemIds, setSolvedProblemIds] = useState([]);
  const [allFiltered, setAllFiltered] = useState([]);
  const [topics, setTopics] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const PROBLEMS_PER_PAGE = 10;

  const handleSolve = (problem) => {
    navigate(`/compiler?problemId=${problem._id}&source=local`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Problems
        const { data: problemsData } = await api.get('/problems');
        setProblems(problemsData);

        // Initialize topics
        const allTags = problemsData.flatMap((p) => p.topics || []);
        const uniqueTags = Array.from(new Set(allTags));
        setTopics(uniqueTags.sort());

        // Fetch Solved Status
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const { data: submissions } = await api.get('/submissions/my');
            // Filter for passed
            const passed = submissions.filter(s => s.status === 'passed');
            // Submission problems might be populated or just IDs. 
            // Based on backend route: .populate('problem', ['title', 'difficulty'])
            // So s.problem is an object.
            const ids = [...new Set(passed.map(s => s.problem?._id || s.problem))];
            setSolvedProblemIds(ids);
          } catch (err) {
            console.error("Failed to fetch my submissions", err);
          }
        }
      } catch (error) {
        console.error("Failed to fetch problems", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter logic
    let filtered = [...problems];

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((p) => p.difficulty && p.difficulty.toLowerCase() === difficultyFilter);
    }

    if (topicFilter !== "all") {
      filtered = filtered.filter((p) => p.topics && p.topics.includes(topicFilter));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(query) ||
        (p.topics && p.topics.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    if (statusFilter !== "all") {
      if (statusFilter === "solved") {
        filtered = filtered.filter((p) => solvedProblemIds.includes(p._id));
      } else if (statusFilter === "unsolved") {
        filtered = filtered.filter((p) => !solvedProblemIds.includes(p._id));
      }
    }

    setAllFiltered(filtered);
    setDisplayedProblems(filtered.slice(0, PROBLEMS_PER_PAGE));
    setPage(1);
  }, [difficultyFilter, topicFilter, statusFilter, searchQuery, problems, solvedProblemIds]);

  const loadMore = () => {
    setLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      const nextPage = page + 1;
      const nextProblems = allFiltered.slice(0, nextPage * PROBLEMS_PER_PAGE);
      setDisplayedProblems(nextProblems);
      setPage(nextPage);
      setLoadingMore(false);
    }, 600);
  };

  const getDifficultyColor = (difficulty) => {
    const d = difficulty?.toLowerCase();
    if (d === "easy") {
      return "bg-success text-success-foreground";
    } else if (d === "medium") {
      return "bg-accent text-accent-foreground";
    } else {
      return "bg-destructive text-destructive-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-2">Practice Problems</h1>
              <p className="text-muted-foreground">
                Master algorithms and data structures
              </p>
            </div>
          </div>
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, topic, difficulty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Difficulty</label>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy (≤1200)</SelectItem>
                <SelectItem value="medium">Medium (1200-1800)</SelectItem>
                <SelectItem value="hard">Hard (&gt;1800)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Topic</label>
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="solved">Solved</SelectItem>
                <SelectItem value="unsolved">Unsolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Problems List */}
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {displayedProblems.length} of {allFiltered.length} problems
        </div>

        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pr-4 mb-4">
            {displayedProblems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No problems found</p>
              </div>
            ) : (
              displayedProblems.map((problem) => (
                <Card
                  key={problem._id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 relative">
                    {solvedProblemIds.includes(problem._id) && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg flex items-center gap-1 z-10 shadow-sm">
                        <CheckCircle2 className="h-3 w-3" />
                        Solved
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                        {solvedProblemIds.includes(problem._id) && (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        )}
                      </div>
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                      {problem.topics && problem.topics.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm text-muted-foreground">
                            Topics: {problem.topics.slice(0, 3).join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="hero"
                      className="self-center"
                      onClick={() => handleSolve(problem)}
                    >
                      {solvedProblemIds.includes(problem._id) ? "Practice Again" : "Solve"}
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {displayedProblems.length < allFiltered.length && (
            <div className="flex justify-center py-4 mb-6">
              <Button onClick={loadMore} variant="outline" className="w-full md:w-auto" disabled={loadingMore}>
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-500" />
                    Loading...
                  </>
                ) : (
                  "Load More Problems"
                )}
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default AllProblems;
