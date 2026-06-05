# AI Documentation

## Overview
The Date Crew dashboard leverages Generative AI (OpenAI GPT-4o-mini) to assist matchmakers in analyzing profiles, assessing compatibility, and communicating with customers.

## Architecture

The AI features are implemented using Next.js App Router API Routes (`/api/ai/*`). The application uses a robust **Graceful Fallback Pattern**:
1. The client requests AI analysis from the API route.
2. The server checks for the `OPENAI_API_KEY` environment variable.
3. If the key exists, the server makes a standard REST call to the OpenAI Chat Completions API using strict JSON formatting.
4. If the key is missing (or an error occurs), the server returns a `503 Service Unavailable` status.
5. The client catches the `503` and instantly falls back to a deterministic Mock AI Generator (`src/lib/ai/index.ts`) that constructs highly realistic responses using the actual profile data.

This ensures the application is always demo-ready, even offline or without API keys.

## Mandatory AI Features Implemented

### 1. AI Compatibility Analysis
- **Trigger:** Clicking "View Details" on a candidate card in the Matches tab.
- **Prompt Logic:** Ingests the full JSON biodata of both the customer and the match. It acts as a senior Indian matchmaker, analyzing the computed algorithmic score and providing a human-readable explanation.
- **Output:** JSON object containing `strengths` (array), `concerns` (array), and an overall `explanation`.

### 2. AI Introduction Generator
- **Trigger:** Clicking "Send" on a match card.
- **Prompt Logic:** Instructs the LLM to draft a warm, highly professional introduction email from the matchmaker to the customer, pitching the selected candidate.
- **Output:** JSON object containing `subject`, `body`, and `tone`.

### 3. AI Match Summary
- **Trigger:** Opening any Customer Profile.
- **Prompt Logic:** Condenses a massive 30-field biodata object into a quick, scannable summary for the matchmaker.
- **Output:** JSON object containing `headline`, `summary`, `keyTraits`, and `matchmakingAdvice`.

### 4. AI Match Insights (Bonus feature)
- **Trigger:** Viewed alongside Compatibility Analysis.
- **Prompt Logic:** Highlights specific friction points or conversational ice-breakers for the couple.
- **Output:** Green Flags, Red Flags, Potential Challenges, and Conversation Starters.
