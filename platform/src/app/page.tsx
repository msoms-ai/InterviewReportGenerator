import Wizard from "@/components/Wizard";

export default function Home() {
  return (
    <div className="w-full max-w-5xl mx-auto py-6">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Interview Report Generator
        </h1>
        <p className="text-slate-500 mt-3 text-lg">
          Complete the guided steps below to dynamically generate a perfectly formatted corporate document.
        </p>
      </div>
      <Wizard />
    </div>
  );
}
