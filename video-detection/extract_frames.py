import cv2
import os

# Corrected base directory and folder names
BASE_DIR = r"A:\deepfake detectors"
REAL_VIDEOS_DIR = os.path.join(BASE_DIR, "videos", "real")
FAKE_VIDEOS_DIR = os.path.join(BASE_DIR, "videos", "fake")
OUTPUT_FRAMES_REAL = os.path.join(BASE_DIR, "frames", "real")
OUTPUT_FRAMES_FAKE = os.path.join(BASE_DIR, "frames", "fake")

# Create output folders if they don't exist
os.makedirs(OUTPUT_FRAMES_REAL, exist_ok=True)
os.makedirs(OUTPUT_FRAMES_FAKE, exist_ok=True)

print(f"Base Directory: {BASE_DIR}")
print(f"Real videos folder: {REAL_VIDEOS_DIR}")
print(f"Fake videos folder: {FAKE_VIDEOS_DIR}")

def extract_frames(video_path, output_dir):
    print(f"\nOpening video: {video_path}")
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"❌ Failed to open video: {video_path}")
        return

    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_filename = os.path.join(
            output_dir,
            f"{os.path.splitext(os.path.basename(video_path))[0]}_frame{frame_count:04d}.jpg"
        )
        cv2.imwrite(frame_filename, frame)
        frame_count += 1

    cap.release()
    print(f"✅ Done: {frame_count} frames saved for {video_path}")

def process_folder(folder_path, output_path):
    print(f"\nChecking folder: {folder_path}")
    if not os.path.exists(folder_path):
        print(f"❌ Folder not found: {folder_path}")
        return
    
    files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.mp4', '.avi', '.mov', '.mkv'))]
    print(f"Found {len(files)} video(s): {files}")

    if not files:
        print("⚠️ No videos found! Check your folder or file extensions.")
        return

    for file in files:
        full_path = os.path.join(folder_path, file)
        extract_frames(full_path, output_path)

# Process both folders
process_folder(REAL_VIDEOS_DIR, OUTPUT_FRAMES_REAL)
process_folder(FAKE_VIDEOS_DIR, OUTPUT_FRAMES_FAKE)
