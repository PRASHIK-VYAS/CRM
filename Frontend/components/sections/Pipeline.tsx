const STAGES = [
  {
    num: 'STAGE 01',
    title: 'Contacted',
    body: 'A campaign goes out from a saved template, personalized with company and recruiter variables. Delivery, opens, and click-through are tracked per recruiter, not just per blast.',
    align: 'self-start',
  },
  {
    num: 'STAGE 02',
    title: 'Interested',
    body: 'A reply lands and becomes a deal automatically — response date, opportunity type, and next follow-up date logged against that company, visible to the whole placement team.',
    align: 'self-end',
  },
  {
    num: 'STAGE 03',
    title: 'Interview scheduled',
    body: 'Tasks get assigned with deadlines and reminders. Nothing depends on one coordinator remembering — overdue items surface on the dashboard before they become a missed opportunity.',
    align: 'self-start',
  },
  {
    num: 'STAGE 04',
    title: 'Closed',
    body: 'The deal closes and rolls straight into the monthly outreach and recruiter engagement reports — no manual tallying at the end of the placement season.',
    align: 'self-end',
  },
];

export default function Pipeline() {
  return (
    <section id="pipeline" className="min-h-[260vh] pt-32 px-[5vw]">
      <div className="max-w-[640px] mb-[8vh]">
        <div className="font-mono text-xs tracking-[0.18em] text-brand-soft uppercase mb-4 flex items-center gap-2 before:content-[''] before:w-5 before:h-px before:bg-brand">
          The pipeline
        </div>
        <h2 className="font-display font-semibold text-4xl md:text-5xl leading-tight max-w-[16ch]">
          Watch a cold company become a placement.
        </h2>
      </div>

      <div className="flex flex-col gap-[34vh] pb-[20vh]">
        {STAGES.map((s, i) => (
          <div
            key={s.title}
            data-stage={i}
            className={`stage-card max-w-[480px] ${s.align} bg-panel border border-border rounded-2xl px-8 py-7 backdrop-blur-md`}
          >
            <div className="font-mono text-brand text-xs tracking-wide">{s.num}</div>
            <div className="font-display font-semibold text-2xl mt-2 mb-2.5">{s.title}</div>
            <div className="text-mute text-sm leading-relaxed">{s.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
