"use client";

import type { ReactNode } from "react";

// ── Inline formatting ─────────────────────────────────────────────────────────

export function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|`([^`]+)`|\*([^*]+)\*)/g;
  let last = 0;
  let match;
  let idx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));

    if (match[0].startsWith("**")) {
      parts.push(
        <strong key={idx++} className="font-semibold text-white">
          {match[2]}
        </strong>
      );
    } else if (match[0].startsWith("`")) {
      parts.push(
        <code
          key={idx++}
          className="rounded border border-white/8 bg-[#1a1a1a] px-1.5 py-0.5 font-mono text-xs text-purple-300"
        >
          {match[3]}
        </code>
      );
    } else {
      parts.push(
        <em key={idx++} className="italic text-gray-400">
          {match[4]}
        </em>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// ── Block renderer (line-by-line) ─────────────────────────────────────────────

export function renderMarkdown(content: string): ReactNode[] {
  const lines = content.split("\n");
  const nodes: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Fenced code block ────────────────────────────────────────────────────
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      nodes.push(
        <pre
          key={key++}
          className="my-5 overflow-x-auto rounded-xl border border-white/8 bg-[#0d0d0d] p-5 text-sm"
        >
          {lang && (
            <div className="mb-3 text-xs font-mono text-purple-400/70 uppercase tracking-widest">
              {lang}
            </div>
          )}
          <code className="font-mono text-gray-300 leading-relaxed whitespace-pre">
            {codeLines.join("\n")}
          </code>
        </pre>
      );
      continue;
    }

    // ── H2 ───────────────────────────────────────────────────────────────────
    if (line.startsWith("## ")) {
      nodes.push(
        <h2
          key={key++}
          className="mt-8 mb-3 text-xl font-bold text-white tracking-tight"
        >
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    // ── H3 ───────────────────────────────────────────────────────────────────
    if (line.startsWith("### ")) {
      nodes.push(
        <h3
          key={key++}
          className="mt-6 mb-2 text-lg font-semibold text-white"
        >
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    // ── Bullet list (collect consecutive "- " lines) ─────────────────────────
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (
        i < lines.length &&
        (lines[i].startsWith("- ") || lines[i].startsWith("* "))
      ) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={key++} className="my-3 space-y-1 pl-5">
          {items.map((item, j) => (
            <li
              key={j}
              className="list-disc text-gray-300 text-[0.95rem] leading-relaxed"
            >
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // ── Numbered list ─────────────────────────────────────────────────────────
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      nodes.push(
        <ol key={key++} className="my-3 space-y-1 pl-5">
          {items.map((item, j) => (
            <li
              key={j}
              className="list-decimal text-gray-300 text-[0.95rem] leading-relaxed"
            >
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // ── Horizontal rule ───────────────────────────────────────────────────────
    if (/^---+$/.test(line.trim())) {
      nodes.push(<hr key={key++} className="my-6 border-white/8" />);
      i++;
      continue;
    }

    // ── Blockquote ────────────────────────────────────────────────────────────
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <blockquote
          key={key++}
          className="my-4 rounded-r-xl border-l-2 border-purple-500/50 bg-purple-500/5 py-3 pl-4 pr-3 text-sm text-gray-400 italic"
        >
          {quoteLines.map((l, j) => (
            <p key={j}>{renderInline(l)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // ── Empty line ────────────────────────────────────────────────────────────
    if (line.trim() === "") {
      i++;
      continue;
    }

    // ── Paragraph (collect consecutive "plain" lines) ─────────────────────────
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("## ") &&
      !lines[i].startsWith("### ") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("- ") &&
      !lines[i].startsWith("* ") &&
      !lines[i].startsWith("> ") &&
      !/^\d+\. /.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      nodes.push(
        <p
          key={key++}
          className="my-3 text-gray-300 leading-relaxed text-[0.95rem]"
        >
          {renderInline(paraLines.join(" "))}
        </p>
      );
    }
  }

  return nodes;
}

// ── Drop-in component wrapper ─────────────────────────────────────────────────

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="space-y-1">{renderMarkdown(content)}</article>
  );
}
