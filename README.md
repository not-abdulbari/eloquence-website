
# Eloquence '25 – National Tech Symposium Website

Official website for Eloquence '25, a national-level technical symposium organized by the Department of Computer Science and Engineering, C. Abdul Hakeem College of Engineering and Technology.

---

## 🚀 Quick Start

### 1. Local Development

1. **Install dependencies** (using [pnpm](https://pnpm.io/)):
	```sh
	pnpm install
	```
2. **Run the development server:**
	```sh
	pnpm dev
	```
	The app will be available at [http://localhost:3000](http://localhost:3000).

### 2. Production Build (for Cloudflare Pages)

Cloudflare Pages supports Next.js static export. To deploy:

1. **Build the app:**
	```sh
	pnpm build
	```
2. **Export static site:**
	```sh
	pnpm next export
	```
	This will output static files to the `out/` directory.
3. **Deploy to Cloudflare Pages:**
	- Connect your GitHub repo to Cloudflare Pages.
	- Set the build command to `pnpm build && pnpm next export`.
	- Set the output directory to `out`.

---

## 🌟 Features

- **Modern Next.js App Router** (React 19, TypeScript)
- **Fully Responsive Design** for all devices
- **Custom Fonts & Branding** (Decaydence, Monotype Corsiva, Garet, Chopsic, Maximum Voltage)
- **Dynamic Event Listing** (Tech & Non-Tech events, fetched from JSON)
- **Event Details Pages** (with rules, registration, and info)
- **Live Countdown Timer** to event start
- **Patrons & Committee Pages**
- **Sponsors Section**
- **Interactive Navbar** (mobile hamburger, theme toggle)
- **Animated Background Grid & Floating Icons**
- **Accessible, Mobile-First UI**
- **Dark/Light Theme Toggle**
- **Cloudflare Pages Ready** (static export)

---

## 📅 Event List (2025)

### Tech Events
- Paper Presentation
- Aptitude & Coding
- Tech Quiz
- Web Designing

### Non-Tech Events
- CWF (Fun Challenge)
- Art Competition
- Connection (Word Game)
- Memory Game
- BGMI & Free Fire (Esports)
- Short Film

---

## 🛠️ Project Structure

- `app/` – Next.js app directory (pages, routes)
- `components/` – Reusable UI and section components
- `public/data/site-data.json` – Event and site data
- `styles/` – Tailwind and global CSS

---

## ✅ Future Improvements / Checklist

- [ ] Add event registration status (open/closed)
- [ ] Add photo gallery and past event highlights
- [ ] Add FAQ section
- [ ] Add event coordinators contact info
- [ ] Add event schedule/timetable page
- [ ] Add results/leaderboard after event
- [ ] Add sponsor logos and links dynamically from data
- [ ] Improve accessibility (a11y audit)
- [ ] Add more animations/interactivity
- [ ] Add testimonials/feedback section
- [ ] Add multi-language support
- [ ] Add admin panel for event management

---

## 📄 License

MIT. See [LICENSE](LICENSE) for details.
