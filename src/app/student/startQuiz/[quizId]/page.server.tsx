import QuizClient from "./QuizClient";
import { supabase } from "@/lib/supabaseClient";

// Define Quiz type
type Quiz = {
  id: string;
  title: string;
  description: string;
  level: string;
  active: boolean;
  total_questions: number;
  time_limit: number;
  questions?: { id: string }[];
};

// Server component: fetches quiz and passes to client
export default async function StartQuizPage({
  params,
}: {
  params: { quizId: string };
}) {
  const { quizId } = params;

  const { data, error } = await supabase
    .from("quizzes")
    .select("*, questions(id)")
    .eq("id", quizId)
    .single();

  const quiz = data
    ? { ...data, total_questions: data.questions?.length ?? 0 }
    : null;

  return <QuizClient quiz={quiz} />;
}
