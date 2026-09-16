package com.yashi.railwaybooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private boolean success;
    private String message;
    private Long userId;
    private String fullName;
    private String email;
    private String role;
}
