
/* 
  Mountain View RV Park - Backend Automation
  Run this in your Supabase SQL Editor to enable automated guest communications.
*/

-- 1. Create a function that invokes an Edge Function for emails
-- This function will be triggered after every successful reservation.
CREATE OR REPLACE FUNCTION public.send_booking_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- In a production environment, you would use pg_net to call a Supabase Edge Function.
  -- This Edge Function would then use a service like Resend or SendGrid to send the mail.
  -- Example:
  -- PERFORM
  --   net.http_post(
  --     url := 'https://uvgnawiblpatnqhjeqmc.supabase.co/functions/v1/send-confirmation',
  --     headers := jsonb_build_object(
  --       'Content-Type', 'application/json',
  --       'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
  --     ),
  --     body := json_build_object(
  --       'guest_email', NEW.email,
  --       'guest_name', NEW.name,
  --       'check_in', NEW.check_in,
  --       'check_out', NEW.check_out,
  --       'rv_size', NEW.rv_size
  --     )::text
  --   );

  -- For now, we log the event to the Postgres console for auditing
  RAISE NOTICE 'New booking confirmation triggered for % (%)', NEW.name, NEW.email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Bind the function to the bookings table
-- This ensures the logic runs AFTER the row is successfully written to the DB.
DROP TRIGGER IF EXISTS on_booking_created ON public.bookings;
CREATE TRIGGER on_booking_created
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.send_booking_confirmation();

-- 3. RLS Policies (Security)
-- Ensure users can only see their own bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings" 
  ON public.bookings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 4. Global Availability View
-- Allow everyone to see dates (but not personal info) for the calendar
CREATE OR REPLACE VIEW public.global_availability AS
  SELECT check_in, check_out FROM public.bookings;

GRANT SELECT ON public.global_availability TO anon, authenticated;
