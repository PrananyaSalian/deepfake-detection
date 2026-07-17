import sys
import os
import cv2
import json
import torch
import numpy as np
from torchvision import transforms, models

# -----------------------------
# Load ResNet18 Model
# -----------------------------
def load_model(model_path):
    model = models.resnet18(weights=None)
    num_ftrs = model.fc.in_features
    model.fc = torch.nn.Linear(num_ftrs, 2)

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model NOT found at: {model_path}")

    state_dict = torch.load(model_path, map_location="cpu")
    model.load_state_dict(state_dict)
    model.eval()
    return model

# -----------------------------
# Extract Frames
# -----------------------------
def extract_frames(video_path, max_frames=150):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Cannot open video file: {video_path}")

    frames = []
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    interval = max(1, total // max_frames)

    count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Skip invalid frames
        if frame is None or frame.size == 0:
            continue

        if count % interval == 0:
            # Convert BGR → RGB
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append(frame)

        count += 1

    cap.release()
    return frames

# -----------------------------
# Analyze Video
# -----------------------------
def analyze_video(model, video_path):
    transform = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])

    frames = extract_frames(video_path)
    if len(frames) == 0:
        return {"error": "No frames extracted"}

    fake_votes = 0
    real_votes = 0

    for frame in frames:
        img = transform(frame).unsqueeze(0)
        with torch.no_grad():
            out = model(img)
            _, pred = torch.max(out, 1)

            if pred.item() == 1:
                fake_votes += 1
            else:
                real_votes += 1

    total = fake_votes + real_votes
    fake_ratio = fake_votes / total

    return {
        "frames": total,
        "real_votes": real_votes,
        "fake_votes": fake_votes,
        "confidence": round(fake_ratio * 100, 2),
        "result": "FAKE" if fake_ratio > 0.5 else "REAL"
    }

# -----------------------------
# MAIN
# -----------------------------
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No video path provided"}))
        sys.exit(1)

    video_path = sys.argv[1]

    try:
        # Final model path
        model_path = r"A:/Deepfake/deepfake detectors/videos/models/deepfake_model.pth"

        model = load_model(model_path)
        result = analyze_video(model, video_path)
        result["video"] = os.path.basename(video_path)

        # Print JSON only
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
