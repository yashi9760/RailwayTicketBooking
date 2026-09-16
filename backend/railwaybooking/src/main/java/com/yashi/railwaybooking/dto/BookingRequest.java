package com.yashi.railwaybooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Long trainId;
    private Long userId;
    private String passengerName;
    private LocalDate travelDate;
    private String coach;
    private Integer seatsBooked;
    private Double totalAmount;
    private String paymentMethod;
}
