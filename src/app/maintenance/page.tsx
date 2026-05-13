import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-auth-radial px-5 text-white">
      <section className="w-full max-w-lg rounded-lg border border-white/14 bg-white/10 p-8 text-center backdrop-blur">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-md bg-banking-gold text-banking-ink">
          <Wrench className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-normal">
          Maintenance in progress
        </h1>
        <p className="mt-3 leading-7 text-white/74">
          North Union is temporarily unavailable while system maintenance is completed.
        </p>
      </section>
    </main>
  );
}
