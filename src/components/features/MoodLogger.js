'use client';
import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { X, Smile, Meh, Frown } from 'lucide-react';

export default function MoodLogger({ isOpen, onClose, onLog }) {
    const [level, setLevel] = useState(3);
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level, note, scenarios: [] })
            });
            const data = await res.json();
            if (data.success) {
                onLog(data.data);
                onClose();
            }
        } catch (error) {
            alert('Failed to log mood');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <GlassCard className="w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">How are you feeling?</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between gap-2">
                        {[1, 2, 3, 4, 5].map((val) => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => setLevel(val)}
                                className={`flex-1 p-3 rounded-xl border transition-all ${level === val
                                        ? 'border-teal-500 bg-teal-500/10 ring-2 ring-teal-500/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <div className="text-2xl text-center mb-1">
                                    {val === 1 && '😫'}
                                    {val === 2 && '😕'}
                                    {val === 3 && '😐'}
                                    {val === 4 && '🙂'}
                                    {val === 5 && '😄'}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Note (Optional)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 min-h-[80px]"
                            placeholder="What's happening?"
                        />
                    </div>

                    <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging...' : 'Log Mood'}
                    </Button>
                </form>
            </GlassCard>
        </div>
    );
}
