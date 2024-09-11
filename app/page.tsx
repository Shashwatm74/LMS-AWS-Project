'use client';

import Footer from "@/components/footer";
import About from "./(landing page)/about";
import Nursing from "./(landing page)/nursing";
import Paramedic from "./(landing page)/paramedic";
import Founder from "./(landing page)/founder";
import Home from "./(landing page)/home";
import Contact from "./(landing page)/contact";

export default function Landing() {

  return (
    <>
      <Home />
      <About />
      <Nursing />
      <Paramedic />
      <Founder />
      <Contact />
      <Footer />
    </>
  );
}
