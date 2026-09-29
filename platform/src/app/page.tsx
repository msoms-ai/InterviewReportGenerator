import Wizard from "@/components/Wizard";

export default function Home() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">New Interview Report</h1>
        <p className="text-slate-500 mt-2">Complete the steps below to generate the standardized evaluation document.</p>
      </div>
      <Wizard />
    </div>
  );
}
