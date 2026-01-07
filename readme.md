# 🔬 RetinoAI – Diabetic Retinopathy Detection Platform

**RetinoAI** is an integrated system for automated **5-class grading of diabetic retinopathy (DR)** from retinal fundus photographs.  
The project unites a **novel attention-enhanced lightweight CNN model** with a **modern Next.js/React web application** to support accessible, scalable screening beyond research labs.

:contentReference[oaicite:0]{index=0}

---

## 📌 Overview

Diabetic retinopathy progresses through discrete clinical stages:

`No_DR → Mild → Moderate → Severe → Proliferative_DR`

Traditional DR screening depends on manual interpretation, which is time-consuming and variable. RetinoAI automates this workflow with low latency inference.

---

## ✨ Novel Architecture (Phase 1)

- **SqueezeNet backbone** utilizing efficient *fire modules*  
- Integrated **Squeeze-and-Excitation (SE) blocks** for **channel-wise attention**  
- Emphasizes subtle lesions such as microaneurysms and hard exudates  
- Maintains very small model size with human-level accuracy

:contentReference[oaicite:1]{index=1}

---

## 📊 Model Performance

| Metric | Value |
|------|------|
| Training Accuracy | **92.38%** |
| Validation Accuracy | **91.37%** |
| Reported Test Accuracy | **90.9%** |
| Per-Class AUC | **> 0.97** |
| Avg Inference Latency | **< 200 ms** |

**Findings**

- Minimal misclassification between adjacent DR levels  
- SE blocks improved discriminability with negligible overhead  
- Suitable for low-resource clinical environments

:contentReference[oaicite:2]{index=2}

---

## 🚀 Phase 2 – Front-End Modernization

- Full-stack React framework using **Next.js + TypeScript**  
- **Tailwind CSS** with refined dark/light theming  
- **ShadCN/UI & Radix** components (Atomic Design)  
- Firebase Authentication  
- Firestore-based scan history  
- WCAG 2.1 aligned accessibility  
- Framer Motion micro-interactions

:contentReference[oaicite:3]{index=3}

---

## 🧩 Tech Stack

### Frontend
- Next.js 13+, React  
- TypeScript (strict mode)  
- Tailwind CSS  
- Zod for validation  
- ShadCN/UI + Radix  
- Firebase Auth & Firestore

### Backend
- Flask REST API  
- TensorFlow/Keras `.h5` model  
- Docker container  
- Google Cloud hosting

**Core Endpoints**

- `POST /predict` – image inference → DR grade + confidence  
- `GET/POST /history` – user reports

:contentReference[oaicite:4]{index=4}

---

## 📁 Repository Structure (Recommended)

```
RetinoAI/
├── model/
│   ├── train.py
│   ├── squeezenet_se.py
│   └── retinoai.h5
│
├── backend/
│   └── flask_server.py
│
├── frontend/
│   └── nextjs_app/
│
└── thesis/
    └── diagrams & docs
```

---

## 🗂 Dataset

- **APTOS 2019 Blindness Dataset – 3,662 images**  
- Resized to 224×224  
- Normalized [0,1]  
- Extensive augmentation for class imbalance  
- Folder-based automatic label encoding

### Class Distribution

| Class | Before Aug | After Aug |
|----|----|----|
| No_DR | 1805 | 3035 |
| Mild | 370 | 1948 |
| Moderate | 999 | 2452 |
| Severe | 193 | 1795 |
| Proliferative_DR | 295 | 1876 |

:contentReference[oaicite:5]{index=5}

---

## ⚠ Limitations & Future Work

- Demographic diversity restricted in APTOS  
- Borderline Moderate/Severe sensitivity  
- Explainability not explicit in Phase 1

**Planned**

- Grad-CAM heatmaps (XAI)  
- Multi-center validation  
- Client-side inference  
- Metadata fusion

:contentReference[oaicite:6]{index=6}

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo  
2. Create feature branch  
3. Commit → Pull Request  
4. Add tests for `/predict`

---

## 📜 License

MIT (Suggested)

---

## 📧 Contact

- GitHub: 14Aparajita 
- Email: aparajitavaish@gmail.com


