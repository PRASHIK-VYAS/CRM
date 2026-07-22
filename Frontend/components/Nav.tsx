import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 w-full z-10 flex justify-between items-center px-[5vw] py-5 backdrop-blur-md bg-gradient-to-b from-bg/85 to-transparent">
      <div className="font-display font-bold text-2xl tracking-tight">
      CorpLink<span className="text-brand">.</span>
      </div>
      <div className="hidden sm:flex gap-8 text-sm text-white items-center">
        <a href="#modules" className="hover:text-brand-soft transition-colors">Product</a>
        <a href="#pipeline" className="hover:text-brand-soft transition-colors">Pipeline</a>
        <a href="#roles" className="hover:text-brand-soft transition-colors">Roles</a>
        <Link
          href="/login"
          className="text-white border border-border rounded-full px-4 py-1.5 hover:border-brand transition-colors"
        >
          Sign in
        </Link>
      </div>
    </nav>
  );
}
