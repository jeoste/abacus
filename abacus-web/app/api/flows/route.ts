import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { CostCalculator } from '@/lib/calculator/costCalculator';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('flows')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const calculator = new CostCalculator();
  
  // Calculer l'estimation
  const calculation = calculator.calculateCost(body as any);
  body.estimated_days = calculation.totalCost;

  const { data, error } = await supabase
    .from('flows')
    .insert({
      ...body,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

