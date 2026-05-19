import type { ComponentPropsWithoutRef } from "react";

type HeadingProps = ComponentPropsWithoutRef<"h1">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type AnchorProps = ComponentPropsWithoutRef<"a">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type ListItemProps = ComponentPropsWithoutRef<"li">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;
type PreProps = ComponentPropsWithoutRef<"pre">;
type CodeProps = ComponentPropsWithoutRef<"code">;

export const mdxBaseComponents = {
  h1: (props: HeadingProps) => (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6" {...props} />
  ),
  h2: (props: HeadingProps) => (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-10 mb-4" {...props} />
  ),
  h3: (props: HeadingProps) => (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3" {...props} />
  ),
  h4: (props: HeadingProps) => (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-2" {...props} />
  ),
  p: (props: ParagraphProps) => <p className="leading-7 [&:not(:first-child)]:mt-4" {...props} />,
  a: (props: AnchorProps) => (
    <a className="font-medium text-primary underline underline-offset-4 hover:text-primary/80" {...props} />
  ),
  ul: (props: ListProps) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />,
  ol: (props: ListProps) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />,
  li: (props: ListItemProps) => <li {...props} />,
  blockquote: (props: BlockquoteProps) => (
    <blockquote className="mt-6 border-l-2 border-primary pl-6 italic" {...props} />
  ),
  pre: (props: PreProps) => (
    <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4" {...props} />
  ),
  code: (props: CodeProps) => (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm" {...props} />
  ),
  hr: () => <hr className="my-8 border-muted" />,
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right" {...props} />
  ),
};
