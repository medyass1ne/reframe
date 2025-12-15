'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GlassCard } from '@/components/ui/GlassCard';
import { Loader2, ArrowRight, Brain, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: credentials, 2: problem, 3: quiz, 4: results
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'patient'
    });
    const [problemDescription, setProblemDescription] = useState('');
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [analysisResults, setAnalysisResults] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStep1Submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setUserId(data.userId);
                setStep(2);
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStep2Submit = async (e) => {
        e.preventDefault();
        if (!problemDescription.trim()) {
            setError('Please describe your concern');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/onboarding/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problemDescription,
                    userId
                }),
            });

            const data = await res.json();

            if (data.success) {
                setQuizQuestions(data.questions);
                setStep(3);
            } else {
                setError(data.error || 'Failed to generate quiz');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuizSubmit = async (e) => {
        e.preventDefault();

        // Check all questions are answered
        if (Object.keys(quizAnswers).length !== quizQuestions.length) {
            setError('Please answer all questions');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/onboarding/analyze-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    problemDescription,
                    quizAnswers: quizQuestions.map((q, idx) => ({
                        question: q,
                        answer: quizAnswers[idx]
                    }))
                }),
            });

            const data = await res.json();

            if (data.success) {
                setAnalysisResults(data.analysis);
                setStep(4);
            } else {
                setError(data.error || 'Failed to analyze quiz');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (index, value) => {
        setQuizAnswers({ ...quizAnswers, [index]: value });
    };

    const handleFinish = () => {
        router.push('/login?onboarding=complete');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6  from-teal-50 via-white to-violet-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            <div className="w-full max-w-2xl">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${s < step ? 'bg-teal-500 text-white' :
                                    s === step ? 'bg-teal-500 text-white' :
                                        'bg-slate-200 dark:bg-slate-700 text-slate-400'
                                    }`}>
                                    {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                                </div>
                                {s < 4 && (
                                    <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <span className="text-center">Account</span>
                        <span className="text-center">Problem</span>
                        <span className="text-center">Quiz</span>
                        <span className="text-center">Results</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Credentials */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <GlassCard className="p-8">
                                <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
                                <p className="text-slate-600 dark:text-slate-300 mb-6">
                                    Start your journey to better mental wellness
                                </p>

                                <form onSubmit={handleStep1Submit} className="space-y-4">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full name:</label>
                                    <Input
                                        label="Full Name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        autoComplete="password"
                                    />
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email address:</label>
                                    <Input
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        autoComplete="password"
                                    />
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password:</label>
                                    <Input
                                        label="Password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        autoComplete="password"
                                    />

                                    {error && (
                                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <Button type="submit" disabled={loading} variant="primary" className="w-full">
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Creating Account...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                Continue <ArrowRight className="w-4 h-4" />
                                            </span>
                                        )}
                                    </Button>

                                    <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                                        Already have an account?{' '}
                                        <Link href="/login" className="text-teal-600 dark:text-teal-400 hover:underline">
                                            Log in
                                        </Link>
                                    </p>
                                </form>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* Step 2: Problem Description */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <GlassCard className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-violet-500 flex items-center justify-center">
                                        <Brain className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">Tell Us About Your Concern</h1>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                            This helps us personalize your experience
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleStep2Submit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">
                                            What brings you to Reframe today?
                                        </label>
                                        <textarea
                                            value={problemDescription}
                                            onChange={(e) => setProblemDescription(e.target.value)}
                                            placeholder="Example: I've been feeling anxious about work and having trouble sleeping..."
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-slate-900 dark:text-slate-100"
                                            rows={6}
                                            required
                                        />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                            Be as detailed as you'd like. This information is private and secure.
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <Button type="submit" disabled={loading} variant="primary" className="w-full">
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Generating Personalized Quiz...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                Continue to Quiz <ArrowRight className="w-4 h-4" />
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* Step 3: Quiz */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <GlassCard className="p-8">
                                <h1 className="text-2xl font-bold mb-2">Personalized Assessment</h1>
                                <p className="text-slate-600 dark:text-slate-300 mb-6">
                                    Answer these questions to help us understand you better
                                </p>

                                <form onSubmit={handleQuizSubmit} className="space-y-6">
                                    {quizQuestions.map((question, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                                            <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-200">
                                                {index + 1}. {question}
                                            </label>
                                            <textarea
                                                value={quizAnswers[index] || ''}
                                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                                placeholder="Your answer..."
                                                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-slate-900 dark:text-slate-100"
                                                rows={3}
                                                required
                                            />
                                        </div>
                                    ))}

                                    {error && (
                                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <Button type="submit" disabled={loading} variant="primary" className="w-full">
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Analyzing Your Responses...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                Submit Quiz <ArrowRight className="w-4 h-4" />
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* Step 4: Results */}
                    {step === 4 && analysisResults && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <GlassCard className="p-8 space-y-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-teal-500 to-violet-500 flex items-center justify-center">
                                        <CheckCircle2 className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold mb-2">Your Personalized Analysis</h1>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        Based on your responses, here's what we found
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-6 rounded-xl bg-gradient-to-br from-violet-50 to-teal-50 dark:from-violet-900/20 dark:to-teal-900/20 border border-violet-200 dark:border-violet-800">
                                        <h3 className="font-bold text-lg mb-2">Mood Assessment</h3>
                                        <p className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                                            {analysisResults.moodAssessment}
                                        </p>
                                        <p className="text-slate-700 dark:text-slate-300">
                                            {analysisResults.concerns}
                                        </p>
                                    </div>

                                    <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900">
                                        <h3 className="font-bold text-lg mb-3">Personality Insights</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResults.personalityTraits.map((trait, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium"
                                                >
                                                    {trait}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {analysisResults.recommendedDoctor && (
                                        <div className="p-6 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-2 border-teal-200 dark:border-teal-800">
                                            <h3 className="font-bold text-lg mb-3">Recommended Specialist</h3>
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                                                    <Brain className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-lg">{analysisResults.recommendedDoctor.name}</p>
                                                    <p className="text-teal-600 dark:text-teal-400 font-semibold">
                                                        {analysisResults.recommendedDoctor.specialty}
                                                    </p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                                                        Based on your assessment, we recommend connecting with this specialist.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Button onClick={handleFinish} variant="primary" className="w-full">
                                    Complete Setup & Log In
                                </Button>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
