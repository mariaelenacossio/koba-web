import { cn } from "@/lib/cn";

/*
  Placeholders shaped like the booking forms, shown while the form loads in
  the browser. They hold the same space as the real form, so the footer
  doesn't jump when it arrives (CLS). Static blocks, no shimmer, so there's
  nothing to tone down for reduced motion.
*/

function Block({ className }: { className?: string }) {
  return <div className={cn("rounded-ctl bg-surface", className)} />;
}

function FieldStub({ tall = false }: { tall?: boolean }) {
  return (
    <div className="grid gap-2">
      <Block className="h-5 w-24" />
      <Block className={cn("w-full border border-line", tall ? "h-24" : "h-12")} />
    </div>
  );
}

function CalendarStub() {
  return (
    <div className="grid gap-2">
      <Block className="h-5 w-12" />
      <Block className="h-[22rem] w-full rounded-card border border-line lg:w-[21rem]" />
    </div>
  );
}

export function ReserveSkeleton() {
  return (
    // Heights match the real form: about 1,400px stacked, 720px in two columns.
    <div
      aria-busy="true"
      className="grid min-h-[1400px] content-start gap-8 lg:min-h-[720px] lg:grid-cols-[auto_1fr] lg:gap-12"
    >
      <p className="sr-only" role="status">
        Loading the booking form.
      </p>
      <div className="grid content-start gap-6">
        <CalendarStub />
        <FieldStub />
        <div className="grid gap-2">
          <Block className="h-5 w-16" />
          <Block className="h-11 w-36 border border-line" />
        </div>
      </div>
      <div className="grid content-start gap-6">
        <FieldStub />
        <FieldStub />
        <FieldStub />
        <FieldStub tall />
        <Block className="h-12 w-40" />
      </div>
    </div>
  );
}

export function GurshaSkeleton() {
  return (
    // Matches step 1 (date, sitting, seats), about 790px at every width.
    <div aria-busy="true" className="grid min-h-[792px] max-w-md content-start gap-6">
      <p className="sr-only" role="status">
        Loading the booking steps.
      </p>
      <div className="grid gap-2">
        <Block className="h-5 w-20" />
        <Block className="h-8 w-32" />
      </div>
      <CalendarStub />
      <FieldStub />
      <div className="grid gap-2">
        <Block className="h-5 w-16" />
        <Block className="h-11 w-36 border border-line" />
      </div>
      <Block className="h-12 w-52" />
    </div>
  );
}
