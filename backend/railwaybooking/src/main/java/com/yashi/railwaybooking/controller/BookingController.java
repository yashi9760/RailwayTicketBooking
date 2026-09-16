package com.yashi.railwaybooking.controller;

import com.yashi.railwaybooking.dto.BookingRequest;
import com.yashi.railwaybooking.entity.Booking;
import com.yashi.railwaybooking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pnr/{pnr}")
    public ResponseEntity<?> getBookingByPnr(@PathVariable String pnr) {
        return bookingService.getBookingByPnr(pnr)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body((Booking) null));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookTicket(@RequestBody BookingRequest request) {
        try {
            Booking booking = bookingService.bookTicket(request);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createBookingFallback(@RequestBody Map<String, Object> payload) {
        try {
            // Check if payload matches BookingRequest format
            if (payload.containsKey("trainId") || (payload.containsKey("train") && payload.get("train") instanceof Map)) {
                BookingRequest req = new BookingRequest();
                if (payload.get("trainId") != null) {
                    req.setTrainId(Long.valueOf(payload.get("trainId").toString()));
                } else if (payload.get("train") != null) {
                    Map<?, ?> tMap = (Map<?, ?>) payload.get("train");
                    if (tMap.get("trainId") != null) {
                        req.setTrainId(Long.valueOf(tMap.get("trainId").toString()));
                    }
                }

                if (payload.get("userId") != null) {
                    req.setUserId(Long.valueOf(payload.get("userId").toString()));
                } else if (payload.get("user") != null) {
                    Map<?, ?> uMap = (Map<?, ?>) payload.get("user");
                    if (uMap.get("id") != null) {
                        req.setUserId(Long.valueOf(uMap.get("id").toString()));
                    }
                }

                req.setPassengerName(payload.get("passengerName") != null ? payload.get("passengerName").toString() : null);
                req.setCoach(payload.get("coach") != null ? payload.get("coach").toString() : "B1");
                req.setSeatsBooked(payload.get("seatsBooked") != null ? Integer.valueOf(payload.get("seatsBooked").toString()) : 1);
                if (payload.get("totalAmount") != null) {
                    req.setTotalAmount(Double.valueOf(payload.get("totalAmount").toString()));
                }
                if (payload.get("paymentMethod") != null) {
                    req.setPaymentMethod(payload.get("paymentMethod").toString());
                }

                Booking saved = bookingService.bookTicket(req);
                return ResponseEntity.ok(saved);
            } else {
                Booking booking = new Booking();
                if (payload.get("passengerName") != null) {
                    booking.setPassengerName(payload.get("passengerName").toString());
                }
                Booking saved = bookingService.bookDirect(booking);
                return ResponseEntity.ok(saved);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            Booking cancelled = bookingService.cancelBooking(id);
            return ResponseEntity.ok(cancelled);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}