'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Star, MapPin, Calendar, Clock, Award, BookOpen, ArrowLeft } from 'lucide-react';
import { fadeInUp } from '@/lib/animations';

export default function DoctorProfilePage({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await fetch(`/api/doctors/${resolvedParams.id}`);
                const data = await res.json();
                if (data.success) {
                    setDoctor(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch doctor', error);
            } finally {
                setLoading(false);
            }
        };

        if (resolvedParams.id) {
            fetchDoctor();
        }
    }, [resolvedParams.id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-20 px-6 flex items-center justify-center">
                <div className="text-slate-500">Loading profile...</div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen pt-24 pb-20 px-6 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-500 mb-4">Doctor not found</p>
                    <Button onClick={() => router.push('/doctors')}>Back to Doctors</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-5xl mx-auto space-y-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <GlassCard className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-teal-500 to-violet-500 flex items-center justify-center text-5xl font-bold text-white flex-shrink-0">
                                {doctor.name.charAt(0)}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                                            {doctor.name}
                                        </h1>
                                        <p className="text-xl text-teal-600 dark:text-teal-400 font-medium mb-3">
                                            {doctor.specialty}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 px-3 py-2 rounded-lg">
                                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                        <span className="font-bold text-amber-700 dark:text-amber-400">
                                            {doctor.rating?.toFixed(1) || '4.5'}
                                        </span>
                                        <span className="text-sm text-amber-600 dark:text-amber-500">
                                            ({doctor.reviewsCount || 0} reviews)
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 mb-6">
                                    {doctor.location && (
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                            <MapPin className="w-4 h-4" />
                                            <span>{doctor.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <Clock className="w-4 h-4" />
                                        <span>${doctor.rate}/hr</span>
                                    </div>
                                    {doctor.available && (
                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span>Available</span>
                                        </div>
                                    )}
                                </div>

                                <Button variant="primary" className="px-8 py-3">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Book Appointment
                                </Button>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    <GlassCard className="p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-teal-600" />
                            About
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {doctor.about || doctor.bio || 'No information available.'}
                        </p>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-teal-600" />
                            Specializations
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {doctor.tags && doctor.tags.length > 0 ? (
                                doctor.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <span className="px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm">
                                    {doctor.specialty}
                                </span>
                            )}
                        </div>
                    </GlassCard>
                </div>

                {doctor.articleName && doctor.article && (
                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold mb-2">{doctor.articleName}</h2>
                        {doctor.articleDate && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                Published: {new Date(doctor.articleDate).toLocaleDateString()}
                            </p>
                        )}
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {doctor.article}
                            </p>
                        </div>
                    </GlassCard>
                )}
            </div>
        </div>
    );
}
