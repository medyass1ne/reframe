'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LayoutDashboard, UserCircle, BookOpen, BrainCircuit, GitFork, Gamepad2 } from 'lucide-react';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();

    const navItems = [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'My Profile', path: '/dashboard/profile', icon: UserCircle },
        { name: 'Resources', path: '/dashboard/resources', icon: BookOpen },
        { name: 'Thought Reframer', path: '/dashboard/reframer', icon: BrainCircuit },
        { name: 'Decision Sim', path: '/dashboard/simulator', icon: GitFork },
        { name: 'Bonkie', path: '/dashboard/bonkie', icon: Gamepad2 },
    ];

    return (
        <div className="flex min-h-screen pt-5">
            <aside className="w-64 hidden lg:block border-r border-slate-200 dark:border-slate-800 p-6 pt-12 bg-white/30 dark:bg-black/20 backdrop-blur-sm fixed top-0 bottom-0 left-0 overflow-y-auto z-40">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">Menu</h3>
                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400 font-medium'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <div className="flex-1 lg:pl-64">
                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
