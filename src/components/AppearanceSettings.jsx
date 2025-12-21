
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AppearanceSettings() {
    const { theme, setTheme } = useTheme();

    return (
        <Card className="mb-6 border-border/50 shadow-elegant">
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                    Customize the appearance of the application. Automatically switch between day and night themes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* System Default */}
                    <Button
                        variant="outline"
                        className={`h-auto flex-col items-center justify-between p-4 ${theme === "system" ? "border-2 border-primary bg-accent/5" : "border-border"
                            }`}
                        onClick={() => setTheme("system")}
                    >
                        <div className="mb-2 rounded-md border bg-slate-100 p-2 dark:bg-slate-800">
                            <Monitor className="h-6 w-6 text-foreground" />
                        </div>
                        <div className="space-y-1 text-center">
                            <span className="font-medium leading-none tracking-tight">System</span>
                            <p className="text-xs text-muted-foreground">Follows system settings</p>
                        </div>
                    </Button>

                    {/* Light Theme */}
                    <Button
                        variant="outline"
                        className={`h-auto flex-col items-center justify-between p-4 ${theme === "light" ? "border-2 border-primary bg-accent/5" : "border-border"
                            }`}
                        onClick={() => setTheme("light")}
                    >
                        <div className="mb-2 rounded-md border bg-[#ffffff] p-2 text-slate-900">
                            <Sun className="h-6 w-6" />
                        </div>
                        <div className="space-y-1 text-center">
                            <span className="font-medium leading-none tracking-tight">Light</span>
                            <p className="text-xs text-muted-foreground">Light appearance</p>
                        </div>
                    </Button>

                    {/* Dark Theme */}
                    <Button
                        variant="outline"
                        className={`h-auto flex-col items-center justify-between p-4 ${theme === "dark" ? "border-2 border-primary bg-accent/5" : "border-border"
                            }`}
                        onClick={() => setTheme("dark")}
                    >
                        <div className="mb-2 rounded-md border bg-slate-950 p-2 text-slate-100">
                            <Moon className="h-6 w-6" />
                        </div>
                        <div className="space-y-1 text-center">
                            <span className="font-medium leading-none tracking-tight">Dark</span>
                            <p className="text-xs text-muted-foreground">Dark appearance</p>
                        </div>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
