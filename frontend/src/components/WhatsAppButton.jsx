import { Phone } from "lucide-react";

export default function WhatsAppButton() {
  const message = encodeURIComponent("Hello Gratia Estates, I am interested in a Gurgaon property. Please share suitable project options.");
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
      <a
        href={`https://wa.me/919109776155?text=${message}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Gratia Estates on WhatsApp"
        title="Chat on WhatsApp"
        className="grid size-14 place-items-center rounded-full bg-[#20c767] text-white shadow-[0_10px_24px_rgba(32,199,103,0.35)] transition duration-200 hover:scale-105 hover:bg-[#19b85c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#20c767]"
      >
        <svg
          viewBox="0 0 32 32"
          className="size-7 fill-current"
          aria-hidden="true"
        >
          <path d="M16.04 3C8.88 3 3.05 8.82 3.05 15.98c0 2.29.6 4.52 1.74 6.49L3 29l6.7-1.75a12.95 12.95 0 0 0 6.33 1.62h.01c7.16 0 12.98-5.82 12.98-12.98A12.9 12.9 0 0 0 25.2 6.7 12.9 12.9 0 0 0 16.04 3Zm0 23.67h-.01a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-3.98 1.04 1.06-3.88-.25-.4a10.66 10.66 0 0 1-1.63-5.73c0-5.9 4.8-10.7 10.7-10.7 2.86 0 5.55 1.12 7.57 3.14a10.63 10.63 0 0 1 3.13 7.57c0 5.9-4.8 10.68-10.75 10.68Zm5.87-8.01c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.84 1.05-1.03 1.27-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.57-1.6-.95-.84-1.59-1.88-1.78-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.57-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.22 0-.57.08-.86.4-.3.32-1.13 1.1-1.13 2.67s1.16 3.1 1.32 3.31c.16.21 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.62-.37Z" />
        </svg>
      </a>
      <a
        href="tel:+919109776155"
        aria-label="Call Gratia Estates at +91 9109776155"
        title="Call +91 9109776155"
        className="grid size-14 place-items-center rounded-full bg-[#102a52] text-white shadow-[0_10px_24px_rgba(16,42,82,0.3)] transition duration-200 hover:scale-105 hover:bg-[#173967] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#102a52]"
      >
        <Phone size={23} strokeWidth={2.75} aria-hidden="true" />
      </a>
    </div>
  );
}
