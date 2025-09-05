export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-lg">
        <h2>Controller</h2>
        <p>
          <strong>NOTHINGFEED</strong><br />
          Jöran Eitel<br />
          Kurfürstenstraße 24<br />
          10785 Berlin<br />
          E-Mail: privacy@nothingfeed.com
        </p>

        <h2>Data Collected</h2>
        <p>We collect only the minimum data required to operate the service:</p>
        <ul>
          <li>Email address (account creation & login)</li>
          <li>Username/handle (identification)</li>
          <li>Deletion statistics (character, word, sentence counts)</li>
        </ul>

        <h2>Purpose of Processing</h2>
        <p>Your data is used solely for:</p>
        <ul>
          <li>Account authentication</li>
          <li>Displaying deletion statistics</li>
          <li>Providing the feed functionality</li>
        </ul>

        <h2>Storage & Sharing</h2>
        <ul>
          <li>All data is stored securely on our servers.</li>
          <li>Data is not shared with third parties.</li>
          <li>No usage for advertising or tracking purposes.</li>
        </ul>

        <h2>Legal Basis</h2>
        <p>Processing is based on Art. 6(1)(b) GDPR (performance of contract).</p>

        <h2>Your Rights</h2>
        <p>You have the right to request access, rectification, erasure, restriction of processing, data portability, and objection to processing at any time. Contact: privacy@nothingfeed.com.</p>

        <h2>Supervisory Authority</h2>
        <p>You also have the right to lodge a complaint with a data protection supervisory authority if you believe your data is being processed unlawfully.</p>
      </div>
    </div>
  )
}
