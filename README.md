# 🌙 Sleep-On-It

Sleep-On-It is a productivity and learning platform designed to help users retain knowledge through active recall and spaced revision. Instead of letting notes disappear into folders, the application organizes learning into books, notes, and revision cycles so users can review information at the right time.

---
## Live Demo 
🌐 **Live Demo:** https://sleep-on-it-me.vercel.app
## ✨ Features

- 📚 Create and manage multiple books
- 📝 Organize notes within each book
- 🔍 Search and filter notes
- 🔐 Secure user authentication
- 📅 Revision-focused note management
- ⚡ Fast and responsive user interface
- 🌙 Clean, modern UI

---

## 🛠 Tech Stack

### Framework
- Next.js

### Frontend
- React
- Tailwind CSS

### Backend
- Next.js Route Handlers (API Routes)

### Database
- PostgreSQL

### Authentication
- NextAuth.js

### Validation
- Zod
---

## 📂 Project Structure

```text
Sleep-On-It/
├── public/
│
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   ├── api/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── layout.jsx
│   │   └── page.jsx
│   │
│   ├── components/
│   ├── hooks/
│   └── library/
│
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- npm

---

### Clone the repository

```bash
git clone https://github.com/your-username/sleep-on-it.git
cd sleep-on-it
```

---

### Install dependencies

```bash
npm install
```

---

### Configure Environment Variables

Create a `.env.local` file in the project root.

```env
DATABASE_URL=your_postgres_connection_string

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GEMINI_API_KEY=your_gemini_api_key
```

> **Note:** Only include the environment variables your project actually uses.

---

### Run the Development Server

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:3000
```

---

### Build for Production

```bash
npm run build
npm start
```
## 📖 How It Works

1. Register or log in.
2. Create a book for a subject or topic.
3. Start a pomodoro session to mark your time.
4. Add notes to your books.
5. Review and manage notes through structured revision cycles.

---

## 🚧 Coming Soon

We're actively working on exciting new features!

- ⏳ AI-powered note summaries
- 📅 Smart spaced repetition scheduling
- 🔔 Revision reminders & notifications
- 📱 Progressive Web App (PWA) support
- 🌐 Dark mode improvements
- 📤 Import/Export notes (Markdown & PDF)
- 🤝 Collaborative note sharing

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push the branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
