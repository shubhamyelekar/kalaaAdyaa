# Adya Yoga Frontend Spec

## Product Goal
Adya Yoga is a refined, trust-first yoga website for Vaishnavi Simha, a Rishikesh-certified Ashtanga yoga teacher. The site should help visitors understand the teaching style, choose a class format, and begin booking through frontend-only interactions.

## Research Signals
- Yoga studio sites convert best when the schedule and booking path are prominent, not buried behind brand storytelling.
- Rishikesh and certification cues are common trust builders in Indian yoga positioning, but they need restrained presentation to avoid feeling generic.
- Ashtanga audiences expect discipline, lineage, breath, sequence, and steady progression; the tone should be grounded rather than spa-like.
- Wellness design trends favor tactile natural palettes, calm typography, human photography, concise proof points, and mobile-first contact flows.

## Audience
- Beginners who want a safe, guided entry into yoga.
- Returning students looking for an Ashtanga-led or Mysore-style practice.
- Busy professionals seeking private or small-group sessions.

## UX Principles
- The first viewport must make the brand, teacher, style, and booking action clear.
- Users should be able to explore classes, filter by intent, and open a booking panel without leaving the page.
- The site should feel personal to Vaishnavi without requiring biography-heavy reading.
- No backend dependency. Forms can simulate submission and route users to WhatsApp/email.

## Information Architecture
- Hero with brand, teacher, style, CTAs, credibility stats, and next classes.
- Practice paths: Foundations, Led Ashtanga, Private Sessions.
- Teacher section with certification and teaching philosophy.
- Schedule section with day/style filter.
- Booking drawer with selected class summary and contact choices.
- FAQ and footer contact details.

## Visual Direction
- Palette: warm ivory, deep green, terracotta, ink, and soft gold accents.
- Typography: elegant editorial display for brand moments; readable sans-serif for UI.
- Imagery: human yoga practice imagery with natural light.
- Layout: spacious but operational, avoiding nested cards and decorative clutter.

## Acceptance Criteria
- Works by opening `index.html` directly in a browser.
- Responsive from mobile to desktop.
- Class filters, booking drawer, FAQ accordions, and simulated form feedback work without a backend.
- Primary contact options are always reachable.
