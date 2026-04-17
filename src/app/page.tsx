"use client";

import Link from "next/link";
import { useState } from "react";
import { readArchives } from "@/lib/storage";

export default function Home() {
  const [count] = useState(() =>
    typeof window === "undefined" ? 0 : readArchives().length
  );

  return (
    <main className="entrance">
      <p className="kicker">The Archive</p>
      <h1>The Archive of Almosts</h1>
      <p className="statement">A quiet place for the things that almost were.</p>
      <p className="collection-count">
        {count} {count === 1 ? "almost" : "almosts"} in your archive
      </p>
      <nav className="entrance-nav" aria-label="Archive entry points">
        <Link href="/archive/new" className="quiet-button primary">
          File an Almost
        </Link>
        <Link href="/collection" className="quiet-button">
          Wander Your Archive
        </Link>
      </nav>
    </main>
  );
}
