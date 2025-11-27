"use client";

import type React from "react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

type Props = {
  label?: string;
  confirmLabel?: string;
  description?: string;
  action?: React.ButtonHTMLAttributes<HTMLButtonElement>["formAction"];
  name: string;
  value: string | number;
  className?: string;
};

export function ConfirmDeleteButton({
  label = "Delete",
  confirmLabel = "Delete",
  description = "This action cannot be undone.",
  action,
  name,
  value,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const hiddenSubmitRef = useRef<HTMLButtonElement | null>(null);
  const modalRoot = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      modalRoot.current = document.body;
    }
  }, []);

  const handleConfirm = () => {
    hiddenSubmitRef.current?.click();
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`pressable rounded-2xl border border-red-200 px-4 py-2 text-sm text-red-500 transition hover:border-red-300 hover:bg-red-50 ${className}`}
      >
        {label}
      </button>
      <button ref={hiddenSubmitRef} formAction={action} name={name} value={value} className="hidden" />
      {open && modalRoot.current
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200" onClick={() => setOpen(false)} />
              <div className="modal-fade-enter-active relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
                <p className="text-sm font-semibold text-red-600">Potwierdź usunięcie</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="pressable rounded-2xl border border-slate-200 px-4 py-2 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    onClick={() => setOpen(false)}
                  >
                    Anuluj
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="pressable rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
                  >
                    {confirmLabel}
                  </button>
                </div>
              </div>
            </div>,
            modalRoot.current,
          )
        : null}
    </>
  );
}
