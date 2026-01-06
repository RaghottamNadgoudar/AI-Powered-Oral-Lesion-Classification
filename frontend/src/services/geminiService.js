import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.GEMINI_API_KEY;

let genAI = null;

const initializeGemini = () => {
    if (!genAI && API_KEY) {
        genAI = new GoogleGenerativeAI(API_KEY);
    }
    return genAI;
};

export const generateOralHealthSuggestions = async (analysisResult) => {
    console.log('='.repeat(50));
    console.log('🧠 Generating AI Health Suggestions...');
    console.log('='.repeat(50));
    console.log('Analysis Result:', JSON.stringify(analysisResult, null, 2));

    try {
        const ai = initializeGemini();
        if (!ai) {
            console.log('⚠️ Gemini API not initialized (no API key), using default suggestions');
            const defaults = getDefaultSuggestions(analysisResult);
            console.log('Default Suggestions:', JSON.stringify(defaults, null, 2));
            console.log('='.repeat(50));
            return defaults;
        }

        console.log('✅ Gemini API initialized, calling model...');
        const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const resultType = analysisResult.level1?.is_healthy
            ? 'healthy oral tissue'
            : analysisResult.level2?.classification === 'malignant'
                ? 'potentially malignant lesion detected'
                : 'benign lesion detected';

        const confidence = analysisResult.level1?.confidence || 0;

        const prompt = `You are a dental health advisor AI. Based on an oral lesion analysis result showing "${resultType}" with ${confidence.toFixed(1)}% confidence, provide exactly 4 personalized oral health suggestions.

Format your response as a JSON array of 4 objects, each with "title" and "description" keys. Keep descriptions under 60 characters.

Example format:
[
    {"title": "Daily Care", "description": "Brush twice daily with fluoride toothpaste"},
    {"title": "Regular Checkups", "description": "Visit your dentist every 6 months"}
]

Provide practical, actionable advice specific to the analysis result.`;

        console.log('📤 Sending prompt to Gemini...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('📥 Gemini Raw Response:', text);

        // Parse JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const suggestions = JSON.parse(jsonMatch[0]);
            const finalSuggestions = suggestions.slice(0, 4);
            console.log('='.repeat(50));
            console.log('✅ AI Suggestions Generated Successfully:');
            console.log('='.repeat(50));
            finalSuggestions.forEach((s, i) => {
                console.log(`  ${i + 1}. ${s.title}: ${s.description}`);
            });
            console.log('='.repeat(50));
            return finalSuggestions;
        }

        console.log('⚠️ Could not parse JSON from response, using defaults');
        const defaults = getDefaultSuggestions(analysisResult);
        console.log('Default Suggestions:', JSON.stringify(defaults, null, 2));
        console.log('='.repeat(50));
        return defaults;
    } catch (error) {
        console.error('❌ Gemini API error:', error);
        const defaults = getDefaultSuggestions(analysisResult);
        console.log('Using default suggestions:', JSON.stringify(defaults, null, 2));
        console.log('='.repeat(50));
        return defaults;
    }
};

const getDefaultSuggestions = (analysisResult) => {
    if (analysisResult.level1?.is_healthy) {
        return [
            { title: 'Maintain Routine', description: 'Continue your current oral hygiene practices' },
            { title: 'Regular Checkups', description: 'Visit your dentist every 6 months' },
            { title: 'Healthy Diet', description: 'Limit sugary foods and acidic beverages' },
            { title: 'Stay Hydrated', description: 'Drink plenty of water throughout the day' }
        ];
    } else if (analysisResult.level2?.classification === 'malignant') {
        return [
            { title: 'Seek Specialist', description: 'Consult an oral surgeon immediately' },
            { title: 'Document Changes', description: 'Track any changes in the lesion' },
            { title: 'Avoid Irritants', description: 'Stop smoking and limit alcohol' },
            { title: 'Follow Up', description: 'Schedule regular monitoring appointments' }
        ];
    } else {
        return [
            { title: 'Professional Evaluation', description: 'Get examined by a dental professional' },
            { title: 'Monitor Changes', description: 'Watch for size or color changes' },
            { title: 'Gentle Care', description: 'Use a soft toothbrush in the area' },
            { title: 'Stay Informed', description: 'Learn about benign oral conditions' }
        ];
    }
};

export default { generateOralHealthSuggestions };
