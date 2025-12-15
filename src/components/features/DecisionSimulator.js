'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { requestLlama } from '@/lib/ai';
import { Loader2, Brain, TrendingUp, AlertCircle, Sparkles, RotateCcw } from 'lucide-react';
import { fadeInUp, scaleIn } from '@/lib/animations';

export default function DecisionSimulator() {
    const [scenario, setScenario] = useState(null);
    const [choices, setChoices] = useState([]);
    const [outcomes, setOutcomes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        generateInitialScenario();
    }, []);

    const generateInitialScenario = async () => {
        setInitializing(true);
        try {
            const prompt = `Generate a realistic mental health decision scenario for a decision simulator. 

Return ONLY a JSON object (no markdown):
{
  "scenario": "A brief scenario description (max 30 words)",
  "choices": ["Choice 1 (max 15 words)", "Choice 2 (max 15 words)", "Choice 3 (max 15 words)"]
}

The scenario should relate to common stressors like work, relationships, self-care, or social situations.`;

            const aiResponse = await requestLlama(prompt);
            const cleanContent = aiResponse.content.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(cleanContent);

            setScenario(data.scenario);
            setChoices(data.choices);
        } catch (error) {
            console.error('Failed to generate scenario:', error);
            setScenario("You have an important deadline tomorrow but feel overwhelmed and haven't started yet. A friend invites you to dinner.");
            setChoices([
                "Go to dinner to relax and clear your mind",
                "Decline politely and work all night",
                "Join for a quick meal, then work for 2 hours"
            ]);
        } finally {
            setInitializing(false);
        }
    };

    const handleChoice = async (choiceText, choiceIndex) => {
        setLoading(true);

        const choiceHistory = outcomes.map((o, i) => `Choice ${i + 1}: ${o.choice} → ${o.outcome}`).join('\n');

        const prompt = `You are a mental health decision simulator. The user made this choice: "${choiceText}"

Previous choices:
${choiceHistory || 'None'}

Generate a realistic outcome (max 30 words) showing consequences on their mental well-being, stress, or productivity.

Return ONLY a JSON object (no markdown):
{
  "outcome": "Brief outcome description (max 30 words)",
  "nextChoices": ["Choice 1 (max 15 words)", "Choice 2 (max 15 words)", "Choice 3 (max 15 words)"]
}`;

        try {
            const aiResponse = await requestLlama(prompt);
            const cleanContent = aiResponse.content.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(cleanContent);

            const newOutcome = {
                choice: choiceText,
                outcome: data.outcome
            };

            const newOutcomes = [...outcomes, newOutcome];
            setOutcomes(newOutcomes);
            setScenario(data.outcome); // Update the current scenario with the outcome
            setChoices(data.nextChoices);

            if (newOutcomes.length === 5) {
                await generateAnalysis(newOutcomes);
            }
        } catch (error) {
            console.error('Failed to generate outcome:', error);
            const fallbackOutcome = {
                choice: choiceText,
                outcome: "Your decision leads to mixed results. You learn something valuable about yourself."
            };
            const newOutcomes = [...outcomes, fallbackOutcome];
            setOutcomes(newOutcomes);
            setScenario(fallbackOutcome.outcome);
        } finally {
            setLoading(false);
        }
    };

    const generateAnalysis = async (allOutcomes) => {
        setLoading(true);
        try {
            const choicesText = allOutcomes.map((o, i) =>
                `${i + 1}. Choice: ${o.choice}\n   Outcome: ${o.outcome}`
            ).join('\n\n');

            const prompt = `You are a compassionate psychologist analyzing someone's decision-making patterns.

Their 5 decisions:
${choicesText}

Provide a deep psychological analysis. Return ONLY valid JSON (no markdown, no code blocks):
{
  "mood": "One word mood (e.g., Anxious, Stressed, Balanced, Avoidant, Overwhelmed)",
  "patterns": "Key behavioral patterns observed in 3-4 sentences",
  "strengths": "Positive aspects of their decision-making in 2-3 sentences",
  "concerns": "Areas for growth or concern in 2-3 sentences",
  "recommendation": "Actionable advice for healthier decision-making in 2-3 sentences"
}

Be warm, specific, and insightful.`;

            const aiResponse = await requestLlama(prompt);

            // Clean and parse the response
            let cleanContent = aiResponse.content.trim();

            // Remove markdown code blocks if present
            cleanContent = cleanContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');

            // Try to find JSON object in the response
            const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                cleanContent = jsonMatch[0];
            }

            console.log('Cleaned AI response:', cleanContent);

            const analysisData = JSON.parse(cleanContent);

            // Validate that we have all required fields
            if (!analysisData.mood || !analysisData.patterns || !analysisData.strengths ||
                !analysisData.concerns || !analysisData.recommendation) {
                throw new Error('Missing required fields in analysis');
            }

            setAnalysis(analysisData);
            setShowAnalysis(true);
        } catch (error) {
            console.error('Failed to generate analysis:', error);

            // Provide a meaningful fallback based on the choices
            const hasStressChoices = allOutcomes.some(o =>
                o.choice.toLowerCase().includes('work') ||
                o.choice.toLowerCase().includes('deadline')
            );

            setAnalysis({
                mood: hasStressChoices ? "Stressed" : "Uncertain",
                patterns: "Your decisions show a pattern of responding to immediate pressures. You tend to make choices based on what feels urgent rather than what aligns with your long-term well-being. This is common when feeling overwhelmed.",
                strengths: "You're actively engaging with difficult decisions and seeking to understand their consequences. This self-awareness is a crucial first step toward making more intentional choices.",
                concerns: "There may be a tendency to prioritize external demands over your own needs. Consider whether you're making choices that truly serve your mental health and personal values.",
                recommendation: "Practice the 'pause and reflect' technique: Before making decisions, take three deep breaths and ask yourself, 'Does this choice align with my values and well-being?' This simple pause can lead to more balanced decision-making."
            });
            setShowAnalysis(true);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setOutcomes([]);
        setShowAnalysis(false);
        setAnalysis(null);
        generateInitialScenario();
    };

    if (initializing) {
        return (
            <div className="max-w-4xl mx-auto">
                <GlassCard className="p-12 text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-4"
                    >
                        <Sparkles className="w-12 h-12 text-teal-600 dark:text-teal-400" />
                    </motion.div>
                    <p className="text-lg text-slate-600 dark:text-slate-300">Generating your scenario...</p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
                className="text-center"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mb-4">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">AI-Powered Decision Simulator</span>
                </div>
                <h1 className="text-4xl font-bold mb-3">Explore Your Choices</h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                    See how your decisions impact your mental well-being
                </p>
            </motion.div>

            <AnimatePresence mode="wait">
                {!showAnalysis ? (
                    <motion.div
                        key="simulator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        {/* Progress */}
                        <GlassCard className="p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Decisions Made: {outcomes.length}/5
                                </span>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-12 h-2 rounded-full ${i < outcomes.length
                                                ? 'bg-gradient-to-r from-teal-500 to-violet-500'
                                                : 'bg-slate-200 dark:bg-slate-700'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </GlassCard>

                        {/* Current Scenario */}
                        <GlassCard className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-3">Current Situation</h3>
                                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {scenario}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
                                    What do you do?
                                </p>
                                {choices.map((choice, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            onClick={() => handleChoice(choice, idx)}
                                            disabled={loading}
                                            variant="outline"
                                            className="w-full text-left justify-start py-4 px-6"
                                        >
                                            {choice}
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>

                            {loading && (
                                <div className="mt-6 flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm">Generating outcome...</span>
                                </div>
                            )}
                        </GlassCard>

                        {/* Outcomes History */}
                        {outcomes.length > 0 && (
                            <GlassCard className="p-6">
                                <h3 className="font-bold text-lg mb-4">Your Journey So Far</h3>
                                <div className="space-y-4">
                                    {outcomes.map((outcome, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="border-l-4 border-teal-500 pl-4 py-2"
                                        >
                                            <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-1">
                                                Choice {idx + 1}: {outcome.choice}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                                {outcome.outcome}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </GlassCard>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="analysis"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <GlassCard className="p-8 bg-gradient-to-br from-violet-50 to-teal-50 dark:from-violet-900/20 dark:to-teal-900/20 border-2 border-violet-200 dark:border-violet-800">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-teal-500 flex items-center justify-center">
                                    <Brain className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Psychological Analysis</h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">Based on your 5 decisions</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                        <span className="text-violet-600 dark:text-violet-400">Overall Mood Assessment</span>
                                    </h3>
                                    <p className="text-2xl font-bold text-violet-700 dark:text-violet-300">{analysis.mood}</p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-2">Behavioral Patterns</h3>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{analysis.patterns}</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                        <h3 className="font-bold mb-2 text-green-700 dark:text-green-300">Strengths</h3>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{analysis.strengths}</p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                        <h3 className="font-bold mb-2 text-amber-700 dark:text-amber-300">Areas for Growth</h3>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{analysis.concerns}</p>
                                    </div>
                                </div>

                                <div className="p-6 rounded-xl bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-200 dark:border-teal-800">
                                    <h3 className="font-bold text-lg mb-2 text-teal-700 dark:text-teal-300">Recommendation</h3>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{analysis.recommendation}</p>
                                </div>
                            </div>
                        </GlassCard>

                        <div className="flex justify-center">
                            <Button
                                onClick={handleReset}
                                variant="primary"
                                className="px-8 py-3"
                            >
                                <span className="flex items-center gap-2">
                                    <RotateCcw className="w-4 h-4" />
                                    Start New Simulation
                                </span>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
