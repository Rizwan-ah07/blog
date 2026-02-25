"use client";

import { useState, useTransition } from "react";
import {
  MapPin,
  Building2,
  Briefcase,
  Target,
  Linkedin,
  BarChart3,
  Database,
  Cloud,
  GitBranch,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  Pencil,
  X,
  Plus,
  Trash2,
  Save,
  Loader2,
  Zap,
} from "lucide-react";
import type { AboutData } from "@/lib/db";
import { saveAboutAction } from "@/app/actions";

// ── Skill icon mapping ────────────────────────────────────────────────────────

const SKILL_ICON_KEYS: [string, React.ElementType][] = [
  ["power bi", BarChart3],
  ["sap", Database],
  ["excel", FileSpreadsheet],
  ["cloud", Cloud],
  ["process", GitBranch],
  ["stakeholder", Users],
];
function skillIcon(label: string): React.ElementType {
  const lower = label.toLowerCase();
  for (const [key, Icon] of SKILL_ICON_KEYS) {
    if (lower.includes(key)) return Icon;
  }
  return Zap;
}

// ── Inline input helpers ──────────────────────────────────────────────────────

function EditInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg border border-purple-500/40 bg-white/5 px-2.5 py-1.5 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/30 ${className}`}
    />
  );
}

function EditTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-purple-500/40 bg-white/5 px-2.5 py-1.5 text-sm text-gray-300 placeholder-gray-600 outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/30 resize-none"
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  data: AboutData;
  isAdmin: boolean;
}

export default function AboutEditor({ data: initialData, isAdmin }: Props) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState<AboutData>(initialData);
  const [draft, setDraft] = useState<AboutData>(initialData);
  const [isPending, startTransition] = useTransition();

  const live = editing ? draft : saved;

  function startEdit() {
    setDraft(JSON.parse(JSON.stringify(saved)));
    setEditing(true);
  }
  function cancelEdit() {
    setEditing(false);
  }
  function handleSave() {
    startTransition(async () => {
      await saveAboutAction(draft);
      setSaved(draft);
      setEditing(false);
    });
  }

  // draft helpers
  function setField<K extends keyof AboutData>(key: K, value: AboutData[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }
  function setStory(i: number, val: string) {
    setDraft((d) => {
      const s = [...d.story];
      s[i] = val;
      return { ...d, story: s };
    });
  }
  function addStory() {
    setDraft((d) => ({ ...d, story: [...d.story, ""] }));
  }
  function removeStory(i: number) {
    setDraft((d) => ({ ...d, story: d.story.filter((_, idx) => idx !== i) }));
  }
  function setSkill(i: number, field: "label" | "level", val: string | number) {
    setDraft((d) => {
      const skills = [...d.skills];
      skills[i] = { ...skills[i], [field]: field === "level" ? Number(val) : val };
      return { ...d, skills };
    });
  }
  function addSkill() {
    setDraft((d) => ({ ...d, skills: [...d.skills, { label: "New Skill", level: 50 }] }));
  }
  function removeSkill(i: number) {
    setDraft((d) => ({ ...d, skills: d.skills.filter((_, idx) => idx !== i) }));
  }
  function setGoal(i: number, val: string) {
    setDraft((d) => {
      const goals = [...d.learningGoals];
      goals[i] = val;
      return { ...d, learningGoals: goals };
    });
  }
  function addGoal() {
    setDraft((d) => ({ ...d, learningGoals: [...d.learningGoals, ""] }));
  }
  function removeGoal(i: number) {
    setDraft((d) => ({ ...d, learningGoals: d.learningGoals.filter((_, idx) => idx !== i) }));
  }

  const editBadge = "rounded border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 text-[10px] text-purple-400 uppercase tracking-wider font-semibold";

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white">About Me</h1>
          <p className="text-gray-400">Intern dev on a mission — one sprint at a time.</p>
        </div>
        {isAdmin && !editing && (
          <button
            onClick={startEdit}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white"
          >
            <Pencil className="h-4 w-4" />
            Edit page
          </button>
        )}
        {editing && (
          <span className={editBadge}>Editing</span>
        )}
      </div>

      {/* ── Layout ──────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* ── Side A: Profile + Skills ───────────────────────────── */}
        <aside className="lg:col-span-2 flex flex-col gap-6">

          {/* Profile card */}
          <div className="rounded-2xl border border-white/5 bg-[#111111] p-6 flex flex-col items-center text-center gap-4">
            <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-purple-700/40 to-purple-900/20 border border-purple-500/30 flex items-center justify-center text-4xl select-none">
              👤
            </div>
            <div className="w-full space-y-2">
              {editing ? (
                <>
                  <EditInput
                    value={draft.name}
                    onChange={(v) => setField("name", v)}
                    placeholder="Your name"
                    className="text-center font-bold"
                  />
                  <EditInput
                    value={draft.role}
                    onChange={(v) => setField("role", v)}
                    placeholder="Role"
                    className="text-center text-sm"
                  />
                  <EditInput
                    value={draft.period}
                    onChange={(v) => setField("period", v)}
                    placeholder="Period"
                    className="text-center text-xs"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-white">{live.name}</h2>
                  <p className="text-sm text-purple-400 font-medium">{live.role}</p>
                  <p className="text-xs text-gray-500">{live.period}</p>
                </>
              )}
            </div>
            {editing ? (
              <div className="w-full space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-widest">LinkedIn URL</p>
                <EditInput
                  value={draft.linkedinUrl}
                  onChange={(v) => setField("linkedinUrl", v)}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            ) : (
              <a
                href={live.linkedinUrl.match(/^https?:\/\//) ? live.linkedinUrl : `https://${live.linkedinUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-400 transition-all hover:bg-blue-500/20 hover:border-blue-500/50"
              >
                <Linkedin className="h-4 w-4" />
                View LinkedIn
              </a>
            )}
          </div>

          {/* Skills */}
          <div className="rounded-2xl border border-white/5 bg-[#111111] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Technical Skills
              </h3>
              {editing && (
                <button
                  onClick={addSkill}
                  className="inline-flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-xs text-purple-400 hover:bg-purple-500/20"
                >
                  <Plus className="h-3 w-3" /> Add
                </button>
              )}
            </div>
            <div className="space-y-4">
              {live.skills.map((skill, i) => {
                const Icon = skillIcon(skill.label);
                return editing ? (
                  <div key={i} className="space-y-2 rounded-xl border border-white/5 bg-white/2 p-3">
                    <div className="flex items-center gap-2">
                      <EditInput
                        value={draft.skills[i].label}
                        onChange={(v) => setSkill(i, "label", v)}
                        placeholder="Skill name"
                        className="flex-1"
                      />
                      <button onClick={() => removeSkill(i)} className="shrink-0 text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={draft.skills[i].level}
                        onChange={(e) => setSkill(i, "level", e.target.value)}
                        className="flex-1 accent-purple-500"
                      />
                      <span className="w-9 text-right text-xs text-gray-500">{draft.skills[i].level}%</span>
                    </div>
                  </div>
                ) : (
                  <div key={skill.label}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm text-gray-300">
                        <Icon className="h-3.5 w-3.5 text-purple-400" />
                        {skill.label}
                      </span>
                      <span className="text-xs text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-700 to-purple-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── Side B: Internship details + story + goals ─────────── */}
        <div className="lg:col-span-3 flex flex-col gap-6">

          {/* Internship details */}
          <div className="rounded-2xl border border-white/5 bg-[#111111] p-6 space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-400" />
              Internship Details
            </h3>

            {editing ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    { key: "company", label: "Company", sub: "locationSub" as const, icon: Building2 },
                    { key: "location", label: "Location", sub: "locationSub" as const, icon: MapPin },
                    { key: "jobTitle", label: "Role", sub: "jobSub" as const, icon: Briefcase },
                    { key: "duration", label: "Duration", sub: "durationSub" as const, icon: Target },
                  ] as const
                ).map(({ key, label, sub, icon: Icon }) => (
                  <div key={key} className="flex items-start gap-3 rounded-xl border border-purple-500/20 bg-white/2 p-3">
                    <div className="mt-0.5 shrink-0 rounded-lg bg-purple-500/10 border border-purple-500/20 p-1.5">
                      <Icon className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                      <EditInput
                        value={draft[key as keyof AboutData] as string}
                        onChange={(v) => setField(key as keyof AboutData, v as never)}
                        placeholder={label}
                      />
                      <EditInput
                        value={draft[sub as keyof AboutData] as string}
                        onChange={(v) => setField(sub as keyof AboutData, v as never)}
                        placeholder="Subtitle"
                        className="text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem icon={Building2} label="Company" value={live.company} sub={live.locationSub} />
                <InfoItem icon={MapPin} label="Location" value={live.location} sub={live.locationSub} />
                <InfoItem icon={Briefcase} label="Role" value={live.jobTitle} sub={live.jobSub} />
                <InfoItem icon={Target} label="Duration" value={live.duration} sub={live.durationSub} />
              </div>
            )}
          </div>

          {/* My Story */}
          <div className="rounded-2xl border border-white/5 bg-[#111111] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">My Story</h3>
              {editing && (
                <button
                  onClick={addStory}
                  className="inline-flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-xs text-purple-400 hover:bg-purple-500/20"
                >
                  <Plus className="h-3 w-3" /> Add paragraph
                </button>
              )}
            </div>
            {editing ? (
              <div className="space-y-3">
                {draft.story.map((para, i) => (
                  <div key={i} className="flex gap-2">
                    <EditTextarea
                      value={para}
                      onChange={(v) => setStory(i, v)}
                      placeholder="Write a paragraph..."
                      rows={3}
                    />
                    {draft.story.length > 1 && (
                      <button onClick={() => removeStory(i)} className="shrink-0 self-start mt-1 text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
                {live.story.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
          </div>

          {/* Learning Goals */}
          <div className="rounded-2xl border border-white/5 bg-[#111111] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-400" />
                Learning Goals
              </h3>
              {editing && (
                <button
                  onClick={addGoal}
                  className="inline-flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-xs text-purple-400 hover:bg-purple-500/20"
                >
                  <Plus className="h-3 w-3" /> Add goal
                </button>
              )}
            </div>
            {editing ? (
              <div className="space-y-2">
                {draft.learningGoals.map((goal, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="shrink-0 h-4 w-4 text-purple-500/40" />
                    <EditInput
                      value={goal}
                      onChange={(v) => setGoal(i, v)}
                      placeholder="Learning goal..."
                      className="flex-1"
                    />
                    {draft.learningGoals.length > 1 && (
                      <button onClick={() => removeGoal(i)} className="shrink-0 text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-2.5">
                {live.learningGoals.map((goal, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
                    {goal}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ── Sticky save/cancel bar ─────────────────────────────────── */}
      {editing && (
        <div className="sticky bottom-4 z-10 flex justify-end gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-sm p-3 shadow-xl">
            <button
              onClick={cancelEdit}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── InfoItem (display only) ────────────────────────────────────────────────

function InfoItem({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/2 p-3">
      <div className="mt-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 p-1.5">
        <Icon className="h-4 w-4 text-purple-400" />
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
        <p className="text-xs text-gray-500">{sub}</p>
      </div>
    </div>
  );
}
