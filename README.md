
# 📍 Masar (مَسار) - The Smart Teacher's Companion

**Masar** is a comprehensive, gamified classroom management system designed to help teachers track attendance, behavior, and academic progress while motivating students through a points and badges system.

![Masar App Banner](https://via.placeholder.com/1200x400?text=Masar+App+Preview)

## ✨ Key Features

### 🏫 Classroom Management
- **Flexible Structure:** Create Grades, Sections (Classes), and manage Student lists easily.
- **CRUD Operations:** Add, edit, and delete classes and students on the fly.
- **Student Profiles:** Detailed profiles showing rank, level, and progress bars.

### 🎮 Gamification & Motivation
- **Points System:** Award points for Excellence, Helpfulness, Respect, and Teamwork.
- **Leveling System:** Students gain XP and level up (Level 1-10) with visual progress bars.
- **Badges:** Auto-unlocked badges for achievements (e.g., "First 10 Points", "Full Attendance").
- **Leaderboards:** Real-time ranking to encourage healthy competition.

### 📊 Tracking & Analytics
- **Session Sheets:** Customizable tracking grids (Daily/Weekly/Monthly) for attendance, homework, or participation.
- **Custom Marks:** Define your own symbols and weights (e.g., ⭐ = 5 points, ⚠️ = Late).
- **Analytics Dashboard:** Visual charts showing behavior distribution and class performance comparisons.
- **Lesson Tracking:** Track student engagement and understanding for specific lessons.

### 🔗 Communication & Tools
- **Parent Reports:** Generate shareable, read-only links for parents to view their child's daily progress.
- **Online Sessions:** Quick launchers for Jitsi, Zoom, and Google Meet.
- **Dark Mode:** Fully supported dark theme for comfortable night usage.
- **Offline First:** Data is persisted locally in the browser.

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router DOM](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Build Tool:** Vite

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/masar.git
   cd masar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components (Icons, Avatars, Modals, Nav)
├── pages/            # Main application screens (Home, Grade, Student, Analytics)
├── services/         # Logic layer (Data persistence, Auth, Calculations)
├── types/            # TypeScript interfaces and definitions
├── constants.ts      # App-wide constants (Colors, Labels)
├── App.tsx           # Main entry point and Routing
└── index.css         # Tailwind imports and global styles
```

## 💾 Data Storage

Currently, Masar uses **LocalStorage** to persist data. This means:
1. Data stays on your device/browser.
2. Clearing browser cache will reset the app.
3. No internet connection is required for core functionality.
4. Use the **Settings > Data Management** section to reset data if needed.

## 🎨 Customization

You can customize the app branding or colors by editing `src/constants.ts` and `tailwind.config.js`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
