import { SocialGlyph } from "@/components/icons";
import { Tooltip } from "@/components/ui/Tooltip";
import { site } from "@/content/site";

export function SocialLinks() {
  return (
    <ul className="flex gap-2">
      {site.socials.map((s, i, all) => (
        <li key={s.icon}>
          {/* Edge tips line up with the row's ends so they never leave the screen. */}
          <Tooltip
            label={`Follow Koba on ${s.label}`}
            side="top"
            align={i === 0 ? "start" : i === all.length - 1 ? "end" : "center"}
          >
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow Koba on ${s.label} (opens in a new tab)`}
              className="grid size-11 place-items-center rounded-ctl border border-line-strong text-ink transition-colors duration-150 hover:border-gold hover:text-gold-ink"
            >
              <SocialGlyph name={s.icon} size={22} />
            </a>
          </Tooltip>
        </li>
      ))}
    </ul>
  );
}
