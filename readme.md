RetinoAI

Production-ready system for classifying diabetic retinopathy from fundus images using a lightweight attention SqueezeNet-SE model.

What It Does

Upload image → receive DR grade + confidence

Store/view previous results

Chatbot for DR education

Works on mobile & desktop with dark/light mode

Stack

Frontend: Next.js + TypeScript, Tailwind, ShadCN/UI, Firebase Auth

Backend: Flask REST API, TensorFlow/Keras .h5 model

Main Endpoints

POST /predict – image inference

GET/POST /history – user reports

Run Locally

# backend
pip install -r requirements.txt
flask run

# frontend
npm install
npm run dev


Model

Accuracy/AUC from thesis: >90% / >0.97

Inference <200 ms

Notes

Supports jpg/jpeg/png ≤5 MB

Graceful error handling & Zod validation

MIT recommended.
