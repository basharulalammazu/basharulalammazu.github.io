# AC Automation, Scheduling & Manual Control

### AI-Assisted Multi-Store HVAC Automation & Centralized Control Platform

---

```text
Prepared by:  Basharul - Alam - Mazu

Role:         Software Engineer – AI/ML & Backend

Date:         September 2026

Status:       🔒 Closed Source / Private Enterprise Project

Stage:        Production
```

---

## 1. Project Overview

**AC Automation, Scheduling & Manual Control** is a centralized HVAC management platform designed to monitor, schedule, automate, and manually control multiple AC units across multiple stores.

The platform combines **real-time environmental monitoring, configurable AC scheduling, automated ON/OFF control, AC rotation, manual remote control, and AI-assisted AC behavior analysis** into a unified dashboard.

The system follows a hierarchical **Store → Room → AC** architecture, allowing individual ACs or groups of ACs to be managed independently while maintaining centralized visibility across multiple locations.

**The Problem:**

Managing multiple AC units across multiple stores using independent remote controls or fixed schedules creates several operational challenges. ACs may remain unnecessarily active, schedules may not match actual room conditions, and operators have limited visibility into the current state and historical behavior of individual units.

Manual operation also becomes difficult as the number of stores and AC units increases. Operators need a way to centrally monitor AC status, apply schedules, manually override automated operation, and use environmental data to make more informed control decisions.

**The Solution:**

The platform provides a centralized dashboard where operators can configure AC schedules, monitor room conditions, manually control individual AC units, and automate AC operation across multiple stores.

The system uses environmental and AC-state data such as **room temperature, room humidity, fan speed, AC mode, set temperature, and ON/OFF state** to support intelligent monitoring and AI-assisted prediction.

A scheduling and automation layer evaluates configured operating periods and current conditions to execute AC control actions, while manual controls allow authorized users to override automated behavior when required.

**My Role:**

Software engineering across backend, AI/ML integration, automation, and dashboard workflows — including Django backend development, REST API design, AC scheduling logic, MQTT communication, manual control workflows, AI-based AC behavior analysis, background task processing, and multi-store/multi-AC management.

---

## 2. Problem Statement

| Pain Point                            | Impact                                                     |
| ------------------------------------- | ---------------------------------------------------------- |
| Multiple ACs across different stores  | Difficult to monitor and manage centrally                  |
| Manual AC operation                   | High operational effort and inconsistent control           |
| Fixed schedules                       | Cannot respond to changing room conditions                 |
| No centralized AC control             | Operators must manage units individually                   |
| Multiple ACs operating simultaneously | Can result in unnecessary AC operation                     |
| Limited historical operating data     | Difficult to analyze AC behavior over time                 |
| No intelligent monitoring             | Abnormal operating patterns may remain unnoticed           |
| Automatic and manual control conflict | Manual intervention can interfere with scheduled operation |

The platform addresses these challenges by combining **centralized monitoring, configurable scheduling, automated control, manual override, AC rotation, and AI-assisted analysis**.

---

## 3. Technologies Used

| Layer                 | Technology                              | Purpose                                                                    |
| --------------------- | --------------------------------------- | -------------------------------------------------------------------------- |
| **Backend**           | Python · Django · Django REST Framework | Core backend, APIs, business logic                                         |
| **Frontend**          | React · Next.js · TypeScript            | Management and monitoring dashboard                                        |
| **Database**          | MySQL                                   | Stores, rooms, AC configurations, schedules, readings, and control history |
| **IoT Communication** | MQTT                                    | AC/device communication and telemetry                                      |
| **Task Processing**   | Celery                                  | Asynchronous automation and background processing                          |
| **Scheduling**        | Celery / django-crontab                 | Automated AC schedule execution                                            |
| **AI / ML**           | Python · scikit-learn / ML pipelines    | AC behavior analysis and prediction                                        |
| **Data Processing**   | pandas · numpy                          | Sensor processing and feature engineering                                  |
| **API Security**      | JWT                                     | Secure authenticated API access                                            |
| **Dashboard**         | React / Next.js / TypeScript            | Centralized AC monitoring and control                                      |

---

## 4. Key Features

* **Multi-Store AC Management** — Centralized management of multiple stores, rooms, and AC units from a single platform

* **Automatic AC Scheduling** — Configurable schedules for automatically turning AC units ON/OFF according to store and AC operating requirements

* **Manual AC Control** — Authorized users can remotely control individual AC units and override automated schedules

* **AC Rotation** — Supports rotating AC operation across multiple units to avoid unnecessary simultaneous operation while maintaining required cooling conditions

* **Real-Time Monitoring** — Displays current AC state and environmental conditions through a centralized dashboard

* **Environmental Monitoring** — Uses room temperature, humidity, fan speed, AC mode, set temperature, and ON/OFF state for operational analysis

* **AI-Assisted AC Prediction** — Analyzes AC and environmental behavior to identify abnormal operating patterns and support maintenance-risk detection

* **Store-Wise Management** — ACs can be grouped and managed according to individual store configurations

* **AC-Wise Management** — Individual AC configuration, scheduling, monitoring, and control are supported

* **Automated Background Processing** — Scheduling, monitoring, and automation tasks execute asynchronously without blocking API operations

* **Centralized Control Dashboard** — Provides operators with a single interface for monitoring, scheduling, automation, and manual control

* **Control History** — Maintains operational records that can be used to analyze AC behavior and automation performance

---

## 5. System Architecture

### High-Level Component Flow

```text
┌────────────────────────────────────────────────────────┐
│                    AC / IoT Layer                      │
│     Multiple Stores · Rooms · AC Units · Sensors      │
└─────────────────────────┬──────────────────────────────┘
                          │
                          │ MQTT
                          ▼
                ┌─────────────────────┐
                │    MQTT Broker      │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   Django Backend    │
                │   REST API Layer    │
                └──────────┬──────────┘
                           │
             ┌─────────────┼──────────────┐
             │             │              │
             ▼             ▼              ▼
      ┌────────────┐ ┌────────────┐ ┌──────────────┐
      │ Scheduling │ │ AI / ML    │ │ Manual       │
      │ Engine     │ │ Analysis   │ │ Control      │
      └─────┬──────┘ └─────┬──────┘ └──────┬───────┘
            │              │               │
            └──────────────┼───────────────┘
                           ▼
                 ┌─────────────────────┐
                 │  Control / Decision │
                 │       Engine        │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │    AC Commands      │
                 │      ON / OFF       │
                 └─────────────────────┘


                 ┌─────────────────────┐
                 │   Web Dashboard     │
                 │ React / Next.js / TS│
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ REST API / Backend  │
                 └─────────────────────┘
```

### Core Data Flow

```text
AC / Sensor Data
       │
       ▼
   MQTT Broker
       │
       ▼
 Django Backend
       │
       ├──────────────► Database
       │
       ├──────────────► AI / ML Analysis
       │
       ├──────────────► Schedule Evaluation
       │
       └──────────────► Control Logic
                              │
                              ▼
                         AC Command
```

---

## Key Design Decisions

### Why MQTT for AC Communication?

MQTT provides a lightweight publish/subscribe communication model suitable for connected devices and automation systems.

Instead of repeatedly polling every AC, the platform can exchange device state and control messages through MQTT topics.

This provides a foundation for managing multiple AC units while keeping device communication decoupled from the main application.

---

### Why Separate Scheduling and Manual Control?

Automatic scheduling and manual control represent two different operational requirements.

The scheduler determines:

```text
What should happen automatically?
```

while manual control determines:

```text
What does the operator want to do right now?
```

Separating these responsibilities allows manual commands to temporarily override automated operation without modifying the underlying schedule configuration.

---

### Why Separate AI Analysis from Control Logic?

AI predictions should provide information about AC behavior rather than directly executing unrestricted control decisions.

The architecture therefore separates:

```text
AI / ML
   ↓
Prediction / Analysis
   ↓
Decision Logic
   ↓
AC Control
```

This makes the automation layer easier to validate, monitor, and modify independently from the ML models.

---

## 6. Dashboard

The centralized dashboard provides operators with visibility and control across multiple stores.

| Screen                     | Description                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------- |
| **Dashboard Overview**     | Store-level summary of AC states, active units, schedules, and environmental conditions |
| **Store Management**       | View and manage AC units associated with individual stores                              |
| **AC Management**          | Individual AC status, configuration, and control                                        |
| **Scheduling**             | Create and manage automatic AC schedules                                                |
| **Manual Control**         | Remotely control individual AC units and override automation                            |
| **Automation Monitor**     | View current automation mode and scheduled operations                                   |
| **Temperature Monitoring** | Monitor room temperature and target temperature                                         |
| **AI / Prediction View**   | View AC behavior analysis and prediction indicators                                     |
| **History**                | Review AC states and control events over time                                           |

---

## 7. My Contributions

### Multi-Store / Multi-AC Architecture

* Designed the application structure around a **Store → Room → AC** hierarchy

* Implemented backend data models and APIs for managing multiple stores and AC units

* Developed store-wise and AC-wise management workflows

* Designed the architecture to allow additional stores and AC units without changing the core application logic

### AC Scheduling

* Developed configurable AC scheduling functionality

* Implemented automated ON/OFF operations based on configured schedules

* Built scheduling workflows for individual AC units and store-level operations

* Implemented AC rotation logic for multi-AC environments

* Integrated scheduled background tasks to execute automation without blocking API requests

### Manual Control

* Developed remote manual control functionality for individual AC units

* Implemented manual override behavior for scheduled automation

* Connected dashboard actions with backend control APIs and device communication

* Maintained separation between manual commands and automatic scheduling logic

### AI / ML Integration

* Integrated AI-assisted analysis using environmental and AC operating parameters

* Used features including:

```text
Room Temperature
Room Humidity
Fan Speed
AC Mode
Set Temperature
AC ON/OFF State
Timestamp
```

* Developed data-processing workflows for preparing AC telemetry for model inference

* Implemented prediction and abnormal-behavior analysis workflows

* Designed the system to support future expansion into predictive maintenance and intelligent scheduling

### MQTT Integration

* Integrated MQTT-based communication between backend services and AC/device infrastructure

* Implemented device state and control-message workflows

* Connected AC control actions from the dashboard to the automation communication layer

### Backend & REST APIs

* Developed Django and Django REST Framework APIs for:

  * Store management
  * AC management
  * Scheduling
  * Manual control
  * AC status
  * Sensor data
  * Automation configuration
  * Historical data

* Implemented authenticated API access using JWT

### Background Processing

* Implemented background tasks for scheduled AC operations and automation workflows

* Separated time-consuming automation processes from synchronous API requests

* Designed task execution to support continuous operation across multiple stores

---

## 8. Automation & Control Logic

The system combines multiple inputs before executing automated AC operations.

```text
Current Room Temperature
          +
Target Temperature
          +
AC Current State
          +
Configured Schedule
          +
Store Operating Hours
          +
AC Rotation State
          +
AI / ML Analysis
          │
          ▼
   Automation Engine
          │
          ▼
     Control Decision
          │
       ┌──┴──┐
       ▼     ▼
      ON     OFF
```

For example, multiple ACs may initially operate together:

```text
AC-01  ON
AC-02  ON
AC-03  ON
AC-04  ON
```

After a configured operating period, the rotation strategy can change the active units:

```text
AC-01  OFF
AC-02  ON
AC-03  ON
AC-04  ON
```

The exact decision can be configured according to the store's operating requirements and automation strategy.

---

## 9. AI-Based AC Analysis

The AI layer is designed to learn and analyze normal AC operating behavior from available telemetry.

### Input Features

```text
Room Temperature
Room Humidity
Fan Speed
AC Mode
Set Temperature
AC ON/OFF
Timestamp
Store
AC
```

### Processing

```text
Raw AC Data
      ↓
Data Validation
      ↓
Feature Engineering
      ↓
Historical Context
      ↓
ML Model
      ↓
Prediction / Anomaly Score
      ↓
AC Behavior Indicator
```

The resulting indicators can support:

```text
Normal
Warning
Maintenance Risk
```

These indicators represent **data-driven operating patterns**, rather than direct confirmation of a specific mechanical fault.

---

## 10. Cooling Performance Analysis

The system can evaluate the relationship between room temperature and target temperature.

A basic temperature error can be represented as:

```text
Temperature Error =
Room Temperature - Set Temperature
```

For example:

```text
Room Temperature = 27°C
Set Temperature  = 24°C

Temperature Error = 3°C
```

The system can then analyze how this error changes over time.

```text
Room Temperature
        │
        ▼
27°C ────────┐
             │
26°C ────────┤
             │
25°C ────────┤
             │
24°C ────────┴──────── Target
             Time →
```

This provides a basis for evaluating cooling response and identifying behavior that differs from an AC's historical baseline.

---

## 11. Challenges & Solutions

| Challenge                                | Root Cause                                                 | Solution                                                      |
| ---------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------- |
| Managing multiple ACs                    | Multiple stores contain different numbers of AC units      | Store → Room → AC hierarchical architecture                   |
| Fixed schedules are inflexible           | Room conditions can change during operation                | Combine schedules with environmental and operational data     |
| Manual control conflicts with automation | Operator intervention can occur during scheduled operation | Manual override layer separated from scheduling engine        |
| Multiple ACs operating simultaneously    | Fixed operation may not account for AC rotation            | Configurable AC rotation strategy                             |
| Different store operating hours          | Stores do not necessarily operate on identical schedules   | Store-specific operating configuration                        |
| AI data limitations                      | No direct measurement of every internal AC component       | AI analysis restricted to observable sensor and AC-state data |
| Missing readings                         | ACs may intentionally be OFF or stores may be closed       | Distinguish operational state from missing telemetry          |
| Automation blocking API operations       | Scheduling and device processing can be time-consuming     | Background task processing                                    |
| Scaling to additional stores             | Hardcoded device logic becomes difficult to maintain       | Configuration-driven multi-store architecture                 |

---

## 12. Results & Impact

| Metric                  | Result                                                              |
| ----------------------- | ------------------------------------------------------------------- |
| **AC management**       | Multiple AC units managed through a centralized platform            |
| **Store management**    | Multiple stores supported through a unified architecture            |
| **Control modes**       | Automatic scheduling + manual remote control                        |
| **Automation**          | Configurable ON/OFF scheduling and AC rotation                      |
| **Monitoring**          | Real-time AC and environmental monitoring                           |
| **AI indicators**       | AC behavior analysis and prediction                                 |
| **Communication**       | MQTT-based device communication                                     |
| **Backend**             | Django REST APIs with centralized business logic                    |
| **Frontend**            | React / Next.js / TypeScript dashboard                              |
| **Processing**          | Background scheduling and automation tasks                          |
| **Operational benefit** | Centralized visibility and control of distributed AC infrastructure |

---

## 13. Future Improvements

* **Energy Consumption Monitoring** — Integrate power/current sensors to measure actual AC energy consumption and calculate energy savings

* **Compressor State Detection** — Add direct compressor-state data or develop a validated estimator using AC telemetry

* **Advanced Predictive Maintenance** — Use longer historical datasets and temporal ML models such as LSTM Autoencoders to detect persistent abnormal behavior

* **Temperature Forecasting** — Predict room temperature over the next 5, 15, and 30 minutes to improve automated scheduling decisions

* **Intelligent Scheduling** — Replace fixed rotation rules with optimization based on temperature, AC performance, operating requirements, and historical behavior

* **Occupancy-Aware Control** — Incorporate room occupancy to automatically adjust AC operation according to actual usage

* **Weather Integration** — Incorporate outdoor temperature, humidity, and weather conditions into cooling prediction

* **Energy Optimization** — Develop an optimization engine that balances temperature comfort, AC runtime, switching frequency, and energy consumption

* **Real-Time WebSocket Monitoring** — Replace dashboard polling with WebSocket-based live updates for faster state synchronization

* **Predictive Alerts** — Detect gradual degradation and notify operators before cooling performance reaches an unacceptable level

---

## 14. Confidentiality Notice

> 🔒 **Source code, production configurations, device identifiers, and operational data are not publicly available** due to organizational confidentiality and proprietary restrictions.
>
> This document is intended solely to showcase the system architecture, engineering approach, technology decisions, and individual contributions. Store names, AC identifiers, sensor configurations, and production data have been omitted.
>
> For detailed technical discussion about specific implementation decisions, AI/ML methodology, automation logic, or architecture choices, please reach out directly.

---

## 15. Contact

**Basharul - Alam - Mazu**

Software Engineer – AI/ML & Backend

🔗 basharulalammazu.github.io

---

*Document Version: 1.0 · Last Updated: September 2026 · Status: Production*
