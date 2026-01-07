import { Keyword } from "@/types/mindmap";
import { cn } from "@/lib/utils";

interface TreeNodeProps {
  node: Keyword;
  isRoot?: boolean;
}

const levelColors = [
  "bg-node-root text-primary-foreground",
  "bg-node-level1 text-primary-foreground",
  "bg-node-level2 text-primary-foreground",
  "bg-node-level3 text-primary-foreground",
];

export function TreeNode({ node, isRoot = false }: TreeNodeProps) {
  const colorClass =
    levelColors[Math.min(node.level, levelColors.length - 1)];

  const hasChildren = node.children && node.children.length > 0;
  const childCount = node.children?.length ?? 0;

  const NODE_WIDTH = 160;
  const CHILD_GAP = 200;
  const STEM_HEIGHT = 40;

  return (
    <div className="relative flex flex-col items-center">
      {/* ================= NODE ================= */}
      <div
        className={cn(
          "relative z-10 px-6 py-2 rounded-2xl font-medium shadow-soft",
          "transition-all duration-300 hover:scale-105 hover:shadow-warm",
          isRoot ? "text-lg px-8 py-3" : "text-sm",
          colorClass
        )}
      >
        {node.text}
      </div>

      {/* ================= CONNECTORS ================= */}
      {hasChildren && (
        <div className="relative flex flex-col items-center">
          {/* Vertical stem from parent */}
          <div
            className="bg-slate-300 rounded-full"
            style={{ width: "3px", height: STEM_HEIGHT }}
          />

          {/* SVG junction + curves */}
          <svg
            width={childCount * CHILD_GAP}
            height={80}
            className="overflow-visible"
          >
            {/* Junction line */}
            <line
              x1={(childCount * CHILD_GAP) / 2}
              y1={0}
              x2={(childCount * CHILD_GAP) / 2}
              y2={20}
              stroke="#cbd5e1"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Curves to children */}
            {node.children!.map((_, index) => {
              const startX = (childCount * CHILD_GAP) / 2;
              const endX = index * CHILD_GAP + CHILD_GAP / 2;

              return (
                <path
                  key={index}
                  d={`M ${startX} 20
                      Q ${startX} 60, ${endX} 60`}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* ================= CHILD NODES ================= */}
          <div
            className="flex justify-center"
            style={{ gap: `${CHILD_GAP - NODE_WIDTH}px` }}
          >
            {node.children!.map((child, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Child vertical stem */}
                <div
                  className="bg-slate-300 rounded-full"
                  style={{ width: "3px", height: "40px" }}
                />
                <TreeNode node={child} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
