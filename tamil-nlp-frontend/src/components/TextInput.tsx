import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextInputProps {
  onGenerate: (text: string, language: string) => void;
  loading?: boolean;
  className?: string;
}

// ✅ ONLY TWO LANGUAGES
const languages = [
  { value: 'ta', label: 'தமிழ் (Tamil)' },
  { value: 'en', label: 'English' },
  
];

export function TextInput({ onGenerate, loading = false, className }: TextInputProps) {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('ta');

  const handleSubmit = () => {
    if (text.trim()) {
      onGenerate(text.trim(), language);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative">
        <Textarea
          placeholder="Paste your paragraph or text here to generate a mind map..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[180px] resize-none text-base p-4 rounded-xl border-2 border-border focus:border-primary transition-colors"
          disabled={loading}
        />
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          {text.length} characters
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={language} onValueChange={setLanguage} disabled={loading}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          className="flex-1 gap-2 rounded-xl font-semibold"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Mind Map
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
