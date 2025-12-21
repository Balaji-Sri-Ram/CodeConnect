import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RotateCcw, Keyboard, Type, Layout, X } from "lucide-react";

export function CompilerSettingsDialog({ open, onOpenChange, settings, onSettingsChange }) {
    if (!settings) return null;

    const handleChange = (key, value) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    const handleShortcutChange = (key, value) => {
        onSettingsChange({
            ...settings,
            shortcuts: {
                ...settings.shortcuts,
                [key]: value
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[800px] p-0 gap-0 overflow-hidden bg-background border-border text-foreground sm:rounded-xl">
                <div className="flex h-[500px]">
                    <Tabs defaultValue="code-editor" orientation="vertical" className="flex w-full">
                        {/* Sidebar */}
                        <div className="w-[240px] border-r border-border bg-muted/30 flex flex-col">
                            <div className="p-4 pl-6 relative">
                                <DialogTitle className="text-lg font-medium text-foreground">Settings</DialogTitle>
                            </div>
                            <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 gap-1 items-start justify-start space-y-0">
                                <TabsTrigger
                                    value="dynamic-layout"
                                    className="w-full justify-start gap-3 px-6 py-3 text-muted-foreground data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-500 data-[state=active]:border-l-2 data-[state=active]:border-blue-500 rounded-none transition-none"
                                >
                                    <Layout className="h-4 w-4" />
                                    Dynamic Layout
                                </TabsTrigger>
                                <TabsTrigger
                                    value="code-editor"
                                    className="w-full justify-start gap-3 px-6 py-3 text-muted-foreground data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-500 data-[state=active]:border-l-2 data-[state=active]:border-blue-500 rounded-none transition-none"
                                >
                                    <Type className="h-4 w-4" />
                                    Code Editor
                                </TabsTrigger>
                                <TabsTrigger
                                    value="shortcuts"
                                    className="w-full justify-start gap-3 px-6 py-3 text-muted-foreground data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-500 data-[state=active]:border-l-2 data-[state=active]:border-blue-500 rounded-none transition-none"
                                >
                                    <Keyboard className="h-4 w-4" />
                                    Shortcuts
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 bg-background p-0 overflow-y-auto relative">


                            {/* Dynamic Layout Content */}
                            <TabsContent value="dynamic-layout" className="m-0 p-8 space-y-8 mt-0 h-full">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-foreground">Default layout</label>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="h-7 text-xs"
                                            onClick={() => handleChange('layout', 'toolbar')}
                                        >
                                            Reset
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-foreground">Show Run / Submit / Debug buttons in</label>
                                        <div className="flex gap-4">
                                            <div
                                                className={`cursor-pointer group flex flex-col items-center gap-2 ${settings.layout === 'toolbar' ? 'text-foreground' : 'text-muted-foreground'}`}
                                                onClick={() => handleChange('layout', 'toolbar')}
                                            >
                                                <div className={`w-32 h-20 rounded border-2 p-1 relative ${settings.layout === 'toolbar' ? 'border-blue-500 bg-blue-500/10' : 'border-border bg-muted'}`}>
                                                    <div className="w-full h-3 bg-muted-foreground/20 rounded-sm mb-1 flex justify-center gap-1 items-center">
                                                        <div className="w-4 h-1 bg-muted-foreground/40 rounded-full"></div>
                                                    </div>
                                                    <div className="flex gap-1 h-[calc(100%-20px)]">
                                                        <div className="w-1/2 h-full bg-muted-foreground/10 rounded-sm"></div>
                                                        <div className="w-1/2 h-full bg-muted-foreground/10 rounded-sm"></div>
                                                    </div>
                                                </div>
                                                <span className="text-xs">ToolBar</span>
                                            </div>

                                            <div
                                                className={`cursor-pointer group flex flex-col items-center gap-2 ${settings.layout === 'editor' ? 'text-foreground' : 'text-muted-foreground'}`}
                                                onClick={() => handleChange('layout', 'editor')}
                                            >
                                                <div className={`w-32 h-20 rounded border-2 p-1 relative ${settings.layout === 'editor' ? 'border-blue-500 bg-blue-500/10' : 'border-border bg-muted'}`}>
                                                    <div className="w-full h-full bg-muted-foreground/10 rounded-sm relative">
                                                        <div className="absolute bottom-2 right-2 w-8 h-2 bg-muted-foreground/40 rounded-full"></div>
                                                    </div>
                                                </div>
                                                <span className="text-xs">Code Editor</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Code Editor Content */}
                            <TabsContent value="code-editor" className="m-0 p-8 space-y-6 mt-0 h-full text-sm">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <label className="text-foreground font-medium">Font</label>
                                        <Select value={settings.fontFamily} onValueChange={(val) => handleChange('fontFamily', val)}>
                                            <SelectTrigger className="w-[180px] h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Default">Default</SelectItem>
                                                <SelectItem value="Fira Code">Fira Code</SelectItem>
                                                <SelectItem value="Ubuntu Mono">Ubuntu Mono</SelectItem>
                                                <SelectItem value="Cascadia">Cascadia</SelectItem>
                                                <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                                                <SelectItem value="Inconsolata">Inconsolata</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="text-foreground font-medium">Font size</label>
                                        <Select value={settings.fontSize} onValueChange={(val) => handleChange('fontSize', val)}>
                                            <SelectTrigger className="w-[180px] h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="12px">12px</SelectItem>
                                                <SelectItem value="13px">13px</SelectItem>
                                                <SelectItem value="14px">14px</SelectItem>
                                                <SelectItem value="15px">15px</SelectItem>
                                                <SelectItem value="16px">16px</SelectItem>
                                                <SelectItem value="18px">18px</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="text-foreground font-medium">Syntax Highlighting</label>
                                        <Select value={settings.syntaxHighlighting || "Normal"} onValueChange={(val) => handleChange('syntaxHighlighting', val)}>
                                            <SelectTrigger className="w-[180px] h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Normal">Normal</SelectItem>
                                                <SelectItem value="Highlighted">Highlighting</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="text-foreground font-medium">Word Wrap</label>
                                        <Switch
                                            checked={settings.wordWrap}
                                            onCheckedChange={(val) => handleChange('wordWrap', val)}
                                            className="data-[state=checked]:bg-blue-500"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Shortcuts Content */}
                            <TabsContent value="shortcuts" className="m-0 p-8 space-y-6 mt-0 h-full">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-muted-foreground">General</h3>

                                        <div className="flex items-center justify-between py-2 border-b border-border">
                                            <label className="text-foreground text-sm font-medium">Run code</label>
                                            <div className="flex items-center gap-4">
                                                <Switch
                                                    checked={settings.shortcuts?.runCode}
                                                    onCheckedChange={(val) => handleShortcutChange('runCode', val)}
                                                    className="data-[state=checked]:bg-blue-500 mr-2"
                                                />
                                                <div className="flex gap-1 min-w-[80px] justify-end">
                                                    <kbd className="px-2 py-1 bg-muted rounded border border-border text-xs text-muted-foreground">Ctrl</kbd>
                                                    <kbd className="px-2 py-1 bg-muted rounded border border-border text-xs text-muted-foreground">'</kbd>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-2 border-b border-border">
                                            <label className="text-foreground text-sm font-medium">Submit</label>
                                            <div className="flex items-center gap-4">
                                                <Switch
                                                    checked={settings.shortcuts?.submit}
                                                    onCheckedChange={(val) => handleShortcutChange('submit', val)}
                                                    className="data-[state=checked]:bg-blue-500 mr-2"
                                                />
                                                <div className="flex gap-1 min-w-[80px] justify-end">
                                                    <kbd className="px-2 py-1 bg-muted rounded border border-border text-xs text-muted-foreground">Ctrl</kbd>
                                                    <kbd className="px-2 py-1 bg-muted rounded border border-border text-xs text-muted-foreground">Enter</kbd>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-2 border-b border-border">
                                            <label className="text-foreground text-sm font-medium">Enter / Exit Full Screen</label>
                                            <div className="flex items-center gap-4">
                                                <Switch
                                                    checked={settings.shortcuts?.fullScreen}
                                                    onCheckedChange={(val) => handleShortcutChange('fullScreen', val)}
                                                    className="data-[state=checked]:bg-blue-500 mr-2"
                                                />
                                                <div className="flex gap-1 min-w-[80px] justify-end">
                                                    <kbd className="px-2 py-1 bg-muted rounded border border-border text-xs text-muted-foreground">Alt</kbd>
                                                    <kbd className="px-2 py-1 bg-muted rounded border border-border text-xs text-muted-foreground">F</kbd>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
