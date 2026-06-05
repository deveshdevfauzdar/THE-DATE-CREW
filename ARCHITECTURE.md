# Architecture Documentation

## Technology Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Lucide Icons
- **Animation:** Framer Motion
- **AI Integration:** OpenAI GPT-4o-mini
- **Data Persistence:** `localStorage` (acting as a Mock Backend MVP, architected for Supabase migration)

## System Architecture

The Date Crew dashboard is built on a modern React architecture designed to be incredibly fast, client-side rich, and ready to be connected to a relational database in the future.

### 1. Data Layer (`src/lib/store.ts`)
Instead of hardcoding static JSON files, the application uses a sophisticated pseudo-database architecture inside `localStorage`. 
- **Initialization:** On first load, it generates 120+ highly detailed profiles and saves them to `localStorage`.
- **CRUD Operations:** All interactions (adding a note, updating a match status, editing a profile) are processed through dedicated store functions (e.g., `updateMatchStatus()`, `addNote()`).
- **Supabase Readiness:** The functions are written asynchronously in principle, making the switch to Supabase/PostgreSQL trivial. You only need to replace the `localStorage.getItem` calls with `supabase.from('table').select()`.

### 2. State Management
React state is kept local to the specific pages (`page.tsx`) to avoid massive global state re-renders. We use `useEffect` hooks to fetch data from our `store.ts` pseudo-backend on mount, mimicking standard client-side data fetching patterns (like React Query or SWR).

### 3. Component Structure
The UI is broken down into modular, highly reusable components:
- **Layouts:** `dashboard/layout.tsx` handles the complex responsive sidebar, top bar, and mobile bottom navigation. It also manages global modals like the Quick Search (Cmd+K).
- **Cards & Data:** Components like `StatsCard`, `ActivityItem`, and `SectionCard` ensure visual consistency across the dashboard.
- **Modals:** Complex interactions, such as viewing an AI Match Analysis or generating an Introduction, are handled in AnimatePresence modals to keep the user in context without navigating away.

### 4. Matching Engine (`src/lib/matching/engine.ts`)
The matching logic is abstracted entirely from the UI. It runs synchronously, executing an 8-dimensional weighted check across arrays of objects, returning sorted arrays of `Match` objects.

### 5. Routing
Next.js App Router defines the application structure:
- `/` -> Redirects to login
- `/login` -> Authentication gate
- `/dashboard` -> Main overview, statistics, and customer table
- `/dashboard/customers/[id]` -> The heavy-duty 3-tab customer profile (Biodata, Matches, Notes)
- `/dashboard/ai-assistant` -> Hub explaining AI capabilities
