# SehatBridge AI

### AI Clinical Copilot for Rural Health Workers

**Turning unstructured patient information into structured, safety-first clinical handoffs for remote doctors.**

> **SehatBridge AI does not replace doctors.**
> It helps rural health workers collect better patient information and helps remote doctors review cases faster through structured, safety-first clinical handoffs.

---

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-14%2B-black?style=for-the-badge\&logo=next.js)
![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge\&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge\&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge\&logo=mongodb)
![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=for-the-badge\&logo=openai)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge)
![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5?style=for-the-badge)

</p>

<p align="center">
  <strong>AI-assisted intake → Safety screening → Structured case brief → Remote doctor review → Care plan</strong>
</p>

---

## Table of Contents

* [Overview](#overview)
* [The Problem](#the-problem)
* [The Solution](#the-solution)
* [How SehatBridge Works](#how-sehatbridge-works)
* [Core Features](#core-features)
* [Safety Architecture](#safety-architecture)
* [Clinical Workflow](#clinical-workflow)
* [System Architecture](#system-architecture)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Demo Data](#demo-data)
* [Responsible AI](#responsible-ai)
* [Security & Privacy](#security--privacy)
* [Design Principles](#design-principles)
* [Roadmap](#roadmap)
* [Future Opportunities](#future-opportunities)
* [Contributing](#contributing)
* [License](#license)

---

# Overview

Rural healthcare often faces a fundamental information gap.

A health worker may be physically present with the patient but have limited immediate access to clinical expertise.

At the same time, a remote doctor may be available but receive incomplete, unstructured, or inconsistent patient information.

**SehatBridge AI is designed to connect those two sides.**

The platform helps a rural health worker collect patient information through text or voice, structures that information using AI, applies deterministic safety rules to identify predefined warning conditions, and produces a concise case brief that can be reviewed by a remote doctor.

The doctor remains responsible for clinical decisions.

### The core idea

```text
Patient
   ↓
Rural Health Worker
   ↓
AI-Assisted Intake
   ↓
Structured Patient Data
   ↓
Deterministic Safety Engine
   ↓
┌─────────────────────────────┐
│ Priority / Safety Signals   │
└─────────────────────────────┘
   ↓
Doctor-Ready Case Brief
   ↓
Remote Doctor
   ↓
Clinical Decision
   ↓
Care Plan
   ↓
Longitudinal Patient Record
```

---

# The Problem

## Rural healthcare has an information bottleneck

The challenge is not always the complete absence of healthcare workers.

A health worker may be available locally, while a qualified doctor may be located remotely.

The problem becomes:

> **How can the remote doctor receive reliable, structured patient information quickly enough to make an informed clinical decision?**

Common challenges include:

* Patient information being collected inconsistently
* Important symptoms being missed during manual intake
* Vitals being difficult to interpret quickly
* Long and unstructured patient histories
* Limited access to specialists or doctors
* Poor continuity between consultations
* Time-consuming communication between health workers and doctors
* Difficulty identifying predefined urgent safety signals early

SehatBridge AI focuses specifically on improving this **information and coordination layer**.

---

# The Solution

SehatBridge AI acts as a **clinical workflow copilot**, not an autonomous doctor.

Instead of attempting to diagnose a patient, the system focuses on four things:

### 1. Collect

Capture symptoms, vitals, history, medications, and other relevant patient information through structured text or voice-assisted intake.

### 2. Structure

Convert unstructured information into consistent clinical data.

### 3. Screen for predefined safety signals

A deterministic rules engine evaluates configured thresholds and urgent symptom indicators.

Examples include:

* `HIGH_FEVER`
* `LOW_SPO2`
* Other configured urgent symptoms or safety conditions

### 4. Communicate

Generate a concise, structured case brief that a remote doctor can review.

---

# How SehatBridge Works

## Step 1 — Patient Intake

The rural health worker creates or selects a patient record.

Information can include:

* Patient identity
* Age
* Symptoms
* Duration
* Vitals
* Medical history
* Current medications
* Allergies
* Relevant documents
* Additional observations

---

## Step 2 — AI-Assisted Extraction

The AI converts natural-language input into structured information.

For example:

```text
Input:

"Patient has had fever since yesterday.
Temperature is around 102°F and oxygen saturation
is 91%. Patient is also experiencing difficulty breathing."
```

The system can transform this into structured data such as:

```json
{
  "symptoms": [
    {
      "name": "fever",
      "duration": "1 day"
    },
    {
      "name": "difficulty breathing"
    }
  ],
  "vitals": {
    "temperature_f": 102,
    "spo2": 91
  }
}
```

The AI is responsible for **extraction and organization**, not diagnosis.

---

# Step 3 — Deterministic Safety Engine

After structured information is created, predefined safety rules evaluate the data.

Example:

```text
IF SpO2 < configured threshold
    → LOW_SPO2

IF temperature exceeds configured threshold
    → HIGH_FEVER

IF configured urgent symptom is present
    → URGENT_SYMPTOM
```

This separation is intentional.

### AI handles:

* Natural-language understanding
* Information extraction
* Summarization
* Case organization

### Deterministic logic handles:

* Threshold checks
* Safety flags
* Priority classification
* Explicit rule evaluation

This reduces the risk of allowing an AI-generated interpretation to silently override predefined safety logic.

---

# Step 4 — Doctor-Ready Case Brief

The system creates a structured summary designed for rapid review.

Example:

```text
PATIENT
Ravi Kumar
Age: 54

PRIMARY CONCERNS
• Fever — 1 day
• Difficulty breathing

VITALS
• Temperature: 102°F
• SpO₂: 91%

SAFETY SIGNALS
• HIGH_FEVER
• LOW_SPO2

RELEVANT HISTORY
• Available from patient record

AI-GENERATED SUMMARY
Patient presents with fever and reported difficulty
breathing. Recorded temperature is 102°F and SpO₂
is 91%.

CLINICAL DECISION
Pending remote doctor review.
```

The doctor can then review the underlying patient information before making a decision.

---

# Step 5 — Remote Consultation

The platform provides a consultation workflow designed to support communication between the local health worker and remote doctor.

The architecture is **WebRTC-ready**, allowing future integration of:

* Audio consultation
* Video consultation
* Screen sharing
* Real-time communication

The consultation layer is separate from the AI safety layer.

---

# Step 6 — Doctor Decision

The remote doctor remains the final clinical decision maker.

The doctor can record:

* Clinical assessment
* Care plan
* Instructions
* Follow-up requirements
* Referral recommendations
* Additional notes

The final decision is stored as part of the patient's longitudinal record.

---

# Core Features

## AI-Assisted Patient Intake

Collect patient information using natural language.

**Supports:**

* Text-based intake
* Voice-assisted workflows
* Symptom collection
* Vital collection
* Medical history
* Medication information
* Additional observations

---

## Safety-First Triage

A deterministic safety engine evaluates predefined rules.

Example safety signals:

| Signal           | Example Trigger                          |
| ---------------- | ---------------------------------------- |
| `HIGH_FEVER`     | Temperature exceeds configured threshold |
| `LOW_SPO2`       | SpO₂ falls below configured threshold    |
| `URGENT_SYMPTOM` | Configured urgent symptom detected       |

> These signals are **safety indicators for priority review**, not medical diagnoses.

---

## Doctor-Ready Case Brief

Transforms patient information into a consistent structure.

The brief can contain:

* Patient information
* Chief concerns
* Symptoms
* Duration
* Vitals
* Relevant history
* Medications
* Allergies
* Safety signals
* AI-generated summary
* Doctor decision
* Follow-up information

---

## Digital Patient History

Each patient can have a longitudinal record containing:

```text
Patient
 ├── Demographics
 ├── Previous consultations
 ├── Symptoms
 ├── Vitals
 ├── Documents
 ├── Safety signals
 ├── Doctor decisions
 └── Follow-up records
```

This creates continuity across consultations.

---

## Remote Consultation Workflow

Designed around a simple workflow:

```text
Health Worker
      ↓
Create Case
      ↓
AI Intake
      ↓
Safety Review
      ↓
Doctor Receives Case
      ↓
Consultation
      ↓
Doctor Decision
      ↓
Patient History Updated
```

---

## Document & Image Uploads

Cloudinary integration supports patient-related documents and images.

Potential examples:

* Previous medical reports
* Prescriptions
* Lab reports
* Referral documents
* Relevant images

Uploaded files should be handled according to the application's privacy and access-control requirements.

---

# Safety Architecture

Safety is a core architectural principle of SehatBridge AI.

The system should **not** follow this architecture:

```text
Patient → AI → Diagnosis → Treatment
```

Instead:

```text
Patient
   ↓
Health Worker
   ↓
AI Extraction
   ↓
Structured Data
   ↓
Deterministic Safety Engine
   ↓
Doctor-Ready Case
   ↓
Doctor Review
   ↓
Clinical Decision
```

## Separation of responsibilities

| Component     | Responsibility                         |
| ------------- | -------------------------------------- |
| AI            | Extract and summarize information      |
| Safety Engine | Evaluate deterministic rules           |
| Health Worker | Collect and verify patient information |
| Doctor        | Make clinical decisions                |
| Database      | Maintain longitudinal records          |

This separation is fundamental to the project's safety model.

---

# Clinical Workflow

### Case lifecycle

```text
DRAFT
  ↓
INTAKE_COMPLETE
  ↓
SAFETY_REVIEW
  ↓
READY_FOR_DOCTOR
  ↓
DOCTOR_REVIEW
  ↓
CONSULTATION
  ↓
DECISION_RECORDED
  ↓
FOLLOW_UP
  ↓
COMPLETED
```

A production implementation should maintain explicit state transitions rather than relying on informal UI state.

---

# System Architecture

```text
┌──────────────────────────────────────────────────────────┐
│                     SehatBridge AI                       │
└──────────────────────────────────────────────────────────┘

                        Frontend
                           │
                           ▼
                ┌─────────────────────┐
                │      Next.js        │
                │   App Router        │
                │ React + Tailwind    │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Application Layer   │
                │ API / Server Logic  │
                └──────┬──────┬───────┘
                       │      │
             ┌─────────┘      └─────────┐
             ▼                          ▼
     ┌──────────────┐           ┌──────────────┐
     │   OpenAI     │           │  Safety      │
     │   Services   │           │  Engine      │
     └──────────────┘           └──────────────┘
             │                          │
             └────────────┬─────────────┘
                          ▼
                  ┌───────────────┐
                  │    MongoDB    │
                  │     Atlas     │
                  └───────┬───────┘
                          │
              ┌───────────┴──────────┐
              ▼                      ▼
       ┌──────────────┐       ┌──────────────┐
       │  Cloudinary  │       │    Clerk     │
       │    Files     │       │     Auth     │
       └──────────────┘       └──────────────┘
```

---

# Technology Stack

| Layer          | Technology                 | Purpose                                      |
| -------------- | -------------------------- | -------------------------------------------- |
| Frontend       | Next.js 14+                | Full-stack React application                 |
| UI             | React                      | Interactive interface                        |
| Styling        | Tailwind CSS               | Design system and responsive UI              |
| Language       | TypeScript                 | Type safety                                  |
| Database       | MongoDB Atlas              | Patient and application data                 |
| ODM            | Mongoose                   | MongoDB schema and data access               |
| Authentication | Clerk                      | User authentication and identity             |
| AI             | OpenAI API                 | Structured extraction and case summarization |
| File Storage   | Cloudinary                 | Document and image storage                   |
| Consultation   | WebRTC-ready               | Future real-time communication               |
| Deployment     | Next.js-compatible hosting | Production deployment                        |

---

# Project Structure

A scalable application can be organized around clear domain boundaries:

```text
sehatbridge-ai/
│
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   │
│   ├── dashboard/
│   │
│   ├── patients/
│   │   ├── new/
│   │   └── [patientId]/
│   │
│   ├── cases/
│   │   ├── new/
│   │   └── [caseId]/
│   │
│   ├── consultations/
│   │
│   ├── doctors/
│   │
│   ├── api/
│   │   ├── patients/
│   │   ├── cases/
│   │   ├── ai/
│   │   ├── safety/
│   │   └── uploads/
│   │
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   ├── patients/
│   ├── cases/
│   ├── consultation/
│   └── dashboard/
│
├── lib/
│   ├── db/
│   ├── ai/
│   ├── safety/
│   ├── cloudinary/
│   └── auth/
│
├── models/
│   ├── Patient.ts
│   ├── Case.ts
│   ├── Consultation.ts
│   └── DoctorDecision.ts
│
├── types/
│
├── scripts/
│   └── seed.ts
│
├── public/
│
├── .env.local
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

> The exact structure may differ depending on implementation. The important principle is to keep AI services, deterministic safety logic, database access, authentication, and UI concerns separated.

---

# Getting Started

## Prerequisites

Make sure the following are installed:

* Node.js 18+
* npm
* MongoDB Atlas account
* Clerk account
* OpenAI API access
* Cloudinary account

---

## 1. Clone the repository

```bash
git clone https://github.com/your-username/sehatbridge-ai.git

cd sehatbridge-ai
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create:

```text
.env.local
```

Add:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# MongoDB
MONGODB_URI=
MONGODB_DB_NAME=sehatbridge

# OpenAI
OPENAI_API_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Never commit `.env.local` or production secrets to Git.

---

## 4. Seed demo data

The project includes demo patient/case data for development.

```bash
npm run seed
```

The seed creates example cases including:

* Ravi Kumar
* Sunita Devi

---

## 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Environment Variables

| Variable                            | Required | Purpose                          |
| ----------------------------------- | -------: | -------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` |      Yes | Clerk frontend authentication    |
| `CLERK_SECRET_KEY`                  |      Yes | Clerk server authentication      |
| `MONGODB_URI`                       |      Yes | MongoDB Atlas connection         |
| `MONGODB_DB_NAME`                   |      Yes | Database name                    |
| `OPENAI_API_KEY`                    |      Yes | OpenAI API access                |
| `CLOUDINARY_CLOUD_NAME`             |      Yes | Cloudinary configuration         |
| `CLOUDINARY_API_KEY`                |      Yes | Cloudinary API authentication    |
| `CLOUDINARY_API_SECRET`             |      Yes | Cloudinary server authentication |

---

# Demo Scenario

The development seed includes fictional patient cases.

### Ravi Kumar

Example case designed to demonstrate:

```text
Patient Intake
      ↓
Symptoms + Vitals
      ↓
AI Structuring
      ↓
Safety Signals
      ↓
Doctor Case Brief
      ↓
Doctor Decision
```

### Sunita Devi

Provides another example patient workflow for testing longitudinal records and case management.

> All demo patient information should be treated as fictional development data.

---

# Responsible AI

SehatBridge AI is intentionally designed around **human-in-the-loop healthcare workflows**.

## AI does not diagnose

The AI is intended to:

* Extract information
* Structure information
* Summarize information
* Assist with case preparation

The AI is **not intended to independently diagnose patients or prescribe treatment**.

---

## Deterministic safety rules

Critical predefined safety signals should be evaluated using explicit application logic rather than relying solely on model output.

For example:

```typescript
if (spo2 < SPO2_THRESHOLD) {
  flags.push("LOW_SPO2");
}
```

This makes safety-related behavior:

* Explicit
* Testable
* Auditable
* Reproducible

---

## Doctor remains in control

The final clinical decision belongs to the qualified healthcare professional.

```text
AI
 ↓
Information Support

Doctor
 ↓
Clinical Decision
```

The AI should never silently replace the doctor's judgment.

---

# Security & Privacy

Healthcare applications require strong security controls.

Production deployments should implement:

* Authentication and authorization
* Role-based access control
* Secure API endpoints
* Server-side secret management
* Encryption in transit
* Secure file access
* Audit logging
* Input validation
* Rate limiting
* Access-controlled patient records
* Minimal data collection
* Appropriate retention policies
* Secure error handling

### Important

This repository is a software project and should **not automatically be considered compliant with healthcare regulations or clinical deployment requirements**.

Before using the system with real patient data, the deployment must undergo appropriate:

* Security review
* Privacy review
* Clinical validation
* Regulatory assessment
* Infrastructure review
* Data protection assessment

---

# Design Principles

## 1. Safety over automation

The objective is not to automate clinical decisions.

The objective is to make clinical information easier and safer to review.

---

## 2. Human-in-the-loop

```text
AI assists
Health worker collects
Doctor decides
```

---

## 3. Structured information beats unstructured communication

Instead of:

```text
"Patient has fever and feels weak."
```

The system should help produce:

```json
{
  "symptoms": ["fever", "weakness"],
  "duration": "...",
  "vitals": {},
  "history": {},
  "safety_flags": []
}
```

Structured information can be reviewed, stored, searched, and transferred more reliably.

---

## 4. Deterministic logic for deterministic requirements

If a rule can be expressed explicitly, it should not depend entirely on probabilistic model behavior.

---

## 5. Explainability

The system should make it clear:

* What information was provided
* What information was extracted
* Which safety rule was triggered
* What the AI generated
* What the doctor decided

---

# Roadmap

## Phase 1 — Core MVP

* [x] Project foundation
* [x] Authentication architecture
* [x] Patient records
* [x] AI-assisted intake
* [x] Structured patient information
* [x] Deterministic safety engine
* [x] Doctor-ready case brief
* [x] Demo seed data

## Phase 2 — Clinical Workflow

* [ ] Doctor dashboard
* [ ] Case queue
* [ ] Priority cases
* [ ] Doctor decision workflow
* [ ] Consultation management
* [ ] Follow-up tracking
* [ ] Longitudinal patient timeline

## Phase 3 — Communication

* [ ] WebRTC audio consultation
* [ ] WebRTC video consultation
* [ ] Secure consultation notes
* [ ] Real-time case updates
* [ ] Doctor availability

## Phase 4 — AI Improvements

* [ ] Voice transcription
* [ ] Multilingual intake
* [ ] Hindi/local-language support
* [ ] Better structured extraction
* [ ] Improved case summarization
* [ ] Missing-information detection
* [ ] AI-assisted follow-up questions

## Phase 5 — Production Readiness

* [ ] Comprehensive audit logging
* [ ] Advanced role-based access
* [ ] Security testing
* [ ] Clinical workflow validation
* [ ] Observability
* [ ] Error monitoring
* [ ] Performance optimization
* [ ] Data retention controls
* [ ] Production infrastructure hardening

---

# Future Opportunities

SehatBridge AI can eventually evolve beyond a case summarization tool into a broader rural healthcare coordination platform.

Potential capabilities include:

### Multilingual Healthcare

Support local languages and voice-based interaction for health workers who may not be comfortable with English.

### Offline-First Workflows

Allow health workers to continue collecting information when connectivity is unreliable and synchronize when connectivity returns.

### Doctor Network

Connect rural health workers with a distributed network of remote doctors.

### Patient Timeline

Provide a complete longitudinal view of consultations, vitals, documents, decisions, and follow-ups.

### Referral Coordination

Help coordinate referrals between rural healthcare facilities and larger hospitals.

### Population-Level Insights

With appropriate privacy protections and governance, aggregated data could help identify operational patterns and healthcare resource requirements.

---

# Why SehatBridge AI?

The goal is not:

> **"Replace the doctor with AI."**

The goal is:

> **"Give the health worker better tools and give the doctor better information."**

The system focuses on the gap between **patient → health worker → remote doctor**.

```text
                 SEHATBRIDGE AI

Patient
   │
   ▼
Rural Health Worker
   │
   │  Collects information
   ▼
AI Clinical Copilot
   │
   ├── Structures information
   ├── Summarizes case
   └── Supports intake
   │
   ▼
Safety Engine
   │
   └── Deterministic safety signals
   │
   ▼
Remote Doctor
   │
   └── Makes final clinical decision
   │
   ▼
Care Plan
   │
   ▼
Longitudinal Patient Record
```

---

# Contributing

Contributions are welcome.

If you want to contribute:

```bash
# Fork the repository

# Create a feature branch
git checkout -b feature/your-feature

# Make your changes

# Commit
git commit -m "feat: add your feature"

# Push
git push origin feature/your-feature
```

Then open a Pull Request with:

* What changed
* Why it changed
* How it was tested
* Screenshots for UI changes
* Any security or privacy considerations

For healthcare-related functionality, clearly document any assumptions and safety implications.

---

# Development Philosophy

SehatBridge AI follows a few core engineering principles:

```text
Simple architecture
        +
Strong typing
        +
Explicit business rules
        +
Human oversight
        +
Secure data handling
        +
Testable AI boundaries
        =
Reliable healthcare software
```

The project intentionally separates **probabilistic AI behavior** from **deterministic application logic** wherever possible.

---

# License

This project is currently distributed under the license specified in the repository.

If this project is intended to become an open-source project, add a dedicated `LICENSE` file and clearly define the permitted use, modification, and distribution terms.

---

## SehatBridge AI

**AI Clinical Copilot for Rural Health Workers**

> **Better information. Safer handoffs. Human-led decisions.**

Built to help bridge the distance between rural healthcare workers and clinical expertise.
