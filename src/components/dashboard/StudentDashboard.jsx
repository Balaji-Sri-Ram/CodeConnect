import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code2, Trophy, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/api/client";


import { StudentDashboardSkeleton } from "@/components/ui/skeleton-loaders";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [codeforcesProblems, setCodeforcesProblems] = useState([]);
  const [companyChallenges, setCompanyChallenges] = useState([]);
  const [stats, setStats] = useState({ easy: 0, medium: 0, hard: 0, solvedIds: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch all data resiliently using Promise.allSettled
        // Even if one request fails or has no data, all other features still load
        const results = await Promise.allSettled([
          api.get('/profile/me'),
          api.get('/submissions/my'),
          api.get('/problems?limit=10'),
          api.get('/challenges?limit=10')
        ]);

        const profileData = results[0].status === 'fulfilled' ? results[0].value.data : null;
        const submissions = results[1].status === 'fulfilled' ? (results[1].value.data || []) : [];
        const problems = results[2].status === 'fulfilled' ? (results[2].value.data || []) : [];
        const challengesData = results[3].status === 'fulfilled' ? (results[3].value.data || []) : [];

        if (profileData) {
          setProfile(profileData);
        }

        // Process Submissions for Stats
        let easyCount = 0;
        let mediumCount = 0;
        let hardCount = 0;
        let solvedProblemIds = [];

        if (Array.isArray(submissions) && submissions.length > 0) {
          // Filter only passed submissions
          const passedSubmissions = submissions.filter(s => s.status === 'passed');

          // Get unique problem IDs
          const uniqueSolved = new Set();
          passedSubmissions.forEach(s => {
            const item = s.problem || s.challenge;
            if (item) { // Check if problem data is populated
              const itemId = item._id || item.id;

              if (!uniqueSolved.has(itemId)) {
                uniqueSolved.add(itemId);

                const diff = item.difficulty?.toLowerCase();
                if (diff === 'easy') easyCount++;
                else if (diff === 'medium') mediumCount++;
                else if (diff === 'hard') hardCount++;
              }
            }
          });
          solvedProblemIds = Array.from(uniqueSolved);
        }

        setStats({
          easy: easyCount,
          medium: mediumCount,
          hard: hardCount,
          solvedIds: solvedProblemIds
        });

        // Set Problems and Challenges (guaranteed to render if available)
        if (Array.isArray(problems) && problems.length > 0) {
          setCodeforcesProblems(problems);
        }
        if (Array.isArray(challengesData)) {
          setCompanyChallenges(challengesData);
        }

      } catch (error) {
        console.error("Error in dashboard data fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-success text-success-foreground";
      case "medium":
        return "bg-accent text-accent-foreground";
      case "hard":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return <StudentDashboardSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Cards - Responsive 2x2 Grid on Mobile, 4-Cols on Desktop */}
      <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-4 sm:p-5 bg-gradient-card shadow-md flex flex-col justify-between min-h-[110px] sm:min-h-[125px] rounded-2xl hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <p className="text-xs sm:text-sm text-muted-foreground font-semibold truncate">Total Coins</p>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-accent">{profile?.coins || 0}</p>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-gradient-card shadow-md flex flex-col justify-between min-h-[110px] sm:min-h-[125px] rounded-2xl hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <p className="text-xs sm:text-sm text-muted-foreground font-semibold truncate">Easy Problems</p>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-success/15 flex items-center justify-center text-success shrink-0">
              <Target className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-success">{stats.easy}</p>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-gradient-card shadow-md flex flex-col justify-between min-h-[110px] sm:min-h-[125px] rounded-2xl hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <p className="text-xs sm:text-sm text-muted-foreground font-semibold truncate">Medium Problems</p>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0 font-mono text-sm sm:text-base font-bold">
              &lt;/&gt;
            </div>
          </div>
          <div className="mt-2">
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-accent">{stats.medium}</p>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-gradient-card shadow-md flex flex-col justify-between min-h-[110px] sm:min-h-[125px] rounded-2xl hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <p className="text-xs sm:text-sm text-muted-foreground font-semibold truncate">Hard Problems</p>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-destructive/15 flex items-center justify-center text-destructive shrink-0">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-destructive">{stats.hard}</p>
          </div>
        </Card>
      </div>

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile?.full_name || profile?.company_name || "Developer"}
        </h1>
        <p className="text-muted-foreground">
          Ready to solve some problems and earn more coins?
        </p>
      </div>

      {/* Codeforces Problems Section */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Practice Problems</h2>
          <Button variant="hero" onClick={() => navigate('/all-problems')}>
            View All Problems
          </Button>
        </div>

        <Card className="bg-white dark:bg-card shadow-lg p-6">
          {loading ? (
            <div className="p-12 text-center">
              <Code2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
              <p className="text-muted-foreground">Loading problems...</p>
            </div>
          ) : codeforcesProblems.length === 0 ? (
            <div className="p-12 text-center">
              <Code2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No problems available</h3>
              <p className="text-muted-foreground">Check back soon for coding challenges!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {codeforcesProblems.map((problem, index) => {
                const isSolved = stats.solvedIds.includes((problem._id).toString());

                return (
                  <Card
                    key={index}
                    className="p-4 sm:p-6 hover:shadow-lg transition-shadow bg-white dark:bg-card relative overflow-hidden group"
                  >
                    {isSolved && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-bl-lg flex items-center gap-1 z-10 shadow-sm">
                        <CheckCircle2 className="h-3 w-3" />
                        Solved
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex-1 w-full">
                        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold truncate pr-16 sm:pr-0">{problem.title}</h3>
                          <Badge className={`${getDifficultyColor(problem.difficulty)} text-xs px-2 py-0.5`}>
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          {problem.topics && problem.topics.length > 0 && (
                            <span className="truncate max-w-[200px]">Topics: {problem.topics.slice(0, 3).join(", ")}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="hero"
                        size="sm"
                        className="w-full sm:w-auto mt-2 sm:mt-0"
                        onClick={() => navigate(`/compiler?problemId=${problem._id}&title=${encodeURIComponent(problem.title)}&difficulty=${problem.difficulty}&source=local`)}
                      >
                        {isSolved ? "Practice Again" : "Solve"}
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Company Challenges Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Company Challenges</h2>
          <Button variant="hero" onClick={() => navigate('/company-challenges')}>
            View Challenges
          </Button>
        </div>

        <Card className="bg-white dark:bg-card shadow-lg p-4 sm:p-6">
          {companyChallenges.length === 0 ? (
            <div className="p-12 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No company challenges yet</h3>
              <p className="text-muted-foreground">Companies will post challenges here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {companyChallenges.slice(0, 10).map((challenge) => {
                const isSolved = stats.solvedIds.includes((challenge._id || challenge.id).toString());

                return (
                  <Card
                    key={challenge._id || challenge.id}
                    className="p-4 sm:p-6 hover:shadow-lg transition-shadow bg-white dark:bg-card relative overflow-hidden group"
                  >
                    {isSolved && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-bl-lg flex items-center gap-1 z-10 shadow-sm">
                        <CheckCircle2 className="h-3 w-3" />
                        Solved
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 w-full">
                        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold truncate pr-16 sm:pr-0">{challenge.title}</h3>
                          <Badge className={`${getDifficultyColor(challenge.difficulty)} text-xs px-2 py-0.5`}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-primary font-medium mb-1.5 sm:mb-2">
                          by {challenge.company?.company_name || "Unknown Company"}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                          {challenge.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          {challenge.topic && (
                            <span>Topic: {challenge.topic}</span>
                          )}
                          {challenge.deadline && (
                            <span>Deadline: {new Date(challenge.deadline).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="hero"
                        size="sm"
                        className="w-full sm:w-auto mt-2 sm:mt-0"
                        onClick={() => navigate(`/compiler?title=${encodeURIComponent(challenge.title)}&description=${encodeURIComponent(challenge.description)}&difficulty=${challenge.difficulty}&company=${encodeURIComponent(challenge.company?.company_name || 'Unknown Company')}&topic=${encodeURIComponent(challenge.topic || '')}&inputExample=${encodeURIComponent(challenge.input_example || '')}&outputExample=${encodeURIComponent(challenge.output_example || '')}&source=company&problemId=${challenge._id || challenge.id}`)}
                      >
                        {isSolved ? "Practice Again" : "Solve"}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
