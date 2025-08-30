# Finoly - AI আর্থিক কোচ (AI Financial Coach)

A modern, production-ready AI-powered financial coaching application built with Next.js, Tailwind CSS, and shadcn/ui components.

## ✨ Features

- **AI Financial Coach** - Personalized financial advice and guidance
- **Gamified Learning** - Interactive financial education through games
- **Financial Tracking** - Comprehensive income, expense, and savings tracking
- **Budget Management** - Smart budgeting tools and planning
- **Next.js 14.2.6** - Latest version with App Router and Server Components
- **TypeScript** - Full type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - Beautiful, accessible, and customizable component library
- **Responsive Design** - Mobile-first approach with Tailwind CSS

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
