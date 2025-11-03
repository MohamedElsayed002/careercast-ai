import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function createPdfBytes(title: string, summaryText: string) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // A4-ish (points)
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 48;
  const contentWidth = width - margin * 2;

  // Title style
  const titleSize = 20;
  const titleFont = fontBold;
  let y = height - margin;

  // Draw title
  page.drawText(title, {
    x: margin,
    y: y - titleSize,
    size: titleSize,
    font: titleFont,
    color: rgb(0, 0, 0),
    maxWidth: contentWidth,
  });

  // Move y below title
  y -= titleSize + 12;

  // Body style
  const bodyFont = font;
  const bodySize = 12;
  const lineHeight = 18; // gives a comfortable spacing between lines
  const bulletIndent = 12;
  const bulletGap = 8;

  // Helper: wrap a single paragraph into lines that fit contentWidth
  function wrapParagraph(text: string, fontToUse: any, size: number) {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = "";

    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      const testWidth = fontToUse.widthOfTextAtSize(test, size);
      if (testWidth <= contentWidth) {
        current = test;
      } else {
        if (current) lines.push(current);
        // if single word too long, still push it (will overflow)
        current = word;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  // Split summary into paragraphs, preserving bullet lines
  // We treat double newlines as paragraph separators.
  const paragraphs = summaryText
    .replace(/\r\n/g, "\n")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  for (const para of paragraphs) {
    // Check if this paragraph contains explicit newline-separated lines (like list items)
    const linesInPara = para.split(/\n/).map((l) => l.trim()).filter(Boolean);

    for (const rawLine of linesInPara) {
      const isBullet = /^(-|\u2022)\s+/.test(rawLine); // '-' or '•'
      const  contentLine = rawLine.replace(/^(-|\u2022)\s+/, "");

      // If it's a bullet, indent: available width reduced
      if (isBullet) {
        // wrap using reduced width for indentation
        const bulletWidth = bulletIndent + bulletGap;
        const wrapped = wrapParagraph(contentLine, bodyFont, bodySize);
        for (let i = 0; i < wrapped.length; i++) {
          // handle page break
          if (y - lineHeight < margin) {
            page = pdfDoc.addPage([595, 842]);
            y = page.getSize().height - margin;
          }
          const textX = margin + (i === 0 ? bulletIndent + bulletGap : bulletIndent + bulletGap);
          // draw bullet marker only on first wrapped line
          if (i === 0) {
            // draw bullet character
            page.drawText("•", {
              x: margin + bulletIndent - 6,
              y: y - bodySize,
              size: bodySize,
              font: bodyFont,
            });
          }
          page.drawText(wrapped[i], {
            x: textX,
            y: y - bodySize,
            size: bodySize,
            font: bodyFont,
            color: rgb(0, 0, 0),
            maxWidth: contentWidth - bulletWidth,
          });
          y -= lineHeight;
        }
      } else {
        // normal paragraph: wrap at contentWidth
        const wrapped = wrapParagraph(contentLine, bodyFont, bodySize);
        for (const wline of wrapped) {
          if (y - lineHeight < margin) {
            page = pdfDoc.addPage([595, 842]);
            y = page.getSize().height - margin;
          }
          page.drawText(wline, {
            x: margin,
            y: y - bodySize,
            size: bodySize,
            font: bodyFont,
            color: rgb(0, 0, 0),
            maxWidth: contentWidth,
          });
          y -= lineHeight;
        }
      }

    }

    // Add paragraph spacing
    y -= 8;
    if (y - lineHeight < margin) {
      page = pdfDoc.addPage([595, 842]);
      y = page.getSize().height - margin;
    }
  }

  const bytes = await pdfDoc.save();
  return bytes;
}
