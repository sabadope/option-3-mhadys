# Unified Workspace

Build a Premium 3-in-1 SaaS Business Management Platform MVP

Create a completely new, premium, modern SaaS web application that combines three business management systems into one unified platform:

Event Booking & Management

Merchandise & E-commerce Management

Car Wash & Auto Detailing Management

This is an MVP frontend application designed to demonstrate the complete product experience and core business workflows.

The application should feel like a premium technology product inspired by Apple's design philosophy, modern SaaS applications, and Liquid Glass interfaces.

Do NOT make this look like a generic admin dashboard template.

The goal is to create a polished, production-quality MVP frontend that could later be connected to a real backend, authentication system, payment provider, database, and mobile application.

1. PRODUCT CONCEPT

Create a unified SaaS platform where a business owner can manage multiple types of business operations from one account.

The platform should have a central SaaS shell with three primary business modules:

EVENT

Event booking, scheduling, ticketing, attendee management, and event operations.

MERCHANDISE

Product catalog, inventory, orders, checkout, customers, and sales management.

AUTO CARE

Car wash and auto detailing appointments, vehicles, services, staff, bays, work orders, payments, and service history.

The three modules must feel like parts of the same platform.

Do not create three completely separate websites.

Create one coherent SaaS product with a shared design system and navigation structure.

2. MVP OBJECTIVE

The MVP should demonstrate these three complete workflows.

Event workflow

Customer / attendee:

Browse event
→ View event
→ Select ticket
→ Book
→ Checkout
→ Receive digital ticket
→ QR check-in

Business:

Create event
→ Configure schedule
→ Configure tickets
→ Manage capacity
→ View bookings
→ Manage attendees
→ Check in attendees
→ View event performance

Merchandise workflow

Customer:

Browse products
→ View product
→ Select variant
→ Add to cart
→ Checkout
→ Payment
→ Order confirmation
→ Track order

Business:

Create product
→ Configure variants
→ Manage inventory
→ Receive order
→ Process order
→ Pack
→ Ship
→ Complete order

Auto Care workflow

Customer:

Add vehicle
→ Select service
→ Select date/time
→ Book appointment
→ Receive confirmation
→ Vehicle arrives
→ Service completed
→ Payment
→ Service history

Business:

Create service
→ Configure pricing
→ Manage schedule
→ Assign staff
→ Assign bay
→ Track work order
→ Complete service
→ Collect payment
→ Maintain vehicle history

3. IMPORTANT MVP SCOPE

This is an MVP.

Prioritize:

Complete user flows

High-quality UX

Realistic mock data

Interactive frontend states

Responsive layouts

Reusable components

Clear information architecture

Premium visual design

Do NOT attempt to implement a complicated production backend.

Use realistic local/mock data where necessary.

Architecture should make it easy to replace mock data with real API calls later.

4. REQUIRED TECH STACK

Use:

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

Lucide React Icons

Motion / Framer Motion

CSS backdrop-filter

Modern CSS

Reusable component architecture

Use clean, maintainable TypeScript.

Use reusable components instead of duplicating UI.

Create a responsive implementation for:

Desktop

Tablet

Mobile

The application should feel excellent at approximately:

1440px

1280px

1024px

768px

390px

375px

5. DESIGN PHILOSOPHY

Use an Apple-inspired design philosophy focused on:

clarity

hierarchy

restraint

typography

spacing

depth

intentional motion

interaction feedback

polished transitions

visual consistency

Use Liquid Glass as a visual material, not as a gimmick.

The interface should feel like:

"Premium technology software designed with extreme attention to detail."

Do not copy Apple's logo, proprietary interface, branded assets, or exact layouts.

Use an original visual identity for this SaaS platform.

6. VISUAL IDENTITY

Use a sophisticated dark interface.

Primary visual language:

near-black

deep charcoal

graphite

soft white

muted gray

subtle translucent surfaces

restrained gradients

premium accent colors

Use different accent identities for each module.

Event

Use a subtle:

blue

violet

indigo

visual atmosphere.

Visual references:

calendars

event tickets

venues

QR codes

schedules

Merchandise

Use a sophisticated:

neutral

silver

white

subtle warm accent

visual atmosphere.

Visual references:

product photography

packages

shopping

inventory

orders

analytics

Auto Care

Use:

graphite

deep charcoal

subtle emerald

metallic-inspired accents

Visual references:

automobiles

detailing studios

service bays

tools

scheduling

vehicle profiles

The three modules should feel visually related but immediately distinguishable.

7. LIQUID GLASS DESIGN SYSTEM

Create a genuine Liquid Glass-inspired design system.

Use:

translucent surfaces

backdrop blur

subtle transparency

fine borders

inner highlights

soft reflections

controlled shadows

large rounded corners

layered depth

subtle gradients

adaptive contrast

Do NOT put every piece of content inside a glass card.

Glass should represent hierarchy.

Use:

Solid surfaces

For:

primary application content

tables

forms

important data

Glass surfaces

For:

floating navigation

contextual controls

overlays

filters

floating summaries

important interactive elements

Minimal surfaces

For:

editorial headings

empty space

section introductions

large visual presentations

Avoid:

excessive glass

excessive blur

unreadable text

excessive gradients

glowing everything

excessive rounded cards

8. APPLICATION STRUCTURE

Create a unified SaaS application shell.

Desktop:

┌─────────────────────────────────────────────────────────────┐
│ Top Bar                                                     │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│ Sidebar      │              Main Content                    │
│              │                                              │
│ Overview     │                                              │
│ Events       │                                              │
│ Merchandise  │                                              │
│ Auto Care    │                                              │
│ Customers    │                                              │
│ Reports      │                                              │
│              │                                              │
│ Settings     │                                              │
└──────────────┴──────────────────────────────────────────────┘


The sidebar should feel premium and minimal.

Do not make it look like a traditional enterprise admin panel.

Use:

floating sections

subtle active-state animation

smooth module transitions

clear icons

compact typography

9. TOP NAVIGATION

Create a premium top navigation area.

Include:

Left:

SaaS logo

Product name

Center or contextual:

Current module

Optional workspace selector

Right:

Search

Notifications

Help

User avatar

Account menu

Use a subtle glass surface.

10. MODULE SWITCHER

Create a beautiful module switcher.

The user should be able to switch between:

Event

Event Booking & Management

Commerce

Merchandise & E-commerce

Auto Care

Car Wash & Auto Detailing

The module switcher should feel like changing workspaces rather than simply clicking a sidebar link.

Create a polished transition when switching modules.

For example:

WORKSPACE

◉ Event
  Booking & Management

◯ Commerce
  Merchandise & Inventory

◯ Auto Care
  Car Wash & Detailing


11. GLOBAL DASHBOARD

Create a unified overview dashboard.

Heading:

"Good morning."

Supporting text:

"Here's what's happening across your business today."

Show high-level metrics.

Example:

Today's Revenue
₱48,250

Bookings
34

Orders
18

Vehicles Serviced
21


Create a visual overview of the three modules.

Do not simply create four identical statistic cards.

Use different compositions.

12. GLOBAL DASHBOARD — EVENT

Show:

Today's events

Upcoming events

Tickets sold

Attendee count

Event revenue

Upcoming schedules

Example:

UPCOMING EVENT

Tech & Innovation Summit
September 28
09:00 AM — 05:00 PM

342 / 500 attendees

View Event →


13. GLOBAL DASHBOARD — MERCHANDISE

Show:

Today's sales

Orders

Low-stock products

Top products

Pending fulfillment

Example:

SALES

₱128,450

+18.4%

Orders
128

Pending fulfillment
17


Use a sophisticated chart.

14. GLOBAL DASHBOARD — AUTO CARE

Show:

Today's appointments

Vehicles serviced

Revenue

Active jobs

Available bays

Example:

AUTO CARE

21 vehicles today

16 completed
5 in progress

Bays

01  BUSY
02  BUSY
03  AVAILABLE
04  BUSY


15. EVENT MODULE

Create a complete Event Management MVP.

Sidebar:

Overview

Events

Calendar

Bookings

Attendees

Tickets

Check-in

16. EVENT DASHBOARD

Show:

Upcoming events

Today's bookings

Ticket sales

Attendance

Revenue

Capacity

Use:

charts

event previews

calendar fragments

attendee summaries

Avoid generic cards.

17. EVENT CREATION

Create an event creation workflow.

Fields:

Event name

Description

Event image

Date

Start time

End time

Venue

Address

Capacity

Ticket types

Ticket price

Ticket quantity

Include:

"Save Draft"

"Publish Event"

The form should feel premium and easy to use.

18. EVENT CALENDAR

Create a polished calendar.

Support:

Month

Week

Day

Display:

events

schedules

capacity

bookings

Use smooth transitions.

Do not make the calendar visually dense.

19. EVENT BOOKINGS

Show booking management.

Columns:

Booking ID

Customer

Event

Ticket

Quantity

Amount

Status

Date

Statuses:

Pending

Confirmed

Cancelled

Checked In

Use filters and search.

20. EVENT ATTENDEES

Show attendee management.

Include:

attendee

ticket

booking

status

check-in status

Allow:

"Check In"

21. EVENT QR CHECK-IN

Create a dedicated check-in experience.

Large QR scanner interface.

After scanning:

✓ CHECK-IN SUCCESSFUL

John Smith

VIP Ticket

Tech & Innovation Summit

09:32 AM


Include realistic success and invalid-ticket states.

22. MERCHANDISE MODULE

Create a complete Merchandise Management MVP.

Sidebar:

Overview

Products

Categories

Inventory

Orders

Customers

Discounts

23. MERCHANDISE DASHBOARD

Show:

Sales

Orders

Revenue

Average order value

Inventory alerts

Top products

Use a premium analytics composition.

24. PRODUCT MANAGEMENT

Create:

Product list

Product creation

Product editing

Product details

Product fields:

Product name

Description

Product images

Category

SKU

Price

Compare-at price

Variants

Stock quantity

Status

Statuses:

Active

Draft

Out of stock

25. PRODUCT DETAIL

Create a beautiful product detail page.

Show:

large product image

product name

price

SKU

inventory

variants

sales

recent orders

Use product photography as a major visual element.

26. INVENTORY

Create inventory management.

Show:

PRODUCT             STOCK       STATUS

Premium Hoodie      124         Healthy
Classic Shirt        42         Healthy
Limited Cap           8         Low Stock
Event Jacket          0         Out of Stock


Include:

search

filters

stock adjustment

low-stock indicators

27. ORDER MANAGEMENT

Create an order-management interface.

Order statuses:

Pending
↓
Confirmed
↓
Processing
↓
Packed
↓
Shipped
↓
Delivered


Show order timeline.

Example:

ORDER #10428

John Smith
3 items

₱3,498

✓ Payment received
✓ Order confirmed
● Processing
○ Shipped
○ Delivered


28. CUSTOMER SHOPPING EXPERIENCE

Even though this is an admin-focused SaaS MVP, create a basic storefront preview.

Include:

product browsing

categories

product detail

cart

checkout

confirmation

The storefront should use the same premium design language.

29. AUTO CARE MODULE

Create a complete Car Wash & Auto Detailing Management MVP.

Sidebar:

Overview

Appointments

Calendar

Vehicles

Services

Work Orders

Staff

Bays

Customers

Payments

30. AUTO CARE DASHBOARD

Show:

TODAY

21 Vehicles
₱18,500 Revenue
16 Completed
5 In Progress


Also show:

active jobs

upcoming appointments

available bays

staff workload

Create a visual operations dashboard rather than a generic admin dashboard.

31. AUTO CARE SERVICES

Create service management.

Example services:

Basic Car Wash

Premium Wash

Interior Cleaning

Exterior Detailing

Full Detailing

Waxing

Paint Correction

Ceramic Coating

Each service should support:

name

description

price

duration

required bay type

status

32. AUTO CARE BOOKING

Create a booking flow.

Step 1:

Select customer.

Step 2:

Select vehicle.

Step 3:

Select service.

Step 4:

Select add-ons.

Step 5:

Select date and time.

Step 6:

Select available bay/staff.

Step 7:

Review.

Step 8:

Confirm booking.

Example:

Toyota GR86

Full Detailing
3 hours

September 28
1:00 PM

Bay 02

Detailer:
Mark Santos

Total:
₱4,500


33. RESOURCE SCHEDULING

This is one of the most important features of the Auto Care MVP.

The system should visually communicate:

Service + Staff + Bay + Time

Example:

TODAY

09:00

BAY 01
Toyota Vios
Premium Wash
Mark

BAY 02
Honda Civic
Full Detailing
John

BAY 03
AVAILABLE

10:00

BAY 01
Ford Ranger
Exterior Detail
Mark

BAY 02
Toyota GR86
Ceramic Coating
John


Use drag-and-drop interaction if practical.

If not, provide an interactive scheduling interface.

34. VEHICLE MANAGEMENT

Create vehicle profiles.

Example:

TOYOTA GR86

Customer
John Smith

Plate
ABC 1234

Color
White

Service History

Sep 12
Ceramic Coating
Completed

Aug 04
Full Detailing
Completed

Jun 18
Premium Wash
Completed


The vehicle profile should feel like a digital service record.

35. WORK ORDER

Create a detailed work-order interface.

Status:

Booked
↓
Confirmed
↓
Vehicle Arrived
↓
In Queue
↓
In Progress
↓
Quality Check
↓
Completed


Include:

customer

vehicle

service

staff

bay

notes

checklist

before photos

after photos

payment

36. STAFF MANAGEMENT

Show:

staff members

roles

availability

assigned jobs

workload

Example:

Mark Santos
Detailer

Today's Jobs
4

Current
Toyota GR86

Status
In Progress


37. BAY MANAGEMENT

Create a visual bay management screen.

Example:

BAY 01
BUSY
Toyota Vios

BAY 02
BUSY
Honda Civic

BAY 03
AVAILABLE

BAY 04
MAINTENANCE


Use visual status indicators.

38. PAYMENT EXPERIENCE

Create a shared payment interface that can be reused across modules.

Support mock payment methods:

Cash

Card

Online Payment

Do not integrate real payment processing yet.

Show:

subtotal

discount

tax if applicable

deposit

balance

total

payment status

39. CUSTOMERS

Create a shared customer management module.

A customer profile should be able to contain:

name

email

phone

bookings

orders

vehicles

payments

activity history

For Auto Care, show vehicles.

For Merchandise, show orders.

For Events, show bookings.

40. NOTIFICATIONS

Create a notification center.

Examples:

Event:

"Your event booking has been confirmed."

Merchandise:

"Order #10428 has been shipped."

Auto Care:

"Your detailing appointment is tomorrow at 1:00 PM."

Use mock notifications.

Create read/unread states.

41. SEARCH

Create a global search.

Search across:

customers

events

bookings

products

orders

vehicles

work orders

Use a polished command-palette style interaction.

Keyboard shortcut:

CMD/CTRL + K

42. REPORTS

Create a basic reports section.

Allow switching between:

Event

Merchandise

Auto Care

Show appropriate metrics.

Event:

bookings

attendance

ticket sales

revenue

Merchandise:

sales

orders

products

inventory

Auto Care:

vehicles serviced

services

revenue

staff workload

Do not build advanced BI functionality.

Focus on MVP visual reporting.

43. SETTINGS

Create:

Business profile

Account

Team

Notifications

Appearance

Billing placeholder

Create a polished settings interface.

44. RESPONSIVE MOBILE EXPERIENCE

The application must work beautifully on mobile.

Do not simply shrink the desktop UI.

On mobile:

use bottom navigation where appropriate

convert tables into cards

use horizontal scrolling for analytics

use sheets/drawers for filters

make forms comfortable

preserve touch-friendly controls

The mobile experience should feel like a real SaaS mobile application.

45. MOBILE NAVIGATION

Use:

Home
Modules
Activity
Notifications
Profile


The Modules screen should allow:

Event
Commerce
Auto Care


Switching modules should be smooth.

46. MOTION

Use Motion / Framer Motion.

Prioritize:

page transitions

module switching

sidebar animation

dropdown animation

modal animation

bottom-sheet animation

hover feedback

button press feedback

chart entrance

table transitions

notification transitions

subtle scroll animation

Use spring-based transitions where appropriate.

Do not animate everything.

Motion must communicate hierarchy and interaction.

Support:

prefers-reduced-motion

47. INTERACTION QUALITY

Every major interaction should have a clear state.

Include:

hover

focus

active

disabled

loading

success

error

empty

confirmation

Do not create buttons that appear functional but do nothing.

For MVP, interactions can modify local/mock state.

48. MOCK DATA

Use realistic mock data.

Do NOT use:

Lorem ipsum

random meaningless names

placeholder lorem text

obviously fake dashboard numbers

Use realistic examples such as:

Customers:

John Smith

Maria Santos

Alex Rivera

Products:

Premium Hoodie

Classic Shirt

Limited Edition Cap

Vehicles:

Toyota GR86

Honda Civic

Ford Ranger

Toyota Vios

Events:

Tech & Innovation Summit

Creative Business Workshop

Community Expo

Use Philippine Peso (₱) for example financial data.

49. COMPONENT ARCHITECTURE

Create reusable components.

Examples:

AppShell
Sidebar
TopNavigation
ModuleSwitcher
DashboardHeader
GlassPanel
MetricCard
DataTable
SearchCommand
NotificationCenter
Calendar
StatusBadge
Modal
Drawer
FormField
DatePicker
TimePicker
Chart
EmptyState
LoadingState
ConfirmDialog


Create module-specific components:

EventCard
TicketCard
AttendeeTable
QRCodeCheckIn

ProductCard
InventoryTable
OrderTimeline
Cart

VehicleCard
ServiceCard
BayCard
WorkOrder
ServiceTimeline


Avoid duplicating components.

50. DATA ARCHITECTURE

Structure mock data as if it will eventually connect to a backend.

Create clear TypeScript types/interfaces for:

User
Business
Customer

Event
Ticket
Booking
Attendee
CheckIn

Product
ProductVariant
InventoryItem
Order
OrderItem

Vehicle
Service
Appointment
WorkOrder
StaffMember
Bay
Payment

Notification


Keep business logic separated from UI components where practical.

51. FUTURE BACKEND READINESS

Do not hard-code everything directly into JSX.

Create service/data layers that can later be replaced with:

REST API

GraphQL

Supabase

Firebase

custom backend

The MVP can use mock data, but the architecture should make future backend integration straightforward.

52. EMPTY STATES

Create beautiful empty states.

Examples:

No events:

"Your events will appear here."

No products:

"Start building your catalog."

No vehicles:

"Add your first vehicle."

No appointments:

"No appointments scheduled for today."

Do not use generic blank screens.

53. LOADING STATES

Use polished skeleton loaders.

Do not show a blank page during simulated loading.

Create reusable skeleton components.

54. ERROR STATES

Create useful error states.

Example:

"Something went wrong."

"Try again"

Do not expose technical errors to the user.

55. LANDING / LOGIN EXPERIENCE

Create a premium login screen before entering the SaaS platform.

Use:

dark background

subtle gradient

Liquid Glass login panel

elegant typography

product branding

Include:

Email

Password

Remember me

Sign In

Forgot Password

Also include:

"Continue as Demo"

The Demo button should enter the MVP dashboard using mock data.

56. DEMO MODE

Because this is an MVP, create a Demo Mode.

The user should be able to explore the platform immediately.

Provide:

"Explore Demo"

Then automatically enter the SaaS dashboard with realistic mock data.

No backend authentication is required for the demo.

57. PRICING PLACEHOLDER

Create a simple SaaS pricing page or billing section.

Plans:

Starter
Professional
Business

Do not implement real subscription billing.

Use placeholder interactions for now.

The purpose is to demonstrate how the SaaS could eventually monetize.

58. ACCESSIBILITY

Follow modern accessibility practices.

Include:

semantic HTML

keyboard navigation

visible focus states

sufficient contrast

ARIA labels where appropriate

accessible dialogs

accessible forms

reduced motion support

Do not sacrifice usability for visual effects.

59. PERFORMANCE

Keep the application performant.

Avoid:

unnecessary animations

huge unnecessary dependencies

excessive blur

excessive DOM complexity

continuously running animations

Use animations only where they provide value.

60. RESPONSIVE DESIGN QUALITY

Desktop should feel spacious and premium.

Tablet should remain comfortable.

Mobile should feel intentionally designed.

Do not allow:

horizontal overflow

broken tables

overlapping panels

clipped text

unusable buttons

unreadable charts

broken navigation

61. WHAT NOT TO DO

DO NOT create:

generic SaaS template

generic Bootstrap-style dashboard

excessive cards

excessive gradients

excessive glass

giant gradient blobs

unnecessary illustrations

random stock imagery

fake functionality

meaningless charts

repetitive layouts

excessive animations

Do not make every page look identical.

Each module should have its own visual storytelling.

62. CORE PRODUCT EXPERIENCE

The most important experience is:

ONE PLATFORM
     │
     ├── EVENT
     │     ├── Events
     │     ├── Calendar
     │     ├── Bookings
     │     ├── Tickets
     │     └── Check-in
     │
     ├── COMMERCE
     │     ├── Products
     │     ├── Inventory
     │     ├── Orders
     │     └── Customers
     │
     └── AUTO CARE
           ├── Appointments
           ├── Vehicles
           ├── Services
           ├── Work Orders
           ├── Staff
           └── Bays


The platform should make the relationship between these modules obvious.

63. FINAL VISUAL DIRECTION

The final product should feel like:

Apple-inspired product design + modern SaaS + Liquid Glass + professional business operations software.

It should be:

premium

sophisticated

minimal

immersive

highly usable

responsive

visually distinctive

professionally animated

modern

scalable

The visual hierarchy should prioritize actual business information over decoration.

64. FINAL QUALITY BAR

Do not simply add the words "Liquid Glass" to a normal dashboard.

Actually design the application around:

depth

materials

typography

spacing

hierarchy

motion

composition

interaction

responsive behavior

Every screen should feel intentionally designed.

The application should look like something a real SaaS company could launch.

Do not stop at the dashboard.

Build the complete frontend MVP experience including:

Login

Demo Mode

Global Dashboard

Event Module

Merchandise Module

Auto Care Module

Customers

Notifications

Reports

Settings

Responsive Mobile Experience

Use realistic mock data and functional frontend interactions.

Where backend functionality is not available, simulate the behavior locally.

Build the complete redesigned frontend MVP now.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4923799f-f57d-430b-88b6-738bb67932b6).

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
