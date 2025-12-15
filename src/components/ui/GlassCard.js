'use client';

import { motion } from 'framer-motion';

export function GlassCard({ children, className = "", animate = true }) {
    if (!animate) {
        return (
            <div className={`glass-panel rounded-2xl p-6 ${className}`}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`glass-panel rounded-2xl p-6 ${className}`}
        >
            {children}
        </motion.div>
    );
}
