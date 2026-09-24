import { createContext, useContext, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

/* DigitalOcean console palette */
const DO = {
  navy: "#031B4E",
  navyActive: "#1B3A78",
  navyText: "#C9D4EA",
  navyHeader: "#8FA3C8",
  blue: "#0069FF",
  blueTint: "#EAF2FF",
  text: "#1B1F24",
  text2: "#4D5B7C",
  text3: "#8690A2",
  border: "#DFE3EB",
  page: "#F5F7FA",
  white: "#FFFFFF",
  green: "#0B7A43",
  greenBg: "#E3F7EC",
  greenDot: "#15CD72",
  amber: "#8A5A00",
  amberBg: "#FFF4DB",
  amberDot: "#F5A623",
  red: "#B42318",
  redBg: "#FDECEC",
  redDot: "#E5484D",
  teal: "#13C4B8",
  font: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

type Tone = "ok" | "warn" | "bad" | "draft" | "info" | "neutral";

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

type IconName =
  | "droplet" | "db" | "spaces" | "app" | "lb" | "kb" | "agent" | "github" | "globe" | "check" | "chevron" | "dots"
  | "search" | "plus" | "bell" | "help" | "sun" | "shield" | "key" | "doc" | "sparkle" | "arrow" | "mail";

const PATHS: Record<IconName, string> = {
  droplet: "M8 1.5c2.5 3 4.5 5.4 4.5 8a4.5 4.5 0 0 1-9 0c0-2.6 2-5 4.5-8z",
  db: "M3 4c0-1.1 2.2-2 5-2s5 .9 5 2-2.2 2-5 2-5-.9-5-2zM3 4v8c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8c0 1.1 2.2 2 5 2s5-.9 5-2",
  spaces: "M8 2.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zM8 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
  app: "M4 3h8a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 12 13H4a1.5 1.5 0 0 1-1.5-1.5v-7A1.5 1.5 0 0 1 4 3zM2.5 6h11",
  lb: "M8 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM3.5 11a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM12.5 11a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM8 5v3M8 8l-4 3M8 8l4 3",
  kb: "M3 3h4a1 1 0 0 1 1 1v9a1 1 0 0 0-1-1H3zM13 3H9a1 1 0 0 0-1 1v9a1 1 0 0 1 1-1h4z",
  agent: "M5 5h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 2v3M6 9h.01M10 9h.01",
  github: "M8 1.5a6.5 6.5 0 0 0-2 12.7c.3 0 .4-.2.4-.4v-1.3c-1.8.4-2.2-.8-2.2-.8-.3-.8-.7-1-.7-1-.6-.4 0-.4 0-.4.6 0 1 .7 1 .7.6 1 1.5.7 1.9.5 0-.4.2-.7.4-.9-1.4-.2-3-.7-3-3.2 0-.7.3-1.3.7-1.7-.1-.2-.3-.9.1-1.8 0 0 .5-.2 1.8.7a6 6 0 0 1 3.2 0c1.3-.9 1.8-.7 1.8-.7.4.9.2 1.6.1 1.8.4.4.7 1 .7 1.7 0 2.5-1.5 3-3 3.2.2.2.4.6.4 1.1v1.7c0 .2.1.4.4.4A6.5 6.5 0 0 0 8 1.5z",
  globe: "M8 2.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zM2.5 8h11M8 2.5c1.8 2 1.8 9 0 11M8 2.5c-1.8 2-1.8 9 0 11",
  check: "M3.5 8.5l3 3 6-7",
  chevron: "M4 6l4 4 4-4",
  dots: "M3.5 8h.01M8 8h.01M12.5 8h.01",
  search: "M7 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM10.5 10.5L14 14",
  plus: "M8 3v10M3 8h10",
  bell: "M4 11V7a4 4 0 0 1 8 0v4l1 1.5H3zM6.5 14h3",
  help: "M8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2zM6.5 6.5a1.5 1.5 0 1 1 2 1.4c-.4.2-.5.5-.5.9V9.5M8 11.5h.01",
  sun: "M8 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1",
  shield: "M8 1.5l5 2v4c0 3.2-2.2 5.6-5 7-2.8-1.4-5-3.8-5-7v-4z",
  key: "M5 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM7 8.5l6-6M11 4.5l1.5 1.5",
  doc: "M4 1.5h5l3 3v10H4zM9 1.5v3h3",
  sparkle: "M8 2l1.4 3.6L13 7l-3.6 1.4L8 12l-1.4-3.6L3 7l3.6-1.4z",
  arrow: "M3 8h10M9 4l4 4-4 4",
  mail: "M2.5 4h11v8h-11zM2.5 4.5L8 9l5.5-4.5",
};

function Ico({ name, size = 16, color = "currentColor", width = 1.4 }: { name: IconName; size?: number; color?: string; width?: number }) {
  const filled = name === "github";
  const dots = name === "dots";
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, display: "block" }}>
      <path
        d={PATHS[name]}
        fill={filled ? color : "none"}
        stroke={filled ? "none" : color}
        strokeWidth={dots ? 2.6 : width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21v-3.6a5.4 5.4 0 1 0-5.4-5.4H3a9 9 0 1 1 9 9z" fill={DO.white} />
      <rect x="8.4" y="14.2" width="3.6" height="3.2" fill={DO.white} />
      <rect x="5.4" y="17.4" width="3" height="3" fill={DO.white} />
    </svg>
  );
}

function iconFor(kind: string): IconName {
  if (kind.startsWith("Droplet")) return "droplet";
  if (kind.includes("Postgres") || kind.includes("Valkey")) return "db";
  if (kind.startsWith("Spaces")) return "spaces";
  if (kind.startsWith("App Platform")) return "app";
  if (kind.startsWith("Load Balancer")) return "lb";
  if (kind.startsWith("Knowledge")) return "kb";
  if (kind.startsWith("Agent")) return "agent";
  return "doc";
}

/* ------------------------------------------------------------------ */
/* DO primitives                                                       */
/* ------------------------------------------------------------------ */

const s = (o: CSSProperties) => o;

function T({ children, size = 13, weight = 400, color = DO.text, style }: { children: ReactNode; size?: number; weight?: number; color?: string; style?: CSSProperties }) {
  return <span style={{ fontSize: size, fontWeight: weight, color, lineHeight: 1.45, ...style }}>{children}</span>;
}

function Btn({
  children, variant = "primary", onClick, disabled, full, icon,
}: { children: ReactNode; variant?: "primary" | "secondary" | "link" | "danger"; onClick?: () => void; disabled?: boolean; full?: boolean; icon?: IconName }) {
  const base: CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, height: full ? 38 : 32, padding: variant === "link" ? 0 : "0 14px",
    borderRadius: full ? 20 : 6, fontSize: 13, fontWeight: 600, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.45 : 1,
    width: full ? "100%" : undefined, boxSizing: "border-box", whiteSpace: "nowrap", fontFamily: DO.font,
  };
  const v: Record<string, CSSProperties> = {
    primary: { background: DO.blue, color: DO.white, border: `1px solid ${DO.blue}` },
    secondary: { background: DO.white, color: DO.blue, border: `1px solid ${DO.border}` },
    link: { background: "transparent", color: DO.blue, border: "none", height: "auto" },
    danger: { background: DO.white, color: DO.red, border: `1px solid ${DO.border}` },
  };
  return (
    <div onClick={disabled ? undefined : onClick} style={{ ...base, ...v[variant] }}>
      {icon && <Ico name={icon} size={14} />}
      {children}
    </div>
  );
}

function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  const map: Record<Tone, [string, string, string]> = {
    ok: [DO.greenBg, DO.green, DO.greenDot],
    warn: [DO.amberBg, DO.amber, DO.amberDot],
    bad: [DO.redBg, DO.red, DO.redDot],
    draft: [DO.page, DO.text2, DO.text3],
    info: [DO.blueTint, DO.blue, DO.blue],
    neutral: [DO.page, DO.text2, DO.text3],
  };
  const [bg, fg, dot] = map[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: bg, color: fg, fontSize: 11, fontWeight: 600, borderRadius: 12, padding: "2px 8px", whiteSpace: "nowrap", border: tone === "draft" ? `1px dashed ${DO.text3}` : "none" }}>
      <span style={{ width: 6, height: 6, borderRadius: 6, background: dot }} />
      {children}
    </span>
  );
}

function Card({ children, pad = 20, style }: { children: ReactNode; pad?: number; style?: CSSProperties }) {
  return <div style={{ background: DO.white, border: `1px solid ${DO.border}`, borderRadius: 8, padding: pad, display: "flex", flexDirection: "column", gap: 14, ...style }}>{children}</div>;
}

function Banner({ tone, title, children }: { tone: "info" | "warn" | "bad" | "ok"; title: string; children?: ReactNode }) {
  const c = { info: [DO.blueTint, DO.blue], warn: [DO.amberBg, DO.amber], bad: [DO.redBg, DO.red], ok: [DO.greenBg, DO.green] }[tone];
  return (
    <div style={{ background: c[0], borderRadius: 8, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{ color: c[1], paddingTop: 1 }}><Ico name={tone === "ok" ? "check" : tone === "info" ? "help" : "shield"} /></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <T weight={600} color={c[1]}>{title}</T>
        {children && <T size={12} color={DO.text}>{children}</T>}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <T size={13} weight={600}>{label}</T>
      {children}
      {hint && <T size={12} color={DO.text3}>{hint}</T>}
    </div>
  );
}

function Input({ value, mono }: { value: string; mono?: boolean }) {
  return (
    <div style={{ border: `1px solid ${DO.border}`, borderRadius: 6, padding: "8px 10px", fontSize: 13, color: DO.text, background: DO.white, fontFamily: mono ? "monospace" : DO.font, minHeight: 18 }}>
      {value}
    </div>
  );
}

function SelectBox({ value }: { value: string }) {
  return (
    <div style={{ border: `1px solid ${DO.border}`, borderRadius: 6, padding: "8px 10px", fontSize: 13, color: DO.text, background: DO.white, display: "flex", alignItems: "center" }}>
      <span style={{ flex: 1 }}>{value}</span>
      <Ico name="chevron" size={14} color={DO.text2} />
    </div>
  );
}

function TextBox({ value }: { value: string }) {
  return <div style={{ border: `1px solid ${DO.border}`, borderRadius: 6, padding: "10px 12px", fontSize: 13, color: DO.text, background: DO.white, minHeight: 44, lineHeight: 1.5 }}>{value}</div>;
}

function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!on)} style={{ width: 32, height: 18, borderRadius: 9, background: on ? DO.blue : "#C7CEDB", position: "relative", cursor: "pointer", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 2, left: on ? 16 : 2, width: 14, height: 14, borderRadius: 7, background: DO.white }} />
    </div>
  );
}

function Radio({ on }: { on: boolean }) {
  return (
    <div style={{ width: 16, height: 16, borderRadius: 8, border: `1.5px solid ${on ? DO.blue : "#B5BECF"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {on && <div style={{ width: 8, height: 8, borderRadius: 4, background: DO.blue }} />}
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return <span style={{ fontSize: 12, color: DO.text2, background: DO.page, border: `1px solid ${DO.border}`, borderRadius: 14, padding: "3px 10px", whiteSpace: "nowrap" }}>{children}</span>;
}

function DTable({ headers, rows, tones }: { headers: string[]; rows: ReactNode[][]; tones?: (Tone | undefined)[] }) {
  return (
    <div style={{ border: `1px solid ${DO.border}`, borderRadius: 8, overflow: "hidden", background: DO.white }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))`, background: DO.page, borderBottom: `1px solid ${DO.border}` }}>
        {headers.map((h) => (
          <div key={h} style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, color: DO.text2, textTransform: "uppercase", letterSpacing: 0.3 }}>{h}</div>
        ))}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))`, borderBottom: i < rows.length - 1 ? `1px solid ${DO.border}` : "none", alignItems: "center" }}>
          {r.map((c, j) => (
            <div key={j} style={{ padding: "10px 12px", fontSize: 12.5, color: DO.text, display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
              {j === 0 && tones?.[i] && <span style={{ width: 6, height: 6, borderRadius: 6, flexShrink: 0, background: { ok: DO.greenDot, warn: DO.amberDot, bad: DO.redDot, info: DO.blue, draft: DO.text3, neutral: DO.text3 }[tones[i] as Tone] }} />}
              {c}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function KV({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <T size={12.5} color={DO.text2} style={{ width: 140, flexShrink: 0 }}>{k}</T>
      <T size={12.5}>{v}</T>
    </div>
  );
}

function Mono({ children }: { children: ReactNode }) {
  return <div style={{ fontFamily: "monospace", fontSize: 12, background: DO.page, border: `1px solid ${DO.border}`, borderRadius: 6, padding: "8px 10px", color: DO.text, whiteSpace: "pre-wrap" }}>{children}</div>;
}

function IconTile({ name, color = DO.blue, bg = DO.blueTint, size = 28 }: { name: IconName; color?: string; bg?: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 6, background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Ico name={name} size={size * 0.55} />
    </div>
  );
}

function Stepper({ at }: { at: number }) {
  const steps = ["Start", "Understand", "Choose", "Review", "Approve"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
      {steps.map((st, i) => (
        <div key={st} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", background: i <= at ? DO.blue : DO.white, color: i <= at ? DO.white : DO.text3, border: i <= at ? "none" : `1px solid ${DO.border}` }}>
              {i < at ? <Ico name="check" size={12} width={2} /> : i + 1}
            </div>
            <T size={12.5} weight={i === at ? 600 : 400} color={i === at ? DO.text : DO.text3}>{st}</T>
          </div>
          {i < steps.length - 1 && <div style={{ width: 28, height: 1, background: DO.border }} />}
        </div>
      ))}
    </div>
  );
}

function PageHeader({ title, sub, crumb, right, icon }: { title: string; sub?: string; crumb?: string; right?: ReactNode; icon?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {icon && (
        <div style={{ width: 44, height: 44, borderRadius: 8, background: DO.teal, display: "flex", alignItems: "center", justifyContent: "center", color: DO.white }}>
          <Ico name="sparkle" size={22} color={DO.white} />
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
        {crumb && <T size={12} color={DO.text3}>{crumb}</T>}
        <T size={24} weight={700} color={DO.navy}>{title}</T>
        {sub && <T size={13} color={DO.text2}>{sub}</T>}
      </div>
      {right}
    </div>
  );
}

function Tabs({ items, active }: { items: string[]; active: string }) {
  return (
    <div style={{ display: "flex", gap: 22, borderBottom: `1px solid ${DO.border}` }}>
      {items.map((it) => (
        <div key={it} style={{ padding: "8px 2px", fontSize: 13, fontWeight: it === active ? 600 : 400, color: it === active ? DO.text : DO.text2, borderBottom: it === active ? `2px solid ${DO.blue}` : "2px solid transparent", marginBottom: -1 }}>
          {it}
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <T size={13} weight={600} color={DO.text}>{children}</T>;
}

/* ------------------------------------------------------------------ */
/* Scenarios                                                           */
/* ------------------------------------------------------------------ */

type ScenarioId = "health" | "fin" | "kit";
type Line = { name: string; kind: string; why: string; price: number; usage?: string; cli?: string };
type Guard = { id: string; name: string; what: string; price: number; priceText: string; defaultOn: boolean };

type Scenario = {
  id: ScenarioId;
  project: string;
  repo?: string;
  owner: string;
  context: string;
  found: [string, string, string][];
  env: string;
  purpose: string;
  signal?: { title: string; body: string };
  guards: Guard[];
  lines: Line[];
  hipaaLines?: Line[];
  swaps?: [string, string, string][];
  ask: string;
  pauseAt: number;
  usageEstimate: number;
  scopes: string[];
  hipaaScopes?: string[];
  proof: { q: string; a: string };
  hipaaProof?: { q: string; a: string };
};

const SCENARIOS: Record<ScenarioId, Scenario> = {
  health: {
    id: "health",
    project: "clinic-notes",
    repo: "brightpath/clinic-notes",
    owner: "priya@brightpath.health",
    context: "A two-person team built a visit-notes app for a small clinic network with a coding agent. Nothing runs on DigitalOcean yet.",
    found: [
      ["Web app", "package.json: next build / next start", "App Platform web service"],
      ["Postgres", "prisma/schema.prisma provider = postgresql", "Managed Postgres"],
      ["File uploads", "@aws-sdk/client-s3 in lib/upload.ts", "Spaces bucket (private)"],
      ["Notes search", "embeddings call in lib/search.ts", "Knowledge base"],
    ],
    env: "Production",
    purpose: "Web app with health records",
    signal: {
      title: "This looks like it stores health records",
      body: "Found patient_id, dob and diagnosis_code in prisma/schema.prisma, and the fhir-kit-client package. We suggest HIPAA mode. It changes which products the plan can use.",
    },
    guards: [
      { id: "hipaa", name: "HIPAA mode", what: "Uses only products on DigitalOcean's HIPAA-eligible list and swaps out the rest. Sign DigitalOcean's BAA (through Sales) before storing patient data.", price: 0, priceText: "$0", defaultOn: true },
      { id: "vpc", name: "Private networking and firewall", what: "Web and database Droplets on one VPC. Only 443 is open, on the load balancer. The database accepts traffic from web-1 only.", price: 0, priceText: "$0", defaultOn: true },
      { id: "backup", name: "Droplet backups", what: "Weekly backups of web-1 and db-1, kept 4 weeks. 20% of the Droplet price.", price: 7.2, priceText: "+$7.20/mo", defaultOn: true },
      { id: "cspm", name: "CSPM Basic on 2 workloads", what: "Checks web-1 and db-1 for open ports and weak settings, $5 per workload. Scans are manual today; the plan would run one after deploy and after every change.", price: 10, priceText: "+$10/mo", defaultOn: true },
    ],
    lines: [
      { name: "web", kind: "App Platform · 1 GB", why: "package.json has next build / next start", price: 12, cli: "doctl apps get clinic-notes" },
      { name: "postgres", kind: "Managed Postgres 16 · 1 GB", why: "Prisma provider is postgresql", price: 15.15, cli: "doctl databases get clinic-postgres" },
      { name: "uploads", kind: "Spaces bucket", why: "S3 client used in lib/upload.ts", price: 5 },
      { name: "notes-kb", kind: "Knowledge base + OpenSearch 2 GB", why: "Embeddings call in lib/search.ts", price: 19.6, usage: "embeddings from $0.009/1M tokens" },
    ],
    hipaaLines: [
      { name: "lb", kind: "Load Balancer", why: "Serves HTTPS and keeps web-1 off the public internet", price: 12 },
      { name: "web-1", kind: "Droplet · 2 GB", why: "Runs the Next.js app in Docker. App Platform is not HIPAA-eligible.", price: 12, cli: "doctl compute droplet get web-1" },
      { name: "db-1", kind: "Droplet · 4 GB + 50 GB Volume", why: "Postgres 16 with pgvector. Managed Databases are not HIPAA-eligible.", price: 29, cli: "doctl compute droplet get db-1" },
      { name: "uploads", kind: "Spaces bucket (private)", why: "S3 client used in lib/upload.ts. Spaces is eligible.", price: 5 },
    ],
    swaps: [
      ["App Platform web service", "Droplet behind a Load Balancer", "App Platform is not on the eligible list"],
      ["Managed Postgres", "Postgres on a Droplet with a Volume", "Managed Databases are not on the eligible list"],
      ["Knowledge base for note search", "pgvector inside db-1", "Knowledge Bases are not on the eligible list"],
      ["Spaces bucket", "Spaces bucket (no change)", "Eligible"],
    ],
    ask: "Deploy clinic-notes from GitHub. It stores patient notes, so keep it HIPAA-ready. Keep it under $80 a month.",
    pauseAt: 40,
    usageEstimate: 8,
    scopes: ["app:create", "database:create", "spaces:create", "genai:create", "vpc:create"],
    hipaaScopes: ["droplet:create", "load_balancer:create", "block_storage:create", "spaces:create", "vpc:create", "firewall:create"],
    proof: { q: "GET /api/health and one test note search", a: "clinic-notes-x7k2.ondigitalocean.app returned 200. Prisma migrations applied (11 tables). A search for \"follow-up in 2 weeks\" returned 3 test notes." },
    hipaaProof: { q: "GET https://notes.brightpath.health/api/health and one test note search", a: "Returned 200 through the load balancer. Prisma migrations applied (11 tables). A pgvector search for \"follow-up in 2 weeks\" returned 3 test notes. db-1 refused a connection from outside the VPC." },
  },
  fin: {
    id: "fin",
    project: "ledger-app",
    repo: "northgate/ledger-app",
    owner: "sam@northgate.dev",
    context: "An agency builds invoicing software for a client. They want to pick every resource themselves but still see price and posture.",
    found: [
      ["API", "Dockerfile + gunicorn in Procfile", "Droplet or App Platform"],
      ["Postgres", "django.db.backends.postgresql", "Managed Postgres"],
      ["Cache / queue", "celery + REDIS_URL", "Managed Valkey"],
    ],
    env: "Production",
    purpose: "Payments and invoicing",
    signal: {
      title: "This handles payment data",
      body: "Found the stripe and plaid packages and an iban column in migrations. Keep card data with Stripe so this app stays out of card-data scope. DigitalOcean's PCI-DSS attestation (SAQ-A) covers its admin environment, not your app.",
    },
    guards: [
      { id: "cspm", name: "CSPM Basic on 2 workloads", what: "Checks api-1 and ledger-db for open ports and weak settings, $5 per workload. Scans are manual today; the plan would run one after deploy and after every change.", price: 10, priceText: "+$10/mo", defaultOn: true },
      { id: "fw", name: "Cloud Firewall", what: "Only 443 open to the internet; SSH from your office IP only.", price: 0, priceText: "$0", defaultOn: true },
      { id: "vpc", name: "Private networking", what: "Droplet, database and Valkey on one VPC. Database accepts trusted sources only.", price: 0, priceText: "$0", defaultOn: true },
      { id: "backup", name: "Droplet backups", what: "Weekly backups kept 4 weeks.", price: 4.8, priceText: "+$4.80/mo", defaultOn: false },
    ],
    lines: [
      { name: "api-1", kind: "Droplet · 2 vCPU / 4 GB", why: "You picked it", price: 24, cli: "doctl compute droplet get api-1" },
      { name: "ledger-db", kind: "Managed Postgres 16 · 1 GB", why: "You picked it", price: 15.15, cli: "doctl databases get ledger-db" },
      { name: "jobs-cache", kind: "Managed Valkey · 1 GB", why: "You picked it", price: 15 },
    ],
    ask: "",
    pauseAt: 0,
    usageEstimate: 0,
    scopes: ["droplet:create", "database:create", "firewall:create", "vpc:create"],
    proof: { q: "GET https://api-1/health and a test Celery job", a: "api-1 returned 200 over HTTPS. Django migrations applied (38 tables). A test Celery job ran through jobs-cache in 1.2 s." },
  },
  kit: {
    id: "kit",
    project: "support-bot",
    owner: "maya@acme.io",
    context: "A founder has no repo yet. They want a support chatbot over their help docs and start from a written description.",
    found: [
      ["Chat app", "From your description", "App Platform"],
      ["Model", "From your description", "Agent Platform"],
      ["Docs search", "From your description", "Knowledge base"],
      ["Safety", "Customer-facing chat", "Guardrails"],
    ],
    env: "Production",
    purpose: "Customer support chatbot",
    guards: [
      { id: "sdd", name: "Sensitive data detection", what: "Stops customer emails and card numbers from appearing in answers.", price: 0, priceText: "$0.34/1M tokens", defaultOn: true },
      { id: "jb", name: "Jailbreak detection", what: "Blocks prompts that try to override your instructions.", price: 0, priceText: "$0.20/1M tokens", defaultOn: true },
      { id: "cm", name: "Content moderation", what: "Filters violent, sexual or self-harm content out of answers.", price: 0, priceText: "$0.20/1M tokens", defaultOn: true },
    ],
    lines: [
      { name: "chatbot", kind: "App Platform · 1 vCPU / 2 GB", why: "Hosts the chat widget and API", price: 25, cli: "doctl apps get support-bot" },
      { name: "agent", kind: "Agent Platform", why: "Answers questions; default model nemotron-3-super-120b", price: 0, usage: "$0.30/1M tokens" },
      { name: "help-kb", kind: "Knowledge base + OpenSearch 2 GB", why: "Indexes help.acme.io", price: 19.6, usage: "embeddings $0.04/1M tokens" },
    ],
    ask: "A support chatbot that answers from help.acme.io. Keep usage under $30 a month.",
    pauseAt: 30,
    usageEstimate: 6,
    scopes: ["app:create", "genai:create"],
    proof: { q: "How do I reset my password?", a: "Go to Settings, then Security, and choose Reset password. You will get an email within a minute. Source: help.acme.io/account/reset" },
  },
};

type Guards = Record<string, boolean>;

function linesFor(sc: Scenario, g: Guards): Line[] {
  return g.hipaa && sc.hipaaLines ? sc.hipaaLines : sc.lines;
}

function usageFor(sc: Scenario, g: Guards) {
  const has = linesFor(sc, g).some((l) => l.usage);
  return { pauseAt: has ? sc.pauseAt : 0, estimate: has ? sc.usageEstimate : 0 };
}

function money(n: number) {
  return `$${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}

function fixedTotal(sc: Scenario, g: Guards, extra: Line[] = []) {
  return [...linesFor(sc, g), ...extra].reduce((a, l) => a + l.price, 0) + sc.guards.filter((x) => g[x.id]).reduce((a, x) => a + x.price, 0);
}

/* ------------------------------------------------------------------ */
/* Resource map layouts                                                */
/* ------------------------------------------------------------------ */

type MapNode = { id: string; x: number; y: number; external?: { title: string; kind: string; icon: IconName } };
type MapEdge = { from: string; to: string; label?: string };
type MapDef = { w: number; h: number; nodes: MapNode[]; edges: MapEdge[]; group: { x: number; y: number; w: number; h: number } };

const NW = 150;
const NH = 70;

const MAPS: Record<string, MapDef> = {
  "health-hipaa": {
    w: 860, h: 300,
    nodes: [
      { id: "internet", x: 14, y: 115, external: { title: "Internet", kind: "Clinic staff", icon: "globe" } },
      { id: "lb", x: 224, y: 115 },
      { id: "web-1", x: 444, y: 115 },
      { id: "db-1", x: 690, y: 40 },
      { id: "uploads", x: 690, y: 190 },
      { id: "worker-1", x: 444, y: 215 },
    ],
    edges: [
      { from: "internet", to: "lb", label: "HTTPS" },
      { from: "lb", to: "web-1", label: "VPC" },
      { from: "web-1", to: "db-1", label: "DATABASE_URL" },
      { from: "web-1", to: "uploads", label: "SPACES_KEY" },
      { from: "worker-1", to: "db-1", label: "jobs" },
    ],
    group: { x: 210, y: 14, w: 640, h: 278 },
  },
  health: {
    w: 860, h: 300,
    nodes: [
      { id: "internet", x: 14, y: 115, external: { title: "Internet", kind: "Clinic staff", icon: "globe" } },
      { id: "web", x: 224, y: 115 },
      { id: "postgres", x: 444, y: 40 },
      { id: "uploads", x: 444, y: 190 },
      { id: "notes-kb", x: 690, y: 190 },
    ],
    edges: [
      { from: "internet", to: "web" },
      { from: "web", to: "postgres", label: "DATABASE_URL" },
      { from: "web", to: "uploads" },
      { from: "uploads", to: "notes-kb", label: "indexed" },
    ],
    group: { x: 210, y: 14, w: 640, h: 278 },
  },
  fin: {
    w: 860, h: 300,
    nodes: [
      { id: "internet", x: 14, y: 115, external: { title: "Internet", kind: "Client's customers", icon: "globe" } },
      { id: "api-1", x: 224, y: 115 },
      { id: "ledger-db", x: 444, y: 40 },
      { id: "jobs-cache", x: 444, y: 190 },
      { id: "files", x: 690, y: 40 },
      { id: "lb-1", x: 690, y: 115 },
      { id: "api-2", x: 690, y: 190 },
    ],
    edges: [
      { from: "internet", to: "api-1", label: "443" },
      { from: "api-1", to: "ledger-db", label: "VPC" },
      { from: "api-1", to: "jobs-cache", label: "REDIS_URL" },
    ],
    group: { x: 210, y: 14, w: 640, h: 278 },
  },
  kit: {
    w: 860, h: 300,
    nodes: [
      { id: "users", x: 14, y: 90, external: { title: "Website visitors", kind: "Chat widget", icon: "globe" } },
      { id: "chatbot", x: 224, y: 90 },
      { id: "agent", x: 444, y: 90 },
      { id: "help-kb", x: 690, y: 90 },
      { id: "source", x: 690, y: 215, external: { title: "help.acme.io", kind: "Your help center", icon: "doc" } },
    ],
    edges: [
      { from: "users", to: "chatbot" },
      { from: "chatbot", to: "agent", label: "access key" },
      { from: "agent", to: "help-kb", label: "retrieve" },
      { from: "source", to: "help-kb", label: "crawl" },
    ],
    group: { x: 210, y: 14, w: 640, h: 180 },
  },
};

function mapKey(sc: Scenario, g: Guards) {
  return sc.id === "health" ? (g.hipaa ? "health-hipaa" : "health") : sc.id;
}

/* ------------------------------------------------------------------ */
/* Navigation state                                                    */
/* ------------------------------------------------------------------ */

type ScreenId =
  | "home" | "start" | "github" | "analysis" | "compliance" | "mode" | "kits" | "ask" | "plan" | "manual" | "empty"
  | "approve" | "deploy" | "project" | "add" | "diff" | "alertEmail" | "alertConsole" | "brief" | "pause" | "undo" | "export" | "agent";

type Mode = "vibe" | "manual";
type StartChoice = "github" | "describe" | "empty";

type Ctx = {
  screen: ScreenId;
  sc: Scenario;
  go: (s: ScreenId) => void;
  back: () => void;
  canBack: boolean;
  pickScenario: (id: ScenarioId, then?: ScreenId) => void;
  guards: Guards;
  setGuard: (id: string, v: boolean) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  modeOf: (id: ScenarioId) => Mode;
  guardsOf: (id: ScenarioId) => Guards;
  missingScope: boolean;
  setMissingScope: (v: boolean) => void;
  extra: Line[];
  addExtra: (l: Line) => void;
  created: ScenarioId[];
  markCreated: () => void;
  change: boolean;
  setChange: (v: boolean) => void;
  fixed: boolean;
  setFixed: (v: boolean) => void;
  raised: boolean;
  setRaised: (v: boolean) => void;
  startChoice: StartChoice;
  setStartChoice: (c: StartChoice) => void;
  tour: ScenarioId | null;
  tips: boolean;
  setTips: (v: boolean) => void;
};

const Nav = createContext<Ctx | null>(null);

function useNav(): Ctx {
  const c = useContext(Nav);
  if (!c) throw new Error("Nav context missing");
  return c;
}

/* ------------------------------------------------------------------ */
/* Walkthrough tip                                                     */
/* ------------------------------------------------------------------ */

function Hint({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: DO.blueTint, borderLeft: `3px solid ${DO.blue}`, borderRadius: 6, padding: "8px 12px" }}>
      <div style={{ paddingTop: 1 }}><Ico name="sparkle" size={14} color={DO.blue} /></div>
      <span style={{ fontSize: 12.5, color: DO.navy, lineHeight: 1.45 }}>{text}</span>
    </div>
  );
}

function Tip({ text, children, place = "right", show = true, block }: { text: string; children: ReactNode; place?: "left" | "right" | "top" | "bottom"; show?: boolean; block?: boolean }) {
  const { tips } = useNav();
  const on = tips && show;
  if (!on) return block ? <div>{children}</div> : <>{children}</>;
  const ring = (child: ReactNode, full?: boolean) => (
    <div style={{ position: "relative", display: full ? "block" : "inline-block", width: full ? "fit-content" : undefined, maxWidth: "100%" }}>
      <div className="do-pulse" style={{ position: "absolute", inset: -4, borderRadius: 10, pointerEvents: "none" }} />
      {child}
    </div>
  );
  if (block) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Hint text={text} />
        {ring(children, true)}
      </div>
    );
  }
  const left = place === "left";
  const chip = (
    <div style={{ position: "relative", maxWidth: 260, background: DO.navy, color: DO.white, borderRadius: 8, padding: "7px 10px", fontSize: 12, lineHeight: 1.4, fontWeight: 400, whiteSpace: "normal", textAlign: "left", flexShrink: 1 }}>
      {text}
      <span style={{ position: "absolute", top: "50%", marginTop: -5, width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", ...(left ? { left: "100%", borderLeft: `5px solid ${DO.navy}` } : { right: "100%", borderRight: `5px solid ${DO.navy}` }) }} />
    </div>
  );
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
      {left && chip}
      {ring(children)}
      {!left && chip}
    </div>
  );
}

function BackLink() {
  const { back, canBack } = useNav();
  if (!canBack) return null;
  return (
    <div onClick={back} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 4, cursor: "pointer", color: DO.blue, fontSize: 12.5, fontWeight: 600 }}>
      <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}><Ico name="arrow" size={13} /></span>
      Back
    </div>
  );
}


/* ------------------------------------------------------------------ */
/* Resource map                                                        */
/* ------------------------------------------------------------------ */

type NodeState = [Tone, string];

function ResourceMap({
  map, lines, mode, overrides, draftIds, groupLabel, groupRight, meter, selected, onSelect,
}: {
  map: MapDef;
  lines: Line[];
  mode: "draft" | "live";
  overrides?: Record<string, NodeState>;
  draftIds?: string[];
  groupLabel: string;
  groupRight: string;
  meter?: { text: string; pct: number; warn?: boolean };
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const byLine: Record<string, Line> = {};
  lines.forEach((l) => (byLine[l.name] = l));
  const nodes = map.nodes.filter((n) => n.external || byLine[n.id]);
  const pos: Record<string, MapNode> = {};
  nodes.forEach((n) => (pos[n.id] = n));
  const edges = map.edges.filter((e) => pos[e.from] && pos[e.to]);
  const g = map.group;
  const groupDraft = mode === "draft";

  const state = (id: string): NodeState => {
    if (overrides?.[id]) return overrides[id];
    if (mode === "draft" || draftIds?.includes(id)) return ["draft", "Not created yet · $0"];
    return ["ok", "Healthy"];
  };

  const geo = (e: MapEdge) => {
    const a = pos[e.from];
    const b = pos[e.to];
    if (Math.abs(a.x - b.x) < 10) {
      const x = a.x + NW / 2;
      const up = b.y < a.y;
      const y1 = up ? a.y : a.y + NH;
      const y2 = up ? b.y + NH : b.y;
      return { d: `M ${x} ${y1} L ${x} ${y2}`, lx: x + 26, ly: (y1 + y2) / 2 + 4 };
    }
    const x1 = a.x + NW, y1 = a.y + NH / 2, x2 = b.x, y2 = b.y + NH / 2, mx = (x1 + x2) / 2;
    return { d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`, lx: mx, ly: (y1 + y2) / 2 - 6 };
  };

  return (
    <div
      onClick={(ev: { target: unknown; currentTarget: unknown }) => {
        if (ev.target === ev.currentTarget) onSelect(null);
      }}
      style={{ position: "relative", width: map.w, height: map.h, background: DO.page, border: `1px solid ${DO.border}`, borderRadius: 8, overflow: "hidden", flexShrink: 0, backgroundImage: `radial-gradient(${DO.border} 1px, transparent 1px)`, backgroundSize: "16px 16px" }}
    >
      <div style={{ position: "absolute", left: g.x, top: g.y, width: g.w, height: g.h, borderRadius: 10, border: `1px ${groupDraft ? "dashed" : "solid"} ${groupDraft ? "#9FB3D9" : DO.border}`, background: groupDraft ? "rgba(0,105,255,0.03)" : DO.white, boxSizing: "border-box", padding: "8px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <T size={11} weight={600} color={DO.text2}>{groupLabel}</T>
          <T size={11} color={DO.text3}>{groupRight}</T>
        </div>
        {meter && (
          <div style={{ position: "absolute", left: 12, right: 12, bottom: 8 }}>
            <T size={10.5} color={DO.text3}>{meter.text}</T>
            <div style={{ height: 4, borderRadius: 2, background: DO.border, marginTop: 3 }}>
              <div style={{ height: 4, borderRadius: 2, width: `${Math.max(meter.pct, 1)}%`, background: meter.warn ? DO.amberDot : DO.greenDot }} />
            </div>
          </div>
        )}
      </div>
      <svg width={map.w} height={map.h} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {edges.map((e) => {
          const p = geo(e);
          const dashed = state(e.to)[0] === "draft" || state(e.from)[0] === "draft";
          return (
            <g key={`${e.from}-${e.to}`}>
              <path d={p.d} fill="none" stroke={dashed ? "#9FB3D9" : "#8FA0BF"} strokeWidth={1.2} strokeDasharray={dashed ? "4 4" : undefined} />
              {e.label && <text x={p.lx} y={p.ly} fontSize={9.5} fill={DO.text3} textAnchor="middle" fontFamily={DO.font} stroke={DO.page} strokeWidth={3} paintOrder="stroke">{e.label}</text>}
            </g>
          );
        })}
      </svg>
      {nodes.map((n) => {
        const line = byLine[n.id];
        const ext = n.external;
        const [tone, text] = ext ? (["neutral", ext.kind] as NodeState) : state(n.id);
        const draft = tone === "draft";
        const sel = selected === n.id;
        const kind = ext ? "External" : line.kind;
        const icon = ext ? ext.icon : iconFor(line.kind);
        const dot = { ok: DO.greenDot, warn: DO.amberDot, bad: DO.redDot, draft: "transparent", info: DO.blue, neutral: DO.text3 }[tone];
        return (
          <div
            key={n.id}
            onClick={() => !ext && onSelect(sel ? null : n.id)}
            style={{
              position: "absolute", left: n.x, top: n.y, width: NW, height: NH, boxSizing: "border-box", padding: "8px 10px", borderRadius: 8,
              background: draft ? "#FAFCFF" : DO.white, cursor: ext ? "default" : "pointer", display: "flex", flexDirection: "column", gap: 3,
              border: sel ? `1px solid ${DO.blue}` : `1px ${draft ? "dashed" : "solid"} ${tone === "bad" ? DO.redDot : draft ? "#9FB3D9" : DO.border}`,
              boxShadow: sel ? `0 0 0 2px ${DO.blue}` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <IconTile name={icon} size={20} color={ext ? DO.text2 : DO.blue} bg={ext ? DO.page : DO.blueTint} />
              <T size={12.5} weight={600} color={draft ? DO.text2 : DO.text} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ext ? ext.title : n.id}</T>
            </div>
            <T size={10.5} color={DO.text3} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{kind}</T>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: "auto" }}>
              {!ext && <span style={{ width: 6, height: 6, borderRadius: 6, background: dot, border: draft ? `1px dashed ${DO.text3}` : "none", flexShrink: 0 }} />}
              <T size={10.5} color={tone === "bad" ? DO.red : DO.text2} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ext ? "" : text}</T>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DetailCell({ label, children, grow }: { label: string; children: ReactNode; grow?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: grow ? 2 : 1 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: DO.text3, textTransform: "uppercase", letterSpacing: 0.3 }}>{label}</span>
      <span style={{ fontSize: 12.5, color: DO.text, lineHeight: 1.45 }}>{children}</span>
    </div>
  );
}

function NodeDrawer({ line, tone, stateText, onClose, width }: { line: Line; tone: Tone; stateText: string; onClose: () => void; width: number }) {
  return (
    <div style={{ width, maxWidth: "100%", boxSizing: "border-box", background: DO.white, border: `1px solid ${DO.border}`, borderTop: `3px solid ${DO.blue}`, borderRadius: 8, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${DO.border}` }}>
        <IconTile name={iconFor(line.kind)} size={30} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <T size={14} weight={700}>{line.name}</T>
          <T size={12} color={DO.text2}>{line.kind}</T>
        </div>
        <Badge tone={tone}>{stateText}</Badge>
        <div onClick={onClose} style={{ cursor: "pointer", color: DO.text3, fontSize: 18, lineHeight: 1, padding: "0 4px" }}>×</div>
      </div>
      <div style={{ display: "flex", gap: 24, padding: "14px 16px" }}>
        <DetailCell label="Why it exists" grow>{line.why}</DetailCell>
        <DetailCell label="Cost">{line.price ? `${money(line.price)}/mo` : "$0 fixed"}{line.usage && <><br /><span style={{ color: DO.text2 }}>{`+ ${line.usage}`}</span></>}</DetailCell>
        <DetailCell label="Same object in doctl" grow>
          {line.cli ? <span style={{ fontFamily: "monospace", fontSize: 12, background: DO.page, border: `1px solid ${DO.border}`, borderRadius: 4, padding: "3px 6px", display: "inline-block" }}>{line.cli}</span> : <span style={{ color: DO.text3 }}>Managed in the console</span>}
        </DetailCell>
      </div>
    </div>
  );
}

function MapWithDrawer(props: {
  map: MapDef; lines: Line[]; mode: "draft" | "live"; overrides?: Record<string, NodeState>; draftIds?: string[];
  groupLabel: string; groupRight: string; meter?: { text: string; pct: number; warn?: boolean };
}) {
  const [sel, setSel] = useState<string | null>(null);
  const line = props.lines.find((l) => l.name === sel);
  const [tone, st]: NodeState =
    sel && props.overrides?.[sel] ? props.overrides[sel] : props.mode === "draft" || (sel && props.draftIds?.includes(sel)) ? ["draft", "Not created · $0 until approved"] : ["ok", "Healthy"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <ResourceMap {...props} selected={sel} onSelect={setSel} />
      {line ? (
        <NodeDrawer line={line} tone={tone} stateText={st} onClose={() => setSel(null)} width={props.map.w} />
      ) : (
        <T size={12} color={DO.text3}>Click a box to see why it exists, what it costs, and the same object in doctl.</T>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Summary panel (Launchpad style)                                     */
/* ------------------------------------------------------------------ */

function Summary({ sc, guards, cta, onCta, extra, disabled }: { sc: Scenario; guards: Guards; cta?: string; onCta?: () => void; extra?: Line[]; disabled?: boolean }) {
  const lines = [...linesFor(sc, guards), ...(extra ?? [])];
  const onGuards = sc.guards.filter((x) => guards[x.id]);
  const u = usageFor(sc, guards);
  const total = fixedTotal(sc, guards, extra);
  return (
    <div style={{ width: 260, flexShrink: 0, background: DO.white, border: `1px solid ${DO.border}`, borderRadius: 8, alignSelf: "flex-start", overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${DO.border}` }}>
        <T size={14} weight={700}>Summary</T>
      </div>
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {lines.map((l) => (
          <div key={l.name} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ color: DO.text2, paddingTop: 2 }}><Ico name={iconFor(l.kind)} size={15} /></div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
              <T size={12.5} weight={600}>{l.name}</T>
              <T size={11.5} color={DO.text3}>{l.kind}</T>
              {l.usage && <T size={11.5} color={DO.text3}>{l.usage}</T>}
            </div>
            <T size={12.5} weight={600}>{l.price ? `${money(l.price)}/mo` : "Variable"}</T>
          </div>
        ))}
        {onGuards.length > 0 && <div style={{ height: 1, background: DO.border }} />}
        {onGuards.map((x) => (
          <div key={x.id} style={{ display: "flex", gap: 10 }}>
            <div style={{ color: DO.text2, paddingTop: 2 }}><Ico name="shield" size={15} /></div>
            <T size={12} color={DO.text2} style={{ flex: 1 }}>{x.name}</T>
            <T size={12} color={DO.text2}>{x.priceText}</T>
          </div>
        ))}
      </div>
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${DO.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex" }}>
          <T size={13} color={DO.text2} style={{ flex: 1 }}>Monthly cost</T>
          <T size={13} weight={700}>{`${money(total)}/mo${u.pauseAt ? " + usage" : ""}`}</T>
        </div>
        {u.pauseAt > 0 && <T size={11.5} color={DO.text3}>{`Usage expected about ${money(u.estimate)}. Pauses at ${money(u.pauseAt)}; the app stays up.`}</T>}
        {guards.hipaa && (
          <>
            <Badge tone="ok">Every part HIPAA-eligible</Badge>
            <Badge tone="warn">BAA not signed yet</Badge>
          </>
        )}
        {sc.hipaaLines && !guards.hipaa && <Badge tone="bad">3 parts can't hold patient data</Badge>}
        <T size={11.5} color={DO.text3}>
          Nothing bills until you approve. By selecting Approve, I agree to the DigitalOcean <span style={{ color: DO.blue }}>Terms of Service</span>.
        </T>
        {cta && <Btn full onClick={onCta} disabled={disabled}>{cta}</Btn>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Frames                                                              */
/* ------------------------------------------------------------------ */

function NavItem({ label, active, badge, icon, dim, onClick }: { label: string; active?: boolean; badge?: string; icon?: ReactNode; dim?: boolean; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", margin: "0 6px", borderRadius: 4, background: active ? DO.navyActive : "transparent", cursor: onClick ? "pointer" : "default" }}>
      {icon}
      <span style={{ fontSize: 12.5, color: active ? DO.white : dim ? DO.navyHeader : DO.navyText, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      {badge && <span style={{ fontSize: 9, fontWeight: 700, color: DO.navy, background: "#9FE6FF", borderRadius: 3, padding: "1px 4px" }}>{badge}</span>}
    </div>
  );
}

function NavHeader({ label, open }: { label: string; open?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "12px 20px 4px", color: DO.navyHeader }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, flex: 1 }}>{label}</span>
      <div style={{ transform: open ? "rotate(180deg)" : "none" }}><Ico name="chevron" size={12} color={DO.navyHeader} /></div>
    </div>
  );
}

type Note = { title: string; sub: string; tone: Tone; sc: ScenarioId; to?: ScreenId };

function notesFor(ctx: Ctx): Note[] {
  const out: Note[] = [];
  if (ctx.created.includes("kit")) {
    if (!ctx.fixed) out.push({ title: "support-bot stopped answering", sub: "Day 9 · hourly check failed", tone: "bad", sc: "kit", to: "alertEmail" });
    out.push({ title: "Weekly brief · support-bot", sub: "Week 6 · 2 upkeep drafts", tone: "info", sc: "kit", to: "brief" });
    if (!ctx.raised) out.push({ title: "support-bot reached its pause point", sub: "Month 3 · usage paused, app still up", tone: "warn", sc: "kit", to: "pause" });
  }
  if (ctx.created.includes("health")) out.push({ title: "clinic-notes · CSPM scan passed", sub: "web-1 and db-1 · 0 critical", tone: "ok", sc: "health" });
  if (ctx.created.includes("fin")) out.push({ title: "ledger-app · CSPM scan passed", sub: "api-1 and ledger-db · 0 critical", tone: "ok", sc: "fin" });
  return out;
}

function ConsoleFrame({ children, active }: { children: ReactNode; active: string }) {
  const ctx = useNav();
  const [bell, setBell] = useState(false);
  const notes = notesFor(ctx);
  const urgent = notes.filter((n) => n.to).length;
  const bellTip = ctx.screen === "project" && ctx.sc.id === "kit" && notes.some((n) => n.to);
  return (
    <div style={{ fontFamily: DO.font, display: "flex", minHeight: "100vh", background: DO.page, color: DO.text }}>
      <div style={{ width: 200, flexShrink: 0, background: DO.navy, display: "flex", flexDirection: "column", paddingBottom: 16 }}>
        <div onClick={() => ctx.go("home")} style={{ padding: "14px 18px 10px", cursor: "pointer" }}><DoLogo /></div>
        <NavItem label="Home" active={active === "Home"} onClick={() => ctx.go("home")} />
        <NavItem label="Starter kits" active={active === "Starter kits"} onClick={() => ctx.go("kits")} />
        <NavHeader label="PROJECTS" open />
        <NavItem
          label="New Project"
          active={active === "New project"}
          onClick={() => ctx.go("start")}
          icon={<span style={{ width: 16, height: 16, borderRadius: 3, background: DO.blue, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico name="plus" size={11} color={DO.white} width={2} /></span>}
        />
        <NavItem label="first-project" />
        <NavItem label="NewsAgent" />
        {ctx.created.map((id) => (
          <NavItem key={id} label={SCENARIOS[id].project} active={active === SCENARIOS[id].project} onClick={() => ctx.pickScenario(id, "project")} />
        ))}
        <NavHeader label="FAVORITES" open />
        <NavItem label="Star Your Favorite" dim />
        <NavHeader label="MANAGED AGENTS" open />
        <NavItem label="Harness Runtime" badge="NEW" />
        <NavItem label="Action Gateway" badge="NEW" />
        {["INFERENCE ENGINE", "DATA & LEARNING", "CORE CLOUD", "MARKETPLACE", "SECURITY", "ACCOUNT"].map((h) => <NavHeader key={h} label={h} />)}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{ height: 56, background: DO.white, borderBottom: `1px solid ${DO.border}`, display: "flex", alignItems: "center", gap: 14, padding: "0 20px", position: "relative", zIndex: 20 }}>
          <div style={{ width: 320, display: "flex", alignItems: "center", gap: 8, border: `1px solid ${DO.border}`, borderRadius: 18, padding: "7px 12px", color: DO.text3 }}>
            <Ico name="search" size={13} />
            <span style={{ fontSize: 12 }}>Search by resource name or public IP (Cmd+B)</span>
          </div>
          <div style={{ flex: 1 }} />
          <div onClick={() => ctx.go("start")} style={{ display: "flex", alignItems: "center", gap: 4, background: DO.blue, color: DO.white, borderRadius: 16, padding: "6px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
            Create <Ico name="chevron" size={12} color={DO.white} />
          </div>
          <div style={{ color: DO.text2, display: "flex", gap: 12, alignItems: "center" }}>
            <Ico name="help" size={17} />
            <Tip text="Jump ahead in time. Each notification opens what the owner sees on that day." place="left" show={bellTip && !bell}>
              <div onClick={() => setBell(!bell)} style={{ position: "relative", cursor: "pointer", display: "flex", padding: 2 }}>
                <Ico name="bell" size={17} />
                {urgent > 0 && <span style={{ position: "absolute", top: -4, right: -6, minWidth: 14, height: 14, borderRadius: 7, background: DO.redDot, color: DO.white, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>{urgent}</span>}
              </div>
            </Tip>
            <Ico name="sun" size={17} />
          </div>
          <T size={12.5} color={DO.text2}>Test</T>
          <div style={{ width: 26, height: 26, borderRadius: 13, background: DO.blue, color: DO.white, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>T</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${DO.blue}`, color: DO.blue, borderRadius: 16, padding: "5px 12px", fontSize: 12.5, fontWeight: 600 }}>
            <Ico name="sparkle" size={13} /> AI Assistant
          </div>
          {bell && (
            <div style={{ position: "absolute", top: 50, right: 150, width: 340, background: DO.white, border: `1px solid ${DO.border}`, borderRadius: 8, boxShadow: "0 8px 24px rgba(3,27,78,0.14)", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${DO.border}` }}><T weight={700}>Notifications</T></div>
              {notes.length === 0 && <div style={{ padding: 14 }}><T size={12.5} color={DO.text3}>Nothing yet. Create a project to see checks and briefs here.</T></div>}
              {notes.map((n) => (
                <div
                  key={n.title}
                  onClick={() => { setBell(false); ctx.pickScenario(n.sc, n.to ?? "project"); }}
                  style={{ display: "flex", gap: 10, padding: "10px 14px", borderBottom: `1px solid ${DO.border}`, cursor: "pointer" }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0, background: { ok: DO.greenDot, warn: DO.amberDot, bad: DO.redDot, info: DO.blue, draft: DO.text3, neutral: DO.text3 }[n.tone] }} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <T size={12.5} weight={600}>{n.title}</T>
                    <T size={11.5} color={DO.text3}>{n.sub}</T>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: "28px 40px 90px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 1180, display: "flex", flexDirection: "column", gap: 18 }}>{children}</div>
        </div>
        <TipsToggle />
        <div style={{ position: "fixed", right: 18, bottom: 16, background: DO.blue, color: DO.white, borderRadius: 18, padding: "7px 14px", fontSize: 12, fontWeight: 600 }}>Share Feedback</div>
      </div>
    </div>
  );
}

function TipsToggle() {
  const { tips, setTips } = useNav();
  return (
    <div onClick={() => setTips(!tips)} style={{ position: "fixed", left: 216, bottom: 16, display: "flex", alignItems: "center", gap: 8, background: DO.white, border: `1px solid ${DO.border}`, borderRadius: 18, padding: "6px 12px", fontSize: 12, fontWeight: 600, color: DO.text2, cursor: "pointer", boxShadow: "0 2px 8px rgba(3,27,78,0.08)", zIndex: 25 }}>
      <Ico name="sparkle" size={13} color={tips ? DO.blue : DO.text3} />
      {tips ? "Walkthrough on" : "Walkthrough off"}
    </div>
  );
}

function EmailFrame({ children }: { children: ReactNode }) {
  const { back } = useNav();
  return (
    <div style={{ fontFamily: DO.font, minHeight: "100vh", background: "#F6F8FC", color: DO.text }}>
      <div style={{ height: 52, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: `1px solid ${DO.border}`, background: DO.white }}>
        <Ico name="mail" size={18} color={DO.text2} />
        <T size={14} weight={600} color={DO.text2} style={{ flex: 1 }}>Inbox</T>
        <Btn variant="link" onClick={back}>Back to console</Btn>
      </div>
      <div style={{ padding: 32, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 640, background: DO.white, border: `1px solid ${DO.border}`, borderRadius: 8, overflow: "visible" }}>
          <div style={{ background: DO.navy, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, borderRadius: "8px 8px 0 0" }}>
            <DoLogo size={20} />
            <T size={13} weight={600} color={DO.white}>DigitalOcean</T>
          </div>
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
        </div>
      </div>
      <TipsToggle />
    </div>
  );
}

function IdeFrame({ side }: { side: ReactNode }) {
  const { back } = useNav();
  return (
    <div style={{ fontFamily: DO.font, minHeight: "100vh", display: "flex", background: "#181818", color: "#CCCCCC" }}>
      <div style={{ flex: 1, minWidth: 0, borderRight: "1px solid #2B2B2B" }}>
        <div style={{ height: 40, borderBottom: "1px solid #2B2B2B", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 12, color: "#9D9D9D", gap: 12 }}>
          <span onClick={back} style={{ color: "#6FA8FF", cursor: "pointer" }}>Back to console</span>
          <span>clinic-notes · prisma/schema.prisma</span>
        </div>
        <div style={{ padding: 16, fontFamily: "monospace", fontSize: 12.5, lineHeight: "20px", color: "#9CDCFE", whiteSpace: "pre" }}>
          {"model Visit {\n  id             String   @id\n  patient_id     String\n  dob            DateTime\n  diagnosis_code String\n  notes          String\n  embedding      Unsupported(\"vector\")\n}\n"}
        </div>
      </div>
      <div style={{ width: 440, flexShrink: 0, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>{side}</div>
      <TipsToggle />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Screens: start, understand, choose                                  */
/* ------------------------------------------------------------------ */

function Centered({ children, width = 640 }: { children: ReactNode; width?: number }) {
  return <div style={{ width: "100%", maxWidth: width, alignSelf: "center", display: "flex", flexDirection: "column", gap: 18 }}>{children}</div>;
}

function OptionCard({ on, onClick, icon, title, body, tag }: { on: boolean; onClick?: () => void; icon: IconName; title: string; body: string; tag?: string }) {
  return (
    <div onClick={onClick} style={{ flex: 1, minWidth: 0, display: "flex", gap: 12, alignItems: "flex-start", padding: 16, borderRadius: 8, background: DO.white, cursor: onClick ? "pointer" : "default", border: on ? `2px solid ${DO.blue}` : `1px solid ${DO.border}` }}>
      <Radio on={on} />
      <IconTile name={icon} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <T weight={600}>{title}</T>
          {tag && <Badge tone="info">{tag}</Badge>}
        </div>
        <T size={12} color={DO.text2}>{body}</T>
      </div>
    </div>
  );
}

function HomeScreen() {
  const ctx = useNav();
  const rows: [string, string, string, string, ScenarioId | null][] = [
    ["first-project", "Default project", "2 Droplets, 1 Space", "Manual", null],
    ["NewsAgent", "Agent that summarizes the news", "App, agent, knowledge base", "VibeCloud plan", null],
    ...ctx.created.map((id): [string, string, string, string, ScenarioId | null] => {
      const s0 = SCENARIOS[id];
      return [s0.project, s0.purpose, linesFor(s0, ctx.guardsOf(id)).map((l) => l.name).join(", "), ctx.modeOf(id) === "manual" ? "Manual" : "VibeCloud plan", id];
    }),
  ];
  return (
    <ConsoleFrame active="Home">
      <PageHeader
        title="Projects"
        sub="Every project starts the same way: connect a repo, describe what you want, or start empty."
        right={<Tip text="One button for every way to create a project. Launchpad and New Project are now the same flow." place="left" show={ctx.created.length === 0}><Btn icon="plus" onClick={() => ctx.go("start")}>New project</Btn></Tip>}
      />
      <DTable
        headers={["Project", "Purpose", "Resources", "Managed by"]}
        rows={rows.map((r) => [
          <span onClick={r[4] ? () => ctx.pickScenario(r[4] as ScenarioId, "project") : undefined} style={{ cursor: r[4] ? "pointer" : "default" }}><T weight={600} color={DO.blue}>{r[0]}</T></span>,
          r[1], r[2], <Badge tone={r[3] === "Manual" ? "neutral" : "info"}>{r[3]}</Badge>,
        ])}
      />
      <SectionLabel>Start from an example</SectionLabel>
      <div style={{ display: "flex", gap: 12 }}>
        {([["agent", "Customer support chatbot", true], ["kb", "RAG knowledge assistant", false], ["app", "Web app with database", false]] as [IconName, string, boolean][]).map(([ic, t, live]) => (
          <div key={t} onClick={live ? () => ctx.pickScenario("kit", "analysis") : () => ctx.go("kits")} style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: 14, background: DO.white, border: `1px solid ${DO.border}`, borderRadius: 8, cursor: "pointer" }}>
            <IconTile name={ic} />
            <T weight={600} size={12.5} style={{ flex: 1 }}>{t}</T>
            <Ico name="arrow" size={14} color={DO.blue} />
          </div>
        ))}
      </div>
      <div onClick={() => ctx.pickScenario("health", "agent")} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: DO.white, border: `1px solid ${DO.border}`, borderRadius: 8, cursor: "pointer" }}>
        <IconTile name="sparkle" color={DO.white} bg={DO.navy} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <T weight={600} size={13}>Working in a coding agent?</T>
          <T size={12} color={DO.text2}>The DigitalOcean MCP server drafts the same priced plan from Cursor or Claude Code. You approve it here.</T>
        </div>
        <Ico name="arrow" size={14} color={DO.blue} />
      </div>
    </ConsoleFrame>
  );
}

function StartScreen() {
  const ctx = useNav();
  const st = ctx.startChoice;
  const name = st === "github" ? "Named after the repo you pick" : st === "describe" ? "support-bot" : "my-project";
  const next = () => (st === "github" ? ctx.go("github") : st === "describe" ? ctx.go("kits") : ctx.go("empty"));
  return (
    <ConsoleFrame active="New project">
      <BackLink />
      <Stepper at={0} />
      <Centered>
        <T size={24} weight={700} color={DO.navy} style={{ textAlign: "center" }}>Create new project</T>
        <Card>
          <Field label="Project name"><Input value={name} /></Field>
          <SectionLabel>How do you want to start?</SectionLabel>
          <Tip text="Pick how to start. A repo gives the best plan; a description or starter kit works without one." place="right" block>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <OptionCard on={st === "github"} onClick={() => ctx.setStartChoice("github")} icon="github" title="Connect a GitHub repo" tag="Recommended" body="We read the repo to find what the app needs: runtime, database, storage, and any sensitive data." />
              <OptionCard on={st === "describe"} onClick={() => ctx.setStartChoice("describe")} icon="sparkle" title="Describe it, or pick a starter kit" body="Write what you want in a sentence. Starter kits are pre-filled descriptions." />
              <OptionCard on={st === "empty"} onClick={() => ctx.setStartChoice("empty")} icon="plus" title="Start empty" body="Create the project and add resources yourself from the Create menu." />
            </div>
          </Tip>
          <T size={12} color={DO.text3}>Environment and purpose are no longer required here. We infer them and you can change them on a later step.</T>
          <Btn full onClick={next}>Continue</Btn>
          <div style={{ textAlign: "center" }}><Btn variant="link" onClick={() => ctx.go("home")}>Cancel</Btn></div>
        </Card>
      </Centered>
    </ConsoleFrame>
  );
}

function GithubScreen() {
  const ctx = useNav();
  const repos: [string, ScenarioId | null, string][] = [
    ["brightpath/clinic-notes", "health", "Next.js · Prisma · main · 2 hours ago"],
    ["northgate/ledger-app", "fin", "Django · Celery · main · yesterday"],
    ["brightpath/marketing-site", null, "Static HTML · main · 4 months ago"],
  ];
  const [sel, setSel] = useState<ScenarioId>(ctx.tour === "fin" ? "fin" : "health");
  const repo = repos.find((r) => r[1] === sel)?.[0] ?? "";
  return (
    <ConsoleFrame active="New project">
      <BackLink />
      <Stepper at={0} />
      <Centered width={600}>
        <Card>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <IconTile name="github" color={DO.white} bg={DO.text} size={36} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <T size={16} weight={700}>Connect GitHub</T>
              <T size={12} color={DO.text2}>Connected · read-only access to the repos you picked</T>
            </div>
          </div>
          <SectionLabel>Pick a repository</SectionLabel>
          <Tip text="clinic-notes stores patient records and triggers HIPAA suggestions. ledger-app handles payments and triggers CSPM." place="right" block>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {repos.map(([r, id, meta]) => (
                <div key={r} onClick={id ? () => setSel(id) : undefined} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", borderRadius: 6, background: DO.white, cursor: id ? "pointer" : "default", opacity: id ? 1 : 0.5, border: id === sel ? `2px solid ${DO.blue}` : `1px solid ${DO.border}` }}>
                  <Radio on={id === sel} />
                  <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <T weight={id === sel ? 600 : 400}>{r}</T>
                    <T size={11.5} color={DO.text3}>{meta}</T>
                  </div>
                </div>
              ))}
            </div>
          </Tip>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {["Read code and metadata of the repos you pick", "No write access. We never push to your repo", "Revoke any time in Settings > Integrations"].map((p) => (
              <div key={p} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Ico name="check" size={14} color={DO.green} width={2} />
                <T size={12.5} color={DO.text2}>{p}</T>
              </div>
            ))}
          </div>
          <Btn full onClick={() => ctx.pickScenario(sel, "analysis")}>{`Continue with ${repo}`}</Btn>
        </Card>
      </Centered>
    </ConsoleFrame>
  );
}

function AnalysisScreen() {
  const ctx = useNav();
  const sc = ctx.sc;
  return (
    <ConsoleFrame active="New project">
      <BackLink />
      <Stepper at={1} />
      <PageHeader crumb={`New project · ${sc.project}`} title={sc.repo ? `What we found in ${sc.repo}` : "What we understood"} sub={sc.repo ? "Every part below has evidence from the repo. Change anything that's wrong." : "From the starter kit description. Change anything that's wrong."} />
      <DTable headers={["Part", "Evidence", "Suggested product"]} rows={sc.found.map((f) => [<T weight={600}>{f[0]}</T>, <T size={12} color={DO.text2} style={{ fontFamily: "monospace" }}>{f[1]}</T>, f[2]])} tones={sc.found.map(() => "ok")} />
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}><Field label="Environment" hint="Inferred. Change it if it's wrong."><SelectBox value={sc.env} /></Field></div>
        <div style={{ flex: 1 }}><Field label="Purpose" hint="Inferred from the code. Used to suggest protections."><SelectBox value={sc.purpose} /></Field></div>
      </div>
      {sc.signal && <Banner tone="warn" title={sc.signal.title}>{sc.signal.body}</Banner>}
      <div style={{ display: "flex", gap: 10 }}>
        <Tip text={sc.signal ? "The data signal above decides which protections are suggested next." : "Guardrails are suggested because this is a public chatbot."} place="right">
          <Btn onClick={() => ctx.go("compliance")}>Continue</Btn>
        </Tip>
      </div>
    </ConsoleFrame>
  );
}

function ComplianceScreen() {
  const ctx = useNav();
  const sc = ctx.sc;
  const g = ctx.guards;
  const title = sc.id === "health" ? "Recommended protections for health records" : sc.id === "fin" ? "Recommended protections for payment data" : "Recommended protections for a public chatbot";
  return (
    <ConsoleFrame active="New project">
      <BackLink />
      <Stepper at={1} />
      <PageHeader crumb={`New project · ${sc.project}`} title={title} sub="On by default because of what we found. Each one shows its price." />
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 420, display: "flex", flexDirection: "column", gap: 12 }}>
          {sc.guards.map((x, i) => {
            const card = (
              <Card pad={16} style={{ flexDirection: "row", gap: 14, alignItems: "flex-start" }}>
                <IconTile name="shield" color={g[x.id] ? DO.green : DO.text3} bg={g[x.id] ? DO.greenBg : DO.page} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <T weight={600}>{x.name}</T>
                    <T size={12} color={DO.text3}>{x.priceText}</T>
                  </div>
                  <T size={12.5} color={DO.text2}>{x.what}</T>
                </div>
                <Switch on={!!g[x.id]} onChange={(v) => ctx.setGuard(x.id, v)} />
              </Card>
            );
            return i === 0 && x.id === "hipaa" ? (
              <Tip key={x.id} text="Try turning HIPAA mode off and on. Watch the swaps and the Summary price change." block>{card}</Tip>
            ) : (
              <div key={x.id}>{card}</div>
            );
          })}
          {sc.swaps && g.hipaa && (
            <>
              <SectionLabel>What HIPAA mode changes in the plan</SectionLabel>
              <DTable headers={["Would have used", "Uses instead", "Why"]} rows={sc.swaps.map((r) => [r[0], <T weight={600}>{r[1]}</T>, <T size={12} color={DO.text2}>{r[2]}</T>])} tones={sc.swaps.map((r) => (r[2] === "Eligible" ? "ok" : "warn"))} />
            </>
          )}
          {sc.swaps && !g.hipaa && (
            <Banner tone="bad" title="App Platform, Managed Postgres and the knowledge base can't hold patient data">They are not on DigitalOcean's HIPAA-eligible list. Keep HIPAA mode off only if this app will never store real patient records.</Banner>
          )}
          {sc.id === "fin" && <Banner tone="info" title="Scans run after deploy and after every change">CSPM scans are started by the plan, so you don't have to remember to run them.</Banner>}
          <div><Btn onClick={() => ctx.go(sc.id === "kit" ? "ask" : "mode")}>Continue</Btn></div>
        </div>
        <Summary sc={sc} guards={g} />
      </div>
    </ConsoleFrame>
  );
}

function ModeScreen() {
  const ctx = useNav();
  const m = ctx.mode;
  return (
    <ConsoleFrame active="New project">
      <BackLink />
      <Stepper at={2} />
      <Centered width={840}>
        <T size={24} weight={700} color={DO.navy} style={{ textAlign: "center" }}>How should this project be built?</T>
        <Tip text={ctx.sc.id === "fin" ? "Agencies often want to pick every resource. Try Manual here; protections still apply." : "VibeCloud proposes a priced plan and keeps watch. Manual lets you pick everything."} block>
          <div style={{ display: "flex", gap: 14 }}>
            <OptionCard on={m === "vibe"} onClick={() => ctx.setMode("vibe")} icon="sparkle" title="VibeCloud" tag="Recommended" body="Say the outcome and a cost ceiling. We propose a priced plan, create it after you approve, check it hourly and send a weekly brief." />
            <OptionCard on={m === "manual"} onClick={() => ctx.setMode("manual")} icon="dots" title="Manual" body="Pick each resource yourself from the Create menu. You still get the Summary panel, protection warnings and one approval." />
          </div>
        </Tip>
        <DTable
          headers={["", "VibeCloud", "Manual"]}
          rows={[
            ["Who picks resources", "We propose, you approve", "You"],
            ["Price before anything bills", "Yes", "Yes"],
            ["Protections from the previous step", "Built into the plan", "Warnings when a choice conflicts"],
            ["Hourly checks and weekly brief", "Yes", "No"],
            ["Undo and Terraform export", "Yes", "Export only"],
          ]}
        />
        <Btn full onClick={() => ctx.go(m === "vibe" ? "ask" : "manual")}>{m === "vibe" ? "Continue with VibeCloud" : "Continue with Manual"}</Btn>
      </Centered>
    </ConsoleFrame>
  );
}

function KitsScreen() {
  const ctx = useNav();
  const kits: [string, string, IconName[], string][] = [
    ["Customer support chatbot", "Answers from your help center with guardrails on.", ["app", "agent", "kb"], "From $44.60/mo + usage"],
    ["RAG knowledge assistant", "Search and chat over your own documents.", ["agent", "kb", "spaces"], "From $24.60/mo + usage"],
    ["Web app with database", "A web service and a managed Postgres.", ["app", "db"], "From $27.15/mo"],
  ];
  return (
    <ConsoleFrame active="Starter kits">
      <BackLink />
      <PageHeader title="Starter kits" sub="Examples of what a project can be. Picking one fills in the description; the rest of the flow is the same as any new project." />
      {ctx.tips && <Hint text="Kits are just pre-filled descriptions. The chatbot kit walks through a VibeCloud plan with guardrails." />}
      <div style={{ display: "flex", gap: 14 }}>
        {kits.map(([t, d, ics, p], i) => {
          const card = (
            <div onClick={i === 0 ? () => ctx.pickScenario("kit", "analysis") : undefined} style={{ height: "100%", background: DO.white, borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 10, cursor: i === 0 ? "pointer" : "default", border: i === 0 ? `2px solid ${DO.blue}` : `1px solid ${DO.border}`, opacity: i === 0 ? 1 : 0.7 }}>
              <div style={{ display: "flex", gap: 6 }}>{ics.map((ic) => <IconTile key={ic} name={ic} size={26} />)}</div>
              <T size={15} weight={700}>{t}</T>
              <T size={12.5} color={DO.text2}>{d}</T>
              <T size={12} color={DO.text3}>{p}</T>
              <div style={{ marginTop: "auto" }}><Btn variant={i === 0 ? "primary" : "secondary"} full disabled={i !== 0}>Use as starting point</Btn></div>
            </div>
          );
          return (
            <div key={t} style={{ flex: 1, minWidth: 0, position: "relative", borderRadius: 10 }}>
              {i === 0 && ctx.tips && <div className="do-pulse" style={{ position: "absolute", inset: -4, borderRadius: 10, pointerEvents: "none" }} />}
              {card}
            </div>
          );
        })}
      </div>
      <Field label="Or describe what you want" hint="A sentence is enough. Add a cost ceiling if you have one."><TextBox value="" /></Field>
    </ConsoleFrame>
  );
}

function EmptyScreen() {
  const ctx = useNav();
  const tiles: [IconName, string][] = [["droplet", "Droplets"], ["app", "App Platform"], ["db", "Databases"], ["spaces", "Spaces Object Storage"], ["kb", "Knowledge Bases"], ["agent", "Agents"]];
  return (
    <ConsoleFrame active="New project">
      <PageHeader icon title="my-project" sub="Empty project · owner you" right={<Tip text="Empty projects use the same flow when you add to them. Try it from here." place="left"><Btn icon="plus" onClick={() => ctx.go("start")}>Add to this project</Btn></Tip>} />
      <Tabs items={["Resources", "Activity", "Settings"]} active="Resources" />
      <Card>
        <SectionLabel>Create something new</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
          {tiles.map(([ic, t]) => (
            <div key={t} style={{ display: "flex", gap: 10, alignItems: "center", padding: 12, borderRadius: 8, border: `1px solid ${DO.border}` }}>
              <IconTile name={ic} />
              <T size={12.5} weight={600}>{t}</T>
            </div>
          ))}
        </div>
        <T size={12} color={DO.text3}>These tiles work like today's Create menu. Add to this project opens the same flow as New project, with this project as context.</T>
      </Card>
    </ConsoleFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Screens: plan, manual, approve, deploy, project                     */
/* ------------------------------------------------------------------ */

const WORKER: Line = { name: "worker-1", kind: "Droplet · 1 GB", why: "Runs the reminder job each morning. Uses a jobs table in db-1 as the queue.", price: 6, cli: "doctl compute droplet get worker-1" };

function planMeter(sc: Scenario, g: Guards, spent: number, warn?: boolean, pauseOverride?: number) {
  const u = usageFor(sc, g);
  const at = pauseOverride ?? u.pauseAt;
  if (!at) return undefined;
  return { text: `Usage ${money(spent)} of ${money(at)} pause point`, pct: Math.min(100, (spent / at) * 100), warn };
}

function AskScreen() {
  const ctx = useNav();
  const sc = ctx.sc;
  const u = usageFor(sc, ctx.guards);
  return (
    <ConsoleFrame active="New project">
      <BackLink />
      <Stepper at={3} />
      <PageHeader crumb={`New project · ${sc.project} · VibeCloud`} title="What should this project do?" sub="Say the outcome and a cost ceiling. We turn it into a priced plan you can read before anything is created." />
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <Card style={{ flex: 1, minWidth: 420 }}>
          <Field label="Outcome"><TextBox value={sc.ask} /></Field>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1 }}><Field label="Datacenter region"><SelectBox value="New York · NYC3" /></Field></div>
            <div style={{ flex: 1 }}><Field label="Size"><SelectBox value="Smallest that passes checks" /></Field></div>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {sc.id === "kit" && <div style={{ flex: 1 }}><Field label="Model"><SelectBox value="nemotron-3-super-120b" /></Field></div>}
            <div style={{ flex: 1 }}>
              <Field label="Pause point" hint={u.pauseAt ? "Usage stops growing at this amount. The app stays up. Not a bill cap." : "No usage-billed parts in this plan, so there's nothing to pause."}>
                <Input value={u.pauseAt ? money(u.pauseAt) : "Not needed"} />
              </Field>
            </div>
          </div>
          <T size={12} color={DO.text3}>Only these can change here. Everything else comes from the repo, the protections you kept, and your sentence.</T>
        </Card>
        <Summary sc={sc} guards={ctx.guards} cta="Build plan" onCta={() => ctx.go("plan")} />
      </div>
    </ConsoleFrame>
  );
}

function PlanScreen() {
  const ctx = useNav();
  const sc = ctx.sc;
  const g = ctx.guards;
  const u = usageFor(sc, g);
  const proof = g.hipaa && sc.hipaaProof ? sc.hipaaProof : sc.proof;
  return (
    <ConsoleFrame active="New project">
      <BackLink />
      <Stepper at={3} />
      <PageHeader crumb={`New project · ${sc.project} · VibeCloud`} title={`Plan for ${sc.project}`} sub="Draft. Dashed boxes are not created and cost $0 until you approve." right={<Badge tone="draft">Draft</Badge>} />
      <Tip text="Dashed boxes are drafts: nothing here exists or bills yet. Click uploads or db-1 to see why each part is in the plan." block>
        <MapWithDrawer map={MAPS[mapKey(sc, g)]} lines={linesFor(sc, g)} mode="draft" groupLabel={`Plan · ${sc.project}`} groupRight="draft · not created" meter={u.pauseAt ? { text: `Usage pauses at ${money(u.pauseAt)} · expected about ${money(u.estimate)}`, pct: (u.estimate / u.pauseAt) * 100 } : undefined} />
      </Tip>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <Card style={{ flex: 1, minWidth: 420 }}>
          <SectionLabel>What happens after you approve</SectionLabel>
          <KV k="Create" v={`${linesFor(sc, g).length} resources in project ${sc.project}, in dependency order`} />
          <KV k="Prove it works" v={proof.q} />
          <KV k="Keep watch" v="Hourly checks. You hear within the hour if one fails, with the last change and who made it." />
          <KV k="Weekly brief" v="Health, cost against this estimate, and upkeep drafts." />
          {u.pauseAt > 0 && <KV k="Pause point" v={`${money(u.pauseAt)} of usage. The app stays up.`} />}
          <KV k="Undo" v="Every change can be undone for 72 hours." />
          <KV k="Leave" v="Export to Terraform or release the plan any time. Resources keep running." />
        </Card>
        <Summary sc={sc} guards={g} cta="Continue to approval" onCta={() => ctx.go("approve")} />
      </div>
    </ConsoleFrame>
  );
}

function ManualScreen() {
  const ctx = useNav();
  const sc = ctx.sc;
  const g = ctx.guards;
  const catalog: [IconName, string, Line | null][] = [
    ["droplet", "Droplets", { name: "api-2", kind: "Droplet · 2 vCPU / 4 GB", why: "You picked it", price: 24 }],
    ["lb", "Load Balancers", { name: "lb-1", kind: "Load Balancer", why: "You picked it", price: 12 }],
    ["spaces", "Spaces Object Storage", { name: "files", kind: "Spaces bucket", why: "You picked it", price: 5 }],
    ["db", "Databases", null],
    ["app", "App Platform", null],
    ["kb", "Knowledge Bases", null],
  ];
  const all = [...linesFor(sc, g), ...ctx.extra];
  return (
    <ConsoleFrame active="New project">
      <BackLink />
      <Stepper at={3} />
      <PageHeader crumb={`New project · ${sc.project} · Manual`} title={sc.project} sub="Pick resources yourself. Protections and price stay on." icon />
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 420, display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionLabel>{`Resources you picked (${all.length})`}</SectionLabel>
          <DTable headers={["Name", "Type", "Monthly"]} rows={all.map((l) => [<T weight={600}>{l.name}</T>, l.kind, l.price ? `${money(l.price)}/mo` : "Variable"])} tones={all.map(() => "draft")} />
          {!g.backup && (
            <>
              <Banner tone="warn" title="api-1 has no backups">ledger-db is backed up daily by Managed Databases, but the Droplet is not. For payment software, turn on weekly backups.</Banner>
              <div>
                <Tip text="Manual mode still warns you. Fix it in one click and watch the Summary update." place="right">
                  <Btn variant="secondary" onClick={() => ctx.setGuard("backup", true)}>Turn on backups · +$4.80/mo</Btn>
                </Tip>
              </div>
            </>
          )}
          <SectionLabel>Add a resource</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
            {catalog.map(([ic, label, line]) => {
              const added = line && ctx.extra.some((e) => e.name === line.name);
              return (
                <div key={label} onClick={line && !added ? () => ctx.addExtra(line) : undefined} style={{ display: "flex", gap: 10, alignItems: "center", padding: 12, borderRadius: 8, background: DO.white, border: `1px solid ${DO.border}`, cursor: line && !added ? "pointer" : "default", opacity: line ? 1 : 0.55 }}>
                  <IconTile name={ic} />
                  <T size={12.5} weight={600} style={{ flex: 1 }}>{label}</T>
                  {added ? <Ico name="check" size={14} color={DO.green} width={2} /> : <Ico name="plus" size={14} color={DO.blue} />}
                </div>
              );
            })}
          </div>
        </div>
        <Summary sc={sc} guards={g} extra={ctx.extra} cta="Review and approve" onCta={() => ctx.go("approve")} />
      </div>
    </ConsoleFrame>
  );
}

function ApproveScreen() {
  const ctx = useNav();
  const sc = ctx.sc;
  const g = ctx.guards;
  const scopes = g.hipaa && sc.hipaaScopes ? sc.hipaaScopes : sc.scopes;
  const isChange = ctx.change;
  const extra = isChange ? [...ctx.extra.filter((e) => e.name !== WORKER.name), WORKER] : ctx.extra;
  const lines = [...linesFor(sc, g), ...extra];
  const u = usageFor(sc, g);
  const vibe = ctx.mode === "vibe";
  const approve = () => {
    if (isChange) {
      if (!ctx.extra.some((e) => e.name === WORKER.name)) ctx.addExtra(WORKER);
      ctx.setChange(false);
      ctx.go("project");
    } else {
      ctx.markCreated();
      ctx.go("deploy");
    }
  };
  return (
    <ConsoleFrame active={isChange ? sc.project : "New project"}>
      <BackLink />
      {!isChange && <Stepper at={4} />}
      <PageHeader crumb={isChange ? `${sc.project} · Add to this project` : `New project · ${sc.project}`} title={isChange ? "Approve change" : `Approve ${sc.project}`} sub="Nothing bills until you approve. This is the only step that creates anything." />
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 420, display: "flex", flexDirection: "column", gap: 14 }}>
          <Card>
            <SectionLabel>This will</SectionLabel>
            <KV k="Create" v={isChange ? "1 Droplet (worker-1) and change 2 existing resources" : `${lines.length} resources: ${lines.map((l) => l.name).join(", ")}`} />
            <KV k="Monthly cost" v={`${money(fixedTotal(sc, g, extra))}/mo${u.pauseAt ? " + usage" : ""}`} />
            {u.pauseAt > 0 && <KV k="Pause point" v={money(u.pauseAt)} />}
            {vibe && <KV k="Checks" v="Hourly, starting right after deploy" />}
            <KV k="Undo" v={vibe ? "72 hours for every change" : "Delete resources from the project page"} />
          </Card>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <IconTile name="key" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <T weight={600}>Plan credential</T>
                <T size={12} color={DO.text2}>{`Scoped to project ${sc.project}. Revoke any time in API > Plan credentials.`}</T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {scopes.map((s0) => {
                const miss = ctx.missingScope && s0 === scopes[1];
                return <span key={s0} style={{ fontFamily: "monospace", fontSize: 11.5, borderRadius: 4, padding: "2px 6px", background: miss ? DO.redBg : DO.page, color: miss ? DO.red : DO.text2, textDecoration: miss ? "line-through" : "none", border: `1px solid ${DO.border}` }}>{s0}</span>;
              })}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Switch on={ctx.missingScope} onChange={ctx.setMissingScope} />
              <T size={12} color={DO.text2}>Show what happens if your role can't grant a scope</T>
            </div>
            {ctx.missingScope && <Banner tone="bad" title={`Can't approve: your role can't grant ${scopes[1]}`}>Nothing has been created. Ask a team owner to approve, or remove the part that needs it.</Banner>}
          </Card>
          {g.hipaa && <Banner tone="warn" title="BAA not signed yet">Resources can deploy now. Don't store real patient data until DigitalOcean's Business Associate Agreement is signed. Request it through Sales or Support.</Banner>}
        </div>
        <div style={{ width: 260, flexShrink: 0 }}>
          <Tip text="The only step that bills. Everything before this was free to explore." show={!ctx.missingScope} block>
            <Summary sc={sc} guards={g} extra={extra} cta={isChange ? "Approve change" : "Approve and deploy"} onCta={approve} disabled={ctx.missingScope} />
          </Tip>
        </div>
      </div>
    </ConsoleFrame>
  );
}

function DeployScreen() {
  const ctx = useNav();
  const sc = ctx.sc;
  const g = ctx.guards;
  const lines = [...linesFor(sc, g), ...ctx.extra];
  const proof = g.hipaa && sc.hipaaProof ? sc.hipaaProof : sc.proof;
  const secs = [14, 38, 71, 22, 19, 45, 30];
  return (
    <ConsoleFrame active="New project">
      <Stepper at={5} />
      <PageHeader crumb={`New project · ${sc.project}`} title={`${sc.project} is live`} sub="Created, connected, and checked with a real request." />
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <Card style={{ flex: 1, minWidth: 340 }}>
          <SectionLabel>Created</SectionLabel>
          {lines.map((l, i) => (
            <div key={l.name} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Ico name="check" size={14} color={DO.green} width={2} />
              <IconTile name={iconFor(l.kind)} size={22} />
              <T size={12.5} weight={600} style={{ flex: 1 }}>{l.name}</T>
              <T size={12} color={DO.text3}>{`${secs[i % secs.length]}s`}</T>
            </div>
          ))}
          {sc.guards.filter((x) => g[x.id]).map((x) => (
            <div key={x.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Ico name="check" size={14} color={DO.green} width={2} />
              <IconTile name="shield" size={22} color={DO.green} bg={DO.greenBg} />
              <T size={12.5} style={{ flex: 1 }}>{x.name}</T>
            </div>
          ))}
        </Card>
        <Card style={{ flex: 1, minWidth: 340 }}>
          <SectionLabel>Proof it works</SectionLabel>
          <T size={12} color={DO.text2}>Request</T>
          <Mono>{proof.q}</Mono>
          <T size={12} color={DO.text2}>Answer</T>
          <Mono>{proof.a}</Mono>
          {g.cspm && <Badge tone="ok">CSPM scan: 0 critical, 0 high</Badge>}
          <T size={12} color={DO.text3}>If any step had failed, everything created so far would have been removed and nothing billed.</T>
          <Tip text="Success means a real request got a real answer, not just that resources exist." block>
            <Btn full onClick={() => ctx.go("project")}>Go to project</Btn>
          </Tip>
        </Card>
      </div>
    </ConsoleFrame>
  );
}

function ProjectShell({ tab, banner, children, right }: { tab: string; banner?: ReactNode; children: ReactNode; right?: ReactNode }) {
  const ctx = useNav();
  const sc = ctx.sc;
  const vibe = ctx.mode === "vibe";
  const to: Record<string, ScreenId> = { Resources: "project", Activity: "undo", Settings: "export" };
  return (
    <ConsoleFrame active={sc.project}>
      <PageHeader icon title={sc.project} sub={`${vibe ? "Managed by a VibeCloud plan" : "Built manually"} · owner ${sc.owner}`} right={right} />
      <div style={{ display: "flex", gap: 22, borderBottom: `1px solid ${DO.border}` }}>
        {["Resources", "Activity", "Settings"].map((it) => (
          <div key={it} onClick={() => ctx.go(to[it])} style={{ padding: "8px 2px", fontSize: 13, cursor: "pointer", fontWeight: it === tab ? 600 : 400, color: it === tab ? DO.text : DO.text2, borderBottom: it === tab ? `2px solid ${DO.blue}` : "2px solid transparent", marginBottom: -1 }}>
            {it}
          </div>
        ))}
      </div>
      {banner}
      {children}
    </ConsoleFrame>
  );
}

function ResourceList({ sc, lines, vibe, tones }: { sc: Scenario; lines: Line[]; vibe: boolean; tones?: Record<string, NodeState> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <T size={13} weight={600}>{`${vibe ? "Plan" : "Resources"} · ${sc.project} (${lines.length})`}</T>
      {lines.map((l) => {
        const st = tones?.[l.name];
        return (
          <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: DO.white, border: `1px solid ${DO.border}`, borderRadius: 8 }}>
            <IconTile name={iconFor(l.kind)} />
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
              <T weight={600} color={DO.blue}>{l.name}</T>
              <T size={12} color={DO.text3}>{l.kind}</T>
            </div>
            <T size={12.5} color={DO.text2}>{l.price ? `${money(l.price)}/mo` : l.usage ?? ""}</T>
            <Badge tone={st ? st[0] : "ok"}>{st ? st[1] : "Active"}</Badge>
            <Ico name="dots" size={16} color={DO.text3} width={2.5} />
          </div>
        );
      })}
    </div>
  );
}

function ViewToggle({ view, setView }: { view: "map" | "list"; setView: (v: "map" | "list") => void }) {
  return (
    <div style={{ display: "inline-flex", border: `1px solid ${DO.border}`, borderRadius: 6, overflow: "hidden", alignSelf: "flex-start" }}>
      {(["map", "list"] as const).map((v) => (
        <div key={v} onClick={() => setView(v)} style={{ padding: "5px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", background: view === v ? DO.blueTint : DO.white, color: view === v ? DO.blue : DO.text2 }}>
          {v === "map" ? "Map" : "List"}
        </div>
      ))}
    </div>
  );
}

function ProjectScreen() {
  const ctx = useNav();
  const [view, setView] = useState<"map" | "list">("map");
  const sc = ctx.sc;
  const g = ctx.guards;
  const vibe = ctx.mode === "vibe";
  const lines = [...linesFor(sc, g), ...ctx.extra];
  const u = usageFor(sc, g);
  const canChange = sc.id === "health" && g.hipaa && !ctx.extra.some((e) => e.name === WORKER.name);
  const addBtn = <Btn icon="plus" variant={canChange ? "primary" : "secondary"} onClick={() => (sc.id === "health" && g.hipaa ? (ctx.setChange(true), ctx.go("add")) : ctx.go("start"))}>Add to this project</Btn>;
  return (
    <ProjectShell
      tab="Resources"
      right={canChange ? <Tip text="Add a feature to a live project. The same flow returns a change plan on top of what exists." place="left">{addBtn}</Tip> : addBtn}
      banner={ctx.extra.some((e) => e.name === WORKER.name) && sc.id === "health" ? <Banner tone="ok" title="Change applied">worker-1 is live and sending reminders. Undo is available for 72 hours in Activity.</Banner> : undefined}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <Card pad={14} style={{ flex: 1, gap: 2 }}><T size={12} color={DO.text3}>Monthly cost</T><T size={18} weight={700}>{`${money(fixedTotal(sc, g, ctx.extra))}${u.pauseAt ? " + usage" : ""}`}</T></Card>
        <Card pad={14} style={{ flex: 1, gap: 2 }}><T size={12} color={DO.text3}>{vibe ? "Checks" : "Protections"}</T><T size={18} weight={700}>{vibe ? "Passing · hourly" : `${sc.guards.filter((x) => g[x.id]).length} on`}</T></Card>
        <Card pad={14} style={{ flex: 1, gap: 2 }}><T size={12} color={DO.text3}>{vibe ? "Next brief" : "Last CSPM scan"}</T><T size={18} weight={700}>{vibe ? "Monday" : "0 critical"}</T></Card>
      </div>
      <Tip text="Map shows how the parts connect. List is the resource view you know. Click a box for details." place="right" show={sc.id === "fin"}>
        <ViewToggle view={view} setView={setView} />
      </Tip>
      {view === "map" ? (
        <MapWithDrawer map={MAPS[mapKey(sc, g)]} lines={lines} mode="live" groupLabel={`${vibe ? "Plan" : "Resources"} · ${sc.project}`} groupRight={vibe ? "verified · checked hourly" : "you manage"} meter={vibe ? planMeter(sc, g, 3.4, false, ctx.raised && sc.id === "kit" ? 45 : undefined) : undefined} />
      ) : (
        <ResourceList sc={sc} lines={lines} vibe={vibe} />
      )}
    </ProjectShell>
  );
}

/* ------------------------------------------------------------------ */
/* Screens: keep running and leave                                     */
/* ------------------------------------------------------------------ */

function AddScreen() {
  const ctx = useNav();
  const sc = ctx.sc;
  const lines = linesFor(sc, ctx.guards);
  return (
    <ProjectShell tab="Resources">
      <BackLink />
      <Centered width={720}>
        <Card>
          <T size={18} weight={700} color={DO.navy}>Add to this project</T>
          <T size={12.5} color={DO.text2}>Same flow as a new project. What's already here is used as context, and HIPAA mode stays on.</T>
          <Field label="What should change?"><TextBox value="Send appointment reminder emails to patients every morning at 7." /></Field>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <T size={12} color={DO.text3}>Context:</T>
            {lines.map((l) => <Chip key={l.name}>{l.name}</Chip>)}
            <Chip>HIPAA mode on</Chip>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Tip text="The plan comes back as a change: new parts dashed, existing parts kept.">
              <Btn onClick={() => ctx.go("diff")}>Build change plan</Btn>
            </Tip>
            <Btn variant="secondary" onClick={() => ctx.go("kits")}>Browse starter kits</Btn>
          </div>
        </Card>
      </Centered>
    </ProjectShell>
  );
}

function DiffScreen() {
  const ctx = useNav();
  const sc = ctx.sc;
  const g = ctx.guards;
  const lines = [...linesFor(sc, g), WORKER];
  return (
    <ProjectShell tab="Resources" right={<Badge tone="draft">Change draft</Badge>}>
      <BackLink />
      <T size={16} weight={700}>Change plan: appointment reminders</T>
      <MapWithDrawer map={MAPS["health-hipaa"]} lines={lines} mode="live" draftIds={["worker-1"]} groupLabel={`Plan · ${sc.project}`} groupRight="1 new part · 2 changed" />
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 420, display: "flex", flexDirection: "column", gap: 10 }}>
          <DTable
            headers={["Change", "Part", "Cost"]}
            rows={[
              [<Badge tone="info">Add</Badge>, "worker-1 · Droplet 1 GB", "+$6/mo"],
              [<Badge tone="neutral">Change</Badge>, "db-1 · adds a jobs table (pg-boss)", "$0"],
              [<Badge tone="neutral">Change</Badge>, "web-1 · schedules reminders", "$0"],
              [<Badge tone="warn">Not used</Badge>, "Managed Valkey queue · not HIPAA-eligible", "$0"],
            ]}
          />
          <T size={12} color={DO.text3}>A queue would normally use Managed Valkey. HIPAA mode keeps the queue inside db-1 instead.</T>
        </div>
        <Summary sc={sc} guards={g} extra={[...ctx.extra, WORKER]} cta="Continue to approval" onCta={() => ctx.go("approve")} />
      </div>
    </ProjectShell>
  );
}

function AlertEmailScreen() {
  const ctx = useNav();
  return (
    <EmailFrame>
      <T size={12} color={DO.text3}>{`To ${ctx.sc.owner} · Day 9 · 09:14`}</T>
      <T size={18} weight={700}>support-bot stopped answering</T>
      <Banner tone="bad" title="Hourly check failed at 09:14">The test question got a 401 from agent. Visitors see an error in the chat widget.</Banner>
      <KV k="Broken part" v="agent (Agent Platform)" />
      <KV k="Last change" v="Access key deleted by alex@acme.io at 08:52" />
      <KV k="Proposed fix" v="Create a new access key and update chatbot's AGENT_KEY. $0. Can be undone for 72 hours." />
      <div style={{ display: "flex", gap: 10 }}>
        <Tip text="The owner hears within the hour, with the cause and a priced fix. Open it in the console.">
          <Btn onClick={() => ctx.go("alertConsole")}>Review fix in console</Btn>
        </Tip>
        <Btn variant="secondary">Reply to alex@acme.io</Btn>
      </div>
      <T size={11.5} color={DO.text3}>You get this because you own the support-bot plan. We never repair without your approval.</T>
    </EmailFrame>
  );
}

function AlertConsoleScreen() {
  const ctx = useNav();
  const sc = ctx.sc;
  const g = ctx.guards;
  const lines = linesFor(sc, g);
  const overrides: Record<string, NodeState> = { agent: ["bad", "Access key deleted"], chatbot: ["warn", "Getting 401s"] };
  return (
    <ProjectShell tab="Resources" banner={<Banner tone="bad" title="1 check failing since 09:14">agent's access key was deleted by alex@acme.io at 08:52. chatbot can't reach it.</Banner>}>
      <MapWithDrawer map={MAPS.kit} lines={lines} mode="live" overrides={overrides} groupLabel={`Plan · ${sc.project}`} groupRight="check failed" meter={planMeter(sc, g, 3.4)} />
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SectionLabel>Proposed fix</SectionLabel>
          <Badge tone="draft">Draft</Badge>
        </div>
        <DTable headers={["Step", "Part", "Cost"]} rows={[["Create a new access key", "agent", "$0"], ["Set AGENT_KEY and redeploy", "chatbot", "$0"], ["Ask the test question again", "chatbot → agent", "$0"]]} />
        <T size={12} color={DO.text3}>Can be undone for 72 hours. The deleted key stays deleted.</T>
        <div style={{ display: "flex", gap: 10 }}>
          <Tip text="Apply the fix. The map turns green and the change appears in Activity with an undo." place="right">
            <Btn onClick={() => { ctx.setFixed(true); ctx.go("project"); }}>Apply fix</Btn>
          </Tip>
          <Btn variant="secondary" onClick={() => ctx.go("project")}>Dismiss</Btn>
        </div>
      </Card>
    </ProjectShell>
  );
}

function BriefScreen() {
  const ctx = useNav();
  return (
    <EmailFrame>
      <T size={12} color={DO.text3}>{`To ${ctx.sc.owner} · Monday 08:00`}</T>
      <T size={18} weight={700}>Weekly brief · support-bot · week 6</T>
      <div style={{ display: "flex", gap: 10 }}>
        <Card pad={12} style={{ flex: 1, gap: 2 }}><T size={11.5} color={DO.text3}>Health</T><T weight={700}>167 of 168 checks passed</T></Card>
        <Card pad={12} style={{ flex: 1, gap: 2 }}><T size={11.5} color={DO.text3}>Cost this week</T><T weight={700}>$10.30 fixed + $1.40 usage</T></Card>
        <Card pad={12} style={{ flex: 1, gap: 2 }}><T size={11.5} color={DO.text3}>Against estimate</T><T weight={700} color={DO.green}>On track</T></Card>
      </div>
      <SectionLabel>Upkeep drafts</SectionLabel>
      <DTable
        headers={["Draft", "Cost", "Undo"]}
        rows={[
          ["help.acme.io added /guides (42 pages). Re-index help-kb.", "about $0.02 once", "Yes"],
          ["Newer model answers 9 of 10 test questions vs 8 of 10. Same price.", "$0", "Yes"],
        ]}
      />
      <div style={{ display: "flex", gap: 10 }}>
        <Tip text="Every upkeep item is a draft with a price and an undo. Nothing changes without approval.">
          <Btn onClick={() => ctx.go("project")}>Review drafts</Btn>
        </Tip>
        <Btn variant="secondary" onClick={() => ctx.go("project")}>Open project</Btn>
      </div>
    </EmailFrame>
  );
}

function PauseScreen() {
  const ctx = useNav();
  const sc = ctx.sc;
  const g = ctx.guards;
  const u = usageFor(sc, g);
  return (
    <ProjectShell tab="Resources" banner={<Banner tone="warn" title={`Usage paused at ${money(u.pauseAt)}`}>A traffic spike used this month's usage budget on the 21st. The chatbot stays up and shows a "Contact support" link instead of answers. Fixed costs keep billing. This is a pause point, not a bill cap.</Banner>}>
      <MapWithDrawer map={MAPS.kit} lines={linesFor(sc, g)} mode="live" overrides={{ agent: ["warn", "Paused · usage limit"], "help-kb": ["warn", "Paused · no new queries"] }} groupLabel={`Plan · ${sc.project}`} groupRight="paused" meter={planMeter(sc, g, u.pauseAt, true)} />
      <Card>
        <SectionLabel>Choose what happens next</SectionLabel>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Tip text="Raising the pause point is a change too, so it can be undone from Activity.">
            <Btn onClick={() => { ctx.setRaised(true); ctx.go("project"); }}>Raise pause point to $45</Btn>
          </Tip>
          <Btn variant="secondary" onClick={() => ctx.go("project")}>Stay paused until Oct 1</Btn>
        </div>
      </Card>
    </ProjectShell>
  );
}

function UndoScreen() {
  const ctx = useNav();
  const sc = ctx.sc;
  const [undone, setUndone] = useState<string[]>([]);
  const rows: [string, string, string, boolean][] = [];
  if (sc.id === "kit") {
    if (ctx.raised) rows.push(["Month 3", "Raised pause point $30 → $45", sc.owner, true]);
    if (ctx.fixed) rows.push(["Day 9 09:31", "New agent access key, chatbot redeployed", "plan (approved by you)", true]);
  }
  if (ctx.extra.some((e) => e.name === WORKER.name)) rows.push(["Today", "Added worker-1 for appointment reminders", "plan (approved by you)", true]);
  ctx.extra.filter((e) => e.name !== WORKER.name).forEach((e) => rows.push(["Day 1", `Added ${e.name}`, sc.owner, false]));
  rows.push(["Day 1", `Created ${sc.project}`, sc.owner, false]);
  const vibe = ctx.mode === "vibe";
  return (
    <ProjectShell tab="Activity">
      <DTable
        headers={["When", "Change", "By", vibe ? "Undo" : ""]}
        rows={rows.map((r) => [
          r[0],
          <T weight={600} style={{ textDecoration: undone.includes(r[1]) ? "line-through" : "none" }}>{r[1]}</T>,
          <T size={12} color={DO.text2}>{r[2]}</T>,
          !vibe ? "" : undone.includes(r[1]) ? <Badge tone="neutral">Undone</Badge> : r[3] ? <Btn variant="secondary" onClick={() => setUndone([...undone, r[1]])}>Undo</Btn> : <T size={12} color={DO.text3}>Window closed (72 h)</T>,
        ])}
        tones={rows.map((r) => (r[3] ? "info" : "neutral"))}
      />
      {vibe && <T size={12} color={DO.text3}>Undo restores the previous settings and resources. Deleted data, like a removed access key, can't come back, and the undo says so before you click.</T>}
    </ProjectShell>
  );
}

function ExportScreen() {
  const ctx = useNav();
  const [released, setReleased] = useState(false);
  const sc = ctx.sc;
  const lines = [...linesFor(sc, ctx.guards), ...ctx.extra];
  const tf = lines.map((l) => `resource "${l.kind.startsWith("Droplet") ? "digitalocean_droplet" : l.kind.startsWith("App") ? "digitalocean_app" : l.kind.startsWith("Load") ? "digitalocean_loadbalancer" : l.kind.startsWith("Spaces") ? "digitalocean_spaces_bucket" : l.kind.includes("Postgres") || l.kind.includes("Valkey") ? "digitalocean_database_cluster" : l.kind.startsWith("Agent") ? "digitalocean_genai_agent" : "digitalocean_genai_knowledge_base"}" "${l.name.replace(/-/g, "_")}" { ... }`).join("\n");
  return (
    <ProjectShell tab="Settings">
      <Card>
        <SectionLabel>Export as Terraform</SectionLabel>
        <T size={12.5} color={DO.text2}>A snapshot of every resource in the project, as it runs today. Use it to move to your own pipeline.</T>
        <Mono>{tf}</Mono>
        <div><Btn variant="secondary" icon="doc">Download main.tf</Btn></div>
      </Card>
      {ctx.mode === "vibe" && (
        <Card>
          <SectionLabel>Release plan</SectionLabel>
          <T size={12.5} color={DO.text2}>Stops checks, briefs and the pause point. Every resource keeps running and billing as a normal resource. The plan credential is revoked.</T>
          {released ? (
            <Banner tone="ok" title="Plan released">{`${lines.length} resources keep running in ${sc.project}. You manage them from here on.`}</Banner>
          ) : (
            <div>
              <Tip text="Leaving is one click, and nothing is deleted." place="right">
                <Btn variant="danger" onClick={() => setReleased(true)}>Release plan</Btn>
              </Tip>
            </div>
          )}
        </Card>
      )}
    </ProjectShell>
  );
}

function AgentScreen() {
  const ctx = useNav();
  const sc = ctx.sc;
  const g = ctx.guards;
  const bubble = (who: string, body: ReactNode, dark?: boolean) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, color: "#8A8A8A" }}>{who}</span>
      <div style={{ background: dark ? "#252526" : "#2D2D30", borderRadius: 6, padding: 10, fontSize: 12.5, color: "#DDDDDD", lineHeight: 1.5 }}>{body}</div>
    </div>
  );
  return (
    <IdeFrame
      side={
        <>
          {bubble("You", "Deploy this to DigitalOcean. It stores patient notes so keep it HIPAA-ready, under $80 a month.")}
          {bubble("Tool call · DigitalOcean MCP", <span style={{ fontFamily: "monospace", fontSize: 11.5 }}>{`plan_outcome(repo="${sc.repo}", hipaa=true, budget=80)`}</span>, true)}
          <div style={{ background: DO.white, borderRadius: 8, padding: 14, display: "flex", flexDirection: "column", gap: 8, color: DO.text }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconTile name="sparkle" size={22} />
              <T weight={700}>{`Draft plan · ${sc.project}`}</T>
            </div>
            <T size={12.5}>{`${money(fixedTotal(sc, g))}/mo · ${linesFor(sc, g).length} resources · ${sc.guards.filter((x) => g[x.id]).length} protections`}</T>
            <T size={12} color={DO.text2}>{linesFor(sc, g).map((l) => l.name).join(", ")}</T>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge tone="ok">Every part HIPAA-eligible</Badge>
              <Badge tone="warn">BAA pending</Badge>
            </div>
            <T size={11.5} color={DO.text3}>Agents can draft. Only a person with the right role can approve.</T>
            <Tip text="Same plan as the console flow. Approval always happens with a person in the console." block>
              <Btn full onClick={() => ctx.go("approve")}>Open in console to approve</Btn>
            </Tip>
          </div>
          {bubble("Also works from the terminal", <span style={{ fontFamily: "monospace", fontSize: 11.5 }}>{`doctl plans create --repo ${sc.repo} --hipaa --budget 80`}</span>, true)}
        </>
      }
    />
  );
}

const RENDER: Record<ScreenId, () => ReactNode> = {
  home: HomeScreen, start: StartScreen, github: GithubScreen, analysis: AnalysisScreen, compliance: ComplianceScreen, mode: ModeScreen, kits: KitsScreen,
  empty: EmptyScreen, ask: AskScreen, plan: PlanScreen, manual: ManualScreen, approve: ApproveScreen, deploy: DeployScreen, project: ProjectScreen,
  add: AddScreen, diff: DiffScreen, alertEmail: AlertEmailScreen, alertConsole: AlertConsoleScreen, brief: BriefScreen, pause: PauseScreen,
  undo: UndoScreen, export: ExportScreen, agent: AgentScreen,
};

function defaultGuards(sc: Scenario): Guards {
  const g: Guards = {};
  sc.guards.forEach((x) => (g[x.id] = x.defaultOn));
  return g;
}

/* ------------------------------------------------------------------ */
/* Welcome                                                             */
/* ------------------------------------------------------------------ */

function Welcome({ onPick, onClose }: { onPick: (id: ScenarioId) => void; onClose: () => void }) {
  const tours: [ScenarioId, IconName, string, string][] = [
    ["health", "shield", "Health records app", "GitHub repo with patient data. VibeCloud suggests HIPAA mode and swaps products to eligible ones."],
    ["fin", "key", "Payments app, built by hand", "GitHub repo with payment data. Manual path with CSPM, firewall and backup warnings."],
    ["kit", "agent", "Starter kit chatbot", "No repo. A starter kit becomes a VibeCloud plan, then see day 9, the weekly brief and the pause point."],
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(3,27,78,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, fontFamily: DO.font }}>
      <div style={{ width: 620, background: DO.white, borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 20px 50px rgba(3,27,78,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: DO.blue, display: "flex", alignItems: "center", justifyContent: "center" }}><DoLogo size={20} /></div>
          <T size={20} weight={700} color={DO.navy}>One way to start a project</T>
        </div>
        <T size={13.5} color={DO.text2}>Launchpad and New Project are one flow here. Start from a GitHub repo, a description or a starter kit, then build it yourself or let VibeCloud propose a priced plan and keep watch. Everything is clickable.</T>
        <T size={12.5} weight={600} color={DO.text}>Pick a walkthrough</T>
        {tours.map(([id, ic, t, d]) => (
          <div key={id} onClick={() => onPick(id)} style={{ display: "flex", gap: 12, alignItems: "center", padding: 14, border: `1px solid ${DO.border}`, borderRadius: 8, cursor: "pointer" }}>
            <IconTile name={ic} size={32} />
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <T weight={600}>{t}</T>
              <T size={12} color={DO.text2}>{d}</T>
            </div>
            <Ico name="arrow" size={16} color={DO.blue} />
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <T size={12} color={DO.text3}>Blue tips point at the next click. Turn them off any time, bottom left.</T>
          <Btn variant="link" onClick={onClose}>Explore on my own</Btn>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

const IDS: ScenarioId[] = ["health", "fin", "kit"];

export default function Prototype() {
  const [stack, setStack] = useState<ScreenId[]>(["home"]);
  const [scId, setScId] = useState<ScenarioId>("health");
  const [guardsBy, setGuardsBy] = useState<Record<ScenarioId, Guards>>(() => Object.fromEntries(IDS.map((id) => [id, defaultGuards(SCENARIOS[id])])) as Record<ScenarioId, Guards>);
  const [modeBy, setModeBy] = useState<Record<ScenarioId, Mode>>({ health: "vibe", fin: "vibe", kit: "vibe" });
  const [extraBy, setExtraBy] = useState<Record<ScenarioId, Line[]>>({ health: [], fin: [], kit: [] });
  const [missingScope, setMissingScope] = useState(false);
  const [created, setCreated] = useState<ScenarioId[]>([]);
  const [change, setChange] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [raised, setRaised] = useState(false);
  const [startChoice, setStartChoice] = useState<StartChoice>("github");
  const [tour, setTour] = useState<ScenarioId | null>(null);
  const [tips, setTips] = useState(true);
  const [welcome, setWelcome] = useState(true);

  const screen = stack[stack.length - 1];
  const sc = SCENARIOS[scId];
  const go = (s: ScreenId) => {
    setStack((st) => [...st, s]);
    window.scrollTo(0, 0);
  };
  const ctx: Ctx = {
    screen,
    sc,
    go,
    back: () => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st)),
    canBack: stack.length > 1,
    pickScenario: (id, then) => {
      setScId(id);
      setMissingScope(false);
      if (then) go(then);
    },
    guards: guardsBy[scId],
    setGuard: (k, v) => setGuardsBy({ ...guardsBy, [scId]: { ...guardsBy[scId], [k]: v } }),
    mode: modeBy[scId],
    setMode: (m) => setModeBy({ ...modeBy, [scId]: m }),
    modeOf: (id) => modeBy[id],
    guardsOf: (id) => guardsBy[id],
    missingScope,
    setMissingScope,
    extra: extraBy[scId],
    addExtra: (l) => setExtraBy({ ...extraBy, [scId]: [...extraBy[scId], l] }),
    created,
    markCreated: () => setCreated(created.includes(scId) ? created : [...created, scId]),
    change,
    setChange,
    fixed,
    setFixed,
    raised,
    setRaised,
    startChoice,
    setStartChoice,
    tour,
    tips,
    setTips,
  };

  const Screen = RENDER[screen];
  return (
    <Nav.Provider value={ctx}>
      <div style={{ width: "100%" }}>
        <Screen key={`${screen}-${stack.length}-${scId}`} />
      </div>
      {welcome && (
        <Welcome
          onPick={(id) => {
            setTour(id);
            setScId(id);
            setStartChoice(id === "kit" ? "describe" : "github");
            if (id === "fin") setModeBy({ ...modeBy, fin: "manual" });
            setTips(true);
            setWelcome(false);
            setStack(["home"]);
          }}
          onClose={() => {
            setTips(false);
            setWelcome(false);
          }}
        />
      )}
    </Nav.Provider>
  );
}
