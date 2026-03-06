"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";

interface ParsedCommit {
  sha: string;
  type: "feature" | "improvement" | "fix" | "design" | "other";
  message: string;
  date: string;
  url: string;
}

interface GroupedEntry {
  date: string;
  dateFormatted: string;
  commits: ParsedCommit[];
}

interface ChangelogResponse {
  entries: GroupedEntry[];
  pagination: {
    page: number;
    perPage: number;
    totalGroups: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

function TypeBadge({ type }: { type: ParsedCommit["type"] }) {
  const styles = {
    feature: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    improvement: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    fix: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    design: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    other: "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <span
      className={`mt-0.5 inline-flex shrink-0 items-center justify-center rounded px-2 py-0.5 text-xs font-medium uppercase ${styles[type]}`}
    >
      {type === "other" ? "update" : type}
    </span>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("ellipsis");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-10 w-10 rounded-md text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-adi-red text-white"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-16">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div className="mb-6">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="mt-3 h-6 w-48 rounded bg-muted" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex gap-3">
                <div className="h-5 w-16 rounded bg-muted" />
                <div className="h-5 flex-1 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChangelogContent() {
  const [data, setData] = useState<ChangelogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchChangelog() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/changelog?page=${page}&perPage=5`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch changelog");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load changelog"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchChangelog();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Changelog</h1>
        <p className="mt-1 text-muted-foreground">
          New updates and improvements to the African Development Institute
        </p>
      </div>

      {loading && !data ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="py-12 text-center">
          <p className="text-destructive">{error}</p>
          <button
            onClick={() => setPage(1)}
            className="mt-4 text-adi-red hover:underline"
          >
            Try again
          </button>
        </div>
      ) : data && data.entries.length > 0 ? (
        <>
          <div className="space-y-16">
            {data.entries.map((entry) => (
              <div key={entry.date} className="relative">
                <div className="mb-6">
                  <time className="text-sm font-medium text-adi-red">
                    {entry.dateFormatted}
                  </time>
                </div>

                <ul className="space-y-3">
                  {entry.commits.map((commit) => (
                    <li key={commit.sha} className="flex gap-3">
                      <TypeBadge type={commit.type} />
                      <div className="flex flex-1 items-start justify-between gap-2">
                        <p className="leading-relaxed text-foreground">
                          {commit.message}
                        </p>
                        <a
                          href={commit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                          title={`View commit ${commit.sha}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50">
              <Loader2 className="h-8 w-8 animate-spin text-adi-red" />
            </div>
          )}

          <Pagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No changelog entries yet.</p>
        </div>
      )}
    </div>
  );
}
