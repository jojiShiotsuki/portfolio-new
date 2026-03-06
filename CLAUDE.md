# CLAUDE.md

## Agent Usage

Always use the engineering division agents from `/agents` for tasks. Match the agent to the task:

### Engineering Division
- **Frontend Developer** — UI bugs, component work, responsive fixes, CSS/styling, accessibility
- **Senior Developer** — Complex implementations, architecture changes, config fixes, security
- **Backend Architect** — API design, worker/serverless functions, infrastructure, deployment
- **DevOps Automator** — CI/CD pipelines, build config, deployment workflows
- **Rapid Prototyper** — Quick MVPs, proof-of-concept features

### QA Division
- **Evidence Collector** — Bug hunting, QA audits, visual verification
- **Reality Checker** — Production readiness certification, evidence-based approval
- **Performance Benchmarker** — Performance testing, Lighthouse audits, bundle analysis
- **API Tester** — API endpoint validation, integration testing

### Design Division
- **UI Designer** — Visual design systems, component libraries, pixel-perfect interfaces
- **UX Architect** — Technical architecture, CSS systems, implementation guidance
- **UX Researcher** — User behavior analysis, usability testing

### Operations Division
- **Studio Producer** — Multi-project orchestration, resource allocation
- **Project Shepherd** — Cross-functional coordination, timeline management
- **Senior Project Manager** — Spec-to-task conversion, scope management

When facing a task, dispatch multiple agents in parallel when their work is independent. Group by file independence to avoid edit conflicts.

## Project

- **Stack:** React 19 + TypeScript, Vite 6, Tailwind CSS 4, Cloudflare Workers
- **Deploy:** GitHub Actions -> FTP to hosting, Cloudflare Workers for chat proxy
- **Domain:** jojishiotsuki.com
