"use client";

import html2canvas from "html2canvas";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArchiveCard } from "@/components/ArchiveCard";
import { findArchive, removeArchive } from "@/lib/storage";

export default function CollectionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const archive = findArchive(params.id) ?? null;

  const onDelete = () => {
    if (!archive) {
      return;
    }

    if (!window.confirm("Delete this archived almost?")) {
      return;
    }

    removeArchive(archive.id);
    router.push("/collection");
  };

  const onDownload = async () => {
    if (!archive) {
      return;
    }

    const element = document.getElementById("archive-detail");
    if (!element) {
      return;
    }

    try {
      const canvas = await html2canvas(element, { backgroundColor: null, scale: 2 });
      const link = document.createElement("a");
      link.download = `archive-${archive.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      window.alert("Could not prepare this archive card for download.");
    }
  };

  if (!archive) {
    return (
      <main className="archive-view-shell">
        <p>This archival piece could not be found on this device.</p>
        <Link href="/collection" className="quiet-button">
          Return to your archive
        </Link>
      </main>
    );
  }

  return (
    <main className="archive-view-shell">
      <div className="flow-actions" style={{ justifyContent: "flex-start" }}>
        <Link href="/collection" className="quiet-button">
          Back to your archive
        </Link>
        <button type="button" className="quiet-button" onClick={onDownload}>
          Download as PNG
        </button>
        <button type="button" className="quiet-button" onClick={onDelete}>
          Delete from archive
        </button>
      </div>
      <ArchiveCard archive={archive} id="archive-detail" />
    </main>
  );
}
