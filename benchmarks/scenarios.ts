export interface Scenario {
  id: string;
  user: string;
}

export const scenarios: Scenario[] = [
  {
    id: "react-strict-effect",
    user:
      "In React 18 StrictMode my useEffect runs twice in development and my fetch runs twice. Explain why and list practical ways to avoid duplicate network calls. Keep it practical for a REST API.",
  },
  {
    id: "ts-narrowing",
    user:
      "I have `const x: string | number` and TypeScript complains when I call string methods. Explain narrowing with examples: typeof, in, discriminated unions, and type guards.",
  },
  {
    id: "rest-vs-graphql",
    user:
      "Compare REST vs GraphQL for a mobile app talking to a backend team that already ships REST. Cover caching, versioning, over-fetching, and team workflow.",
  },
];
