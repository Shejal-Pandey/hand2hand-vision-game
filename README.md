# Hand2Hand Vision Game ✋✂️

<img width="1728" height="989" alt="Screenshot 2026-02-12 at 12 52 17 AM" src="https://github.com/user-attachments/assets/4f284d28-da0b-491e-a1f6-d5190c63636c" />


> **The Ultimate AI-Powered Gesture Combat Experience**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)

Hand2Hand is a cutting-edge web application that brings the classic game of **Rock paper Scissors** into the future. Powered by **Computer Vision (MediaPipe)** and built with a premium **"Liquid Glass" Dark UI**, it allows players to control the game using real-time hand gestures via their webcam.

## ✨ Key Features

### 🧠 Advanced AI Vision
*   **Real-Time Gesture Recognition**: Uses Google's MediaPipe Tasks to detect hand landmarks instantly.
*   **Supported Gestures**:
    *   ✊ **Rock** (Closed Fist)
    *   ✋ **Paper** (Open Palm)
    *   ✌️ **Scissors** (Victory Sign)
*   **Adaptive AI Opponent**: The system tracks your move history to ensure challenging gameplay.

### 🎨 Premium UI/UX ("Figma Style")
*   **Dark Liquid Glass Theme**: Deep black backgrounds with subtle grid patterns and frosted glass cards.
*   **Framer Motion Animations**: Smooth page transitions, particle effects, and responsive interaction.
*   **Dynamic Lighting**: Cards glow with Blue, Orange, and Green gradients depending on context.
*   **Responsive Layout**: Optimized for desktop and larger tablet screens.

### 🔊 Immersive Feedback
*   **Voice Synthesis**: The game speaks game states ("Round 1", "You Win", "System Wins") using the browser's SpeechSynthesis API.
*   **Sound Effects**: Futuristic UI sounds for clicks, hover states, and combat results.

### 📊 Comprehensive Dashboard
*   **Match History**: Tracks every round played, with timestamps and results, persisted in local storage.
*   **System Settings**: Toggle Audio, adjust Graphics quality, or clear game data.
*   **Live Metrics**: Real-time display of CPU/Memory simulation and server status.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Shejal-Pandey/hand2hand-vision-game.git
    cd hand2hand-vision
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` (or the port shown in your terminal).

    > **Note**: You must allow **Camera Permissions** when prompted for the gesture recognition to work.

---

## 🛠️ Tech Stack

*   **Frontend Framework**: React 18
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS, Custom CSS Variables
*   **Animations**: Framer Motion
*   **Computer Vision**: @mediapipe/tasks-vision
*   **Icons**: Lucide React
*   **State Management**: React Hooks (useState, useEffect, useReducer)

---

## 🎮 How to Play

1.  **Identify Yourself**: Enter your name/ID on the home screen to start a session.
2.  **Start Mission**: Click "Start Session" to enter the game arena.
3.  **The Countdown**:
    *   The game will count down: **3... 2... 1...**
    *   **Show your hand!** Hold your gesture clearly in front of the camera.
4.  **Battle**:
    *   The AI will reveal its move simultaneously.
    *   The winner is decided instantly (Rock > Scissors, Scissors > Paper, Paper > Rock).
5.  **Victory**:
    *   The first to win the majority of rounds (standard: 5 rounds) wins the match.

---


## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).

---

Based on the original *Hand2Hand* concept using MediaPipe.
**Built with ❤️ by React Developers.**
