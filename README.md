# LinkHub - Your Links, Your Way

LinkHub is a comprehensive platform for creating beautiful, mobile-friendly landing pages that showcase all your important links in one place. It's perfect for creators, influencers, businesses, and anyone who wants to share multiple links with their audience.

## Features

- **User Profiles**: Create personalized profiles with custom themes and layouts
- **Link Management**: Add, edit, and organize your links with drag-and-drop functionality
- **Privacy Controls**: Set links as public or premium (subscriber-only)
- **Analytics**: Track profile views and link clicks
- **Customization**: Choose from multiple themes and customize your profile's appearance
- **Mobile-First Design**: Optimized for all devices with responsive layouts
- **Dark Mode**: Built-in dark mode support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Vercel KV (Redis)
- **Storage**: Vercel Blob
- **Authentication**: Custom authentication with Redis session storage
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18 or later
- Vercel account
- Vercel KV (Redis) database
- Vercel Blob storage

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/linkhub.git
   cd linkhub
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   \`\`\`
   KV_URL=your_kv_url
   KV_REST_API_TOKEN=your_kv_token
   KV_REST_API_READ_ONLY_TOKEN=your_kv_read_only_token
   BLOB_READ_WRITE_TOKEN=your_blob_token
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

The easiest way to deploy LinkHub is with Vercel:

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Add the required environment variables.
4. Deploy!

## Admin Access

LinkHub comes with a built-in admin panel. The default admin credentials are:

- Username: `admin`
- Password: `admin123`

**Important**: Change these credentials in production by modifying the `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_EMAIL` constants in `lib/auth.ts`.

## Troubleshooting

If you encounter issues with Redis key structure, you can use the "Fix Redis Structure" button in the admin panel to repair any inconsistencies.

For development purposes, you can reset the database by visiting `/api/reset-db`. This endpoint is disabled in production.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

Let's create a troubleshooting guide:
