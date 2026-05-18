import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, Bell, ArrowRight, Sun, Moon } from 'lucide-react';
import amuHero from '../assets/amu-hero.png';
import amuLogo from '../assets/amu-logo.png';

const LandingPage = () => {
  const [isWhite, setIsWhite] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isWhite ? 'bg-white' : 'bg-slate-300'}`}>
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img src={amuLogo} alt="AMU Logo" className="w-10 h-10 object-cover rounded-full drop-shadow-md" />
          <span className="font-bold text-xl text-slate-800">AMU</span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsWhite(!isWhite)}
            className="p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-200/50 rounded-xl transition-all duration-200"
            title={isWhite ? "Switch to Slate Cozy Theme" : "Switch to Clean White Theme"}
          >
            {isWhite ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link to="/login" className="text-slate-600 font-semibold hover:text-primary-600">Login</Link>
          <Link to="/register" className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 pt-20 pb-32 max-w-7xl mx-auto grid lg:grid-cols-[43%_57%] gap-8 lg:gap-16 items-center">
        <div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            <span className="text-primary-600">AMU Dormitory</span> <br />
            Maintenance <br />
            Request System
          </h1>
          <p className="mt-6 text-xl text-slate-700 max-w-lg">
            Report issues, track repairs, and ensure your dormitory stays in perfect condition with AMU's modern maintenance request system.
          </p>
          <div className="mt-10 flex gap-4">
            <Link to="/register" className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-all flex items-center gap-2 shadow-xl shadow-primary-200">
              Submit a Request <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className={`rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary-500/20 border-8 transition-colors duration-300 ${isWhite ? 'border-slate-50' : 'border-white'}`}>
            <img 
              src={amuHero} 
              alt="Arba Minch University Building" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative blur behind the image */}
          <div className="absolute -inset-4 bg-primary-400 opacity-20 blur-2xl -z-10 rounded-full"></div>
        </div>
      </section>

      {/* Features */}
      <section className={`py-24 px-8 border-t border-slate-400/20 transition-colors duration-300 ${isWhite ? 'bg-slate-50' : 'bg-slate-300'}`}>
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Why use AMU Maintenance?</h2>
          <p className="mt-4 text-slate-700">Built for students, optimized for staff.</p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: Clock, title: 'Real-time Tracking', desc: 'Track your request status from submission to resolution in real-time.' },
            { icon: Bell, title: 'Instant Notifications', desc: 'Get notified via browser and app as soon as your task is assigned or completed.' },
            { icon: Shield, title: 'Verified Repairs', desc: 'All repairs are documented with notes and images for quality assurance.' },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="bg-primary-50 w-12 h-12 flex items-center justify-center rounded-xl mb-6">
                <feature.icon className="text-primary-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-700 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
