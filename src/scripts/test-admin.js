const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jkhhvfcrwfwlaaarmrlb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpraGh2ZmNyd2Z3bGFhYXJtcmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTMwMzQsImV4cCI6MjA3MjMyOTAzNH0.Dzyfk2eBTaLHqwC0IVReOImf2j8p0VuUZNIJUB8_t3w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Inserting a test report into police table...');
  const submission = {
    type_of_crime: 'Civilian Crime',
    Specific_Type_of_Crime: 'Test Case',
    Report_Details: 'Automated test report for admin flow verification. This text is sufficiently long to pass validation.',
    District: 'Kathmandu',
    Local_Address_Tole: 'Test Address',
    image: 'https://picsum.photos/400/300',
  };
  const insert = await supabase
    .from('police')
    .insert([submission])
    .select()
    .single();

  if (insert.error) {
    console.error('Insert error:', insert.error);
    process.exit(1);
  }

  const trackId = insert.data.track_id;
  console.log('Inserted track_id:', trackId);

  console.log('Updating status to under_review...');
  const updateStatus = await supabase
    .from('police')
    .update({ status: 'under_review' })
    .eq('track_id', trackId);

  if (updateStatus.error) {
    console.error('Update status error:', updateStatus.error);
    process.exit(1);
  }

  console.log('Posting feedback and setting status to action_taken...');
  const updateFeedback = await supabase
    .from('police')
    .update({
      feedback: 'Automated test feedback',
      feedback_date: new Date().toISOString(),
      feedback_by: 'Police',
      status: 'action_taken',
    })
    .eq('track_id', trackId);

  if (updateFeedback.error) {
    console.error('Update feedback error:', updateFeedback.error);
    process.exit(1);
  }

  console.log('All admin actions succeeded for track_id:', trackId);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


