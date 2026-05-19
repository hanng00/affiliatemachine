declare module "*.mdx" {
  import type { ComponentType } from "react";

  export const frontmatter: {
    title: string;
    description: string;
    date?: string;
    updated?: string;
    author?: string;
    image?: string;
    tags?: string[];
    draft?: boolean;
  };

  const MDXComponent: ComponentType;
  export default MDXComponent;
}
