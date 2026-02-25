// ── Tag colour system ─────────────────────────────────────────────────────────
// All class strings are fully written out so Tailwind never purges them.

export type ColorKey =
  | "purple" | "blue" | "orange" | "amber" | "red"
  | "emerald" | "pink" | "cyan" | "violet" | "teal"
  | "lime" | "yellow" | "rose" | "fuchsia" | "sky"
  | "indigo" | "green" | "slate";

export interface TagEntry { name: string; color: string; }

export const COLOR_PRESETS: { key: ColorKey; label: string; dot: string }[] = [
  { key: "purple",  label: "Purple",  dot: "bg-purple-500"  },
  { key: "violet",  label: "Violet",  dot: "bg-violet-500"  },
  { key: "indigo",  label: "Indigo",  dot: "bg-indigo-500"  },
  { key: "blue",    label: "Blue",    dot: "bg-blue-500"    },
  { key: "sky",     label: "Sky",     dot: "bg-sky-500"     },
  { key: "cyan",    label: "Cyan",    dot: "bg-cyan-500"    },
  { key: "teal",    label: "Teal",    dot: "bg-teal-500"    },
  { key: "emerald", label: "Emerald", dot: "bg-emerald-500" },
  { key: "green",   label: "Green",   dot: "bg-green-500"   },
  { key: "lime",    label: "Lime",    dot: "bg-lime-500"    },
  { key: "yellow",  label: "Yellow",  dot: "bg-yellow-500"  },
  { key: "amber",   label: "Amber",   dot: "bg-amber-500"   },
  { key: "orange",  label: "Orange",  dot: "bg-orange-500"  },
  { key: "red",     label: "Red",     dot: "bg-red-500"     },
  { key: "rose",    label: "Rose",    dot: "bg-rose-500"    },
  { key: "pink",    label: "Pink",    dot: "bg-pink-500"    },
  { key: "fuchsia", label: "Fuchsia", dot: "bg-fuchsia-500" },
  { key: "slate",   label: "Slate",   dot: "bg-slate-500"   },
];

// Card badge (post cards + detail page) ───────────────────────────────────────
const CARD: Record<string, string> = {
  purple:  "bg-purple-500/15 text-purple-400 border-purple-500/25",
  violet:  "bg-violet-500/15 text-violet-400 border-violet-500/25",
  indigo:  "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
  blue:    "bg-blue-500/15 text-blue-400 border-blue-500/25",
  sky:     "bg-sky-500/15 text-sky-400 border-sky-500/25",
  cyan:    "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  teal:    "bg-teal-500/15 text-teal-400 border-teal-500/25",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  green:   "bg-green-500/15 text-green-400 border-green-500/25",
  lime:    "bg-lime-500/15 text-lime-400 border-lime-500/25",
  yellow:  "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  amber:   "bg-amber-500/15 text-amber-400 border-amber-500/25",
  orange:  "bg-orange-500/15 text-orange-400 border-orange-500/25",
  red:     "bg-red-500/15 text-red-400 border-red-500/25",
  rose:    "bg-rose-500/15 text-rose-400 border-rose-500/25",
  pink:    "bg-pink-500/15 text-pink-400 border-pink-500/25",
  fuchsia: "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/25",
  slate:   "bg-slate-500/15 text-slate-400 border-slate-500/25",
};

// Filter chip — inactive ──────────────────────────────────────────────────────
const FILTER: Record<string, string> = {
  purple:  "bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/25",
  violet:  "bg-violet-500/15 text-violet-400 border-violet-500/30 hover:bg-violet-500/25",
  indigo:  "bg-indigo-500/15 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/25",
  blue:    "bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/25",
  sky:     "bg-sky-500/15 text-sky-400 border-sky-500/30 hover:bg-sky-500/25",
  cyan:    "bg-cyan-500/15 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/25",
  teal:    "bg-teal-500/15 text-teal-400 border-teal-500/30 hover:bg-teal-500/25",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25",
  green:   "bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/25",
  lime:    "bg-lime-500/15 text-lime-400 border-lime-500/30 hover:bg-lime-500/25",
  yellow:  "bg-yellow-500/15 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/25",
  amber:   "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25",
  orange:  "bg-orange-500/15 text-orange-400 border-orange-500/30 hover:bg-orange-500/25",
  red:     "bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25",
  rose:    "bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25",
  pink:    "bg-pink-500/15 text-pink-400 border-pink-500/30 hover:bg-pink-500/25",
  fuchsia: "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30 hover:bg-fuchsia-500/25",
  slate:   "bg-slate-500/15 text-slate-400 border-slate-500/30 hover:bg-slate-500/25",
};

// Filter chip — active ────────────────────────────────────────────────────────
const FILTER_ACTIVE: Record<string, string> = {
  purple:  "bg-purple-500/30 text-purple-300 border-purple-400/60",
  violet:  "bg-violet-500/30 text-violet-300 border-violet-400/60",
  indigo:  "bg-indigo-500/30 text-indigo-300 border-indigo-400/60",
  blue:    "bg-blue-500/30 text-blue-300 border-blue-400/60",
  sky:     "bg-sky-500/30 text-sky-300 border-sky-400/60",
  cyan:    "bg-cyan-500/30 text-cyan-300 border-cyan-400/60",
  teal:    "bg-teal-500/30 text-teal-300 border-teal-400/60",
  emerald: "bg-emerald-500/30 text-emerald-300 border-emerald-400/60",
  green:   "bg-green-500/30 text-green-300 border-green-400/60",
  lime:    "bg-lime-500/30 text-lime-300 border-lime-400/60",
  yellow:  "bg-yellow-500/30 text-yellow-300 border-yellow-400/60",
  amber:   "bg-amber-500/30 text-amber-300 border-amber-400/60",
  orange:  "bg-orange-500/30 text-orange-300 border-orange-400/60",
  red:     "bg-red-500/30 text-red-300 border-red-400/60",
  rose:    "bg-rose-500/30 text-rose-300 border-rose-400/60",
  pink:    "bg-pink-500/30 text-pink-300 border-pink-400/60",
  fuchsia: "bg-fuchsia-500/30 text-fuchsia-300 border-fuchsia-400/60",
  slate:   "bg-slate-500/30 text-slate-300 border-slate-400/60",
};

// Form tag-selector chip ──────────────────────────────────────────────────────
const FORM: Record<string, string> = {
  purple:  "border-purple-500/40 text-purple-400 bg-purple-500/10",
  violet:  "border-violet-500/40 text-violet-400 bg-violet-500/10",
  indigo:  "border-indigo-500/40 text-indigo-400 bg-indigo-500/10",
  blue:    "border-blue-500/40 text-blue-400 bg-blue-500/10",
  sky:     "border-sky-500/40 text-sky-400 bg-sky-500/10",
  cyan:    "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
  teal:    "border-teal-500/40 text-teal-400 bg-teal-500/10",
  emerald: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  green:   "border-green-500/40 text-green-400 bg-green-500/10",
  lime:    "border-lime-500/40 text-lime-400 bg-lime-500/10",
  yellow:  "border-yellow-500/40 text-yellow-400 bg-yellow-500/10",
  amber:   "border-amber-500/40 text-amber-400 bg-amber-500/10",
  orange:  "border-orange-500/40 text-orange-400 bg-orange-500/10",
  red:     "border-red-500/40 text-red-400 bg-red-500/10",
  rose:    "border-rose-500/40 text-rose-400 bg-rose-500/10",
  pink:    "border-pink-500/40 text-pink-400 bg-pink-500/10",
  fuchsia: "border-fuchsia-500/40 text-fuchsia-400 bg-fuchsia-500/10",
  slate:   "border-slate-500/40 text-slate-400 bg-slate-500/10",
};

export const getCardCls         = (c: string) => CARD[c]          ?? CARD.purple;
export const getFilterCls       = (c: string) => FILTER[c]        ?? FILTER.purple;
export const getFilterActiveCls = (c: string) => FILTER_ACTIVE[c] ?? FILTER_ACTIVE.purple;
export const getFormCls         = (c: string) => FORM[c]          ?? FORM.purple;

/** Build a tag-name → card-badge-class map for quick rendering. */
export function buildTagColorMap(entries: TagEntry[]): Record<string, string> {
  const map: Record<string, string> = {};
  entries.forEach((e) => { map[e.name] = getCardCls(e.color); });
  return map;
}

/** Default colors to assign based on position when no color stored. */
const DEFAULT_SEQUENCE: ColorKey[] = [
  "purple", "blue", "cyan", "emerald", "amber", "red", "pink", "orange", "violet", "teal",
  "sky", "lime", "rose", "fuchsia", "indigo", "green", "yellow", "slate",
];
export function defaultColor(index: number): ColorKey {
  return DEFAULT_SEQUENCE[index % DEFAULT_SEQUENCE.length];
}
