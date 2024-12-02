"use client";

import { logger } from "@/components/Main/logger";
import { useEffect } from "react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error with additional context
    logger.error("Studio page error", {
      error: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }, [error]);

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-orange-400 px-4 py-2 text-sm text-white transition-colors hover:bg-orange-500"
        onClick={() => reset()}
      >
        Try again
      </button>
    </main>
  );
}
