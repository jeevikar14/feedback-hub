# Feedback Form Setup Instructions

## Overview
This is a responsive feedback form application that connects to Lovable Cloud (powered by Supabase) to store user feedback.

## Database Schema

The application uses two tables:

### Users Table
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Feedback Table
```sql
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  category TEXT NOT NULL CHECK (category IN ('UI', 'Performance', 'Feature', 'Other')),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Environment Variables

The application is pre-configured with Lovable Cloud, so environment variables are automatically set:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

These are already configured and you don't need to set them manually.

## Accessing Your Backend

To view your database tables, manage data, or check your Supabase settings:

1. Click the **"Cloud"** tab in the Lovable interface
2. Navigate to **Database → Tables** to view your data
3. You can export data from any table using the export button

## Testing the Application

### Test in Browser Console

You can test database operations directly in the browser console:

```javascript
// Import the Supabase client
import { supabase } from "./src/integrations/supabase/client.js";

// Test 1: Insert a test user
const testUser = await supabase
  .from('users')
  .upsert({
    name: 'Test User',
    email: 'test@example.com'
  }, {
    onConflict: 'email',
    ignoreDuplicates: false
  })
  .select()
  .single();

console.log('User created:', testUser);

// Test 2: Insert test feedback
const testFeedback = await supabase
  .from('feedback')
  .insert({
    user_id: testUser.data.id,
    rating: 5,
    category: 'UI',
    message: 'Great design!'
  });

console.log('Feedback created:', testFeedback);

// Test 3: Fetch latest feedback
const latest = await supabase
  .from('feedback')
  .select(\`
    *,
    users (
      name,
      email
    )
  \`)
  .order('created_at', { ascending: false })
  .limit(1);

console.log('Latest feedback:', latest);
```

### Form Testing

1. Fill out the feedback form with:
   - Name (required)
   - Email (required)
   - Rating 1-5 stars (required)
   - Category dropdown (required)
   - Message (optional)

2. Click "Submit Feedback"

3. You should see:
   - A success toast notification
   - The form resets
   - The latest feedback card updates below

## Taking Screenshots for Assignment Submission

### Method 1: Browser Screenshot Tools
- **Chrome/Edge**: Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac), type "screenshot", select "Capture full size screenshot"
- **Firefox**: Press `Ctrl+Shift+S` (Windows) or `Cmd+Shift+S` (Mac)

### Method 2: Built-in OS Tools
- **Windows**: `Win+Shift+S` for Snipping Tool
- **Mac**: `Cmd+Shift+4` to select area, or `Cmd+Shift+3` for full screen

### What to Screenshot
1. The empty feedback form
2. The form filled out with sample data
3. The success message after submission
4. The "Most Recent Feedback" card displaying your submission
5. The Cloud tab showing your database tables with data

## Code Structure

- `src/pages/Index.tsx` - Main page component
- `src/components/FeedbackForm.tsx` - Form component with validation and submission logic
- `src/components/LatestFeedback.tsx` - Component to display the most recent feedback
- `src/integrations/supabase/client.ts` - Pre-configured Supabase client (auto-generated, don't edit)

## Features Implemented

✅ Responsive design that works on all devices
✅ Form validation (required fields, email format)
✅ Star rating system (1-5)
✅ Category selection dropdown
✅ User upsert by email
✅ Feedback insertion with user relationship
✅ Display most recent feedback
✅ Error handling with user-friendly messages
✅ Success confirmation
✅ Database constraints and indexes
✅ Row Level Security policies

## Row Level Security

The database uses public RLS policies to allow anyone to:
- Insert new users
- View all users
- Insert new feedback
- View all feedback

This is appropriate for a public feedback form. For production applications requiring user authentication, you would implement more restrictive policies.

## Support

For questions about Lovable Cloud features, visit the [Lovable Cloud Documentation](https://docs.lovable.dev/features/cloud).
