import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import IndustryPacks from "@/components/IndustryPacks";
import DifficultyLevels from "@/components/DifficultyLevels";
import CareerMode from "@/components/CareerMode";
import WhyVaaniVerse from "@/components/WhyVaaniVerse";
import Roadmap from "@/components/Roadmap";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
      <IndustryPacks />
      <DifficultyLevels />
      <CareerMode />
      <WhyVaaniVerse />
      <Roadmap />
      <CTA />
    </>
  );
}
