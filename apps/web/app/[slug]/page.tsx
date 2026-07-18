import { notFound } from "next/navigation";
import { Construction } from "lucide-react";

// List of valid slugs based on the footer links
const validSlugs = [
  "features", "pricing", "roadmap", "enterprise",
  "documentation", "api", "blog", "changelog",
  "about", "careers", "contact", "press",
  "privacy", "terms", "security", "gdpr"
];

const pageTitles: Record<string, string> = {
  features: "Features",
  pricing: "Pricing",
  roadmap: "Roadmap",
  enterprise: "Enterprise Solutions",
  documentation: "Documentation",
  api: "API Reference",
  blog: "Blog",
  changelog: "Changelog",
  about: "About Us",
  careers: "Careers",
  contact: "Contact Us",
  press: "Press",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  security: "Security",
  gdpr: "GDPR Compliance",
};

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // If the slug is not in our known list of footer pages, trigger a 404
  if (!validSlugs.includes(slug)) {
    notFound();
  }

  const title = pageTitles[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <main className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-20 px-6 overflow-hidden bg-[#fdfbf7]">
      <div className="max-w-3xl w-full mx-auto relative z-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-[#fff9c4] border-4 border-[#2d2d2d] wobbly-sm text-[#2d2d2d] mb-8 shadow-hard -rotate-3">
          <Construction size={48} strokeWidth={2.5} />
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          {title}
        </h1>
        
        <div className="bg-white border-3 border-[#2d2d2d] wobbly shadow-hard-lg p-8 md:p-12 rotate-1 mb-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold mb-4">
            Coming Soon
          </h2>
          <p className="text-xl text-[#2d2d2d]/70">
            We are actively building the content for the <strong>{title}</strong> page. 
            Our AI engineers and virtual agents are working around the clock!
          </p>
        </div>
        
        <a href="/" className="btn-hand inline-flex items-center px-8 py-4 text-xl">
          Go Back Home
        </a>
      </div>
    </main>
  );
}
