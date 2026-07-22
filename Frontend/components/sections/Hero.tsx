import StatCounter from "@/components/StatCounter";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center px-[5vw] pt-20"
    >
      <div className="grid md:grid-cols-[1.3fr_0.9fr] gap-10 items-center">
        <div>
          <div className="font-mono text-base tracking-[0.18em] text-blue-100 uppercase mb-4 flex items-center gap-2 before:content-[''] before:w-5 before:h-px before:bg-brand">
            -Training &amp; Placement Ops
          </div>
          <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.04] tracking-tight max-w-[15ch]">
            Your placement cell, at mission control.
          </h1>
          <p className="text-blue-50 max-w-[46ch] mt-6 leading-relaxed text-sm">
            Every recruiter, every reply, every follow-up you owe someone — in
            one dashboard instead of nineteen browser tabs and a shared
            spreadsheet nobody trusts.
          </p>
          <div className="flex gap-4 flex-wrap mt-9">
            <Link
              href="/login"
              className="inline-block font-semibold text-lg px-6 py-3.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <a
              href="#pipeline"
              className="font-semibold text-sm px-6 py-3.5 rounded-lg border border-border hover:border-white transition-colors"
            >
              See the pipeline ↓
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          <StatCounter label="Active companies" target={214} />
          <StatCounter label="Response rate" target={38} suffix="%" />
          <StatCounter label="Follow-ups pending" target={27} live />
        </div>
      </div>
    </section>
  );
}
