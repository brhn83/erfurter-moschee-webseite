
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar, MapPin, Phone, Mail, ChevronRight, Heart, ArrowRight, BookOpen, Users, Facebook, Instagram, Youtube, Video, Clock, CreditCard, ChevronLeft } from 'lucide-react';
import AIChat from './components/AIChat';
import NewsCard from './components/ArtistCard';
import { Activity, PrayerTime } from './types';

// Data Mock for News
const NEWS_ITEMS: Activity[] = [
  { 
    id: '1', 
    title: 'Anmeldung zum neuen Koran-Semester', 
    category: 'Bildung', 
    time: '20. Oktober 2023', 
    image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=1000&auto=format&fit=crop',
    description: 'Die neuen Kurse für Tajweed und Arabisch beginnen in Kürze. Sichern Sie sich jetzt einen Platz.'
  },
  { 
    id: '2', 
    title: 'Gemeinschafts-Iftar im Ramadan', 
    category: 'Events', 
    time: '15. März 2024', 
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1000&auto=format&fit=crop',
    description: 'Wir laden alle Erfurter herzlich zu unserem täglichen Iftar ein. Gemeinsam fasten brechen.'
  },
  { 
    id: '3', 
    title: 'Winterhilfe: Kleiderspende erfolgreich', 
    category: 'Soziales', 
    time: '10. Januar 2024', 
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1000&auto=format&fit=crop',
    description: 'Dank Ihrer Unterstützung konnten wir über 500 Pakete an Bedürftige verteilen.'
  },
];

// Hero Slides
const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542046468-b7852c286b16?q=80&w=2000&auto=format&fit=crop',
    title: 'Willkommen in der Erfurter Moschee',
    subtitle: 'Ein Ort des Gebets, der Bildung und der Begegnung.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1596627689949-a65155f9a941?q=80&w=2000&auto=format&fit=crop',
    title: 'Bildung für alle Generationen',
    subtitle: 'Entdecken Sie unsere vielfältigen Kursangebote.'
  }
];

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loadingPrayers, setLoadingPrayers] = useState(true);
  const [gregorianDate, setGregorianDate] = useState<string>('');
  const [hijriDate, setHijriDate] = useState<string>('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [donationAmount, setDonationAmount] = useState('50');
  const [donationFrequency, setDonationFrequency] = useState('once');

  // Slide Rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Data
  useEffect(() => {
    // Dates
    const now = new Date();
    setGregorianDate(now.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }));
    
    // Simple Hijri simulation (or use library in real app)
    try {
      const hijri = new Intl.DateTimeFormat('de-DE-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);
      setHijriDate(hijri);
    } catch (e) {
      setHijriDate('1445 H.');
    }

    // Prayer Times
    const fetchPrayerTimes = async () => {
      try {
        const timestamp = Math.floor(now.getTime() / 1000);
        const response = await fetch(`https://api.aladhan.com/v1/timings/${timestamp}?latitude=50.9848&longitude=11.0299&method=3`); // Method 3 = Muslim World League (often used in DE) or 12 (IGMG)
        const data = await response.json();
        
        if (data.code === 200 && data.data && data.data.timings) {
          const t = data.data.timings;
          
          // Helper to add minutes to time string "HH:MM"
          const addMinutes = (time: string, mins: number) => {
             const [h, m] = time.split(':').map(Number);
             const date = new Date();
             date.setHours(h, m + mins);
             return date.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'});
          };

          setPrayerTimes([
            { name: 'Fajr', time: t.Fajr, iqamah: addMinutes(t.Fajr, 30) }, // Iqamah rules usually fixed offsets
            { name: 'Sonnenaufgang', time: t.Sunrise, iqamah: '-' }, 
            { name: 'Dhuhr', time: t.Dhuhr, iqamah: '13:00' }, // Fixed for congregational ease
            { name: 'Asr', time: t.Asr, iqamah: addMinutes(t.Asr, 15) },
            { name: 'Maghrib', time: t.Maghrib, iqamah: addMinutes(t.Maghrib, 5) },
            { name: 'Ischa', time: t.Isha, iqamah: addMinutes(t.Isha, 15) },
          ]);
        }
      } catch (error) {
        console.error("Error fetching prayers:", error);
      } finally {
        setLoadingPrayers(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-red-100 selection:text-red-900">
      <AIChat />
      
      {/* 1. TOP BAR */}
      <div className="bg-slate-900 text-slate-300 text-[11px] md:text-xs py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
             <span className="flex items-center gap-2"><Calendar className="w-3 h-3 text-red-600" /> {gregorianDate}</span>
             <span className="hidden md:inline text-slate-700">|</span>
             <span className="flex items-center gap-2 text-slate-100 font-medium">📅 {hijriDate}</span>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex gap-3">
               <a href="#" className="hover:text-red-500 transition-colors"><Facebook className="w-3.5 h-3.5"/></a>
               <a href="#" className="hover:text-red-500 transition-colors"><Instagram className="w-3.5 h-3.5"/></a>
               <a href="#" className="hover:text-red-500 transition-colors"><Youtube className="w-3.5 h-3.5"/></a>
             </div>
             <div className="flex items-center gap-2 text-red-500 font-bold animate-pulse">
               <span className="w-2 h-2 bg-red-600 rounded-full"></span>
               Live
             </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Sticky) */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('home')}>
             {/* Note: Ensure 'logo.png' is in your public directory */}
             <img src="/logo.png" alt="Erfurter Moschee" className="h-16 w-auto object-contain" />
             <div className="flex flex-col">
               <span className="font-heading text-xl md:text-2xl font-bold text-slate-900 leading-none">ERFURTER MOSCHEE</span>
               <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Kulturzentrum e.V.</span>
             </div>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {[
              {id: 'home', label: 'Startseite'},
              {id: 'about', label: 'Über uns'},
              {id: 'services', label: 'Dienste'},
              {id: 'activities', label: 'Aktuelles'},
              {id: 'media', label: 'Mediathek'},
              {id: 'contact', label: 'Kontakt'},
            ].map((link) => (
              <button 
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-red-800 uppercase tracking-tight transition-colors"
              >
                {link.label}
              </button>
            ))}
            
            <button 
              onClick={() => scrollToSection('donate')}
              className="ml-6 bg-red-700 hover:bg-red-800 text-white px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 rounded-sm"
            >
              Spenden <Heart className="w-4 h-4 fill-current" />
            </button>
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="xl:hidden p-2 text-slate-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
             {mobileMenuOpen ? <X className="w-8 h-8"/> : <Menu className="w-8 h-8"/>}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4 font-heading">
              {['Startseite', 'Über uns', 'Dienste', 'Aktuelles', 'Mediathek', 'Kontakt'].map((item, idx) => {
                 const id = item === 'Startseite' ? 'home' : item === 'Über uns' ? 'about' : item === 'Mediathek' ? 'media' : item === 'Dienste' ? 'services' : item === 'Kontakt' ? 'contact' : 'activities';
                 return (
                  <button key={idx} onClick={() => scrollToSection(id)} className="text-left text-xl font-bold text-slate-900 pb-2 border-b border-slate-100">
                    {item}
                  </button>
                 );
              })}
              <button onClick={() => scrollToSection('donate')} className="bg-red-700 text-white py-4 font-bold uppercase w-full mt-4">Jetzt Spenden</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. HERO SLIDER */}
      <section id="home" className="relative h-[500px] md:h-[600px] bg-slate-900 overflow-hidden group">
        <div className="absolute inset-0 transition-transform duration-1000 ease-out" >
           <img 
             src={SLIDES[currentSlide].image} 
             alt="Mosque" 
             className="w-full h-full object-cover opacity-60"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        </div>
        
        {/* Slider Content */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
             <motion.h1 
               key={currentSlide}
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="font-heading text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
             >
               {SLIDES[currentSlide].title}
             </motion.h1>
             <motion.p 
                key={`p-${currentSlide}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-2xl text-slate-200 mb-8 font-light"
             >
               {SLIDES[currentSlide].subtitle}
             </motion.p>
             <div className="flex justify-center gap-4">
               <button onClick={() => scrollToSection('about')} className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3 font-bold uppercase tracking-widest text-xs transition-colors">
                 Mehr erfahren
               </button>
               <button onClick={() => scrollToSection('donate')} className="bg-red-700 text-white border-2 border-red-700 hover:bg-red-800 hover:border-red-800 px-8 py-3 font-bold uppercase tracking-widest text-xs transition-colors">
                 Unterstützen
               </button>
             </div>
          </div>
        </div>

        {/* Slider Controls */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white hover:bg-black/20 rounded-full transition-all">
          <ChevronLeft className="w-8 h-8"/>
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white hover:bg-black/20 rounded-full transition-all">
          <ChevronRight className="w-8 h-8"/>
        </button>
      </section>

      {/* 4. PRAYER TIMES STRIP (Detailed) */}
      <section className="relative z-20 -mt-8 mx-4 md:mx-auto max-w-7xl shadow-xl">
        <div className="bg-white rounded-t-lg md:rounded-lg overflow-hidden flex flex-col lg:flex-row">
           {/* Date Block */}
           <div className="bg-red-900 text-white p-6 lg:w-64 flex flex-col justify-center items-center text-center shrink-0">
             <Clock className="w-8 h-8 mb-2 opacity-80" />
             <h3 className="font-heading font-bold text-xl">Gebetszeiten</h3>
             <p className="text-red-200 text-xs uppercase tracking-widest mt-1">Erfurt, DE</p>
           </div>

           {/* Times Grid */}
           <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-slate-100 border-b lg:border-b-0 border-slate-100">
             {loadingPrayers ? (
               <div className="col-span-full p-8 text-center text-slate-500">Lade Zeiten...</div>
             ) : (
               prayerTimes.map((pt, idx) => (
                 <div key={idx} className={`p-4 flex flex-col items-center justify-center text-center group hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                   <span className="text-xs font-bold uppercase text-slate-400 mb-2">{pt.name}</span>
                   <div className="mb-1">
                     <span className="block text-xs text-slate-400">Beginn</span>
                     <span className="text-lg md:text-xl font-bold text-slate-800 font-heading">{pt.time}</span>
                   </div>
                   {pt.iqamah !== '-' && (
                     <div className="mt-1 pt-1 border-t border-slate-200 w-full">
                       <span className="block text-[10px] text-red-700 font-bold uppercase">Jama'ah</span>
                       <span className="text-sm font-bold text-slate-600">{pt.iqamah}</span>
                     </div>
                   )}
                 </div>
               ))
             )}
           </div>

           {/* Jumuah Box */}
           <div className="bg-slate-800 text-white p-6 lg:w-48 flex flex-col justify-center items-center text-center shrink-0">
             <span className="text-amber-400 text-xs font-bold uppercase mb-1">Jumu'ah</span>
             <span className="font-heading text-xl font-bold">13:30</span>
             <span className="text-slate-400 text-[10px] mt-1">Predigt Beginn</span>
           </div>
        </div>
      </section>

      {/* 5. CONTENT GRID: Donation & Welcome */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
             <span className="text-red-700 font-bold uppercase tracking-widest text-xs mb-2 block">Über Uns</span>
             <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-6">Im Dienst der Gemeinschaft.</h2>
             <p className="text-slate-600 text-lg leading-relaxed mb-6">
               Das Internationale Islamische Kulturzentrum Erfurtermoschee e.V. ist mehr als nur ein Gebetsort. Wir sind ein lebendiges Zentrum für Muslime in Thüringen und ein offener Partner für den interreligiösen Dialog in Erfurt.
             </p>
             <p className="text-slate-600 leading-relaxed mb-8">
               Unsere Gemeinde vereint Menschen unterschiedlichster Herkunft. Wir bieten Seelsorge, Bildung und soziale Unterstützung an und stehen für einen Islam der Barmherzigkeit und des Friedens.
             </p>
             
             {/* Services Icons */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
               {[
                 {icon: Users, label: 'Seelsorge'},
                 {icon: BookOpen, label: 'Bildung'},
                 {icon: Heart, label: 'Soziales'},
                 {icon: Phone, label: 'Dialog'},
               ].map((s, i) => (
                 <div key={i} className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow">
                   <s.icon className="w-8 h-8 text-red-700 mb-3" />
                   <span className="font-bold text-slate-800 text-sm">{s.label}</span>
                 </div>
               ))}
             </div>
          </div>

          {/* Smart Donation Widget */}
          <div id="donate" className="lg:col-span-1">
            <div className="bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden sticky top-28">
              <div className="bg-slate-900 p-6 text-white text-center">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h3 className="font-heading text-xl font-bold">Spenden Sie Sadaqah</h3>
                <p className="text-slate-400 text-xs mt-2">Helfen Sie uns, die Moschee zu erhalten.</p>
              </div>
              
              <div className="p-6">
                {/* Type Toggle */}
                <div className="flex bg-slate-100 rounded p-1 mb-6">
                  <button 
                    onClick={() => setDonationFrequency('once')}
                    className={`flex-1 py-2 text-xs font-bold uppercase rounded transition-colors ${donationFrequency === 'once' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Einmalig
                  </button>
                  <button 
                    onClick={() => setDonationFrequency('monthly')}
                    className={`flex-1 py-2 text-xs font-bold uppercase rounded transition-colors ${donationFrequency === 'monthly' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Monatlich
                  </button>
                </div>

                {/* Amount Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {['20', '50', '100'].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setDonationAmount(amt)}
                      className={`py-3 text-sm font-bold border rounded transition-all ${donationAmount === amt ? 'border-red-600 bg-red-50 text-red-700' : 'border-slate-200 text-slate-600 hover:border-red-300'}`}
                    >
                      {amt}€
                    </button>
                  ))}
                </div>
                
                {/* Custom Amount Input */}
                <div className="relative mb-6">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                  <input 
                    type="number" 
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="w-full border border-slate-200 rounded pl-8 pr-4 py-3 text-slate-800 font-bold focus:outline-none focus:border-red-500"
                  />
                </div>

                <button className="w-full bg-red-700 text-white py-4 rounded font-bold uppercase tracking-wide hover:bg-red-800 transition-colors flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Jetzt Spenden
                </button>
                
                <div className="mt-4 text-center">
                  <p className="text-[10px] text-slate-400">Sicher bezahlen via PayPal oder Überweisung.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. NEWS / ACTIVITIES SECTION */}
      <section id="activities" className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
             <div>
               <h2 className="font-heading text-3xl font-bold text-slate-900 mb-2">Aktuelles aus der Gemeinde</h2>
               <div className="h-1 w-20 bg-red-600"></div>
             </div>
             <a href="#" className="hidden md:flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-900 transition-colors">
               Alle Nachrichten <ArrowRight className="w-4 h-4" />
             </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {NEWS_ITEMS.map((item) => (
               <NewsCard key={item.id} activity={item} />
             ))}
          </div>
        </div>
      </section>

      {/* 7. LIVE / MEDIA SECTION */}
      <section id="media" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full"></span> Live
          </div>
          <h2 className="font-heading text-4xl font-bold mb-6">Freitagspredigt Live</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
            Verfolgen Sie die Khutbah jeden Freitag live oder schauen Sie sich vergangene Aufzeichnungen in unserem Archiv an.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-slate-900 px-8 py-3 rounded font-bold uppercase tracking-wide hover:bg-slate-100 transition-colors flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-600" /> Zum Live-Stream
            </button>
            <button className="border border-slate-700 text-slate-300 px-8 py-3 rounded font-bold uppercase tracking-wide hover:bg-slate-800 transition-colors">
              Archiv ansehen
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer id="contact" className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Erfurter Moschee" className="h-12 w-auto object-contain" />
              <span className="font-heading text-xl font-bold text-slate-900">ERFURTER MOSCHEE</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md mb-6">
              Das Internationale Islamische Kulturzentrum Erfurtermoschee e.V. setzt sich für ein friedliches Miteinander, Bildung und spirituelles Wachstum ein.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-6">Kontakt</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-700 shrink-0" />
                <span>Musterstraße 123<br/>99084 Erfurt</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-700 shrink-0" />
                <span>+49 361 123456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-700 shrink-0" />
                <span>info@erfurtermoschee.de</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-6">Rechtliches</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#" className="hover:text-red-700 transition-colors">Impressum</a></li>
              <li><a href="#" className="hover:text-red-700 transition-colors">Datenschutz</a></li>
              <li><a href="#" className="hover:text-red-700 transition-colors">Satzung</a></li>
              <li><a href="#" className="hover:text-red-700 transition-colors">Hausordnung</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-slate-100 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} Internationales Islamisches Kulturzentrum Erfurtermoschee e. V.</p>
          <div className="flex gap-4">
             <a href="#" className="hover:text-slate-600"><Facebook className="w-4 h-4"/></a>
             <a href="#" className="hover:text-slate-600"><Instagram className="w-4 h-4"/></a>
             <a href="#" className="hover:text-slate-600"><Youtube className="w-4 h-4"/></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
