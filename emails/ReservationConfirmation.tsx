import { Heading, Section, Text } from "react-email";
import { EmailLayout, Row, body, heading, mail } from "./Layout";

export type ReservationEmailProps = {
  name: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
};

export default function ReservationConfirmation({
  name,
  date,
  time,
  guests,
  notes,
}: ReservationEmailProps) {
  const party = `${guests} ${guests === 1 ? "guest" : "guests"}`;
  return (
    <EmailLayout preview={`We have your request for ${date} at ${time}.`}>
      <Heading as="h1" style={heading}>
        Selam, {name}
      </Heading>
      <Text style={body}>
        Thank you for your table request. We&apos;ll confirm it by email within a day. Nothing is
        charged to reserve.
      </Text>
      <Section style={{ backgroundColor: mail.surface, padding: "16px 20px", borderRadius: 4 }}>
        <Row label="Date" value={date} />
        <Row label="Time" value={time} />
        <Row label="Party" value={party} />
        {notes ? <Row label="Notes" value={notes} /> : null}
      </Section>
      <Text style={{ ...body, marginTop: 16 }}>
        If your plans change, reply to this email and we&apos;ll update your request.
      </Text>
    </EmailLayout>
  );
}
