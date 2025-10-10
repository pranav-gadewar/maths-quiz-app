import QuizPageClient from "./QuizPageClient";

// The server component doesn't need props from the URL directly.
// The client component will handle accessing params via useParams.
export default function StartQuizPage() {
  return <QuizPageClient />;
}
