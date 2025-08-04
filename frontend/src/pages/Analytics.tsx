import { BottomNav } from "@/components/navigation/BottomNav";

export default function Analytics() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-white/80 mt-1">Detailed business insights</p>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 py-6">
        <p className="text-center text-muted-foreground">Advanced analytics coming soon...</p>
      </div>
      <BottomNav />
    </div>
  );
}