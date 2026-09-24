# Cow Weight Estimator

### AI-Powered Non-Invasive Cattle Weight Estimation from Images

---

```text
Prepared by:  Basharul - Alam - Mazu

Role:         Computer Vision & ML Engineer

Date:         June 2026

Status:       🔒 Closed Source / Private Project

Stage:        Advanced Development → Production-Ready
```

---

## 1. Project Overview

**Cow Weight Estimator** is a computer vision and deep learning system designed to estimate the live body weight of cattle directly from images, eliminating the need for conventional physical weighing methods.

The system analyzes visual characteristics such as **body shape, size, proportions, muscle distribution, abdomen, rib cage, and hindquarters** to learn the relationship between a cattle image and its corresponding body weight.

The project follows an image-regression approach using custom CNN architectures and transfer learning, with additional object-detection and traditional regression pipelines evaluated as benchmarks.

**The Problem:**

Traditional cattle weighing methods such as weighbridges, measuring tapes, and body-measurement formulas require physical handling, equipment, time, and manual intervention. These methods can also introduce measurement errors and are difficult to scale across large herds.

Image-based weight estimation provides a non-invasive alternative where a camera image can be processed automatically to estimate cattle weight.

**The Solution:**

The system processes a cattle image through an end-to-end computer vision pipeline:

```text
Input Image
     │
     ▼
Image Quality Validation
     │
     ▼
Image Preprocessing
     │
     ├── Image → Array
     ├── Normalization
     └── Histogram Equalization
     │
     ▼
Cattle Detection / ROI Extraction
     │
     ▼
Visual Feature Extraction
     │
     ▼
CNN Regression Model
     │
     ▼
Estimated Weight (kg)
     │
     ▼
Explainable AI / LIME
```

The reference CattleNet-XAI study demonstrates that a custom CNN can estimate cattle weight from 2D images while providing visual explanations of the regions influencing the prediction.

**My Role:**

Designed and implemented the computer vision and machine learning pipeline covering image preprocessing, regression modeling, deep learning experimentation, model evaluation, and explainability-oriented analysis.

---

## 2. Problem Statement

| Pain Point                                         | Impact                                          |
| -------------------------------------------------- | ----------------------------------------------- |
| Physical weighing requires handling                | Animal stress and additional labor              |
| Weighbridges are expensive                         | Difficult for small and medium farms            |
| Manual measurements are time-consuming             | Poor scalability                                |
| Human measurement introduces errors                | Inconsistent weight estimates                   |
| Large herds are difficult to monitor               | Limited continuous management                   |
| Traditional methods provide little automation      | Difficult integration with digital farm systems |
| Black-box AI predictions can be difficult to trust | Limited adoption by farm operators              |

Cow Weight Estimator addresses these limitations by providing a **non-invasive, image-based weight estimation pipeline**.

---

## 3. Technologies Used

| Layer                 | Technology                   | Purpose                              |
| --------------------- | ---------------------------- | ------------------------------------ |
| **Computer Vision**   | OpenCV                       | Image preprocessing and analysis     |
| **ML Framework**      | PyTorch                      | Deep learning training and inference |
| **Deep Learning**     | Custom CNN                   | Direct image-to-weight regression    |
| **Transfer Learning** | EfficientNetB3               | Pre-trained regression benchmark     |
| **Object Detection**  | YOLOv5                       | Cattle detection and ROI extraction  |
| **Regression**        | Linear Regression            | Traditional ML baseline              |
| **Regression**        | Random Forest Regression     | Feature-based baseline               |
| **Explainability**    | LIME                         | Visual interpretation of predictions |
| **Evaluation**        | MAE / MSE / RMSE / R² / MAPE | Regression performance evaluation    |
| **Data Processing**   | NumPy / Pandas               | Dataset and numerical processing     |
| **Deployment**        | PyTorch / ONNX               | Production inference and deployment  |

The reference study evaluated custom CNNs, EfficientNetB3, Random Forest Regression, and Linear Regression, with YOLOv5 used for the feature-extraction pipeline.

---

## 4. Key Features

* **Non-Invasive Weight Estimation** — Estimates cattle weight from images without physical weighing

* **2D Computer Vision** — Uses conventional RGB images instead of requiring specialized 3D hardware

* **Image Preprocessing** — Image-to-array conversion, normalization, and histogram equalization improve input consistency and contrast.

* **Custom CNN Regression** — Directly maps visual cattle features to a continuous weight value

* **YOLOv5 Cattle Detection** — Detects and isolates the cattle body before feature extraction

* **Visual Feature Extraction** — Extracts body dimensions, shape, texture, and pixel-based characteristics

* **Feature Selection** — Uses selected visual features for traditional regression models

* **EfficientNetB3 Benchmark** — Uses transfer learning as a strong deep-learning baseline

* **Multiple Regression Models** — Compares deep learning against Linear Regression and Random Forest Regression

* **Explainable AI** — LIME highlights influential anatomical regions contributing to the estimated weight

* **Error Analysis** — Analyzes residuals and prediction errors to identify model weaknesses

* **Continuous Weight Output** — Produces a numerical estimated weight rather than a classification label

---

## 5. System Architecture

### End-to-End Weight Estimation Pipeline

```text
                    ┌─────────────────────┐
                    │     Input Image     │
                    │  Camera / Upload    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Quality Validation  │
                    │ Resolution / Blur   │
                    │ Format / Visibility │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Preprocessing     │
                    │                     │
                    │ Image → Array       │
                    │ Normalization       │
                    │ Histogram Equalize  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Cattle Detection    │
                    │      YOLOv5         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   ROI Extraction    │
                    │   Full Body Crop    │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
      ┌──────────────────┐          ┌──────────────────┐
      │   Custom CNN     │          │ Feature Pipeline │
      │   3Conv3Dense    │          │ YOLOv5 Features  │
      └────────┬─────────┘          └────────┬─────────┘
               │                             │
               │                    ┌────────┴─────────┐
               │                    │                  │
               │                    ▼                  ▼
               │              Linear Regression   Random Forest
               │
               ▼
      ┌──────────────────┐
      │ Estimated Weight │
      │      (kg)        │
      └────────┬─────────┘
               │
               ▼
      ┌──────────────────┐
      │  LIME Analysis   │
      │ Rib Cage         │
      │ Abdomen          │
      │ Hindquarters     │
      └──────────────────┘
```

The reference architecture explicitly compares a direct CNN/backpropagation pipeline with a YOLOv5 feature-extraction and regression pipeline before selecting models using MAE, MAPE, and RMSE.

---

## 6. Dataset Engineering

The reference implementation uses the **Cow Image Dataset (CID)** containing approximately **17,899 labeled cattle images**, with attributes including breed, colour, feed type, age, teeth count, height, weight, price, and size. The study also reports 2,052 original images from 513 cattle.

### Dataset Attributes

```text
Image
 ├── Breed
 ├── Colour
 ├── Feed Type
 ├── Age
 ├── Teeth Count
 ├── Height
 ├── Weight ← Regression Target
 ├── Price
 └── Size
```

### Breed Distribution

The dataset contains multiple cattle breeds, including:

```text
LOCAL
SAHIWAL
SINDHI
HOSTINE CROSS
RED CHITTAGONG
PABNA BREED
BRAHMA
MIR KADIM
```

The reference dataset is dominated by LOCAL cattle, with additional representation from several Bangladeshi and cross breeds.

---

## 7. Image Preprocessing

### Step 1 — Image to Array

Raw cattle images are converted into numerical RGB arrays so that convolutional networks can process the image data.

```text
Raw Image
    ↓
RGB Image
    ↓
Numerical Tensor
```

### Step 2 — Normalization

Pixel values are normalized to a consistent range before model processing.

```text
Original Pixel Values
        ↓
Normalization
        ↓
Standardized Pixel Values
```

### Step 3 — Histogram Equalization

Histogram equalization improves image contrast and helps make body contours and structural characteristics more distinguishable.

```text
Normalized Image
       ↓
Histogram Equalization
       ↓
Enhanced Contrast
       ↓
CNN Input
```

The paper specifically uses the sequence **image-to-array conversion → normalization → histogram equalization** for the CNN pipeline.

---

## 8. Cattle Detection & Feature Extraction

### YOLOv5 Detection

YOLOv5 is used to detect and isolate the cattle from the original image.

```text
Original Image
      │
      ▼
   YOLOv5
      │
      ▼
Cattle Bounding Box
      │
      ▼
Full-Body ROI
```

The detected bounding box provides spatial information such as:

```text
Height = ymax - ymin

Width = xmax - xmin

Aspect Ratio = Height / Width
```

Additional visual characteristics can be extracted from the detected cattle region, including body size, shape, texture, and pixel-based dimensions.

---

## 9. Deep Learning Architecture

### 3Conv3Dense CNN

The primary architecture consists of:

```text
Input Image
      │
      ▼
Conv2D — 32 Filters
      │
      ▼
Max Pooling
      │
      ▼
Conv2D — 64 Filters
      │
      ▼
Max Pooling
      │
      ▼
Conv2D — 128 Filters
      │
      ▼
Max Pooling
      │
      ▼
Flatten
      │
      ▼
Dense — 128
      │
      ▼
Dense — 64
      │
      ▼
Dense Regression Layers
      │
      ▼
Weight (kg)
```

The reference architecture evaluates several custom configurations, including **3Conv3Dense, 3Conv2Dense, 2Conv3Dense, and 2Conv2Dense**.

### Output Layer

The final layer contains a single continuous output:

```text
Output = Estimated Cattle Weight (kg)
```

No classification activation is required because the task is regression.

---

## 10. EfficientNetB3 Benchmark

EfficientNetB3 is evaluated using transfer learning with ImageNet-pretrained weights.

```text
Image
  │
  ▼
EfficientNetB3
  │
  ▼
Visual Feature Representation
  │
  ▼
Regression Head
  │
  ▼
Estimated Weight
```

EfficientNetB3 was selected in the reference study as a strong pretrained benchmark because of its balance between model complexity, computational efficiency, and predictive capability.

---

## 11. Model Training

### Dataset Split

The reference study uses:

```text
70% → Training
20% → Testing
10% → Validation
```

This split is used to compare the evaluated CNN, EfficientNetB3, and traditional regression approaches.

### Training Objective

The CNN models optimize Mean Squared Error:

```text
Loss = MSE(y_actual, y_predicted)
```

The model learns visual relationships between cattle body characteristics and measured weight.

---

## 12. Model Evaluation

The system evaluates regression performance using:

| Metric   | Purpose                                   |
| -------- | ----------------------------------------- |
| **MAE**  | Average absolute prediction error         |
| **MSE**  | Penalizes larger prediction errors        |
| **RMSE** | Measures prediction error in weight units |
| **MAPE** | Percentage-based prediction error         |
| **R²**   | Measures explained variance               |

---

## 13. Reference Model Results

The following results are from the **CattleNet-XAI reference study**, not claimed as independent production results of this project.

| Model               |          MAE |      MAPE |         R² |
| ------------------- | -----------: | --------: | ---------: |
| **3Conv3Dense CNN** | **18.02 kg** | **6.22%** | **94.32%** |
| EfficientNetB3      |     21.05 kg |     7.25% |     91.32% |
| Random Forest       |     23.67 kg |     8.16% |     78.56% |
| Linear Regression   |     25.99 kg |     8.96% |     72.13% |

## The reference study reports the 3Conv3Dense architecture as the best-performing evaluated model, with MAE of 18.02 kg and RMSE of 19.85 kg.

## 14. Explainable AI

### LIME-Based Weight Explanation

Weight prediction is not treated as a completely black-box process.

LIME is used to visualize image regions that contribute to the model's prediction.

```text
             Cattle Image
                  │
                  ▼
             CNN Prediction
                  │
                  ▼
                 LIME
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
    Rib Cage   Abdomen   Hindquarters
       │          │          │
       └──────────┼──────────┘
                  ▼
        Prediction Explanation
```

The reference analysis consistently identified the **rib cage, abdomen, and hindquarters** as influential regions for weight estimation.

This provides a visual interpretation of whether the model is focusing on anatomically meaningful body regions.

---

## 15. Error Analysis

The system analyzes prediction errors through:

* Actual vs Predicted plots
* Residual plots
* Prediction error distribution
* Individual error cases
* LIME visualizations
* Model-to-model comparison

Example:

```text
Actual Weight:     252.00 kg
Predicted Weight:  253.66 kg
Absolute Error:      1.66 kg
```

The reference paper presents examples where the deeper 3Conv3Dense architecture substantially reduced prediction error compared with a simpler architecture.

---

## 16. Key Computer Vision Pipeline

```text
              IMAGE
                │
                ▼
       ┌─────────────────┐
       │ Quality Check   │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ Preprocessing   │
       │ Normalize       │
       │ Histogram Eq.   │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ Cattle Detection│
       │     YOLOv5      │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ Body ROI        │
       │ Extraction      │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ Visual Features │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ CNN Regression  │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ Weight (kg)     │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ LIME Explain.   │
       └─────────────────┘
```

---

## 17. Challenges & Solutions

| Challenge                          | Root Cause                               | Solution                                               |
| ---------------------------------- | ---------------------------------------- | ------------------------------------------------------ |
| 2D image represents a 3D body      | Loss of depth information                | CNN learns body-shape and proportional visual patterns |
| Different image quality            | Lighting and image conditions            | Normalization + histogram equalization                 |
| Background noise                   | Farm/environmental background            | Cattle detection and ROI extraction                    |
| Breed variation                    | Different body structures                | Diverse cattle image dataset                           |
| High-dimensional image features    | Large visual feature space               | CNN-based automatic feature learning                   |
| Traditional regression limitations | Non-linear visual relationships          | Deep CNN regression                                    |
| Model interpretability             | Black-box predictions                    | LIME visualization                                     |
| Prediction errors                  | Visual ambiguity and limited information | Residual and error-case analysis                       |

The paper identifies the challenge of inferring a 3D characteristic such as weight from 2D images and emphasizes the need for both accuracy and interpretability.

---

## 18. Results & Impact

### Reference Performance

```text
Best Architecture:
3Conv3Dense CNN

MAE:
18.02 kg

RMSE:
19.85 kg

R²:
94.32%

MAPE:
≈ 6.22%
```

These are the reported results of the CattleNet-XAI study on its evaluated dataset.

### Practical Impact

* Non-invasive cattle weight estimation
* Reduced dependency on physical weighing
* Faster livestock monitoring
* Potential support for feed management
* Potential support for health assessment
* Potential support for livestock market valuation
* Scalable computer-vision-based farm monitoring
* Explainable predictions for greater transparency

---

## 19. Future Improvements

### Multi-View Weight Estimation

Combine multiple camera angles:

```text
Side View
   +
Front View
   +
Rear / Top View
   ↓
Multi-View Feature Fusion
   ↓
Weight Estimation
```

### Additional Variables

Future versions can incorporate:

* Age
* Breed
* Height
* Body length
* Environmental conditions
* Feed intake
* Historical weight
* Farm-specific information

The reference study specifically proposes incorporating environmental factors and feed intake, as well as breed-specific performance analysis.

### Real-Time Estimation

```text
CCTV / Mobile Camera
        │
        ▼
Cattle Detection
        │
        ▼
Weight Estimation
        │
        ▼
Farm Dashboard
```

### Production Extensions

* FastAPI inference service
* ONNX deployment
* Edge-device inference
* Mobile application
* Farm management system integration
* Historical weight tracking
* Automated growth monitoring
* Multi-cattle detection and tracking

---

## 20. Confidentiality Notice

> 🔒 **Source code is not publicly available** due to organizational confidentiality and proprietary restrictions.

This document is intended to showcase the system architecture, computer vision methodology, machine learning approach, and engineering direction. Dataset-specific confidential information and implementation details have been omitted.

---

## 21. Contact

**Basharul - Alam - Mazu**

Computer Vision & ML Engineer

🔗 basharulalammazu.github.io

---

*Document Version: 1.0 · Last Updated: June 2026 · Status: Advanced Development → Production-Ready*
