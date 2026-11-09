import Image from "next/image";
import Link from "next/link";
import myPhoto from "../assets/professional_photo.jpg";

const HeroSection = () => {
  return (
    <div className="container">
      <div className="hero-wrapper">
        <header className="hero index">
          <h1>Hey, I&apos;m Monik</h1>
          <p className="hero-description">
            I&apos;m a developer who enjoys building web apps, exploring
            algorithms, and sharing what I learn. I&apos;m always curious about
            new projects and opportunities to collaborate.
          </p>
          <div className="hero-actions">
            <Link className="button hero-primary" href="/projects">
              Explore my projects
            </Link>
            <Link className="button hero-secondary" href="/contact">
              Get in touch
            </Link>
          </div>
        </header>
        <div className="decoration">
          <Image
            src={myPhoto}
            alt="Monik Chatterjee"
            className="image hero-image"
            sizes="(max-width: 699px) 150px, 320px"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
