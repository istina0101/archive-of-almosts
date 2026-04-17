import { Archive } from "./types";

export const ARCHIVE_STORAGE_KEY = "archive_of_almosts";
const WARNING_STORAGE_KEY = "archive_of_almosts_warning_seen";

export const isBrowser = typeof window !== "undefined";

export function readArchives(): Archive[] {
  if (!isBrowser) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as Archive[];
  } catch {
    return [];
  }
}

export function writeArchives(archives: Archive[]) {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(archives));
}

export function addArchive(archive: Archive) {
  const archives = readArchives();
  writeArchives([archive, ...archives]);
}

export function removeArchive(id: string) {
  const archives = readArchives().filter((archive) => archive.id !== id);
  writeArchives(archives);
}

export function findArchive(id: string) {
  return readArchives().find((archive) => archive.id === id);
}

export function hasSeenWarning() {
  if (!isBrowser) {
    return true;
  }

  return window.localStorage.getItem(WARNING_STORAGE_KEY) === "true";
}

export function markWarningSeen() {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(WARNING_STORAGE_KEY, "true");
}
