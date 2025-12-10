# Product Design

This document explains the purpose of the product, the user needs it solves, and how the main pages fit together. It provides the "why" behind the application's structure.

---

## 1. Product Purpose

A simple movie ticket booking application, with feature like adding movies to favorite, safe from double booking, user-authentication, role-based-access, can make payements even it failed during payement session.

<img src="../public/seat-layout.png" width="400">

---



## 2. Core User Flows

### 🔹 Flow 1: Browsing Movies

1. User lands on the **Home** page
2. Views now-showing / trailers
3. Opens a **Movie Details** page

### 🔹 Flow 2: Booking a Movie

1. From Movie Details, user goes to **Seat Layout**
2. Selects seats
3. Confirms booking
4. Booking appears in **My Bookings**

### 🔹 Flow 3: Payment

1. If during transaction the user fails to book a show they will re-pay
2. The un-paid / paid bookings will be present in `my-bookings` section
3. The re-payment and seat option wil be available for 10 minutes
4. Booking appears in **My Bookings**

### 🔹 Flow 4: Managing Saved Items

- User saves movies to **Favorites**
- Can revisit them anytime

---

## 3. Page Purpose Breakdown

### **Home**

Entry point where the user sees featured or trending movies.

### **Movies**

Shows the complete movie list.

### **Movie Details**

Shows detailed info, description, cast, dates, and the “Book Now” option.

### **Seat Layout**

Shows seat availability and allows users to choose seats.

### **My Bookings**

Displays all past and current bookings for logged-in users.

### **Favorites**

Stores bookmarked movies for quick access.

### **Admin-Dashboard**

Key data like total bookings, active shows, earnings, and active-shows are displayed on the main admin landing page.

### **Admin-Add Shows**

Interface that allows the adminis to choose a movie, pick time and date slots, set pricing information in order to create new shows.

### **Admin-List Bookings**

Shows all user reservations with date, movie, showtime and seats booked.

### **Admin-List Shows**

Displays the full schedule of shows with timing, total bookings and earning. Helpful for monitoring per show sales.

---

## 4. Design

- Simple, clean UI
- Minimal clicks to complete any task
- Reusable UI components
- Pages designed with clarity and purpose

---

## 5. Authentication

- Clerk is user for authentication and to manager user across client / server
- Admin access is protected by using role acess from clerk

## 6. Save Temporary Bookings

- User can still see and pay for their unpaid shows if problem occur during transaction
- A 10 minute buffer is added after that seats are released

## 7. Notification

## 8. Deployment
