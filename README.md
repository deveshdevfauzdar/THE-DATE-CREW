# The Date Crew — Matchmaker Dashboard

A premium matchmaking operations platform designed for elite matchmaking consultants. This dashboard serves as an internal CRM for managing customers, tracking relationship journeys, and utilizing AI for smart match recommendations.

## Assignment Deliverables

- **Live Hosted Link**: `[INSERT_VERCEL_LINK_HERE]` *(Please update after deploying to Vercel)*
- **GitHub Repository**: [https://github.com/deveshdevfauzdar/THE-DATE-CREW](https://github.com/deveshdevfauzdar/THE-DATE-CREW)
- **Sample Login Credentials**:
  - **Email**: `priya@thedatecrew.com` (Admin)
  - **Email**: `rahul@thedatecrew.com` (Matchmaker)
  - **Password**: `matchmaker123`
- **Project Write-Up**: See the detailed section below explaining tech choices, matching logic, AI usage, and assumptions.

## Features

- **Authentication System**: Secure login for matchmakers with demo credentials.
- **Dynamic Dashboard**: Complete overview with real-time stats and a powerful data table.
- **Customer Profiles**: In-depth profiles capturing biodata, career, family, preferences, and journey tracking.
- **Matching Engine**: Deterministic gender-specific compatibility scoring across 8 dimensions.
- **AI Integration**: AI compatibility analysis, generated introduction emails, insights, and summaries.
- **Notes System**: Built-in CRM capabilities with CRUD operations for customer notes.
- **Responsive Design**: Premium aesthetic that works flawlessly across desktop, tablet, and mobile.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Custom tailored components with [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI**: [OpenAI GPT-4o-mini](https://openai.com/)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your OpenAI API key to enable live AI features (otherwise, the app will gracefully fall back to mock AI data):
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Write-Up

**Tech Choices & Assumptions Made**
I built the dashboard using Next.js 15 (App Router) with TypeScript to ensure a strongly typed, scalable, and modern foundation. For the UI, I utilized Tailwind CSS v4 and Framer Motion to create a premium, intuitive, and emotionally aligned matchmaker experience. Since this is an MVP without a live database, I built a sophisticated client-side data store using `localStorage` pre-seeded with 120 dynamic profiles. This acts as a functional mock backend with full CRUD capabilities, designed with a clear separation of concerns to easily swap to a real database (like Supabase or Firebase) in the future. The primary assumption made is that matchmakers prefer a high-density, professional CRM interface over a consumer-style dating app UI.

**Matching Logic**
The matching engine implements a deterministic, gender-specific compatibility algorithm that scores pairs across 8 dimensions (Age, Education, Income, Location, Religion, Lifestyle, Children, Relocation). As requested, male customers are scored favorably when matched with women who are younger, earn less, are shorter, and have aligned views on family planning. For female customers, the engine uses a more holistic, modern approach, factoring in their explicit partner preferences, professional alignment, and shared values. This logic is fully documented in `src/lib/matching/engine.ts`.

**How AI is Used**
AI is deeply integrated into the matchmaking workflow across four primary features: Compatibility Analysis, Match Insights (Green/Red flags), Profile Summaries, and an Introduction Email Generator. To guarantee an uninterrupted experience during evaluation, the AI module is built with a Graceful Fallback Engine. If an `OPENAI_API_KEY` is provided in `.env.local`, the app securely calls GPT-4o-mini via Next.js server routes. If no key is present (or if the API fails), the application instantly falls back to an offline, natural-language reasoning generator that synthesizes realistic AI outputs based on the exact datapoints of the profiles.

## License

Private and confidential. Property of The Date Crew.
