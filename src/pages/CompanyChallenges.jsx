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
import { Search, CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";

const CompanyChallenges = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [topics, setTopics] = useState([]);
  const [solvedIds, setSolvedIds] = useState([]); // Added solvedIds state
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [solvedFilter, setSolvedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedChallenges, setDisplayedChallenges] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const CHALLENGES_PER_PAGE = 10;

  const handleSolve = (challenge) => {
    const params = new URLSearchParams({
      source: "company",
      title: challenge.title,
      difficulty: challenge.difficulty,
      description: challenge.description || "",
      company: challenge.company?.company_name || "Unknown Company",
      topic: challenge.topic || "",
      inputExample: challenge.input_example || "",
      outputExample: challenge.output_example || "",
      problemId: challenge._id || challenge.id // Ensure ID is passed for lookup
    });
    navigate(`/compiler?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [challenges, difficultyFilter, companyFilter, topicFilter, solvedFilter, searchQuery, solvedIds]); // Add solvedIds to dependency

  const fetchChallenges = async () => {
    try {
      const { data: challengesData } = await api.get('/challenges');
      if (challengesData) {
        setChallenges(challengesData);

        const uniqueCompanies = Array.from(
          new Set(challengesData.map((c) => c.company?.company_name || c.company_name).filter(Boolean))
        );
        setCompanies(uniqueCompanies);

        const uniqueTopics = Array.from(
          new Set(challengesData.map((c) => c.topic).filter(Boolean))
        );
        setTopics(uniqueTopics);
      }

      // Fetch solved status
      const token = localStorage.getItem('token');
      if (token) {
        const { data: submissions } = await api.get('/submissions/my');
        const passed = submissions.filter(s => s.status === 'passed');
        const ids = new Set();
        passed.forEach(s => {
          // check both fields as previously discussed
          if (s.problem) ids.add(s.problem._id || s.problem);
          if (s.challenge) ids.add(s.challenge._id || s.challenge);
        });
        setSolvedIds(Array.from(ids));
      }

    } catch (error) {
      console.error("Error fetching challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...challenges];

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((c) => c.difficulty === difficultyFilter);
    }

    if (companyFilter !== "all") {
      filtered = filtered.filter((c) => c.company?.company_name === companyFilter);
    }

    if (topicFilter !== "all") {
      filtered = filtered.filter((c) => c.topic === topicFilter);
    }

    if (solvedFilter !== "all") {
      if (solvedFilter === "solved") {
        filtered = filtered.filter((c) => solvedIds.includes(c._id || c.id));
      } else if (solvedFilter === "unsolved") {
        filtered = filtered.filter((c) => !solvedIds.includes(c._id || c.id));
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(query) ||
        c.company?.company_name?.toLowerCase().includes(query) ||
        c.difficulty.toLowerCase().includes(query) ||
        c.topic?.toLowerCase().includes(query)
      );
    }

    setFilteredChallenges(filtered);
    setDisplayedChallenges(filtered.slice(0, CHALLENGES_PER_PAGE));
    setPage(1);
  };

  const loadMore = () => {
    setLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      const nextPage = page + 1;
      const nextChallenges = filteredChallenges.slice(0, nextPage * CHALLENGES_PER_PAGE);
      setDisplayedChallenges(nextChallenges);
      setPage(nextPage);
      setLoadingMore(false);
    }, 600);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-success text-success-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "hard":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

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
              <h1 className="text-3xl font-bold mb-2">Company Challenges</h1>
              <p className="text-muted-foreground">
                Explore and solve challenges posted by companies
              </p>
            </div>
          </div>
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, company, difficulty, topic..."
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
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Company</label>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
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
            <Select value={solvedFilter} onValueChange={setSolvedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Problems" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Problems</SelectItem>
                <SelectItem value="solved">Solved</SelectItem>
                <SelectItem value="unsolved">Unsolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Challenges List */}
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {displayedChallenges.length} of {filteredChallenges.length} challenges
        </div>
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pr-4">
            {loading ? (
              <div className="col-span-full py-12 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  <p className="text-muted-foreground">Loading challenges...</p>
                </div>
              </div>
            ) : displayedChallenges.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No challenges found</p>
              </div>
            ) : (
              displayedChallenges.map((challenge) => (
                <Card
                  key={challenge._id || challenge.id}
                  className="p-6 hover:shadow-lg transition-shadow relative overflow-hidden"
                >
                  {solvedIds.includes(challenge._id || challenge.id) && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg flex items-center gap-1 z-10 shadow-sm">
                      <CheckCircle2 className="h-3 w-3" />
                      Solved
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        by {challenge.company?.company_name || "Unknown Company"}
                      </p>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      <p className="text-muted-foreground mt-3 line-clamp-3">
                        {challenge.description}
                      </p>
                      {challenge.topic && (
                        <div className="flex items-center gap-4 text-sm mt-3">
                          <span className="text-muted-foreground">
                            Topic: {challenge.topic}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button variant="hero" className="self-center" onClick={() => handleSolve(challenge)}>
                      {solvedIds.includes(challenge._id || challenge.id) ? "Practice Again" : "Solve"}
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {displayedChallenges.length < filteredChallenges.length && (
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

export default CompanyChallenges;
