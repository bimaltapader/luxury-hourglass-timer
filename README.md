# AURA - Luxury 3D Hourglass Timer

A premium, Apple-level interactive 3D landing page and meditation/focus companion. Experience time in its most beautiful, tactile form with realistic sand physics, real-time lighting, procedural audio ticking, and interactive controls.

Live Dev Url: `https://luxury-hourglass-timer.vercel.app/`
Developed by: bimaltapader.com

---

## 🎨 Features & Visual Highlights

* **Procedural 3D Hourglass**: Built dynamically with mathematical lathe profiles, rendering symmetric bulbous glass chambers and a brushed copper-red metallic frame.
* **Realistic Sand Physics**: 300 active particles simulating grain flows, complete with micro-wave flow noise and a radial splash flare at the bottom impact mound.
* **Continuous 180° Inversion**: A 3D flip animation that dynamically recalculates remaining time ratios (e.g., flipping a 1-minute remaining session leaves 1 minute of sand in the top bulb).
* **Procedural Audio Synthesis**: Mechanical tick-tock countdown sounds and bell chime chords synthesized directly in the browser via Web Audio API (with custom glassmorphic mute/unmute toggles).
* **Mindfulness Celebration**: Dual-sided gold/bronze confetti spray when the session countdown hits zero.

---

## 📜 Origin Prompts (Development Log)

This application was engineered by translating the following user requests:

1. **Initial Requirement Spec**:
   > Create a premium interactive landing page.
   > Theme: Luxury Hourglass Timer
   > Requirements:
   > - Full-screen dark background
   > - Realistic 3D hourglass in the center
   > - Gold and bronze materials
   > - Glass reflections
   > - Animated sand flowing from top chamber to bottom chamber
   > - Live countdown timer on the right
   > - Control panel on the left (Start, Pause, Reset, Flip, Duration selector: 1, 3, 5, 10, 30, 60 mins)
   > Design Style: Apple-level premium design, luxury accents, smooth animations, responsive on desktop and mobile.

2. **Typography & Initial Scaffolding**:
   > Use modern font like Inter and go ahead and create.

3. **Realism Redesign (Refining to Reference Image)**:
   > Make hourglass 3D more realistic, you can see the reference screenshot attached, you can make ultra modern... also the default will be 1 min.
   *(Resulted in straight copper-red pillars, thick beveled disc plates, and custom-lathed sand mound geometry)*

4. **Countdown Audio Synthesis**:
   > Can you add background countdown tick tick sound when start?
   *(Resulted in procedural oscillators for clock clicks and Major chime chords)*

5. **Color Matching**:
   > Change the sand color from white to real sand color which #A2876A.

---


# 🛠️ How to Download and Run on your domain:
Here is a guide on how to download, build, and host the AURA Luxury Hourglass Timer on your own custom domain (e.g., yourdomain.com).

Depending on your setup, you can either use a Modern cloud platform (e.g., Vercel, Netlify) or a Traditional web host (e.g., Bluehost, Hostinger via FTP/cPanel).

Option A: Using Vercel with a Custom Domain (Recommended & Free)
If you have already deployed the site to Vercel, adding your custom domain is free, includes automated SSL (HTTPS), and takes only 2 minutes:

Add Domain in Vercel:
Go to your Vercel Dashboard and select your project.
Go to Settings -> Domains.
Enter your domain name (e.g., yourdomain.com or timer.yourdomain.com) and click Add.
Configure DNS Records:
Vercel will show you the exact DNS records to configure. Go to your domain registrar (e.g., GoDaddy, Namecheap, Google Domains) and add:
A Record: Name: @, Value: 76.76.21.21
CNAME Record (for www): Name: www, Value: cname.vercel-dns.com
Go Live:
Once DNS propagates (usually takes 1–5 minutes), Vercel will automatically generate an SSL certificate and your site will be live!



## 🛠️ How to Download & Run Locally

Follow these quick commands to spin up the luxury timer on your machine:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18.0.0 or higher recommended).

### 1. Clone or Download the Project
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/luxury-hourglass-timer.git
cd luxury-hourglass-timer
```

### 2. Install Dependencies
Install R3F, Three.js, Tailwind v4, Framer Motion, and Confetti components:
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
* The local console will print the local link. Usually, you can view it at:
  **👉 [http://localhost:5173/](http://localhost:5173/)**

### 4. Build for Production
To generate a lightweight, static distribution bundle:
```bash
npm run build
```
The optimized bundle will be compiled into the `/dist` folder.
