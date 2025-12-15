'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

const QUICK_ACTIONS = [
    { id: 'sign-up', label: 'How to sign up?' },
    { id: 'thought-reframer', label: 'What is Thought Reframer?' },
    { id: 'find-doctor', label: 'Find a doctor' },
    { id: 'features', label: 'Available features' }
];

const QUICK_RESPONSES = {
    'sign-up': 'Click the "Start Your Journey" button on the homepage or navigate to the Register page. Fill in your name, email, and password to create your account!',
    'thought-reframer': 'The Thought Reframer is an AI-powered tool that helps you identify negative thinking patterns and reframe them into more balanced, constructive thoughts. It\'s available in your dashboard!',
    'find-doctor': 'Visit the "Find Specialists" page from the navigation menu. You can browse available doctors, view their specialties, and see their availability.',
    'features': 'Reframe offers: Thought Reframer (AI-powered cognitive reframing), Decision Simulator (scenario role-playing), Mood Tracker, and access to mental health professionals.'
};

export function HelpChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: 'Hi! 👋 I\'m your AI assistant. Ask me anything about Reframe, or use the quick actions below!'
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleQuickAction = (actionId) => {
        const response = QUICK_RESPONSES[actionId];
        const question = QUICK_ACTIONS.find(a => a.id === actionId)?.label;

        if (response && question) {
            setMessages(prev => [
                ...prev,
                { type: 'user', text: question },
                { type: 'bot', text: response }
            ]);
        }
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() || isTyping) return;

        const userMessage = inputText.trim();
        setInputText('');

        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setIsTyping(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();

            if (data.success) {
                setMessages(prev => [...prev, { type: 'bot', text: data.answer }]);
            } else {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: 'Sorry, I had trouble with that. Try using the quick actions above or rephrase your question!'
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                type: 'bot',
                text: 'Oops! Something went wrong. Please try again or use the quick action buttons.'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleReset = () => {
        setMessages([
            {
                type: 'bot',
                text: 'Hi! 👋 I\'m your AI assistant. Ask me anything about Reframe, or use the quick actions below!'
            }
        ]);
        setInputText('');
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-teal-500 to-violet-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="message"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCircle className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
                    >
                        <GlassCard className="p-0 overflow-hidden shadow-2xl">
                            <div className="bg-gradient-to-r from-teal-500 to-violet-500 p-4 text-white">
                                <h3 className="font-semibold text-lg">AI Help Assistant</h3>
                                <p className="text-sm text-white/80">Ask me anything about Reframe</p>
                            </div>

                            <div className="h-96 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.type === 'user'
                                                    ? 'bg-gradient-to-r from-teal-500 to-violet-500 text-white'
                                                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                                                    }`}
                                            >
                                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex justify-start"
                                        >
                                            <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2.5 shadow-sm">
                                                <div className="flex gap-1">
                                                    <motion.div
                                                        className="w-2 h-2 bg-slate-400 rounded-full"
                                                        animate={{ y: [0, -8, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                    />
                                                    <motion.div
                                                        className="w-2 h-2 bg-slate-400 rounded-full"
                                                        animate={{ y: [0, -8, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                    />
                                                    <motion.div
                                                        className="w-2 h-2 bg-slate-400 rounded-full"
                                                        animate={{ y: [0, -8, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_ACTIONS.map((action) => (
                                        <motion.button
                                            key={action.id}
                                            onClick={() => handleQuickAction(action.id)}
                                            disabled={isTyping}
                                            className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {action.label}
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your question..."
                                        disabled={isTyping}
                                        className="flex-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm disabled:opacity-50"
                                    />
                                    <motion.button
                                        onClick={handleSendMessage}
                                        disabled={!inputText.trim() || isTyping}
                                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Send className="w-4 h-4" />
                                    </motion.button>
                                </div>

                                <button
                                    onClick={handleReset}
                                    className="w-full text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                                >
                                    Start new conversation
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
