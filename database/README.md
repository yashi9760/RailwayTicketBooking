# Oracle Database Setup Guide

This directory contains database DDL and DML scripts for the **Railway Ticket Booking System**.

## Prerequisites
- Oracle Database 19c / 21c / 23c / XE installed and running (default service: `ORCLPDB` or `XE` on port `1521`).
- Oracle SQL Developer or SQL*Plus command line tool.

## Database Connection Details (Configured in Spring Boot)
- **Host**: `localhost`
- **Port**: `1521`
- **Service Name**: `ORCLPDB`
- **Username**: `system`
- **Password**: `Yashi@123` (or update in `backend/railwaybooking/src/main/resources/application.properties`)

## How to Execute the Scripts

### Method 1: Using Oracle SQL Developer
1. Open **Oracle SQL Developer**.
2. Connect to your database connection (e.g. `system / Yashi@123@localhost:1521/ORCLPDB`).
3. Open `schema.sql` and click **Run Script (F5)** to create tables and indexes.
4. Open `data.sql` and click **Run Script (F5)** to insert sample trains, users, and bookings.

### Method 2: Using SQL*Plus (Command Prompt)
Open your command prompt and run:
```cmd
sqlplus system/Yashi@123@localhost:1521/ORCLPDB @schema.sql
sqlplus system/Yashi@123@localhost:1521/ORCLPDB @data.sql
```

> **Note**: The Spring Boot backend also features Hibernate `ddl-auto=update` and an automated `CommandLineRunner` in `RailwaybookingApplication.java` that automatically ensures initial train and user records exist even if you haven't executed the SQL scripts manually!
