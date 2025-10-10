import QuizClient from "../[quizId]/QuizClient";
import { supabase } from "@/lib/supabaseClient";

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

type PageProps = {
  params: {
    quizId: string;
  };
};

export default async function StartQuizPage({ params }: PageProps) {
  const { quizId } = params;

  // Fetch quiz server-side
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, questions(id)")
    .eq("id", quizId)
    .single();

  if (error || !data) {
    // Pass null to client component if not found
    return <QuizClient quiz={null} />;
  }

  const quizData: Quiz = {
    ...data,
    total_questions: data.questions?.length ?? 0,
  };

  return <QuizClient quiz={quizData} />;
}
