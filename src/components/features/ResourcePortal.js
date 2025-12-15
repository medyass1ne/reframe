'use client';
import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

import { FileText, Video, Headphones, Book, PenTool } from 'lucide-react';

const resources = [
    { id: 1, title: "Managing Anxiety", type: "Article", category: "Anxiety", link: "#", icon: FileText },
    { id: 2, title: "Deep Breathing Exercises", type: "Video", category: "Stress", link: "#", icon: Video },
    { id: 3, title: "Sleep Hygiene 101", type: "Guide", category: "Sleep", link: "#", icon: Book },
    { id: 4, title: "Understanding Depression", type: "Article", category: "Depression", link: "#", icon: FileText },
    { id: 5, title: "Mindfulness Meditation", type: "Audio", category: "Mindfulness", link: "#", icon: Headphones },
    { id: 6, title: "Cognitive Distortions", type: "Worksheet", category: "CBT", link: "#", icon: PenTool },
];

export default function ResourcePortal() {
    const [filter, setFilter] = useState('All');
    const categories = ['All', 'Anxiety', 'Stress', 'Sleep', 'Depression', 'Mindfulness', 'CBT'];

    const filteredResources = filter === 'All'
        ? resources
        : resources.filter(r => r.category === filter);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat
                            ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                            : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map(resource => {
                    const Icon = resource.icon;
                    return (
                        <GlassCard key={resource.id} className="hover:scale-[1.02] transition-transform cursor-pointer group">
                            <div className="h-40 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 mb-4 flex items-center justify-center text-4xl group-hover:from-teal-100 group-hover:to-teal-200 dark:group-hover:from-teal-900/40 dark:group-hover:to-teal-800/40 transition-colors">
                                <Icon className="w-12 h-12 text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors" />
                            </div>
                            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">{resource.category}</span>
                            <h3 className="text-lg font-bold mt-1 mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">{resource.title}</h3>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-slate-500">{resource.type}</span>
                                <span className="text-teal-500 text-sm font-medium group-hover:translate-x-1 transition-transform">Read More →</span>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>
        </div>
    );
}
