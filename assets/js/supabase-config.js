// Supabase Configuration
(function() {
    'use strict';
    
    // Check if supabase is already initialized
    if (window.supabaseClient) {
        return;
    }
    
    const SUPABASE_URL = 'https://hajfduiipstqtejgqcvg.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhamZkdWlpcHN0cXRlamdxY3ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTMxNDYsImV4cCI6MjA4MzYyOTE0Nn0.Acrnwro-PIRn8qgmryMstK-aGYl1mo7_0E2_lOHZcsM';

    // Check if supabase library is loaded
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase library is not loaded. Make sure to include the Supabase script before this file.');
        return;
    }

    // Initialize Supabase Client
    try {
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Export for use in other files
        window.supabaseClient = supabase;
        
        console.log('Supabase client initialized successfully');
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
    }
})();

