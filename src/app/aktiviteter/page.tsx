import Footer from "@/components/layout/Footer";
import AktHero from "@/components/aktiviteter/AktHero";
import Marquee from "@/components/aktiviteter/Marquee";
import AktCards from "@/components/aktiviteter/AktCards";
import Dome from "@/components/aktiviteter/Dome";
import AktCta from "@/components/aktiviteter/AktCta";
import "./aktiviteter.css";

export default function ActivitiesPage() {
  return (
    <>
      <AktHero />
      <Marquee />
      <AktCards />
      <Dome />
      <AktCta />
      <Footer />
    </>
  );
}
