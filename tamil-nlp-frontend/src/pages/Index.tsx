import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { Brain, Sparkles, Languages, Download, History, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Advanced AI extracts key concepts and organizes them automatically',
  },
  {
    icon: Languages,
    title: 'Multilingual',
    description: 'Works with 10+ languages including Tamil, Hindi, Chinese, and more',
  },
  {
    icon: Download,
    title: 'Export Anywhere',
    description: 'Download as PNG, PDF, or share a link with anyone',
  },
  {
    icon: History,
    title: 'Save & Access',
    description: 'Your mind maps are saved and accessible from any device',
  },
];

const exampleKeywords = [
  { text: 'Photosynthesis', level: 0 },
  { text: 'Light Energy', level: 1 },
  { text: 'Chlorophyll', level: 1 },
  { text: 'Carbon Dioxide', level: 1 },
  { text: 'Glucose', level: 1 },
  { text: 'Oxygen', level: 1 },
];

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              AI-Powered Mind Mapping
            </div>

            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight">
              Transform Text into
              <span className="text-primary"> Visual Ideas</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Paste any paragraph and watch as AI extracts key concepts, creating beautiful
              hierarchical mind maps in seconds. Perfect for students, teachers, and lifelong learners.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {user ? (
                <Button asChild size="lg" className="gap-2 rounded-xl text-lg px-8">
                  <Link to="/generate">
                    Create Mind Map
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="gap-2 rounded-xl text-lg px-8">
                    <Link to="/auth?mode=signup">
                      Get Started Free
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-xl text-lg px-8">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Example Mind Map Preview */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-card rounded-3xl shadow-warm border p-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col items-center">
                {/* Root Node */}
                <div className="px-6 py-3 rounded-2xl bg-node-root text-primary-foreground font-bold text-lg shadow-glow">
                  Photosynthesis
                </div>
                
                {/* Connector */}
                <div className="w-0.5 h-6 bg-border" />
                
                {/* Horizontal line */}
                <div className="w-3/4 h-0.5 bg-border" />
                
                {/* Children */}
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {['Light Energy', 'Chlorophyll', 'CO₂', 'Glucose', 'O₂'].map((text, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-0.5 h-4 bg-border" />
                      <div
                        className="px-4 py-2 rounded-xl text-sm font-medium text-primary-foreground shadow-soft"
                        style={{
                          backgroundColor: `hsl(${[15, 199, 142, 262, 38][i % 5]} ${[80, 89, 71, 83, 92][i % 5]}% ${[60, 48, 45, 58, 50][i % 5]}%)`,
                        }}
                      >
                        {text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
              Everything You Need to Learn Better
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-2xl shadow-soft border hover:shadow-warm transition-shadow duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-16 md:py-24 text-center">
          <div className="max-w-2xl mx-auto bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20">
            <Brain className="w-16 h-16 mx-auto text-primary mb-6" />
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
              Ready to Visualize Your Ideas?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of students and educators who are already using MindMap AI
              to transform the way they learn and teach.
            </p>
            <Button asChild size="lg" className="gap-2 rounded-xl">
              <Link to={user ? '/generate' : '/auth?mode=signup'}>
                {user ? 'Create Your First Map' : 'Start for Free'}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-muted-foreground text-sm">
          <p>© 2024 MindMap AI.</p>
        </div>
      </footer>
    </div>
  );
}
