import React from "react";
import { LogoIntro } from "@/components/LogoIntro";
import { HeroSection } from "@/components/HeroSection";
import { ScrollSweepSection } from "@/components/ScrollSweepSection";
import { TaglineReveal } from "@/components/TaglineReveal";
import { CollectionsEditorial } from "@/components/CollectionsEditorial";
import { JewelleryMarqueeStrip } from "@/components/JewelleryMarqueeStrip";
import { ProductShowcase } from "@/components/ProductShowcase";
import { GiftsSection } from "@/components/GiftsSection";
import { StoryAndStore } from "@/components/StoryAndStore";

export default function HomePage() {
  return (
    <>
      <LogoIntro />
      <main>
        <HeroSection />
        <ScrollSweepSection />
        <TaglineReveal />
        <CollectionsEditorial />
        <JewelleryMarqueeStrip />
        <ProductShowcase />
        <GiftsSection />
        <StoryAndStore />
      </main>
    </>
  );
}
