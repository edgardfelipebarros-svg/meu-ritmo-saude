import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const links = {
    product: [
      { name: "Funcionalidades", href: "#" },
      { name: "Planos e Preços", href: "#" },
      { name: "Personal Online", href: "#" },
      { name: "Biblioteca de Exercícios", href: "#" }
    ],
    support: [
      { name: "Central de Ajuda", href: "#" },
      { name: "Contato", href: "#" },
      { name: "WhatsApp", href: "#" },
      { name: "Status do Sistema", href: "#" }
    ],
    company: [
      { name: "Sobre Nós", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Carreiras", href: "#" },
      { name: "Imprensa", href: "#" }
    ],
    legal: [
      { name: "Termos de Uso", href: "#" },
      { name: "Política de Privacidade", href: "#" },
      { name: "Política de Cookies", href: "#" },
      { name: "LGPD", href: "#" }
    ]
  };

  return (
    <footer className="bg-foreground text-background">
      
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">Meu Ritmo</span>
            </div>
            <p className="text-background/70 mb-6 text-lg leading-relaxed">
              Transformamos vidas através da tecnologia, conectando você aos melhores profissionais 
              de saúde e bem-estar em uma plataforma inteligente e acessível.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-background/70">contato@meuritmo.com.br</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-background/70">(11) 9999-9999</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-background/70">São Paulo, SP - Brasil</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-background/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Produto</h3>
            <ul className="space-y-3">
              {links.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-background/70 hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Suporte</h3>
            <ul className="space-y-3">
              {links.support.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-background/70 hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Empresa</h3>
            <ul className="space-y-3 mb-6">
              {links.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-background/70 hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Login Button */}
            <Button variant="hero" className="w-full">
              Acessar Sistema
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="text-background/70 text-center md:text-left">
              © 2024 Meu Ritmo. Todos os direitos reservados. Desenvolvido com ❤️ para transformar vidas.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6">
              {links.legal.map((link, index) => (
                <a 
                  key={index}
                  href={link.href} 
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;