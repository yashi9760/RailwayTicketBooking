package com.yashi.railwaybooking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "PAYMENTS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAYMENT_ID")
    private Long paymentId;

    @OneToOne
    @JoinColumn(name = "BOOKING_ID", nullable = false)
    private Booking booking;

    @Column(name = "AMOUNT", nullable = false)
    private Double amount;

    @Column(name = "PAYMENT_STATUS")
    private String paymentStatus = "SUCCESS";

    @Column(name = "PAYMENT_METHOD")
    private String paymentMethod = "UPI";

    @Column(name = "TRANSACTION_ID", unique = true, nullable = false)
    private String transactionId;

    @Column(name = "PAYMENT_DATE")
    private LocalDateTime paymentDate = LocalDateTime.now();
}
