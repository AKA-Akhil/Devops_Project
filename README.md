# Code Summerizer

A unique full-stack GitHub repository intelligence platform.

Paste a GitHub repo URL and get:

- Deep summary of the whole codebase
- Framework and dependency detection
- Module-level breakdown
- SVG flowchart visualization
- Potential issues and package/version conflict checks
- Future-risk forecast
- Improvement recommendations and code-quality suggestions
- Bonus unique insights for roadmap and maintainability

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Visualization: Native SVG renderer
- Data source: GitHub REST API
- Optional AI enhancement: Gemini API (via `.env`)

## Project Structure

```text
Devops_Project/
	client/
		src/
			App.jsx
			api.js
			main.jsx
			styles.css
		index.html
		package.json
		vite.config.js
	server/
		src/
			llmClient.js
			repoAnalyzer.js
			server.js
		.env.example
		package.json
	package.json
	README.md
```

## Setup

### 1) Install dependencies

From project root, run in separate terminals:

```powershell
cd client
npm install
```

```powershell
cd server
npm install
```

### 2) Configure environment (optional AI enhancement)

Copy and edit:

```powershell
cd server
Copy-Item .env.example .env
```

Set values in `.env`:

- `PORT=8080`
- `GITHUB_TOKEN=` (optional, for higher GitHub API limits)
- `MODEL_PROVIDER=gemini`
- `MODEL_API_KEY=your_api_key`
- `MODEL_NAME=gemini-2.0-flash`

### 3) Run backend

```powershell
cd server
npm run dev
```

### 4) Run frontend

```powershell
cd client
npm run dev
```

Open frontend URL shown by Vite (typically `http://localhost:5173`).

## API

### Health

- `GET /api/health`

### Analyze Repository

- `POST /api/analyze`
- Body:

```json
{
	"repoUrl": "https://github.com/owner/repo"
}
```

Returns summary, frameworks, dependencies, modules, flowchart, issues, conflicts, risk forecast, and improvement suggestions.

## Free Model Recommendation

For your use case (frequent calls + high daily usage), start with:

1. `Gemini 2.0 Flash` (recommended default)
2. `DeepSeek` API as fallback option

Why Gemini first:

- Usually generous free-tier limits for development
- Fast responses for interactive UI workflows
- Good structured output when prompted for strict JSON

If your daily usage becomes heavy, add caching and queue-based processing to reduce token/API usage.

## Next DevOps Phase (When You Are Ready)

- Dockerize client and server
- Add CI/CD pipeline (GitHub Actions)
- Add test and lint gates
- Add deployment to cloud (Render/Fly.io/Azure)
- Add monitoring and logs (Prometheus/Grafana/OpenTelemetry)
