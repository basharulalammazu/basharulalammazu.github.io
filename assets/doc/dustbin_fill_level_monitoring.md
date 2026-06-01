# 📘 SmartDustin — Complete Closed-Source Industrial Documentation

### AI-Powered Railway Dustbin Fill-Level Monitoring System

---

```
Prepared by:  Basharul - Alam - Mazu  
Role:         AI/ML Engineer & Backend Developer  
Project Type: Closed Source / Enterprise Production System  
Deployment:   12 Railway Stations (Production)  
Status:       🔒 Confidential Industrial System  
Last Updated: June 2026  
```

---

# 📑 Table of Contents

1. Executive Summary
2. Project Overview
3. Problem Statement
4. System Architecture
5. Technology Stack
6. System Design & Data Flow
7. Key Features
8. Machine Learning System
9. Dataset Engineering
10. Backend & API System
11. Database Architecture
12. Deployment & Operations
13. Performance Metrics & Results
14. Challenges & Engineering Solutions
15. Contributions
16. Future Improvements
17. Confidentiality Notice
18. Contact

---

# 1. Executive Summary

**SmartDustin** is an enterprise-grade AI-powered waste management and monitoring system deployed in railway stations. It automates dustbin monitoring using IP cameras, computer vision, and a locally deployed deep learning model.

The system eliminates manual inspection, enables real-time monitoring, and provides automated alerts for maintenance teams — fully offline-capable and cost-efficient.

### Key Impact

* 🚉 12+ railway stations covered
* 📷 50+ IP cameras monitored
* 🗑️ 200+ dustbins tracked
* ⚡ 30,000+ daily predictions
* ⏱️ 65ms inference time (CPU)
* 🎯 94.2% ML accuracy
* 📉 85% reduction in manual inspections
* 💰 ~$6,000/year cost savings

---

# 2. Project Overview

SmartDustin solves critical waste management issues in public railway stations:

### Problem

* Manual bin inspection is slow and inconsistent
* Overflowing bins create hygiene hazards
* No real-time visibility of waste status
* High operational cost of external AI APIs

### Solution

* Automated image capture from IP cameras
* Local ML inference using EfficientNetV2
* Real-time fill-level classification (5 classes)
* Smart alerts via Firebase
* Fully offline inference pipeline

---

# 3. Problem Statement

| Issue                      | Impact                        |
| -------------------------- | ----------------------------- |
| Manual inspection required | High labor cost               |
| No real-time monitoring    | Overflow unnoticed            |
| Reactive maintenance       | Delayed response              |
| External API dependency    | High cost + internet reliance |

---

# 4. System Architecture

## High-Level Architecture

```
IP Cameras (RTSP/HTTP)
        ↓
Django REST API (DRF)
        ↓
Celery Workers + Redis Queue
        ↓
EfficientNetV2 ML Model
        ↓
PostgreSQL Database
        ↓
Firebase Alerts + Dashboard
```

## Layered Design

* Presentation Layer → REST API + Dashboard
* Application Layer → Django Views + Auth + Logic
* Processing Layer → Celery async workers
* ML Layer → PyTorch EfficientNetV2
* Storage Layer → PostgreSQL + Redis cache
* Integration Layer → Firebase + Camera feeds

---

# 5. Technology Stack

### Backend

* Django 4.2
* Django REST Framework
* SimpleJWT Authentication
* Celery 5.x
* Redis
* PostgreSQL

### Machine Learning

* PyTorch 2.0
* TorchVision
* EfficientNetV2 Small
* OpenCV + Pillow

### DevOps & Tools

* Docker
* Swagger / drf-yasg
* Firebase Admin SDK
* django-celery-beat

---

# 6. System Design & Data Flow

## Pipeline Flow

### 1. Image Capture

* Cameras capture images every 30–60 seconds
* Stored as `CapturedImage (status: pending)`

### 2. Async Processing

* Celery worker picks task
* Image preprocessing (resize, normalize)
* ML inference executed

### 3. Prediction Storage

* Save prediction + confidence
* Update dustbin fill level
* Move image to classified storage

### 4. Alert System

* If fill ≥ 75% → Firebase alert triggered
* Otherwise logged for analytics

### 5. Dashboard Update

* API serves real-time bin status

---

# 7. Key Features

* 📷 Multi-camera real-time monitoring
* 🧠 AI-based fill-level detection
* ⚡ Async Celery processing pipeline
* 🔔 Smart alert system (Firebase)
* 📊 Historical analytics dashboard
* 🧾 Maintenance tracking system
* 🔐 JWT secured API
* 📡 Offline-capable inference system
* 🏷️ Role-based access control

---

# 8. Machine Learning System

## Model

* EfficientNetV2 Small
* 5-class classification:

  * empty
  * half
  * seventy
  * ninety
  * closed

## Performance

* Accuracy: **94.2%**
* Macro F1: **0.934**
* CPU latency: **65ms**
* GPU latency: **15ms**

## Training Setup

* Optimizer: Adam
* Loss: CrossEntropy
* Batch size: 32
* Epochs: 100
* LR schedule: Cosine annealing

---

# 9. Dataset Engineering

* 5,000+ images collected
* 12 railway stations
* CVAT annotation tool
* Balanced dataset (~1000/class)

### Augmentation

* Rotation ±15°
* Brightness/contrast jitter
* Horizontal flip
* Affine transforms

### Quality Control

* Duplicate removal
* Corruption filtering
* Manual validation
* 94% annotation agreement

---

# 10. Backend & API System

### Features

* 50+ REST endpoints
* Station / Camera / Dustbin management
* Prediction tracking
* Maintenance logs
* Swagger API docs

### Architecture Pattern

* Repository Pattern (ORM)
* Observer Pattern (alerts)
* Factory Pattern (model loading)
* Queue Pattern (Celery tasks)

---

# 11. Database Architecture

### Core Entities

* Station
* Camera
* Dustbin
* CapturedImage
* Prediction
* MaintenanceLog

### Relationships

* Station → Cameras
* Camera → Dustbins
* Dustbin → Images → Predictions

---

# 12. Deployment & Operations

* Dockerized deployment
* Redis queue system
* Celery worker scaling
* PostgreSQL production DB
* 99.9% uptime achieved
* Fully offline inference system

---

# 13. Performance Metrics

| Metric                | Value       |
| --------------------- | ----------- |
| Accuracy              | 94.2%       |
| F1 Score              | 0.934       |
| Inference Time        | 65ms        |
| Daily Predictions     | 30,000+     |
| Cameras               | 50+         |
| Stations              | 12          |
| Cost Saved            | $6,000/year |
| Manual Work Reduction | 85%         |

---

# 14. Challenges & Solutions

| Challenge            | Solution             |
| -------------------- | -------------------- |
| Camera inconsistency | Data augmentation    |
| High load processing | Celery async queue   |
| API dependency cost  | Fully local ML model |
| Race conditions      | DB state machine     |
| Limited compute      | EfficientNetV2 Small |

---

# 15. Contributions

### AI/ML Engineering

* Dataset collection & labeling
* Model training & optimization
* EfficientNetV2 integration
* Inference pipeline design

### Backend Engineering

* Django API development
* Celery task system
* Database schema design
* Alert system integration

---

# 16. Future Improvements

* WebSocket real-time dashboard
* Predictive overflow forecasting
* IoT sensor integration
* Mobile technician app
* Multi-model ensemble system
* Anomaly detection (spills, damage)

---

# 17. Confidentiality Notice

🔒 This is a **closed-source enterprise system**.
Source code, infrastructure credentials, and internal deployment details are not publicly available.

This document is intended for:

* Portfolio demonstration
* Technical evaluation
* System architecture overview

---

# 18. Contact

**Basharul - Alam - Mazu**
AI/ML Engineer & Backend Developer
🌐 [https://basharulalammazu.github.io](https://basharulalammazu.github.io)

---