import { NextResponse } from "next/server";
import { getGitHubRepositories } from "../../../lib/github-projects-api";

export async function GET() {
  const result = await getGitHubRepositories();
  return NextResponse.json(result.body, {
    status: result.status,
    headers: {
      "Cache-Control": result.cacheControl,
    },
  });
}
