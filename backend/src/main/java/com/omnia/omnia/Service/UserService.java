package com.omnia.omnia.Service;


import com.omnia.omnia.Entities.Role;
import com.omnia.omnia.Entities.User;
import com.omnia.omnia.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public User create(User user) {
        // Vérifier l'unicité de l'email
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User with email '" + user.getEmail() + "' already exists");
        }

        // Définir la date de création
        user.setCreatedAt(LocalDateTime.now());

        // Actif par défaut
        if (user.getActive() == null) {
            user.setActive(true);
        }

        return userRepository.save(user);
    }

    public User update(UUID id, User userDetails) {
        User user = findById(id);

        // Ne pas permettre de changer l'email via update
        // user.setEmail(userDetails.getEmail());

        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setPhone(userDetails.getPhone());
        user.setRole(userDetails.getRole());
        user.setActive(userDetails.getActive());

        return userRepository.save(user);
    }

    public void delete(UUID id) {
        User user = findById(id);
        userRepository.delete(user);
    }

    public User updatePassword(UUID id, String newPassword) {
        User user = findById(id);
        // TODO: Hasher le mot de passe en production
        user.setPassword(newPassword);
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = findByEmail(email);

        // TODO: Comparer les mots de passe hashés en production
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        if (!user.getActive()) {
            throw new RuntimeException("User account is deactivated");
        }

        // Mettre à jour la dernière connexion
        user.setLastLoginAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public List<User> findByRole(String role) {
        try {
            Role userRole = Role.valueOf(role.toUpperCase());
            return userRepository.findByRole(userRole);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + role);
        }
    }

    public List<User> findActiveUsers() {
        return userRepository.findByActiveTrue();
    }

    public User deactivateUser(UUID id) {
        User user = findById(id);
        user.setActive(false);
        return userRepository.save(user);
    }

    public User activateUser(UUID id) {
        User user = findById(id);
        user.setActive(true);
        return userRepository.save(user);
    }

    public long countUsers() {
        return userRepository.count();
    }

    public long countByRole(String role) {
        return findByRole(role).size();
    }
}