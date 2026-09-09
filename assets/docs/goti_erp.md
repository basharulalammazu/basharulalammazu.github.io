# 📘 Goti ERP — Closed-Source Enterprise Backend Case Study

### Modular Enterprise Resource Planning System (Accounting · HR · Inventory · Procurement)

---

```
Prepared by:  Basharul - Alam - Mazu
Role:         Backend Engineer (Django / DRF)
Project Type: Closed Source / Enterprise Production System
Duration:     July 2026 – September 2026
Status:       🔒 Confidential Enterprise System
Last Updated: September 2026
```

---

# 📑 Table of Contents

1. Executive Summary
2. Project Overview
3. Problem Statement
4. System Architecture
5. Technology Stack
6. Service Breakdown
7. API Design
8. Database Architecture
9. Authentication & Authorization
10. Background Processing & Automation
11. Engineering Practices
12. Challenges & Solutions
13. Outcomes
14. Confidentiality Notice

---

# 1. Executive Summary

Goti ERP is a closed-source Enterprise Resource Planning backend built to run a manufacturing
organisation's core business operations — financial accounting, human resources, inventory, and
procurement — through a single, coherent API surface.

Rather than one monolithic Django project, the system is deliberately composed of **independent
backend services, one per business domain**. Each service owns its own settings, dependency set,
database schema, and REST surface, which keeps module boundaries hard, avoids cross-domain coupling,
and lets each domain evolve and deploy on its own timeline.

My contribution covered backend design and implementation across these services: modelling the
domain, building the REST APIs for transactional and master-data operations, designing and migrating
the MySQL schema, wiring JWT-based role authorization for HR services, and integrating background
job processing for recurring operational tasks.

---

# 2. Project Overview

### Problem

* Business operations were spread across disconnected tools with no shared data model
* Financial, HR, inventory, and procurement records had to be reconciled by hand
* No programmatic API surface for a modern front-end to consume
* A single monolithic backend would have coupled unrelated domains and slowed every release

### Solution

* Domain-scoped Django backend services with clean, enforced module boundaries
* A consistent REST API contract across every module for CRUD and business workflows
* Model-driven schema design with migration-managed evolution on MySQL
* JWT authorization with role-based access on the people-data services
* Celery and scheduled jobs for automation that must run without a user present

---

# 3. Problem Statement

| Issue | Impact |
| --- | --- |
| Fragmented, tool-by-tool record keeping | Manual reconciliation, inconsistent data |
| No unified API layer | Front-end and integrations blocked |
| Ad-hoc schema changes | Migration drift and fragile deployments |
| Unrestricted access to HR data | Compliance and privacy exposure |
| Manual recurring operations | Human error, missed deadlines |

---

# 4. System Architecture

## High-Level Architecture

```
              React + TypeScript Front-End (SPA)
                            ↓
        ┌───────────────────┴───────────────────┐
        │        REST / JSON over HTTPS         │
        └───────────────────┬───────────────────┘
        ┌──────────┬────────┴────────┬──────────────┐
        ↓          ↓                 ↓              ↓
   Accounting     HR             Inventory     Procurement
   Service      Service           Service        Service
   (Django)     (Django)          (Django)       (Django)
        ↓          ↓                 ↓              ↓
   ────────────── MySQL (per-service schema) ──────────────
                            ↓
              Celery Workers + django-crontab Jobs
```

## Layered Design (per service)

* **API Layer** → DRF routers, viewsets, and serializers
* **Domain Layer** → Django models with co-located `TextChoices` enums for domain vocabularies
* **Persistence Layer** → MySQL, evolved through Django migrations
* **Async Layer** → Celery tasks and `django-crontab` scheduled jobs
* **Auth Layer** → SimpleJWT tokens with role/permission classes (HR services)

## Why Independent Services

A monolith would have forced every module to share one settings package, one migration history, and
one release cadence. Splitting by domain means an accounting schema change cannot break HR, each
service can pin the Django version it needs, and a deployment is scoped to the domain that changed.
The trade-off — no cross-service foreign keys — is handled at the API layer with explicit
identifiers rather than implicit database coupling.

---

# 5. Technology Stack

| Layer | Technology |
| --- | --- |
| Language | Python |
| Web Framework | Django |
| API Framework | Django REST Framework |
| Database | MySQL |
| Authentication | JWT (SimpleJWT) |
| Async Processing | Celery + Redis |
| Scheduling | django-crontab |
| Filtering / Pagination | django-filter, DRF pagination |
| API Documentation | drf-yasg (Swagger / OpenAPI) |
| Config Management | environment-driven settings (`python-decouple` / `python-dotenv`) |
| Front-End (consumer) | React + TypeScript + Vite |

---

# 6. Service Breakdown

## 6.1 Accounting Service

Financial backbone of the system — the general ledger and everything that posts into it.

* **Master data**: companies, branches, account groups, chart of accounts, currencies and exchange
  rates, cost centres, cost categories, departments, projects
* **Fiscal control**: fiscal years and accounting periods with status-gated posting
* **Transactions**: journal entries and journal entry lines with balance-type validation
* **Banking & cash**: cash accounts, bank accounts, and payment records
* **Tax & VAT**: tax rates, VAT rates, applicability rules, and statutory invoice records
* **Payroll linkage**: pay frequency, pay method, payslip status, and salary line classifications

Domain vocabularies (voucher types, journal status, balance type, cash-flow category, allocation
method) are modelled as Django `TextChoices` enums co-located with the models, so the database, the
serializers, and the API documentation all read from one definition.

## 6.2 HR Service

The people and project-execution service, and the only one holding sensitive personal data.

* **People**: users, designations, departments, company structure
* **Attendance**: attendance records, NFC cards, POS device bindings, calendars, holiday types and
  holiday calendars, hour types
* **Work structure**: projects, sub-tasks, assignees, shared files
* **WBS**: work breakdown structures, WBS assignees, time cards and weekly time cards
* **EVMS**: staffing plans, baseline schedules, and historical snapshots for earned-value tracking

Because this service holds personal and payroll-adjacent data, it is the one with the strictest
access model: authenticated-only endpoints with additional admin-level restrictions on the
administrative surfaces.

## 6.3 Inventory Service

Stock and product-structure tracking.

* **Catalogue**: vendors, categories, product types, products, manufacturer products, purchase
  products
* **Structure**: bills of materials (BOM) and BOM line items
* **Movement**: stock movements typed by movement kind, forming the audit trail of quantity change

Built on a DRF `DefaultRouter` with `django-filter` backends and paginated list endpoints, so the
front-end can query large catalogues without bespoke endpoints per filter.

## 6.4 Procurement Service

Purchase-in and sales-out document flows, sharing one product catalogue.

* **Inbound**: requisitions and requisition lines, vendor quotations, purchase orders, proforma
  invoices, challans and challan lines
* **Outbound**: buyers, sales orders and lines, sales invoices and lines, work orders, resale
  records, notes
* **Shared catalogue**: products, product images, product catalogue entries, currencies, categories

Document totals and line-item arithmetic are factored into reusable mixins (`DocumentTotalsMixin`,
`LineItemMixin`) so every document type computes subtotals, tax, and grand totals identically
instead of each model re-implementing the same logic.

---

# 7. API Design

Every service follows one contract shape:

```
GET    /api/<domain>/<resource>/          → paginated, filterable list
POST   /api/<domain>/<resource>/          → create
GET    /api/<domain>/<resource>/{id}/     → retrieve
PUT    /api/<domain>/<resource>/{id}/     → full update
PATCH  /api/<domain>/<resource>/{id}/     → partial update
DELETE /api/<domain>/<resource>/{id}/     → delete
```

### Conventions

* **ModelViewSets by default** — CRUD is generated, not hand-written; custom actions are added only
  where a workflow genuinely differs from CRUD (posting a journal entry, approving a requisition)
* **Serializers as the contract boundary** — validation, computed fields, and nested representations
  live in serializers, never in views
* **Explicit URL namespacing per service** — each service keeps its own prefix convention so routes
  never collide when the services sit behind one gateway
* **Pagination and filtering as defaults**, not opt-ins, so no endpoint can accidentally return an
  unbounded result set
* **Swagger/OpenAPI generated from the code** so the front-end team consumes a spec that cannot
  silently drift from the implementation

---

# 8. Database Architecture

* **MySQL** as the relational store, one schema per service
* **Model-driven development** — the Django model is the single source of truth; the schema is
  derived from it, never edited out-of-band
* **Migration-managed evolution** — every schema change ships as a reviewed migration, so
  environments converge deterministically
* **Enums in the model layer** — status and type fields use `TextChoices` rather than free strings,
  keeping invalid states unrepresentable at the serializer boundary
* **Normalised document/line structure** — every document type (journal entry, requisition, purchase
  order, sales invoice, BOM) is a header row plus typed line rows, which keeps totals auditable and
  line-level reporting straightforward

---

# 9. Authentication & Authorization

The HR service, holding the most sensitive data, carries the strictest model:

* **JWT via SimpleJWT** — stateless access and refresh tokens, no server-side session store
* **Role-based access** — DRF permission classes gate endpoints by authentication and by
  administrative role, applied at the viewset level so a new endpoint inherits the policy rather
  than having to remember it
* **Token endpoints** for obtaining and refreshing credentials, consumed directly by the SPA
* **Environment-scoped configuration** — credentials, database targets, and token lifetimes come
  from environment variables per deployment environment, never from committed defaults

---

# 10. Background Processing & Automation

Not every ERP operation can run inside a request/response cycle.

| Mechanism | Purpose |
| --- | --- |
| **Celery + Redis** | Offloads long-running and I/O-bound work from the request cycle |
| **django-crontab** | Registers recurring jobs (queued mail dispatch, periodic operational tasks) |
| **Standalone job scripts** | Scheduled maintenance and data-hygiene routines run outside the app |
| **Seeder scripts** | Reproducible baseline master data for fresh environments |

This keeps API latency bounded and predictable: a request enqueues work and returns, and the worker
pool absorbs the load.

---

# 11. Engineering Practices

* **Consistent app shape** — every app is `models.py` → `serializers.py` → `views.py` → `urls.py` →
  `migrations/`, so any engineer can navigate an unfamiliar module immediately
* **Domain vocabularies co-located with models** — enums live at the top of the model file they
  describe
* **Reusable mixins over duplication** — shared document arithmetic is written once
* **Documentation kept next to the code** — per-service model and API references maintained
  alongside the implementation, with the generated OpenAPI spec as the authoritative contract
* **Environment-driven settings** — no environment-specific values hard-coded into the codebase
* **Convention matching over invention** — each service follows its own established URL and
  serializer conventions rather than importing a different style into it

---

# 12. Challenges & Solutions

| Challenge | Solution |
| --- | --- |
| Keeping four domains from coupling to each other | Independent Django projects; cross-domain references by explicit identifier at the API layer, not by foreign key |
| Divergent Django versions across services | Per-service dependency pinning, so no service is blocked by another's upgrade schedule |
| Repeated totals logic across document types | Extracted into shared `DocumentTotalsMixin` / `LineItemMixin` |
| Protecting HR and payroll-adjacent data | JWT plus role-scoped permission classes applied at the viewset level |
| Schema drift between environments | Strict migration discipline; the model is the only source of truth |
| Documentation drifting from implementation | Generated OpenAPI spec treated as the contract of record |
| Recurring operations needing to run unattended | Celery workers plus `django-crontab` scheduled jobs |

---

# 13. Outcomes

* A working ERP backend covering **four business domains** — accounting, HR, inventory, and
  procurement — behind a consistent REST contract
* **Independent, domain-scoped services** that can be developed, migrated, and deployed separately
  without cross-domain regressions
* **Full CRUD plus workflow APIs** for master data and transactional documents across every module
* **Secured people-data endpoints** with JWT authentication and role-based authorization
* **Automated recurring operations** through Celery and scheduled jobs
* A **generated, always-current API specification** that unblocked parallel front-end development

---

# 14. Confidentiality Notice

> 🔒 **Closed Source.** Goti ERP is proprietary enterprise software. This document describes
> architecture, engineering approach, and technical decisions only. No source code, schema dumps,
> credentials, configuration values, customer data, or business data are disclosed. Module and
> entity names are included solely to convey the scope and structure of the engineering work.

---

```
Technologies: Python · Django · Django REST Framework · MySQL · JWT / SimpleJWT ·
              Celery · Redis · django-crontab · REST API Design · Database Migrations
```
