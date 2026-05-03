"use client";

import React, { useEffect, useRef } from "react";
import { useThemeStore, type ColorMode } from "@/store/themeStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Check,
  CreditCard,
  LayoutDashboard,
  Search,
  Settings,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

interface PreviewPanelProps {
  mode: ColorMode;
}

function AppliedTheme({ children, mode, style }: { children: React.ReactNode; mode: ColorMode; style: React.CSSProperties }) {
  return (
    <div
      className={mode === "dark" ? "dark" : ""}
      style={{
        ...style,
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {children}
    </div>
  );
}

export function PreviewPanel({ mode }: PreviewPanelProps) {
  const { tokens } = useThemeStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTokens = tokens[mode];

  const cssVars: React.CSSProperties = {
    "--background": currentTokens.background,
    "--foreground": currentTokens.foreground,
    "--card": currentTokens.card,
    "--card-foreground": currentTokens["card-foreground"],
    "--popover": currentTokens.popover,
    "--popover-foreground": currentTokens["popover-foreground"],
    "--primary": currentTokens.primary,
    "--primary-foreground": currentTokens["primary-foreground"],
    "--secondary": currentTokens.secondary,
    "--secondary-foreground": currentTokens["secondary-foreground"],
    "--muted": currentTokens.muted,
    "--muted-foreground": currentTokens["muted-foreground"],
    "--accent": currentTokens.accent,
    "--accent-foreground": currentTokens["accent-foreground"],
    "--destructive": currentTokens.destructive,
    "--destructive-foreground": currentTokens["destructive-foreground"],
    "--border": currentTokens.border,
    "--input": currentTokens.input,
    "--ring": currentTokens.ring,
    "--chart-1": currentTokens["chart-1"],
    "--chart-2": currentTokens["chart-2"],
    "--chart-3": currentTokens["chart-3"],
    "--chart-4": currentTokens["chart-4"],
    "--chart-5": currentTokens["chart-5"],
    "--sidebar": currentTokens.sidebar,
    "--sidebar-foreground": currentTokens["sidebar-foreground"],
    "--sidebar-primary": currentTokens["sidebar-primary"],
    "--sidebar-primary-foreground": currentTokens["sidebar-primary-foreground"],
    "--sidebar-accent": currentTokens["sidebar-accent"],
    "--sidebar-accent-foreground": currentTokens["sidebar-accent-foreground"],
    "--sidebar-border": currentTokens["sidebar-border"],
    "--sidebar-ring": currentTokens["sidebar-ring"],
    "--radius": tokens.borderRadius,
    "--font-sans": tokens.fontFamily.sans,
    "--font-serif": tokens.fontFamily.serif,
    "--font-mono": tokens.fontFamily.mono,
  } as React.CSSProperties;

  return (
    <ScrollArea className="h-full">
      <div ref={containerRef} style={cssVars} className="min-h-full">
        <AppliedTheme mode={mode} style={cssVars}>
          <div className="p-6 space-y-8" style={{ fontFamily: "var(--font-sans)" }}>

            {/* ── Buttons ── */}
            <Section title="Buttons">
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
                <Button disabled>Disabled</Button>
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Star className="h-4 w-4" /></Button>
              </div>
            </Section>

            {/* ── Badges ── */}
            <Section title="Badges">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </Section>

            {/* ── Form Elements ── */}
            <Section title="Form Elements">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                <div className="space-y-1.5">
                  <Label htmlFor="preview-email">Email</Label>
                  <Input id="preview-email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="preview-search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                    <Input id="preview-search" className="pl-8" placeholder="Search…" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="preview-switch" />
                  <Label htmlFor="preview-switch">Notifications</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="preview-switch-2" defaultChecked />
                  <Label htmlFor="preview-switch-2">Dark mode</Label>
                </div>
              </div>
            </Section>

            {/* ── Tabs ── */}
            <Section title="Tabs">
              <Tabs defaultValue="overview" className="max-w-lg">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">
                    Overview tab content — showing a summary of your project stats.
                  </p>
                </TabsContent>
                <TabsContent value="analytics">
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">
                    Analytics tab content — your data visualizations live here.
                  </p>
                </TabsContent>
                <TabsContent value="settings">
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">
                    Settings tab content — configure your preferences.
                  </p>
                </TabsContent>
              </Tabs>
            </Section>

            {/* ── Cards ── */}
            <Section title="Cards">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Stats card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Revenue</CardDescription>
                    <CardTitle className="text-2xl">$45,231.89</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      <span className="text-emerald-500 font-medium">+20.1%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Active Users</CardDescription>
                    <CardTitle className="text-2xl">+2,350</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      <span className="text-emerald-500 font-medium">+180</span> since last hour
                    </p>
                  </CardContent>
                </Card>

                {/* Notification card */}
                <Card className="sm:col-span-2">
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>You have 3 unread messages.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { icon: Bell, title: "Your call has been confirmed.", time: "1h ago" },
                      { icon: Users, title: "You have a new subscriber!", time: "2h ago" },
                      { icon: CreditCard, title: "Your subscription is expiring soon.", time: "1d ago" },
                    ].map(({ icon: Icon, title, time }) => (
                      <div key={title} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--secondary)] shrink-0">
                          <Icon className="h-4 w-4 text-[var(--secondary-foreground)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-none">{title}</p>
                          <p className="text-xs text-[var(--muted-foreground)] mt-1">{time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline">
                      <Check className="mr-2 h-4 w-4" />
                      Mark all as read
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </Section>

            {/* ── Dashboard Layout Preview ── */}
            <Section title="Dashboard Layout">
              <div
                className="rounded-[var(--radius)] border border-[var(--border)] overflow-hidden"
                style={{ minHeight: 320 }}
              >
                <div className="flex h-full min-h-[320px]">
                  {/* Sidebar */}
                  <div
                    className="w-48 border-r border-[var(--sidebar-border)] flex flex-col py-4"
                    style={{ backgroundColor: "var(--sidebar)", color: "var(--sidebar-foreground)" }}
                  >
                    <div className="px-3 mb-4">
                      <p className="text-xs font-semibold uppercase tracking-wider opacity-60 px-2 mb-2">
                        Navigation
                      </p>
                      {[
                        { icon: LayoutDashboard, label: "Dashboard", active: true },
                        { icon: Users, label: "Users" },
                        { icon: TrendingUp, label: "Analytics" },
                        { icon: Bell, label: "Notifications" },
                        { icon: Settings, label: "Settings" },
                      ].map(({ icon: Icon, label, active }) => (
                        <div
                          key={label}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-[calc(var(--radius)-2px)] text-sm cursor-pointer transition-colors ${
                            active
                              ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]"
                              : "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 p-4 overflow-auto" style={{ backgroundColor: "var(--background)" }}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-semibold">Dashboard</h2>
                      <Button size="sm">
                        <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                        View Report
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { label: "Revenue", value: "$12,450", trend: "+12%" },
                        { label: "Users", value: "1,234", trend: "+4%" },
                      ].map(({ label, value, trend }) => (
                        <div
                          key={label}
                          className="rounded-[var(--radius)] border border-[var(--border)] p-3"
                          style={{ backgroundColor: "var(--card)" }}
                        >
                          <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
                          <p className="text-lg font-bold mt-0.5">{value}</p>
                          <p className="text-xs text-emerald-500 mt-0.5">{trend}</p>
                        </div>
                      ))}
                    </div>
                    <Separator className="mb-3" />
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Recent activity and chart data would appear here.
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            {/* ── Typography ── */}
            <Section title="Typography">
              <div className="space-y-3 max-w-lg">
                <h1 className="text-4xl font-bold tracking-tight">Display Heading</h1>
                <h2 className="text-2xl font-semibold tracking-tight">Section Heading</h2>
                <h3 className="text-xl font-medium">Subsection</h3>
                <p className="text-base leading-7">
                  Body copy — Inter is a highly legible sans-serif typeface designed for screens.
                  It works at every size from captions to headlines.
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Muted helper text used for descriptions and secondary information.
                </p>
                <p className="text-xs text-[var(--muted-foreground)] font-mono bg-[var(--muted)] px-2 py-1 rounded-[calc(var(--radius)-2px)] inline-block">
                  monospace code snippet
                </p>
              </div>
            </Section>

            {/* ── Color Swatches ── */}
            <Section title="Color Palette">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    "background",
                    "foreground",
                    "primary",
                    "primary-foreground",
                    "secondary",
                    "secondary-foreground",
                    "muted",
                    "muted-foreground",
                    "accent",
                    "accent-foreground",
                    "destructive",
                    "border",
                    "chart-1",
                    "chart-2",
                    "chart-3",
                    "chart-4",
                  ] as const
                ).map((key) => (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded-[calc(var(--radius)-2px)] border border-[var(--border)] shrink-0"
                      style={{ backgroundColor: currentTokens[key] ?? "transparent" }}
                    />
                    <span className="text-xs font-mono truncate text-[var(--muted-foreground)]">
                      {key}
                    </span>
                  </div>
                ))}
              </div>
            </Section>

          </div>
        </AppliedTheme>
      </div>
    </ScrollArea>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      {children}
    </div>
  );
}
