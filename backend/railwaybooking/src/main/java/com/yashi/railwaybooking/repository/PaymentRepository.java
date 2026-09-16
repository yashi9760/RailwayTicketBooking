package com.yashi.railwaybooking.repository;

import com.yashi.railwaybooking.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBooking_BookingId(Long bookingId);
    Optional<Payment> findByTransactionId(String transactionId);
}
