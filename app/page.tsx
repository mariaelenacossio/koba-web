import { BarSection } from "@/components/bar/BarSection";
import { FilmSection } from "@/components/film/FilmSection";
import { GallerySection } from "@/components/gallery/GallerySection";
import { GurshaTeaser } from "@/components/gursha/GurshaTeaser";
import { Hero } from "@/components/hero/Hero";
import { Welcome } from "@/components/home/Welcome";
import { MenuSection } from "@/components/menu/MenuSection";
import { VisitSection } from "@/components/visit/VisitSection";

// Film order: patio, entrance and coffee ceremony, dining room, Gursha Table,
// bar ending on the tej, film, gallery, visit (DESIGN.md section 5).
export default function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <MenuSection />
      <GurshaTeaser />
      <BarSection />
      <FilmSection />
      <GallerySection />
      <VisitSection />
    </>
  );
}
