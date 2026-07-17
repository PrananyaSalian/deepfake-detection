from datasets import load_dataset

def test_streaming():
    print("Starting dataset stream test...")

    # Use a public DFDC dataset that can be streamed
    dataset = load_dataset("Selimsef/dfdc_deepfake_challenge", split="train", streaming=True)

    for i, example in enumerate(dataset):
        print(f"Sample {i}:")
        print("  label:", example.get("label", "<no label>"))
        print("  video path or link:", example.get("video", "N/A"))
        if i >= 4:
            break

if __name__ == "__main__":
    test_streaming()
