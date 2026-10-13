import { cn } from "@/lib/cn";

type Props = {
  id: string;
  amharic: string;
  title: string;
  lead?: string;
  as?: "h1" | "h2";
  className?: string;
};

/**
 * Every section heading carries its Amharic name above it in gold-soft
 * (gold-ink in the light theme). This replaces uppercase eyebrow labels.
 */
export function SectionHeading({ id, amharic, title, lead, as: Tag = "h2", className }: Props) {
  return (
    <div className={cn("grid gap-3", className)}>
      <p lang="am" className="font-amharic-serif text-am-title font-medium text-amharic">
        {amharic}
      </p>
      <Tag id={id} className="text-h2">
        {title}
      </Tag>
      {lead && <p className="max-w-[36ch] text-lead text-ink-muted">{lead}</p>}
    </div>
  );
}
