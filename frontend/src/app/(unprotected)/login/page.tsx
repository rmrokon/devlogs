'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setAuth, isAuthenticated } = useAuthStore();
    const token = searchParams.get('token');

    // Handle Token from URL (Auth Callback)
    useEffect(() => {
        if (token) {
            const fetchUser = async () => {
                try {
                    setAuth({ id: 0, username: 'User', github_id: '' }, token);
                    document.cookie = `auth_token=${token}; path=/; max-age=604800`; // 7 days
                    router.push('/dashboard');
                } catch (e) {
                    console.error(e);
                }
            };
            fetchUser();
        }
    }, [token, setAuth, router]);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated() && !token) {
            const checkCookie = document.cookie.includes('auth_token');
            if (checkCookie) {
                router.push('/dashboard');
            }
        }
    }, [isAuthenticated, router, token]);


    const handleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/github`;
    };

    return (
        <Card className="w-[350px]">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">DevLogs</CardTitle>
                <CardDescription className="text-center">
                    Sign in to track your development journey
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Button variant="outline" onClick={handleLogin} className="w-full">
                    <Github className="mr-2 h-4 w-4" />
                    Sign in with GitHub
                </Button>
            </CardContent>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginContent />
            </Suspense>
        </div>
    );
}
