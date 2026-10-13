import { Heading, Section, Text } from "react-email";
import { EmailLayout, Row, body, heading, mail } from "./Layout";

export type GurshaEmailProps = {
  name: string;
  date: string;
  time: string;
  seats: number;
  setLabel: string;
  total: string;
  notes?: string;
};

export default function GurshaConfirmation({
  name,
  date,
  time,
  seats,
  setLabel,
  total,
  notes,
}: GurshaEmailProps) {
  return (
    <EmailLayout preview={`Your Gursha Table request for ${date} at ${time}.`}>
      <Heading as="h1" style={heading}>
        Selam, {name}
      </Heading>
      <Text style={body}>
        Thank you for your seat request at the Gursha Table. We&apos;re holding your seats and will
        confirm by email within a day. Everyone at the table pays the same, at the table.
      </Text>
      <Section style={{ backgroundColor: mail.surface, padding: "16px 20px", borderRadius: 4 }}>
        <Row label="Date" value={date} />
        <Row label="Sitting" value={time} />
        <Row label="Seats" value={String(seats)} />
        <Row label="Set" value={setLabel} />
        <Row label="Total at the table" value={total} />
        {notes ? <Row label="Notes" value={notes} /> : null}
      </Section>
      <Text style={{ ...body, marginTop: 16 }}>
        Each seat includes a shared set meal from the mesob, one drink, and the buna coffee ceremony
        to finish. If your plans change, reply to this email.
      </Text>
    </EmailLayout>
  );
}
