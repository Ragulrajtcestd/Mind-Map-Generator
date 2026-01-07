import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, History, Plus, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        
        {/* LOGO + APP NAME */}
        <Link
          to="/"
          className="flex items-center gap-3 font-heading font-bold text-xl"
        >
          <img
            src="/mindmap.png"
            alt="Mind Map Logo"
            className="h-9 w-9 rounded-lg object-contain"
          />
          <span className="hidden sm:inline">MindMap AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" asChild className="gap-2">
                <Link to="/generate">
                  <Plus className="w-4 h-4" />
                  New Map
                </Link>
              </Button>
              <Button variant="ghost" asChild className="gap-2">
                <Link to="/history">
                  <History className="w-4 h-4" />
                  My Maps
                </Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut} className="gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?mode=signup">Get Started</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden border-t bg-background overflow-hidden transition-all duration-300',
          mobileMenuOpen ? 'max-h-64' : 'max-h-0'
        )}
      >
        <nav className="container py-4 flex flex-col gap-2">
          {user ? (
            <>
              <Button variant="ghost" asChild className="justify-start gap-2">
                <Link to="/generate" onClick={() => setMobileMenuOpen(false)}>
                  <Plus className="w-4 h-4" />
                  New Map
                </Link>
              </Button>
              <Button variant="ghost" asChild className="justify-start gap-2">
                <Link to="/history" onClick={() => setMobileMenuOpen(false)}>
                  <History className="w-4 h-4" />
                  My Maps
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="justify-start gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild className="justify-start">
                <Link
                  to="/auth?mode=signup"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
