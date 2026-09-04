export function formatPageSection(title: string, url: string, content: string): string {
  return `# ${title}\nSource: ${url}\n\n${content}`;
}

export function buildLlmsFullText(sections: string[]): string {
  return sections.join("\n\n---\n\n");
}
