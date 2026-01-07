import { Button } from '@/components/ui/button';
import { Download, Share2, FileImage, FileText } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportButtonsProps {
  elementId: string;
  title: string;
}

export function ExportButtons({ elementId, title }: ExportButtonsProps) {
  const handleExportPNG = async () => {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error('Could not find mindmap to export');
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-mindmap.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('PNG exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PNG');
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error('Could not find mindmap to export');
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${title.replace(/\s+/g, '-').toLowerCase()}-mindmap.pdf`);
      
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - MindMap`,
          text: `Check out this mind map: ${title}`,
          url,
        });
      } catch (error) {
        // User cancelled or error
        if ((error as Error).name !== 'AbortError') {
          await navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard!');
        }
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={handleExportPNG} className="gap-2">
        <FileImage className="w-4 h-4" />
        PNG
      </Button>
      <Button variant="outline" onClick={handleExportPDF} className="gap-2">
        <FileText className="w-4 h-4" />
        PDF
      </Button>
      <Button variant="outline" onClick={handleShare} className="gap-2">
        <Share2 className="w-4 h-4" />
        Share
      </Button>
    </div>
  );
}
