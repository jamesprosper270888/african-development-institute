import { NextRequest, NextResponse } from "next/server";

const GITHUB_OWNER = "jamesprosper270888";
const GITHUB_REPO = "african-development-institute";
const COMMITS_PER_PAGE = 30;
const MAX_COMMITS = 500;

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

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

function parseCommitType(message: string): {
  type: ParsedCommit["type"];
  cleanMessage: string;
} {
  const lower = message.toLowerCase();

  if (lower.startsWith("feat:") || lower.startsWith("feat(")) {
    return {
      type: "feature",
      cleanMessage: message.replace(/^feat(\([^)]*\))?:\s*/i, ""),
    };
  }
  if (lower.startsWith("fix:") || lower.startsWith("fix(")) {
    return {
      type: "fix",
      cleanMessage: message.replace(/^fix(\([^)]*\))?:\s*/i, ""),
    };
  }
  if (lower.startsWith("refactor:") || lower.startsWith("refactor(")) {
    return {
      type: "improvement",
      cleanMessage: message.replace(/^refactor(\([^)]*\))?:\s*/i, ""),
    };
  }
  if (lower.startsWith("perf:") || lower.startsWith("perf(")) {
    return {
      type: "improvement",
      cleanMessage: message.replace(/^perf(\([^)]*\))?:\s*/i, ""),
    };
  }
  if (
    lower.startsWith("style:") ||
    lower.startsWith("style(") ||
    lower.startsWith("ui:") ||
    lower.startsWith("ui(") ||
    lower.startsWith("design:") ||
    lower.startsWith("design(")
  ) {
    return {
      type: "design",
      cleanMessage: message.replace(
        /^(style|ui|design)(\([^)]*\))?:\s*/i,
        ""
      ),
    };
  }
  if (
    lower.startsWith("chore:") ||
    lower.startsWith("chore(") ||
    lower.startsWith("docs:") ||
    lower.startsWith("docs(") ||
    lower.startsWith("test:") ||
    lower.startsWith("test(") ||
    lower.startsWith("build:") ||
    lower.startsWith("build(") ||
    lower.startsWith("ci:") ||
    lower.startsWith("ci(")
  ) {
    return {
      type: "other",
      cleanMessage: message.replace(
        /^(chore|docs|test|build|ci)(\([^)]*\))?:\s*/i,
        ""
      ),
    };
  }

  return { type: "improvement", cleanMessage: message };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getDateKey(dateString: string): string {
  const date = new Date(dateString);
  const parts = date.toISOString().split("T");
  return parts[0] ?? dateString.substring(0, 10);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const perPage = Math.min(20, Math.max(1, parseInt(searchParams.get("perPage") || "5", 10)));

  try {
    const allCommits: GitHubCommit[] = [];
    const token = process.env.GITHUB_TOKEN;
    let githubPage = 1;

    while (allCommits.length < MAX_COMMITS) {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?page=${githubPage}&per_page=${COMMITS_PER_PAGE}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "ADI-Changelog",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          return NextResponse.json(
            {
              error:
                "GitHub API rate limit exceeded. Please try again later.",
            },
            { status: 429 }
          );
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const commits: GitHubCommit[] = await response.json();
      if (commits.length === 0) break;
      allCommits.push(...commits);
      githubPage++;
    }

    if (allCommits.length > MAX_COMMITS) {
      allCommits.length = MAX_COMMITS;
    }

    // Filter out merge commits and bot commits
    const filteredCommits = allCommits.filter((commit) => {
      const firstLine =
        commit.commit.message.split("\n")[0]?.toLowerCase() ?? "";
      return (
        !firstLine.startsWith("merge") &&
        !commit.commit.author.name.includes("[bot]")
      );
    });

    // Parse commits
    const parsedCommits: ParsedCommit[] = filteredCommits.map((commit) => {
      const firstLine =
        commit.commit.message.split("\n")[0] ?? commit.commit.message;
      const { type, cleanMessage } = parseCommitType(firstLine);

      return {
        sha: commit.sha.substring(0, 7),
        type,
        message:
          cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1),
        date: commit.commit.author.date,
        url: commit.html_url,
      };
    });

    // Group by date
    const groupedMap = new Map<string, ParsedCommit[]>();
    parsedCommits.forEach((commit) => {
      const dateKey = getDateKey(commit.date);
      if (!groupedMap.has(dateKey)) {
        groupedMap.set(dateKey, []);
      }
      groupedMap.get(dateKey)!.push(commit);
    });

    // Convert to array and sort by date (newest first)
    const groupedEntries: GroupedEntry[] = Array.from(groupedMap.entries())
      .filter(([, commits]) => commits.length > 0)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([dateKey, commits]) => ({
        date: dateKey,
        dateFormatted: formatDate(commits[0]!.date),
        commits,
      }));

    // Paginate groups
    const totalGroups = groupedEntries.length;
    const totalPages = Math.ceil(totalGroups / perPage);
    const startIndex = (page - 1) * perPage;
    const paginatedEntries = groupedEntries.slice(
      startIndex,
      startIndex + perPage
    );

    return NextResponse.json({
      entries: paginatedEntries,
      pagination: {
        page,
        perPage,
        totalGroups,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Changelog API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch changelog" },
      { status: 500 }
    );
  }
}
