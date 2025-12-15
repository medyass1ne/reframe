'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { usePathname } from 'next/navigation';

export function Navbar() {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    const [user, setUser] = useState(null);

    useEffect(() => {

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }


        const handleStorageChange = () => {
            const updatedUser = localStorage.getItem('user');
            setUser(updatedUser ? JSON.parse(updatedUser) : null);
        };

        window.addEventListener('storage', handleStorageChange);

        window.addEventListener('user-login', handleStorageChange);
        window.addEventListener('user-logout', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('user-login', handleStorageChange);
            window.removeEventListener('user-logout', handleStorageChange);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            localStorage.removeItem('user');
            setUser(null);
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${isDashboard ? 'lg:pl-70' : ''}`}
        >
            <div className="glass-panel max-w-7xl mx-auto rounded-2xl px-6 py-3 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-violet-500 bg-clip-text text-transparent">
                    Reframe
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <Link href="/features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Features</Link>
                    <Link href="/doctors" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Find a Doctor</Link>
                    <Link href="/resources" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Resources</Link>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {user ? (
                        <>
                            <Link href="/dashboard">
                                <Button variant="ghost" className="text-sm font-medium">Dashboard</Button>
                            </Link>
                            <Button variant="outline" className="text-sm py-2" onClick={handleLogout}>Log out</Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" className="text-sm">Log in</Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="primary" className="text-sm py-2">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}
