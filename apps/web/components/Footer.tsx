import { Phone } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Roadmap", "Enterprise"],
  Resources: ["Documentation", "API", "Blog", "Changelog"],
  Company: ["About", "Careers", "Contact", "Press"],
  Legal: ["Privacy", "Terms", "Security", "GDPR"],
};

export default function Footer() {
  return (
    <footer className="bg-[#fdfbf7] border-t-3 border-[#2d2d2d] py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#ff4d4d] border-3 border-[#2d2d2d] flex items-center justify-center text-white font-[family-name:var(--font-heading)] font-bold text-lg wobbly-sm shadow-hard">
                <Phone size={20} strokeWidth={2.5} />
              </div>
              <span className="font-[family-name:var(--font-heading)] text-2xl font-bold">
                VaaniVerse
              </span>
            </div>
            <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/60 text-sm">
              The world&apos;s first AI Contact Centre Flight Simulator.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-[family-name:var(--font-heading)] font-bold text-lg mb-4">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href={`/${link.toLowerCase()}`}
                      className="font-[family-name:var(--font-body)] text-[#2d2d2d]/60 hover:text-[#ff4d4d] transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t-2 border-dashed border-[#e5e0d8] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/40 text-sm">
            &copy; {new Date().getFullYear()} VaaniVerse. All rights reserved.
          </p>
          <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/40 text-sm">
            Train like you&apos;re already live.
          </p>
        </div>
      </div>
    </footer>
  );
}
