'use client';

import { useMemo, useState } from 'react';
import type { ProjectImage } from '@/lib/types';
import { classNames } from '@/lib/utils';

interface ShowcaseImage {
  id: number | string;
  image_url: string;
  caption?: string | null;
}

interface Props {
  title: string;
  images: ProjectImage[];
}

export function ProjectShowcase({ title, images }: Props) {
  const slides = useMemo<ShowcaseImage[]>(() => images, [images]);

  const [activeIndex, setActiveIndex] = useState(0);

  if (slides.length === 0) return null;

  const active = slides[activeIndex] ?? slides[0];

  function goTo(index: number) {
    const total = slides.length;
    setActiveIndex((index + total) % total);
  }

  return (
    <section className="panel overflow-hidden">
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0))] p-4 sm:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between gap-3 pb-4">
            <div>
              <p className="eyebrow">Product Preview</p>
              <p className="mt-1 text-sm muted-2">Swipe through the app screens and key UI moments.</p>
            </div>

            {slides.length > 1 && (
              <div className="flex items-center gap-2">
                <button type="button" className="btn-ghost !h-10 !w-10 !rounded-full !px-0 !py-0" onClick={() => goTo(activeIndex - 1)} aria-label="Previous screenshot">
                  ←
                </button>
                <button type="button" className="btn-ghost !h-10 !w-10 !rounded-full !px-0 !py-0" onClick={() => goTo(activeIndex + 1)} aria-label="Next screenshot">
                  →
                </button>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-slate-950/30 p-3 shadow-2xl shadow-slate-950/10 dark:border-slate-800/70">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={slide.id} className="w-full shrink-0 px-2 sm:px-4">
                  <div className="mx-auto max-w-[320px] overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-xl shadow-slate-950/10 dark:border-slate-800/70 dark:bg-slate-950">
                    <div className="aspect-[10/16] max-h-[520px] overflow-hidden bg-white dark:bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.image_url}
                        alt={slide.caption || `${title} screenshot ${index + 1}`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {active.caption || `Screenshot ${activeIndex + 1}`}
              </p>
              <p className="mt-1 text-sm muted-2">
                {activeIndex + 1} of {slides.length}
              </p>
            </div>

            {slides.length > 1 && (
              <div className="flex items-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={classNames(
                      'h-2.5 rounded-full transition-all',
                      index === activeIndex
                        ? 'w-8 bg-brand-400'
                        : 'w-2.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600'
                    )}
                    aria-label={`Go to screenshot ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
