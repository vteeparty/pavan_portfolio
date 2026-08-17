import Head from 'next/head';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import Architecture from '../components/Architecture';
import Infrastructure from '../components/Infrastructure';
import Projects from '../components/Projects';
import Certifications from '../components/Certifications';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Head>
        <title>Pavan Teeparty | DevOps & Cloud Engineer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navigation />

      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Architecture />
        <Infrastructure />
        <Projects />
        <Certifications />
        <Contact />
      </main>
    </>
  );
}
