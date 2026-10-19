# CareerPilot — Eightbits

CareerPilot helps students connect their experience and academic learning to career options, skill gaps, and a trackable learning roadmap.

## Run & Operate

- `pnpm --filter @workspace/careerpilot run dev` — run the CareerPilot web app
- `pnpm --filter @workspace/api-server run dev` — run the shared API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required secret: `OPENAI_API_KEY` — server-side key for on-demand career analysis

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- Web: React, Vite, Wouter
- AI: OpenAI API through the shared server
- Validation: OpenAPI-generated Zod schemas
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/careerpilot/src/App.tsx` — dashboard, resume intake, analysis, roadmap, and learning library
- `artifacts/careerpilot/src/index.css` — CareerPilot visual system and responsive layouts
- `artifacts/api-server/src/routes/career.ts` — server-side OpenAI career-analysis endpoint
- `lib/api-spec/openapi.yaml` — source of truth for the career-analysis contract

## Architecture decisions

- Resume files are parsed in the browser; only extracted text and selected career context are sent to the analysis API.
- Resume content and career-analysis results are not stored by the server; profile, analysis, and roadmap progress use browser localStorage.
- Career-analysis input and model output are validated against schemas generated from OpenAPI.
- The app opens in a clearly labeled demo profile so the product can be explored without using the paid AI endpoint.

## Product

- Resume feedback, career matches, and evidence-based skill gaps
- Personalized course and project recommendations
- A multi-stage career roadmap with on-device progress tracking

## User preferences

- The user wants an eye-catching, hackathon-ready website for Team Eightbits at MIT Surathkal.

## Gotchas

- Live analysis calls OpenAI using the project's `OPENAI_API_KEY`; demo data does not make an AI request.
- Roadmap progress and profile data are local to the current browser and do not sync across devices.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
