import { jsPDF } from 'jspdf';

export const generateMedicalReport = (analysisResult, suggestions = []) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Colors
    const primaryColor = [229, 9, 20]; // Red
    const textColor = [51, 51, 51];
    const grayColor = [128, 128, 128];

    // Helper function to add text
    const addText = (text, x, y, options = {}) => {
        const {
            fontSize = 12,
            fontStyle = 'normal',
            color = textColor,
            align = 'left'
        } = options;

        doc.setFontSize(fontSize);
        doc.setFont('helvetica', fontStyle);
        doc.setTextColor(...color);
        doc.text(text, x, y, { align });
        return y + (fontSize * 0.5);
    };

    // Header with red accent line
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 8, 'F');

    // Logo/Title
    yPos = 25;
    addText('OralScan AI', margin, yPos, { fontSize: 24, fontStyle: 'bold', color: primaryColor });
    yPos += 8;
    addText('Oral Lesion Analysis Report', margin, yPos, { fontSize: 14, color: grayColor });

    // Report metadata
    yPos += 15;
    doc.setDrawColor(...grayColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 10;
    const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    addText(`Report Generated: ${reportDate}`, margin, yPos, { fontSize: 10, color: grayColor });
    addText(`Report ID: ORL-${Date.now().toString(36).toUpperCase()}`, pageWidth - margin, yPos, { fontSize: 10, color: grayColor, align: 'right' });

    // Analysis Results Section
    yPos += 20;
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, yPos - 5, pageWidth - (margin * 2), 50, 3, 3, 'F');

    yPos += 5;
    addText('ANALYSIS RESULTS', margin + 10, yPos, { fontSize: 12, fontStyle: 'bold', color: primaryColor });

    // Level 1 Result
    yPos += 12;
    const level1Result = analysisResult.level1?.is_healthy ? 'Healthy' : 'Unhealthy';
    const level1Color = analysisResult.level1?.is_healthy ? [70, 211, 105] : [255, 71, 87];
    addText('Level 1 Classification:', margin + 10, yPos, { fontSize: 11, fontStyle: 'bold' });
    addText(level1Result, margin + 80, yPos, { fontSize: 11, fontStyle: 'bold', color: level1Color });
    addText(`(${analysisResult.level1?.confidence?.toFixed(1) || 0}% confidence)`, margin + 110, yPos, { fontSize: 10, color: grayColor });

    // Level 2 Result (if applicable)
    if (analysisResult.level2 && !analysisResult.level2.error) {
        yPos += 10;
        const level2Result = analysisResult.level2.classification === 'malignant' ? 'Malignant' : 'Benign';
        const level2Color = analysisResult.level2.is_malignant ? [255, 71, 87] : [245, 197, 24];
        addText('Level 2 Classification:', margin + 10, yPos, { fontSize: 11, fontStyle: 'bold' });
        addText(level2Result, margin + 80, yPos, { fontSize: 11, fontStyle: 'bold', color: level2Color });
        addText(`(${analysisResult.level2?.confidence?.toFixed(1) || 0}% confidence)`, margin + 110, yPos, { fontSize: 10, color: grayColor });
    }

    // Clinical Summary
    yPos += 30;
    addText('CLINICAL SUMMARY', margin, yPos, { fontSize: 12, fontStyle: 'bold', color: primaryColor });
    yPos += 10;

    let summaryText = '';
    if (analysisResult.level1?.is_healthy) {
        summaryText = 'The AI analysis indicates that the oral tissue appears healthy with no signs of concerning lesions. Regular dental check-ups are recommended to maintain oral health.';
    } else if (analysisResult.level2?.classification === 'malignant') {
        summaryText = 'The AI analysis has detected characteristics that may indicate a potentially malignant lesion. Immediate consultation with an oral surgeon or oncologist is strongly recommended for further evaluation and biopsy.';
    } else {
        summaryText = 'The AI analysis has detected a lesion that appears to be benign (non-cancerous). While likely not serious, professional evaluation by a dental specialist is recommended for confirmation and proper care guidance.';
    }

    const summaryLines = doc.splitTextToSize(summaryText, pageWidth - (margin * 2) - 10);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    doc.text(summaryLines, margin, yPos);
    yPos += summaryLines.length * 5 + 10;

    // AI Recommendations Section
    if (suggestions.length > 0) {
        yPos += 5;
        addText('AI-GENERATED RECOMMENDATIONS', margin, yPos, { fontSize: 12, fontStyle: 'bold', color: primaryColor });
        yPos += 10;

        suggestions.forEach((suggestion, index) => {
            doc.setFillColor(250, 250, 250);
            doc.roundedRect(margin, yPos - 3, pageWidth - (margin * 2), 14, 2, 2, 'F');

            addText(`${index + 1}. ${suggestion.title}`, margin + 5, yPos + 2, { fontSize: 10, fontStyle: 'bold' });
            addText(suggestion.description, margin + 5, yPos + 8, { fontSize: 9, color: grayColor });
            yPos += 18;
        });
    }

    // Disclaimer Section
    yPos = 250;
    doc.setDrawColor(...grayColor);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 8;
    doc.setFillColor(255, 248, 230);
    doc.roundedRect(margin, yPos - 3, pageWidth - (margin * 2), 25, 2, 2, 'F');

    addText('⚠ IMPORTANT DISCLAIMER', margin + 5, yPos + 3, { fontSize: 9, fontStyle: 'bold', color: [180, 130, 0] });
    yPos += 8;
    const disclaimerText = 'This AI analysis is for educational and informational purposes only. It should not be used as a substitute for professional medical diagnosis, advice, or treatment. Always consult with a qualified healthcare provider for proper evaluation of any oral health concerns.';
    const disclaimerLines = doc.splitTextToSize(disclaimerText, pageWidth - (margin * 2) - 10);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(disclaimerLines, margin + 5, yPos + 3);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text('Generated by OralScan AI - Oral Lesion Classification System', pageWidth / 2, 290, { align: 'center' });

    // Download the PDF
    const fileName = `OralScan_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    return fileName;
};

export default { generateMedicalReport };
