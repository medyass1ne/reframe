export function Footer() {
    return (
        <footer className="py-12 mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                <p>© {new Date().getFullYear()} Reframe Platform. All rights reserved.</p>
                <div className="mt-4 flex justify-center gap-6">
                    <a href="#" className="hover:text-teal-500 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-teal-500 transition-colors">Terms</a>
                    <a href="#" className="hover:text-teal-500 transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
}
