'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { fetchUser } = useAuthStore();

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <div className="p-4 bg-sidebar-accent/10 border-b flex items-center">
                    <SidebarTrigger />
                </div>
                {children}
            </main>
        </SidebarProvider>
    );
}
