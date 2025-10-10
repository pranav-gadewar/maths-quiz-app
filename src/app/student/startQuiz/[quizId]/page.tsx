import QuizClient from "./QuizClient";
import { supabase } from "@/lib/supabaseClient";

export default async function StartQuizPage({
  params,
}: {
  params: { quizId: string };
}) {
  const { quizId } = params;

  // Fetch quiz server-side
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, questions(id)")
    .eq("id", quizId)
    .single();

  if (error || !data) {
    // Pass null to client component if quiz not found
    return <QuizClient quiz={null} />;
  }

  const quizData = {
    ...data,
    total_questions: data.questions?.length ?? 0,
  };

  return <QuizClient quiz={quizData} />;
}
