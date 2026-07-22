const ROLES = [
  { name: 'Admin', items: ['Full system access', 'User management', 'Dashboard access'] },
  { name: 'Placement coordinator', items: ['Manage companies & contacts', 'Run campaigns', 'Track deals and tasks'] },
  { name: 'Student volunteer', items: ['View assigned companies', 'Update communication records', 'Manage follow-ups'] },
];

export default function Roles() {
  return (
    <section id="roles" className="min-h-0 pt-[10vh] pb-[14vh] px-[5vw]">
      <div className="font-mono text-xs tracking-[0.18em] text-brand-soft uppercase mb-4 flex items-center gap-2 before:content-[''] before:w-5 before:h-px before:bg-brand">
        Built for the whole cell
      </div>
      <h2 className="font-display font-semibold text-4xl md:text-5xl leading-tight max-w-[16ch]">
        Every role sees exactly what it needs.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-11">
        {ROLES.map((r) => (
          <div key={r.name} className="border-t border-border pt-4.5">
            <div className="font-display font-semibold text-brand-soft mb-2.5">{r.name}</div>
            <ul className="text-mute text-sm leading-loose list-none">
              {r.items.map((it) => (
                <li key={it} className="before:content-['—_'] before:text-brand-dim">
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
