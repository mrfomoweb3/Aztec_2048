# 🧠 Aztec-2048

A minimalist, Aztec-themed 2048 game built from scratch in React.  
Responsive. Fast. Touch-friendly. With a global leaderboard and dark mode styling.

---

## 🚀 Features

- 🎮 **Playable 2048 grid** with tile merging  
- 🧍 **Name input** to personalize and track scores  
- 💾 **Local game history** saved per player  
- 🏆 **Global leaderboard** stored in `localStorage`  
- 📱 **Touchscreen & keyboard support**  
- ☠️ **Game Over detection** with restart button  
- 🎨 **Aztec-style UI** with responsive layout and animations  

---

## 🧩 Components Breakdown

### 1. `NameInput.jsx`
- Renders a form to input your name
- Shows the game logo and welcome message
- Once submitted, loads the game

### 2. `Game2048.jsx`
- Main 2048 gameplay grid (`4x4`)
- Handles all movement logic: up, down, left, right
- Detects merge events and tracks score
- Stores each round in personal history
- On game over:
  - Saves score to personal and global leaderboard
  - Sorts players by top score
  - Opens "Play Again" prompt

### 3. Leaderboard Modal
- Triggered by clicking the 🏆 button in navbar
- Shows top 100 scores from all players (locally stored)
- Automatically updates if a user beats their previous high score

---

## 🗂 File Structure

```
src/
├── components/
│   ├── NameInput.jsx
│   └── Game2048.jsx
├── styles/
│   └── Game2048.css
├── App.js
└── index.js
```

---

## 🛠 Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourname/aztec-2048.git
cd aztec-2048

# 2. Install dependencies
npm install

# 3. Start the dev server
npm start
```

Then open `http://localhost:3000`

---

## 📦 Tech Stack

- React (via Create React App)
- CSS Modules for styling
- `localStorage` for persistent score/history

---

## 📝 To-Do Next

- [ ] Add animations to tile merges
- [ ] Add sound effects
- [ ] Online/global database for leaderboard (optional)
- [ ] Deploy to Vercel or Netlify

---

Made with cocoa and keyboard mashing ✨  
**Built for fun. Inspired by Aztec magic.**
