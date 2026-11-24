import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-auto bg-surface border-t border-border pt-12 pb-8 px-6 overflow-hidden transition-colors">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] h-[1px] bg-gradient-to-r from-transparent via-luRed to-transparent opacity-30"></div>
      
      <div className="max-w-[1000px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-10 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-luRed rounded-lg flex items-center justify-center font-bold text-sm text-text">
              LU
            </div>
            <span className="text-luRed font-black tracking-tighter text-lg">CONNECT</span>
          </div>
          <p className="text-muted text-xs md:text-sm max-w-sm">
            The exclusive social network for Kenyan university students. Built with passion from Kenya.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-text font-semibold mb-3 text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5">
              <li><Link href="/download" className="text-muted hover:text-luRed transition-colors text-sm">Download App</Link></li>
              <li><Link href="/guides" className="text-muted hover:text-luRed transition-colors text-sm">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-text font-semibold mb-3 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-muted hover:text-luRed transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-muted hover:text-luRed transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-text font-semibold mb-3 text-xs uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="text-muted hover:text-luRed transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/privacy" className="text-muted hover:text-luRed transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-text font-semibold mb-3 text-xs uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-muted hover:text-luRed transition-colors text-sm">Twitter / X</a></li>
              <li><a href="#" className="text-muted hover:text-luRed transition-colors text-sm">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-border text-xs text-muted gap-4">
          <p>© {new Date().getFullYear()} LU Connect. All rights reserved.</p>
          <p>Built by <strong className="text-text hover:text-luRed transition-colors cursor-pointer">Samuel Mugasia</strong></p>
        </div>
      </div>
    </footer>
  );
}
