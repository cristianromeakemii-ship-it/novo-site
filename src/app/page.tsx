"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Sparkles,
  Heart,
  Shield,
  Send,
  AtSign,
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Product, Testimonial, ContactMessage } from "@/lib/supabase";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#inicio", label: "Início" },
    { href: "#sobre", label: "Sobre" },
    { href: "#produtos", label: "Produtos" },
    { href: "#depoimentos", label: "Depoimentos" },
    { href: "#contato", label: "Contato" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-cream/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#inicio" className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-gold" />
          <div>
            <span className="text-2xl font-bold text-brown font-[family-name:var(--font-cormorant)]">
              Arte Fios
            </span>
            <span className="block text-xs tracking-[0.3em] text-gold uppercase font-[family-name:var(--font-raleway)]">
              de Luz
            </span>
          </div>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-brown-light hover:text-gold transition-colors text-sm tracking-wide uppercase font-[family-name:var(--font-raleway)]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden text-brown"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-cream/98 backdrop-blur-md border-t border-gold/20">
          <ul className="flex flex-col items-center gap-4 py-6">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-brown hover:text-gold transition-colors text-lg font-[family-name:var(--font-cormorant)]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-brown via-brown-light to-brown overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="star-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="animate-float mb-8">
          <Sparkles className="w-16 h-16 text-gold mx-auto" />
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-cream mb-4 font-[family-name:var(--font-cormorant)] leading-tight">
          Arte Fios <span className="text-gold-gradient">de Luz</span>
        </h1>

        <div className="decorative-line w-48 mx-auto my-6" />

        <p className="text-xl md:text-2xl text-beige-dark font-light mb-4 font-[family-name:var(--font-cormorant)] italic">
          Arte, fé e proteção em cada criação
        </p>

        <p className="text-base text-beige-dark/70 max-w-2xl mx-auto mb-10 font-[family-name:var(--font-raleway)] font-light">
          Peças artesanais carregadas de significado, fé, proteção e conexão
          espiritual
        </p>

        <a
          href="#produtos"
          className="inline-flex items-center gap-2 px-8 py-3 gold-gradient text-cream rounded-full text-sm uppercase tracking-widest hover:opacity-90 transition-opacity font-[family-name:var(--font-raleway)]"
        >
          Conheça nossas peças
          <ChevronDown className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}

function AboutSection() {
  const values = [
    { icon: Heart, title: "Fé", desc: "Cada peça é criada com devoção e respeito às tradições espirituais" },
    { icon: Shield, title: "Proteção", desc: "Artigos que carregam energia de proteção e acolhimento" },
    { icon: Star, title: "Exclusividade", desc: "Peças personalizadas e únicas para cada cliente" },
    { icon: Sparkles, title: "Espiritualidade", desc: "Conexão espiritual através da arte e do artesanato sagrado" },
  ];

  return (
    <section id="sobre" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brown mb-4 font-[family-name:var(--font-cormorant)]">
            Nossa Essência
          </h2>
          <div className="decorative-line w-32 mx-auto my-6" />
          <p className="text-lg text-brown-light/80 max-w-2xl mx-auto font-[family-name:var(--font-raleway)] font-light">
            Marca artesanal de artigos religiosos personalizados para Umbanda,
            Candomblé e espiritualidade em geral. Criamos peças que expressam fé,
            proteção e identidade espiritual.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-beige rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-gold/10 hover:border-gold/30 group"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <v.icon className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-semibold text-brown mb-3 font-[family-name:var(--font-cormorant)]">
                {v.title}
              </h3>
              <p className="text-sm text-brown-light/70 font-[family-name:var(--font-raleway)] font-light">
                {v.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-brown mb-4 font-[family-name:var(--font-cormorant)]">
              Nossa Missão
            </h3>
            <p className="text-brown-light/80 mb-6 font-[family-name:var(--font-raleway)] font-light leading-relaxed">
              Criar peças artesanais que expressem fé, proteção e identidade
              espiritual. Buscamos ser reconhecidos como referência em artigos
              religiosos artesanais personalizados no Brasil.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Fé", "Respeito", "Honestidade", "Qualidade", "Acolhimento", "Personalização"].map(
                (v) => (
                  <span
                    key={v}
                    className="px-4 py-1.5 bg-gold/10 text-gold-dark text-xs rounded-full uppercase tracking-wider font-[family-name:var(--font-raleway)]"
                  >
                    {v}
                  </span>
                )
              )}
            </div>
          </div>
          <div className="bg-beige rounded-2xl p-10 border border-gold/20 text-center">
            <Sparkles className="w-12 h-12 text-gold mx-auto mb-4" />
            <blockquote className="text-2xl text-brown italic font-[family-name:var(--font-cormorant)] leading-relaxed">
              &ldquo;Arte, fé e proteção em cada criação.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (data) setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const placeholders = [
    { name: "Guia de Proteção Oxalá", category: "Guias", price: 89.9 },
    { name: "Fio de Contas Iemanjá", category: "Fios de Contas", price: 129.9 },
    { name: "Pulseira Ogum", category: "Pulseiras", price: 59.9 },
    { name: "Guia Personalizada", category: "Personalizados", price: 149.9 },
    { name: "Fio de Contas Oxóssi", category: "Fios de Contas", price: 119.9 },
    { name: "Terço Sagrado", category: "Terços", price: 79.9 },
  ];

  const items = products.length > 0 ? products : [];
  const showPlaceholders = loading || items.length === 0;

  return (
    <section id="produtos" className="py-24 bg-beige">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brown mb-4 font-[family-name:var(--font-cormorant)]">
            Nossas Criações
          </h2>
          <div className="decorative-line w-32 mx-auto my-6" />
          <p className="text-lg text-brown-light/80 max-w-2xl mx-auto font-[family-name:var(--font-raleway)] font-light">
            Cada peça é feita à mão com carinho, devoção e materiais
            selecionados
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showPlaceholders
            ? placeholders.map((p) => (
                <div
                  key={p.name}
                  className="bg-cream rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="aspect-square bg-gradient-to-br from-beige-dark to-gold/10 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-gold/30 group-hover:text-gold/60 transition-colors" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs uppercase tracking-widest text-gold font-[family-name:var(--font-raleway)]">
                      {p.category}
                    </span>
                    <h3 className="text-xl font-semibold text-brown mt-2 mb-3 font-[family-name:var(--font-cormorant)]">
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gold font-[family-name:var(--font-cormorant)]">
                        R$ {p.price.toFixed(2).replace(".", ",")}
                      </span>
                      <a
                        href="https://wa.me/5500000000000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 gold-gradient text-cream rounded-full text-xs uppercase tracking-wider hover:opacity-90 transition-opacity font-[family-name:var(--font-raleway)]"
                      >
                        Encomendar
                      </a>
                    </div>
                  </div>
                </div>
              ))
            : items.map((p) => (
                <div
                  key={p.id}
                  className="bg-cream rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="aspect-square bg-gradient-to-br from-beige-dark to-gold/10 flex items-center justify-center overflow-hidden">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Sparkles className="w-16 h-16 text-gold/30" />
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-xs uppercase tracking-widest text-gold font-[family-name:var(--font-raleway)]">
                      {p.category}
                    </span>
                    <h3 className="text-xl font-semibold text-brown mt-2 mb-2 font-[family-name:var(--font-cormorant)]">
                      {p.name}
                    </h3>
                    <p className="text-sm text-brown-light/60 mb-4 font-[family-name:var(--font-raleway)] font-light">
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gold font-[family-name:var(--font-cormorant)]">
                        R$ {p.price.toFixed(2).replace(".", ",")}
                      </span>
                      <a
                        href="https://wa.me/5500000000000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 gold-gradient text-cream rounded-full text-xs uppercase tracking-wider hover:opacity-90 transition-opacity font-[family-name:var(--font-raleway)]"
                      >
                        Encomendar
                      </a>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);
      if (data) setTestimonials(data);
    }
    load();
  }, []);

  const placeholders = [
    { name: "Maria Silva", text: "Peça linda e cheia de energia! Senti a proteção desde o primeiro momento. Recomendo de coração.", rating: 5 },
    { name: "João Santos", text: "Trabalho impecável e com muito respeito às tradições. A guia ficou exatamente como eu imaginava.", rating: 5 },
    { name: "Ana Oliveira", text: "Encomendei um fio de contas personalizado e superou todas as expectativas. Arte pura!", rating: 5 },
  ];

  const items = testimonials.length > 0 ? testimonials : placeholders;

  return (
    <section id="depoimentos" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brown mb-4 font-[family-name:var(--font-cormorant)]">
            Depoimentos
          </h2>
          <div className="decorative-line w-32 mx-auto my-6" />
          <p className="text-lg text-brown-light/80 font-[family-name:var(--font-raleway)] font-light">
            O que nossos clientes dizem sobre nossas criações
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((t, i) => (
            <div
              key={i}
              className="bg-beige rounded-2xl p-8 border border-gold/10 hover:border-gold/30 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-gold text-gold"
                  />
                ))}
              </div>
              <p className="text-brown-light/80 mb-6 italic font-[family-name:var(--font-cormorant)] text-lg leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="text-sm font-semibold text-brown font-[family-name:var(--font-raleway)]">
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [form, setForm] = useState<ContactMessage>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await supabase.from("contacts").insert([form]);
    setSent(true);
    setSending(false);
    setForm({ name: "", email: "", phone: "", message: "" });
  }

  return (
    <section id="contato" className="py-24 bg-beige">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brown mb-4 font-[family-name:var(--font-cormorant)]">
            Entre em Contato
          </h2>
          <div className="decorative-line w-32 mx-auto my-6" />
          <p className="text-lg text-brown-light/80 font-[family-name:var(--font-raleway)] font-light">
            Fale conosco para encomendas personalizadas ou tire suas dúvidas
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-brown mb-6 font-[family-name:var(--font-cormorant)]">
              Informações
            </h3>
            <div className="space-y-4">
              <a
                href="https://www.instagram.com/artefiosdeluz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-brown-light hover:text-gold transition-colors font-[family-name:var(--font-raleway)]"
              >
                <AtSign className="w-5 h-5" />
                @artefiosdeluz
              </a>
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-brown-light hover:text-gold transition-colors font-[family-name:var(--font-raleway)]"
              >
                <Phone className="w-5 h-5" />
                WhatsApp
              </a>
              <a
                href="mailto:contato@artefiosdeluz.com.br"
                className="flex items-center gap-3 text-brown-light hover:text-gold transition-colors font-[family-name:var(--font-raleway)]"
              >
                <Mail className="w-5 h-5" />
                contato@artefiosdeluz.com.br
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {sent && (
              <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 text-center text-brown font-[family-name:var(--font-raleway)]">
                Mensagem enviada com sucesso! Retornaremos em breve.
              </div>
            )}
            <input
              type="text"
              placeholder="Seu nome"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-cream border border-gold/20 text-brown placeholder:text-brown-light/40 focus:outline-none focus:border-gold/50 font-[family-name:var(--font-raleway)]"
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-cream border border-gold/20 text-brown placeholder:text-brown-light/40 focus:outline-none focus:border-gold/50 font-[family-name:var(--font-raleway)]"
            />
            <input
              type="tel"
              placeholder="Seu telefone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-cream border border-gold/20 text-brown placeholder:text-brown-light/40 focus:outline-none focus:border-gold/50 font-[family-name:var(--font-raleway)]"
            />
            <textarea
              placeholder="Sua mensagem"
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-cream border border-gold/20 text-brown placeholder:text-brown-light/40 focus:outline-none focus:border-gold/50 resize-none font-[family-name:var(--font-raleway)]"
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 gold-gradient text-cream rounded-xl text-sm uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-[family-name:var(--font-raleway)] disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {sending ? "Enviando..." : "Enviar Mensagem"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-brown py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-gold mx-auto mb-4" />
          <h3 className="text-2xl text-cream mb-2 font-[family-name:var(--font-cormorant)]">
            Arte Fios de Luz
          </h3>
          <p className="text-beige-dark/60 text-sm italic mb-6 font-[family-name:var(--font-cormorant)]">
            Arte, fé e proteção em cada criação
          </p>
          <div className="decorative-line w-24 mx-auto mb-6" />
          <div className="flex justify-center gap-6 mb-6">
            <a
              href="https://www.instagram.com/artefiosdeluz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-beige-dark/60 hover:text-gold transition-colors"
            >
              <AtSign className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-beige-dark/60 hover:text-gold transition-colors"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
          <p className="text-beige-dark/40 text-xs font-[family-name:var(--font-raleway)]">
            &copy; {new Date().getFullYear()} Arte Fios de Luz. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </>
  );
}
