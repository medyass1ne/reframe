'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Search, MapPin, Star } from 'lucide-react';

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await fetch('/api/doctors');
                const data = await res.json();
                if (data.success) {
                    setDoctors(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch doctors', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(doc =>
        doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-500 to-violet-500 bg-clip-text text-transparent">
                        Find Your Specialist
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                        Connect with licensed professionals who truly understand your journey.
                    </p>

                    <div className="relative max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Search by name, specialty, or condition..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 backdrop-blur-sm text-slate-900 dark:text-slate-100"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading specialists...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map((doc) => (
                            <Link key={doc._id} href={`/doctors/${doc._id}`}>
                                <GlassCard className="p-6 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-violet-500 flex items-center justify-center text-2xl font-bold text-white">
                                            {doc.name?.charAt(0) || 'D'}
                                        </div>
                                        <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-lg">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                                                {doc.rating?.toFixed(1) || '4.5'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{doc.name}</h3>
                                        <p className="text-teal-600 dark:text-teal-400 font-medium">{doc.specialty}</p>
                                    </div>

                                    <div className="space-y-3 mb-6 flex-grow">
                                        {doc.location && (
                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                <MapPin className="w-4 h-4" />
                                                <span>{doc.location}</span>
                                            </div>
                                        )}
                                        {doc.bio && (
                                            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                                                {doc.bio}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                        <div className="text-sm">
                                            <span className="block font-bold text-slate-900 dark:text-white">${doc.rate}/hr</span>
                                            <span className="text-slate-500 text-xs">per session</span>
                                        </div>
                                    </div>
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
