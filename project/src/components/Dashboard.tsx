import React from "react";
import Services from "./Services";
import Hero from "./Hero";
import Carousel from "./Carousel";

export default function Dashboard() {

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
