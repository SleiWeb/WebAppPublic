import katex from "katex";
import type { ReactNode } from "react";

/**
 * Render af forfattet tekst: mini-markdown (**fed**, `kode`) + KaTeX ($…$).
 * Indholdet er redaktionelt (reviewet som kode, doc 08 §8.7) — elevinput
 * renderes aldrig gennem denne komponent.
 */
export function MathText({ text, className }: { text: string; className?: string }) {
  return <span className={className}>{renderSegments(text)}</span>;
}

function renderSegments(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // split på $…$ (display-math $$…$$ håndteres som blok af forfatteren)
  const parts = text.split(/(\$[^$]+\$)/g);
  parts.forEach((part, i) => {
    if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
      const html = katex.renderToString(part.slice(1, -1), {
        throwOnError: false,
        output: "html",
      });
      nodes.push(
        <span key={i} dangerouslySetInnerHTML={{ __html: html }} />
      );
    } else {
      nodes.push(...renderInline(part, i));
    }
  });
  return nodes;
}

function renderInline(text: string, keyBase: number): ReactNode[] {
  const nodes: ReactNode[] = [];
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\n\n)/g);
  parts.forEach((part, i) => {
    const key = `${keyBase}-${i}`;
    if (part === "\n\n") nodes.push(<br key={key} />);
    else if (part.startsWith("**") && part.endsWith("**"))
      nodes.push(<strong key={key}>{part.slice(2, -2)}</strong>);
    else if (part.startsWith("`") && part.endsWith("`"))
      nodes.push(
        <code key={key} className="rounded bg-slate-100 px-1 py-0.5 text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    else if (part) nodes.push(<span key={key}>{part}</span>);
  });
  return nodes;
}
