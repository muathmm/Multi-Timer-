# ⏱️ Multi-Timer Mobile App

A **React Native** mobile application that allows users to create, manage, and track multiple timers simultaneously.  
Each timer sends notifications when completed — simulating real-world use cases like **medication reminders**, **lab tasks**, or **time-bound services**.  

This project demonstrates **state management, asynchronous behavior, persistence, notifications, and mobile UI/UX design**.

---

## 📖 Context
The main objective is to provide an efficient, user-friendly mobile solution for handling multiple concurrent timers.  

Use cases include:
- Medication reminders for patients.
- Tracking experiments or lab tasks.
- Daily services requiring timed actions.

---

## 🎯 Core Features
### 🕒 Timer Functionality
- Create multiple timers with **custom labels** and **durations**.  
- Start ⏯️, pause ⏸️, resume ▶️, and delete ❌ timers.  
- Real-time countdown display.  

### 🔔 Notifications
- Local notifications when a timer finishes.  
- Notifications trigger **even in the background**.  

### 💾 Persistence
- Timer state is **persisted** across app restarts.  
- No loss of timers when closing the app.  

### 🎨 UI/UX
- Clear and **mobile-friendly interface**.  
- All active timers shown in a list.  
- Visual indication for **running**, **paused**, and **completed** timers.  
- Animated progress bars & circular countdown indicators.  

---

## ✨ Optional / Bonus Features
- Recurring timers (e.g., **daily reminders**).  
- **Drag-and-drop** to reorder timers.  
- **Swipe gestures** for pause/delete.  
- Sound 🔊 or vibration 📳 alerts.  
- **Dark mode** or theme customization.  

---

## 🛠️ Tech Stack
- **Framework:** [React Native](https://reactnative.dev/)  
- **Navigation:** [Expo Router](https://expo.github.io/router/)  
- **Animations:** [Lottie](https://airbnb.io/lottie/) + React Native Animated API  
- **Notifications:** [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)  
- **Styling:** React Native StyleSheet + Linear Gradient (for theming)  
- **State Management:** React Hooks & Context API  
- **Persistence:** AsyncStorage / SecureStore  

---

## 📂 Project Structure

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
MultiTimerApp/
│── app/ # Screens & navigation (Expo Router)
│ ├── index.tsx # Entry screen
│ ├── tabs/ # Tab-based navigation
│ └── components/ # Reusable UI components
│
│── assets/ # Images, icons, animations (Lottie)
│── context/ # Auth & timer state contexts
│── services/ # Notification services
│── package.json
│── app.json
│── eas.json
└── README.md

```

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git https://github.com/muathmm/Multi-Timer-.git
cd MultiTimerApp

```
### 2️⃣ Install Dependencies
npm install
# or
yarn install


### 3️⃣ Start the App (Expo Go)
npx expo start

### 4️⃣ Build APK (Android)
npx eas build --platform android --profile preview

### 5️⃣ Build for iOS (requires macOS + Apple Developer account)
npx eas build --platform ios --profile production