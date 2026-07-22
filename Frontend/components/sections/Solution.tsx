export default function Solution() {
  return (
    <section id="solution" className="min-h-screen flex flex-col justify-center px-[5vw]">
      <div className="max-w-[640px]">
        <div className="font-mono text-xs tracking-[0.18em] text-brand-soft uppercase mb-4 flex items-center gap-2 before:content-[''] before:w-5 before:h-px before:bg-brand">
          The shift
        </div>
        <h2 className="font-display font-semibold text-4xl md:text-5xl leading-tight max-w-[16ch]">
          One record per company. Every recruiter attached to it.
        </h2>
        <p className="text-mute max-w-[46ch] mt-6 leading-relaxed">
          Companies, contacts, and conversations link automatically. Segment
          recruiters by industry or hiring history, fire a templated campaign,
          and watch replies land against the right deal — not a lost email
          thread.
        </p>
        <div className="flex gap-2.5 flex-wrap mt-7">
          {['Company records', 'Segmented lists', 'Template variables'].map((t) => (
            <span
              key={t}
              className="font-mono text-xs px-3 py-1.5 rounded-full border border-brand-dim text-brand-soft"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
