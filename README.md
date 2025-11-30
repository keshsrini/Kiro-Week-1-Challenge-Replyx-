# Replyx - AI-Powered Email Response Generator

[![Built with React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)](https://vitejs.dev/)
[![Claude AI](https://img.shields.io/badge/Claude-AI-orange)](https://www.anthropic.com/)

Replyx is an intelligent email response generator that uses Claude AI to craft contextually appropriate email replies. Built with a Netflix-inspired Hawkins Design aesthetic, it combines modern web technologies with AI to solve the universal problem of email writer's block.

## ✨ Features

- **AI-Powered Responses** - Leverages Claude 3 Sonnet to generate intelligent, context-aware email replies
- **Tone Control** - Choose from Professional, Friendly, Formal, or Casual tones
- **Smart Context** - Includes sender and recipient names for personalized responses
- **One-Click Copy** - Copy generated responses to clipboard with visual feedback
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Netflix-Inspired UI** - Dark theme with glassmorphism effects and subtle glow animations
- **Real-Time Validation** - Instant form validation with helpful error messages
- **Comprehensive Error Handling** - Clear, actionable error messages for all failure scenarios

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Anthropic Claude API key ([Get one here](https://console.anthropic.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/keshsrini/Kiro-Week-1-Challenge-Replyx-.git
   cd Kiro-Week-1-Challenge-Replyx-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Add your Claude API key to `.env`:
   ```env
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   VITE_API_TIMEOUT=30000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will open at `http://localhost:3000`

### Running with Backend (Optional)

If you want to run the Express backend server alongside the frontend:

```bash
npm run dev:all
```

This runs both the Vite dev server and the Express server concurrently.

## 📖 Usage

1. **Enter Your Information**
   - Your name
   - Sender's name
   - The email you received

2. **Select a Tone**
   - Professional (business-appropriate)
   - Friendly (warm and approachable)
   - Formal (highly professional)
   - Casual (relaxed and conversational)

3. **Generate Response**
   - Click "Generate Response"
   - Wait 2-3 seconds for AI to craft your reply

4. **Copy and Use**
   - Click the copy button
   - Paste into your email client
   - Send with confidence!

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         React Application               │
│  ┌───────────────────────────────────┐  │
│  │   EmailResponseGenerator          │  │
│  │  ┌──────────┐  ┌───────────────┐ │  │
│  │  │InputForm │  │ResponseDisplay│ │  │
│  │  └──────────┘  └───────────────┘ │  │
│  └───────────────────────────────────┘  │
│              ↓                           │
│  ┌───────────────────────────────────┐  │
│  │      Custom Hooks Layer           │  │
│  │  • useEmailGenerator              │  │
│  │  • useClipboard                   │  │
│  │  • useFormValidation              │  │
│  └───────────────────────────────────┘  │
│              ↓                           │
│  ┌───────────────────────────────────┐  │
│  │      Service Layer                │  │
│  │  • claudeApiService               │  │
│  │  • clipboardService               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
              ↓
   ┌──────────────────────┐
   │  Anthropic Claude AI │
   └──────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library with hooks
- **TypeScript** - Type safety and better DX
- **Vite 6.3.5** - Fast build tool and dev server
- **CSS Modules** - Scoped styling with custom properties

### AI Integration
- **Claude 3 Sonnet** - Anthropic's AI model via REST API
- **Streaming Support** - Real-time response generation

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Custom Components** - Glassmorphism cards, loading spinners, copy buttons

### Testing
- **Vitest** - Fast unit testing framework
- **fast-check** - Property-based testing
- **@testing-library/react** - Component testing utilities

## 📁 Project Structure

```
replyx/
├── src/
│   ├── components/          # React components
│   │   ├── EmailResponseGenerator.tsx
│   │   ├── InputForm.tsx
│   │   ├── ResponseDisplay.tsx
│   │   ├── CopyButton.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ui/             # Radix UI components
│   ├── hooks/              # Custom React hooks
│   │   ├── useEmailGenerator.ts
│   │   ├── useClipboard.ts
│   │   └── useFormValidation.ts
│   ├── services/           # API and service layer
│   │   ├── claudeApiService.ts
│   │   └── clipboardService.ts
│   ├── types/              # TypeScript type definitions
│   ├── config/             # Configuration files
│   ├── styles/             # Global styles
│   └── test/               # Test utilities
├── .kiro/                  # Kiro spec documents
│   └── specs/
│       └── email-response-generator/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
├── public/                 # Static assets
├── .env.example           # Environment variable template
├── vite.config.ts         # Vite configuration
├── vercel.json            # Vercel deployment config
└── package.json           # Dependencies and scripts
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

The project includes:
- **Unit tests** for components and hooks
- **Property-based tests** using fast-check
- **Integration tests** for API services
- **16 correctness properties** validated through testing

## 🎨 Design System

### Color Palette
- **Background**: Deep black (#141414)
- **Accent**: Netflix red (#E50914)
- **Text**: White (#ffffff) and gray variants
- **Effects**: Glow effects and glassmorphism

### Typography
- **Primary**: Benguiat-style fonts (Hawkins aesthetic)
- **Secondary**: Inter, system fonts

### Animations
- Smooth transitions (200-400ms)
- Fade-in effects for responses
- Glow effects on interactive elements
- GPU-accelerated transforms

## 🔒 Security

- **API Key Protection**: Never commit `.env` file (included in `.gitignore`)
- **Input Sanitization**: All user inputs are validated
- **Error Handling**: No sensitive information exposed in error messages
- **HTTPS Only**: Enforced in production
- **Rate Limiting**: Client-side throttling to prevent abuse

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in project settings

3. **Configure Environment Variables**
   - `VITE_ANTHROPIC_API_KEY` - Your Claude API key
   - `VITE_API_TIMEOUT` - API timeout (default: 30000)

4. **Deploy**
   - Vercel auto-deploys on every push to main

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## 🐛 Troubleshooting

### "No API key found" error
- Make sure `.env` file exists in root directory
- Verify `VITE_ANTHROPIC_API_KEY` is set correctly
- Restart the dev server after adding environment variables

### "Network error" when generating
- Check your internet connection
- Verify your Claude API key is valid
- Check if you've exceeded API rate limits

### Build fails on Vercel
- Ensure `vercel.json` is present
- Check that `vite.config.ts` outputs to `dist` directory
- Verify all dependencies are in `package.json`

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ANTHROPIC_API_KEY` | Your Anthropic Claude API key | Required |
| `VITE_API_TIMEOUT` | API request timeout in milliseconds | 30000 |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Kiro AI](https://kiro.ai) during the Week 1 Challenge
- Powered by [Anthropic Claude](https://www.anthropic.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Design inspiration from Netflix and Stranger Things

## 📧 Contact

Keshav Srinivasan - [@keshsrini](https://github.com/keshsrini)

Project Link: [https://github.com/keshsrini/Kiro-Week-1-Challenge-Replyx-](https://github.com/keshsrini/Kiro-Week-1-Challenge-Replyx-)

---

**Built with ❤️ using Kiro AI** | **Powered by Claude 3 Sonnet**