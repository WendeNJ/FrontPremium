import React from 'react';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import ValuesSection from '../components/home/ValuesSection';
import MuralSection from '../components/home/MuralSection';
import LocationSection from '../components/home/LocationSection';
import ContactSection from '../components/home/ContactSection';
import OuvidoriaSection from '../components/home/OuvidoriaSection';
import Footer from '../components/home/Footer';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <HeroSection />
            <AboutSection />
            <ValuesSection />
            <MuralSection />
            <LocationSection />
            <ContactSection />
            <OuvidoriaSection />
            <Footer />
        </div>
    );
}