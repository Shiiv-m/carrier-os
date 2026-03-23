"use server";

import { Octokit } from "octokit";

export async function fetchTopGithubRepos(username: string) {
  const octokit = new Octokit(); 
  
  try {
    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      sort: "pushed",
      per_page: 10,
    });
    
    // Sort by stars and pick top 3
    const topRepos = repos.sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0)).slice(0, 3);
    
    const repoDetails = await Promise.all(topRepos.map(async (repo) => {
      let readme = "";
      try {
        const { data: readmeData } = await octokit.rest.repos.getReadme({
          owner: username,
          repo: repo.name,
          mediaType: { format: "raw" },
        });
        readme = String(readmeData);
      } catch (e) {
        // No readme found, safe to ignore
      }
      return {
        name: repo.name,
        description: repo.description,
        language: repo.language,
        url: repo.html_url,
        readme: readme.substring(0, 1500) // Truncate to save tokens and avoid massive readmes
      };
    }));
    
    return repoDetails;
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    throw new Error("Failed to fetch GitHub repositories.");
  }
}
