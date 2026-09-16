package com.yashi.railwaybooking;

import com.yashi.railwaybooking.entity.Train;
import com.yashi.railwaybooking.entity.User;
import com.yashi.railwaybooking.repository.TrainRepository;
import com.yashi.railwaybooking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class RailwaybookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(RailwaybookingApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(TrainRepository trainRepository, UserRepository userRepository) {
        return args -> {
            // 1. Seed Default Users if empty
            if (userRepository.count() == 0) {
                User admin = new User(null, "Admin User", "admin@railway.com", "admin123", "9876543210", "ADMIN");
                User demo = new User(null, "Yashi Saxena", "yashi@example.com", "Yashi@123", "9123456780", "USER");
                userRepository.saveAll(List.of(admin, demo));
            }

            // 2. Seed Default Trains if empty
            if (trainRepository.count() == 0) {
                List<Train> initialTrains = List.of(
                    new Train(null, "Vande Bharat Express", "22436", "New Delhi", "Varanasi", "06:00 AM", "02:00 PM", 1750.0, 120, 118, "Vande Bharat"),
                    new Train(null, "Rajdhani Express", "12952", "New Delhi", "Mumbai", "04:55 PM", "12:55 AM", 2450.0, 150, 142, "Superfast"),
                    new Train(null, "Shatabdi Express", "12002", "New Delhi", "Bhopal", "06:00 AM", "02:00 PM", 1350.0, 100, 95, "Shatabdi"),
                    new Train(null, "Duronto Express", "12260", "Mumbai", "Howrah", "05:15 PM", "01:15 AM", 2800.0, 140, 136, "Duronto"),
                    new Train(null, "Bangalore Express", "12628", "New Delhi", "Bengaluru", "08:00 PM", "04:00 AM", 2100.0, 150, 147, "Express"),
                    new Train(null, "Chennai Mail", "12602", "Mumbai", "Chennai", "10:30 PM", "06:30 AM", 1850.0, 120, 116, "Mail"),
                    new Train(null, "Golden Temple Mail", "12903", "Mumbai", "Amritsar", "06:45 PM", "02:45 AM", 1650.0, 130, 125, "Express"),
                    new Train(null, "Vande Bharat Express", "20834", "Howrah", "Puri", "06:10 AM", "02:10 PM", 1420.0, 100, 94, "Vande Bharat")
                );
                trainRepository.saveAll(initialTrains);
            }
        };
    }
}
