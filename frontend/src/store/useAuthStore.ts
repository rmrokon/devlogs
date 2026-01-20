import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

interface User {
    id: number;
    username: string;
    github_id: string;
    totalCommits?: number;
    last_synced_at?: string | null;
}

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            setAuth: (user, token) => set({ user, token }),
            logout: () => set({ user: null, token: null }),
            isAuthenticated: () => !!get().token,
            fetchUser: async () => {
                try {
                    const res = await api.get('/users/me');
                    const currentUser = get().user;
                    set({ user: { ...currentUser, ...res.data } as User });
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        }),
        {
            name: 'auth-storage',
        }
    )
);
