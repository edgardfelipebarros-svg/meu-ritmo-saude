import { useState } from "react";
import { Heart, Menu, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Funcionalidades", href: "#benefits" },
    { name: "Planos", href: "#pricing" },
    { name: "Demonstração", href: "#demo" },
    { name: "Depoimentos", href: "#testimonials" },
    { name: "FAQ", href: "#faq" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Meu Ritmo</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <a 
                key={index}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <LogIn className="w-4 h-4 mr-2" />
              Entrar
            </Button>
            <Button variant="hero" size="sm">
              Teste Grátis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <nav className="py-4 space-y-2">
              {navItems.map((item, index) => (
                <a 
                  key={index}
                  href={item.href}
                  className="block px-4 py-2 text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Mobile CTA */}
              <div className="px-4 pt-4 border-t border-border space-y-3">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar no Sistema
                </Button>
                <Button variant="hero" size="sm" className="w-full">
                  Começar Teste Grátis
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;