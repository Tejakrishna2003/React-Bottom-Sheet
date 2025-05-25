# React Bottom Sheet with Spring Motion

This project is a React application implementing a bottom sheet component with multiple snap points and custom spring motion animations. Built using **Vite**, **React Hooks**, and **Tailwind CSS**, it showcases a responsive, accessible, and interactive UI component without third-party animation libraries, meeting all specified requirements.

---

## Project Overview

This application features a reusable **BottomSheet component** with three snap points (closed, half-open, fully open), smooth spring-based animations, and support for drag gestures, button controls, and keyboard navigation. The design is responsive, accessible, and styled with **Tailwind CSS**, ensuring a polished user experience across devices and browsers.

This project demonstrates proficiency in **React Hooks**, custom animations, responsive design, and accessibility, aligning with the assignment's requirements for a high-quality, interactive UI component.

---

## Features

* **Multiple Snap Points**: Closed (90% screen height), half-open (50%), and fully open (10%) positions.
* **Custom Spring Animations**: Physics-based animations using `requestAnimationFrame` for smooth transitions, without external libraries.
* **User Interactions**:
    * Drag-and-release support for mouse and touch gestures.
    * Buttons to manually select snap points (Close, Half, Open).
    * Keyboard navigation using Arrow Up/Down keys.
* **Responsive Design**: Adapts to desktop and mobile with a centered 672px max-width container and full-width mobile support.
* **Accessibility**: Keyboard-friendly with `tabIndex` and focus management for screen reader compatibility.
* **Styling**: Clean, modern UI with **Tailwind CSS**, including a scrollable content area.
* **Cross-Browser Compatibility**: Tested on Chrome, Firefox, and Safari.

---

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js**: Version 14 or higher (LTS recommended).
* **npm**: Version 6 or higher (included with Node.js).
---

## Installation

To set up and run the project locally, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Tejakrishna2003/React-Bottom-Sheet.git
    cd react-bottom-sheet
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Tailwind CSS**: Initialize Tailwind CSS if not already present:
    ```bash
    npx tailwindcss init -p
    ```
    Verify that `tailwind.config.js` includes:
    ```javascript
    module.exports = {
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
      theme: { extend: {} },
      plugins: [],
    };
    ```

4.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser (port may vary; check console output).

---

## Usage

* **Drag Interaction**: Click or touch the gray handle at the top of the bottom sheet and drag to move it. Release to snap to the nearest snap point (closed, half, or open).
* **Button Controls**: Click "Close", "Half", or "Open" buttons to navigate to specific snap points.
* **Keyboard Navigation**: Tab to the bottom sheet and use **Arrow Up** or **Arrow Down** keys to switch between snap points.
* **Responsive Behavior**: The bottom sheet is centered on larger screens (max-width 672px) and full-width on mobile. The content area is scrollable when fully open.

---

## Technical Implementation

* **Component**: The `BottomSheet` component uses **React Hooks** (`useState`, `useEffect`, `useRef`) for state management and DOM interactions.
* **Snap Points**: Defined as percentages (90%, 50%, 10%) of window height, with a `getClosestSnapPoint` function to determine the nearest snap point during drag release.
* **Spring Animation**: Custom implementation using `requestAnimationFrame` with physics-based parameters (`stiffness: 300`, `damping: 30`, `mass: 1`) for smooth transitions.
* **Interactions**:
    * **Drag**: Handles `onMouseDown`/`onTouchStart`, `onMouseMove`/`onTouchMove`, and `onMouseUp`/`onTouchEnd` for drag-and-release functionality.
    * **Buttons**: Trigger snap point changes with animated transitions.
    * **Keyboard**: Supports `onKeyDown` for Arrow Up/Down navigation.
* **Responsive Design**: Uses **Tailwind CSS** classes (`max-w-2xl`, `mx-auto`) for centering and responsive layout. Handles window resizing with `useEffect`.
* **Accessibility**: Includes `tabIndex={0}` and keyboard event listeners for accessibility compliance.
* **Styling**: **Tailwind CSS** provides a modern UI with rounded corners, shadows, and a draggable handle.

---

