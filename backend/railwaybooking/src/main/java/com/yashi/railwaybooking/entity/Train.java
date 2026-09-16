package com.yashi.railwaybooking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "TRAINS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TRAIN_ID")
    private Long trainId;

    @Column(name = "TRAIN_NAME", nullable = false)
    private String trainName;

    @Column(name = "TRAIN_NUMBER", nullable = false)
    private String trainNumber;

    @Column(name = "SOURCE_STATION", nullable = false)
    private String sourceStation;

    @Column(name = "DESTINATION_STATION", nullable = false)
    private String destinationStation;

    @Column(name = "DEPARTURE_TIME")
    private String departureTime = "08:00 AM";

    @Column(name = "ARRIVAL_TIME")
    private String arrivalTime = "08:00 PM";

    @Column(name = "FARE", nullable = false)
    private Double fare;

    @Column(name = "TOTAL_SEATS")
    private Integer totalSeats = 100;

    @Column(name = "AVAILABLE_SEATS")
    private Integer availableSeats = 100;

    @Column(name = "TRAIN_TYPE")
    private String trainType = "Express";
}