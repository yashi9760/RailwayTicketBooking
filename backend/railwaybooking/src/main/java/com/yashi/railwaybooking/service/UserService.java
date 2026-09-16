package com.yashi.railwaybooking.service;

import com.yashi.railwaybooking.dto.AuthResponse;
import com.yashi.railwaybooking.dto.LoginRequest;
import com.yashi.railwaybooking.dto.RegisterRequest;
import com.yashi.railwaybooking.entity.User;
import com.yashi.railwaybooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return new AuthResponse(false, "Email is already registered!", null, null, null, null);
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());
        user.setPhone(req.getPhone());
        user.setRole("USER");

        User saved = userRepository.save(user);
        return new AuthResponse(true, "Registration successful!", saved.getId(), saved.getFullName(), saved.getEmail(), saved.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        Optional<User> userOpt = userRepository.findByEmailAndPassword(req.getEmail(), req.getPassword());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return new AuthResponse(true, "Login successful!", user.getId(), user.getFullName(), user.getEmail(), user.getRole());
        }
        return new AuthResponse(false, "Invalid email or password!", null, null, null, null);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
