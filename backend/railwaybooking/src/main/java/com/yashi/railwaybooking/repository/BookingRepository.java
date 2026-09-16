package com.yashi.railwaybooking.repository;

import com.yashi.railwaybooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Find booking by unique PNR number
    Optional<Booking> findByPnr(String pnr);

    // Find all bookings for a specific user ID ordered by latest first
    List<Booking> findByUser_IdOrderByBookingIdDesc(Long userId);

    // Find all bookings ordered by latest first
    List<Booking> findAllByOrderByBookingIdDesc();
}