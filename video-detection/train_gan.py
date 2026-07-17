import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader, random_split
from tqdm import tqdm

# ===========================
# CONFIGURATION
# ===========================
real_dir = r"A:\Deepfake\deepfake detectors\optical_flow\real"
fake_dir = r"A:\Deepfake\deepfake detectors\optical_flow\fake"
model_save_path = r"A:\Deepfake\deepfake detectors\deepfake_model.pth"

batch_size = 32
learning_rate = 1e-4
epochs = 10
val_split = 0.2

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# ===========================
# DATASET SETUP
# ===========================
dataset_root = r"A:\Deepfake\deepfake detectors\optical_flow"
os.makedirs(dataset_root, exist_ok=True)

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

dataset = datasets.ImageFolder(dataset_root, transform=transform)

total_size = len(dataset)
if total_size == 0:
    raise ValueError("No images found! Please check your real/fake directories.")

val_size = int(total_size * val_split)
train_size = total_size - val_size

train_data, val_data = random_split(dataset, [train_size, val_size])

train_loader = DataLoader(train_data, batch_size=batch_size, shuffle=True, num_workers=0)
val_loader = DataLoader(val_data, batch_size=batch_size, shuffle=False, num_workers=0)

print(f"Total images: {total_size} | Train: {train_size} | Val: {val_size}")

# ===========================
# MODEL SETUP (ResNet18)
# ===========================
model = models.resnet18(weights="IMAGENET1K_V1")
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 2)
model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=learning_rate)

# ===========================
# TRAINING LOOP (ALWAYS FRESH)
# ===========================
start_epoch = 1  # always start from scratch

for epoch in range(start_epoch, epochs + 1):
    print(f"\nEpoch {epoch}/{epochs}")
    model.train()

    running_loss, correct, total = 0.0, 0, 0

    for images, labels in tqdm(train_loader, desc="Training", ncols=100):
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()
        _, predicted = torch.max(outputs, 1)

        total += labels.size(0)
        correct += (predicted == labels).sum().item()

    train_loss = running_loss / len(train_loader)
    train_acc = 100 * correct / total

    # ==================
    # VALIDATION
    # ==================
    model.eval()
    val_loss, val_correct, val_total = 0.0, 0, 0

    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)

            outputs = model(images)
            loss = criterion(outputs, labels)

            val_loss += loss.item()
            _, predicted = torch.max(outputs, 1)

            val_total += labels.size(0)
            val_correct += (predicted == labels).sum().item()

    val_loss /= len(val_loader)
    val_acc = 100 * val_correct / val_total

    print(f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}%")
    print(f"Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.2f}%")

    # Save model each epoch (overwrite)
    torch.save(model.state_dict(), model_save_path)
    print(f"💾 Model saved: {model_save_path}")

print("\n✅ Training completed successfully!")
