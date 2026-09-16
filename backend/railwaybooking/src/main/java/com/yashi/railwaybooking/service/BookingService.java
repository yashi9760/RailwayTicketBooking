package com.yashi.railwaybooking.service;

import com.yashi.railwaybooking.dto.BookingRequest;
import com.yashi.railwaybooking.entity.Booking;
import com.yashi.railwaybooking.entity.Train;
import com.yashi.railwaybooking.entity.User;
import com.yashi.railwaybooking.repository.BookingRepository;
import com.yashi.railwaybooking.repository.TrainRepository;
import com.yashi.railwaybooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TrainRepository trainRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentService paymentService;

    private final Random random = new Random();

    @Transactional
    public Booking bookTicket(BookingRequest req) {
        Train train = trainRepository.findById(req.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found with ID: " + req.getTrainId()));

        int count = (req.getSeatsBooked() != null && req.getSeatsBooked() > 0) ? req.getSeatsBooked() : 1;

        if (train.getAvailableSeats() < count) {
            throw new RuntimeException("Insufficient seats available! Only " + train.getAvailableSeats() + " seats left.");
        }

        // Resolve user
        User user = null;
        if (req.getUserId() != null) {
            user = userRepository.findById(req.getUserId()).orElse(null);
        }
        if (user == null) {
            user = userRepository.findAll().stream().findFirst().orElseGet(() -> {
                User defaultUser = new User();
                defaultUser.setFullName(req.getPassengerName() != null ? req.getPassengerName() : "Passenger");
                defaultUser.setEmail("passenger" + System.currentTimeMillis() + "@railway.com");
                defaultUser.setPassword("password123");
                return userRepository.save(defaultUser);
            });
        }

        // Deduct seats
        train.setAvailableSeats(train.getAvailableSeats() - count);
        trainRepository.save(train);

        // Generate PNR and Seat numbers
        String pnr = generatePnr();
        String coach = (req.getCoach() != null && !req.getCoach().trim().isEmpty()) ? req.getCoach().trim() : "B1";
        String seatNumber = coach + "-" + (random.nextInt(64) + 1);

        Double totalAmount = req.getTotalAmount();
        if (totalAmount == null || totalAmount <= 0) {
            totalAmount = train.getFare() * count;
        }

        Booking booking = new Booking();
        booking.setPnr(pnr);
        booking.setPassengerName(req.getPassengerName() != null ? req.getPassengerName() : user.getFullName());
        booking.setTravelDate(req.getTravelDate() != null ? req.getTravelDate() : LocalDate.now().plusDays(1));
        booking.setCoach(coach);
        booking.setSeatNumber(seatNumber);
        booking.setSeatsBooked(count);
        booking.setTotalAmount(totalAmount);
        booking.setBookingStatus("CONFIRMED");
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUser(user);
        booking.setTrain(train);

        Booking saved = bookingRepository.save(booking);

        // Record payment
        paymentService.processPayment(saved, totalAmount, req.getPaymentMethod());

        return saved;
    }

    @Transactional
    public Booking bookDirect(Booking booking) {
        // Fallback for direct entity JSON submission
        if (booking.getTravelDate() == null) {
            booking.setTravelDate(LocalDate.now().plusDays(1));
        }
        if (booking.getBookingStatus() == null) {
            booking.setBookingStatus("CONFIRMED");
        }
        if (booking.getPnr() == null || booking.getPnr().isEmpty()) {
            booking.setPnr(generatePnr());
        }

        // Resolve train
        Train train = null;
        if (booking.getTrain() != null && booking.getTrain().getTrainId() != null) {
            train = trainRepository.findById(booking.getTrain().getTrainId()).orElse(null);
        }
        if (train == null) {
            train = trainRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new RuntimeException("No train found in database to attach."));
        }
        booking.setTrain(train);

        int seats = (booking.getSeatsBooked() != null && booking.getSeatsBooked() > 0) ? booking.getSeatsBooked() : 1;
        if (train.getAvailableSeats() >= seats) {
            train.setAvailableSeats(train.getAvailableSeats() - seats);
            trainRepository.save(train);
        }

        // Resolve user
        User user = null;
        if (booking.getUser() != null && booking.getUser().getId() != null) {
            user = userRepository.findById(booking.getUser().getId()).orElse(null);
        }
        if (user == null) {
            user = userRepository.findAll().stream().findFirst().orElseGet(() -> {
                User newUser = new User();
                newUser.setFullName(booking.getPassengerName() != null ? booking.getPassengerName() : "Guest User");
                newUser.setEmail("user_" + System.currentTimeMillis() + "@railway.com");
                newUser.setPassword("password123");
                return userRepository.save(newUser);
            });
        }
        booking.setUser(user);

        if (booking.getCoach() == null) {
            booking.setCoach("B1");
        }
        if (booking.getSeatNumber() == null) {
            booking.setSeatNumber(booking.getCoach() + "-" + (random.nextInt(64) + 1));
        }
        if (booking.getTotalAmount() == null) {
            booking.setTotalAmount(train.getFare() * seats);
        }

        Booking saved = bookingRepository.save(booking);
        paymentService.processPayment(saved, booking.getTotalAmount(), "UPI");
        return saved;
    }

    public Optional<Booking> getBookingByPnr(String pnr) {
        return bookingRepository.findByPnr(pnr);
    }

    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUser_IdOrderByBookingIdDesc(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingIdDesc();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    @Transactional
    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        if ("CANCELLED".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new RuntimeException("Booking is already cancelled!");
        }

        booking.setBookingStatus("CANCELLED");

        // Restore train seats
        Train train = booking.getTrain();
        if (train != null) {
            int seatsToRestore = (booking.getSeatsBooked() != null) ? booking.getSeatsBooked() : 1;
            train.setAvailableSeats(train.getAvailableSeats() + seatsToRestore);
            trainRepository.save(train);
        }

        return bookingRepository.save(booking);
    }

    private String generatePnr() {
        // 10-digit random Indian Railways PNR format
        long pnrNumber = 1000000000L + (long)(random.nextDouble() * 9000000000L);
        return String.valueOf(pnrNumber);
    }
}
