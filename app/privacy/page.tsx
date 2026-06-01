export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '3rem 1rem', color: '#f0f0f0', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: 32, marginBottom: '2rem' }}>Privacy Policy</h1>
      
      <p style={{ color: '#888', marginBottom: '2rem' }}>Last updated: June 2026</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 20, marginBottom: '1rem' }}>1. Information We Collect</h2>
        <p style={{ color: '#aaa', lineHeight: 1.8 }}>We collect minimal information necessary to process your purchase. This includes payment information processed by PayPal, and pixel selection data stored in our database.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 20, marginBottom: '1rem' }}>2. How We Use Your Information</h2>
        <p style={{ color: '#aaa', lineHeight: 1.8 }}>Your information is used solely to process payments and record pixel ownership. We do not sell or share your personal data with third parties.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 20, marginBottom: '1rem' }}>3. Payment Processing</h2>
        <p style={{ color: '#aaa', lineHeight: 1.8 }}>All payments are processed by PayPal. We do not store your payment card details. Please refer to PayPal's privacy policy for information on how they handle your payment data.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 20, marginBottom: '1rem' }}>4. Cookies</h2>
        <p style={{ color: '#aaa', lineHeight: 1.8 }}>We use minimal cookies necessary for the website to function. We do not use tracking or advertising cookies.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 20, marginBottom: '1rem' }}>5. Contact</h2>
        <p style={{ color: '#aaa', lineHeight: 1.8 }}>For privacy-related questions, contact us at support@pixel-derby.com</p>
      </section>

      <a href="/" style={{ color: '#555', fontSize: 13, textDecoration: 'none' }}>← Back to home</a>
    </main>
  )
}