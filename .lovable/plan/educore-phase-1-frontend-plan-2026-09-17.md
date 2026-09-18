# EduCore Phase 1 Frontend Plan

## Goal
Build a static, polished Education ERP frontend for EduCore with a login screen, authenticated app shell, dashboard, and a working page for every sidebar item. No backend, database, API, real authentication, payments, or persistent business logic will be added.

## Existing overlap checked
- The project currently has only the default home placeholder.
- Existing reusable UI components are available under the shared UI library, including buttons, tables, dialogs, dropdowns, pagination, charts, badges, forms, tabs, and toast support.
- The new ERP UI will reuse those shared components and keep logic in frontend-only data/config files.

## Assumption
This Phase 1 shell will work standalone with mock data only. It will be structured so later modules can connect to real services without changing the main navigation or page structure.

## What will be built
1. Replace the placeholder home route with a frontend-only EduCore app.
2. Add a polished login page with:
   - EduCore branding
   - Email and password fields
   - Remember me
   - Forgot password link
   - Show/hide password
   - Login loading state
   - Static sign-in that opens the dashboard
3. Add the main ERP shell with:
   - Collapsible left sidebar
   - Top header
   - Global search
   - Notifications menu
   - User profile menu
   - Breadcrumbs and page title
   - Responsive behavior
   - Light/dark theme toggle
4. Add all requested navigation items as working frontend routes inside the app state:
   - Dashboard
   - Academic: Students, Teachers, Classes, Sections, Subjects, Timetable, Attendance, Examinations, Results, Report Cards
   - Admissions: Applications, Admission Enquiries, Admission Process
   - Finance: Fees, Fee Structure, Payments, Expenses, Financial Reports
   - Learning: Courses, Lessons, Assignments, Online Classes
   - Administration: Library, Inventory, Transport, Communication, Events, Documents
   - HR: Staff, Leave Management, Payroll
   - Reports: Academic Reports, Attendance Reports, Fee Reports, Student Reports
   - Settings
5. Build a complete static dashboard with:
   - KPI cards
   - Enrollment, attendance, and fee collection charts
   - Recent activities
   - Upcoming events
   - Pending approvals
6. Build every other page with:
   - Page-specific title and breadcrumb
   - Relevant summary cards
   - Search and filters where appropriate
   - Static table, cards, or empty state as appropriate
   - Primary and secondary actions
   - Pagination where appropriate
7. Add reusable frontend structures for:
   - Cards
   - Tables
   - Buttons
   - Dropdowns
   - Tabs
   - Badges
   - Modals
   - Forms
   - Toasts
   - Pagination
   - Empty and loading states

## Design direction
Use the uploaded dashboard screenshot as a reference for the enterprise ERP feel: clean white surfaces, compact metrics, strong blue brand accents, subtle borders, crisp typography, dense but readable content, and minimal animation. The design system will define all colors and visual roles in the global style tokens, including dark mode equivalents.

## Technical details
- Keep everything frontend-only and mock-data driven.
- Put shared navigation/page data in reusable configuration modules.
- Use one app route at `/` with internal static navigation state for Phase 1, so every sidebar item is reachable without adding backend dependencies.
- Add route metadata for the home route with EduCore-specific title, description, Open Graph, and Twitter metadata.
- Do not add database tables, migrations, APIs, real auth, or new paid services.

## Verification
Before reporting completion:
- Confirm static login opens the dashboard.
- Confirm each sidebar item changes to a designed page.
- Confirm no page is blank or generic.
- Confirm the sidebar collapse, menus, filters, modals, tabs, theme toggle, and toast interactions work.
- Confirm the app uses one consistent EduCore design language.
