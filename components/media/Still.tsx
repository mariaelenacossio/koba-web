import Image from "next/image";
import { still, type StillId } from "@/content/gallery";
import { cn } from "@/lib/cn";

type Props = {
  id: StillId;
  /** The rendered width at each breakpoint, for next/image's srcset. */
  sizes: string;
  className?: string;
};

/** A film still with its real alt text and intrinsic size. Lazy by default. */
export function Still({ id, sizes, className }: Props) {
  const s = still(id);
  return (
    <Image
      src={s.src}
      alt={s.alt}
      width={s.width}
      height={s.height}
      sizes={sizes}
      className={cn("h-auto w-full", className)}
    />
  );
}
