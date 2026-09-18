# EduCore Foundation

Build the initial frontend UI for a modern School / Education ERP platform called EduCore, inspired by the broad functionality of enterprise education management systems such as Nedusoft.

Important

This is Phase 1 only.

Do NOT build any backend, database, API integrations, real authentication, payments, or real business logic.

Everything should use static/mock data for now.

The goal is to establish the complete application structure, navigation, screens, layouts, and visual design. We will implement functionality later.

1. Login

Create a polished login page with:

EduCore branding

Email field

Password field

Remember me

Forgot password

Login button

Show/hide password

"Sign in" loading state

Static login behavior that takes the user into the dashboard

No real authentication

2. Main Application Layout

After login, create the main ERP shell with:

Left sidebar navigation

Collapsible sidebar

Top navigation/header

Global search

Notifications

User profile menu

Breadcrumbs

Page title

Responsive layout

Light/dark theme toggle

Use a premium, clean enterprise SaaS design. Avoid making it look like a generic admin template.

3. Sidebar Navigation

Create all navigation tabs and routes upfront.

Dashboard

Academic

Students

Teachers

Classes

Sections

Subjects

Timetable

Attendance

Examinations

Results

Report Cards

Admissions

Applications

Admission Enquiries

Admission Process

Finance

Fees

Fee Structure

Payments

Expenses

Financial Reports

Learning

Courses

Lessons

Assignments

Online Classes

Administration

Library

Inventory

Transport

Communication

Events

Documents

HR

Staff

Leave Management

Payroll

Reports

Academic Reports

Attendance Reports

Fee Reports

Student Reports

Settings

4. Dashboard

Create a complete static dashboard containing:

Total Students

Total Teachers

Today's Attendance

Pending Fees

New Admissions

Upcoming Exams

Student enrollment chart

Attendance chart

Fee collection chart

Recent activities

Upcoming events

Pending approvals

Use realistic mock data.

5. All Other Pages

Every sidebar item must have its own working route and page.

For now, each page should contain:

Proper page title

Breadcrumb

Relevant summary cards

Search/filter area where appropriate

Static data table or cards

Primary action button

Secondary actions

Pagination UI where appropriate

Empty state where appropriate

Do not leave blank pages or generic "Coming Soon" text.

Examples:

Students

Student count cards

Student table

Student name

Student ID

Class

Section

Gender

Attendance

Status

Actions

Teachers

Teacher directory

Department

Subjects

Assigned classes

Status

Classes

Class list

Sections

Class teacher

Student count

Attendance

Attendance summary

Date selector

Class selector

Attendance table

Examinations

Upcoming exams

Exam schedule

Subjects

Classes

Status

Results

Exam results

Student performance

Grades

Percentage

Fees

Total collected

Pending

Overdue

Recent transactions

Fee table

Courses

Course cards

Instructor

Students enrolled

Progress

Library

Book catalog

Available books

Issued books

Overdue books

HR

Staff directory

Leave summary

Payroll summary

6. UI Consistency

Create a reusable visual system across the entire application:

Consistent cards

Tables

Buttons

Dropdowns

Tabs

Badges

Modals

Forms

Toasts

Pagination

Empty states

Loading states

Use realistic mock content throughout the application.

7. Interaction

Only implement basic frontend interactions:

Sidebar collapse/expand

Navigation between pages

Search UI

Filters opening/selecting

Dropdowns

Tabs

Modals

Theme toggle

Profile menu

Static login

Toast notifications

Do not implement actual CRUD, API calls, database persistence, or authentication.

8. Design Direction

The application should feel like a premium enterprise education platform.

Design characteristics:

Clean

Modern

Professional

Information-dense but not cluttered

Excellent typography

Subtle borders and shadows

Strong visual hierarchy

Responsive

Minimal unnecessary gradients

No excessive animations

Create the foundation so that in Phase 2 we can add real functionality module-by-module without restructuring the application.

Final Requirement

Before finishing, verify that:

Login works as a static flow.

Every sidebar item has a route.

Every route has a properly designed page.

No page is blank.

Navigation works consistently.

The entire application uses the same design language.

Mock data is realistic and education-related.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3fa1f689-6173-4edb-8b90-5dd8860b442b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
