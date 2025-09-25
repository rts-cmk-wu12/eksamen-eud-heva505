"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // AuthContext
  const { isLoggedIn, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-6">
          <div className="flex items-center min-w-0 flex-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img src="/logo.svg" alt="SwapHub" className="h-10 w-auto" />
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6 ml-auto">
              <NavLink href="/" active={pathname === "/"}>
                Listings
              </NavLink>
              <NavLink
                href="/community"
                active={pathname?.startsWith("/community")}
              >
                Community
              </NavLink>
              <NavLink
                href="/contact"
                active={pathname?.startsWith("/contact")}
              >
                Contact
              </NavLink>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-full border px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-full bg-black px-3 py-1.5 text-sm !text-white hover:bg-gray-900"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="inline-flex items-center rounded-full border px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="inline-flex items-center rounded-full bg-black px-3 py-1.5 text-sm text-white hover:bg-gray-900"
                >
                  Log out
                </button>
              </>
            )}
          </div>

          {/* زر الموبايل */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg border px-3 py-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col gap-2">
              <MobileLink href="/" onClick={() => setOpen(false)}>
                Listings
              </MobileLink>
              <MobileLink href="/community" onClick={() => setOpen(false)}>
                Community
              </MobileLink>
              <MobileLink href="/contact" onClick={() => setOpen(false)}>
                Contact
              </MobileLink>

              <div className="h-px bg-gray-200 my-2" />

              {!isLoggedIn ? (
                <>
                  <MobileLink href="/login" onClick={() => setOpen(false)}>
                    Sign in
                  </MobileLink>
                  <Link
                    href="/register"
                    className="px-2 py-2 rounded bg-black text-white text-center"
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <MobileLink href="/profile" onClick={() => setOpen(false)}>
                    Profile
                  </MobileLink>
                  <button
                    className="text-left px-2 py-2 rounded bg-black text-white"
                    onClick={() => {
                      setOpen(false);
                      signOut();
                    }}
                  >
                    Log out
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`text-sm text-gray-700 hover:text-black transition ${
        active
          ? "relative after:absolute after:-bottom-2 after:left-1/2 after:h-[2px] after:w-6 after:-translate-x-1/2 after:bg-black"
          : ""
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      className="px-2 py-2 rounded hover:bg-gray-50"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
