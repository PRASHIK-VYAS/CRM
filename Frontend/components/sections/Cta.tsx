export default function Cta() {
  return (
    <section id="cta" className="min-h-screen flex flex-col justify-center items-center text-center px-[5vw]">
      <div className="font-mono text-xs tracking-[0.18em] text-brand-soft uppercase mb-4 flex items-center justify-center gap-2 before:content-[''] before:w-5 before:h-px before:bg-brand">
        Ready when you are
      </div>
      <h2 className="font-display font-semibold text-4xl md:text-5xl leading-tight max-w-[20ch] mx-auto">
        Stop chasing recruiters in spreadsheets.
      </h2>
      <p className="text-mute max-w-[46ch] mt-6 leading-relaxed mx-auto">
        Bring your placement cell onto one dashboard your whole team can see.
      </p>
      <button className="font-semibold text-sm px-6 py-3.5 rounded-lg bg-brand text-white hover:bg-brand-hover hover:-translate-y-0.5 transition-all mt-9">
        Request a demo
      </button>
    </section>
  );
}
