import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/api/client";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Code2, Trophy, Users, CheckCircle2, ArrowRight, Star, Quote, Mail, Phone, MapPin, Linkedin, Facebook, Instagram, Github, Briefcase, Target, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import CodeBackground from "@/components/CodeBackground";

const Landing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      setIsLoggedIn(!!token);
      setUserRole(role);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contact', contactForm);
      toast({
        title: "Message sent!",
        description: "We'll get back to you soon.",
      });
      setContactForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleStartCoding = () => {
    if (!isLoggedIn) {
      navigate("/auth");
    } else {
      // Both Student and Company go to dashboard
      navigate("/dashboard");
    }
  };

  const handleBrowseProblems = () => {
    if (!isLoggedIn) {
      navigate("/auth");
    } else if (userRole === 'company') {
      navigate("/leaderboard");
    } else {
      navigate("/all-problems");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Image with Animation */}
        {/* Background Animation */}
        <div
          className="absolute inset-0 z-0 overflow-hidden"
          style={{
            maskImage: 'radial-gradient(circle at center, transparent 40%, black 100%)',
            WebkitMaskImage: 'radial-gradient(circle at center, transparent 40%, black 100%)'
          }}
        >
          <CodeBackground />
          <div className="absolute inset-0 bg-background/90 dark:bg-background/80 mix-blend-multiply dark:mix-blend-normal"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
              Code. Practice. Get Hired.
            </div>
            <h1 className="mb-8 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Master Coding & Connect with{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Top Companies
              </span>
            </h1>
            <p className="mb-10 text-lg sm:text-xl text-muted-foreground px-2 sm:px-0 max-w-2xl mx-auto leading-relaxed">
              Solve real coding problems, earn rewards, and get discovered by leading tech companies.
              Your journey from student to professional starts here.
            </p>
            <div className="flex flex-col gap-4 w-full sm:w-auto sm:flex-row sm:justify-center px-4 sm:px-0 mb-16">
              <Button size="lg" variant="hero" onClick={handleStartCoding} className="w-full sm:w-auto">
                {isLoggedIn && userRole === 'company' ? "Dashboard" : "Start Coding Free"}
              </Button>
              <Button size="lg" variant="outline" onClick={handleBrowseProblems} className="w-full sm:w-auto">
                {isLoggedIn && userRole === 'company' ? "View Leaderboard" : "Browse Problems"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Why Choose CodeConnect?
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to level up your coding skills and career
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 bg-gradient-card shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Real Coding Problems</h3>
              <p className="text-muted-foreground">
                Practice with industry-standard problems across multiple difficulty levels and programming languages.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-block rounded-lg bg-accent/10 p-3">
                <Trophy className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Earn Coins & Rewards</h3>
              <p className="text-muted-foreground">
                Get rewarded for every problem solved. Earn coins based on difficulty and redeem them for opportunities.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-block rounded-lg bg-success/10 p-3">
                <Target className="h-6 w-6 text-success" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Compete & Excel</h3>
              <p className="text-muted-foreground">
                Climb the leaderboard, track your progress, and showcase your skills to potential employers.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Company Connections</h3>
              <p className="text-muted-foreground">
                Top companies actively search for talent on our platform. Get discovered and invited for interviews.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-block rounded-lg bg-accent/10 p-3">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Instant Feedback</h3>
              <p className="text-muted-foreground">
                Get immediate results on your code with automated test cases and detailed performance metrics.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-block rounded-lg bg-success/10 p-3">
                <Users className="h-6 w-6 text-success" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Growing Community</h3>
              <p className="text-muted-foreground">
                Join thousands of developers improving their skills and building successful careers together.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">Contact Developer</h2>

          <Card className="mx-auto max-w-5xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Contact Info */}
              <div className="bg-gradient-hero p-8 text-primary-foreground">
                <h3 className="mb-8 text-2xl font-bold">Get in Touch</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">ramuparasa02@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">+91 7207674897</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">1-78 Narsapuram</p>
                      <p className="opacity-90">West Godavari, Andhra Pradesh</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <a href="https://github.com/balaji-sri-ram" target="_blank" rel="noopener noreferrer"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/balaji-sri-ram-parasa" target="_blank" rel="noopener noreferrer"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="https://www.instagram.com/ramu__parasa" target="_blank" rel="noopener noreferrer"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-card p-8">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                    <Textarea
                      id="message"
                      placeholder="Your message"
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Developer Image (Left) */}
              <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-hero rounded-[2rem] transform rotate-6 opacity-30 blur-lg"></div>
                  <img
                    src="/developer.jpg"
                    alt="Balaji Sri Ram Parasa"
                    className="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-[2rem] shadow-2xl border-4 border-background"
                  />
                </div>
              </div>

              {/* Developer Info (Right) */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4">Meet the Developer</h2>
                <h3 className="text-xl text-primary font-semibold mb-6 flex items-center justify-center md:justify-start gap-2">
                  <a href="https://balaji-sri-ram.github.io/Portfolio" target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:no-underline">
                    Balaji Sri Ram Parasa
                  </a>
                  <CheckCircle2 className="h-5 w-5 fill-primary text-background" />
                </h3>

                <div className="space-y-4 text-muted-foreground mb-8 text-lg">
                  <p>
                    Passionate Full Stack Developer with a knack for building scalable web applications.
                    Dedicated to creating seamless user experiences and robust backend systems.
                  </p>
                  <p>
                    Experienced in the MERN stack and modern web technologies. Always learning,
                    always coding, and always ready for the next challenge.
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={() => {
                    const contactSection = document.getElementById('contact-section');
                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group"
                >
                  Contact Me
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-hero p-12 text-center text-primary-foreground shadow-glow">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Join thousands of students already practicing and getting hired through CodeConnect
            </p>
            <div className="flex flex-col gap-4 w-full sm:w-auto sm:flex-row sm:justify-center">
              {/* Ready To Start Section Buttons */}
              {isLoggedIn ? (
                userRole === 'company' ? (
                  <>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                      onClick={() => navigate("/dashboard")}
                    >
                      Dashboard
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                      onClick={() => navigate("/company/profile")}
                    >
                      Profile
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                      onClick={() => navigate("/all-problems")}
                    >
                      Practice
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                      onClick={() => navigate("/companies")}
                    >
                      Companies
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={() => navigate("/auth")}
                  >
                    Create Free Account
                  </Button>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    onClick={() => navigate("/auth")}
                  >
                    For Companies
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 CodeConnect. Empowering developers to achieve their career goals through hard work, consistency, and placement in their dream companies.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
