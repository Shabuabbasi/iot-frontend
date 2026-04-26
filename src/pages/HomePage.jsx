import React from "react";
import HeroSection from "./homePage/heroSection";
import Works from "./homePage/works";
import Features from "./homePage/feature";
import ProblemsSolutions from "./homePage/problemSolution";
import Services from "./homePage/service";
import AwarenessCommunity from "./homePage/awarenessCommunity";
import Contact from "./homePage/contact";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <Works />
      <Features />
      <ProblemsSolutions />
      <Services />
      <AwarenessCommunity />
      <Contact />
    </div>
  );
};

export default HomePage;
