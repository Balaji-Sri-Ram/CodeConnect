import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import api from "@/api/client";
import { Briefcase, Users, Trophy, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companyProfile, setCompanyProfile] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    topPerformers: 0,
    engagement: "0%"
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    topic: "",
    input: "",
    output: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: profile } = await api.get('/profile/me');
      setCompanyProfile(profile);

      // Fetch company's created challenges
      const { data: myChallenges } = await api.get('/challenges/my');
      setChallenges(myChallenges);

      // Fetch dashboard stats
      const { data: statsData } = await api.get('/profile/stats/company');
      setStats(statsData);

    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/challenges', {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        topic: formData.topic || null,
        input_example: formData.input || null,
        output_example: formData.output || null,
      });

      toast({
        title: "Success",
        description: "Challenge created successfully!",
      });
      setFormData({ title: "", description: "", difficulty: "easy", topic: "", input: "", output: "" });
      setShowCreateDialog(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = (challenge) => {
    setSelectedChallenge(challenge);

    setFormData({
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      topic: challenge.topic || "",
      input: challenge.input_example || "",
      output: challenge.output_example || "",
    });
    setShowDetailsDialog(true);
  };

  const handleUpdate = async () => {
    if (!selectedChallenge) return;

    setUpdating(true);
    try {
      await api.put(`/challenges/${selectedChallenge._id}`, {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        topic: formData.topic || null,
        input_example: formData.input || null,
        output_example: formData.output || null,
      });

      toast({
        title: "Success",
        description: "Challenge updated successfully!",
      });
      setShowDetailsDialog(false);
      setSelectedChallenge(null);
      fetchData();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update challenge.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedChallenge) return;

    try {
      await api.delete(`/challenges/${selectedChallenge._id}`);

      toast({
        title: "Success",
        description: "Challenge deleted successfully!",
      });
      setShowDetailsDialog(false);
      setSelectedChallenge(null);
      fetchData();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete challenge.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="p-6 bg-gradient-card shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Challenges</p>
              <p className="text-3xl font-bold text-primary">{challenges.length}</p>
            </div>
            <Briefcase className="h-10 w-10 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Candidates</p>
              <p className="text-3xl font-bold text-success">{stats.totalCandidates}</p>
            </div>
            <Users className="h-10 w-10 text-success" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Top Performers</p>
              <p className="text-3xl font-bold text-accent">{stats.topPerformers}</p>
            </div>
            <Trophy className="h-10 w-10 text-accent" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Engagement</p>
              <p className="text-3xl font-bold text-primary">{stats.engagement}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-primary" />
          </div>
        </Card>
      </div>

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {companyProfile?.company_name || "Company"}! 🚀
        </h1>
        <p className="text-muted-foreground">
          Find top talent and post challenges to discover the best developers
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="p-6 bg-gradient-hero text-primary-foreground shadow-glow">
          <h3 className="text-xl font-semibold mb-2">Post a New Challenge</h3>
          <p className="mb-4 opacity-90">
            Create custom coding challenges to find the perfect candidates for your team
          </p>
          <Button
            variant="outline"
            className="border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => {
              setFormData({ title: "", description: "", difficulty: "easy", topic: "", input: "", output: "" });
              setShowCreateDialog(true);
            }}
          >
            Create Challenge
          </Button>
        </Card>

        <Card className="p-6 bg-gradient-accent text-accent-foreground shadow-md">
          <h3 className="text-xl font-semibold mb-2">View Leaderboard</h3>
          <p className="mb-4 opacity-90">
            Browse top performers and invite promising candidates for interviews
          </p>
          <Button
            variant="outline"
            className="border-accent-foreground bg-accent-foreground/10 text-accent-foreground hover:bg-accent-foreground/20"
            onClick={() => navigate("/leaderboard")}
          >
            View Talents
          </Button>
        </Card>
      </div>

      {/* Recent Challenges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Your Challenges</h2>
          <Button
            variant="hero"
            onClick={() => {
              setFormData({ title: "", description: "", difficulty: "easy", topic: "", input: "", output: "" });
              setShowCreateDialog(true);
            }}
          >
            Post New Challenge
          </Button>
        </div>

        {challenges.length === 0 ? (
          <Card className="p-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No challenges posted yet</h3>
            <p className="text-muted-foreground mb-4">
              Start finding talent by posting your first coding challenge
            </p>
            <Button
              variant="hero"
              onClick={() => {
                setFormData({ title: "", description: "", difficulty: "easy", topic: "", input: "", output: "" });
                setShowCreateDialog(true);
              }}
            >
              Post Your First Challenge
            </Button>
          </Card>
        ) : (
          challenges.map((challenge) => (
            <Card key={challenge._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{challenge.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      by {challenge.company?.company_name || companyProfile?.company_name}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{challenge.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Difficulty: <span className="font-semibold">{challenge.difficulty}</span>
                    </span>
                  </div>
                </div>
                <Button variant="outline" onClick={() => handleViewDetails(challenge)}>
                  View Details
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Challenge Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Create New Challenge
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">Problem Title</label>
              <Input
                placeholder="Enter problem title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Describe the problem"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[120px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Difficulty Level</label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <Input
                placeholder="e.g., Arrays, Sorting, Dynamic Programming"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Input Format</label>
              <Textarea
                placeholder="Describe the input format"
                value={formData.input}
                onChange={(e) => setFormData({ ...formData, input: e.target.value })}
                className="min-h-[80px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Output Format</label>
              <Textarea
                placeholder="Describe the expected output"
                value={formData.output}
                onChange={(e) => setFormData({ ...formData, output: e.target.value })}
                className="min-h-[80px]"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Creating..." : "Create Challenge"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Challenge Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Challenge Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Challenge title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Challenge description"
                className="min-h-[120px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  setFormData({ ...formData, difficulty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <Input
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., Arrays, Dynamic Programming"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Input Format</label>
              <Textarea
                value={formData.input}
                onChange={(e) => setFormData({ ...formData, input: e.target.value })}
                placeholder="Describe the input format"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Output Format</label>
              <Textarea
                value={formData.output}
                onChange={(e) => setFormData({ ...formData, output: e.target.value })}
                placeholder="Describe the output format"
                className="min-h-[80px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleUpdate}
                disabled={updating}
                className="flex-1"
              >
                {updating ? "Updating..." : "Update Challenge"}
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="flex-1"
              >
                Delete Challenge
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyDashboard;
