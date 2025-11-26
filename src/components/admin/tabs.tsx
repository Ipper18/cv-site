"use client";

import { Children, useState } from "react";

export type AdminTab = {
  id: string;
  label: string;
};

export function AdminTabs({
  tabs,
  initialTab,
  children,
}: {
  tabs: AdminTab[];
  initialTab: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(initialTab);
  const panels = Children.toArray(children);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3 rounded-3xl border border-slate-200 bg-white p-2">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-[var(--accent)] text-white shadow"
                  : "text-[var(--muted)] hover:text-[var(--accent)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div>
        {panels.map((panel, index) => {
          const tab = tabs[index];
          if (!tab) return null;
          const isActive = tab.id === active;
          return (
            <div key={tab.id} className={isActive ? "block" : "hidden"}>
              {panel}
            </div>
          );
        })}
      </div>
    </div>
  );
}
