import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface PodcastPDFContent {
  title: string;
  script: Array<{ speaker: "SPEAKER1" | "SPEAKER2"; text: string }>;
  summary: {
    overview: string;
    keyPoints: string[];
    conclusion: string;
  };
  vocabulary?: Array<{
    word: string;
    definition: string;
    context: string;
    example: string;
  }>;
  exercises?: {
    comprehensionQuestions: Array<{
      question: string;
      answer: string;
      type: string;
    }>;
    vocabularyExercises: Array<{
      question: string;
      answer: string;
      type: string;
    }>;
    discussionPrompts: string[];
  };
}

/**
 * Sanitizes text to ensure WinAnsi (Windows-1252) compatibility
 * Removes emojis and characters outside the 0x00-0xFF range
 */
function sanitizeForWinAnsi(text: string): string {
  if (!text) return '';

  return text
    // Remove all emojis and Unicode symbols
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Misc Symbols and Pictographs
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
    .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // Alchemical Symbols
    .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // Geometric Shapes Extended
    .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // Supplemental Arrows-C
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Miscellaneous Symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
    .replace(/[\u{2300}-\u{23FF}]/gu, '')   // Miscellaneous Technical
    .replace(/[\u{2B50}-\u{2B55}]/gu, '')   // Stars
    // Remove any character outside WinAnsi range (0x00-0xFF)
    .replace(/[^\x00-\xFF]/g, '')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Recursively sanitizes all strings in an object
 */
function sanitizeObject<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizeForWinAnsi(obj) as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as T;
  }
  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  return obj;
}

export async function createPodcastPdfBytes(content: PodcastPDFContent) {
  // ✅ CRITICAL: Sanitize ALL content before processing
  const sanitizedContent = sanitizeObject(content);

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const margin = 48;
  const contentWidth = width - margin * 2;
  let y = height - margin;

  // Helper function to check if we need a new page
  function checkPageBreak(requiredSpace: number = 50) {
    if (y - requiredSpace < margin) {
      page = pdfDoc.addPage([595, 842]);
      y = page.getSize().height - margin;
      return true;
    }
    return false;
  }

  // Helper function to wrap text
  function wrapText(text: string, fontToUse: any, size: number, maxWidth: number) {
    const sanitized = sanitizeForWinAnsi(text);
    const words = sanitized.split(/\s+/);
    const lines: string[] = [];
    let current = "";

    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      const testWidth = fontToUse.widthOfTextAtSize(test, size);
      if (testWidth <= maxWidth) {
        current = test;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  // Helper function to draw section header (✅ NO EMOJIS)
  function drawSectionHeader(text: string, withLine: boolean = true) {
    checkPageBreak(60);

    const sanitized = sanitizeForWinAnsi(text);
    page.drawText(sanitized, {
      x: margin,
      y: y - 16,
      size: 16,
      font: fontBold,
      color: rgb(0.2, 0.3, 0.5),
    });
    y -= 20;

    if (withLine) {
      page.drawLine({
        start: { x: margin, y: y },
        end: { x: width - margin, y: y },
        thickness: 2,
        color: rgb(0.2, 0.3, 0.5),
      });
      y -= 15;
    } else {
      y -= 5;
    }
  }

  // Helper function to draw subsection header
  function drawSubsectionHeader(text: string) {
    checkPageBreak(40);

    const sanitized = sanitizeForWinAnsi(text);
    page.drawText(sanitized, {
      x: margin,
      y: y - 12,
      size: 12,
      font: fontBold,
      color: rgb(0.3, 0.3, 0.3),
    });
    y -= 18;
  }

  // Helper function to draw body text
  function drawBodyText(text: string, fontSize: number = 10, useFont: any = font, indent: number = 0) {
    const lines = wrapText(text, useFont, fontSize, contentWidth - indent);

    for (const line of lines) {
      checkPageBreak(20);
      page.drawText(line, {
        x: margin + indent,
        y: y - fontSize,
        size: fontSize,
        font: useFont,
        color: rgb(0, 0, 0),
      });
      y -= fontSize + 4;
    }
  }

  // ========== COVER PAGE ==========
  y = height / 2 + 100;

  const titleLines = wrapText(sanitizedContent.title, fontBold, 24, contentWidth);
  for (const line of titleLines) {
    const titleWidth = fontBold.widthOfTextAtSize(line, 24);
    page.drawText(line, {
      x: (width - titleWidth) / 2,
      y: y,
      size: 24,
      font: fontBold,
      color: rgb(0.1, 0.2, 0.4),
    });
    y -= 30;
  }

  y -= 20;
  const subtitle = "AI Generated Podcast";
  const subtitleWidth = font.widthOfTextAtSize(subtitle, 12);
  page.drawText(subtitle, {
    x: (width - subtitleWidth) / 2,
    y: y,
    size: 12,
    font: fontItalic,
    color: rgb(0.4, 0.4, 0.4),
  });

  y -= 60;
  page.drawLine({
    start: { x: width / 2 - 100, y: y },
    end: { x: width / 2 + 100, y: y },
    thickness: 1,
    color: rgb(0.6, 0.6, 0.6),
  });

  y -= 40;
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const dateWidth = font.widthOfTextAtSize(date, 10);
  page.drawText(date, {
    x: (width - dateWidth) / 2,
    y: y,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // ========== NEW PAGE FOR SCRIPT ==========
  page = pdfDoc.addPage([595, 842]);
  y = page.getSize().height - margin;

  // ✅ FIXED: Removed emoji from section header
  drawSectionHeader("PODCAST SCRIPT");

  // Draw each dialogue turn
  for (let i = 0; i < sanitizedContent.script.length; i++) {
    const item = sanitizedContent.script[i];
    checkPageBreak(60);

    // Speaker label with colored background
    const speakerLabel = item.speaker === "SPEAKER1" ? "Speaker 1" : "Speaker 2";
    const speakerColor = item.speaker === "SPEAKER1"
      ? rgb(0.2, 0.4, 0.8)  // Blue for Speaker 1
      : rgb(0.8, 0.2, 0.3); // Red for Speaker 2

    // Draw speaker name
    page.drawText(speakerLabel + ":", {
      x: margin,
      y: y - 11,
      size: 11,
      font: fontBold,
      color: speakerColor,
    });
    y -= 16;

    // Draw dialogue text with slight indent
    drawBodyText(item.text, 10, font, 15);

    // Add spacing between dialogue turns
    y -= 8;
  }

  // ========== NEW PAGE FOR SUMMARY ==========
  page = pdfDoc.addPage([595, 842]);
  y = page.getSize().height - margin;

  // ✅ FIXED: Removed emoji from section header
  drawSectionHeader("PODCAST SUMMARY");

  // Overview
  drawSubsectionHeader("Overview");
  drawBodyText(sanitizedContent.summary.overview);
  y -= 10;

  // Key Points
  drawSubsectionHeader("Key Points");
  for (let i = 0; i < sanitizedContent.summary.keyPoints.length; i++) {
    checkPageBreak(30);

    // Draw bullet point
    page.drawText("•", {
      x: margin + 5,
      y: y - 10,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Draw key point text
    const lines = wrapText(sanitizedContent.summary.keyPoints[i], font, 10, contentWidth - 25);
    for (const line of lines) {
      checkPageBreak(20);
      page.drawText(line, {
        x: margin + 20,
        y: y - 10,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      y -= 14;
    }
    y -= 4;
  }
  y -= 10;

  // Conclusion
  if (sanitizedContent.summary.conclusion) {
    drawSubsectionHeader("Conclusion");
    drawBodyText(sanitizedContent.summary.conclusion);
    y -= 15;
  }

  // ========== VOCABULARY SECTION (if provided) ==========
  if (sanitizedContent.vocabulary && sanitizedContent.vocabulary.length > 0) {
    checkPageBreak(100);
    drawSectionHeader("VOCABULARY");

    for (let i = 0; i < sanitizedContent.vocabulary.length; i++) {
      const vocab = sanitizedContent.vocabulary[i];
      checkPageBreak(80);

      // Word number and term
      const wordText = sanitizeForWinAnsi(`${i + 1}. ${vocab.word}`);
      page.drawText(wordText, {
        x: margin,
        y: y - 11,
        size: 11,
        font: fontBold,
        color: rgb(0.2, 0.3, 0.5),
      });
      y -= 20; // ✅ INCREASED from 16 to 20

      // Definition
      page.drawText("Definition: ", {
        x: margin + 10,
        y: y - 9,
        size: 9,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      const defX = margin + 10 + fontBold.widthOfTextAtSize("Definition: ", 9) + 2;
      const defLines = wrapText(vocab.definition, font, 9, contentWidth - (defX - margin));

      let firstLine = true;
      for (const line of defLines) {
        checkPageBreak(15);
        page.drawText(line, {
          x: firstLine ? defX : margin + 10,
          y: y - 9,
          size: 9,
          font: font,
          color: rgb(0, 0, 0),
        });
        y -= 14; // ✅ INCREASED from 12 to 14
        firstLine = false;
      }

      y -= 5; // ✅ ADDED: Extra space after definition

      // ===== CONTEXT =====
      const labelContext = "Context: ";
      page.drawText(labelContext, {
        x: margin + 10,
        y: y - 9,
        size: 9,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      // width of "Context: "
      const ctxLabelWidth = fontBold.widthOfTextAtSize(labelContext, 9);

      // draw context text normally
      drawBodyText(vocab.context, 9, fontItalic, (margin + 10) + ctxLabelWidth);

      // underline the context text
      const ctxTextWidth = fontItalic.widthOfTextAtSize(vocab.context, 9);

      page.drawLine({
        start: { x: (margin + 10) + ctxLabelWidth, y: y - 11 },
        end: { x: (margin + 10) + ctxLabelWidth + ctxTextWidth, y: y - 11 },
        thickness: 0.5,
        color: rgb(0, 0, 0),
      });

      y -= 18; // space


      // ===== EXAMPLE =====
      const labelExample = "Example: ";
      page.drawText(labelExample, {
        x: margin + 10,
        y: y - 9,
        size: 9,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      // width of "Example: "
      const exLabelWidth = fontBold.widthOfTextAtSize(labelExample, 9);

      // draw example text
      drawBodyText(vocab.example, 9, font, (margin + 10) + exLabelWidth);

      // underline example text
      const exTextWidth = font.widthOfTextAtSize(vocab.example, 9);

      page.drawLine({
        start: { x: (margin + 10) + exLabelWidth, y: y - 11 },
        end: { x: (margin + 10) + exLabelWidth + exTextWidth, y: y - 11 },
        thickness: 0.5,
        color: rgb(0, 0, 0),
      });

      y -= 18;

    }
  }

  // ========== EXERCISES SECTION (if provided) ==========
  if (sanitizedContent.exercises) {
    checkPageBreak(100);
    // ✅ FIXED: Removed emoji from section header
    drawSectionHeader("EXERCISES");

    // Comprehension Questions
    if (sanitizedContent.exercises.comprehensionQuestions?.length > 0) {
      drawSubsectionHeader("Comprehension Questions");

      for (let i = 0; i < sanitizedContent.exercises.comprehensionQuestions.length; i++) {
        const q = sanitizedContent.exercises.comprehensionQuestions[i];
        checkPageBreak(50);

        const questionText = sanitizeForWinAnsi(`Q${i + 1}. ${q.question}`);
        page.drawText(questionText, {
          x: margin,
          y: y - 10,
          size: 10,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        y -= 14;

        page.drawText(`Type: ${q.type}`, {
          x: margin + 10,
          y: y - 8,
          size: 8,
          font: fontItalic,
          color: rgb(0.4, 0.4, 0.4),
        });
        y -= 12;

        const answerText = sanitizeForWinAnsi(`Answer: ${q.answer}`);
        const answerLines = wrapText(answerText, font, 9, contentWidth - 10);
        for (const line of answerLines) {
          checkPageBreak(15);
          page.drawText(line, {
            x: margin + 10,
            y: y - 9,
            size: 9,
            font: font,
            color: rgb(0.1, 0.5, 0.2),
          });
          y -= 12;
        }
        y -= 4;
      }
      y -= 10;
    }

    // Vocabulary Exercises
    if (sanitizedContent.exercises.vocabularyExercises?.length > 0) {
      drawSubsectionHeader("Vocabulary Exercises");

      for (let i = 0; i < sanitizedContent.exercises.vocabularyExercises.length; i++) {
        const ex = sanitizedContent.exercises.vocabularyExercises[i];
        checkPageBreak(50);

        drawBodyText(`${i + 1}. ${ex.question}`, 10, font, 0);

        const answerText = sanitizeForWinAnsi(`Answer: ${ex.answer}`);
        const answerLines = wrapText(answerText, font, 9, contentWidth - 10);
        for (const line of answerLines) {
          checkPageBreak(15);
          page.drawText(line, {
            x: margin + 10,
            y: y - 9,
            size: 9,
            font: font,
            color: rgb(0.1, 0.5, 0.2),
          });
          y -= 12;
        }
        y -= 4;
      }
      y -= 10;
    }

    // Discussion Prompts
    if (sanitizedContent.exercises.discussionPrompts?.length > 0) {
      drawSubsectionHeader("Discussion Prompts");

      for (let i = 0; i < sanitizedContent.exercises.discussionPrompts.length; i++) {
        checkPageBreak(30);
        drawBodyText(`${i + 1}. ${sanitizedContent.exercises.discussionPrompts[i]}`, 10, font, 0);
        y -= 8;
      }
    }
  }

  // ========== FOOTER ON LAST PAGE ==========
  y = margin + 20;
  const footer = "Generated by Mohamed Elsayed";
  const footerWidth = fontItalic.widthOfTextAtSize(footer, 8);
  page.drawText(footer, {
    x: (width - footerWidth) / 2,
    y: y,
    size: 8,
    font: fontItalic,
    color: rgb(0.6, 0.6, 0.6),
  });

  const bytes = await pdfDoc.save();
  return bytes;
}



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