# 🚆 Railway Ticket Booking System (RailYatri)

A full-stack, enterprise-grade Railway Ticket Reservation System built with **Spring Boot 4 (Java 21)**, **Oracle Database (JPA / Hibernate)**, and a responsive **HTML5/CSS3/JavaScript** frontend modeled after modern IRCTC web interfaces.

---

## 🌟 Key Features

1. **Train Search & Schedule**: Search trains dynamically by Source and Destination stations (e.g., Delhi, Mumbai, Varanasi, Bengaluru, Kolkata, Chennai).
2. **Instant Ticket Reservation**: Multi-passenger booking with coach preferences (1A, 2A, 3A, Sleeper, Chair Car).
3. **10-Digit PNR Generation**: Automated unique Indian Railways PNR number generation for every reservation.
4. **Smart Seat Allocation & Inventory**: Real-time seat decrement on booking and automatic seat restoration upon ticket cancellation.
5. **Printable E-Ticket (ERS)**: Formatted official Electronic Reservation Slip with QR code watermark, barcode, coach/seat badge, and browser print/PDF download.
6. **Live PNR Enquiry**: Instant real-time status tracker by 10-digit PNR.
7. **User Authentication**: Account registration and login with session persistence.
8. **Admin Train Management**: Admin dashboard to add new trains, routes, and update seat capacity.

---

## 🏗️ Project Architecture

```
RailwayTicketBookingSystem/
├── backend/
│   └── railwaybooking/
│       ├── pom.xml                                 # Maven configuration (Java 21, Spring Boot 4)
│       └── src/main/
│           ├── java/com/yashi/railwaybooking/
│           │   ├── RailwaybookingApplication.java   # App bootstrap & seed runner
│           │   ├── CorsConfig.java                  # CORS configuration
│           │   ├── entity/                          # JPA Entities (User, Train, Booking, Payment)
│           │   ├── repository/                      # Spring Data Repositories
│           │   ├── service/                         # Business logic & PNR generators
│           │   ├── controller/                      # REST API Endpoints
│           │   └── dto/                             # Data Transfer Objects
│           └── resources/
│               ├── application.properties           # Oracle DB connection
│               └── static/                          # Bundled web UI (served directly on :8081)
│                   ├── index.html
│                   ├── style.css
│                   └── app.js
├── database/
│   ├── schema.sql                                  # Oracle DDL tables & constraints
│   ├── data.sql                                    # Oracle DML seed data (trains & users)
│   └── README.md                                   # Database setup guide
├── frontend/                                       # Standalone frontend copy
│   ├── index.html
│   ├── style.css
│   └── app.js
└── README.md                                       # Master Project Documentation
```

---

## ⚙️ Prerequisites & Setup

### 1. Requirements
- **Java JDK 21+**
- **Maven** (or use included `mvnw.cmd`)
- **Oracle Database 19c / 21c / 23c / XE** running on port `1521` (Service: `ORCLPDB` or `XE`)

### 2. Configure Database Connection
Edit `backend/railwaybooking/src/main/resources/application.properties` with your Oracle DB credentials:
```properties
server.port=8081
spring.datasource.url=jdbc:oracle:thin:@localhost:1521/ORCLPDB
spring.datasource.username=system
spring.datasource.password=Yashi@123
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
spring.jpa.database-platform=org.hibernate.dialect.OracleDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

> **Tip**: You can execute `database/schema.sql` and `database/data.sql` in Oracle SQL Developer or SQL*Plus. The application also automatically seeds default trains and demo users on launch if the database is empty!

---

## 🚀 How to Run

### Step 1: Run Backend (Spring Boot)
Open a terminal in `backend/railwaybooking`:
```cmd
cd backend\railwaybooking
mvnw.cmd spring-boot:run
```
The server will start on **`http://localhost:8081`**.

### Step 2: Open the Web Application
Open your browser and navigate to:
```
http://localhost:8081/
```
*(You can also double-click `frontend/index.html` to run the standalone frontend).*

---

## 🔐 Default Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@railway.com` | `admin123` |
| **Demo User** | `yashi@example.com` | `Yashi@123` |

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/trains/all` | Get all available trains |
| `GET` | `/api/trains/search?source=...&destination=...` | Search trains by route |
| `POST` | `/api/trains/add` | Add a new train route |
| `POST` | `/api/bookings/book` | Book ticket (generates PNR & deducts seats) |
| `GET` | `/api/bookings/pnr/{pnr}` | Query booking status by 10-digit PNR |
| `GET` | `/api/bookings/user/{userId}` | Get all bookings for a user |
| `PUT` | `/api/bookings/cancel/{id}` | Cancel ticket (restores train seats) |
| `POST` | `/api/auth/login` | User login authentication |
| `POST` | `/api/auth/register` | User account registration |
