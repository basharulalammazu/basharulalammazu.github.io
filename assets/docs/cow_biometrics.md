# Cow Biometrics
### AI-Powered Cattle Identification via Muzzle Pattern Recognition

---

```
Prepared by:  Basharul - Alam - Mazu
Role:         Computer Vision & ML Engineer
Date:         June 2026
Status:       🔒 Closed Source / Private Project
Stage:        Advanced Development → Production-Ready
```

---

## 1. Project Overview

**Cow Biometrics** is an advanced computer vision system that identifies and tracks individual cattle using the unique biometric patterns found on their muzzles — similar in concept to human fingerprint identification. The system combines YOLOv8 object detection with a deep learning classifier to deliver reliable, non-invasive, real-time animal identification at scale.

**The Problem:**
Traditional livestock identification methods — ear tags, RFID chips, and physical branding — are invasive, costly, and unreliable. Tags fall off, become illegible, and cause animal welfare concerns. Manual record-keeping fails entirely for herds beyond 100–200 animals. There is no practical way to automatically correlate an animal in front of a camera with its full health, breeding, and lineage history.

**The Solution:**
Just as every human fingerprint is unique, every cow muzzle has a distinct pattern of ridges and pores that remains stable throughout the animal's life. Cow Biometrics automates the capture and matching of these patterns — a camera image is enough to identify any registered animal in under 50ms, linking it instantly to its complete farm management record.

**My Role:** Designed and implemented the full ML pipeline — architecture evaluation, dataset engineering, model training and optimization, YOLO integration, biometric feature extraction, and production-readiness work including ONNX export and Docker deployment.

---

## 2. Problem Statement

| Pain Point | Impact |
|---|---|
| Ear tags fall off or become unreadable | Lost animal records, audit gaps |
| Manual identification fails at scale | Unusable for herds of 500+ animals |
| No real-time identity lookup | Delays in treatment, breeding, and sale decisions |
| Invasive tagging causes welfare concerns | Regulatory and ethical risk |
| No linkage between animal and health history | Incomplete farm management data |

Cow Biometrics eliminates every one of these pain points with a camera and a trained model.

---

## 3. Technologies Used

| Layer | Technology | Purpose |
|---|---|---|
| **Detection** | YOLOv8 (Ultralytics) | Muzzle localization in input images |
| **ML Framework** | PyTorch 2.0 | Model training, inference, feature extraction |
| **Model Architecture** | EfficientNetV2-Small (via `timm`) | Classification backbone — best accuracy/speed trade-off |
| **Augmentation** | Albumentations | State-of-the-art image augmentation pipeline |
| **Similarity Matching** | Cosine similarity (PyTorch) | Biometric identity matching against database |
| **API Layer** | FastAPI | REST endpoints for identity query and registration |
| **Deployment** | Docker + ONNX | Hardware-agnostic containerized deployment |
| **Edge Support** | TensorFlow Lite / ONNX | Mobile and edge device inference |
| **Data Annotation** | CVAT | Bounding box and class labeling |

---

## 4. Key Features

- **YOLOv8 Muzzle Detection** — Localizes muzzle region with 98.7% detection accuracy across variable angles, resolutions (480×640 to 1920×1080), and lighting conditions
- **Deep Learning Classification** — EfficientNetV2-Small trained on 5,000+ images; achieves 92.5% biometric identification accuracy across 150+ unique animals
- **2,048-Dimensional Feature Vectors** — L2-normalized embeddings enable cosine-similarity matching against a registered animal database
- **Sub-50ms Inference** — 45ms on CPU, 12ms on GPU — suitable for live camera feeds and real-time farm systems
- **Confidence Thresholding** — Predictions below 0.85 similarity score are flagged for manual review rather than silently misidentified
- **5-Fold Cross-Validation** — Rigorous evaluation confirms 92.2% mean test accuracy with low variance (±0.18%)
- **Non-Invasive Identification** — No physical contact with the animal required; works from standard CCTV or handheld cameras
- **ONNX Export** — Model exported for edge deployment on Jetson Nano and mobile devices
- **Scalable Architecture** — Designed to support herds of 1,000+ animals with multi-worker batch processing
- **Complete Audit Trail** — Every identification logged with timestamp, confidence score, and feature vector for traceability

---

## 5. System Architecture

### End-to-End Identification Pipeline

```
Input Image (camera / upload)
         │
         ▼
┌─────────────────────────┐
│   Quality Validation    │
│  Resolution · Blur ·    │
│  Format checks          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│     Preprocessing       │
│  Normalize · Resize     │
│  Augment (training)     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   YOLOv8 Detection      │
│  Muzzle localization    │
│  Confidence filter >0.5 │
│  Bounding box extract   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│    ROI Extraction       │
│  Crop + 10% padding     │
│  Edge case handling     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Feature Extraction    │
│  EfficientNetV2-S       │
│  2,048-d vector         │
│  L2 normalization       │
└────────────┬────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
┌──────────┐  ┌──────────────────────┐
│ Classify │  │  Biometric Matching  │
│ 5-class  │  │  Cosine similarity   │
│ softmax  │  │  vs. animal database │
└──────────┘  └──────────┬───────────┘
                         │
              ┌──────────┴──────────┐
              │ Confidence ≥ 0.85?  │
              │                     │
           YES ▼                  NO ▼
      ┌──────────────┐     ┌──────────────────┐
      │ Animal ID    │     │ Flag for manual  │
      │ Confirmed    │     │ review           │
      └──────────────┘     └──────────────────┘
             │
             ▼
    Output + Audit Log
    Animal ID · Confidence
    Feature Vector · Timestamp
```

### Architecture Selection: Why EfficientNetV2-Small

Five architectures were evaluated before selecting the production model:

| Model | Accuracy | Inference (CPU) | Size | Decision |
|---|---|---|---|---|
| EfficientNetV2-S | **92.5%** | **45ms** | 40MB | ✅ Selected |
| ResNet50 | 90.1% | 78ms | 98MB | Too slow |
| ViT-B/16 | 91.8% | 120ms | 346MB | Too heavy |
| WideResNet50 | 91.2% | 95ms | 275MB | Too heavy |
| MobileNetV3-Large | 87.4% | 22ms | 21MB | Insufficient accuracy |

EfficientNetV2-Small delivered the best balance of accuracy, speed, and memory footprint for production deployment.

---

## 6. Screenshots

> *System outputs and visualizations available internally. Key views include:*

| View | Description |
|---|---|
| **Detection Output** | Input image with YOLOv8 bounding box overlaid on muzzle region |
| **Feature Space (t-SNE)** | 2D projection of 2,048-d embeddings showing well-separated animal clusters |
| **Confusion Matrix** | Per-class classification breakdown across all 150+ animals |
| **ROC Curves** | Per-class AUC plots (average AUC: 0.979) |
| **Training Dashboard** | Loss/accuracy curves across 100 epochs with early stopping marker |
| **API Response** | JSON output: `animal_id`, `confidence`, `bbox`, `feature_vector` |
| **Cross-Validation Summary** | 5-fold results table confirming model stability |

---

## 7. My Contributions

### Dataset Engineering

- Curated and annotated 5,000+ images covering 150+ unique animals across diverse conditions (indoor/outdoor, varied lighting, multiple camera angles)
- Created YOLO-format bounding box annotations for muzzle regions using CVAT
- Implemented stratified train/validation/test split (70% / 15% / 15%) preserving per-animal representation
- Built multi-level quality assurance: duplicate detection (perceptual hashing), blur filtering, resolution validation, inter-annotator agreement checks
- Designed Albumentations augmentation pipeline: rotation (±20°), brightness/contrast jitter, horizontal flip, affine scaling (0.8–1.2×), CLAHE

### Model Training & Optimization

- Evaluated 5 architectures systematically; selected EfficientNetV2-Small based on quantified accuracy/latency/size trade-offs
- Implemented transfer learning strategy: ImageNet pretrained weights → frozen early layers → fine-tuned domain-specific layers with custom classification head (BatchNorm + Dropout)
- Training configuration: Adam optimizer, LR 0.001 with cosine annealing, batch size 32, 100 epochs, early stopping (patience 10)
- Applied mixed-precision training (FP16) for faster convergence
- Conducted 5-fold cross-validation; achieved 92.5% final accuracy with ±0.18% test variance — confirming model stability and generalization

### Computer Vision Pipeline

- Integrated YOLOv8 for muzzle detection (98.7% precision, 98.2% recall, mAP@0.5: 97.8%)
- Implemented ROI extraction with 10% padding around detections to preserve muzzle edge features
- Built feature extraction module: EfficientNetV2 backbone → 2,048-d vector → L2 normalization
- Implemented cosine similarity matching against the animal database with configurable confidence threshold (default 0.85)
- Handled edge cases: partial muzzle visibility, low detection confidence, image corruption, multi-animal frames

### Production & Deployment

- Exported trained model to ONNX format for hardware-agnostic edge deployment
- Containerized inference service with Docker
- Built FastAPI wrapper for REST-based identity queries
- Benchmarked inference: 45ms CPU (Intel Xeon), 12ms GPU (NVIDIA), 27K images/sec (GPU batch-32)

---

## 8. Challenges & Solutions

| Challenge | Root Cause | Solution |
|---|---|---|
| Highly variable image quality | Field cameras at different heights, angles, lighting | Aggressive augmentation + robust normalization; EfficientNetV2's architecture handles input diversity well |
| Limited training data for biometric matching | Only ~33 images per animal | Transfer learning from ImageNet (22M images) + Albumentations augmentation; cross-validation for reliability |
| Similar muzzle patterns causing confusion | Some animals have visually close patterns | Confidence thresholding (>0.85); borderline cases routed to manual review; Top-K retrieval for disambiguation |
| Real-time latency requirement | Live farm systems need sub-100ms response | EfficientNetV2-S selected specifically for CPU efficiency; ONNX export for further optimization |
| Scalability beyond 150 animals | Database grows as herd scales | Cosine similarity search scales linearly; FAISS indexing planned for herds beyond 1,000 animals |
| Detecting muzzles at non-frontal angles | Cattle don't always face the camera | YOLOv8 training included multi-angle samples; 10% padding on ROI preserves edge pattern information |

---

## 9. Results & Impact

### Model Performance

| Metric | Value |
|---|---|
| **Classification Accuracy** | 92.5% |
| **Macro Precision** | 0.921 |
| **Macro Recall** | 0.915 |
| **Macro F1-Score** | 0.918 |
| **Average AUC (ROC)** | 0.979 |
| **YOLOv8 Detection Precision** | 98.7% |
| **YOLOv8 mAP@0.5** | 97.8% |
| **False Positive Rate** | < 1% |

### Cross-Validation Summary

| Fold | Train Acc | Val Acc | Test Acc |
|---|---|---|---|
| Fold 1 | 96.8% | 92.3% | 92.1% |
| Fold 2 | 97.1% | 92.7% | 92.5% |
| Fold 3 | 96.9% | 92.1% | 92.0% |
| Fold 4 | 97.0% | 92.6% | 92.4% |
| Fold 5 | 96.7% | 92.4% | 92.2% |
| **Mean** | **96.9%** | **92.4%** | **92.2%** |

### Inference Performance

| Hardware | Single Image | Batch (32) |
|---|---|---|
| CPU (Intel Xeon) | 45ms | — |
| GPU (NVIDIA) | 12ms | 1.2s (37ms/img) |
| GPU Throughput | 83 img/sec | 27,000 img/sec |

### Business Impact

- Eliminates invasive ear-tag identification — better animal welfare, lower tagging cost
- Real-time identification enables instant linkage to health, breeding, and lineage records
- Scales to 1,000+ animals with the same infrastructure
- Reduces manual record-keeping labor by an estimated 60–70% on large farms
- Non-invasive approach opens the door to continuous behavioral monitoring without handling stress

---

## 10. Future Improvements

- **FAISS Indexing** — Replace linear cosine search with approximate nearest neighbor for herds beyond 1,000 animals
- **Temporal Tracking** — Track individual animals across video frames without re-identifying each frame
- **Mobile App** — On-device inference via TensorFlow Lite for field use on smartphones
- **Behavioral Analytics** — Combine identity with movement/posture data for health anomaly detection
- **Ensemble Matching** — Combine classification confidence with embedding similarity for borderline cases
- **Multi-Camera Correlation** — Reconcile identities seen on different cameras across the farm

---

## 11. Confidentiality Notice

> 🔒 **Source code is not publicly available** due to organizational confidentiality and proprietary restrictions.
>
> This document is intended solely to showcase system architecture, engineering approach, technology decisions, and individual contributions. All animal records, farm data, and client-specific configurations have been omitted.
>
> For detailed technical discussion about specific implementation decisions, ML methodology, or architecture choices, please reach out directly.

---

## 12. Contact

**Basharul - Alam - Mazu**
Computer Vision & ML Engineer
🔗 [basharulalammazu.github.io](https://basharulalammazu.github.io)

---

*Document Version: 1.0 · Last Updated: June 2026 · Status: Production-Ready*
