"""
Telegram Bot for Oral Lesion Classification
Conversational flow: Collect user info -> Analyze image
"""

import os
import io
import logging
import tempfile
from typing import Optional
from dotenv import load_dotenv

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardRemove
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    ContextTypes,
    filters,
    ConversationHandler
)

from PIL import Image
from gradio_client import Client, handle_file
from groq import Groq
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Environment variables
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
HF_CLIP_SPACE = os.getenv('HF_CLIP_SPACE', 'Praneel12/oral-health-classifier')
HF_TFLITE_SPACE = os.getenv('HF_TFLITE_SPACE', 'Praneel12/oral-lesion-tflite')

# Conversation states
(
    ASKING_NAME,
    ASKING_AGE,
    ASKING_SYMPTOMS,
    ASKING_DURATION,
    CONFIRMING_ANALYSIS,
    WAITING_FOR_IMAGE
) = range(6)

# Initialize GROQ client
groq_client = Groq(api_key=GROQ_API_KEY)

# Initialize HuggingFace clients
clip_client = None
tflite_client = None

def init_clients():
    global clip_client, tflite_client
    try:
        logger.info(f"Connecting to CLIP Space: {HF_CLIP_SPACE}")
        clip_client = Client(HF_CLIP_SPACE)
        logger.info("CLIP client connected!")
    except Exception as e:
        logger.error(f"Failed to connect to CLIP Space: {e}")
    
    try:
        logger.info(f"Connecting to TFLite Space: {HF_TFLITE_SPACE}")
        tflite_client = Client(HF_TFLITE_SPACE)
        logger.info("TFLite client connected!")
    except Exception as e:
        logger.error(f"Failed to connect to TFLite Space: {e}")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Start the conversation and ask for user's name"""
    
    # Clear any previous user data
    context.user_data.clear()
    
    await update.message.reply_text(
        "🔬 *Welcome to Oral Lesion Classifier Bot!*\n\n"
        "I'm here to help you analyze oral lesions using AI technology.\n\n"
        "Before we begin, I'd like to know a bit about you.\n\n"
        "👤 *What's your name?*",
        parse_mode='Markdown'
    )
    
    return ASKING_NAME

async def ask_name(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Store the name and ask for age"""
    
    name = update.message.text.strip()
    context.user_data['name'] = name
    
    await update.message.reply_text(
        f"Nice to meet you, *{name}*! 👋\n\n"
        "📅 *How old are you?*\n\n"
        "(Just type your age in years)",
        parse_mode='Markdown'
    )
    
    return ASKING_AGE

async def ask_age(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Store age and ask about symptoms"""
    
    age_text = update.message.text.strip()
    
    # Try to parse age
    try:
        age = int(age_text)
        if age < 1 or age > 120:
            await update.message.reply_text("Please enter a valid age (1-120):")
            return ASKING_AGE
        context.user_data['age'] = age
    except ValueError:
        await update.message.reply_text("Please enter your age as a number:")
        return ASKING_AGE
    
    name = context.user_data.get('name', 'there')
    
    await update.message.reply_text(
        f"Thanks, {name}! 📝\n\n"
        "🤔 *Can you describe the symptoms or concerns you have?*\n\n"
        "For example:\n"
        "• Pain or discomfort\n"
        "• Color changes\n"
        "• Swelling\n"
        "• Any other concerns",
        parse_mode='Markdown'
    )
    
    return ASKING_SYMPTOMS

async def ask_symptoms(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Store symptoms and ask about duration"""
    
    symptoms = update.message.text.strip()
    context.user_data['symptoms'] = symptoms
    
    await update.message.reply_text(
        "Thank you for sharing that. 🙏\n\n"
        "⏱ *How long have you noticed this issue?*\n\n"
        "For example: 'A few days', '2 weeks', '1 month', etc.",
        parse_mode='Markdown'
    )
    
    return ASKING_DURATION

async def ask_duration(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Store duration and confirm before analysis"""
    
    duration = update.message.text.strip()
    context.user_data['duration'] = duration
    
    # Show summary and ask for confirmation
    name = context.user_data.get('name', 'User')
    age = context.user_data.get('age', 'N/A')
    symptoms = context.user_data.get('symptoms', 'N/A')
    
    keyboard = [
        [InlineKeyboardButton("✅ Yes, proceed", callback_data='confirm_analysis')],
        [InlineKeyboardButton("🔄 Start over", callback_data='restart')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        f"📋 *Here's what I know about you:*\n\n"
        f"👤 Name: {name}\n"
        f"📅 Age: {age} years\n"
        f"🤒 Symptoms: {symptoms}\n"
        f"⏱ Duration: {duration}\n\n"
        f"*Would you like to proceed with the image analysis?*\n\n"
        f"⚠️ _Remember: This is for educational purposes only. "
        f"Always consult a healthcare professional._",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )
    
    return CONFIRMING_ANALYSIS

async def confirm_analysis(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle confirmation and ask for image"""
    
    query = update.callback_query
    await query.answer()
    
    if query.data == 'restart':
        await query.edit_message_text(
            "Let's start over! 🔄\n\n"
            "👤 *What's your name?*",
            parse_mode='Markdown'
        )
        context.user_data.clear()
        return ASKING_NAME
    
    # User confirmed, ask for image with detailed guide
    name = context.user_data.get('name', 'there')
    
    await query.edit_message_text(
        f"Great, {name}! 📸\n\n"
        "*📷 HOW TO TAKE A GOOD PHOTO:*\n\n"
        "*Step 1: Prepare*\n"
        "• Find a well-lit area (natural light is best)\n"
        "• Clean your phone camera lens\n\n"
        "*Step 2: Position*\n"
        "• Open your mouth wide\n"
        "• Use a mirror to see the affected area\n"
        "• Hold phone 10-15 cm (4-6 inches) away\n\n"
        "*Step 3: Capture*\n"
        "• Tap to focus on the lesion area\n"
        "• Keep your hand steady\n"
        "• Take multiple photos, send the clearest one\n\n"
        "*💡 Tips:*\n"
        "• Use rear camera (better quality)\n"
        "• Avoid flash (causes glare)\n"
        "• Ask someone to help if needed\n\n"
        "_Send the image when you're ready..._",
        parse_mode='Markdown'
    )
    
    return WAITING_FOR_IMAGE

async def handle_image(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle image upload and classify"""
    
    name = context.user_data.get('name', 'there')
    
    processing_msg = await update.message.reply_text(
        f"Thanks, {name}! 🔄\n\n"
        "*Analyzing your image...*\n"
        "This may take 30-60 seconds.",
        parse_mode='Markdown'
    )
    
    try:
        # Download image
        photo = update.message.photo[-1]
        photo_file = await photo.get_file()
        image_bytes = await photo_file.download_as_bytearray()
        
        # Save to temp file
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp:
            tmp.write(bytes(image_bytes))
            tmp_path = tmp.name
        
        try:
            # Level 1: Healthy/Unhealthy
            await processing_msg.edit_text(
                "🔄 *Step 1 of 3:* Checking healthy/unhealthy...",
                parse_mode='Markdown'
            )
            
            level1_result = None
            is_healthy = False
            
            if clip_client:
                try:
                    result = clip_client.predict(image=handle_file(tmp_path), api_name="/classify_image")
                    logger.info(f"CLIP result: {result}")
                    
                    import re
                    if isinstance(result, (list, tuple)) and len(result) >= 3:
                        percentages = result[2]
                        healthy_match = re.search(r'([\d.]+)%\s*healthy', percentages, re.IGNORECASE)
                        unhealthy_match = re.search(r'([\d.]+)%\s*unhealthy', percentages, re.IGNORECASE)
                        
                        healthy_conf = float(healthy_match.group(1)) if healthy_match else 50
                        unhealthy_conf = float(unhealthy_match.group(1)) if unhealthy_match else 50
                        
                        is_healthy = healthy_conf > unhealthy_conf
                        level1_result = {
                            'classification': 'healthy' if is_healthy else 'unhealthy',
                            'confidence': healthy_conf if is_healthy else unhealthy_conf
                        }
                except Exception as e:
                    logger.error(f"CLIP error: {e}")
                    level1_result = {'classification': 'unhealthy', 'confidence': 50}
            
            # Level 2: Benign/Malignant (if unhealthy)
            level2_result = None
            if not is_healthy and tflite_client:
                await processing_msg.edit_text(
                    "🔄 *Step 2 of 3:* Checking benign/malignant...",
                    parse_mode='Markdown'
                )
                
                try:
                    result = tflite_client.predict(handle_file(tmp_path), api_name="/predict")
                    logger.info(f"TFLite result: {result}")
                    
                    if isinstance(result, (list, tuple)) and len(result) >= 2:
                        result_text = result[0]
                        classification = 'malignant' if 'MALIGNANT' in result_text.upper() else 'benign'
                        
                        import re
                        conf_match = re.search(r'Confidence:\s*([\d.]+)', result_text)
                        confidence = float(conf_match.group(1)) if conf_match else 50
                        
                        level2_result = {
                            'classification': classification,
                            'confidence': confidence,
                            'is_malignant': classification == 'malignant'
                        }
                except Exception as e:
                    logger.error(f"TFLite error: {e}")
            
            # Generate AI suggestions
            await processing_msg.edit_text(
                "🔄 *Step 3 of 3:* Generating personalized suggestions...",
                parse_mode='Markdown'
            )
            suggestions = await generate_suggestions(context.user_data, level1_result, level2_result)
            
            # Format and send results
            result_message = format_results(context.user_data, level1_result, level2_result, suggestions)
            await processing_msg.edit_text(result_message, parse_mode='Markdown')
            
            # Store results for PDF
            context.user_data['level1_result'] = level1_result
            context.user_data['level2_result'] = level2_result
            context.user_data['suggestions'] = suggestions
            
            # Generate PDF report
            await update.message.reply_text("📄 *Generating your PDF report...*", parse_mode='Markdown')
            
            try:
                pdf_path = generate_pdf_report(context.user_data, level1_result, level2_result, suggestions)
                
                # Send PDF file
                name = context.user_data.get('name', 'Patient')
                report_filename = f"Oral_Lesion_Report_{name.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.pdf"
                
                with open(pdf_path, 'rb') as pdf_file:
                    await update.message.reply_document(
                        document=pdf_file,
                        filename=report_filename,
                        caption="📋 *Your Oral Lesion Analysis Report*\n\nKeep this for your records and share with your healthcare provider.",
                        parse_mode='Markdown'
                    )
                
                # Clean up PDF
                os.unlink(pdf_path)
                
            except Exception as pdf_error:
                logger.error(f"PDF generation error: {pdf_error}")
                await update.message.reply_text(
                    "⚠️ Could not generate PDF report, but your results are shown above.",
                    parse_mode='Markdown'
                )
            
            # Next action buttons
            keyboard = [
                [InlineKeyboardButton("📸 Analyze Another", callback_data='new_analysis')],
                [InlineKeyboardButton("🏠 Start Over", callback_data='restart')]
            ]
            await update.message.reply_text(
                "What would you like to do next?",
                reply_markup=InlineKeyboardMarkup(keyboard)
            )
            
        finally:
            os.unlink(tmp_path)
        
        return ConversationHandler.END
        
    except Exception as e:
        logger.error(f"Error: {e}")
        await processing_msg.edit_text(
            f"❌ *Error occurred:* {str(e)}\n\n"
            "Please try again.",
            parse_mode='Markdown'
        )
        return ConversationHandler.END

async def generate_suggestions(user_data: dict, level1, level2) -> str:
    """Generate personalized AI suggestions using GROQ"""
    try:
        name = user_data.get('name', 'User')
        age = user_data.get('age', 'unknown')
        symptoms = user_data.get('symptoms', 'not specified')
        duration = user_data.get('duration', 'not specified')
        
        l1_class = level1.get('classification', 'unknown') if level1 else 'unknown'
        l2_class = level2.get('classification', 'N/A') if level2 else 'N/A'
        
        prompt = f"""Based on this patient information and oral lesion classification, provide personalized health suggestions:

Patient: {name}, Age: {age}
Symptoms: {symptoms}
Duration: {duration}
Level 1 Classification: {l1_class}
Level 2 Classification: {l2_class}

Provide 3-4 personalized, brief health suggestions (1-2 sentences each). 
Consider their age and symptoms. Focus on practical advice and when to see a doctor."""
        
        response = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful medical AI assistant. Be caring and professional."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=400,
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"GROQ error: {e}")
        return "• Maintain good oral hygiene\n• Consult a dentist for proper evaluation\n• Monitor for any changes"

def format_results(user_data: dict, level1, level2, suggestions) -> str:
    """Format classification results with personalization"""
    
    name = user_data.get('name', 'there')
    
    msg = f"📊 *Analysis Results for {name}*\n\n"
    
    # Level 1
    if level1:
        l1_class = level1.get('classification', 'Unknown').upper()
        l1_conf = level1.get('confidence', 0)
        emoji = "✅" if l1_class == 'HEALTHY' else "⚠️"
        msg += f"*Level 1 - Initial Screening:*\n{emoji} {l1_class} ({l1_conf:.1f}% confidence)\n\n"
    
    # Level 2
    if level2:
        l2_class = level2.get('classification', 'Unknown').upper()
        l2_conf = level2.get('confidence', 0)
        emoji = "🔴" if l2_class == 'MALIGNANT' else "🟡"
        msg += f"*Level 2 - Detailed Analysis:*\n{emoji} {l2_class} ({l2_conf:.1f}% confidence)\n\n"
    
    msg += f"*🤖 Personalized Suggestions:*\n{suggestions}\n\n"
    msg += "━━━━━━━━━━━━━━━━━━\n"
    msg += "⚠️ _This is for educational purposes only._\n"
    msg += "_Always consult qualified healthcare professionals._"
    
    return msg

def generate_pdf_report(user_data: dict, level1, level2, suggestions) -> str:
    """Generate a PDF report and return the file path"""
    
    # Create temp file for PDF
    pdf_path = tempfile.mktemp(suffix='.pdf')
    
    # Create document
    doc = SimpleDocTemplate(pdf_path, pagesize=letter, 
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=72)
    
    # Get styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=20,
        alignment=TA_CENTER,
        spaceAfter=30
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#2E86AB'),
        spaceAfter=10
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=8
    )
    
    # Build content
    content = []
    
    # Title
    content.append(Paragraph("🔬 Oral Lesion Analysis Report", title_style))
    content.append(Spacer(1, 10))
    
    # Date
    report_date = datetime.now().strftime("%B %d, %Y at %I:%M %p")
    content.append(Paragraph(f"<b>Report Generated:</b> {report_date}", normal_style))
    content.append(Spacer(1, 20))
    
    # Patient Information
    content.append(Paragraph("📋 Patient Information", heading_style))
    
    name = user_data.get('name', 'N/A')
    age = user_data.get('age', 'N/A')
    symptoms = user_data.get('symptoms', 'N/A')
    duration = user_data.get('duration', 'N/A')
    
    patient_data = [
        ['Name:', name],
        ['Age:', f"{age} years"],
        ['Symptoms:', symptoms],
        ['Duration:', duration]
    ]
    
    patient_table = Table(patient_data, colWidths=[1.5*inch, 4.5*inch])
    patient_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    content.append(patient_table)
    content.append(Spacer(1, 20))
    
    # Classification Results
    content.append(Paragraph("🔍 Classification Results", heading_style))
    
    results_data = []
    
    if level1:
        l1_class = level1.get('classification', 'Unknown').upper()
        l1_conf = level1.get('confidence', 0)
        status = "✅ HEALTHY" if l1_class == 'HEALTHY' else "⚠️ UNHEALTHY"
        results_data.append(['Level 1 (Screening):', f"{status} - {l1_conf:.1f}% confidence"])
    
    if level2:
        l2_class = level2.get('classification', 'Unknown').upper()
        l2_conf = level2.get('confidence', 0)
        status = "🔴 MALIGNANT" if l2_class == 'MALIGNANT' else "🟡 BENIGN"
        results_data.append(['Level 2 (Detailed):', f"{status} - {l2_conf:.1f}% confidence"])
    
    if results_data:
        results_table = Table(results_data, colWidths=[1.8*inch, 4.2*inch])
        results_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        content.append(results_table)
    
    content.append(Spacer(1, 20))
    
    # AI Suggestions
    content.append(Paragraph("🤖 AI Health Suggestions", heading_style))
    
    # Clean up suggestions for PDF
    suggestions_clean = suggestions.replace('•', '-').replace('*', '')
    for line in suggestions_clean.split('\n'):
        if line.strip():
            content.append(Paragraph(line.strip(), normal_style))
    
    content.append(Spacer(1, 30))
    
    # Disclaimer
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#666666'),
        alignment=TA_CENTER
    )
    
    content.append(Paragraph("━" * 60, disclaimer_style))
    content.append(Spacer(1, 10))
    content.append(Paragraph(
        "<b>⚠️ IMPORTANT DISCLAIMER</b>", 
        ParagraphStyle('DisclaimerBold', parent=disclaimer_style, fontSize=10)
    ))
    content.append(Paragraph(
        "This report is generated by an AI system for educational purposes only. "
        "It should NOT be used as a substitute for professional medical diagnosis. "
        "Please consult qualified healthcare professionals for proper evaluation and treatment.",
        disclaimer_style
    ))
    content.append(Spacer(1, 10))
    content.append(Paragraph(
        "Powered by Oral Lesion Classifier Bot | HuggingFace + GROQ AI",
        disclaimer_style
    ))
    
    # Build PDF
    doc.build(content)
    
    return pdf_path

async def new_analysis(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle request for new analysis (keep user data)"""
    query = update.callback_query
    await query.answer()
    
    name = context.user_data.get('name', 'there')
    
    await query.edit_message_text(
        f"📸 *Ready for another analysis, {name}!*\n\n"
        "Send me another image to analyze.",
        parse_mode='Markdown'
    )
    
    return WAITING_FOR_IMAGE

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Cancel the conversation"""
    context.user_data.clear()
    await update.message.reply_text(
        "Conversation cancelled. Send /start to begin again.",
        reply_markup=ReplyKeyboardRemove()
    )
    return ConversationHandler.END

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Display help information"""
    await update.message.reply_text(
        "*Commands:*\n"
        "/start - Start analysis\n"
        "/help - Show help\n"
        "/cancel - Cancel current operation\n\n"
        "*How It Works:*\n"
        "1. Tell me about yourself\n"
        "2. Send an image of the lesion\n"
        "3. Receive AI-powered analysis\n\n"
        "⚠️ _For educational purposes only!_",
        parse_mode='Markdown'
    )

def main():
    if not TELEGRAM_BOT_TOKEN:
        print("ERROR: TELEGRAM_BOT_TOKEN not set!")
        return
    
    init_clients()
    
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    # Conversation handler with multiple states
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('start', start)],
        states={
            ASKING_NAME: [MessageHandler(filters.TEXT & ~filters.COMMAND, ask_name)],
            ASKING_AGE: [MessageHandler(filters.TEXT & ~filters.COMMAND, ask_age)],
            ASKING_SYMPTOMS: [MessageHandler(filters.TEXT & ~filters.COMMAND, ask_symptoms)],
            ASKING_DURATION: [MessageHandler(filters.TEXT & ~filters.COMMAND, ask_duration)],
            CONFIRMING_ANALYSIS: [CallbackQueryHandler(confirm_analysis)],
            WAITING_FOR_IMAGE: [
                MessageHandler(filters.PHOTO, handle_image),
                CallbackQueryHandler(new_analysis, pattern='^new_analysis$')
            ],
        },
        fallbacks=[
            CommandHandler('cancel', cancel),
            CallbackQueryHandler(lambda u, c: start(u.callback_query, c) if u.callback_query.data == 'restart' else None, pattern='^restart$')
        ],
    )
    
    application.add_handler(conv_handler)
    application.add_handler(CommandHandler('help', help_command))
    
    logger.info("Bot starting...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
