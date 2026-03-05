'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LockKeyhole, Mail } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      router.replace('/productos');
      router.refresh();
    } catch {
      setErrorMsg('No fue posible iniciar sesion. Revisa las variables de Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[var(--mary-bg)] p-4">
      <div className="pointer-events-none absolute -left-24 top-[-80px] h-72 w-72 rounded-full bg-[var(--mary-secondary)]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-[-80px] h-72 w-72 rounded-full bg-[var(--mary-primary)]/35 blur-3xl" />

      <section className="z-10 w-full max-w-md rounded-3xl border border-white/60 bg-[var(--mary-surface)]/85 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-[var(--mary-primary-strong)]">
          Tienda Mary
        </p>
        <h1 className="mb-2 text-2xl font-black text-[var(--mary-primary)] sm:text-3xl">
          Iniciar sesion
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <label htmlFor="email" className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--mary-primary-strong)]">
              Correo
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-white/80 bg-white px-3 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[var(--mary-primary)]">
              <Mail size={18} className="text-[var(--mary-primary)]" />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@correo.com"
                autoComplete="email"
                className="w-full border-0 bg-transparent text-sm outline-none"
                required
              />
            </div>
          </label>

          <label htmlFor="password" className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--mary-primary-strong)]">
              Contrasena
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-white/80 bg-white px-3 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[var(--mary-primary)]">
              <LockKeyhole size={18} className="text-[var(--mary-primary)]" />
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contrasena"
                autoComplete="current-password"
                className="w-full border-0 bg-transparent text-sm outline-none"
                required
              />
            </div>
          </label>

          {errorMsg && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--mary-primary)] px-5 py-3 font-bold text-white shadow-lg transition-colors hover:bg-[var(--mary-primary-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
            <span>{isLoading ? 'Entrando...' : 'Entrar al sistema'}</span>
          </button>
        </form>
      </section>
    </main>
  );
}
