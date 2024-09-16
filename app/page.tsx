'use client';


import About from "./(landing page)/about";
import Nursing from "./(landing page)/nursing";
import Paramedic from "./(landing page)/paramedic";
import Founder from "./(landing page)/founder";
import Home from "./(landing page)/home";
import Contact from "../components/(footer)/contact";

export default function Landing() {

  return (
    <>
      <Home />
      <About />
      <Nursing />
      <Paramedic />
      <Founder />
      <Contact />

    </>
  );
}
