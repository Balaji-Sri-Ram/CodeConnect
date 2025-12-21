
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { BASE_URL } from "@/api/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, Trash2, ArrowLeft, AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

import { PasswordRequirements } from "@/components/PasswordRequirements";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [profile, setProfile] = useState({
    company_name: "",
    email: "",
    logo_url: "",
    description: "",
    website: "",
    linkedin_url: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile/me');
        if (data.user?.role !== 'company') {
          navigate('/dashboard');
          return;
        }

        setProfile({
          company_name: data.company_name || data.full_name || "",
          email: data.user?.email || "",
          logo_url: data.avatar_url || "", // Using avatar_url as logo_url for consistency
          description: data.bio || "", // Using bio as description
          website: data.website || "", // Using correct website field
          linkedin_url: data.linkedin_url || "",
        });
      } catch (error) {
        console.error(error);
        if (error.response?.status === 401) {
          navigate('/auth');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data: filePath } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fullUrl = `${BASE_URL}${filePath}`;

      // Update profile
      await api.post('/profile', { ...profile, avatar_url: fullUrl });

      setProfile(prev => ({ ...prev, logo_url: fullUrl }));
      toast({ title: "Success", description: "Logo updated successfully" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to upload logo", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    setRemoving(true);
    try {
      await api.post('/profile', { ...profile, avatar_url: "" });
      setProfile(prev => ({ ...prev, logo_url: "" }));
      toast({ title: "Success", description: "Logo removed successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove logo", variant: "destructive" });
    } finally {
      setRemoving(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Map UI fields back to API fields
      const payload = {
        company_name: profile.company_name,
        bio: profile.description,
        website: profile.website,
        linkedin_url: profile.linkedin_url,
        // email is read-only usually, or handled separately
      };
      await api.post('/profile', payload);
      toast({ title: "Success", description: "Profile updated successfully" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await api.put('/auth/password', { password: newPassword });
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Company Profile
          </h1>
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Logo Section */}
        <Card className="mb-6 border-border/50 shadow-elegant">
          <CardHeader>
            <CardTitle>Company Logo</CardTitle>
            <CardDescription>Upload your company logo</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.logo_url} />
              <AvatarFallback className="text-2xl">
                {profile.company_name?.charAt(0)?.toUpperCase() || "C"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col sm:flex-row gap-3">
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors w-40 h-10">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  <span>{uploading ? "Uploading..." : "Upload Logo"}</span>
                </div>
              </Label>
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
                disabled={uploading}
              />
              {profile.logo_url && (
                <Button variant="destructive" onClick={handleRemoveLogo} disabled={removing} className="flex items-center justify-center gap-2 px-4 py-2 h-10 w-40">
                  {removing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  <span>{removing ? "Removing..." : "Remove Logo"}</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card className="mb-6 border-border/50 shadow-elegant">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Update your company details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={profile.company_name}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                placeholder="Tell us about your company"
                className="min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
              <Input
                id="linkedin_url"
                value={profile.linkedin_url}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/company/your-company"
              />
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : "Save Changes"}
            </Button>
          </CardContent>
        </Card>



        {/* Change Password */}

        <Card className="border-border/50 shadow-elegant mb-8">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setNewPasswordFocused(true)}
                onBlur={() => setNewPasswordFocused(false)}
                placeholder="Enter new password"
              />
              <PasswordRequirements password={newPassword} visible={newPasswordFocused} />
            </div>
            <div>
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                id="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <Button onClick={handleChangePassword} className="w-full" disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Updating...</> : "Change Password"}
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-900/50 shadow-elegant bg-red-50/50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    onClick={async () => {
                      try {
                        await api.delete('/auth/profile');
                        localStorage.clear();
                        navigate('/');
                        toast({
                          title: "Account Deleted",
                          description: "Your account has been permanently deleted.",
                        });
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to delete account.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div >
  );
};

export default CompanyProfile;
