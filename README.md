# Delta Streaming Platform

A Netflix-like streaming platform built with React, TypeScript, and Supabase. Delta allows users to browse, stream, and watch movies and web series with a premium subscription model.

## Features

### User Features
- 🎬 Browse movies and web series with Netflix-style interface
- 🔍 Search and filter content by genre
- 📱 Responsive design for all devices
- 🎥 HTML5 video player with streaming capabilities
- 👤 User authentication and profile management
- 💳 Subscription-based access control
- 🔒 Secure video access based on subscription status

### Admin Features
- 📤 Upload videos up to 10GB with resumable uploads
- 🖼️ Custom thumbnail upload or auto-generation
- 📊 Admin dashboard for content management
- 🗑️ Delete and manage uploaded content
- 👥 User and subscription management

### Design
- 🎨 Dark theme with black, gray, and green color scheme
- ✨ Smooth animations and hover effects
- 📐 Clean, modern Netflix-inspired interface
- 🎯 Intuitive navigation with clear visual hierarchy

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd delta-streaming-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Copy `.env.example` to `.env` and add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your-supabase-project-url
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

4. **Set up the database**
   - Run the migration files in the Supabase SQL editor:
     - `supabase/migrations/create_user_profiles.sql`
     - `supabase/migrations/create_videos.sql`

5. **Create storage buckets**
   In your Supabase dashboard, go to Storage and create two public buckets:
   - `videos` - for video files
   - `thumbnails` - for thumbnail images

6. **Configure admin users**
   - Edit `src/contexts/AuthContext.tsx`
   - Update the `adminEmails` array with your admin email addresses

7. **Start the development server**
   ```bash
   npm run dev
   ```

## Database Schema

### user_profiles
- `id` (uuid, primary key)
- `email` (text)
- `subscription_status` ('inactive' | 'active' | 'expired')
- `subscription_expires_at` (timestamp)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### videos
- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `file_url` (text)
- `thumbnail_url` (text)
- `duration` (integer, seconds)
- `genre` (text)
- `year` (integer)
- `admin_id` (uuid)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Configuration

### Admin Setup
To make a user an admin, add their email to the `adminEmails` array in `src/contexts/AuthContext.tsx`:

```typescript
const adminEmails = ['admin@delta.com', 'your-email@example.com']
```

### Payment Integration
The payment system uses an external bKash link. Update the payment URL in `src/pages/Subscription.tsx`:

```typescript
const paymentUrl = 'your-payment-link-here'
```

### File Upload Limits
Video uploads are limited to 10GB. This is enforced in the UI, but you may need to configure your server/hosting provider for larger file uploads.

## Deployment

### Using Netlify
1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to Netlify

3. Set environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Using Vercel
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Set environment variables in Vercel dashboard

## Usage

### For Users
1. **Sign Up/Login**: Create an account or sign in
2. **Browse Content**: View available movies and series
3. **Subscribe**: Purchase a subscription to access premium content
4. **Watch**: Stream videos with the built-in player

### For Admins
1. **Access Admin Panel**: Navigate to `/admin` (admin emails only)
2. **Upload Content**: Add new movies/series with metadata
3. **Manage Content**: Edit or delete existing videos
4. **Monitor Users**: View user subscriptions and activity

## Security Features

- Row Level Security (RLS) on all database tables
- Secure file uploads with size limits
- User authentication required for premium content
- Admin-only content management
- Protected video URLs based on subscription status

## Performance Optimizations

- Lazy loading for video thumbnails
- Optimized video streaming with HTML5 player
- Responsive images and thumbnails
- Efficient database queries with proper indexing
- CDN-ready for global content delivery

## Support

For technical support or questions:
1. Check the browser console for error messages
2. Verify Supabase configuration and database setup
3. Ensure storage buckets are properly configured
4. Contact the development team for assistance

## License

This project is proprietary software. All rights reserved.