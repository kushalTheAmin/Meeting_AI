const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabase() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase credentials not found in environment');
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Test connection by querying recordings table
    const { data, error } = await supabase
      .from('recordings')
      .select('count')
      .limit(1);

    if (error && error.code === 'PGRST116') {
      console.log('⚠️  Supabase connected but recordings table not found. Run the schema SQL from README.');
      process.exit(0);
    } else if (error) {
      throw error;
    } else {
      console.log('✅ Supabase connection successful');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    process.exit(1);
  }
}

testSupabase();
