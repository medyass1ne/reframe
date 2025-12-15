'use client';

import { motion } from 'framer-motion';

export function Button({ children, onClick, type = "button", variant = "primary", className = "", disabled = false }) {
    const baseStyles = "px-6 py-2.5 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "glass-button shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30",
        outline: "border-2 border-teal-500/30 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10",
        ghost: "text-slate-600 dark:text-slate-300 hover:bg-slate-500/10",
        glass: "glass-panel hover:bg-white/40 dark:hover:bg-slate-800/40 text-foreground"
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            transition={{ duration: 0.1 }}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
        >
            {children}
        </motion.button>
    );
}
