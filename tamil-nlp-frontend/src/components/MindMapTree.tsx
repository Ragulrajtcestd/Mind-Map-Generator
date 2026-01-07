import { Keyword } from "@/types/mindmap";
import { TreeNode } from "./TreeNode";
import { cn } from "@/lib/utils";

interface MindMapTreeProps {
  title: string;
  keywords: Keyword[];
  className?: string;
}

export function MindMapTree({
  title,
  keywords,
  className,
}: MindMapTreeProps) {
  // Root node
  const rootNode: Keyword = {
    text: title,
    level: 0,
    children: keywords,
  };

  return (
    <div
      className={cn(
        // 🌿 Main container
        "relative w-full overflow-x-auto rounded-2xl border bg-card shadow-soft",
        className
      )}
    >
      {/* 🌱 Subtle grid background (improves line readability) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* 🌳 Tree canvas */}
      <div className="relative min-w-max px-16 py-12 flex justify-center">
        <TreeNode node={rootNode} isRoot />
      </div>
    </div>
  );
}
