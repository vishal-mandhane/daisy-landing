import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, Instagram, Youtube } from 'lucide-react';

export default function DaisyLanding() {
  const [email, setEmail] = useState('');
  const [emailSecondary, setEmailSecondary] = useState('');
  const [city, setCity] = useState('');
  const [citySecondary, setCitySecondary] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedSecondary, setSubmittedSecondary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSecondary, setLoadingSecondary] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [vibeGifsLoaded, setVibeGifsLoaded] = useState(false);
  const vibeSectionRef = useRef(null);

  // GIF URLs for the vibe section - hosted locally for faster loading
  const vibeGifs = [
    '/gifs/vibe1.gif',
    '/gifs/vibe2.gif',
    '/gifs/final.gif',
  ];

  // ============================================================
  // EMAILOCTOPUS - reCAPTCHA disabled, direct API should work now!
  // ============================================================
  const FORM_ACTION = 'https://eomail5.com/form/b7b93d50-eaf6-11f0-abdc-bf3561320fe8';

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload all GIFs immediately on page load for faster display
  useEffect(() => {
    const allGifs = [
      '/gifs/hero.gif',
      ...vibeGifs,
    ];
    allGifs.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preload GIFs when user approaches the vibe section (backup)
  useEffect(() => {
    if (!vibeSectionRef.current || vibeGifsLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Preload all GIFs
            vibeGifs.forEach((src) => {
              const img = new Image();
              img.src = src;
            });
            setVibeGifsLoaded(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '400px', // Start loading 400px before section is visible
        threshold: 0,
      }
    );

    observer.observe(vibeSectionRef.current);

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vibeGifsLoaded]);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const handleSubmit = async (e, isSecondary = false) => {
    e.preventDefault();

    const currentEmail = isSecondary ? emailSecondary : email;
    const currentCity = isSecondary ? citySecondary : city;

    if (!currentEmail || !currentEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    if (!currentCity || !currentCity.trim()) {
      alert('Please enter your city');
      return;
    }

    if (isSecondary) {
      setLoadingSecondary(true);
    } else {
      setLoading(true);
    }

    try {
      // EmailOctopus form submission (reCAPTCHA disabled)
      // Form field IDs (from the form's HTML): field_0 = Email, field_3 = City
      const formData = new FormData();
      formData.append('field_0', currentEmail);
      formData.append('field_3', currentCity.trim());
      formData.append('hpc4b27b6e-eb3b-11e9-be00-06b4694bee2a', '');

      const response = await fetch(FORM_ACTION, {
        method: 'POST',
        mode: 'cors',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        if (isSecondary) {
          setSubmittedSecondary(true);
          setEmailSecondary('');
          setCitySecondary('');
          setTimeout(() => setSubmittedSecondary(false), 4000);
        } else {
          setSubmitted(true);
          setEmail('');
          setCity('');
          setTimeout(() => setSubmitted(false), 4000);
        }
      } else {
        throw new Error(result.error?.message || 'Submission failed');
      }
    } catch (error) {
      console.error('EmailOctopus error:', error);
      alert('Something went wrong. Please try again. (' + (error.message || 'unknown') + ')');
    } finally {
      if (isSecondary) {
        setLoadingSecondary(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Instagram Reels data - add your reel URLs here
  const reels = [
    {
      url: 'https://www.instagram.com/reel/DTsjgDxiFUV/',
      caption: 'Dayzi vibes',
    },
    {
      url: 'https://www.instagram.com/reel/DTiLjz8CEPb/',
      caption: 'The night was electric',
    },
    {
      url: 'https://www.instagram.com/reel/DVBhZTriKUd/',
      caption: 'Energy was unmatched',
    },
    {
      url: 'https://www.instagram.com/reel/DX9cea6oyqw/',
      caption: 'You had to be there',
    },
  ];

  const scrollReelsRef = useRef(null);
  const scrollReels = (direction) => {
    if (!scrollReelsRef.current) return;
    const scrollAmount = isMobile ? 220 : 300;
    scrollReelsRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Try to autoplay reels when they come into view
  const reelIframeRefs = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const iframe = entry.target;
            try {
              iframe.contentWindow.postMessage(
                JSON.stringify({ type: 'autoplay' }),
                '*'
              );
            } catch (e) {
              // Cross-origin - silently ignore
            }
            observer.unobserve(iframe);
          }
        });
      },
      { threshold: 0.5 }
    );

    reelIframeRefs.current.forEach((iframe) => {
      if (iframe) observer.observe(iframe);
    });

    return () => observer.disconnect();
  }, []);

  // Dynamic styles based on screen size
  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      lineHeight: 1.6,
      overflowX: 'hidden',
    },
    heroSection: {
      minHeight: isMobile ? 'auto' : '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '40px 16px' : isTablet ? '60px 24px' : '80px 48px',
      backgroundColor: '#0a0a0a',
    },
    heroContainer: {
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
      gap: isMobile ? '24px' : '48px',
      alignItems: 'center',
    },
    heroContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '16px' : '32px',
      order: 1,
      textAlign: isMobile ? 'center' : 'left',
      alignItems: isMobile ? 'center' : 'flex-start',
    },
    heroTitle: {
      fontSize: isMobile ? '2rem' : isTablet ? '3rem' : '4rem',
      fontWeight: 800,
      lineHeight: 1.1,
      margin: 0,
      letterSpacing: '-0.02em',
      textAlign: isMobile ? 'center' : 'left',
    },
    heroHighlight: {
      color: '#a855f7',
    },
    heroSubtitle: {
      fontSize: isMobile ? '0.95rem' : isTablet ? '1.125rem' : '1.375rem',
      color: '#a1a1aa',
      margin: 0,
      lineHeight: 1.6,
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '8px' : '12px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '10px' : '12px',
      width: '100%',
    },
    input: {
      flex: 1,
      padding: isMobile ? '12px 14px' : '16px 24px',
      backgroundColor: '#18181b',
      border: '1px solid #27272a',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '16px',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
    },
    button: {
      padding: isMobile ? '12px 18px' : '16px 32px',
      backgroundColor: '#a855f7',
      border: 'none',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      whiteSpace: 'nowrap',
      width: isMobile ? '100%' : 'auto',
    },
    smallText: {
      fontSize: '13px',
      color: '#71717a',
      margin: 0,
    },
    successText: {
      color: '#22c55e',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      margin: 0,
    },
    heroImageContainer: {
      aspectRatio: isMobile ? '16/10' : '4/5',
      borderRadius: isMobile ? '12px' : '16px',
      overflow: 'hidden',
      border: '1px solid #27272a',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      order: isMobile || isTablet ? 2 : 2,
      maxHeight: isMobile ? '200px' : isTablet ? '350px' : 'none',
      margin: isMobile ? '0 auto' : '0',
      maxWidth: isMobile ? '320px' : 'none',
    },
    heroImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    section: {
      padding: isMobile ? '32px 16px' : isTablet ? '48px 24px' : '80px 48px',
      backgroundColor: '#0a0a0a',
    },
    sectionAlt: {
      padding: isMobile ? '32px 16px' : isTablet ? '48px 24px' : '80px 48px',
      backgroundColor: '#0f0f0f',
    },
    sectionContainer: {
      maxWidth: '900px',
      margin: '0 auto',
      textAlign: 'center',
    },
    sectionContainerWide: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    sectionTitle: {
      fontSize: isMobile ? '1.5rem' : isTablet ? '2rem' : '3rem',
      fontWeight: 700,
      marginBottom: isMobile ? '20px' : '48px',
      marginTop: 0,
      letterSpacing: '-0.02em',
    },
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
      gap: isMobile ? '12px' : '24px',
      marginBottom: isMobile ? '20px' : '48px',
    },
    card: {
      padding: isMobile ? '16px' : '24px',
      backgroundColor: '#18181b',
      borderRadius: isMobile ? '12px' : '16px',
      border: '1px solid #27272a',
      textAlign: 'left',
    },
    cardText: {
      fontSize: isMobile ? '14px' : '18px',
      color: '#a1a1aa',
      margin: 0,
      lineHeight: 1.5,
    },
    highlightText: {
      fontSize: isMobile ? '1.1rem' : '1.5rem',
      color: '#a855f7',
      fontWeight: 600,
      marginTop: isMobile ? '16px' : '24px',
      marginBottom: 0,
    },
    vibeGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: isMobile ? '20px' : '32px',
    },
    vibeCard: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '10px' : '16px',
    },
    vibeImageContainer: {
      aspectRatio: '16/9',
      borderRadius: isMobile ? '12px' : '16px',
      overflow: 'hidden',
      border: '1px solid #27272a',
      boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.4)',
      backgroundColor: '#18181b',
    },
    vibeImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'opacity 0.3s ease',
    },
    vibeText: {
      fontSize: isMobile ? '14px' : '18px',
      color: '#a1a1aa',
      textAlign: 'center',
      margin: 0,
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: isMobile ? '12px' : '24px',
      textAlign: 'left',
    },
    featureCard: {
      padding: isMobile ? '16px' : '32px',
      backgroundColor: '#18181b',
      borderRadius: isMobile ? '12px' : '16px',
      border: '1px solid #27272a',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '10px' : '16px',
    },
    featureIcon: {
      width: isMobile ? '36px' : '48px',
      height: isMobile ? '36px' : '48px',
      borderRadius: '50%',
      backgroundColor: 'rgba(168, 85, 247, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isMobile ? '18px' : '24px',
    },
    featureTitle: {
      fontSize: isMobile ? '16px' : '20px',
      fontWeight: 600,
      margin: 0,
    },
    featureDescription: {
      fontSize: isMobile ? '13px' : '16px',
      color: '#71717a',
      margin: 0,
      lineHeight: 1.5,
    },
    badge: {
      display: 'inline-block',
      padding: isMobile ? '6px 12px' : '8px 16px',
      backgroundColor: 'rgba(168, 85, 247, 0.15)',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      borderRadius: '100px',
      fontSize: isMobile ? '11px' : '14px',
      fontWeight: 600,
      color: '#c084fc',
      marginBottom: isMobile ? '16px' : '24px',
    },
    largeText: {
      fontSize: isMobile ? '0.9rem' : '1.25rem',
      color: '#a1a1aa',
      lineHeight: 1.7,
      margin: isMobile ? '16px 0' : '24px 0',
    },
    finalSection: {
      padding: isMobile ? '40px 16px' : isTablet ? '60px 24px' : '120px 48px',
      backgroundColor: '#0f0f0f',
      textAlign: 'center',
    },
    finalTitle: {
      fontSize: isMobile ? '1.5rem' : isTablet ? '2.25rem' : '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      marginBottom: isMobile ? '16px' : '32px',
      marginTop: 0,
      letterSpacing: '-0.02em',
    },
    finalSubtitle: {
      fontSize: isMobile ? '1rem' : '1.5rem',
      color: '#a1a1aa',
      marginBottom: isMobile ? '24px' : '48px',
      marginTop: 0,
      lineHeight: 1.5,
    },
    buttonLarge: {
      padding: isMobile ? '14px 28px' : '20px 40px',
      backgroundColor: '#a855f7',
      border: 'none',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: isMobile ? '15px' : '18px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
    },
    footer: {
      padding: isMobile ? '24px 16px' : '48px 24px',
      borderTop: '1px solid #27272a',
      textAlign: 'center',
      backgroundColor: '#0a0a0a',
    },
    socialLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: isMobile ? '20px' : '24px',
      marginBottom: isMobile ? '16px' : '20px',
    },
    socialLink: {
      color: '#ffffff',
      transition: 'color 0.2s ease, transform 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    footerText: {
      fontSize: '14px',
      color: '#52525b',
      margin: 0,
    },
    emailCaptureContainer: {
      maxWidth: isMobile ? '100%' : '600px',
      margin: '0 auto',
      textAlign: 'center',
    },
    reelsSection: {
      padding: isMobile ? '32px 0' : isTablet ? '48px 0' : '80px 0',
      backgroundColor: '#0a0a0a',
      overflow: 'hidden',
    },
    reelsContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 16px' : '0 48px',
    },
    reelsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: isMobile ? '20px' : '32px',
      padding: isMobile ? '0 16px' : '0',
    },
    reelsTitle: {
      fontSize: isMobile ? '1.5rem' : isTablet ? '2rem' : '3rem',
      fontWeight: 700,
      margin: 0,
      letterSpacing: '-0.02em',
    },
    reelsArrows: {
      display: isMobile ? 'none' : 'flex',
      gap: '8px',
    },
    reelArrowBtn: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#18181b',
      border: '1px solid #27272a',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '18px',
    },
    reelsScrollContainer: {
      display: 'flex',
      gap: isMobile ? '12px' : '20px',
      overflowX: 'auto',
      overflowY: 'hidden',
      scrollSnapType: 'x mandatory',
      scrollBehavior: 'smooth',
      WebkitOverflowScrolling: 'touch',
      padding: isMobile ? '0 16px 16px' : '0 48px 24px',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
    },
    reelCard: {
      flex: '0 0 auto',
      width: isMobile ? '320px' : isTablet ? '360px' : '400px',
      scrollSnapAlign: 'start',
      borderRadius: isMobile ? '12px' : '16px',
      overflow: 'hidden',
      border: '1px solid #27272a',
      backgroundColor: '#000000',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      position: 'relative',
    },
    reelIframe: {
      width: '100%',
      height: isMobile ? '500px' : '580px',
      border: 'none',
      borderRadius: isMobile ? '12px' : '16px',
      backgroundColor: '#000000',
    },
    reelsGradientLeft: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: '60px',
      background: 'linear-gradient(to right, #0a0a0a, transparent)',
      pointerEvents: 'none',
      zIndex: 1,
    },
    reelsGradientRight: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      width: '60px',
      background: 'linear-gradient(to left, #0a0a0a, transparent)',
      pointerEvents: 'none',
      zIndex: 1,
    },
  };

  return (
    <div style={styles.page}>
      {/* HERO SECTION */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Stop missing out<br />
              <span style={styles.heroHighlight}>Start showing up.</span>
            </h1>
            
            <p style={styles.heroSubtitle}>
              The best plans. The right people. The perfect timing.
              {!isMobile && <br />}
              {isMobile && ' '}
              All in one place.
            </p>

            <div style={styles.formContainer}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={styles.input}
                />
                <button
                  onClick={(e) => handleSubmit(e)}
                  style={{
                    ...styles.button,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Get Early Access'} {!loading && <ArrowRight size={20} />}
                </button>
              </div>
              <p style={styles.smallText}>No spam. Just access.</p>
              {submitted && (
                <p style={styles.successText}>
                  <CheckCircle size={16} /> You're on the list.
                </p>
              )}
            </div>
          </div>

          <div style={styles.heroImageContainer}>
            <img 
              src="/gifs/hero.gif"
              alt="Energy"
              loading="eager"
              fetchpriority="high"
              style={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* THIS ISN'T FOR EVERYONE */}
      <section ref={vibeSectionRef} style={styles.sectionAlt}>
        <div style={{...styles.sectionContainer, textAlign: 'center'}}>
          <h2 style={styles.sectionTitle}>This isn't for everyone</h2>
          
          <div style={{
            maxWidth: isMobile ? '100%' : '480px',
            margin: '0 auto',
            padding: isMobile ? '24px' : '32px',
            backgroundColor: '#18181b',
            borderRadius: isMobile ? '16px' : '20px',
            border: '1px solid #27272a',
          }}>
            <p style={{
              fontSize: isMobile ? '16px' : '20px',
              color: '#e4e4e7',
              margin: 0,
              lineHeight: 1.6,
              fontStyle: 'italic',
            }}>
              If going out, meeting new people, and trying new places isn't your thing.
            </p>
          </div>

          <p style={styles.highlightText}>
            Then this probably isn't it.
          </p>
        </div>
      </section>

      {/* THE VIBE SECTION */}
      <section style={styles.section}>
        <div style={styles.sectionContainerWide}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '32px' : '48px',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '0 16px' : '0',
          }}>
            <div style={{
              flex: isMobile ? 'none' : '1',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '320px' : '480px',
              textAlign: 'center',
              margin: isMobile ? '0 auto' : '0',
            }}>
              <div style={{
                aspectRatio: '16/10',
                borderRadius: isMobile ? '12px' : '24px',
                overflow: 'hidden',
                border: '1px solid #27272a',
                boxShadow: '0 20px 60px -15px rgba(168, 85, 247, 0.15)',
                backgroundColor: '#18181b',
              }}>
                <img 
                  src="/gifs/vibe1.gif"
                  alt="Moment"
                  loading="lazy"
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              </div>
              <p style={{
                fontSize: isMobile ? '14px' : '18px',
                color: '#a1a1aa',
                marginTop: isMobile ? '12px' : '16px',
                marginBottom: 0,
              }}>
                You hear about this the next day.
              </p>
            </div>

            <div style={{
              flex: isMobile ? 'none' : '1',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '320px' : '480px',
              textAlign: 'center',
              margin: isMobile ? '0 auto' : '0',
            }}>
              <div style={{
                aspectRatio: '16/10',
                borderRadius: isMobile ? '12px' : '24px',
                overflow: 'hidden',
                border: '1px solid #27272a',
                boxShadow: '0 20px 60px -15px rgba(168, 85, 247, 0.15)',
                backgroundColor: '#18181b',
              }}>
                <img 
                  src="/gifs/vibe2.gif"
                  alt="Moment"
                  loading="lazy"
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              </div>
              <p style={{
                fontSize: isMobile ? '14px' : '18px',
                color: '#a1a1aa',
                marginTop: isMobile ? '12px' : '16px',
                marginBottom: 0,
              }}>
                Or you're already there.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PEOPLE ARE JOINING EARLY */}
      <section style={styles.sectionAlt}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>
            Early means <span style={styles.heroHighlight}>everything</span>
          </h2>

          <p style={{...styles.largeText, maxWidth: '600px', margin: '0 auto', textAlign: 'center'}}>
            First access. First picks. First to know.
            {!isMobile && <br />}
            {isMobile && ' '}
            The window closes soon.
          </p>
        </div>
      </section>

      {/* FOMO / URGENCY SECTION */}
      <section style={styles.section}>
        <div style={styles.sectionContainer}>
          <span style={styles.badge}>ROLLING INVITES</span>
          
          <h2 style={styles.sectionTitle}>
            We're not waiting{!isMobile && <br />}
            {isMobile && ' '}for everyone
          </h2>
          
          <p style={styles.largeText}>
            Early access goes to people who move now.
            {!isMobile && <br />}
            {isMobile && ' '}
            Not people who think about it.
          </p>

          <p style={{ ...styles.largeText, color: '#71717a' }}>
            Once we hit capacity, the list closes.
            {!isMobile && <br />}
            {isMobile && ' '}
            Then it's just watching others talk about it.
          </p>
        </div>
      </section>

      {false && (<section style={styles.reelsSection}>
        <div style={styles.reelsContainer}>
          <div style={styles.reelsHeader}>
            <h2 style={styles.reelsTitle}>
              See the <span style={styles.heroHighlight}>vibe</span>
            </h2>
            <div style={styles.reelsArrows}>
              <button
                onClick={() => scrollReels('left')}
                style={styles.reelArrowBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#a855f7';
                  e.currentTarget.style.borderColor = '#a855f7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#18181b';
                  e.currentTarget.style.borderColor = '#27272a';
                }}
                aria-label="Scroll left"
              >
                ←
              </button>
              <button
                onClick={() => scrollReels('right')}
                style={styles.reelArrowBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#a855f7';
                  e.currentTarget.style.borderColor = '#a855f7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#18181b';
                  e.currentTarget.style.borderColor = '#27272a';
                }}
                aria-label="Scroll right"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          {!isMobile && <div style={styles.reelsGradientLeft} />}
          {!isMobile && <div style={styles.reelsGradientRight} />}

          <div ref={scrollReelsRef} style={styles.reelsScrollContainer}>
            {reels.map((reel, index) => {
              const shortcode = reel.url.split('/reel/')[1]?.replace(/\/.*/, '').split('?')[0];
              return (
                <div
                  key={index}
                  style={styles.reelCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(168, 85, 247, 0.25)';
                    e.currentTarget.style.borderColor = '#a855f7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#27272a';
                  }}
                >
                  <iframe
                    ref={(el) => { reelIframeRefs.current[index] = el; }}
                    src={`https://www.instagram.com/reel/${shortcode}/embed/`}
                    title={reel.caption}
                    style={styles.reelIframe}
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>)}

      {/* SECOND EMAIL CAPTURE */}
      <section style={styles.sectionAlt}>
        <div style={styles.emailCaptureContainer}>
          <h2 style={styles.sectionTitle}>
            Don't be the person who waits
          </h2>

          <div style={styles.formContainer}>
            <input
              type="email"
              placeholder="Your email"
              value={emailSecondary}
              onChange={(e) => setEmailSecondary(e.target.value)}
              style={styles.input}
            />
            <div style={styles.inputGroup}>
              <input
                type="text"
                placeholder="Your city"
                value={citySecondary}
                onChange={(e) => setCitySecondary(e.target.value)}
                style={styles.input}
              />
              <button
                onClick={(e) => handleSubmit(e, true)}
                style={{
                  ...styles.button,
                  opacity: loadingSecondary ? 0.7 : 1,
                  cursor: loadingSecondary ? 'not-allowed' : 'pointer',
                }}
                disabled={loadingSecondary}
              >
                {loadingSecondary ? 'Sending...' : "I'm In"}
              </button>
            </div>
            <p style={styles.smallText}>
              Unsubscribe anytime. We respect your inbox.
            </p>
            {submittedSecondary && (
              <p style={{ ...styles.successText, justifyContent: 'center' }}>
                <CheckCircle size={16} /> Welcome to early access.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FINAL EMOTIONAL CLOSER */}
      <section style={styles.finalSection}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
          <h2 style={styles.finalTitle}>
            The best nights{!isMobile && <br />}
            {isMobile && ' '}start before{!isMobile && <br />}
            {isMobile && ' '}
            <span style={styles.heroHighlight}>everyone else knows</span>
          </h2>

          <div style={{
            maxWidth: isMobile ? '260px' : '400px',
            margin: isMobile ? '24px auto' : '32px auto',
            aspectRatio: '1/1',
            borderRadius: isMobile ? '12px' : '24px',
            overflow: 'hidden',
            border: '1px solid #27272a',
            boxShadow: '0 20px 60px -15px rgba(168, 85, 247, 0.2)',
          }}>
            <img 
              src="/gifs/final.gif"
              alt="Moment"
              loading="lazy"
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
            />
          </div>

          <p style={styles.finalSubtitle}>
            You'll either be early.
            {!isMobile && <br />}
            {isMobile && ' '}
            Or you'll hear about it later.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.socialLinks}>
          <a 
            href="https://www.instagram.com/dayzi_india/"
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.socialLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#a855f7';
              e.currentTarget.style.transform = 'scale(1.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            aria-label="Follow us on Instagram"
          >
            <Instagram size={isMobile ? 22 : 26} />
          </a>
          <a
            href="https://x.com/Dayzi_events"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.socialLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#a855f7';
              e.currentTarget.style.transform = 'scale(1.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            aria-label="Follow us on X"
          >
            <svg
              width={isMobile ? 20 : 24}
              height={isMobile ? 20 : 24}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://www.youtube.com/@DAYZIPARTY"
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.socialLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#a855f7';
              e.currentTarget.style.transform = 'scale(1.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            aria-label="Subscribe on YouTube"
          >
            <Youtube size={isMobile ? 22 : 26} />
          </a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <a
            href="/privacy.html"
            style={{ fontSize: '14px', color: '#71717a', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#a855f7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#71717a'; }}
          >
            Privacy Policy
          </a>
          <a
            href="/termsandconditions.html"
            style={{ fontSize: '14px', color: '#71717a', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#a855f7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#71717a'; }}
          >
            Terms of Service
          </a>
          <a
            href="/deleteaccount.html"
            style={{ fontSize: '14px', color: '#71717a', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#a855f7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#71717a'; }}
          >
            Delete Account
          </a>
        </div>
        <p style={styles.footerText}>Dayzi © 2026</p>
      </footer>
    </div>
  );
}