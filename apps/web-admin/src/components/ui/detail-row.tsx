export function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex justify-between py-2.5 border-b border-secondary/10 last:border-0">
            <span className="text-sm text-foreground/50">{label}</span>
            <span className="text-sm font-medium text-foreground text-right">{value}</span>
        </div>
    );
}