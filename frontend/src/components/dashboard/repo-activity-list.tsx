'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

interface RepoActivityListProps {
    data: any[];
    isLoading?: boolean;
}

export function RepoActivityList({ data, isLoading }: RepoActivityListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Repository Activity</CardTitle>
                <CardDescription>Where you are most active (Last 30 days)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((repo) => (
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
                    {!isLoading && data.length === 0 && (
                        <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg">
                            No recent activity detected in synced repositories.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
