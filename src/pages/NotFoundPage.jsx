import { Link } from 'react-router-dom';
import { Home, MoveLeft } from 'lucide-react';
import Seo from '../components/Seo';
import Logo from '../components/Logo';

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page not found"
        description="That page does not exist."
        path="/404"
        noindex
      />

      <main
        id="main"
        className="site-ambience flex min-h-dvh flex-col items-center justify-center px-6 text-center"
      >
        <Logo className="mb-10 h-12 w-12" showText={false} />

        <p className="gradient-text font-heading text-7xl font-extrabold md:text-9xl">
          404
        </p>

        <h1 className="mb-4 mt-6 font-heading text-2xl font-bold text-white md:text-3xl">
          This page does not exist
        </h1>
        <p className="mb-10 max-w-md text-sm leading-relaxed text-slate-400">
          The link may be out of date, or the page may have moved. Everything else is
          still where you left it.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link to="/" className="btn-primary">
            <Home size={17} aria-hidden="true" /> Back to home
          </Link>
          <button type="button" onClick={() => window.history.back()} className="btn-secondary">
            <MoveLeft size={17} aria-hidden="true" /> Go back
          </button>
        </div>
      </main>
    </>
  );
}
