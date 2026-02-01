"""
CLIP Model Training and Evaluation Script for Oral Lesion Classification
This script fine-tunes CLIP on oral lesion images and prints comprehensive evaluation metrics
"""

import os
import torch
import numpy as np
from PIL import Image
from torch.utils.data import Dataset, DataLoader, random_split
from transformers import CLIPProcessor, CLIPModel
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    roc_auc_score,
    roc_curve
)
import matplotlib.pyplot as plt
from tqdm import tqdm

# ========================
# CONFIGURATION
# ========================
DATA_DIR = r"C:\Users\PRANEEL K.A\Desktop\Oral lesion\oral health\AI-Powered-Oral-Lesion-Classification\CLIP\dataset"  # UPDATE THIS PATH
# Expected structure:
# dataset/
#   healthy/
#     img1.jpg
#     img2.jpg
#   unhealthy/
#     img1.jpg
#     img2.jpg

BATCH_SIZE = 16
EPOCHS = 10
LEARNING_RATE = 1e-5
TRAIN_SPLIT = 0.8
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Classification labels for CLIP
LABELS = [
    "a photo of healthy normal oral tissue, pink tongue, no lesions",
    "a photo of unhealthy diseased oral tissue with cancer, tumor, white patches, or lesions"
]


# ========================
# DATASET CLASS
# ========================
class OralLesionDataset(Dataset):
    def __init__(self, data_dir, processor):
        self.processor = processor
        self.images = []
        self.labels = []
        
        # Load healthy images (label = 0)
        healthy_dir = os.path.join(data_dir, "healthy")
        if os.path.exists(healthy_dir):
            for img_name in os.listdir(healthy_dir):
                if img_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                    self.images.append(os.path.join(healthy_dir, img_name))
                    self.labels.append(0)
        
        # Load unhealthy images (label = 1)
        unhealthy_dir = os.path.join(data_dir, "unhealthy")
        if os.path.exists(unhealthy_dir):
            for img_name in os.listdir(unhealthy_dir):
                if img_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                    self.images.append(os.path.join(unhealthy_dir, img_name))
                    self.labels.append(1)
        
        print(f"Dataset loaded: {len(self.images)} images")
        print(f"  - Healthy: {self.labels.count(0)}")
        print(f"  - Unhealthy: {self.labels.count(1)}")
    
    def __len__(self):
        return len(self.images)
    
    def __getitem__(self, idx):
        try:
            image = Image.open(self.images[idx]).convert("RGB")
            label = self.labels[idx]
            
            # Process image ONLY
            inputs = self.processor(
                images=image,
                return_tensors="pt"
            )
            
            # Get pixel values and remove batch dim (1, 3, 224, 224) -> (3, 224, 224)
            pixel_values = inputs['pixel_values'].squeeze(0)
            
            return pixel_values, label
        except Exception as e:
            print(f"Error loading image {self.images[idx]}: {e}")
            # Return a dummy tensor or handle skip (simple retry strategy not implemented here for brevity)
            # Returning None might break default_collate, so we'll just crash/noise here but let's hope data is good
            raise e


# ========================
# TRAINING FUNCTION
# ========================
def train_model(model, train_loader, optimizer, epoch, text_inputs):
    model.train()
    total_loss = 0
    correct = 0
    total = 0
    
    # Unpack text inputs once
    input_ids = text_inputs['input_ids']
    attention_mask = text_inputs['attention_mask']
    
    pbar = tqdm(train_loader, desc=f"Epoch {epoch+1} [Train]")
    for pixel_values, labels in pbar:
        # Move to device
        labels = torch.tensor(labels).to(DEVICE)
        pixel_values = pixel_values.to(DEVICE)
        
        optimizer.zero_grad()
        
        # Forward pass with static text inputs and batch images
        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask,
            pixel_values=pixel_values
        )
        
        # Get logits and compute loss
        logits = outputs.logits_per_image # Shape: (batch_size, 2)
        loss = torch.nn.functional.cross_entropy(logits, labels)
        
        loss.backward()
        optimizer.step()
        
        total_loss += loss.item()
        predictions = logits.argmax(dim=1)
        correct += (predictions == labels).sum().item()
        total += labels.size(0)
        
        pbar.set_postfix({'loss': f'{loss.item():.4f}', 'acc': f'{100*correct/total:.2f}%'})
    
    return total_loss / len(train_loader), correct / total


# ========================
# EVALUATION FUNCTION
# ========================
def evaluate_model(model, test_loader, text_inputs):
    model.eval()
    all_preds = []
    all_labels = []
    all_probs = []
    
    # Unpack text inputs once
    input_ids = text_inputs['input_ids']
    attention_mask = text_inputs['attention_mask']
    
    with torch.no_grad():
        pbar = tqdm(test_loader, desc="Evaluating")
        for pixel_values, labels in pbar:
            pixel_values = pixel_values.to(DEVICE)
            
            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask,
                pixel_values=pixel_values
            )
            
            logits = outputs.logits_per_image
            probs = torch.softmax(logits, dim=1)
            predictions = logits.argmax(dim=1)
            
            all_preds.extend(predictions.cpu().numpy())
            all_labels.extend(labels.numpy())
            all_probs.extend(probs[:, 1].cpu().numpy())  # Probability of unhealthy class
    
    return np.array(all_preds), np.array(all_labels), np.array(all_probs)


# ========================
# METRICS PRINTING FUNCTION
# ========================
def print_evaluation_metrics(y_true, y_pred, y_probs):
    """Print comprehensive evaluation metrics after training"""
    
    print("\n" + "="*60)
    print("           EVALUATION METRICS AFTER TRAINING")
    print("="*60)
    
    # Basic metrics
    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred, average='binary')
    recall = recall_score(y_true, y_pred, average='binary')
    f1 = f1_score(y_true, y_pred, average='binary')
    
    print(f"\n📊 BASIC METRICS:")
    print(f"   ├── Accuracy:  {accuracy*100:.2f}%")
    print(f"   ├── Precision: {precision*100:.2f}%")
    print(f"   ├── Recall:    {recall*100:.2f}%")
    print(f"   └── F1-Score:  {f1*100:.2f}%")
    
    # Confusion Matrix
    cm = confusion_matrix(y_true, y_pred)
    print(f"\n📋 CONFUSION MATRIX:")
    print(f"                  Predicted")
    print(f"                  Healthy  Unhealthy")
    print(f"   Actual Healthy    {cm[0][0]:4d}     {cm[0][1]:4d}")
    print(f"   Actual Unhealthy  {cm[1][0]:4d}     {cm[1][1]:4d}")
    
    # True Positives, True Negatives, False Positives, False Negatives
    TN, FP, FN, TP = cm.ravel()
    print(f"\n   Details:")
    print(f"   ├── True Positives (TP):  {TP}")
    print(f"   ├── True Negatives (TN):  {TN}")
    print(f"   ├── False Positives (FP): {FP}")
    print(f"   └── False Negatives (FN): {FN}")
    
    # Sensitivity and Specificity
    sensitivity = TP / (TP + FN) if (TP + FN) > 0 else 0
    specificity = TN / (TN + FP) if (TN + FP) > 0 else 0
    print(f"\n🔬 CLINICAL METRICS:")
    print(f"   ├── Sensitivity (TPR): {sensitivity*100:.2f}%")
    print(f"   └── Specificity (TNR): {specificity*100:.2f}%")
    
    # AUC-ROC Score
    try:
        if len(np.unique(y_true)) > 1:
            auc_roc = roc_auc_score(y_true, y_probs)
            print(f"\n📈 AUC-ROC Score: {auc_roc:.4f}")
        else:
            print(f"\n📈 AUC-ROC Score: N/A (Only one class present in test set)")
            auc_roc = None
    except Exception as e:
        print(f"\n📈 AUC-ROC Score: Could not calculate ({e})")
        auc_roc = None
    
    # Full Classification Report
    print(f"\n📄 CLASSIFICATION REPORT:")
    print(classification_report(y_true, y_pred, target_names=['Healthy', 'Unhealthy']))
    
    print("="*60)
    
    # Return metrics as dictionary
    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1,
        'sensitivity': sensitivity,
        'specificity': specificity,
        'auc_roc': auc_roc,
        'confusion_matrix': cm
    }


# ========================
# PLOT ROC CURVE
# ========================
def plot_roc_curve(y_true, y_probs, save_path="roc_curve.png"):
    """Plot and save ROC curve"""
    try:
        if len(np.unique(y_true)) < 2:
            print("Skipping ROC plot: Single class in test data")
            return
            
        fpr, tpr, thresholds = roc_curve(y_true, y_probs)
        auc_score = roc_auc_score(y_true, y_probs)
        
        plt.figure(figsize=(8, 6))
        plt.plot(fpr, tpr, 'b-', linewidth=2, label=f'ROC Curve (AUC = {auc_score:.4f})')
        plt.plot([0, 1], [0, 1], 'r--', linewidth=1, label='Random Classifier')
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.xlabel('False Positive Rate', fontsize=12)
        plt.ylabel('True Positive Rate', fontsize=12)
        plt.title('ROC Curve - Oral Lesion Classification', fontsize=14)
        plt.legend(loc='lower right')
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.savefig(save_path, dpi=150)
        print(f"\n📊 ROC curve saved to: {save_path}")
        plt.close()
    except Exception as e:
        print(f"Error plotting ROC: {e}")


# ========================
# PLOT CONFUSION MATRIX
# ========================
def plot_confusion_matrix(cm, save_path="confusion_matrix.png"):
    """Plot and save confusion matrix"""
    plt.figure(figsize=(8, 6))
    plt.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    plt.title('Confusion Matrix', fontsize=14)
    plt.colorbar()
    
    classes = ['Healthy', 'Unhealthy']
    tick_marks = np.arange(len(classes))
    plt.xticks(tick_marks, classes)
    plt.yticks(tick_marks, classes)
    
    # Add text annotations
    thresh = cm.max() / 2
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            plt.text(j, i, format(cm[i, j], 'd'),
                    ha="center", va="center",
                    color="white" if cm[i, j] > thresh else "black",
                    fontsize=16)
    
    plt.ylabel('True Label', fontsize=12)
    plt.xlabel('Predicted Label', fontsize=12)
    plt.tight_layout()
    plt.savefig(save_path, dpi=150)
    print(f"📊 Confusion matrix saved to: {save_path}")
    plt.close()


# ========================
# MAIN FUNCTION
# ========================
def main():
    print("="*60)
    print("    CLIP Model Training for Oral Lesion Classification")
    print("="*60)
    
    # Check if data directory exists
    if not os.path.exists(DATA_DIR):
        print(f"\n❌ ERROR: Data directory not found: {DATA_DIR}")
        print("Please update DATA_DIR at the top of this script to point to your dataset.")
        return
    
    print(f"\n🖥️  Device: {DEVICE}")
    
    # Load CLIP model and processor
    print("\n📥 Loading CLIP model...")
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    model = model.to(DEVICE)
    
    # Create dataset
    print("\n📂 Loading dataset...")
    try:
        dataset = OralLesionDataset(DATA_DIR, processor)
    except Exception as e:
        print(f"Error initializing dataset: {e}")
        return
    
    if len(dataset) == 0:
        print("❌ ERROR: No images found in the dataset directory!")
        return
    
    # Split into train and test
    train_size = int(TRAIN_SPLIT * len(dataset))
    test_size = len(dataset) - train_size
    train_dataset, test_dataset = random_split(dataset, [train_size, test_size])
    
    print(f"\n📊 Dataset Split:")
    print(f"   ├── Training:   {train_size} images")
    print(f"   └── Testing:    {test_size} images")
    
    # Create data loaders (Use default collation now)
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False)
    
    # Prepare static text inputs for the class labels
    print("\n📝 Preparing text labels...")
    text_inputs = processor(
        text=LABELS,
        return_tensors="pt",
        padding=True
    )
    # Move text inputs to device
    for key in text_inputs:
        text_inputs[key] = text_inputs[key].to(DEVICE)
        
    # Optimizer
    optimizer = torch.optim.AdamW(model.parameters(), lr=LEARNING_RATE)
    
    # Training loop
    print(f"\n🚀 Starting training for {EPOCHS} epochs...")
    train_losses = []
    train_accs = []
    
    for epoch in range(EPOCHS):
        loss, acc = train_model(model, train_loader, optimizer, epoch, text_inputs)
        train_losses.append(loss)
        train_accs.append(acc)
        print(f"   Epoch {epoch+1}/{EPOCHS}: Loss = {loss:.4f}, Accuracy = {acc*100:.2f}%")
    
    # Save model
    model_save_path = "clip_oral_lesion_model.pt"
    torch.save(model.state_dict(), model_save_path)
    print(f"\n💾 Model saved to: {model_save_path}")
    
    # Evaluate model
    print("\n🔍 Evaluating model on test set...")
    try:
        y_pred, y_true, y_probs = evaluate_model(model, test_loader, text_inputs)
        
        # Print evaluation metrics
        metrics = print_evaluation_metrics(y_true, y_pred, y_probs)
        
        # Plot and save visualizations
        plot_roc_curve(y_true, y_probs, "roc_curve.png")
        plot_confusion_matrix(metrics['confusion_matrix'], "confusion_matrix.png")
    except Exception as e:
        print(f"⚠️ Error during evaluation: {e}")
    
    # Plot training curves
    try:
        plt.figure(figsize=(12, 4))
        
        plt.subplot(1, 2, 1)
        plt.plot(range(1, EPOCHS+1), train_losses, 'b-', marker='o')
        plt.xlabel('Epoch')
        plt.ylabel('Loss')
        plt.title('Training Loss')
        plt.grid(True, alpha=0.3)
        
        plt.subplot(1, 2, 2)
        plt.plot(range(1, EPOCHS+1), [acc*100 for acc in train_accs], 'g-', marker='o')
        plt.xlabel('Epoch')
        plt.ylabel('Accuracy (%)')
        plt.title('Training Accuracy')
        plt.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig("training_curves.png", dpi=150)
        print("📊 Training curves saved to: training_curves.png")
        plt.close()
    except Exception as e:
        print(f"Could not save training curves: {e}")
    
    print("\n✅ Training and evaluation complete!")
    print("="*60)


if __name__ == "__main__":
    main()
