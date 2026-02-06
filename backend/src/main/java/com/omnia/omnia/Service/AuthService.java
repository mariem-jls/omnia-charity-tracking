package com.omnia.omnia.Service;

import com.omnia.omnia.Entities.Role;
import com.omnia.omnia.Entities.User;
import com.omnia.omnia.Repository.UserRepository;
import com.omnia.omnia.Config.JwtService;
import com.omnia.omnia.dto.AuthResponse;
import com.omnia.omnia.dto.LoginRequest;
import com.omnia.omnia.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Créer l'utilisateur
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.Volunteer)
                .active(true)
                // Pas besoin de set id, createdAt (auto-générés)
                .build();

        user = userRepository.save(user);

        // Générer le token JWT
        var jwtToken = jwtService.generateToken(buildUserDetails(user));

        return buildAuthResponse(user, jwtToken);
    }

    public AuthResponse login(LoginRequest request) {
        // Authentifier
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Récupérer l'utilisateur
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Vérifier si actif
        if (!user.getActive()) {
            throw new RuntimeException("User account is deactivated");
        }

        // Mettre à jour lastLoginAt
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Générer le token JWT
        var jwtToken = jwtService.generateToken(buildUserDetails(user));

        return buildAuthResponse(user, jwtToken);
    }

    // Méthode helper pour créer UserDetails
    private UserDetails buildUserDetails(User user) {
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                )
        );
    }

    // Méthode helper pour créer AuthResponse
    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .build();
    }
}