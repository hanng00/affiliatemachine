import { MDXProvider } from "@mdx-js/react";
import type { ReactNode, ComponentType } from "react";
import { mdxBaseComponents } from "./components";

interface MDXWrapperProps {
  children: ReactNode;
  components?: Record<string, ComponentType<unknown>>;
}

export function MDXWrapper({ children, components = {} }: MDXWrapperProps) {
  return <MDXProvider components={{ ...mdxBaseComponents, ...components }}>{children}</MDXProvider>;
}
