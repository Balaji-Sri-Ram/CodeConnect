import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Mail,
  Phone,
  Linkedin,
  Github,
  Trophy,
  Target,
  Coins,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  FileText
} from "lucide-react";

const DeveloperProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  });

  useEffect(() => {
    fetchDeveloper();
  }, [id]);

  const fetchDeveloper = async () => {
    try {
      // Fetch profile
      // Note: backend route /profile/:id calls findOne({user: id})
      const { data: profileData } = await api.get(`/profile/${id}`);

      if (!profileData) {
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Fetch submission stats
      const { data: statsData } = await api.get(`/submissions/stats/${id}`);

      if (statsData) {
        setStats(statsData);
      }

    } catch (error) {
      console.error("Error fetching developer:", error);
    } finally {
      setLoading(false);
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Developer Not Found</h1>
          <Button onClick={() => navigate("/leaderboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leaderboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/leaderboard")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Leaderboard
        </Button>

        {/* Profile Header */}
        <Card className="mb-6 overflow-hidden">
          <div className="h-32 bg-blue-600 relative">
            <h1 className="hidden md:block absolute bottom-4 left-44 text-3xl font-bold text-white z-10 truncate">
              {profile.full_name || "Developer"}
            </h1>
          </div>
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-16 mb-4">
              <Avatar className="h-32 w-32 ring-4 ring-background shadow-lg z-20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                  {profile.full_name?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="text-center md:text-left flex-1 pb-4 mt-4 md:mt-[72px]">
                {/* Mobile Name Display */}
                <h1 className="md:hidden text-2xl font-bold mb-2">
                  {profile.full_name || "Developer"}
                </h1>

                {profile.bio && (
                  <p className="text-muted-foreground max-w-2xl">{profile.bio}</p>
                )}
              </div>

              <div className="flex items-center gap-2 pb-4 md:mt-[72px]">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                  {stats.total} Problems Solved
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href={`mailto:${profile.user?.email || profile.email}`} className="font-medium hover:text-primary transition-colors block break-all">
                    {profile.user?.email || profile.email || "No email available"}
                  </a>
                </div>
              </div>



              {profile.whatsapp && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                    <a
                      href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-green-500 transition-colors"
                    >
                      {profile.whatsapp}
                    </a>
                  </div>
                </div>
              )}

              {profile.linkedin_url && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn</p>
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-blue-600 transition-colors truncate block max-w-[200px]"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              )}

              {profile.github_url && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Github className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">GitHub</p>
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-primary transition-colors truncate block max-w-[200px]"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              )}

              {profile.resume_url && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <FileText className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Resume (CV)</p>
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-orange-500 transition-colors truncate block max-w-[200px]"
                    >
                      View Resume
                    </a>
                  </div>
                </div>
              )}

              {!profile.whatsapp && !profile.linkedin_url && !profile.github_url && (
                <p className="text-muted-foreground text-center py-4">
                  No additional contact information available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Problem Solving Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Problem Solving Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-hero mb-4">
                  <span className="text-3xl font-bold text-white">{stats.total}</span>
                </div>
                <p className="text-lg font-medium">Total Problems Solved</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-500">{stats.easy}</p>
                  <p className="text-sm text-muted-foreground">Easy</p>
                </div>

                <div className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <CheckCircle2 className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-500">{stats.medium}</p>
                  <p className="text-sm text-muted-foreground">Medium</p>
                </div>

                <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <CheckCircle2 className="h-6 w-6 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-500">{stats.hard}</p>
                  <p className="text-sm text-muted-foreground">Hard</p>
                </div>
              </div>

              {/* Coins Breakdown */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">Total Coins Earned</span>
                  </div>
                  <span className="text-xl font-bold">{profile.coins || 0}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Easy: 10 coins • Medium: 25 coins • Hard: 50 coins
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeveloperProfile;