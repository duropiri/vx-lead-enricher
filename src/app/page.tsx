// src/app/page.js
import LeadEnricher from "./components/LeadEnricher";

export default function Home() {
  return (
    <main
      style={{ padding: "20px" }}
      className="size-full h-[100dvh] max-w-[100dvw] flex flex-col items-center justify-between "
    >
      <h1 style={{ color: "#C5A05E" }}>Lead Enricher Tool</h1>
      <div className="w-full h-[95%]">
        <LeadEnricher />
      </div>
    </main>
  );
}
