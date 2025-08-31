# Finoly

Finoly is an interactive financial management platform designed for users in Bangladesh. It combines AI-driven financial coaching in Bengali, gamified learning modules, and real-time expense and income tracking.

## Project Demo
https://youtu.be/JQfphvNbR4E?si=XcmGoLFa4B0YUUNS

## Live Project
https://finoly.vercel.app/

## Problem Statement

Financial literacy remains a critical challenge in Bangladesh, with far-reaching consequences for individuals and communities.

- **28% of adults lack basic financial skills**, including budgeting, saving, and managing debt.  
- There is **no unified platform for financial education** tailored to the local context.  
- **Government initiatives for financial literacy are limited**, leaving gaps in knowledge dissemination.  
- Many adults have **little to no real-world financial literacy**, even into adulthood.  

### The Cycle of Financial Exclusion

Low financial literacy drives a self-reinforcing cycle:

1. **Low Financial Literacy** → leads to **Poor Financial Decisions**  
2. **Poor Financial Decisions** → results in **Financial Instability**  
3. **Financial Instability** → limits economic growth opportunities  

Without intervention, this cycle threatens the economic potential of millions, particularly in rural and low-income communities.

## Our Objectives
1. **Make financial literacy engaging and accessible**  
   Design learning experiences that cater to people of all ages and backgrounds, ensuring financial education is approachable and interactive.

2. **Provide personalized guidance**  
   Enable individuals to make smarter financial decisions through tailored advice and context-aware support.

3. **Encourage responsible money management**  
   Promote healthy financial habits that foster long-term stability and confidence in handling personal finances.

## Features

- **Gamified Learning:** Interactive challenges, rewards, and tailored tracks for students and small business owners.
- **Chatbot Assistant:** 24/7 support for queries, offering personalized guidance over time.  
- **Financial Activity Tracker:** Log expenses and savings, track income and debt, and visualize financial health with dashboards.  

A complete digital guide that **teaches, tracks, and assists** users in managing money effectively.

## Tools & Languages Used

- **Frontend (Next.js):**  
  User interface for authentication, profiles, chatbot, learning modules, and financial dashboards. Handles routing, session management, API communication, and is optimized for low-bandwidth users.

- **Backend (Next.js API Routes):**  
  Server-side logic including authentication, financial tracking, learning progress, and gamification. Integrates with Supabase for database operations and secure workflows.

- **Database & Authentication (Supabase):**  
  Supabase PostgreSQL stores user credentials, financial data, and gamification records. Provides real-time updates and Supabase Auth manages authentication and role-based access.

- **AI Stack (GPT-3.5 Turbo):**  
  Conversational support and financial guidance fine-tuned for Bangladesh. Supports bilingual interaction (Bengali & English) for personalized, culturally relevant advice.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd finoly_comp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Finoly/
├── public/                # Static assets like images, fonts, favicon
├── src/                   # Main source code
│   ├── app/               # App-specific pages and routing
│   │   ├── admin/         # Admin panel pages
│   │   ├── api/           # API routes for backend logic
│   │   ├── auth/          # Authentication pages and logic
│   │   ├── dashboard/     # Dashboard-related pages
│   │   │   ├── financial-coach/   # AI financial coach UI
│   │   │   ├── gamified-learning/ # Gamified learning module
│   │   │   ├── home/               # Landing/home page
│   │   │   └── tracker/            # Expense/income tracker pages
│   ├── fonts/            # Custom fonts
│   ├── images/           # Images used across the app
│   ├── components/       # Reusable UI components
│   │   ├── base/         # Base UI elements (buttons, inputs)
│   │   ├── chat/         # Chat components for AI Coach
│   │   ├── dashboard/    # Dashboard-specific components
│   │   ├── forms/        # Forms used in app
│   │   ├── gamifiedComp/ # Components for gamified learning
│   │   ├── Tracker-animations/ # Animations for tracker UI
│   │   ├── Tracker-ui/          # Tracker-specific UI components
│   │   └── ui/          # General-purpose UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Helper functions and utilities
│   ├── lib-tracker/      # Tracker-specific utilities
│   └── tracker-types/    # TypeScript types for tracker
├── middleware.ts         # Middleware for request handling
├── supabase/             # Supabase configuration & scripts
├── next.config.mjs       # Next.js configuration
├── OPENAI_SETUP.md       # Instructions for OpenAI API integration
├── package.json          # Node.js project metadata & dependencies
├── pnpm-lock.yaml        # Lock file for package manager
├── postcss.config.mjs    # PostCSS configuration
├── README.md             # Project documentation
├── tailwind.config.ts    # Tailwin


```

## 🎨 Available Components

The project comes with these shadcn/ui components pre-installed:

- **Button** - Various button styles and variants
- **Card** - Content containers with headers and descriptions
- **Input** - Form input fields
- **Label** - Form labels with accessibility features

### Adding More Components

To add more shadcn/ui components:

```bash
npx shadcn@latest add <component-name>
```

Available components: [shadcn/ui Components](https://ui.shadcn.com/docs/components)

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Customization

#### Tailwind CSS
Edit `tailwind.config.ts` to customize colors, spacing, and other design tokens.

#### shadcn/ui
Modify `components.json` to change the component library configuration.

#### Theme
The project includes a dark mode toggle. Customize themes in `src/app/globals.css`.

## 📱 Responsive Design

The project is built with a mobile-first approach using Tailwind CSS responsive utilities:

- `sm:` - Small devices (640px+)
- `md:` - Medium devices (768px+)
- `lg:` - Large devices (1024px+)
- `xl:` - Extra large devices (1280px+)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com)
3. Deploy automatically on every push

### Other Platforms

The project can be deployed to any platform that supports Node.js:

```bash
npm run build
npm run start
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for financial education and empowerment using Next.js, Tailwind CSS, and shadcn/ui
