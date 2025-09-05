## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with React and TypeScript
- **Styling**: Tailwind CSS with custom brutalist design
- **Database**: SQLite with Prisma ORM
- **Authentication**: iron-session with bcrypt password hashing
- **File Upload**: Custom avatar upload system

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ZogarSag/nothingfeed.git
cd nothingfeed
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="your-super-secret-session-key-change-this-in-production"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Usage

1. **Register**: Create an account with email, handle, and password
2. **Login**: Sign in to your account
3. **Write**: Type your thoughts in the input field
4. **Delete**: Hit the arrow button to "delete" your content
5. **View Stats**: See your deletion statistics on your profile
6. **Upload Avatar**: Personalize your profile with a custom image

## 🎨 Design Philosophy

NOTHINGFEED uses a **brutalist design** approach:
- Sharp, eckige edges (no rounded corners)
- Bold black borders and shadows
- Minimalist color palette (black, white, grey, red accents)

## 📊 Features

### Text Analysis
- **Character counting**: Non-whitespace characters
- **Word recognition**: Individual words separated by spaces
- **Sentence detection**: Sentences ending with `.`, `!`, or `?`

### User Statistics
- Total deletions performed
- Total characters, words, and sentences deleted
- Historical deletion timeline

### Privacy Features
- Content is deleted immediately after analysis
- Only metadata is stored
- No content recovery possible
- Privacy by design architecture

## 🔧 Development

### Database Schema

The app uses Prisma with SQLite:

- **Users**: Store user accounts with authentication
- **Deletions**: Store metadata about deleted content
- **UserStats**: Aggregate statistics per user

### API Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/me` - Get current user info
- `GET /api/feed` - Get public deletion feed
- `POST /api/compose` - Submit content for deletion
- `POST /api/auth/upload-avatar` - Upload profile picture
# Test CI/CD
# Test CI/CD - Secrets korrigiert
