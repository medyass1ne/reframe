'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User as UserIcon, ShieldAlert } from 'lucide-react';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDoctorView, setIsDoctorView] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/user/profile');
                const data = await res.json();
                if (data.success) {
                    setUser(data.data);
                    if (data.data.role === 'doctor') {
                        setIsDoctorView(true);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            const data = await res.json();
            if (data.success) {
                alert('Profile updated successfully');
            } else {
                alert('Failed to update: ' + data.error);
            }
        } catch (error) {
            alert('Error updating profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (!user) return <div>User not found</div>;

    const isUserDoctor = user.role === 'doctor';

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
                {isUserDoctor && (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">View as:</span>
                        <button
                            onClick={() => setIsDoctorView(!isDoctorView)}
                            className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded hover:bg-slate-300 transition-colors"
                        >
                            {isDoctorView ? 'Doctor' : 'Patient'}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid gap-8">
                <GlassCard className="p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-4xl overflow-hidden shrink-0">
                            <UserIcon className="w-12 h-12 text-slate-400" />
                        </div>
                        <div className="flex-1 w-full space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Display Name</label>
                                    <Input name="name" value={user.name || ''} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                                    <Input value={user.email || ''} readOnly disabled className="opacity-70 bg-slate-100" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio / Description</label>
                                <textarea
                                    name="bio"
                                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 min-h-[120px]"
                                    placeholder="Tell us about yourself..."
                                    value={user.bio || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            {isDoctorView && (
                                <div className="p-6 rounded-2xl bg-teal-500/5 border border-teal-500/20 space-y-6">
                                    <h3 className="font-semibold text-teal-800 dark:text-teal-200 flex items-center gap-2">
                                        <ShieldAlert className="w-5 h-5 text-teal-600" /> Doctor Specific Settings
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hourly Rate ($)</label>
                                            <Input type="number" name="rate" value={user.rate || ''} onChange={handleChange} placeholder="0.00" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Session Limit (min)</label>
                                            <select className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50">
                                                <option>30 minutes</option>
                                                <option>45 minutes</option>
                                                <option>60 minutes</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Specialization</label>
                                        <Input name="specialization" value={user.specialization || ''} onChange={handleChange} placeholder="e.g. Clinical Psychologist" />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
