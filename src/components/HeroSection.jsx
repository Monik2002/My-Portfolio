import Image from "next/image";
import myPhoto from "../assets/professional_photo.jpg";

const HeroSection = () => {
  return (
    <div className={`container `}>
      <div className="hero-wrapper">
        <header className={`hero index `}>
          <h1>Hey, I&apos;m Monik</h1>
          <p className={`hero-description small width`}>
            I&apos;m a programmer , developer , Algorithmist who loves building
            web apps and sharing tech insights. Always eager to learn and
            collaborate on new projects! 🌱
          </p>
        </header>
        <div className="decoration">
          <Image
            src={myPhoto}
            alt="myPhoto"
            className="image hero-image"
            title="Monik's professional photo"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
