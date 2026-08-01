export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] bg-brand-bg flex items-center justify-center">
            {/* Simple pulsing brand accent while the server fetches data */}
            <div className="w-8 h-8 rounded-full border-2 border-brand-accent border-t-transparent animate-spin" />
        </div>
    );
}
