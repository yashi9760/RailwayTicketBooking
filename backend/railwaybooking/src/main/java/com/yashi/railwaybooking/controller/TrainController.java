package com.yashi.railwaybooking.controller;

import com.yashi.railwaybooking.entity.Train;
import com.yashi.railwaybooking.service.TrainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trains")
@CrossOrigin(origins = "*")  
public class TrainController {

    @Autowired
    private TrainService trainService;

    @GetMapping("/all")
    public List<Train> getAllTrains() {
        return trainService.getAllTrains();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Train> getTrainById(@PathVariable Long id) {
        return trainService.getTrainById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Train>> searchTrains(
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String destination) {
        return ResponseEntity.ok(trainService.searchTrains(source, destination));
    }

    @PostMapping("/add")
    public ResponseEntity<Train> addTrain(@RequestBody Train train) {
        return ResponseEntity.ok(trainService.addTrain(train));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Train> updateTrain(@PathVariable Long id, @RequestBody Train train) {
        return ResponseEntity.ok(trainService.updateTrain(id, train));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTrain(@PathVariable Long id) {
        trainService.deleteTrain(id);
        return ResponseEntity.ok("Train deleted successfully.");
    }
}