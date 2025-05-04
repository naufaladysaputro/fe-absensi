import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize dark mode on app load
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <>
      <Script id="dark-mode-init" strategy="beforeInteractive">
        {`
          try {
            if (localStorage.getItem('darkMode') === 'true' || 
                (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } catch (e) {}
        `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 