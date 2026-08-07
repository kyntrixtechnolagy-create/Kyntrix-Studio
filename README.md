# Founder Dashboard

FounderOS - Frontend UI Prompt for Lovable

Build a modern, premium-quality web application called FounderOS.

FounderOS is a personal business operating system for a solo software developer/founder. It is not a SaaS and does not require authentication.

Design Style

Minimal

Premium

Apple + Linear inspired

Clean spacing

Rounded corners (12–16px)

Soft shadows

Modern typography

Responsive design

Light mode by default

Accent color: Blue (#3B82F6)

Use Tailwind CSS

Use shadcn/ui components

Use Lucide icons

Use Recharts for charts

Smooth animations

Beautiful loading skeletons

Professional dashboard appearance

Layout

Create a dashboard with:

Left Sidebar

Navigation Items

Dashboard

Clients

Projects

Finance

Payments

Tasks

Calendar

Documents

Ideas

Analytics

Settings

Sidebar should be collapsible.

Top Navbar

Include

FounderOS Logo

Search Bar

Current Date

Notification Icon

Theme Toggle

Profile Avatar (static)

Dashboard

Top section contains KPI cards.

Cards:

Total Revenue

Pending Amount

Savings

Active Projects

Completed Projects

Pending Tasks

New Leads

Each card should have

Icon

Value

Subtitle

Small trend indicator

Revenue Analytics

Large responsive chart showing

Monthly Revenue

Expenses

Profit

Use Recharts.

Recent Projects

Table containing

Project Name

Client

Progress Bar

Status Badge

Deadline

Pending Amount

Use colorful badges.

Today's Tasks

Beautiful task cards.

Each task contains

Checkbox

Priority

Time

Due Date

Upcoming Deadlines

Timeline style component.

Clients Page

Display client cards.

Each card shows

Client Name

Company

Phone

Email

Active Projects

Pending Amount

Status

Include

Search

Filters

Add Client button

Projects Page

Modern project table.

Columns

Project Name

Client

Price

Advance

Pending

Progress

Status

Deadline

Clicking a project opens a detailed page.

Project Details include

Progress Circle

Modules

Timeline

Notes

Requirements

Attachments

Payment Summary

Finance Page

Cards

Total Income

Expenses

Savings

Profit

Charts

Income vs Expense

Monthly Profit

Expense Categories

Expense Categories

Hosting

AI APIs

Domains

Office

Food

Travel

Other

Payments Page

Table

Client

Total Amount

Paid

Pending

Due Date

Status

Highlight overdue payments.

Tasks Page

Kanban Board

Columns

Todo

In Progress

Review

Completed

Allow drag-and-drop UI.

Calendar Page

Monthly calendar.

Show

Meetings

Deadlines

Payment Due Dates

Tasks

Documents Page

Grid layout.

Categories

Quotations

Invoices

Agreements

Requirement Docs

PDFs

Images

Include upload button UI.

Ideas Page

Sticky notes style layout.

Categories

SaaS Ideas

Client Requests

Feature Ideas

Future Plans

Analytics Page

Charts

Monthly Revenue

Client Growth

Project Completion Rate

Pending Payments

Productivity

Components

Create reusable components.

StatCard

ProjectCard

ClientCard

PaymentCard

TaskCard

RevenueChart

Sidebar

Navbar

ProgressCircle

StatusBadge

Timeline

CalendarWidget

UI Features

Fully responsive

Dark mode support

Empty states

Skeleton loading

Toast notifications

Beautiful tables

Search bars

Filters

Pagination UI

Modal dialogs

Drawers

Dropdown menus

Sample Data

Populate the application with realistic mock data for:

15 Clients

20 Projects

Revenue

Payments

Tasks

Finance

Calendar Events

Do not connect to any backend.

Generate only the frontend with mock data using React, TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons, React Router, Zustand, and Recharts.

The code should be clean, modular, production-ready, and organized into reusable components and pages.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e0f349c4-16ed-4b30-8281-4503196d66dc).

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
