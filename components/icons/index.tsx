import type { SVGProps } from "react";
import type { SocialIcon } from "@/content/site";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/** Line icons: 1.5px stroke, currentColor, decorative (aria-hidden). */
function Icon({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
    </Icon>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10z" />
    </Icon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 10l5 5 5-5" />
    </Icon>
  );
}

const socialPaths: Record<SocialIcon, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  facebook: (
    <path d="M14 21v-7.5h2.6l.4-3H14V8.6c0-.9.3-1.5 1.5-1.5H17V4.4a20 20 0 0 0-2.2-.1c-2.2 0-3.8 1.4-3.8 3.9v2.3H8.5v3H11V21" />
  ),
  tiktok: <path d="M14 3.5v11a3.2 3.2 0 1 1-3.2-3.2M14 3.5c.4 2.3 1.9 3.8 4.2 4" />,
  youtube: (
    <>
      <rect x="2.75" y="5.75" width="18.5" height="12.5" rx="4" />
      <path d="M10.25 9.5v5l4.25-2.5z" />
    </>
  ),
};

export function SocialGlyph({ name, ...props }: IconProps & { name: SocialIcon }) {
  return <Icon {...props}>{socialPaths[name]}</Icon>;
}
