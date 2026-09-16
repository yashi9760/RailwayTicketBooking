package com.yashi.railwaybooking.service;

import com.yashi.railwaybooking.entity.Train;
import com.yashi.railwaybooking.repository.TrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TrainService {

    @Autowired
    private TrainRepository trainRepository;

    public Train addTrain(Train train) {
        if (train.getTotalSeats() != null && train.getAvailableSeats() == null) {
            train.setAvailableSeats(train.getTotalSeats());
        }
        return trainRepository.save(train);
    }

    public List<Train> getAllTrains() {
        return trainRepository.findAll();
    }

    public Optional<Train> getTrainById(Long trainId) {
        return trainRepository.findById(trainId);
    }

    public List<Train> searchTrains(String source, String destination) {
        if (source == null && destination == null) {
            return getAllTrains();
        }
        String src = (source != null) ? source.trim() : "";
        String dst = (destination != null) ? destination.trim() : "";
        return trainRepository.searchTrains(src, dst);
    }

    public Train updateTrain(Long trainId, Train updatedTrain) {
        return trainRepository.findById(trainId).map(train -> {
            train.setTrainName(updatedTrain.getTrainName());
            train.setTrainNumber(updatedTrain.getTrainNumber());
            train.setSourceStation(updatedTrain.getSourceStation());
            train.setDestinationStation(updatedTrain.getDestinationStation());
            train.setDepartureTime(updatedTrain.getDepartureTime());
            train.setArrivalTime(updatedTrain.getArrivalTime());
            train.setFare(updatedTrain.getFare());
            train.setTotalSeats(updatedTrain.getTotalSeats());
            train.setAvailableSeats(updatedTrain.getAvailableSeats());
            train.setTrainType(updatedTrain.getTrainType());
            return trainRepository.save(train);
        }).orElseThrow(() -> new RuntimeException("Train not found with id " + trainId));
    }

    public void deleteTrain(Long trainId) {
        trainRepository.deleteById(trainId);
    }
}
