import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const flowId = searchParams.get('flowId');

  if (flowId) {
    // Export d'un seul flux
    const { data: flow, error } = await supabase
      .from('flows')
      .select('*')
      .eq('id', flowId)
      .eq('user_id', user.id)
      .single();

    if (error || !flow) {
      return NextResponse.json({ error: 'Flux non trouvé' }, { status: 404 });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = 800;
    const margin = 50;
    const lineHeight = 20;

    // Titre
    page.drawText('Rapport d\'estimation - Flux de données', {
      x: margin,
      y,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0.5),
    });
    y -= 40;

    // Informations du flux
    page.drawText('Informations du flux', {
      x: margin,
      y,
      size: 14,
      font: boldFont,
    });
    y -= lineHeight * 1.5;

    const flowInfo = [
      ['Nom:', flow.name],
      ['Client:', flow.client || 'N/A'],
      ['Technologie:', flow.tech],
      ['Complexité:', flow.complexity],
      ['Niveau utilisateur:', flow.user_level],
      ['Estimation:', `${flow.estimated_days || 0} jours`],
    ];

    flowInfo.forEach(([label, value]) => {
      page.drawText(`${label} ${value}`, {
        x: margin,
        y,
        size: 10,
        font,
      });
      y -= lineHeight;
    });

    y -= lineHeight;

    // Caractéristiques techniques
    page.drawText('Caractéristiques techniques', {
      x: margin,
      y,
      size: 14,
      font: boldFont,
    });
    y -= lineHeight * 1.5;

    const techInfo = [
      ['Sources:', flow.sources.toString()],
      ['Cibles:', flow.targets.toString()],
      ['Transformations:', flow.transformations.toString()],
      ['Volume de données:', `${flow.data_volume} MB`],
      ['Fréquence:', flow.frequency],
      ['Environnement:', flow.environment],
    ];

    techInfo.forEach(([label, value]) => {
      page.drawText(`${label} ${value}`, {
        x: margin,
        y,
        size: 10,
        font,
      });
      y -= lineHeight;
    });

    if (flow.comments) {
      y -= lineHeight;
      page.drawText('Commentaires:', {
        x: margin,
        y,
        size: 12,
        font: boldFont,
      });
      y -= lineHeight;
      const commentsLines = flow.comments.split('\n');
      commentsLines.forEach((line: string) => {
        if (y < 100) {
          const newPage = pdfDoc.addPage([595, 842]);
          y = 800;
        }
        page.drawText(line.substring(0, 80), {
          x: margin,
          y,
          size: 10,
          font,
        });
        y -= lineHeight;
      });
    }

    const pdfBytes = await pdfDoc.save();
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="flux-${flow.name.replace(/[^a-z0-9]/gi, '_')}-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });
  } else {
    // Export de tous les flux
    const { data: flows, error } = await supabase
      .from('flows')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    flows.forEach((flow, index) => {
      if (index > 0) {
        pdfDoc.addPage([595, 842]);
      }
      const page = pdfDoc.getPage(index);
      let y = 800;
      const margin = 50;
      const lineHeight = 20;

      page.drawText(`Flux: ${flow.name}`, {
        x: margin,
        y,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0.5),
      });
      y -= 30;

      page.drawText(`Estimation: ${flow.estimated_days || 0} jours`, {
        x: margin,
        y,
        size: 12,
        font: boldFont,
      });
      y -= 30;

      const info = [
        `Client: ${flow.client || 'N/A'}`,
        `Technologie: ${flow.tech}`,
        `Complexité: ${flow.complexity}`,
        `Sources: ${flow.sources} | Cibles: ${flow.targets}`,
      ];

      info.forEach((text) => {
        page.drawText(text, {
          x: margin,
          y,
          size: 10,
          font,
        });
        y -= lineHeight;
      });
    });

    const pdfBytes = await pdfDoc.save();
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="abaques-tous-les-flux-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });
  }
}

