package com.yashi.railwaybooking.service;

import com.yashi.railwaybooking.entity.Booking;
import com.yashi.railwaybooking.entity.Payment;
import com.yashi.railwaybooking.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Payment processPayment(Booking booking, Double amount, String paymentMethod) {
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod != null ? paymentMethod : "UPI");
        payment.setPaymentStatus("SUCCESS");
        payment.setTransactionId("TXN_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 9000 + 1000));
        payment.setPaymentDate(LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    public Optional<Payment> getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBooking_BookingId(bookingId);
    }
}
