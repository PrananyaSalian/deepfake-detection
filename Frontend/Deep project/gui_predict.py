import tkinter as tk
from tkinter import filedialog, messagebox
from predict import predict_image  # your existing predict function

def upload():
    file_path = filedialog.askopenfilename(filetypes=[("Image files", "*.png;*.jpg;*.jpeg")])
    if file_path:
        label, prob = predict_image(file_path)
        messagebox.showinfo("Result", f"{file_path} -> {label} (probability: {prob:.4f})")

root = tk.Tk()
root.title("DeepFake Detector")
root.geometry("300x150")

upload_button = tk.Button(root, text="Upload Image", command=upload, width=20, height=2)
upload_button.pack(pady=40)

root.mainloop()
