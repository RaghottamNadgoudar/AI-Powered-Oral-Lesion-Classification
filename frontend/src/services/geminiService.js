import Groq from 'groq-sdk';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

let groqClient = null;

const initializeGroq = () => {
    if (!groqClient && API_KEY) {
        groqClient = new Groq({
            apiKey: API_KEY,
            dangerouslyAllowBrowser: true // Required for client-side usage
        });
    }
    return groqClient;
};

export const generateOralHealthSuggestions = async (analysisResult) => {
    console.log('='.repeat(50));
    console.log('🧠 Generating AI Health Suggestions with GROQ...');
    console.log('='.repeat(50));
    console.log('Analysis Result:', JSON.stringify(analysisResult, null, 2));

    try {
        const client = initializeGroq();
        if (!client) {
            console.log('⚠️ GROQ API not initialized (no API key), using default suggestions');
            const defaults = getDefaultSuggestions(analysisResult);
            console.log('Default Suggestions:', JSON.stringify(defaults, null, 2));
            console.log('='.repeat(50));
            return defaults;
        }

        console.log('✅ GROQ API initialized, calling Llama 3.3 70B...');

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

        console.log('📤 Sending prompt to GROQ...');

        const chatCompletion = await client.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful dental health advisor AI. Provide practical, actionable oral health suggestions in JSON format."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 500,
        });

        const text = chatCompletion.choices[0]?.message?.content;
        console.log('📥 GROQ Raw Response:', text);

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
        console.error('❌ GROQ API error:', error);
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
