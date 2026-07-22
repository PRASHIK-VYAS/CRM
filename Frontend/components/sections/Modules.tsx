const MODULES = [
  { icon: '◆', title: 'Company management', desc: 'Add, tag, and track every recruiter organization — industry, hiring history, relationship type, assigned coordinator.' },
  { icon: '◇', title: 'Contact management', desc: 'Import recruiter contacts via CSV, link them to companies, keep designation and LinkedIn on file.' },
  { icon: '◈', title: 'Email broadcaster', desc: 'Scheduled, personalized bulk campaigns with delivery, open, click, and bounce tracking built in.' },
  { icon: '◉', title: 'Campaigns & deals', desc: 'Every response becomes a trackable deal — status, opportunity type, and follow-up date in one place.' },
  { icon: '◎', title: 'Task management', desc: 'Assign follow-ups with deadlines. Overdue tasks surface automatically instead of slipping through.' },
  { icon: '◐', title: 'Reports', desc: 'Monthly outreach, campaign performance, and recruiter engagement reports — generated, not compiled by hand.' },
];

export default function Modules() {
  return (
    <section id="modules" className="min-h-0 py-[14vh] px-[5vw]">
      <div className="font-mono text-xs tracking-[0.18em] text-brand-soft uppercase mb-4 flex items-center gap-2 before:content-[''] before:w-5 before:h-px before:bg-brand">
        What&apos;s inside
      </div>
      <h2 className="font-display font-semibold text-4xl md:text-5xl leading-tight max-w-[16ch]">
        Six modules. One placement cell.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden mt-14">
        {MODULES.map((m) => (
          <div key={m.title} className="bg-bg px-7 py-8 hover:bg-[rgba(255,122,38,0.05)] transition-colors">
            <div className="text-xl text-brand">{m.icon}</div>
            <div className="font-display font-semibold text-lg mt-3.5 mb-2">{m.title}</div>
            <div className="text-mute text-sm leading-relaxed">{m.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
