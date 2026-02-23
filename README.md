-> A full-stack support ticket management system with automated AI classification using OpenAI.

This project includes:

Django + Django REST Framework backend

PostgreSQL database

React frontend

OpenAI-powered ticket classification

Fully Dockerized multi-container setup

Everything runs with:docker compose up --build


->Architecture Overview.
Browser
   ↓
Frontend (React + Nginx container)
   ↓
Backend (Django + DRF container)
   ↓
PostgreSQL (Database container)
   ↓
OpenAI API (External LLM)

->Features
  
->Backend<-

Ticket CRUD API

Filtering, search, ordering

Ticket statistics endpoint (ORM aggregation)

AI-powered classification endpoint

Automatic classification on ticket creation

PostgreSQL database

Dockerized backend service

->Frontend<-

Ticket creation form

Auto-classify button (LLM integration)

Manual override of category & priority

Ticket list display

Live statistics dashboard

Fully containerized using Nginx

->AI Integration<-

Uses OpenAI API

Environment variable configuration

Graceful fallback if LLM fails

->Running the Project

->Prerequisites<-

Docker Desktop installed

OpenAI API key

->Set OpenAI API Key

Open docker-compose.yml and replace:

OPENAI_API_KEY: ""


->Start Everything

From project root: docker compose up --build

-> Access the Application

Frontend:http://localhost:3000

->Backend API:

http://localhost:8000/api/tickets/

->API Endpoints
Create Ticket:
    POST /api/tickets/

List Tickets:
    GET /api/tickets/

Ticket Statistics:
    GET /api/tickets/stats/
    Returns:

Total tickets

Open tickets

Average tickets per day

->AI Classification
 
 POST /api/tickets/classify/

 Body:
 {
  "description": "My card was charged twice"
}

{
  "category": "billing",
  "priority": "high"
}

->Ticket Model

Fields:

id

title

description

category

priority

status

created_at

Constraints:

Category: billing | technical | account | general

Priority: low | medium | high | critical

Status: open | in_progress | closed


->Design Decisions

Why Docker?

Ensures consistent environment and one-command deployment.

Why Service Layer for LLM?

Keeps AI logic separate from views for clean architecture.

Why Auto-Classification on Create?

Improves UX and demonstrates real-world automation flow.

Why PostgreSQL?

Production-grade relational database.


->Error Handling Strategy

Fallback classification if OpenAI fails

Environment variable validation

Container-level database readiness check

Graceful CORS handling


->Future Improvements

Authentication & role-based access

Better UI styling

Retry logic for LLM calls

Logging & monitoring

Rate limiting

Caching classification responses

->Project Structure:
tech-intern-assessment/
│
├── backend/
│   ├── tickets/
│   ├── config/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── .dockerignore
│
├── docker-compose.yml
└── README.md

->Evaluation Alignment

.Django + DRF backend
.PostgreSQL
.Dockerized services
.LLM integration via environment variable
.ORM aggregation endpoint
.Full-stack integration
.Clean architecture
.One-command deployment

-> Final Notes

This project demonstrates:

Full-stack engineering

Container orchestration

AI service integration

Production-style API design

Clean separation of concerns