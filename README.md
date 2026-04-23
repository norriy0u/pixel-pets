# 🐾 Pixel Pets — Raise Your 8-Bit Companion
**VishwaNova 2026 · National Level Weboreel AI Hackathon**

> Adopt a pixel creature. Feed it, play with it, watch it evolve. A tiny life, rendered in 16×16 pixels and pure CSS.

## ✨ Features
- 🎨 **CSS Pixel Art Sprites:** All pet sprites — idle, happy, sleeping, eating — are drawn entirely using CSS `box-shadow` grids with no image files whatsoever. Each animation state is a different shadow map swapped via class toggle.
- 🥚 **Egg Hatch Sequence:** On load, an egg sprite wobbles via `rotate` keyframes, cracks in three stages using `clip-path` morphing, and hatches into your pet with a full particle burst.
- 📊 **Stat System:** Hunger, happiness, and energy bars decay in real time using `setInterval`. Each stat visually changes the pet's sprite expression via CSS class mutations.
- 🍎 **Interactive Care:** Drag food items onto the pet (collision-detected via `getBoundingClientRect`). Pet reacts with a bounce animation and auditory nom sounds via Web Audio API.
- 🌙 **Day/Night Cycle:** A live clock drives a CSS background gradient that transitions from dawn → day → dusk → night over 24 hours. Pets sleep automatically at night.

## 🛠️ Tech Stack
- **HTML5** — Drag-and-drop API, `setInterval` game loop, `localStorage` for pet persistence.
- **Vanilla CSS3** — Full pixel art via `box-shadow`, `clip-path` cracking animation, gradient sky cycle.
- **Vanilla JavaScript** — Stat decay engine, collision detection, day/night time mapping.

## 📸 Try It Out
Double-click `index.html` in any modern browser. Your pet saves automatically.

---
Built with ❤️ for VishwaNova 2026
