import Link from "next/link";
import { PhoneCall } from "lucide-react";

export function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link href="/contact-support" aria-label="Contact support" title="Contact support">
        <button
          className="flex items-center gap-2 rounded-full px-4 py-3 text-white shadow-lg transition transform hover:-translate-y-1 hover:scale-105 active:scale-95 neon-border"
          style={{ background: "linear-gradient(90deg, var(--primary), var(--secondary))" }}
        >
          <PhoneCall className="h-4 w-4" />
          <span className="hidden sm:inline">Contact Support</span>
        </button>
      </Link>
    </div>
  );
}
