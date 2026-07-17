Deepfake Detection System
Using GAN and Optical Flow Analysis

This project is a full-stack AI-based Deepfake Detection System that detects whether an image or video is real or fake using Deep Learning models (GAN / CNN) and Optical Flow Analysis.

The system is built with a modular architecture, separating:

Frontend (React)

Backend (Node.js + MongoDB)

Machine Learning Model (Python)

✨ Key Features

🔐 User Authentication (Login & Register)

🎥 Deepfake Detection for Videos

🖼️ Deepfake Detection for Images

📊 Model Confidence Score

⚠️ Risk Level (Low / Moderate / High)

⏱️ Analysis Time Measurement

🔒 Analyze option locked until login

🎨 Modern and responsive UI

🏗️ Project Architecture
deepfake-detection-system/
│
├── README.md
│
├── frontend/                  # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                   # Node.js + Express backend
│   ├── server.js
│   ├── package.json
│   ├── uploads/
│   └── models/
│
└── ml_model/                  # Python AI / ML module
    ├── predict_video.py
    ├── predict_image.py
    ├── train.py
    ├── requirements.txt
    ├── models/
    └── utils/

🛠️ Technologies Used
Frontend

React (Vite)

TypeScript

Tailwind CSS

ShadCN UI

Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

Multer (File Upload)

Machine Learning

Python 3

PyTorch

OpenCV

NumPy

facenet-pytorch

GAN / CNN Models

Optical Flow Analysis

⚙️ System Requirements
Software

Node.js (v18 or above)

Python (v3.10 or above)

MongoDB (Local or Atlas)

VS Code

Hardware (Recommended)

RAM: 8 GB or more

Processor: Intel i5 / Ryzen 5 or above

GPU: Optional (for faster model execution)

🚀 How to Run the Project
1️⃣ Clone the Repository
git clone https://github.com/your-username/deepfake-detection-system.git
cd deepfake-detection-system

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:8080

3️⃣ Backend Setup
cd backend
npm install
node server.js


Backend runs at:

http://localhost:5000

4️⃣ Python (ML Model) Setup
cd ml_model
python -m venv venv


Activate virtual environment:

Windows

venv\Scripts\activate


Linux / macOS

source venv/bin/activate


Install dependencies:

pip install -r requirements.txt

🧪 How to Use the Application

Open the frontend in browser

Register or Login

Upload an image or video

Click Analyze with AI

View detection results:

Real / Fake

Confidence score

Risk level

Analysis time

⚠️ Note: The Analyze button is disabled until the user logs in.

📊 Sample Output
{
  "result": "FAKE",
  "confidence": 0.93,
  "real_votes": 2,
  "fake_votes": 18,
  "frames": 20,
  "time_ms": 1400
}

🔐 Authentication Logic

JWT token stored in browser localStorage

Analyze functionality locked until login

Logout clears session

🚨 Common Issues & Fixes
Model confidence shows 0%

✔️ Ensure backend returns confidence, real_votes, fake_votes

Analyze button disabled

✔️ User must login first

Python script not running

✔️ Check relative Python path in server.js
✔️ Activate Python virtual environment

📈 Future Enhancements

Real-time deepfake detection

Audio-video synchronization analysis

Transformer-based detection models

Cloud deployment

Explainable AI visualizations

🎓 Academic Relevance

This project is suitable for:

Final Year Engineering Project

Mini Project

AI / ML Coursework

Computer Vision Research

📜 Disclaimer

This project is developed only for educational and research purposes.

🏁 Conclusion

This system demonstrates an effective approach to Deepfake Detection using AI, integrating frontend, backend, and machine learning modules in a scalable and maintainable architecture.
