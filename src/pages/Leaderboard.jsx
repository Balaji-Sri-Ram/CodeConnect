import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/client";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Coins, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LeaderboardSkeleton } from "@/components/ui/skeleton-loaders";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStudents = useCallback(async () => {
    try {
      const { data } = await api.get('/profile');
      // Filter for all non-company profiles (students, developers, etc.)
      const studentProfiles = Array.isArray(data)
        ? data.filter(profile => profile.user && profile.user.role !== 'company')
        : [];
      setStudents(studentProfiles);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = students.filter((student) =>
    student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>;
  };

  const getRankBadge = (index) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (index === 1) return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    if (index === 2) return "bg-gradient-to-r from-amber-500 to-amber-700 text-white";
    return "bg-muted text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <Navbar />
        <LeaderboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-hero mb-6">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Developer Leaderboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover top talent ranked by their problem-solving achievements and coding excellence
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search developers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Top 3 Podium - Always 3-Column Podium side-by-side on Mobile and Desktop */}
        {filteredStudents.length >= 3 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 max-w-2xl sm:max-w-3xl mx-auto items-end pt-2 sm:pt-4">
            {/* 2nd Place */}
            <div className="order-1">
              <Card
                className="p-2.5 sm:p-4 text-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:shadow-lg transition-all rounded-xl sm:rounded-2xl"
                onClick={() => navigate(`/developer/${filteredStudents[1].user?._id || filteredStudents[1].user}`)}
              >
                <div className="flex justify-center mb-1 sm:mb-2">
                  <Medal className="h-5 w-5 sm:h-8 sm:w-8 text-gray-400" />
                </div>
                <Avatar className="h-10 w-10 sm:h-14 sm:w-14 mx-auto mb-1 sm:mb-2 ring-2 ring-gray-300">
                  <AvatarImage src={filteredStudents[1].avatar_url} />
                  <AvatarFallback className="text-xs sm:text-lg bg-gray-300 font-bold">
                    {filteredStudents[1].full_name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-xs sm:text-sm truncate px-1">{filteredStudents[1].full_name || "Developer"}</h3>
                <div className="flex items-center justify-center gap-1 mt-0.5 sm:mt-1">
                  <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                  <span className="font-bold text-xs sm:text-base">{filteredStudents[1].coins || 0}</span>
                </div>
                <Badge className="mt-1.5 sm:mt-2 h-4 sm:h-5 text-[10px] sm:text-xs px-1.5 sm:px-2.5 bg-gray-400 text-white font-semibold">2nd Place</Badge>
              </Card>
            </div>

            {/* 1st Place - Champion (Elevated Center) */}
            <div className="order-2 transform -translate-y-2 sm:-translate-y-4">
              <Card
                className="p-3 sm:p-5 text-center bg-gradient-to-b from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 border-2 border-yellow-400 cursor-pointer hover:shadow-xl transition-all rounded-xl sm:rounded-2xl shadow-md"
                onClick={() => navigate(`/developer/${filteredStudents[0].user?._id || filteredStudents[0].user}`)}
              >
                <div className="flex justify-center mb-1.5 sm:mb-3">
                  <Trophy className="h-7 w-7 sm:h-10 sm:w-10 text-yellow-500" />
                </div>
                <Avatar className="h-12 w-12 sm:h-20 sm:w-20 mx-auto mb-1.5 sm:mb-3 ring-2 sm:ring-4 ring-yellow-400">
                  <AvatarImage src={filteredStudents[0].avatar_url} />
                  <AvatarFallback className="text-sm sm:text-2xl bg-yellow-300 font-bold">
                    {filteredStudents[0].full_name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-xs sm:text-base truncate px-1">{filteredStudents[0].full_name || "Developer"}</h3>
                <div className="flex items-center justify-center gap-1 mt-0.5 sm:mt-1">
                  <Coins className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-yellow-500" />
                  <span className="font-extrabold text-sm sm:text-lg">{filteredStudents[0].coins || 0}</span>
                </div>
                <Badge className="mt-1.5 sm:mt-2 h-5 sm:h-6 text-[10px] sm:text-xs px-2 sm:px-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold">Champion</Badge>
              </Card>
            </div>

            {/* 3rd Place */}
            <div className="order-3">
              <Card
                className="p-2.5 sm:p-4 text-center bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 border-2 border-amber-500 cursor-pointer hover:shadow-lg transition-all rounded-xl sm:rounded-2xl"
                onClick={() => navigate(`/developer/${filteredStudents[2].user?._id || filteredStudents[2].user}`)}
              >
                <div className="flex justify-center mb-1 sm:mb-2">
                  <Award className="h-5 w-5 sm:h-8 sm:w-8 text-amber-600" />
                </div>
                <Avatar className="h-10 w-10 sm:h-14 sm:w-14 mx-auto mb-1 sm:mb-2 ring-2 ring-amber-400">
                  <AvatarImage src={filteredStudents[2].avatar_url} />
                  <AvatarFallback className="text-xs sm:text-lg bg-amber-300 font-bold">
                    {filteredStudents[2].full_name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-xs sm:text-sm truncate px-1">{filteredStudents[2].full_name || "Developer"}</h3>
                <div className="flex items-center justify-center gap-1 mt-0.5 sm:mt-1">
                  <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                  <span className="font-bold text-xs sm:text-base">{filteredStudents[2].coins || 0}</span>
                </div>
                <Badge className="mt-1.5 sm:mt-2 h-4 sm:h-5 text-[10px] sm:text-xs px-1.5 sm:px-2.5 bg-amber-500 text-white font-semibold">3rd Place</Badge>
              </Card>
            </div>
          </div>
        )}

        {/* Full Rankings */}
        <Card className="p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">All Rankings</h2>
          <div className="space-y-3">
            {filteredStudents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No developers found</p>
            ) : (
              filteredStudents.map((student, index) => (
                <div
                  key={student._id || student.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => navigate(`/developer/${student.user?._id || student.user}`)}
                >
                  <div className="w-10 flex justify-center">
                    {getRankIcon(index)}
                  </div>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={student.avatar_url} />
                    <AvatarFallback>
                      {student.full_name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{student.full_name || "Developer"}</h3>
                    <p className="text-sm text-muted-foreground truncate">{student.user?.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold text-lg">{student.coins || 0}</span>
                  </div>
                  <Badge className={getRankBadge(index)}>
                    #{index + 1}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;