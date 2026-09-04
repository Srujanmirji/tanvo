import React from 'react';
import ReactDOM from 'react-dom/client';
import Hero from './components/Hero';
import Footer from './components/Footer';
import './index.css';

const rootElement = document.getElementById('hero-root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Hero />
    </React.StrictMode>
  );
  // Tells the watchdog in index.html that the bundle ran, so it leaves the
  // static fallback hidden. createRoot has already cleared the fallback markup.
  document.documentElement.classList.add('hero-ready');
}

const footerElement = document.getElementById('footer-root');

if (footerElement) {
  ReactDOM.createRoot(footerElement).render(
    <React.StrictMode>
      <Footer />
    </React.StrictMode>
  );
}
