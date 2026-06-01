# MoreFish
### AI-Powered Aquaculture Monitoring & Water Quality Intelligence Platform

---

```
Prepared by:  Basharul - Alam - Mazu
Role:         Backend & ML Integration Engineer
Date:         June 2026
Status:       🔒 Closed Source / Private Enterprise Project
Stage:        Production
```

---

## 1. Project Overview

**MoreFish** is an AI-powered aquaculture monitoring platform that gives fish farm operators real-time visibility into pond and hatchery conditions. It ingests sensor telemetry from IoT field devices over MQTT, processes raw readings through calibration-aware pipelines, runs machine learning inference to estimate key water quality indicators, and delivers threshold-based alerts to operators — all through a background-processing architecture that keeps the API fast and the data flowing continuously.

**The Problem:**
Fish farming is highly sensitive to water quality. Parameters like dissolved oxygen (DO) and ammonia/ammonium (NH3) directly determine survival rates — a brief spike in ammonia or a drop in oxygen can kill an entire pond's stock within hours. Traditional monitoring relies on periodic manual testing, which is too infrequent to catch sudden changes and too labor-intensive to scale across multiple ponds or farms. Operators have no real-time visibility, no automated early warnings, and no historical data to detect gradual degradation trends.

**The Solution:**
MoreFish connects IoT sensors deployed at the pond edge (measuring pH, temperature, TDS, battery, and solar status) to a cloud backend via MQTT. Raw sensor packets are ingested, persisted, and immediately queued for background processing. A Celery worker applies calibration corrections, contextualizes readings with local weather data, and runs ML models to predict dissolved oxygen and ammonium levels — two parameters that are difficult or costly to measure directly in the field. Operators receive push notifications the moment a threshold is breached and can review full historical trends through the REST API and dashboard.

**My Role:** Backend and ML integration engineering — MQTT ingestion pipeline, Celery task architecture, ML model integration (DO prediction and NH3/ammonium inference), threshold alerting logic, REST API development, and reliability improvements.

---

## 2. Problem Statement

| Pain Point | Impact |
|---|---|
| Manual water quality testing is infrequent | Dangerous parameter spikes go undetected for hours |
| No real-time visibility across multiple ponds | Operators cannot monitor more than a few sites manually |
| DO and NH3 are expensive to measure directly | Critical parameters left unmonitored in most deployments |
| Sensor raw values drift and vary by device | Unreliable readings cause false alerts or missed events |
| Alert fatigue from redundant notifications | Operators start ignoring warnings, defeating the purpose |
| No historical trend data | No way to detect gradual water quality degradation |

MoreFish addresses all six by combining continuous IoT ingestion, calibration-aware processing, ML-derived indicators, and intelligent alert dispatch.

---

## 3. Technologies Used

| Layer | Technology | Purpose |
|---|---|---|
| **Backend** | Python · Django · Django REST Framework | Core API, ORM, admin interface |
| **Authentication** | JWT (SimpleJWT) | Secure API access |
| **IoT Messaging** | MQTT (paho-mqtt) | Real-time telemetry ingestion from field sensors |
| **Task Queue** | Celery + django-celery-beat + django-celery-results | Async background processing and scheduled jobs |
| **Message Broker** | Redis | Celery broker and result backend |
| **Database** | MySQL (mysqlclient / PyMySQL) | Persistent storage for raw and processed data |
| **ML — DO Prediction** | scikit-learn (ensemble of pickled models) | Dissolved oxygen estimation from sensor inputs |
| **ML — NH3 Prediction** | PyTorch (`.pth` model) | Ammonium level inference |
| **Data Processing** | pandas · numpy | Sensor value transformation and feature engineering |
| **Push Notifications** | FCM (pyfcm) | Mobile alerts when thresholds are breached |
| **Weather Integration** | Open-Meteo API | Contextual weather features for ML inference |
| **Exports** | CSV / Excel generation endpoints | Operational reporting for farm managers |

---

## 4. Key Features

- **MQTT Telemetry Ingestion** — Subscribes to sensor topics, bridges raw packets to a persistence topic, and writes `DeviceRawData` records with zero data loss
- **Calibration-Aware Processing** — Each device has stored calibration coefficients; raw analog values are converted to physical units (pH units, mg/L, °C) before storage or inference
- **Dissolved Oxygen Prediction** — Ensemble of scikit-learn models predicts DO from pH, temperature, TDS, and weather contextual features — no direct DO sensor required
- **Ammonium Inference** — PyTorch neural network estimates NH3 levels from processed sensor readings, enabling early toxicity warnings without expensive chemical sensors
- **Celery Background Processing** — All heavy computation (calibration, ML inference, alert evaluation) runs asynchronously; MQTT ingestion and API responses are never blocked
- **Threshold-Based Smart Alerting** — Per-device threshold configuration; notification history checked before dispatch to prevent duplicate alerts and reduce operator fatigue
- **FCM Push Notifications** — Alerts delivered to operator mobile devices the moment a threshold is breached, with notification history tracking
- **Weather Context Integration** — Periodic Open-Meteo API calls associate local weather conditions (temperature, humidity, precipitation) with farm assets for richer ML features
- **REST API with Full History** — JWT-authenticated endpoints for current status, historical time-series, per-device readings, and farm-level aggregates
- **CSV / Excel Export** — Operations teams can export any date range for offline analysis and reporting
- **Invalid Value Guards** — Out-of-range sensor readings are detected, flagged, and excluded from ML inference to prevent corrupted predictions

---

## 5. System Architecture

### High-Level Component Flow

```
┌────────────────────────────────────────────────────────┐
│            IoT Layer — Field Devices                   │
│   Sensors: pH · TDS · Temperature · Battery · Solar   │
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼ MQTT publish
                 ┌─────────────────┐
                 │   MQTT Broker   │
                 └────────┬────────┘
                          │
           ┌──────────────┴──────────────┐
           ▼                             ▼
  ┌─────────────────┐          ┌──────────────────────┐
  │ mqtt_data_       │          │ raw_data_insertion   │
  │ acquisition.py  │          │ .py                  │
  │ (subscribe +    │          │ (MQTT → DeviceRawData│
  │  republish)     │          │  table write)        │
  └─────────────────┘          └──────────┬───────────┘
                                          │
                                          ▼ post_save signal
                               ┌──────────────────────┐
                               │  device/models.py    │
                               │  save_device_data    │
                               │  .delay(...)         │
                               └──────────┬───────────┘
                                          │
                                          ▼ Celery async task
                    ┌─────────────────────────────────────────┐
                    │         device/tasks.py                 │
                    │  save_device_data Task                  │
                    │                                         │
                    │  1. Apply calibration coefficients      │
                    │  2. Validate sensor value ranges        │
                    │  3. Fetch associated weather record     │
                    │  4. Run DO inference (scikit-learn)     │
                    │  5. Run NH3 inference (PyTorch)         │
                    │  6. Persist → DeviceData table          │
                    └──────────────┬──────────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────────┐
                    │                                         │
                    ▼                                         ▼
         ┌────────────────────┐               ┌──────────────────────┐
         │  notification/     │               │  Django Admin +      │
         │  tasks.py          │               │  REST APIs (DRF)     │
         │                    │               │                      │
         │  • Check threshold │               │  Dashboard · History │
         │  • Check notif     │               │  Exports · Reports   │
         │    history         │               └──────────────────────┘
         │  • Dispatch FCM    │
         └─────────┬──────────┘
                   │
                   ▼
         ┌─────────────────┐      ┌───────────────────────┐
         │  FCM Push       │      │  Open-Meteo API       │
         │  Notifications  │      │  (scheduled weather   │
         │  → Mobile App   │      │   fetch via Celery)   │
         └─────────────────┘      └───────────────────────┘
```

### Key Design Decisions

**Why MQTT over HTTP polling?**
IoT field devices have constrained radios and intermittent connectivity. MQTT's lightweight publish/subscribe protocol is designed for exactly this — low overhead, persistent sessions, and guaranteed message delivery (QoS levels). HTTP polling from dozens of devices would require always-on connectivity and waste bandwidth.

**Why decouple ingestion from processing via Celery?**
The raw ingestion path (MQTT → DB write) needs to be fast and reliable regardless of how long ML inference takes. By triggering a Celery task via `post_save` signal, ingestion completes immediately and inference happens asynchronously. This also makes the system resilient — if a Celery worker is overloaded or restarting, raw data is already safely persisted and can be reprocessed.

**Why two separate ML models (scikit-learn for DO, PyTorch for NH3)?**
The two parameters have different data characteristics and were developed independently. DO prediction benefits from an ensemble of simpler regression models that can be quickly retrained as new sensor data arrives. NH3 estimation involves more complex non-linear relationships that a neural network handles better. Keeping them separate also allows independent updates and A/B testing.

---

## 6. Screenshots

> *Dashboard and monitoring views available internally. Key screens include:*

| Screen | Description |
|---|---|
| **Dashboard Overview** | Farm-level summary: all ponds, current parameter status, active alerts |
| **Pond / Asset Detail** | Real-time and historical charts for pH, TDS, temperature, DO, and NH3 per pond |
| **Sensor Charts** | Time-series line charts with threshold overlays and anomaly markers |
| **Prediction View** | ML-estimated DO and NH3 values alongside raw sensor readings |
| **Alert / Notification List** | Threshold breach history per device with timestamp, value, and acknowledgment status |
| **Export Interface** | Date-range selector for CSV/Excel report generation |
| **Admin Panel** | Django admin for device registration, calibration values, and threshold configuration |

---

## 7. My Contributions

### MQTT Ingestion Pipeline

- Designed and implemented the two-script MQTT architecture: `mqtt_data_acquisition.py` subscribes to device topics and republishes to a normalized ingestion topic; `raw_data_insertion.py` consumes that topic and writes `DeviceRawData` records atomically
- Implemented reconnect logic so ingestion recovers automatically from broker disconnects without data loss
- Built idempotent write guards to prevent duplicate raw records during reconnection bursts

### Celery Task Architecture

- Implemented the `save_device_data` Celery task in `device/tasks.py` — the core processing unit that handles calibration, validation, ML inference, DB persistence, and notification queuing in a single atomic flow
- Configured Celery routing so ingestion-critical tasks (device data) and lower-priority tasks (weather fetch, report generation) run on separate worker queues
- Added retry logic with exponential backoff for transient DB and ML inference failures
- Set up `django-celery-beat` periodic schedule for weather fetching and maintenance jobs

### ML Integration

- Integrated the dissolved oxygen prediction ensemble: loads multiple pickled scikit-learn models, runs each, and combines outputs for a more robust DO estimate
- Integrated the NH3 PyTorch model (`.pth` checkpoint): handles model loading, input tensor construction from processed sensor features, and output parsing
- Built the feature engineering step that combines calibrated sensor readings with associated weather data (temperature, humidity) before passing inputs to ML models
- Implemented model loading with caching (load once per worker, reuse across tasks) to avoid repeated disk I/O

### Alert & Notification Logic

- Built `notification/tasks.py`: evaluates current device readings against per-device threshold configs, checks notification history to prevent duplicate alerts, and dispatches FCM push via `pyfcm`
- Implemented per-parameter threshold configuration (separate upper/lower bounds for pH, DO, NH3, temperature) stored per device in the database
- Added invalid-value detection: readings outside physically plausible ranges are flagged and excluded from both ML inference and alert evaluation

### REST API & Exports

- Built DRF viewsets for current device status, historical readings, per-pond aggregates, and notification history
- Implemented CSV and Excel export endpoints with configurable date-range filtering
- Wrote serializers handling the raw/processed data split — API consumers always receive calibrated, validated values

---

## 8. Challenges & Solutions

| Challenge | Root Cause | Solution |
|---|---|---|
| Noisy and drifting raw sensor values | Analog sensors vary by device age, temperature, and hardware batch | Per-device calibration coefficients stored in DB; conversion functions applied before any processing or inference |
| ML inference blocking the ingestion path | Synchronous inference in the save path would slow every sensor reading | `post_save` signal fires `save_device_data.delay()` — ingestion completes in milliseconds; inference runs fully async |
| Alert fatigue from duplicate notifications | High-frequency sensor updates trigger repeated threshold breaches | Notification history check before dispatch; same-parameter alerts suppressed within a configurable cooldown window |
| MQTT reconnection data gaps | Broker restarts or network drops could silently lose packets | Reconnect logic with session persistence (MQTT clean_session=False); broker-side message queuing preserves packets during outages |
| Weather API unavailability affecting inference | Open-Meteo outages left weather features null | ML inference uses last-known-good weather record as fallback; inference still runs with degraded (but non-null) features |
| MySQL write contention at high ingestion rates | Multiple MQTT consumers writing simultaneously | Atomic ORM transactions + unique constraints on device/timestamp prevent duplicate records under concurrent writes |

---

## 9. Results & Impact

| Metric | Result |
|---|---|
| **Sensor parameters monitored** | pH · TDS · Temperature · DO (predicted) · NH3 (predicted) · Battery · Solar |
| **ML-derived indicators** | Dissolved oxygen + ammonium — both estimated without direct sensors |
| **Alert delivery latency** | Seconds from threshold breach to FCM push notification |
| **Processing model** | Fully async — ingestion path never blocked by inference |
| **Reprocessing capability** | Raw data always preserved; any record can be reprocessed with updated models |
| **Manual monitoring replaced** | Continuous automated monitoring vs. periodic manual testing |
| **Export coverage** | Full historical data exportable as CSV / Excel for any date range |
| **Operator benefit** | Early warnings for DO drops and NH3 spikes — critical survival parameters caught before stock loss |

---

## 10. Future Improvements

- **Predictive Alerts** — Move from threshold-based to ML-based predictive alerting: forecast parameter trajectories and warn operators before a breach occurs rather than after
- **Anomaly Detection** — Unsupervised models to flag unusual sensor behavior patterns that don't breach fixed thresholds but indicate equipment issues or pond stress
- **Multi-Farm Federation** — Aggregate dashboards across multiple farm sites with cross-farm benchmarking
- **Direct NH3 Sensor Integration** — When direct ammonium sensors are deployed, use measured values to continuously retrain and validate the inference model
- **WebSocket Real-Time Feed** — Replace dashboard polling with WebSocket push for instant parameter updates
- **Edge Inference** — Move lightweight ML inference onto gateway hardware to reduce cloud dependency and latency for critical alerts

---

## 11. Confidentiality Notice

> 🔒 **Source code and production data are not publicly available** due to organizational confidentiality and proprietary restrictions.
>
> This document is intended solely to showcase system architecture, engineering approach, technology decisions, and individual contributions. All farm names, device identifiers, sensor calibration values, and customer data have been omitted.
>
> For detailed technical discussion about specific implementation decisions, ML methodology, or architecture choices, please reach out directly.

---

## 12. Contact

**Basharul - Alam - Mazu**
Backend & ML Integration Engineer
🔗 [basharulalammazu.github.io](https://basharulalammazu.github.io)

---

*Document Version: 1.0 · Last Updated: June 2026 · Status: Production*
