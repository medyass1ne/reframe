'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { motion } from 'framer-motion';
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Brain, Signpost, BookOpen, Stethoscope, ArrowRight, Sparkles, CheckCircle, Users, Shield, Zap } from 'lucide-react';
import { HelpChatbot } from '@/components/features/HelpChatbot';
import { fadeInUp, staggerContainer, staggerItem, scaleIn } from '@/lib/animations';

const doctors = [
  { name: "Dr. Sarah Chen", specialty: "Anxiety Specialist", price: "$120/hr", available: true },
  { name: "Dr. James Wilson", specialty: "Trauma Therapist", price: "$150/hr", available: false },
  { name: "Dr. Emily Davis", specialty: "Clinical Psychologist", price: "$140/hr", available: true },
];

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Reframing',
    description: 'Transform negative thought patterns into balanced perspectives using advanced AI',
    color: 'violet'
  },
  {
    icon: Signpost,
    title: 'Decision Simulator',
    description: 'Explore different scenarios and outcomes before making important choices',
    color: 'teal'
  },
  {
    icon: BookOpen,
    title: 'Mood Tracking',
    description: 'Monitor your emotional well-being and identify patterns over time',
    color: 'blue'
  }
];

const benefits = [
  { icon: CheckCircle, text: 'Evidence-based cognitive techniques' },
  { icon: Users, text: 'Connect with licensed professionals' },
  { icon: Shield, text: 'Private and secure platform' },
  { icon: Zap, text: 'Instant AI-powered insights' }
];

export default function Home() {
  const [demoThought, setDemoThought] = useState('');
  const [demoResult, setDemoResult] = useState('');
  const [isReframing, setIsReframing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  const handleDemoReframe = async () => {
    if (!demoThought.trim()) return;

    setIsReframing(true);

    try {
      const response = await fetch('/api/reframe-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thought: demoThought })
      });

      const data = await response.json();

      if (data.success) {
        setDemoResult(data.reframed);
      } else {
        setDemoResult("I can help you reframe that thought. Sign up to get personalized insights!");
      }
    } catch (error) {
      setDemoResult("Something went wrong. Please try again or sign up for full access.");
    } finally {
      setIsReframing(false);
    }
  };

  return (
    <div className="min-h-screen from-teal-50 via-white to-violet-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-24 px-6 text-center overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-teal-400/30 via-emerald-400/20 to-violet-400/30 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-l from-violet-400/20 to-transparent blur-[100px] rounded-full -z-10" />

        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 mb-6"
          variants={scaleIn}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">AI-Powered Mental Wellness Platform</span>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          variants={fadeInUp}
        >
          Transform Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-emerald-500 to-violet-500">
            Mindset
          </span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          variants={fadeInUp}
        >
          Break free from negative thinking patterns. Connect with professionals.
          Build lasting mental wellness with AI-powered tools designed for real change.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          variants={fadeInUp}
        >
          <Link href={isLoggedIn ? "/dashboard" : "/register"}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="primary" className="px-10 py-4 text-lg shadow-2xl shadow-teal-500/30">
                {isLoggedIn ? "Go to Dashboard" : "Start Free Today"}
              </Button>
            </motion.div>
          </Link>
          <Link href="#demo">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="px-10 py-4 text-lg">
                Try Demo
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Benefits */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto"
          variants={staggerContainer}
        >
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50"
            >
              <benefit.icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{benefit.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-24 px-6 max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to Thrive
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Powerful tools backed by cognitive behavioral therapy and modern AI
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={staggerItem}>
              <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <GlassCard className="p-8 text-center h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                  <motion.div
                    className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-50 dark:from-${feature.color}-900/30 dark:to-${feature.color}-800/20 rounded-3xl flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                  >
                    <feature.icon className={`w-10 h-10 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Demo Section */}
      <motion.section
        id="demo"
        className="py-24 px-6 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-teal-100 dark:from-violet-900/30 dark:to-teal-900/30 text-violet-700 dark:text-violet-300 mb-6"
            variants={scaleIn}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-semibold">Try it now - No signup required</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Experience AI-Powered Reframing</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">See how our AI transforms negative thoughts into balanced perspectives</p>
        </div>

        <GlassCard className="p-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">
                Share a negative thought or worry:
              </label>
              <textarea
                value={demoThought}
                onChange={(e) => setDemoThought(e.target.value)}
                placeholder="Example: I always mess everything up and nothing ever goes right for me..."
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-lg transition-all"
                rows={4}
              />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleDemoReframe}
                disabled={!demoThought.trim() || isReframing}
                variant="primary"
                className="w-full py-4 text-lg font-semibold shadow-xl shadow-teal-500/30"
              >
                {isReframing ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    AI is thinking...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Brain className="w-5 h-5" />
                    Reframe This Thought
                  </span>
                )}
              </Button>
            </motion.div>

            {demoResult && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-teal-50 via-emerald-50 to-violet-50 dark:from-teal-900/20 dark:via-emerald-900/20 dark:to-violet-900/20 border-2 border-teal-200 dark:border-teal-800 shadow-lg"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-teal-900 dark:text-teal-100 mb-2">Reframed Perspective</p>
                    <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed">{demoResult}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="text-center pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Want detailed insights, action steps, and personalized guidance?
              </p>
              <Link href={isLoggedIn ? "/dashboard/reframer" : "/register"}>
                <motion.span
                  className="inline-flex items-center gap-2 text-lg font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  {isLoggedIn ? "Go to Thought Reframer" : "Sign up for full access"} <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Link>
            </div>
          </div>
        </GlassCard>
      </motion.section>

      {/* Doctors Section */}
      <motion.section
        className="py-24 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Connect with Licensed Professionals
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Get personalized support from experienced mental health specialists
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            variants={staggerContainer}
          >
            {doctors.map((doc, idx) => (
              <motion.div key={idx} variants={staggerItem}>
                <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <GlassCard className="p-6 flex items-start gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-100 to-violet-100 dark:from-teal-900/30 dark:to-violet-900/30 flex items-center justify-center text-2xl shadow-lg">
                      <Stethoscope className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">{doc.name}</h4>
                      <p className="text-teal-600 dark:text-teal-400 text-sm font-semibold mb-1">{doc.specialty}</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">{doc.price}</p>
                      <div className="flex items-center gap-2">
                        <motion.span
                          className={`w-2.5 h-2.5 rounded-full ${doc.available ? 'bg-green-500' : 'bg-red-500'}`}
                          animate={{ scale: doc.available ? [1, 1.3, 1] : 1 }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {doc.available ? 'Available Now' : 'Booked'}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center"
            variants={fadeInUp}
          >
            <Link href="/doctors">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="primary" className="px-8 py-3 text-lg shadow-xl shadow-teal-500/20">
                  View All Professionals →
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-24 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-12 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-violet-500/10 backdrop-blur-xl border-2 border-teal-200 dark:border-teal-800">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Mental Wellness?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands who are already using Reframe to build healthier thought patterns and achieve lasting change.
            </p>
            <Link href={isLoggedIn ? "/dashboard" : "/register"}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="primary" className="px-12 py-4 text-xl font-semibold shadow-2xl shadow-teal-500/40">
                  {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
                </Button>
              </motion.div>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              No credit card required • Start in 30 seconds
            </p>
          </GlassCard>
        </div>
      </motion.section>

    </div>
  );
}
