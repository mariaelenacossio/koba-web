import { SocialGlyph } from "@/components/icons";
import { site } from "@/content/site";

export function SocialLinks() {
  return (
    <ul className="flex gap-2">
      {site.socials.map((s) => (
        <li key={s.icon}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Koba on ${s.label} (opens in a new tab)`}
            className="grid size-11 place-items-center rounded-ctl border border-line-strong text-ink transition-colors duration-150 hover:border-gold hover:text-gold-ink"
          >
            <SocialGlyph name={s.icon} size={22} />
          </a>
        </li>
      ))}
    </ul>
  );
}
