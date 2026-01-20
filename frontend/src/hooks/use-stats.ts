import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface CommitTrend {
    date: string;
    count: number;
}

export interface LanguageStat {
    language: string;
    bytes: number;
}

export interface ActiveRepo {
    repo_id: number;
    commits: number;
    GithubRepository: {
        name: string;
        url: string;
    };
}

export interface DashboardStats {
    commitTrend: CommitTrend[];
    topLanguages: LanguageStat[];
    activeRepos: ActiveRepo[];
    streak?: {
        current: number;
        longest: number;
    };
}

export function useStats() {
    return useQuery<DashboardStats>({
        queryKey: ['stats'],
        queryFn: async () => {
            const { data } = await api.get('/stats');
            return data;
        },
    });
}

export function useSync() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { data } = await api.post('/sync');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stats'] });
            // Also invalidate user to get last_synced_at
            // But useAuthStore fetches user separately or we need to invalidate it too?
            // Since we use useAuthStore, we might need to manually call fetchUser()
        }
    });
}
export function usePublicStats(username: string) {
    return useQuery<DashboardStats>({
        queryKey: ['public-stats', username],
        queryFn: async () => {
            const { data } = await api.get(`/stats/public/${username}`);
            return data;
        },
        enabled: !!username,
    });
}
