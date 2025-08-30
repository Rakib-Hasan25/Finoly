## Ekhane Finoly er logo dibo

# Finoly

A modern, production-ready AI-powered financial coaching website built with Next.js, Tailwind CSS, and shadcn/ui components.

## Project Demo

## Live Project

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
finoly_comp/
├── src/
│   ├── app/                 # App Router pages and layouts
│   │   ├── dashboard/      # Dashboard pages (home, financial-coach, tracker, etc.)
│   │   ├── auth/          # Authentication pages
│   │   ├── api/           # API routes (chat, etc.)
│   │   ├── globals.css    # Global styles and Tailwind imports
│   │   ├── layout.tsx     # Root layout component
│   │   └── page.tsx       # Home page
│   ├── components/        # Reusable components
│   │   ├── chat/         # Financial coach chat components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── gamifiedComp/ # Gamified learning components
│   │   └── ui/           # shadcn/ui components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and database
│   └── tracker-types/    # TypeScript type definitions
├── public/               # Static assets
├── supabase/            # Database migrations and functions
├── tailwind.config.ts   # Tailwind CSS configuration
├── components.json      # shadcn/ui configuration
└── package.json         # Dependencies and scripts
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

## 🌙 Dark Mode

Dark mode is automatically detected based on system preferences and can be toggled. The theme switching is handled through CSS variables and Tailwind's dark mode utilities.

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
