# Lifeferry Mental Health Initiative Website

A comprehensive NGO website with admin CMS for the Lifeferry Mental Health Initiative. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Overview

This is a production-ready mental health NGO website featuring:
- **Public Website**: Trust-building homepage, services, programs/events, resources, blog, media gallery, and contact
- **Admin CMS**: Complete content management system for non-technical staff
- **Role-Based Access Control**: Three user roles (SUPER_ADMIN, ADMIN, EDITOR) with granular permissions
- **Responsive Design**: Mobile-first, accessible, and SEO-friendly

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Forms**: React Hook Form + Zod
- **Rich Text**: TipTap Editor
- **Icons**: Lucide React

## Features

### Public Website

#### Pages
- **Home** (`/`) - Hero, mission, services preview, programs, blog preview, newsletter signup
- **About** (`/about`) - Mission, vision, values, organization story
- **Team** (`/team`) - Team members with bios and social links
- **Services** (`/services`) - Service listings with booking functionality
- **Programs & Events** (`/programs`) - Upcoming and past events
- **Resources** (`/resources`) - Downloadable mental health resources
- **Blog** (`/blog`) - Articles and updates
- **Partner With Us** (`/partner`) - Volunteer, partnerships, donations
- **Media** (`/media`) - Photo/video gallery
- **Contact** (`/contact`) - Contact form and information
- **FAQ** (`/faq`) - Frequently asked questions
- **Legal Pages** - Privacy Policy, Terms of Use, Mental Health Disclaimer

#### Key Features
- Newsletter subscription
- Service booking requests
- Volunteer applications
- Contact form submissions
- Resource downloads with tracking
- Responsive navigation
- Mobile-friendly design

### Admin Panel

#### Roles & Permissions
- **SUPER_ADMIN**: Full access including user management and settings
- **ADMIN**: Content management, cannot manage users or settings
- **EDITOR**: Blog, resources, media, events only

#### Admin Routes
- `/admin` - Login page
- `/admin/dashboard` - Statistics and quick actions
- `/admin/pages` - Edit page sections (About, Partner, Home)
- `/admin/team` - Manage team members
- `/admin/services` - Manage services
- `/admin/bookings` - View and manage booking requests
- `/admin/programs` - Manage programs and events
- `/admin/resources` - Manage downloadable resources
- `/admin/blog` - Manage blog posts
- `/admin/newsletters` - View subscribers, export CSV
- `/admin/media` - Media gallery manager
- `/admin/contact` - View contact messages
- `/admin/volunteers` - Manage volunteer applications
- `/admin/faq` - Manage FAQ items
- `/admin/legal` - Edit legal pages
- `/admin/settings` - Site-wide settings (SUPER_ADMIN only)
- `/admin/users` - User management (SUPER_ADMIN only)

#### CMS Features
- Rich text editing for content
- Image and file uploads
- Automatic slug generation
- SEO metadata management
- Content status management
- Ordering and categorization
- Search and filtering
- CSV export for subscribers

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lifeferry-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Database setup is complete (migrations already applied)

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Default Admin Credentials

**IMPORTANT**: Change these credentials immediately after first login!

- **Email**: admin@lifeferry.org
- **Password**: Admin@123

## Database Schema

The application uses the following main tables:

- `users` - Admin users with role-based access
- `page_sections` - Editable page content sections
- `team_members` - Team/staff information
- `services` - Mental health services offered
- `booking_requests` - Service booking submissions
- `program_events` - Programs and events
- `resources` - Downloadable resources
- `blog_posts` - Blog articles
- `subscribers` - Newsletter subscribers
- `media_items` - Media gallery
- `contact_messages` - Contact form submissions
- `volunteer_applications` - Volunteer applications
- `faq_items` - FAQ entries
- `legal_pages` - Privacy, Terms, Disclaimer content
- `site_settings` - Site-wide configuration

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
src/
├── components/
│   ├── layouts/
│   │   ├── AdminLayout.tsx      # Admin panel layout
│   │   └── PublicLayout.tsx     # Public site layout
│   └── ProtectedRoute.tsx       # Route guard for admin
├── contexts/
│   └── AuthContext.tsx          # Authentication context
├── lib/
│   └── supabase.ts             # Supabase client configuration
├── pages/
│   ├── admin/                  # Admin CMS pages
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminPages.tsx
│   │   ├── AdminTeam.tsx
│   │   ├── AdminServices.tsx
│   │   ├── AdminBookings.tsx
│   │   ├── AdminPrograms.tsx
│   │   ├── AdminResources.tsx
│   │   ├── AdminBlog.tsx
│   │   ├── AdminMedia.tsx
│   │   ├── AdminContact.tsx
│   │   ├── AdminVolunteers.tsx
│   │   ├── AdminNewsletters.tsx
│   │   ├── AdminFAQ.tsx
│   │   ├── AdminLegal.tsx
│   │   ├── AdminSettings.tsx
│   │   └── AdminUsers.tsx
│   └── public/                 # Public website pages
│       ├── HomePage.tsx
│       ├── AboutPage.tsx
│       ├── TeamPage.tsx
│       ├── ServicesPage.tsx
│       ├── ServiceDetailPage.tsx
│       ├── ProgramsPage.tsx
│       ├── ProgramDetailPage.tsx
│       ├── ResourcesPage.tsx
│       ├── ResourceDetailPage.tsx
│       ├── BlogPage.tsx
│       ├── BlogPostPage.tsx
│       ├── PartnerPage.tsx
│       ├── MediaPage.tsx
│       ├── ContactPage.tsx
│       ├── FAQPage.tsx
│       ├── PrivacyPage.tsx
│       ├── TermsPage.tsx
│       └── DisclaimerPage.tsx
├── App.tsx                     # Main app with routing
└── main.tsx                    # Entry point
```

## Design System

### Colors
- **Primary**: Teal (#4A90A4) - Trust, calm, stability
- **Secondary**: Soft pink (#E8B4B8) - Compassion, warmth
- **Neutrals**: Grays for text and backgrounds
- **Semantic**: Blue, green, yellow, red for status indicators

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: 16px base, 150% line-height for readability
- **Font Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Spacing
- Consistent 8px spacing system
- Generous whitespace for calm feel
- Mobile-first responsive breakpoints

### Components
- Rounded corners (8px-16px)
- Subtle shadows for depth
- Smooth transitions and hover states
- Accessible color contrast ratios

## Security

### Authentication
- Custom email/password authentication using PostgreSQL users table
- Passwords hashed with bcrypt (10 rounds)
- Session stored in localStorage (consider HttpOnly cookies for production)
- Role-based access control enforced on both frontend and database

### Database Security
- Row Level Security (RLS) enabled on all tables
- Policies enforce role-based access
- Public endpoints restricted to read-only where appropriate
- Admin mutations require authenticated users with appropriate roles

### Best Practices
- Input validation with Zod schemas
- XSS protection via React's built-in escaping
- CSRF protection through Supabase
- No secrets in client-side code
- Rate limiting recommended for production

## Deployment

### Build for Production

```bash
npm run build
```

The `dist/` folder will contain the production build.

### Environment Variables

Ensure these are set in your production environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Hosting Options

- **Vercel**: Connect repository, set environment variables, deploy
- **Netlify**: Same as Vercel
- **Docker**: Create Dockerfile with Node.js, copy build, serve with nginx

### Supabase Setup

1. Create a Supabase project
2. Database migrations are already applied
3. Configure storage buckets for uploads (if using file uploads)
4. Set up SMTP for email notifications (optional)

## Customization

### Branding
- Update colors in `tailwind.config.js`
- Replace heart icon in layouts with your logo
- Edit site settings in admin panel

### Content
- Log in to admin panel
- Edit page sections under Pages
- Add team members, services, programs
- Customize legal pages

### Features
To add new features:
1. Create database table/columns
2. Add RLS policies
3. Create admin page for management
4. Create public page for display

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Color contrast ratios meet WCAG AA
- Focus indicators on interactive elements
- Alt text for images
- Responsive text sizing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

This is a custom project for Lifeferry Mental Health Initiative. For modifications:
1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit for review

## License

Proprietary - © 2026 Lifeferry Mental Health Initiative

## Support

For technical support or questions:
- Email: tech@lifeferry.org
- Documentation: See inline code comments

## Acknowledgments

Built with modern web technologies to support mental health awareness and accessibility.

---

**Remember**: Mental health matters. If you're in crisis, please contact emergency services or a crisis helpline immediately.
