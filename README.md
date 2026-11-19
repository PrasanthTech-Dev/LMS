# EduNext — Online Learning Management System (Frontend)

Modern, responsive, dark-blue-themed LMS (designed after the EduNext reference boards: navy background, blue accents, USD pricing) built with **React 19 + TypeScript + Tailwind CSS v4**, Redux Toolkit,
React Router, Axios, Framer Motion and Recharts.

## Quick start
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
```

## Demo accounts (dummy data)
| Role       | Email                      | Password        |
|------------|----------------------------|-----------------|
| Student    | student@edulearn.dev    | Student@123     |
| Instructor | instructor@edulearn.dev | Instructor@123  |
| Admin      | admin@edulearn.dev      | Admin@123       |

New accounts can also be registered (stored in localStorage while mocking).

## Features
- **Student**: register/login, profile, course catalogue with search + category/level/price/rating filters, course details
  (curriculum, resources, reviews), subscription plans, enrolment checkout, My Learning dashboard, video player with
  chapters/lessons, quizzes, assignments (upload), downloadable materials, per-lesson completion + progress,
  notes, wishlist, notifications, downloadable PNG certificates.
- **Instructor**: dashboard, create/edit/delete courses, chapters & lessons, video/material/thumbnail upload UI,
  student roster, performance analytics.
- **Admin**: overview, student/instructor management (suspend/remove), course approval/moderation, enrolments,
  revenue analytics, platform reports with CSV export.

## Architecture
```
src/
  components/   ui kit (Button, Modal, DataTable, Form + validation, Toast…), layouts, CourseCard
  pages/        public, auth, student, instructor, admin (all lazy-loaded)
  store/        Redux Toolkit slices (auth, courses, learning, notifications, users)
  services/     axios instance + service layer (mock <-> real API switch)
  data/         dummy data
  utils/        helpers, analytics, certificate renderer
```

## API integration
Copy `.env.example` to `.env`, set `VITE_API_BASE_URL` and `VITE_USE_MOCK=false`.
`src/services/api.ts` provides the Axios instance (bearer-token + 401 handling); `src/services/lmsService.ts`
holds the endpoints (`POST /auth/login`, `POST /auth/register`, `GET /courses`). Add further endpoints there and
dispatch them from Redux thunks — pages don't need to change.

## Notes
- Course thumbnails use picsum.photos and the demo lecture uses a public sample MP4 (needs internet).
- Payments are simulated; no real transaction occurs.
