'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useStats, useSync } from '@/hooks/use-stats';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, RefreshCw, Share2, Copy, Check } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { CommitTrendChart } from '@/components/dashboard/commit-trend-chart';
import { TopLanguagesChart } from '@/components/dashboard/top-languages-chart';
import { RepoActivityList } from '@/components/dashboard/repo-activity-list';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function DashboardPage() {
    const { user, fetchUser } = useAuthStore();
    const { data: stats, isLoading } = useStats();
    const { mutate: sync, isPending: isSyncing } = useSync();

    const [copied, setCopied] = useState(false);
    const [config, setConfig] = useState({
        commits: true,
        trend: true,
        languages: true,
        streak: true,
        longestStreak: true,
        repos: true
    });

    const handleSync = () => {
        sync(undefined, {
            onSuccess: () => {
                fetchUser();
            }
        });
    };

    const totalCommits = stats?.commitTrend.reduce((acc, obj) => acc + obj.count, 0) || 0;
    const currentStreak = stats?.streak?.current || 0;
    const longestStreak = stats?.streak?.longest || 0;

    const generateIframe = () => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const params = new URLSearchParams();
        let estimatedHeight = 120; // Padding & Footer

        if (config.commits) params.set('commits', '1');
        if (config.trend) params.set('trend', '1');
        if (config.languages) params.set('languages', '1');
        if (config.streak) params.set('streak', '1');
        if (config.longestStreak) params.set('longestStreak', '1');
        if (config.repos) params.set('repos', '1');

        if (config.commits || config.streak || config.longestStreak) estimatedHeight += 160;
        if (config.trend || config.languages) estimatedHeight += 440;
        if (config.repos) estimatedHeight += 500;

        const url = `${baseUrl}/embed/${user?.username}?${params.toString()}`;
        return `<iframe src="${url}" width="100%" height="${estimatedHeight}"></iframe>`;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateIframe());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.username}! Here's your development overview.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Get embeddable dashboard
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Embed Dashboard</DialogTitle>
                                    <DialogDescription>
                                        Select which items you want to include in your public embed.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="flex items-center justify-between space-x-2">
                                        <Label htmlFor="commits">30 days commit count</Label>
                                        <Switch
                                            id="commits"
                                            checked={config.commits}
                                            onCheckedChange={(val) => setConfig(prev => ({ ...prev, commits: val }))}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between space-x-2">
                                        <Label htmlFor="trend">Daily commits over last 30 days</Label>
                                        <Switch
                                            id="trend"
                                            checked={config.trend}
                                            onCheckedChange={(val) => setConfig(prev => ({ ...prev, trend: val }))}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between space-x-2">
                                        <Label htmlFor="languages">Top Languages</Label>
                                        <Switch
                                            id="languages"
                                            checked={config.languages}
                                            onCheckedChange={(val) => setConfig(prev => ({ ...prev, languages: val }))}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between space-x-2">
                                        <Label htmlFor="streak">Current Streak</Label>
                                        <Switch
                                            id="streak"
                                            checked={config.streak}
                                            onCheckedChange={(val) => setConfig(prev => ({ ...prev, streak: val }))}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between space-x-2">
                                        <Label htmlFor="longestStreak">Longest Streak</Label>
                                        <Switch
                                            id="longestStreak"
                                            checked={config.longestStreak}
                                            onCheckedChange={(val) => setConfig(prev => ({ ...prev, longestStreak: val }))}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between space-x-2">
                                        <Label htmlFor="repos">Repository activity</Label>
                                        <Switch
                                            id="repos"
                                            checked={config.repos}
                                            onCheckedChange={(val) => setConfig(prev => ({ ...prev, repos: val }))}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={copyToClipboard} className="w-full">
                                        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                        {copied ? 'Copied!' : 'Copy Embedded Dashboard'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <div className="text-sm text-muted-foreground text-right hidden sm:block mx-4">
                            {user?.last_synced_at ? (
                                <>Last synced {formatDistanceToNow(new Date(user.last_synced_at))} ago</>
                            ) : (
                                <>Never synced</>
                            )}
                        </div>
                        <Button onClick={handleSync} disabled={isSyncing} variant="outline">
                            {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                            {isSyncing ? 'Syncing...' : 'Sync Now'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Commits (30d)"
                    value={totalCommits}
                    description="Across all synced repos"
                    icon="commit"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Current Streak"
                    value={`${currentStreak} Days`}
                    description="Keep it up!"
                    icon="streak"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Longest Streak"
                    value={`${longestStreak} Days`}
                    description="Personal best"
                    icon="trophy"
                    isLoading={isLoading}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <CommitTrendChart data={stats?.commitTrend || []} isLoading={isLoading} />
                </div>
                <div className="col-span-3">
                    <TopLanguagesChart data={(stats?.topLanguages || []) as any[]} isLoading={isLoading} />
                </div>
            </div>

            <RepoActivityList data={stats?.activeRepos || []} isLoading={isLoading} />
        </div>
    );
}
