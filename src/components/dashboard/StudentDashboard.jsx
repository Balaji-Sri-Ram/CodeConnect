import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code2, Trophy, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/api/client";


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

        // Fetch Profile
        const { data: profileData } = await api.get('/profile/me');
        setProfile(profileData);

        // Fetch Submissions for Stats
        const { data: submissions } = await api.get('/submissions/my');

        let easyCount = 0;
        let mediumCount = 0;
        let hardCount = 0;
        let solvedProblemIds = [];

        if (submissions && submissions.length > 0) {
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

        // Fetch Practice Problems from API
        const { data: problems } = await api.get('/problems');
        // Take top 10 for dashboard
        setCodeforcesProblems(problems.slice(0, 10));

        // Fetch Challenges
        const { data: challengesData } = await api.get('/challenges');
        setCompanyChallenges(challengesData || []);

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="p-6 bg-gradient-card shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Coins</p>
              <p className="text-3xl font-bold text-accent">{profile?.coins || 0}</p>
            </div>
            <Trophy className="h-10 w-10 text-accent" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Easy Problems</p>
              <p className="text-3xl font-bold text-success">{stats.easy}</p>
            </div>
            <Target className="h-10 w-10 text-success" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Medium Problems</p>
              <p className="text-3xl font-bold text-accent">{stats.medium}</p>
            </div>
            <Code2 className="h-10 w-10 text-accent" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hard Problems</p>
              <p className="text-3xl font-bold text-destructive">{stats.hard}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-destructive" />
          </div>
        </Card>
      </div>

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile?.full_name || profile?.company_name || "Developer"}! 👋
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
                    className="p-6 hover:shadow-lg transition-shadow bg-white dark:bg-card relative overflow-hidden"
                  >
                    {isSolved && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg flex items-center gap-1 z-10 shadow-sm">
                        <CheckCircle2 className="h-3 w-3" />
                        Solved
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{problem.title}</h3>
                          <Badge className={getDifficultyColor(problem.difficulty)}>
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {problem.topics && problem.topics.length > 0 && (
                            <span>Topics: {problem.topics.slice(0, 3).join(", ")}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="hero"
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
          <h2 className="text-2xl font-semibold">Company Challenges</h2>
          <Button variant="hero" onClick={() => navigate('/company-challenges')}>
            View Challenges
          </Button>
        </div>

        <Card className="bg-white dark:bg-card shadow-lg p-6">
          {companyChallenges.length === 0 ? (
            <div className="p-12 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No company challenges yet</h3>
              <p className="text-muted-foreground">Companies will post challenges here!</p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4 pr-4">
                {companyChallenges.slice(0, 10).map((challenge) => (
                  <Card
                    key={challenge._id || challenge.id}
                    className="p-6 hover:shadow-lg transition-shadow relative overflow-hidden"
                  >
                    {stats.solvedIds.includes((challenge._id || challenge.id).toString()) && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg flex items-center gap-1 z-10 shadow-sm">
                        <CheckCircle2 className="h-3 w-3" />
                        Solved
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{challenge.title}</h3>
                          <Badge className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-primary font-medium mb-2">
                          by {challenge.company?.company_name || "Unknown Company"}
                        </p>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {challenge.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          {challenge.deadline && (
                            <span className="text-muted-foreground">
                              Deadline: {new Date(challenge.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="hero"
                        className="self-center"
                        onClick={() => navigate(`/compiler?title=${encodeURIComponent(challenge.title)}&description=${encodeURIComponent(challenge.description)}&difficulty=${challenge.difficulty}&company=${encodeURIComponent(challenge.company?.company_name || 'Unknown Company')}&topic=${encodeURIComponent(challenge.topic || '')}&inputExample=${encodeURIComponent(challenge.input_example || '')}&outputExample=${encodeURIComponent(challenge.output_example || '')}&source=company&problemId=${challenge._id || challenge.id}`)}
                      >
                        {stats.solvedIds.includes((challenge._id || challenge.id).toString()) ? "Practice Again" : "Solve"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
