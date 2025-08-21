package com.ecommerce.service;

import com.ecommerce.dto.UserRequest;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;



    @Autowired
    private AuditService auditService;

    public User createUser(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = new User(request.getUsername(), request.getEmail(),
                request.getPassword(),
                request.getFirstName(), request.getLastName());
        
        if (request.getRole() != null) {
            user.setRole(User.Role.valueOf(request.getRole()));
        }
        if (request.getIsFrequentCustomer() != null) {
            user.setIsFrequentCustomer(request.getIsFrequentCustomer());
        }
        
        User savedUser = userRepository.save(user);
        auditService.logAction("User", savedUser.getId(), "CREATE", null, null, savedUser.toString());
        return savedUser;
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User updateUser(Long id, UserRequest request) {
        User user = getUserById(id);
        String oldValues = user.toString();
        
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        if (!user.getEmail().equals(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email is already in use!");
            }
            user.setEmail(request.getEmail());
        }
        
        if (request.getRole() != null) {
            user.setRole(User.Role.valueOf(request.getRole()));
        }
        if (request.getIsFrequentCustomer() != null) {
            user.setIsFrequentCustomer(request.getIsFrequentCustomer());
        }
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            if (request.getPassword().length() < 6) {
                throw new RuntimeException("Password must be at least 6 characters long");
            }
            user.setPassword(request.getPassword());
        }
        
        User updatedUser = userRepository.save(user);
        auditService.logAction("User", id, "UPDATE", null, oldValues, updatedUser.toString());
        return updatedUser;
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        auditService.logAction("User", id, "DELETE", null, user.toString(), null);
        userRepository.deleteById(id);
    }
}