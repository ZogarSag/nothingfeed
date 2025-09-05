export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-lg">
        <h2>Data Collection</h2>
        <p>NOTHINGFEED collects minimal data necessary for functionality:</p>
        <ul>
          <li>Email address for account creation</li>
          <li>Username/handle for identification</li>
          <li>Deletion statistics (character, word, sentence counts)</li>
        </ul>

        <h2>Data Usage</h2>
        <p>Your data is used solely for:</p>
        <ul>
          <li>Account authentication</li>
          <li>Displaying deletion statistics</li>
          <li>Feed functionality</li>
        </ul>

        <h2>Data Storage</h2>
        <p>All data is stored securely and is not shared with third parties.</p>

        <h2>Contact</h2>
        <p>For privacy concerns, contact us at privacy@nothingfeed.com</p>
      </div>
    </div>
  )
}
