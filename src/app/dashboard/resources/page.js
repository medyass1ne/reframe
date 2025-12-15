import ResourcePortal from '@/components/features/ResourcePortal';

export default function ResourcesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Resource Library</h1>
            <p className="text-slate-500 dark:text-slate-400">Curated tools and guides for your mental wellness journey.</p>
            <ResourcePortal />
        </div>
    );
}
