import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Building2 } from "lucide-react";

const Companies = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            // Fetch all profiles
            // In a real app with many users, we should have a specific endpoint for fetching companies
            // or use pagination/filtering on the backend.
            // Based on available routes, /profile returns all profiles.
            const { data } = await api.get('/profile');

            // Filter for companies
            // data is an array of profiles. Each profile has a 'user' object with 'role'.
            const companyProfiles = data.filter(profile => profile.user?.role === 'company');

            setCompanies(companyProfiles);
        } catch (error) {
            console.error("Error fetching companies:", error);
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

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Companies</h1>
                        <p className="text-muted-foreground mt-2">
                            Discover top companies hiring developers
                        </p>
                    </div>
                </div>

                {companies.length === 0 ? (
                    <div className="text-center py-12">
                        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Companies Found</h3>
                        <p className="text-muted-foreground">Check back later for new companies.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.map((company) => (
                            <Card key={company._id} className="hover:shadow-lg transition-transform hover:-translate-y-1 duration-200">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <Avatar className="h-16 w-16 border-2 border-border">
                                            <AvatarImage src={company.avatar_url} alt={company.company_name} />
                                            <AvatarFallback className="text-xl bg-primary/10 text-primary">
                                                {company.company_name?.charAt(0).toUpperCase() || "C"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <h3 className="text-xl font-semibold mb-2 truncate">
                                        {company.company_name || company.full_name || "Unknown Company"}
                                    </h3>

                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6 h-10">
                                        {company.bio || "No description available"}
                                    </p>

                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={() => navigate(`/company/${company.user?._id || company.user}`)}
                                    >
                                        View Profile
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Companies;
