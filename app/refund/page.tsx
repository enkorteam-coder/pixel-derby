export default function RefundPage() {
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '3rem 1rem', color: '#f0f0f0', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: 32, marginBottom: '2rem' }}>Refund Policy</h1>
      
      <p style={{ color: '#888', marginBottom: '2rem' }}>Last updated: June 2026</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 20, marginBottom: '1rem' }}>No Refund Policy</h2>
        <p style={{ color: '#aaa', lineHeight: 1.8 }}>All pixel purchases on Pixel Derby are final and non-refundable. Once pixels are claimed on the map, they cannot be returned or exchanged.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 20, marginBottom: '1rem' }}>Technical Issues</h2>
        <p style={{ color: '#aaa', lineHeight: 1.8 }}>If you experience a technical issue where payment was charged but pixels were not recorded, please contact us at support@pixel-derby.com within 48 hours with your PayPal transaction ID.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 20, marginBottom: '1rem' }}>Contact</h2>
        <p style={{ color: '#aaa', lineHeight: 1.8 }}>support@pixel-derby.com</p>
      </section>

      <a href="/" style={{ color: '#555', fontSize: 13, textDecoration: 'none' }}>← Back to home</a>
    </main>
  )
}