export default function TermsPage() {
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '3rem 1rem', color: '#f0f0f0', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: 32, marginBottom: '2rem' }}>Terms of Service</h1>
      
      <p style={{ color: '#888', marginBottom: '2rem' }}>Last updated: June 2026</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 20, marginBottom: '1rem' }}>1. Service Description</h2>
        <p style={{ color: '#aaa', lineHeight: 1.8 }}>Pixel Derby is an interactive pixel map where users purchase pixels to claim territory for their favourite football colour. Each pixel costs $1, with a minimum purchase of 25 pixels ($25).</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 20, marginBottom: '1rem' }}>2. Purchases</h2>
        <p style={{ color: '#aaa', lineHeight: 1.8 }}>All purchases are final. Once a pixel is claimed, it cannot be repurchased by another user. Payments are processed securely via PayPal.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 20, marginBottom: '1rem' }}>3. Refund Policy</h2>
        <p style={{ color: '#aaa', lineHeight: 1.8 }}>Due to the nature of pixel territory claims, all sales are final and non-refundable. If you experience a technical issue resulting in a failed purchase, please contact us at support@pixel-derby.com.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 20, marginBottom: '1rem' }}>4. Youth Fund Donation</h2>
        <p style={{ color: '#aaa', lineHeight: 1.8 }}>20% of total revenue will be donated to the winning colour's youth academy at the end of each campaign. The winning colour is determined by which side holds more pixel territory.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 20, marginBottom: '1rem' }}>5. User Conduct</h2>
        <p style={{ color: '#aaa', lineHeight: 1.8 }}>Users agree not to attempt to manipulate, hack, or exploit the pixel map system. Any fraudulent activity will result in immediate disqualification and potential legal action.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 20, marginBottom: '1rem' }}>6. Contact</h2>
        <p style={{ color: '#aaa', lineHeight: 1.8 }}>For any questions, please contact us at support@pixel-derby.com</p>
      </section>

      <a href="/" style={{ color: '#555', fontSize: 13, textDecoration: 'none' }}>← Back to home</a>
    </main>
  )
}