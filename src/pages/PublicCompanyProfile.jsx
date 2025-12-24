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
    Linkedin,
    Github,
    Globe,
    ArrowLeft,
    Building2,
    Briefcase,
    MapPin,
    MessageCircle
} from "lucide-react";

const PublicCompanyProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({
        challengesAssigned: 0
    });

    useEffect(() => {
        fetchCompanyData();
    }, [id]);

    const fetchCompanyData = async () => {
        try {
            // 1. Fetch profile
            const { data: profileData } = await api.get(`/profile/${id}`);

            if (!profileData) {
                setLoading(false);
                return;
            }
            setProfile(profileData);

            // 2. Fetch challenges to count assignments
            // We fetch all challenges and filter by company ID
            const { data: challengesData } = await api.get('/challenges');

            const companyChallenges = challengesData.filter(challenge => {
                const companyId = challenge.company?._id || challenge.company;
                return companyId === id || companyId === profileData.user?._id;
            });

            setStats({
                challengesAssigned: companyChallenges.length
            });

        } catch (error) {
            console.error("Error fetching company data:", error);
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
                    <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
                    <Button onClick={() => navigate("/companies")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Companies
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
                <Button variant="ghost" onClick={() => navigate("/companies")} className="mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Companies
                </Button>

                {/* Profile Header */}
                <Card className="mb-6 overflow-hidden">
                    <div className="h-32 bg-primary relative">
                        <h1 className="hidden md:block absolute bottom-4 left-44 text-3xl font-bold text-white z-10 truncate">
                            {profile.company_name || profile.full_name || "Company"}
                        </h1>
                    </div>
                    <CardContent className="pt-0">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-16 mb-4">
                            <Avatar className="h-32 w-32 ring-4 ring-background shadow-lg z-20 bg-background">
                                <AvatarImage src={profile.avatar_url} />
                                <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
                                    {profile.company_name?.charAt(0).toUpperCase() || "C"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="text-center md:text-left flex-1 pb-4 mt-4 md:mt-[72px] pr-3">
                                {/* Mobile Name Display */}
                                <h1 className="md:hidden text-2xl font-bold mb-2">
                                    {profile.company_name || profile.full_name || "Company"}
                                </h1>

                                {profile.bio && (
                                    <p className="text-muted-foreground mt-2">{profile.bio}</p>
                                )}
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
                                    <a href={`mailto:${profile.user?.email || profile.email}`} className="font-medium hover:text-primary transition-colors">
                                        {profile.user?.email || profile.email || "No email available"}
                                    </a>
                                </div>
                            </div>

                            {profile.website && (
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <Globe className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Website</p>
                                        <a
                                            href={profile.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium hover:text-blue-500 transition-colors truncate block max-w-[200px]"
                                        >
                                            Visit Website
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

                            {!profile.linkedin_url && !profile.github_url && !profile.website && (
                                <p className="text-muted-foreground text-center py-4">
                                    No additional contact information available
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Company Details / Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                Company Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
                                    <span className="text-3xl font-bold text-primary">{stats.challengesAssigned}</span>
                                </div>
                                <p className="text-lg font-medium">Active Challenges</p>
                                <p className="text-sm text-muted-foreground">Opportunities for developers</p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        About {profile.company_name || "the Company"}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {profile.bio || "This company has not provided a description yet."}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PublicCompanyProfile;
