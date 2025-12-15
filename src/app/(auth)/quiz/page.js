'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

const questions = [
    {
        id: 1,
        question: "How have you been feeling lately?",
        options: ["Great, full of energy", "Okay, just getting by", "Stressed and overwhelmed", "Down and unmotivated"]
    },
    {
        id: 2,
        question: "What is your main goal right now?",
        options: ["Reduce anxiety", "Improve sleep", "Find a therapist", "Just exploring"]
    },
    {
        id: 3,
        question: "How is your sleep quality?",
        options: ["I sleep well", "Trouble falling asleep", "I wake up tired", "Insomnia"]
    }
];

export default function QuizPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [finished, setFinished] = useState(false);

    const handleOptionClick = (option) => {
        setAnswers({ ...answers, [currentStep]: option });
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setFinished(true);
        }
    };

    if (finished) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <GlassCard className="max-w-xl w-full text-center py-12 px-8">
                    <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-teal-600" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">All Set!</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-8">
                        Thank you for sharing. We've personalized your dashboard based on your needs.
                    </p>
                    <Link href="/dashboard">
                        <Button variant="primary" className="text-lg px-8 py-3">Go to Dashboard</Button>
                    </Link>
                </GlassCard>
            </div>
        );
    }

    const progress = ((currentStep + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="mb-6 flex justify-between items-center text-sm font-medium text-slate-500">
                    <span>Question {currentStep + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}% Completed</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-teal-500 to-violet-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <GlassCard className="p-8 md:p-12 relative overflow-hidden transition-all duration-500">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center leading-tight">
                        {questions[currentStep].question}
                    </h2>

                    <div className="space-y-4">
                        {questions[currentStep].options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleOptionClick(option)}
                                className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-all duration-200 group flex items-center justify-between"
                            >
                                <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                                    {option}
                                </span>
                                <span className="w-5 h-5 rounded-full border border-slate-300 group-hover:border-teal-500 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </span>
                            </button>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
