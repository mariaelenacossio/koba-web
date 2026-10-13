import { Body, Container, Head, Hr, Html, Preview, Section, Text } from "react-email";
import type { ReactNode } from "react";

/*
  Shared email frame. Email clients don't load web fonts or CSS variables, so
  the Koba palette is inlined: ivory paper, forest ink, gold-ink accents (the
  light-theme values from DESIGN.md, which read well in any mail client).
*/
export const mail = {
  canvas: "#F6F0E4",
  surface: "#EEE5D3",
  ink: "#12291F",
  muted: "#56604F",
  gold: "#7A5A14",
  line: "#D9CDB5",
  serif: 'Georgia, "Times New Roman", serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
};

export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{ margin: 0, backgroundColor: mail.canvas, fontFamily: mail.sans, color: mail.ink }}
      >
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "32px 24px" }}>
          <Text
            style={{
              fontFamily: mail.serif,
              fontSize: 22,
              letterSpacing: "0.32em",
              color: mail.gold,
              margin: "0 0 24px",
            }}
          >
            KOBA
          </Text>
          {children}
          <Hr style={{ borderColor: mail.line, margin: "32px 0 16px" }} />
          <Section>
            <Text style={{ fontSize: 13, lineHeight: "20px", color: mail.muted, margin: 0 }}>
              Koba, Culture Corner &amp; Eat
              <br />
              Gastown, Vancouver
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <Text style={{ fontSize: 16, lineHeight: "24px", margin: "0 0 4px" }}>
      <span style={{ color: mail.muted }}>{label}: </span>
      {value}
    </Text>
  );
}

export const heading = {
  fontFamily: mail.serif,
  fontSize: 28,
  lineHeight: "34px",
  fontWeight: 400,
  margin: "0 0 12px",
  color: mail.ink,
};

export const body = { fontSize: 16, lineHeight: "26px", margin: "0 0 16px", color: mail.ink };
