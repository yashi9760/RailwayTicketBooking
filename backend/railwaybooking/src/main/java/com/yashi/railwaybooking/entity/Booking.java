package com.yashi.railwaybooking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "BOOKINGS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOOKING_ID")
    private Long bookingId;

    @Column(name = "PNR", unique = true, nullable = false)
    private String pnr;

    @Column(name = "PASSENGER_NAME", nullable = false)
    private String passengerName;

    @Column(name = "JOURNEY_DATE", nullable = false)
    private LocalDate travelDate;

    @Column(name = "COACH")
    private String coach = "B1";

    @Column(name = "SEAT_NUMBER")
    private String seatNumber;

    @Column(name = "PASSENGERS")
    private Integer seatsBooked = 1;

    @Column(name = "TOTAL_AMOUNT")
    private Double totalAmount;

    @Column(name = "BOOKING_STATUS")
    private String bookingStatus = "CONFIRMED";

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private User user;

    @ManyToOne
    @JoinColumn(name = "TRAIN_ID", nullable = false)
    private Train train;
}