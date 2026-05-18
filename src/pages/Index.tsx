import Header from "@/components/Header";
import AlertBanner from "@/components/AlertBanner";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import StatusBar from "@/components/StatusBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <StatusBar />
      <AlertBanner />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
