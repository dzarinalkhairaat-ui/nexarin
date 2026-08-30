"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal, Code2 } from "lucide-react";

interface LessonMarkdownRendererProps {
  content: string;
}

export function LessonMarkdownRenderer({ content }: LessonMarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText.trim());
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!content) return null;

  // Split content into blocks (paragraphs, headers, code blocks, lists, hr)
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLang = "";
  let codeLines: string[] = [];
  let listItems: string[] = [];
  let currentKey = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${currentKey++}`} className="space-y-2.5 my-4 pl-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4F5] mt-2.5 shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const flushCode = () => {
    if (codeLines.length > 0) {
      const codeText = codeLines.join("\n");
      const blockId = `code-${currentKey++}`;
      elements.push(
        <div key={blockId} className="my-5 rounded-2xl overflow-hidden border border-white/[0.12] bg-[#070B14] shadow-xl">
          <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.08] text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[#2DD4F5]" />
              <span className="uppercase text-[10px] font-bold text-slate-300">{codeLang || "CODE"}</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(codeText, blockId)}
              className="flex items-center gap-1 text-[11px] hover:text-white px-2 py-0.5 rounded-md hover:bg-white/[0.08] transition-colors"
            >
              {copiedCode === blockId ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#7CF2C3]" />
                  <span className="text-[#7CF2C3] font-bold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono text-[#7CF2C3] overflow-x-auto leading-relaxed">
            <code>{codeText}</code>
          </pre>
        </div>
      );
      codeLines = [];
      codeLang = "";
    }
  };

  function formatInline(text: string): string {
    // Bold: **text**
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
    // Inline code: `code`
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-white/[0.08] text-[#2DD4F5] font-mono text-xs border border-white/[0.08]">$1</code>');
    // Italic: *text*
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em class="text-slate-200 italic">$1</em>');
    return formatted;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced Code Block Check
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        inCodeBlock = false;
        flushCode();
      } else {
        flushList();
        inCodeBlock = true;
        codeLang = line.trim().replace(/^```/, "").trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();

    // Empty lines
    if (!trimmed) {
      flushList();
      continue;
    }

    // Horizontal Rule
    if (trimmed === "---" || trimmed === "***") {
      flushList();
      elements.push(<hr key={`hr-${currentKey++}`} className="my-8 border-white/[0.08]" />);
      continue;
    }

    // Headings
    if (trimmed.startsWith("# ")) {
      flushList();
      elements.push(
        <h1 key={`h1-${currentKey++}`} className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-8 mb-4">
          {trimmed.replace(/^#\s+/, "")}
        </h1>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={`h2-${currentKey++}`} className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-8 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2DD4F5]" />
          <span>{trimmed.replace(/^##\s+/, "")}</span>
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={`h3-${currentKey++}`} className="text-lg font-bold text-white mt-6 mb-2">
          {trimmed.replace(/^###\s+/, "")}
        </h3>
      );
      continue;
    }

    // List items
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listItems.push(trimmed.replace(/^[-*]\s+/, ""));
      continue;
    }

    // Standard Paragraph
    flushList();
    elements.push(
      <p
        key={`p-${currentKey++}`}
        className="text-slate-300 text-sm sm:text-base leading-relaxed my-3"
        dangerouslySetInnerHTML={{ __html: formatInline(line) }}
      />
    );
  }

  flushList();
  flushCode();

  return <div className="space-y-1">{elements}</div>;
}
