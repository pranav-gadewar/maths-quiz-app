import QuizClient from "./QuizClient";
import { supabase } from "@/lib/supabaseClient";

// Server component fetches the quiz and passes it to the client
export default async function StartQuizPage({ params }: any) {
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
