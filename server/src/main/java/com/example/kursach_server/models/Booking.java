package com.example.kursach_server.models;

import static jakarta.persistence.GenerationType.UUID;

import com.example.kursach_server.dto.booking.CreateBookingDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Booking {
    @Id
    @GeneratedValue(strategy = UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne
    @NotNull
    private User user;

    @ManyToOne
    @NotNull
    private Tour tour;

    @ManyToOne
    @JoinColumn(name = "taken_by")
    private User employee;

    @Column(nullable = false, columnDefinition = "text")
    private String roomType;

    @Column(nullable = false, columnDefinition = "text")
    private String nutritionType;

    @Column(nullable = false, columnDefinition = "integer")
    private int adultsAmount;

    @Column(nullable = false, columnDefinition = "integer")
    private int childrenAmount;

    @Column(nullable = false, columnDefinition = "date")
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Column(nullable = false, columnDefinition = "date")
    @Temporal(TemporalType.DATE)
    private Date endDate;

    @Column(nullable = false, columnDefinition = "date")
    @Temporal(TemporalType.DATE)
    private Date bookingDate;

    @Column(nullable = false, columnDefinition = "double precision")
    private double totalPrice;

    @Column(nullable = false, columnDefinition = "text")
    private String status;
    public Booking() {}
    public Booking(CreateBookingDTO createBookingDTO) {
        startDate = createBookingDTO.getStartDate();
        endDate = createBookingDTO.getEndDate();
        totalPrice = createBookingDTO.getTotalPrice();
        roomType = createBookingDTO.getRoomType();
        nutritionType = createBookingDTO.getNutrType();
        adultsAmount = createBookingDTO.getAdultsAmount();
        childrenAmount = createBookingDTO.getChildrenAmount();
        bookingDate = new Date();
        status = "На рассмотрении";
    }
}
