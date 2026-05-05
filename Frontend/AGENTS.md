# AGENTS.md — Pain Relief / Rehab Hub

## 1. Project Overview
Pain Relief / Rehab Hub is a PERN stack web application that provides curated recovery exercises based on body part and discomfort type.

This is a guided recommendation system, NOT a medical diagnostic tool.

---

## 2. Architecture

Frontend:
- React
- React Router
- Tailwind CSS

Backend:
- Node.js
- Express.js

Database:
- PostgreSQL (Supabase)

Auth:
- Supabase Auth (JWT)

API:
- REST (/api/v1)

---

## 3. Core Flow

User → Select Body Part → Select Discomfort → API → Filter Exercises → Return Results → Save / Complete

---

## 4. Roles

Backend:
- APIs
- DB schema
- Auth
- Business logic

Frontend:
- UI
- Routing
- API integration

Shared:
- DB design
- Testing
- Debugging

---

## 5. Backend Structure

src/
- controllers/
- services/
- repositories/
- dtos/
- routes/
- middleware/

---

## 6. API Rules

- Use /api/v1
- 200 = success
- 201 = created
- 404 = not found
- 500 = error

Fix:
- exercisises → exercises
- sucess → success

---

## 7. Database Tables

- users
- body_parts
- discomfort_types
- exercises
- saved_exercises
- routine_completions

---

## 8. Features

Recommendation:
- Filter by body_part_id + discomfort_type_id

Exercises:
Required:
- title
- body_part_id
- discomfort_type_id
- description

Optional:
- duration
- video_url
- safety_notes
- difficulty

---

## 9. Coding Standards

Backend:
- Controllers thin
- Services handle logic
- Repositories handle DB

Frontend:
- Reusable components
- Separate API logic

---

## 10. Security

- JWT auth
- .env usage
- Validate inputs

---

## 11. MVP Scope

Include:
- Auth
- Recommendation flow
- Exercise detail
- Save
- Completion tracking

Exclude:
- AI diagnosis
- Chat
- Real-time

---

## 12. Workflow

1. DB schema
2. Seed data
3. Build API
4. Test
5. Frontend
6. Connect
7. Add auth

---

## 13. Future

- AI recommendations
- Admin dashboard
- Analytics

---

## 14. Principle

Keep it simple, fast, and user-friendly.
