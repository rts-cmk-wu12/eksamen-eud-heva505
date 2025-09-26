import Link from "next/link";
import Image from "next/image";

function IconLink({ href, label, src }) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md
                 transition-transform duration-150 will-change-transform
                 hover:-translate-y-0.5 hover:scale-110"
    >
      <Image
        src={src}
        alt={label}
        width={20}
        height={20}
        className="h-5 w-5 select-none pointer-events-none"
      />
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">


         
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img src="/logo.svg" alt="SwapHub" className="h-10 w-auto" />
            </Link>

            {/* Social icons from /public */}
            <div className="flex items-center gap-3">
              <IconLink
                href="https://www.twitter.com"
                label="X / Twitter"
                src="/X%20Logo.svg"
              />
              <IconLink
                href="https://www.instagram.com"
                label="Instagram"
                src="/Logo%20Instagram.svg"
              />
              <IconLink
                href="https://www.youtube.com"
                label="YouTube"
                src="/Icon.svg"
              />
              <IconLink
                href="https://www.linkedin.com"
                label="LinkedIn"
                src="/LinkedIn.svg"
              />
            </div>
          </div>

     
          <div>
            <h3 className="font-medium mb-4">About SwapHub</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <Link href="#" className="hover:underline">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Community guidelines
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Our mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Discover</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <Link href="/" className="hover:underline">
                  Browse categories
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Popular swaps
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Success stories
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Upcoming events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <Link href="#" className="hover:underline">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Safety tips
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Report an issue
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
