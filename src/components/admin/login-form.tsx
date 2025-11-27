"use client";

import { useFormState, useFormStatus } from "react-dom";

import { loginAction, type LoginActionState } from "@/app/cv-admin/actions";

const initialState: LoginActionState = { success: false };

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form
      action={formAction}
      className="w-full max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
      autoComplete="off"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent)]">CV Admin</p>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Sign in</h1>
        <p className="text-sm text-[var(--muted)]">Use the credentials configured via environment variables.</p>
      </div>
      <label className="block text-sm text-[var(--muted)]">
        Username
        <input
          name="username"
          autoComplete="username"
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          required
        />
      </label>
      <label className="block text-sm text-[var(--muted)]">
        Password
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          required
        />
      </label>
      {state.message ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">{state.message}</p>
      ) : null}
      <SubmitButton>Access admin</SubmitButton>
    </form>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Signing in…" : children}
    </button>
  );
}
