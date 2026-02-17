import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('is_approved', true)
            .order('order_index', { ascending: true });

        if (error) throw error;

        return NextResponse.json(data || []);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { client_name, client_role, client_company, review_text, rating, project_name } = body;

        // Validation
        if (!client_name || !client_name.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }
        if (!review_text || !review_text.trim()) {
            return NextResponse.json({ error: 'Review text is required' }, { status: 400 });
        }
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }
        if (review_text.trim().length > 1000) {
            return NextResponse.json({ error: 'Review text must be under 1000 characters' }, { status: 400 });
        }

        const { error } = await supabase.from('reviews').insert([{
            client_name: client_name.trim(),
            client_role: client_role?.trim() || null,
            client_company: client_company?.trim() || null,
            review_text: review_text.trim(),
            rating: Math.round(rating),
            project_name: project_name?.trim() || null,
            is_approved: false,
        }]);

        if (error) throw error;

        return NextResponse.json({
            message: 'Thank you! Your review has been submitted and will appear after approval.'
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }
}
