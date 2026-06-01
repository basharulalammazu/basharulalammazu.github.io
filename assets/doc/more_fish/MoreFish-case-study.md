# MoreFish — AI Aquaculture Monitoring System

> 🔒 Private Enterprise Project

AI-powered aquaculture monitoring system for near real-time water quality monitoring and ammonium estimation using IoT sensors, MQTT ingestion, background processing, and machine learning.

---

## Overview

**What it does**
- Collects raw sensor telemetry (pH, TDS, temperature, device/gateway status, battery/solar signals) from farm devices.
- Ingests telemetry via MQTT and persists both raw packets and processed measurements.
- Runs ML inference in the background to derive higher-level metrics (e.g., dissolved oxygen and ammonium-related predictions).
- Triggers threshold-based alerts to users (push notifications) and supports reporting/export.

**Who it’s for**
- Farm operators and operations teams who need visibility into pond/hatchery conditions and early warnings.

---

## Features

- **Real-time(ish) monitoring pipeline**: MQTT telemetry ingestion → DB storage → API/dashboard.
- **ML inference in background**:
  - Dissolved oxygen prediction using scikit-learn models.
  - Ammonium-related prediction using a saved PyTorch model.
- **Celery-based task processing** (with scheduled jobs).
- **Threshold alerts** with notification history + mobile push delivery.
- **Calibration-aware sensor conversion** (device calibration values applied to raw readings).
- **Weather integration** (periodic fetch and association with assets/locations).
- **Exports & reports** (CSV/Excel generation endpoints).

---

## Screenshots (use blurred/mock data)

Add these images (recommended):
- Dashboard overview
- Asset/Pond list with current status
- Sensor charts (pH / TDS / Temperature / DO / Ammonia)
- Login page
- Notification list / alert popup
- AI prediction result view
- Architecture diagram

Suggested file naming:
- `/assets/projects/morefish/dashboard.png`
- `/assets/projects/morefish/charts.png`
- `/assets/projects/morefish/login.png`
- `/assets/projects/morefish/monitoring.png`
- `/assets/projects/morefish/prediction.png`
- `/assets/projects/morefish/architecture.png`

---

## Tech Stack

**Backend / APIs**
- Python
- Django
- Django REST Framework (DRF)
- JWT auth

**Async / Scheduling**
- Celery
- django-celery-beat
- django-celery-results

**IoT / Messaging**
- MQTT (paho-mqtt)

**Data / Storage**
- MySQL (mysqlclient / PyMySQL)
- Redis (broker/result backend)

**ML / Data**
- scikit-learn
- pandas, numpy
- PyTorch (for NH3 model inference)

**Notifications / Integrations**
- FCM push notifications (pyfcm)
- Weather API (Open-Meteo)

---

## Architecture

### High-level flow

```mermaid
flowchart TD
  S[Sensors / IoT Devices] --> G[Gateway]
  G -->|MQTT publish| B[MQTT Broker]

  B --> I1[MQTT ingestion scripts]
  I1 --> R1[(DeviceRawData table)]

  R1 -->|post_save signal| C1[Celery task: save_device_data]
  C1 --> M1[ML inference (DO / NH3)]
  C1 --> D1[(DeviceData table)]

  D1 --> N1[Celery task: send_threshold_notification]
  N1 --> F1[FCM Push]

  D1 --> A1[Django Admin / REST APIs]
  A1 --> UI[Dashboard / Mobile App]

  W1[Open-Meteo API] -->|scheduled| W2[Weather records]
  W2 --> C1
```

### Concrete implementation mapping (from this repo)

**MQTT ingestion**
- Subscribes to configured topics and republishes/bridges raw messages for downstream processing.
- Raw insert is done by subscribing to a “raw insertion” topic and persisting the packet.

Relevant files:
- `mqtt_data_acquisition.py` (topic subscription + republish)
- `raw_data_insertion.py` (MQTT → `DeviceRawData` creation)

**Raw → processed pipeline**
- `DeviceRawData` triggers a `post_save` receiver which queues background processing.

Relevant file:
- `device/models.py` (post-save hook that calls `save_device_data.delay(...)`)

**Celery processing + ML**
- Background task calculates calibrated sensor values and runs ML inference.

Relevant file:
- `device/tasks.py` (`save_device_data` task)

**ML predictors**
- DO prediction loads multiple pickled models and combines predictions.
- NH3 prediction loads a saved PyTorch `.pth` model.

Relevant files:
- `files/nawid_training.py`
- `files/nh3_predict.py`

**Notifications**
- Applies per-device thresholds and sends FCM notifications.

Relevant file:
- `notification/tasks.py`

**Scheduling**
- Periodic weather fetching and storing for contextual features.

Relevant file:
- `dmaiot/celery.py`

---

## Challenges & Solutions (recruiter-friendly)

### Challenge 1 — Noisy / inconsistent raw sensor readings
**Problem**: Raw analog values can drift and vary by device model.

**Solution**:
- Applied calibration-aware conversion functions and per-device calibration values.
- Implemented invalid-value checks and threshold rules to reduce false alarms.

### Challenge 2 — Doing ML inference without blocking ingestion
**Problem**: Running inference synchronously can slow down ingestion and API response times.

**Solution**:
- Offloaded processing to Celery workers.
- Saved both raw packets and processed records so the system can reprocess if needed.

### Challenge 3 — Alert fatigue (duplicate notifications)
**Problem**: Frequent updates can spam users.

**Solution**:
- Added notification history checks and condition-based dispatch before sending pushes.

---

## Your Contribution (customize this)

Pick the items that match what you actually did:
- Designed the MQTT ingestion + raw persistence pipeline.
- Implemented Celery tasks and routing for device processing + notifications.
- Integrated ML inference (DO + NH3) into the backend pipeline.
- Built threshold/invalid-value logic to improve alert quality.
- Implemented REST APIs for monitoring, history, and exports.
- Improved reliability (reconnect logic, idempotent writes, atomic DB transactions).

---

## Confidentiality Notice

🔒 Source code and production data are not publicly available due to organizational confidentiality and proprietary restrictions.

This case study focuses on architecture, technologies, and engineering contributions.

---

## Documentation PDF

Add a PDF and link it from your portfolio:

- Button label: **Documentation PDF**
- Suggested path: `/docs/morefish-case-study.pdf`

Minimal link example:

```md
[Documentation PDF](/docs/morefish-case-study.pdf)
```
