'use client';

import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePublicStats } from '@/hooks/use-stats';
import { StatCard } from '@/components/dashboard/stat-card';
import { CommitTrendChart } from '@/components/dashboard/commit-trend-chart';
import { TopLanguagesChart } from '@/components/dashboard/top-languages-chart';
import { RepoActivityList } from '@/components/dashboard/repo-activity-list';

export default function EmbedPage({ params: paramsPromise }: { params: Promise<{ username: string }> }) {
    const params = use(paramsPromise);
    const username = params.username;
    const searchParams = useSearchParams();
    const { data: stats, isLoading, error } = usePublicStats(username);

    const config = {
        commits: searchParams.get('commits') === '1',
        trend: searchParams.get('trend') === '1',
        languages: searchParams.get('languages') === '1',
        streak: searchParams.get('streak') === '1',
        longestStreak: searchParams.get('longestStreak') === '1',
        repos: searchParams.get('repos') === '1'
    };

    if (error) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                User not found or stats unavailable.
            </div>
        );
    }

    const totalCommits = stats?.commitTrend.reduce((acc, obj) => acc + obj.count, 0) || 0;
    const currentStreak = stats?.streak?.current || 0;
    const longestStreak = stats?.streak?.longest || 0;

    return (
        <div className="p-4 space-y-4 bg-background min-h-screen">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {config.commits && (
                    <StatCard
                        title="Total Commits (30d)"
                        value={totalCommits}
                        description="Across all synced repos"
                        icon="commit"
                        isLoading={isLoading}
                    />
                )}
                {config.streak && (
                    <StatCard
                        title="Current Streak"
                        value={`${currentStreak} Days`}
                        description="Keep it up!"
                        icon="streak"
                        isLoading={isLoading}
                    />
                )}
                {config.longestStreak && (
                    <StatCard
                        title="Longest Streak"
                        value={`${longestStreak} Days`}
                        description="Personal best"
                        icon="trophy"
                        isLoading={isLoading}
                    />
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {config.trend && (
                    <CommitTrendChart data={stats?.commitTrend || []} isLoading={isLoading} />
                )}
                {config.languages && (
                    <TopLanguagesChart data={(stats?.topLanguages || []) as any[]} isLoading={isLoading} />
                )}
            </div>

            {config.repos && (
                <RepoActivityList data={stats?.activeRepos || []} isLoading={isLoading} />
            )}
        </div>
    );
}
