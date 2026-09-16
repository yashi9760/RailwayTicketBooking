<div align="center">
  <h1>🚆 Railway Ticket Booking System (RailYatri)</h1>
  
  <p>
    <strong>A full-stack, enterprise-grade Railway Ticket Reservation System</strong>
  </p>
  
  <!-- Replace these badges with real ones if you have CI/CD set up -->
  <img alt="Java" src="https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=java" />
  <img alt="Spring Boot" src="https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=flat-square&logo=springboot" />
  <img alt="Oracle" src="https://img.shields.io/badge/Oracle-Database-red?style=flat-square&logo=oracle" />
  <img alt="Frontend" src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-blue?style=flat-square" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" />
</div>

<br />

Welcome to the **Railway Ticket Booking System**, a comprehensive, full-stack application designed to emulate the core functionalities of modern railway reservation platforms like IRCTC. Built with robustness and scalability in mind, it seamlessly handles user authentication, dynamic train searches, smart seat allocation, and live PNR tracking.

---

## ✨ Key Features

- 🔍 **Dynamic Train Search**: Search for trains across various routes (e.g., Delhi, Mumbai, Varanasi, Bengaluru, Chennai) using intuitive source/destination filtering.
- 🎟️ **Instant Ticket Reservation**: Book tickets for multiple passengers across different coach classes (1A, 2A, 3A, Sleeper, Chair Car).
- 🔢 **Automated PNR Generation**: Generate unique, industry-standard 10-digit PNR numbers for every successful transaction.
- 💺 **Smart Inventory Management**: Real-time seat deduction upon booking and automatic restoration upon cancellation.
- 📄 **Printable E-Tickets (ERS)**: Access highly formatted Electronic Reservation Slips complete with QR code watermarks, barcodes, and coach/seat badges.
- 📡 **Live PNR Enquiry**: Instantly track your reservation status in real-time.
- 🔐 **Secure Authentication**: Robust user registration and login flows with session persistence.
- 🛠️ **Admin Dashboard**: Specialized administrative controls to add new trains, manage routes, and update seating capacities.

---

## 🛠️ Technology Stack

### Backend
- **Java 21**: The latest LTS release for optimal performance.
- **Spring Boot**: For building the robust REST API architecture.
- **Spring Data JPA / Hibernate**: For seamless object-relational mapping.
- **Maven**: Dependency management and project builds.

### Database
- **Oracle Database (19c / 21c / 23c / XE)**: Enterprise-grade relational database for strict ACID compliance and data integrity.

### Frontend
- **HTML5 & CSS3**: Responsive, modern, and accessible user interface.
- **Vanilla JavaScript**: Lightweight and fast client-side logic and DOM manipulation.

---

## 🏗️ Project Architecture

```text
RailwayTicketBookingSystem/
├── backend/
│   └── railwaybooking/
│       ├── pom.xml                                 # Maven configuration
│       └── src/main/
│           ├── java/com/yashi/railwaybooking/
│           │   ├── RailwaybookingApplication.java   # App bootstrap
│           │   ├── CorsConfig.java                  # Cross-Origin Resource Sharing settings
│           │   ├── entity/                          # JPA Entities (User, Train, Booking, Payment)
│           │   ├── repository/                      # Spring Data Repositories
│           │   ├── service/                         # Business logic & algorithms
│           │   ├── controller/                      # REST API Endpoints
│           │   └── dto/                             # Data Transfer Objects
│           └── resources/
│               ├── application.properties           # Database configuration
│               └── static/                          # Bundled web UI (served directly on :8081)
├── database/
│   ├── schema.sql                                  # Oracle DDL tables & constraints
│   ├── data.sql                                    # Oracle DML seed data
│   └── README.md                                   # Database setup documentation
└── README.md                                       # Project documentation
```

---

## 🚀 Getting Started

Follow these instructions to set up the project on your local machine for development and testing purposes.

### Prerequisites

1. **Java Development Kit (JDK)**: Version 21 or higher.
2. **Oracle Database**: Make sure it is running on port `1521` (Service: `ORCLPDB` or `XE`).
3. **Maven**: (Optional, as the project includes the Maven wrapper).

### 1. Database Configuration

Navigate to `backend/railwaybooking/src/main/resources/application.properties` and provide your Oracle DB credentials:

```properties
server.port=8081
spring.datasource.url=jdbc:oracle:thin:@localhost:1521/ORCLPDB
spring.datasource.username=YOUR_ORACLE_USERNAME
spring.datasource.password=YOUR_ORACLE_PASSWORD
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
spring.jpa.database-platform=org.hibernate.dialect.OracleDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

> **💡 Note**: The application uses Hibernate's `ddl-auto=update` and includes seed runners to automatically populate default trains and demo users upon the first launch! 

### 2. Running the Backend

Open your terminal and navigate to the backend directory:

```bash
cd backend/railwaybooking
```

Run the application using the Maven wrapper:

**On Windows:**
```cmd
mvnw.cmd spring-boot:run
```

**On macOS/Linux:**
```bash
./mvnw spring-boot:run
```

The backend server will start successfully on `http://localhost:8081`.

### 3. Accessing the Application

Since the frontend is bundled in the static resources, you can simply open your browser and navigate to:

👉 **`http://localhost:8081/`**

---

## 🔐 Default Test Credentials

Use the following credentials to explore the system without registering manually:

| Role | Email Address | Password |
|------|--------------|----------|
| **Admin** | `admin@railway.com` | `admin123` |
| **Demo User** | `yashi@example.com` | `Yashi@123` |

---

## 📡 REST API Documentation

A brief overview of the exposed REST endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/trains/all` | Fetch a list of all available trains. |
| `GET` | `/api/trains/search` | Search trains by `source` and `destination`. |
| `POST` | `/api/trains/add` | (Admin) Add a new train to the schedule. |
| `POST` | `/api/bookings/book` | Process a ticket booking and generate a PNR. |
| `GET` | `/api/bookings/pnr/{pnr}` | Retrieve booking status by a 10-digit PNR. |
| `GET` | `/api/bookings/user/{userId}` | Retrieve booking history for a specific user. |
| `PUT` | `/api/bookings/cancel/{id}` | Cancel a booking and restore seat inventory. |
| `POST` | `/api/auth/login` | Authenticate user credentials. |
| `POST` | `/api/auth/register` | Register a new user account. |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues). 

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
<div align="center">
  <i>Developed with ❤️ for seamless railway journeys.</i>
</div>
