import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
import torch
from torchvision import transforms
from PIL import Image
import os
import sys
import json
from model import Discriminator

# ------------------------------
# Hardcoded Model Path
# ------------------------------
MODEL_PATH = r"A:\Deep project\models\discriminator_gan.pth"  # hardcoded absolute path

# ------------------------------
# Device
# ------------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ------------------------------
# Load Model
# ------------------------------
if not os.path.exists(MODEL_PATH):
    print(json.dumps({"error": f"Model not found at {MODEL_PATH}"}))
    sys.exit(1)

try:
    model = Discriminator().to(device)
    state_dict = torch.load(MODEL_PATH, map_location=device)
    model.load_state_dict(state_dict)
    model.eval()
except Exception as e:
    print(json.dumps({"error": f"Failed to load model: {str(e)}"}))
    sys.exit(1)

# ------------------------------
# Transform
# ------------------------------
transform = transforms.Compose([
    transforms.Resize((64, 64)),
    transforms.ToTensor(),
    transforms.Normalize([0.5] * 3, [0.5] * 3)
])

# ------------------------------
# Prediction Function
# ------------------------------
THRESHOLD = 0.4  # Adjust as needed

def predict_image(image_path):
    try:
        img = Image.open(image_path).convert("RGB")
        img_tensor = transform(img).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(img_tensor)
            prob = float(output.item())

        label = "REAL" if prob > THRESHOLD else "FAKE"

        return {
            "image": os.path.basename(image_path),
            "probability": round(prob, 4),
            "result": label
        }

    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}

# ------------------------------
# Command-line Interface
# ------------------------------
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: python predict_image.py <image_path>"}))
        sys.exit(1)

    image_path = sys.argv[1]

    if not os.path.exists(image_path):
        print(json.dumps({"error": f"File not found: {image_path}"}))
        sys.exit(1)

    result = predict_image(image_path)
    print(json.dumps(result))
