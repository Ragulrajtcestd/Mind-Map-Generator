import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { TextInput } from "@/components/TextInput";
import { MindMapTree } from "@/components/MindMapTree";
import { ExportButtons } from "@/components/ExportButtons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMindmaps } from "@/hooks/useMindmaps";
import { MindMapData, Keyword } from "@/types/mindmap";
import { Save, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";

// 🔗 Backend API
import { extractKeywords } from "@/services/api";

// ==============================
// ✅ BACKEND RESPONSE TYPES
// ==============================
type BackendKeyword = {
  level1: string;
  level2: string[];
};

type BackendResponse = {
  title: string;
  keywords: BackendKeyword[];
};

export default function Generate() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { saveMindmap, loading: saveLoading } = useMindmaps();

  const [generating, setGenerating] = useState(false);
  const [currentMap, setCurrentMap] = useState<MindMapData | null>(null);

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // ==============================
  // GENERATE MIND MAP (FLASK BACKEND)
  // ==============================
  const handleGenerate = async (text: string, language: string) => {
    setGenerating(true);
    setCurrentMap(null);

    try {
      // 🔥 CALL BACKEND
      const response = (await extractKeywords(text)) as BackendResponse;

      // ✅ CRITICAL TRANSFORMATION (BACKEND → FRONTEND)
      const transformedKeywords: Keyword[] = response.keywords.map((item) => ({
        text: item.level1,
        level: 1,
        children: item.level2.map((sub) => ({
          text: sub,
          level: 2,
        })),
      }));

      setCurrentMap({
        title: response.title,
        sourceText: text,
        keywords: transformedKeywords,
        language,
      });

      toast.success("Mind map generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate mind map. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // ==============================
  // SAVE TO HISTORY
  // ==============================
  const handleSave = async () => {
    if (!currentMap) return;

    const result = await saveMindmap(currentMap);
    if (result) {
      setCurrentMap((prev) => (prev ? { ...prev, id: result.id } : null));
      toast.success("Mind map saved!");
    }
  };

  const handleReset = () => {
    setCurrentMap(null);
  };

  // ==============================
  // LOADING STATE
  // ==============================
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ==============================
  // UI
  // ==============================
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
              Create Your Mind Map
            </h1>
            <p className="text-muted-foreground">
              Paste any Tamil or English text and let AI extract key concepts
            </p>
          </div>

          {/* Input OR Result */}
          {!currentMap ? (
            <TextInput onGenerate={handleGenerate} loading={generating} />
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={saveLoading || !!currentMap.id}
                    className="gap-2"
                  >
                    {saveLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {currentMap.id ? "Saved" : "Save"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    New Map
                  </Button>
                </div>

                <ExportButtons
                  elementId="mindmap-container"
                  title={currentMap.title}
                />
              </div>

              {/* Mind Map */}
              <div id="mindmap-container">
                <MindMapTree
                  title={currentMap.title}
                  keywords={currentMap.keywords}
                />
              </div>

              {/* Source Text */}
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <p className="font-medium mb-2">Source Text:</p>
                <p className="text-muted-foreground line-clamp-3">
                  {currentMap.sourceText}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
