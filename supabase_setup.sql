
/* 
  SQL Snippets for Mountain View RV Park Supabase Setup 
  Run these in your Supabase SQL Editor to enable Email Confirmation Triggers.
*/

-- 1. Ensure the bookings table has a user_id foreign key for better Auth integration
-- ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2. Create a function to send a confirmation email simulation via Postgres log 
-- or use pg_net for real HTTP calls to email services.
-- Here is a conceptual trigger function:

/*
CREATE OR REPLACE FUNCTION public.handle_new_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- This is where you would integrate with a service like Resend, SendGrid, or AWS SES
  -- For a simple built-in approach, you could use Supabase Edge Functions.
  
  -- Example of an HTTP call to a hypothetical Edge Function:
  -- PERFORM
  --   net.http_post(
  --     url := 'https://your-project-id.supabase.co/functions/v1/send-booking-email',
  --     headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
  --     body := json_build_object('email', NEW.email, 'name', NEW.name, 'check_in', NEW.check_in)::text
  --   );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_booking_created
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_booking();
*/

-- 3. Storage Bucket Policy (Enable this in Supabase UI)
-- Ensure 'gallery' bucket exists.
-- Policy: Allow authenticated users to upload to 'uploads/' folder.
-- Policy: Allow everyone to read.
