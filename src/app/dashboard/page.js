'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Headphones, BookOpen } from 'lucide-react';
import MoodLogger from '@/components/features/MoodLogger';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';

export default function DashboardPage() {
    const [mood, setMood] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMoodLogger, setShowMoodLogger] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [moodRes, thoughtsRes] = await Promise.all([
                    fetch('/api/mood'),
                    fetch('/api/thoughts')
                ]);

                const moodData = await moodRes.json();
                const thoughtsData = await thoughtsRes.json();

                if (moodData.success && moodData.data.length > 0) {
                    setMood(moodData.data[0]);
                }

                if (thoughtsData.success) {
                    setActivities(thoughtsData.data.slice(0, 3));
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getMoodLabel = (level) => {
        if (level >= 4) return 'Good';
        if (level === 3) return 'Stable';
        return 'Low';
    };

    return (
        <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            <MoodLogger
                isOpen={showMoodLogger}
                onClose={() => setShowMoodLogger(false)}
                onLog={(newMood) => setMood(newMood)}
            />

            <motion.header variants={fadeInUp}>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                    Your Wellness Overview
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Here is your daily summary.</p>
            </motion.header>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={staggerContainer}
            >
                <motion.div variants={staggerItem}>
                    <GlassCard className="p-6 bg-gradient-to-br from-violet-500/10 to-purple-500/5 border-violet-500/20 cursor-pointer hover:border-violet-500/40 transition-colors" onClick={() => setShowMoodLogger(true)}>
                        <h3 className="font-semibold text-violet-700 dark:text-violet-300 mb-2">Mood Tracker</h3>
                        <p className="text-2xl font-bold">
                            {mood ? getMoodLabel(mood.level) : 'N/A'}
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                            {mood ? `Last: ${new Date(mood.createdAt).toLocaleDateString()}` : 'Tap to track how you feel'}
                        </p>
                    </GlassCard>
                </motion.div>

                <motion.div variants={staggerItem}>
                    <GlassCard className="p-6 bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border-teal-500/20">
                        <h3 className="font-semibold text-teal-700 dark:text-teal-300 mb-2">Weekly Goal</h3>
                        <p className="text-2xl font-bold">12/30 mins</p>
                        <p className="text-sm text-slate-500 mt-2">Meditation practice</p>
                    </GlassCard>
                </motion.div>


                <motion.div variants={staggerItem}>
                    <GlassCard className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20">
                        <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Upcoming Session</h3>
                        <p className="text-2xl font-bold">Tomorrow</p>
                        <p className="text-sm text-slate-500 mt-2">3:00 PM with Dr. Smith</p>
                    </GlassCard>
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section>
                    <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
                    <div className="space-y-4">
                        <GlassCard className="flex items-center gap-4 p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-2xl">
                                <Headphones className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h4 className="font-medium">Calming Anxiety Audio</h4>
                                <p className="text-sm text-slate-500">10 min session</p>
                            </div>
                        </GlassCard>
                        <GlassCard className="flex items-center gap-4 p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-medium">Understanding Stress</h4>
                                <p className="text-sm text-slate-500">5 min read</p>
                            </div>
                        </GlassCard>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <GlassCard>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {activities.length > 0 ? activities.map((activity, i) => (
                                <div key={i} className="p-4 flex justify-between items-center text-sm">
                                    <span>Reframed: "{activity.originalThought.substring(0, 30)}..."</span>
                                    <span className="text-slate-400">{new Date(activity.createdAt).toLocaleDateString()}</span>
                                </div>
                            )) : (
                                <div className="p-4 text-center text-slate-500">
                                    No recent activity. Start by reframing a thought!
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </section>
            </div>
        </motion.div>
    );
}
