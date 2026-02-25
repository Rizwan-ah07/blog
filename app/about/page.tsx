import {
  MapPin,
  Building2,
  Briefcase,
  Target,
  Linkedin,
  BarChart3,
  Database,
  ArrowLeftRight,
  GitBranch,
  Users,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";

const skills = [
  { label: "Power BI & DAX", icon: BarChart3, level: 60 },
  { label: "SAP (P2P, MM, basics)", icon: Database, level: 50 },
  { label: "Excel & Power Query", icon: FileSpreadsheet, level: 75 },
  { label: "Data Migration", icon: ArrowLeftRight, level: 40 },
  { label: "Process Mapping", icon: GitBranch, level: 55 },
  { label: "Stakeholder Communication", icon: Users, level: 70 },
];

const learningGoals = [
  "Build functional Power BI dashboards from real business data",
  "Understand the SAP Purchase-to-Pay and core ERP processes",
  "Learn how data migration projects are planned and executed",
  "Collaborate effectively with different departments and stakeholders",
  "Develop analytical thinking and business process awareness",
  "Build a portfolio of documented, real-world internship work",
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white">About Me</h1>
        <p className="text-gray-400">
          Intern dev on a mission — one sprint at a time.
        </p>
      </div>

      {/* Split layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* ── Side A: Mini-CV ── */}
        <aside className="lg:col-span-2 flex flex-col gap-6">
          {/* Profile card */}
          <div className="rounded-2xl border border-white/5 bg-[#111111] p-6 flex flex-col items-center text-center gap-4">
            {/* Photo placeholder */}
            <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-purple-700/40 to-purple-900/20 border border-purple-500/30 flex items-center justify-center text-4xl select-none">
              👤
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Your Name</h2>
              <p className="text-sm text-purple-400 font-medium">
                Business &amp; Data Intern
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Stage / WPL 2026
              </p>
            </div>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-400 transition-all hover:bg-blue-500/20 hover:border-blue-500/50"
            >
              <Linkedin className="h-4 w-4" />
              View LinkedIn
            </a>
          </div>

          {/* Skills */}
          <div className="rounded-2xl border border-white/5 bg-[#111111] p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Technical Skills
            </h3>
            <div className="space-y-3">
              {skills.map(({ label, icon: Icon, level }) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm text-gray-300">
                      <Icon className="h-3.5 w-3.5 text-purple-400" />
                      {label}
                    </span>
                    <span className="text-xs text-gray-600">{level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-700 to-purple-500"
                      style={{ width: `${level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Side B: Internship Details ── */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Company info */}
          <div className="rounded-2xl border border-white/5 bg-[#111111] p-6 space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-400" />
              Internship Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={Building2}
                label="Company"
                value="[Company Name]"
                sub="Replace with your company"
              />
              <InfoItem
                icon={MapPin}
                label="Location"
                value="[City, Country]"
                sub="On-site / Hybrid"
              />
              <InfoItem
                icon={Briefcase}
                label="Role"
                value="Business & Data Intern"
                sub="Stage / WPL position"
              />
              <InfoItem
                icon={Target}
                label="Duration"
                value="Feb – Jun 2026"
                sub="5 months"
              />
            </div>
          </div>

          {/* About narrative */}
          <div className="rounded-2xl border border-white/5 bg-[#111111] p-6 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              My Story
            </h3>
            <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
              <p>
                I&apos;m a student currently completing my Stage/WPL
                internship as part of my ICT programme. This blog documents
                what I&apos;m learning in a real business environment —
                working with Power BI, navigating SAP, and getting hands-on
                experience with data migration projects.
              </p>
              <p>
                Before this internship, most of what I knew came from
                coursework. Now I&apos;m working with real data, real systems,
                and real deadlines alongside professionals who use these tools
                every day.
              </p>
              <p>
                I started this blog to hold myself accountable and to create an
                honest record of the internship — the things that clicked, the
                things that didn&apos;t, and everything in between.
              </p>
            </div>
          </div>

          {/* Learning goals */}
          <div className="rounded-2xl border border-white/5 bg-[#111111] p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-400" />
              Learning Goals
            </h3>
            <ul className="space-y-2.5">
              {learningGoals.map((goal) => (
                <li key={goal} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

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
