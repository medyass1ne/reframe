'use client';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Brain, Signpost, BookOpen, Shield, Users, Activity } from 'lucide-react';

const features = [
    {
        icon: Brain,
        title: "AI Thought Reframing",
        description: "Challenge negative thought patterns with our advanced AI assistant that helps you view situations from a healthier, more constructive perspective.",
        color: "text-violet-500",
        bg: "bg-violet-100 dark:bg-violet-900/20"
    },
    {
        icon: Signpost,
        title: "Decision Simulator",
        description: "Role-play complex life scenarios in a safe environment. See how different choices play out without real-world consequences.",
        color: "text-teal-500",
        bg: "bg-teal-100 dark:bg-teal-900/20"
    },
    {
        icon: BookOpen,
        title: "Curated Resource Portal",
        description: "Access a library of verified mental health articles, videos, and exercises tailored to your specific emotional needs.",
        color: "text-blue-500",
        bg: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
        icon: Activity,
        title: "Mood Tracking",
        description: "Log your daily emotional state to identify triggers and patterns over time with beautiful, insightful visualizations.",
        color: "text-pink-500",
        bg: "bg-pink-100 dark:bg-pink-900/20"
    },
    {
        icon: Shield,
        title: "Private & Secure",
        description: "Your mental health data is sensitive. We use enterprise-grade encryption to ensure your personal journey remains private.",
        color: "text-emerald-500",
        bg: "bg-emerald-100 dark:bg-emerald-900/20"
    },
    {
        icon: Users,
        title: "Professional Network",
        description: "Seamlessly connect with licensed therapists and counselors when you need additional support beyond self-care tools.",
        color: "text-amber-500",
        bg: "bg-amber-100 dark:bg-amber-900/20"
    }
];

export default function FeaturesPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-teal-400 bg-clip-text text-transparent">
                        Tools for a Better You
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300">
                        Discover the comprehensive suite of features designed to support your mental wellness journey every step of the way.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <GlassCard key={idx} className="p-8 hover:-translate-y-2 transition-transform duration-300">
                                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                                    <Icon className={`w-8 h-8 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </GlassCard>
                        );
                    })}
                </div>

                <GlassCard className="p-12 text-center max-w-4xl mx-auto bg-gradient-to-br from-teal-500/10 to-violet-500/10 border-teal-500/20">
                    <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                        Join Reframe today and get full access to all these features and more.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register">
                            <Button variant="primary" className="px-8 py-4 text-lg w-full sm:w-auto">
                                Get Started for Free
                            </Button>
                        </Link>
                        <Link href="/doctors">
                            <Button variant="outline" className="px-8 py-4 text-lg w-full sm:w-auto">
                                Browse Specialists
                            </Button>
                        </Link>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
