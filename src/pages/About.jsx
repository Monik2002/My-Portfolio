// import React from "react";

const About = () => {
  return (
    <>
      <main>
        <div>
          <div className="container">
            <div className="grid">
              <div className="article-content">
                <div className="hero">
                  <h1>About me</h1>
                </div>
                <section className="segment small">
                  <div className="post-content">
                    <p>
                      Hey, I&apos;m Monikanchan. I&apos;am a front-end
                      developer. I&apos;ve been programming and writing code
                      since 2021. I&apos;m passionate about learning new things
                      and sharing my knowledge with others. I&apos;m a
                      self-taught developer and I&apos;m always looking for new
                      projects to work on. I&apos;m currently working on a few
                      projects, including a blog, my portfolio, and a few other
                      things. I&apos;m always looking for new opportunities to
                      learn and grow as a developer, and looking for new ways to
                      improve my skills.
                    </p>
                    <h2
                      id="what-im-doing-now"
                      style={{ position: "relative", fontSize: "32px" }}
                    >
                      <a
                        href="#what-im-doing-now"
                        aria-label="what im doing now permalink"
                        className="anchor before"
                      ></a>
                      What I&apos;m doing now
                    </h2>
                    <p>
                      I&apos;m currently engaged in several projects, including
                      the development of my portfolio, participation in GSSOC
                      (GirlScript Summer of Code), and various other
                      initiatives. Additionally, I&apos;m actively writing few
                      blog posts and simultaneously deepening my understanding
                      of Redux through online tutorials on YouTube.
                    </p>
                    {/* This is my spot on the web for writing, projects,
                      tutorials, art, and anything else I want to put out there.
                      Check out the <a href="/blog">blog</a>, or take a look at
                      the <a href="/projects">projects</a> page to see a
                      highlight of my open-source work. */}
                    {/* </p> */}
                    <p>
                      My motivation for this site is to have a space for
                      self-expression and {""}
                      {/* to share what I&apos;ve learned with
                      the world. I hope I will  */}
                      inspire others to make their own creative corner on the
                      web as well.
                    </p>
                    <p>
                      Feel free to contact me by email {""}
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=www.monikchatterjee@gmail.com&su=Hello%20Monik&body=Hi%20Monik,%0D%0A%0D%0AI%20wanted%20to%20reach%20out%20to%20you%20regarding..."
                        target="_blank"
                      >
                        Mail me here!
                      </a>
                    </p>
                    <ul>
                      {/* <li>
                        <a href="">
                          Newsletter
                        </a>
                      </li> */}
                      <li>
                        <a href="https://github.com/Monik2002">GitHub</a>
                      </li>
                      <li>
                        <a href="">Twitter</a>
                      </li>
                    </ul>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default About;
