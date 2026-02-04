import DoctorsPick from "./Components/sections/DoctorsPick";
import FeaturedMedicine from "./Components/sections/FeaturedMedicine";
import HeroSection from "./Components/sections/HeroSection";
import { Newsletter } from "./Components/sections/Newsletter";
import WhyChooseUs from "./Components/sections/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedMedicine />
      <WhyChooseUs />
      <DoctorsPick />
      <Newsletter />
    </>
  );
}
