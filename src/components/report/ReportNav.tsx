'use client';

import { useEffect, useState } from 'react';

interface NavSection {
  id: string;
  label: string;
  count?: number;
}

interface ReportNavProps {
  sections: NavSection[];
}

export default function ReportNav({ sections }: ReportNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id || '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Desktop: sticky left sidebar */}
      <nav data-pdf-hidden className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40 w-48">
        <div className="liquid-glass p-3 space-y-1">
          {sections.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between report-nav-item border-l-2 ${
                activeId === id
                  ? 'active text-violet-400 bg-violet-500/10'
                  : 'text-zinc-500 hover:text-zinc-300 border-transparent'
              }`}
            >
              <span className="truncate">{label}</span>
              {count !== undefined && count > 0 && (
                <span className="text-zinc-600 ml-1">{count}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile: floating bottom bar */}
      <nav data-pdf-hidden className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="liquid-glass p-2 flex gap-1 overflow-x-auto scrollbar-none">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors flex-shrink-0 ${
                activeId === id
                  ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
