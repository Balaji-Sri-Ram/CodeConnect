import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

/**
 * Universal Page Skeleton - used during initial page load / lazy route transitions
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar Skeleton */}
      <div className="border-b border-border/60 bg-card/50 backdrop-blur-md px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-6 w-32 rounded-lg" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 max-w-full rounded" />
        </div>

        {/* 4 Cards Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 bg-card/60 border border-border/50 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-3 w-full rounded" />
            </Card>
          ))}
        </div>

        {/* Big Content Cards */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-6 bg-card/60 border border-border/50 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40 rounded" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-border/40 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-48 rounded" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-3/4 rounded" />
              </div>
            ))}
          </Card>

          <Card className="p-6 bg-card/60 border border-border/50 space-y-4">
            <Skeleton className="h-6 w-36 rounded" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/30">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * Student Dashboard Skeleton
 */
export function StudentDashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 bg-gradient-card shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-20 rounded" />
              <Skeleton className="h-3 w-36 rounded" />
            </div>
          </Card>
        ))}
      </div>

      {/* Practice Problems Section Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
        <Card className="bg-white dark:bg-card shadow-lg p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-4 sm:p-6 rounded-xl border border-border/60 bg-muted/10 space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-52 sm:w-64 rounded" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-4/5 rounded" />
                </div>
                <Skeleton className="h-9 w-24 rounded-lg shrink-0" />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Company Challenges Section Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-52 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
        <Card className="bg-white dark:bg-card shadow-lg p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 rounded-xl border border-border/60 bg-muted/10 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-56 rounded" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-40 rounded" />
                </div>
                <Skeleton className="h-10 w-24 rounded-lg shrink-0 self-center" />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/**
 * Company Dashboard Skeleton
 */
export function CompanyDashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60 rounded-lg" />
          <Skeleton className="h-4 w-80 max-w-full rounded" />
        </div>
        <Skeleton className="h-10 w-44 rounded-lg" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 bg-gradient-card shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20 rounded" />
          </Card>
        ))}
      </div>

      {/* Challenges List Card */}
      <Card className="p-6 bg-card border border-border space-y-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 sm:p-6 rounded-xl border border-border/60 bg-muted/10 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-48 rounded" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-2/3 rounded" />
                <Skeleton className="h-3 w-36 rounded" />
              </div>
              <div className="flex gap-2 shrink-0">
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/**
 * Problem List Skeleton (used in AllProblems.jsx and practice cards)
 */
export function ProblemListSkeleton({ count = 6 }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {[...Array(count)].map((_, i) => (
        <Card
          key={i}
          className="p-6 bg-white dark:bg-card border border-border/60 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2.5 flex-1">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-56 sm:w-80 rounded" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-4/5 rounded" />
              <div className="flex items-center gap-2 pt-1">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-md" />
                <Skeleton className="h-5 w-14 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-10 w-28 rounded-lg shrink-0 self-start sm:self-center" />
          </div>
        </Card>
      ))}
    </div>
  );
}

/**
 * Challenges Grid Skeleton (used in CompanyChallenges.jsx)
 */
export function ChallengesGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-300">
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="p-6 bg-card border border-border/60 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-4/5 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
          <div className="pt-3 border-t border-border/40 flex items-center justify-between">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </Card>
      ))}
    </div>
  );
}

/**
 * Companies Grid Skeleton (used in Companies.jsx)
 */
export function CompaniesGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-300">
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="p-6 bg-card border border-border/60 space-y-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-36 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded" />
          <div className="pt-3 border-t border-border/40 flex items-center justify-between">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </Card>
      ))}
    </div>
  );
}

/**
 * Leaderboard Skeleton (used in Leaderboard.jsx)
 */
export function LeaderboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Trophy Header */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <Skeleton className="w-20 h-20 rounded-full mx-auto" />
        <Skeleton className="h-10 w-64 rounded-lg mx-auto" />
        <Skeleton className="h-4 w-96 max-w-full rounded mx-auto" />
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6">
        {[1, 0, 2].map((idx) => (
          <Card
            key={idx}
            className={`p-6 bg-card border border-border/60 text-center space-y-4 ${
              idx === 0 ? "md:-mt-4 border-primary/40 shadow-lg" : ""
            }`}
          >
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 rounded mx-auto" />
              <Skeleton className="h-4 w-20 rounded mx-auto" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg mx-auto" />
          </Card>
        ))}
      </div>

      {/* Table / List Rows */}
      <Card className="max-w-4xl mx-auto p-6 bg-card border border-border/60 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3.5 rounded-lg border border-border/40 bg-muted/10"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-lg" />
          </div>
        ))}
      </Card>
    </div>
  );
}

/**
 * Profile Skeleton (used in StudentProfile.jsx and CompanyProfile.jsx)
 */
export function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      {/* Main Profile Card */}
      <Card className="p-6 bg-card border border-border/60 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/60">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2 text-center sm:text-left flex-1">
            <Skeleton className="h-6 w-44 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-8 w-28 rounded-lg mt-2" />
          </div>
        </div>

        {/* Form fields skeleton */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </Card>
    </div>
  );
}

/**
 * Developer Profile Skeleton (used in DeveloperProfile.jsx)
 */
export function DeveloperProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in duration-300">
      <Skeleton className="h-9 w-28 rounded-lg" />

      {/* Banner / Avatar Card */}
      <Card className="p-6 bg-card border border-border/60 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2 flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <Skeleton className="h-7 w-48 rounded" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-4 w-72 max-w-full rounded" />
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 bg-card border border-border/60 space-y-3">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-8 w-16 rounded" />
          </Card>
        ))}
      </div>

      {/* Submissions History */}
      <Card className="p-6 bg-card border border-border/60 space-y-4">
        <Skeleton className="h-6 w-44 rounded" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg border border-border/40 flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-48 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </Card>
    </div>
  );
}

/**
 * Public Company Profile Skeleton (used in PublicCompanyProfile.jsx)
 */
export function PublicCompanyProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in duration-300">
      <Skeleton className="h-9 w-32 rounded-lg" />

      {/* Company Card Header */}
      <Card className="p-6 bg-card border border-border/60 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Skeleton className="h-20 w-20 rounded-2xl" />
          <div className="space-y-2 flex-1 text-center sm:text-left">
            <Skeleton className="h-7 w-56 rounded" />
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        </div>
      </Card>

      {/* Challenges Section */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 bg-card border border-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
              <div className="pt-2 flex justify-end">
                <Skeleton className="h-9 w-24 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Problem Description Skeleton (used in Compiler.jsx)
 */
export function ProblemDescriptionSkeleton() {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Title & Badge */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-3/4 rounded-lg" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      {/* Description lines */}
      <div className="space-y-2.5 pt-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-11/12 rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="h-4 w-9/12 rounded" />
      </div>

      {/* Example Box 1 */}
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>

      {/* Example Box 2 */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>

      {/* Topics */}
      <div className="pt-4 border-t border-border flex items-center gap-2">
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}
