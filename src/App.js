import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function DaisyLanding() {
  const [email, setEmail] = useState('');
  const [emailSecondary, setEmailSecondary] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedSecondary, setSubmittedSecondary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSecondary, setLoadingSecondary] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [vibeGifsLoaded, setVibeGifsLoaded] = useState(false);
  const vibeSectionRef = useRef(null);

  // GIF URLs for the vibe section
  const vibeGifs = [
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmxuamllY2oxb3hsN2g0ejdmOXl2M2Ntd2lkdHU2NDJ5ZmllcWY1YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mQampxivdZze8/giphy.gif',
    'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjBobWU2NHJneDlwNG84aXRvYXMwYXpnc2R1ZzQ2d2l5eHJiZjU4MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5wFkqt6A8R4qAqGIFQ/giphy.gif',
    'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2hrb2Z5bm9rcTV0bDMzbHhzOWVsZ2k5cW9naXp6dzlqdGN2Mmk5NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/11lz62kfEmsM00/giphy.gif',
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

  // Preload GIFs when user approaches the vibe section
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
        rootMargin: '200px', // Start loading 200px before section is visible
        threshold: 0,
      }
    );

    observer.observe(vibeSectionRef.current);

    return () => observer.disconnect();
  }, [vibeGifsLoaded]);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const handleSubmit = async (e, isSecondary = false) => {
    e.preventDefault();
    
    const currentEmail = isSecondary ? emailSecondary : email;
    
    if (!currentEmail || !currentEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    if (isSecondary) {
      setLoadingSecondary(true);
    } else {
      setLoading(true);
    }

    try {
      // EmailOctopus form submission (reCAPTCHA disabled)
      const formData = new FormData();
      formData.append('field_0', currentEmail);  // Email field
      formData.append('hpc4b27b6e-eb3b-11e9-be00-06b4694bee2a', '');  // Honeypot (must be empty)

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
          setTimeout(() => setSubmittedSecondary(false), 4000);
        } else {
          setSubmitted(true);
          setEmail('');
          setTimeout(() => setSubmitted(false), 4000);
        }
      } else {
        throw new Error(result.error?.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      if (isSecondary) {
        setLoadingSecondary(false);
      } else {
        setLoading(false);
      }
    }
  };

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
    },
    heroTitle: {
      fontSize: isMobile ? '2rem' : isTablet ? '3rem' : '4rem',
      fontWeight: 800,
      lineHeight: 1.1,
      margin: 0,
      letterSpacing: '-0.02em',
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
  };

  return (
    <div style={styles.page}>
      {/* HERO SECTION */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Stop missing out<br />
              <span style={styles.heroHighlight}>start showing up</span>
            </h1>
            
            <p style={styles.heroSubtitle}>
              The best plans. The right people. The perfect timing.
              {!isMobile && <br />}
              {isMobile && ' '}
              All in one place.
            </p>

            <div style={styles.formContainer}>
              <div style={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
              alt="Energy"
              loading="eager"
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
            gap: isMobile ? '24px' : '48px',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              flex: isMobile ? 'none' : '1',
              maxWidth: isMobile ? '100%' : '480px',
              textAlign: 'center',
            }}>
              <div style={{
                aspectRatio: '16/10',
                borderRadius: isMobile ? '16px' : '24px',
                overflow: 'hidden',
                border: '1px solid #27272a',
                boxShadow: '0 20px 60px -15px rgba(168, 85, 247, 0.15)',
                backgroundColor: '#18181b',
              }}>
                <img 
                  src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjBobWU2NHJneDlwNG84aXRvYXMwYXpnc2R1ZzQ2d2l5eHJiZjU4MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5wFkqt6A8R4qAqGIFQ/giphy.gif"
                  alt="Moment"
                  loading="lazy"
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              </div>
              <p style={{
                fontSize: isMobile ? '14px' : '18px',
                color: '#a1a1aa',
                marginTop: '16px',
                marginBottom: 0,
              }}>
                You hear about this the next day.
              </p>
            </div>

            <div style={{
              flex: isMobile ? 'none' : '1',
              maxWidth: isMobile ? '100%' : '480px',
              textAlign: 'center',
            }}>
              <div style={{
                aspectRatio: '16/10',
                borderRadius: isMobile ? '16px' : '24px',
                overflow: 'hidden',
                border: '1px solid #27272a',
                boxShadow: '0 20px 60px -15px rgba(168, 85, 247, 0.15)',
                backgroundColor: '#18181b',
              }}>
                <img 
                  src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmxuamllY2oxb3hsN2g0ejdmOXl2M2Ntd2lkdHU2NDJ5ZmllcWY1YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mQampxivdZze8/giphy.gif"
                  alt="Moment"
                  loading="lazy"
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              </div>
              <p style={{
                fontSize: isMobile ? '14px' : '18px',
                color: '#a1a1aa',
                marginTop: '16px',
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

      {/* SECOND EMAIL CAPTURE */}
      <section style={styles.sectionAlt}>
        <div style={styles.emailCaptureContainer}>
          <h2 style={styles.sectionTitle}>
            Don't be the person who waits
          </h2>

          <div style={styles.formContainer}>
            <div style={styles.inputGroup}>
              <input
                type="email"
                placeholder="Your email"
                value={emailSecondary}
                onChange={(e) => setEmailSecondary(e.target.value)}
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
            maxWidth: isMobile ? '280px' : '400px',
            margin: '32px auto',
            aspectRatio: '1/1',
            borderRadius: isMobile ? '16px' : '24px',
            overflow: 'hidden',
            border: '1px solid #27272a',
            boxShadow: '0 20px 60px -15px rgba(168, 85, 247, 0.2)',
          }}>
            <img 
              src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2hrb2Z5bm9rcTV0bDMzbHhzOWVsZ2k5cW9naXp6dzlqdGN2Mmk5NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/11lz62kfEmsM00/giphy.gif"
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
        <p style={styles.footerText}>Dayzi © 2026</p>
      </footer>
    </div>
  );
}