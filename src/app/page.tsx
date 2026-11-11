import Link from "next/link";
import { CarFront, Check, Navigation, Phone, Star, Truck } from "lucide-react";
import { EmergencyButton } from "@/components/EmergencyButton";

const services = [
  ["Flat tyres", "Puncture repair, or your spare fitted where you stopped."],
  ["Dead batteries", "A jump-start, or a new battery if yours is finished."],
  ["Towing", "To your own mechanic, or the nearest garage that's open."],
  ["Running out of fuel", "Enough to get you to the next pump."],
  ["Keys locked in the car", "Someone who can open it without breaking a window."],
  ["Engine trouble", "Overheating, warning lights, strange noises. A mechanic takes a look on the spot."],
];

const steps = [
  ["Tell us what happened", "Pick the problem and check the pin on the map. That's all we ask for."],
  ["A nearby workshop accepts", "Every verified workshop close to you gets the request. Whoever's free takes it."],
  ["They come to you", "You'll see who's coming and roughly when. Call them directly if you need to."],
];

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      {/* Hero */}
      <section className="bg-paper px-4 pt-20 md:px-6 md:pt-28">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center">
          <h1 className="display text-[3.4rem] text-obsidian uppercase sm:text-[5.5rem] lg:text-[7.5rem]">
            Broken down?
            <br />
            <span className="text-forest">Help&apos;s coming.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-charcoal md:text-xl">
            Send your location to mechanics and tow trucks near you. Someone local accepts, and comes
            out to wherever you&apos;re stuck.
          </p>

          <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
            <EmergencyButton size="lg" />
            <Link
              href="#how-it-works"
              className="font-medium text-forest underline underline-offset-4 hover:no-underline"
            >
              How it works
            </Link>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-16 -mb-40 max-w-md md:-mb-48">
          <HeroPreview />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-16 bg-fog px-4 pt-56 pb-20 md:px-6 md:pt-64 md:pb-28">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-3xl font-bold tracking-tight md:text-[2.75rem] md:leading-tight">How it works</h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
            {steps.map(([title, text], i) => (
              <li key={title} className="border-t border-forest/20 pt-6">
                <span className="text-sm font-semibold text-forest">{i + 1}.</span>
                <h3 className="mt-2 text-xl font-bold">{title}</h3>
                <p className="mt-2 leading-relaxed text-charcoal">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-16 bg-paper px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-[2.75rem] md:leading-tight">What we can help with</h2>
            <p className="mt-4 max-w-sm leading-relaxed text-charcoal">
              Most breakdowns are one of these. If yours isn&apos;t, pick &ldquo;Other&rdquo; and describe it.
              A mechanic will tell you if they can fix it.
            </p>
          </div>

          <dl className="divide-y divide-fog border-y border-fog">
            {services.map(([title, text]) => (
              <div key={title} className="grid gap-1 py-5 sm:grid-cols-[14rem_1fr] sm:gap-6">
                <dt className="font-semibold text-obsidian">{title}</dt>
                <dd className="text-charcoal">{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* For providers */}
      <section className="bg-paper px-4 pb-20 md:px-6 md:pb-28">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 rounded-[28px] bg-forest p-8 md:p-14 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-lime md:text-[2.75rem] md:leading-tight">
              Run a garage or a tow truck?
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/85">
              Sign up, and turn yourself online whenever you&apos;re free to take a job. You only see
              requests within the distance you set, and you decide which ones to accept. Joining is free.
            </p>
            <Link
              href="/provider/register"
              className="mt-10 inline-flex h-12 items-center rounded-full bg-paper px-7 font-semibold text-forest transition-colors hover:bg-mist"
            >
              Join as a provider
            </Link>
          </div>

          <ProviderPreview />
        </div>
      </section>
    </div>
  );
}

/* What a driver sees after a mechanic accepts */
function HeroPreview() {
  return (
    <div className="overflow-hidden rounded-[28px] bg-paper text-left shadow-float">
      <div className="relative h-48 bg-mist">
        <svg viewBox="0 0 400 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <g stroke="#ffffff" strokeWidth="16" fill="none" strokeLinecap="round">
            <path d="M-10 140 C 90 130, 150 60, 260 66 S 380 40, 420 30" />
            <path d="M120 -10 L 150 220" />
            <path d="M300 -10 C 290 80, 330 140, 320 220" />
          </g>
          <path
            d="M74 138 C 112 124, 142 86, 200 70 S 290 62, 310 86"
            stroke="#163300"
            strokeWidth="4"
            fill="none"
            strokeDasharray="1 10"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute top-[38%] left-[76%] grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lime text-forest ring-4 ring-paper">
          <CarFront className="size-5" />
        </span>
        <span className="absolute top-[68%] left-[18%] grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-forest text-lime ring-4 ring-paper">
          <Truck className="size-5" />
        </span>
      </div>

      <div className="space-y-5 p-6">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Flat tyre · NH 66</p>
            <p className="mt-0.5 text-xl font-bold text-obsidian">Arriving in about 12 min</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-y border-fog py-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-obsidian">Sreeram Auto Works</p>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="size-3.5 fill-forest text-forest" /> 4.8 from 63 jobs
            </p>
          </div>
          <span className="grid size-10 place-items-center rounded-full border border-forest text-forest">
            <Phone className="size-4" />
          </span>
        </div>

        <ol className="space-y-2.5 text-sm">
          {[
            ["Request sent, 10:42", true],
            ["Accepted by Sreeram Auto Works, 10:44", true],
            ["On the way", false],
          ].map(([label, done]) => (
            <li key={label as string} className="flex items-center gap-3">
              {done ? (
                <Check className="size-4 text-forest" strokeWidth={3} />
              ) : (
                <span className="ml-1 size-2 rounded-full bg-forest" />
              )}
              <span className={done ? "text-muted-foreground" : "font-semibold text-obsidian"}>{label as string}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* What a provider sees when a request comes in */
function ProviderPreview() {
  return (
    <div className="mx-auto w-full max-w-md lg:mr-0">
      <div className="rounded-[10px] bg-paper p-5">
        <p className="text-sm text-muted-foreground">New request · 2.4 km away</p>
        <p className="mt-1 text-lg font-bold text-obsidian">Dead battery, Maruti Swift</p>
        <p className="mt-3 flex items-center gap-2 text-sm text-charcoal">
          <Navigation className="size-4 shrink-0" /> Near Edappally junction, Kochi
        </p>
        <p className="mt-3 text-sm text-charcoal">
          &ldquo;Car won&apos;t start, lights are dim. Parked outside the bakery.&rdquo;
        </p>
        <div className="mt-5 flex items-center gap-5">
          <span className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-forest font-semibold text-white">
            Accept
          </span>
          <span className="font-medium text-forest underline underline-offset-4">Not now</span>
        </div>
      </div>
    </div>
  );
}
