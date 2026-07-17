import cv2
import numpy as np
import os

BASE_DIR = r"A:\deepfake detectors"

REAL_FRAMES_DIR = os.path.join(BASE_DIR, "frames", "real")
FAKE_FRAMES_DIR = os.path.join(BASE_DIR, "frames", "fake")

OPTICAL_FLOW_REAL = os.path.join(BASE_DIR, "optical_flow", "real")
OPTICAL_FLOW_FAKE = os.path.join(BASE_DIR, "optical_flow", "fake")

os.makedirs(OPTICAL_FLOW_REAL, exist_ok=True)
os.makedirs(OPTICAL_FLOW_FAKE, exist_ok=True)

def compute_optical_flow(frames_folder, save_folder):
    """Compute optical flow for all frames in a folder."""
    frame_files = sorted([f for f in os.listdir(frames_folder) if f.lower().endswith(".jpg")])
    if not frame_files:
        print(f"⚠️ No frames found in: {frames_folder}")
        return

    prev_frame = None
    flow_count = 0

    for frame_file in frame_files:
        frame_path = os.path.join(frames_folder, frame_file)
        frame = cv2.imread(frame_path)
        if frame is None:
            print(f"⚠️ Skipping unreadable frame: {frame_path}")
            continue

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        if prev_frame is None:
            prev_frame = gray
            continue

        flow = cv2.calcOpticalFlowFarneback(prev_frame, gray, None,
                                            0.5, 3, 15, 3, 5, 1.2, 0)
        magnitude, angle = cv2.cartToPolar(flow[..., 0], flow[..., 1])
        hsv = np.zeros_like(frame)
        hsv[..., 1] = 255
        hsv[..., 0] = angle * 180 / np.pi / 2
        hsv[..., 2] = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX)
        flow_img = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

        save_path = os.path.join(save_folder, f"flow_{flow_count:04d}.jpg")
        cv2.imwrite(save_path, flow_img)
        flow_count += 1
        prev_frame = gray

    print(f"✅ Saved {flow_count} optical flow images in {save_folder}")

def process_main_folder(input_dir, output_dir):
    """Process all subfolders or the main folder if frames are directly inside."""
    if not os.path.exists(input_dir):
        print(f"❌ Folder not found: {input_dir}")
        return

    subfolders = [os.path.join(input_dir, d) for d in os.listdir(input_dir)
                  if os.path.isdir(os.path.join(input_dir, d))]

    if not subfolders:
        # No subfolders → process directly
        compute_optical_flow(input_dir, output_dir)
    else:
        # Process each subfolder separately
        for sub in subfolders:
            video_name = os.path.basename(sub)
            save_subfolder = os.path.join(output_dir, video_name)
            os.makedirs(save_subfolder, exist_ok=True)
            compute_optical_flow(sub, save_subfolder)

# Run for both real and fake
process_main_folder(REAL_FRAMES_DIR, OPTICAL_FLOW_REAL)
process_main_folder(FAKE_FRAMES_DIR, OPTICAL_FLOW_FAKE)
