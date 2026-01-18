'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Button onClick={handleLogout} variant="destructive">Logout</Button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Welcome, {user?.username || 'Developer'}!</h2>
                <p className="text-gray-600 dark:text-gray-300">
                    This is a protected route. Only authenticated users can see this.
                </p>
                <div className="mt-4">
                    <p><strong>GitHub ID:</strong> {user?.github_id || 'N/A'}</p>
                    {/* Add more user details or stats here */}
                </div>
            </div>
        </div>
    );
}
