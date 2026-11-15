# Plan with Myra: a concept prototype

A concept prototype for a design assignment: planning a trip with friends inside MakeMyTrip, with Myra (the AI assistant) helping you choose instead of making you type.

> **Not affiliated with, endorsed by or connected to MakeMyTrip.** All prices, seats, reviews and people are sample data. Nothing is booked and no payment is taken.

## The flow

1. **Home:** "Plan with Myra" sits next to Flights and Hotels (website), or in the app's home and bottom bar (phone).
2. **Start:** pick a kind of trip, who's coming (a range), where from and when. Typing or speaking is optional.
3. **City:** Myra repeats back what it understood and suggests 3 places. The host fixes the city.
4. **Transport and stay:** compare options, with Myra's pick and its reason, live-seat checks, a sold-out state and a map. The host shortlists up to 3 of each.
5. **Share:** one link for everyone, with a message written by Myra.
6. **Friend's view:** the city is locked. Friends vote on transport and stay, see others' votes and comment.
7. **Results:** who chose what, Myra's summary, a split vote the host settles, and a dropout (6 → 5) with the new price.
8. **Approve → pay → booked:** Myra shows exactly what it will book. Nothing is booked until the host approves. Payment is a light, simulated step.

The website layout follows the low-fi wireframes: what's decided on top, choices in the middle, chat and the main action at the bottom, and steps and Myra on the right. On phone widths it becomes the app layout: a capsule at the top, a step progress bar, and Myra in a bottom drawer. On desktop, the **App view** button shows the phone layout in a frame.

## Run it

```bash
npm install
npm run dev
```

## Versions

Each round of changes goes on its own branch and gets a Vercel preview link. When it's merged into `main`, it's tagged (`v0.1`, `v0.2`, …).
