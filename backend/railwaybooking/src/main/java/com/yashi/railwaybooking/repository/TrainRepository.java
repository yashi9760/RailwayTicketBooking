package com.yashi.railwaybooking.repository;

import com.yashi.railwaybooking.entity.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainRepository extends JpaRepository<Train, Long> {
    
    List<Train> findBySourceStationIgnoreCaseAndDestinationStationIgnoreCase(String source, String destination);

    @Query("SELECT t FROM Train t WHERE LOWER(t.sourceStation) LIKE LOWER(CONCAT('%', :source, '%')) AND LOWER(t.destinationStation) LIKE LOWER(CONCAT('%', :destination, '%'))")
    List<Train> searchTrains(@Param("source") String source, @Param("destination") String destination);
}