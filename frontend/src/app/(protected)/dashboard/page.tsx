'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity as ActivityIcon, GitCommit, GitBranch, RefreshCw, Loader2, Trophy } from 'lucide-react';
import { useStats, useSync } from '@/hooks/use-stats';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardPage() {
    const { user, fetchUser } = useAuthStore();
    const { data: stats, isLoading } = useStats();
    const { mutate: sync, isPending: isSyncing } = useSync();

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
                    <div className="text-sm text-muted-foreground text-right hidden sm:block">
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Commits (30d)</CardTitle>
                        <GitCommit className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? "..." : totalCommits}</div>
                        <p className="text-xs text-muted-foreground">Across all synced repos</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                        <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? "..." : currentStreak} Days</div>
                        <p className="text-xs text-muted-foreground">Keep it up!</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? "..." : longestStreak} Days</div>
                        <p className="text-xs text-muted-foreground">Personal best</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Commit Frequency</CardTitle>
                        <CardDescription>Daily commits over last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            {isLoading ? (
                                <div className="flex h-full items-center justify-center">Loading...</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats?.commitTrend || []}>
                                        <XAxis
                                            dataKey="date"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                            labelFormatter={(val) => new Date(val).toLocaleDateString()}
                                        />
                                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Top Languages</CardTitle>
                        <CardDescription>By code volume (bytes)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            {isLoading ? (
                                <div className="flex h-full items-center justify-center">Loading...</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={(stats?.topLanguages || []) as any[]}
                                            dataKey="bytes"
                                            nameKey="language"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                        >
                                            {(stats?.topLanguages || []).map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                {(stats?.topLanguages || []).map((lang, i) => (
                                    <div key={lang.language} className="flex items-center gap-1 text-xs">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span>{lang.language}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Repository Activity</CardTitle>
                    <CardDescription>Where you are most active (Last 30 days)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats?.activeRepos.map((repo) => (
                            <div key={repo.repo_id} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-sidebar-accent/20 rounded-lg">
                                        <GitBranch className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{repo.GithubRepository.name}</p>
                                        <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-md">{repo.GithubRepository.url}</p>
                                    </div>
                                </div>
                                <div className="font-semibold text-primary">
                                    {repo.commits} commits
                                </div>
                            </div>
                        ))}
                        {!isLoading && stats?.activeRepos.length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg">
                                No recent activity detected in synced repositories.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
