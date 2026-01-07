import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { MindMapTree } from '@/components/MindMapTree';
import { ExportButtons } from '@/components/ExportButtons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useMindmaps } from '@/hooks/useMindmaps';
import { MindMapData } from '@/types/mindmap';
import { Loader2, Trash2, Eye, Calendar, Globe, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const languageNames: Record<string, string> = {
  en: 'English',
  ta: 'Tamil',
};

export default function History() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { mindmaps, loading, fetchMindmaps, deleteMindmap } = useMindmaps();

  const [selectedMap, setSelectedMap] = useState<MindMapData | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchMindmaps();
    }
  }, [user, fetchMindmaps]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await deleteMindmap(id);
    setDeleting(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
              Your Mind Maps
            </h1>
            <p className="text-muted-foreground">
              Access and manage all your saved mind maps
            </p>
          </div>

          {mindmaps.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-heading font-semibold mb-2">No Mind Maps Yet</h2>
              <p className="text-muted-foreground mb-6">
                Create your first mind map to see it here
              </p>
              <Button onClick={() => navigate('/generate')}>Create Mind Map</Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mindmaps.map((map) => (
                <Card
                  key={map.id}
                  className="p-4 hover:shadow-warm transition-shadow duration-300"
                >
                  <div className="space-y-3">
                    <h3 className="font-heading font-bold text-lg line-clamp-2">
                      {map.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {map.createdAt && format(new Date(map.createdAt), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {languageNames[map.language] || map.language}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {map.sourceText}
                    </p>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMap(map)}
                        className="flex-1 gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(map.id!)}
                        disabled={deleting === map.id}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        {deleting === map.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* View Dialog */}
      <Dialog open={!!selectedMap} onOpenChange={() => setSelectedMap(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{selectedMap?.title}</DialogTitle>
          </DialogHeader>

          {selectedMap && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <ExportButtons
                  elementId="dialog-mindmap"
                  title={selectedMap.title}
                />
              </div>

              <div id="dialog-mindmap">
                <MindMapTree
                  title={selectedMap.title}
                  keywords={selectedMap.keywords}
                />
              </div>

              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <p className="font-medium mb-2">Source Text:</p>
                <p className="text-muted-foreground">{selectedMap.sourceText}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
