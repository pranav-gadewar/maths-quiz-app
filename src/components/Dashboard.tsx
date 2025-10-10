import React from "react";
import Services from "./Services";
import Hero from "./Hero";
import Carousel from "./Carousel";

export default function Dashboard() {
  // const quizzes = [
  //   { id: 1, title: "Algebra Basics", description: "Sharpen your fundamentals of algebra" },
  //   { id: 2, title: "Geometry Challenge", description: "Test your knowledge of shapes & angles" },
  //   { id: 3, title: "Trigonometry Quiz", description: "Practice sine, cosine, and tangent" },
  // ];

  return (
    <>
      <section>
        <Hero />
      </section>
      <section>
        <Services />
      </section>
      <section>
        <Carousel />
      </section>
    </>
  );
}
