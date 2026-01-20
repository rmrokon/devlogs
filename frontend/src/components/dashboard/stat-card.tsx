'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCommit, Activity as ActivityIcon, Trophy } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: 'commit' | 'streak' | 'trophy';
    isLoading?: boolean;
}

const icons = {
    commit: GitCommit,
    streak: ActivityIcon,
    trophy: Trophy
};

export function StatCard({ title, value, description, icon, isLoading }: StatCardProps) {
    const Icon = icons[icon];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "..." : value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
