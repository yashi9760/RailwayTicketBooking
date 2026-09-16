package com.yashi.railwaybooking.controller;

import com.yashi.railwaybooking.entity.Payment;
import com.yashi.railwaybooking.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Payment> getPaymentByBookingId(@PathVariable Long bookingId) {
        return paymentService.getPaymentByBookingId(bookingId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
