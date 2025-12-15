'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Button } from '@/components/ui/Button';

import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10" />;
    }

    return (
        <Button
            variant="ghost"
            onClick={toggleTheme}
            className="p-2 rounded-full w-10 h-10 flex items-center justify-center transition-transform active:scale-95"
            aria-label="Toggle Theme"
        >
            {theme === 'light' ?
                <Moon className="w-5 h-5 text-slate-900" /> :
                <Sun className="w-5 h-5 text-amber-500" />
            }
        </Button>
    );
}
