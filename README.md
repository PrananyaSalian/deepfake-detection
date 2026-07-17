# DeepFake Detection System

A full-stack system for detecting manipulated (deepfake) images and videos using Generative Adversarial Networks (GANs), Convolutional Neural Networks (CNNs), and Optical Flow Analysis. Built with a React frontend, Node.js/Express backend, and Python-based ML detection modules.

This project's research was conducted as part of a team and co-authored in a paper published on ResearchGate (2026).

## Overview

This project analyzes facial patterns and motion inconsistencies to identify whether an uploaded image or video has been artificially manipulated. It combines:
- A web interface for uploading and reviewing media
- A backend API for handling requests and storing results
- A GAN + CNN-based image detection model
- An Optical Flow-based video detection model

## Architecture

```
deepfake-detection/
├── Frontend/            # React + Vite web app (includes backend inside)
│   └── backend/          # Node.js + Express API, MongoDB
├── image-detection/      # Python: GAN/CNN-based image analysis
└── video-detection/      # Python: Optical Flow-based video analysis
```

**How it fits together:** Users upload an image or video through the frontend. The backend receives the file and routes it to the appropriate detection module (image or video). The detection module processes the media using the trained model and returns a real/fake classification, which is displayed back to the user.

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS
**Backend:** Node.js, Express, MongoDB
**Image Detection:** Python, TensorFlow/Keras, OpenCV, GAN
**Video Detection:** Python, PyTorch, OpenCV, Optical Flow Analysis

## Features

- Image upload and deepfake analysis using GAN-based classification
- Video upload and frame-by-frame optical flow analysis
- User authentication and history tracking
- Real-time results display

## Getting Started

### Frontend + Backend
```bash
cd Frontend
npm install
npm run dev
```
```bash
cd Frontend/backend
node server.js
```

### Image Detection
```bash
cd image-detection
pip install -r requirements.txt
python app.py
```

### Video Detection
```bash
cd video-detection
pip install -r requirements.txt
python predict_video.py
```

## Research

This project's image detection approach is documented in a peer-reviewed paper, co-authored as part of a team:
**"DeepFake Detection Using Generative Adversarial Network and Optical Flow Analysis"** — Published on ResearchGate (2026)

## Author

Prananya N
B.E. Computer Science & Engineering
(This repository reflects my individual contribution to the project; the associated research paper was co-authored with a team.)
