export interface Frontmatter {
  title: string;
  description: string;
  date?: string;
  updated?: string;
  author?: string;
  image?: string;
  tags?: string[];
  draft?: boolean;
}

export interface MDXContent {
  frontmatter: Frontmatter;
  content: React.ComponentType;
}
