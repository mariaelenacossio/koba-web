import { Heading, Section, Text } from "react-email";
import { EmailLayout, Row, body, heading, mail } from "./Layout";

export type RestaurantNotificationProps = {
  kind: "Table" | "Gursha Table";
  date: string;
  time: string;
  party: string;
  name: string;
  email: string;
  phone?: string;
  setLabel?: string;
  notes?: string;
  reference: string;
};

export default function RestaurantNotification(p: RestaurantNotificationProps) {
  return (
    <EmailLayout preview={`New ${p.kind.toLowerCase()} request: ${p.date}, ${p.time}, ${p.party}.`}>
      <Heading as="h1" style={heading}>
        New {p.kind} request
      </Heading>
      <Text style={body}>
        Confirm it with the guest by email, then mark it confirmed in Supabase.
      </Text>
      <Section style={{ backgroundColor: mail.surface, padding: "16px 20px", borderRadius: 4 }}>
        <Row label="Date" value={p.date} />
        <Row label="Time" value={p.time} />
        <Row label="Party" value={p.party} />
        {p.setLabel ? <Row label="Set" value={p.setLabel} /> : null}
        <Row label="Name" value={p.name} />
        <Row label="Email" value={p.email} />
        {p.phone ? <Row label="Phone" value={p.phone} /> : null}
        {p.notes ? <Row label="Notes" value={p.notes} /> : null}
        <Row label="Reference" value={p.reference} />
      </Section>
    </EmailLayout>
  );
}
