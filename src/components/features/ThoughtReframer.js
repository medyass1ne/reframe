'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Sparkles, Brain, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import { requestLlama } from '@/lib/ai';
import { fadeInUp, scaleIn } from '@/lib/animations';

export default function ThoughtReframer() {
    const [thought, setThought] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);

    const handleReframe = async () => {
        if (!thought.trim()) return;

        setIsProcessing(true);
        setResult(null);

        try {
            const prompt = `You are an expert cognitive behavioral therapist helping someone reframe negative thoughts. 

The user shared: "${thought}"

Provide a comprehensive response in this EXACT JSON format (no markdown, no code blocks):
{
  "reframed": "A balanced, compassionate reframe of their thought (3-4 sentences)",
  "distortion": "The specific cognitive distortion identified (e.g., All-or-Nothing Thinking, Catastrophizing, etc.)",
  "explanation": "Brief explanation of why this is that distortion (2 sentences)",
  "actionSteps": [
    "Specific action step 1",
    "Specific action step 2",
    "Specific action step 3"
  ],
  "affirmation": "A powerful, personalized affirmation they can use"
}

Be warm, specific, and actionable. Focus on practical steps they can take today.`;

            const aiResponse = await requestLlama(prompt);
            let aiData;

            try {
                const cleanContent = aiResponse.content
                    .replace(/```json/g, '')
                    .replace(/```/g, '')
                    .trim();
                aiData = JSON.parse(cleanContent);
            } catch (e) {
                aiData = {
                    reframed: aiResponse.content,
                    distortion: "Negative Thinking Pattern",
                    explanation: "This thought pattern may be limiting your perspective.",
                    actionSteps: [
                        "Practice self-compassion",
                        "Challenge this thought when it arises",
                        "Seek support from others"
                    ],
                    affirmation: "I am capable of changing my thought patterns."
                };
            }

            setResult({
                original: thought,
                ...aiData
            });

            await fetch('/api/thoughts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    originalThought: thought,
                    reframedThought: aiData.reframed,
                    emotion: 'Processing',
                    cognitiveDistortion: aiData.distortion
                })
            });
        } catch (error) {
            console.error('Failed to process thought', error);
            alert("Sorry, I couldn't connect to the AI right now. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setThought('');
        setResult(null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
                className="text-center"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mb-4">
                    <Brain className="w-4 h-4" />
                    <span className="text-sm font-medium">AI-Powered Cognitive Reframing</span>
                </div>
                <h1 className="text-4xl font-bold mb-3">Transform Your Thoughts</h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                    Share a negative thought and receive personalized insights, action steps, and support
                </p>
            </motion.div>

            <AnimatePresence mode="wait">
                {!result ? (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <GlassCard className="p-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">
                                        What negative thought is bothering you?
                                    </label>
                                    <textarea
                                        value={thought}
                                        onChange={(e) => setThought(e.target.value)}
                                        placeholder="Example: I'm not good enough and everyone will see that I'm a failure..."
                                        className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none text-lg"
                                        rows={5}
                                        disabled={isProcessing}
                                    />
                                    <p className="text-sm text-slate-500 mt-2">
                                        Be as specific as possible. The more detail you provide, the better the guidance.
                                    </p>
                                </div>

                                <Button
                                    onClick={handleReframe}
                                    disabled={!thought.trim() || isProcessing}
                                    variant="primary"
                                    className="w-full py-4 text-lg font-semibold"
                                >
                                    {isProcessing ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Sparkles className="w-5 h-5" />
                                            </motion.div>
                                            AI is analyzing your thought...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Brain className="w-5 h-5" />
                                            Reframe This Thought
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Original Thought */}
                        <GlassCard className="p-6 bg-slate-50 dark:bg-slate-900/50">
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Your Original Thought:</p>
                            <p className="text-lg text-slate-700 dark:text-slate-300 italic">"{result.original}"</p>
                        </GlassCard>

                        {/* Reframed Thought */}
                        <motion.div variants={scaleIn}>
                            <GlassCard className="p-8 bg-gradient-to-br from-violet-50 to-teal-50 dark:from-violet-900/20 dark:to-teal-900/20 border-2 border-violet-200 dark:border-violet-800">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-violet-900 dark:text-violet-100 mb-3">
                                            Reframed Perspective
                                        </h3>
                                        <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
                                            {result.reframed}
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* Cognitive Distortion */}
                        <GlassCard className="p-6">
                            <div className="flex items-start gap-3">
                                <Brain className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Cognitive Distortion Identified</h3>
                                    <p className="text-teal-600 dark:text-teal-400 font-semibold mb-2">{result.distortion}</p>
                                    <p className="text-slate-600 dark:text-slate-300">{result.explanation}</p>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Action Steps */}
                        <GlassCard className="p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                                <h3 className="font-bold text-lg">Action Steps You Can Take Today</h3>
                            </div>
                            <div className="space-y-3 ml-9">
                                {result.actionSteps.map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-slate-700 dark:text-slate-300">{step}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </GlassCard>

                        {/* Affirmation */}
                        <GlassCard className="p-6 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-2 border-teal-200 dark:border-teal-800">
                            <div className="text-center">
                                <p className="text-sm font-semibold text-teal-700 dark:text-teal-300 mb-2">Your Affirmation</p>
                                <p className="text-xl font-bold text-teal-900 dark:text-teal-100">
                                    "{result.affirmation}"
                                </p>
                            </div>
                        </GlassCard>

                        {/* Reset Button */}
                        <div className="flex justify-center pt-4">
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="px-8 py-3"
                            >
                                <span className="flex items-center gap-2">
                                    Reframe Another Thought <ArrowRight className="w-4 h-4" />
                                </span>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
