export default function Problem() {
  return (
    <section id="problem" className="min-h-screen flex flex-col justify-center px-[5vw]">
      <div className="max-w-[640px]">
        <div className="font-mono text-xs tracking-[0.18em] text-brand-soft uppercase mb-4 flex items-center gap-2 before:content-[''] before:w-5 before:h-px before:bg-brand">
          The problem
        </div>
        <h2 className="font-display font-semibold text-4xl md:text-5xl leading-tight max-w-[16ch]">
          Recruiter relationships live in seventeen different tabs.
        </h2>
        <p className="text-mute max-w-[46ch] mt-6 leading-relaxed">
          A spreadsheet for companies. A separate inbox thread for every recruiter.
          Follow-ups tracked in someone&apos;s head. By the time you notice a hot
          lead went cold, it&apos;s been three weeks.
        </p>
        <div className="flex gap-2.5 flex-wrap mt-7">
          {['Duplicated outreach', 'Missed follow-ups', 'No response data'].map((t) => (
            <span
              key={t}
              className="font-mono text-xs px-3 py-1.5 rounded-full border border-[rgba(120,145,190,0.4)] text-muted-state"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
