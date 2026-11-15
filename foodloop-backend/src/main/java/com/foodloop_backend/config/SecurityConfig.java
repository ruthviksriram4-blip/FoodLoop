package com.foodloop_backend.config;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) ->
                    response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Authentication required"
                    )
                )
                .accessDeniedHandler((request, response, accessDeniedException) ->
                    response.sendError(
                        HttpServletResponse.SC_FORBIDDEN,
                        "Access denied"
                    )
                )
            )

            .authorizeHttpRequests(auth -> auth

                // Public APIs
              // Public APIs
.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
.requestMatchers("/error").permitAll()
.requestMatchers(
    "/api/users/register",
    "/api/users/login"
).permitAll()

                // User management
                .requestMatchers(HttpMethod.GET, "/api/users")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/users/*")
                    .authenticated()

                // Donations
                // Donations

.requestMatchers(HttpMethod.GET, "/api/donations")
    .hasAnyRole("DONOR", "NGO", "VOLUNTEER", "ADMIN")

.requestMatchers(HttpMethod.GET, "/api/donations/available")
    .hasAnyRole("DONOR", "NGO", "VOLUNTEER", "ADMIN")

.requestMatchers(HttpMethod.GET, "/api/donations/donor/**")
    .hasAnyRole("DONOR", "ADMIN")

.requestMatchers(HttpMethod.GET, "/api/donations/*")
    .authenticated()

.requestMatchers(HttpMethod.POST, "/api/donations")
    .hasAnyRole("DONOR", "ADMIN")

.requestMatchers(HttpMethod.PUT, "/api/donations/**")
    .hasAnyRole("DONOR", "ADMIN")

.requestMatchers(HttpMethod.DELETE, "/api/donations/**")
    .hasAnyRole("DONOR", "ADMIN")

                // NGO requests
                .requestMatchers(HttpMethod.GET, "/api/requests").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/requests/ngo/**").hasAnyRole("NGO", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/requests/donor/**").hasAnyRole("DONOR", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/requests")
                    .hasAnyRole("NGO", "ADMIN")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/requests/*/accept",
                    "/api/requests/*/reject"
                ).hasAnyRole("DONOR", "ADMIN")

                .requestMatchers(HttpMethod.PUT, "/api/requests/*/cancel")
                    .hasAnyRole("NGO", "ADMIN")

                // Volunteer assignments
                .requestMatchers(HttpMethod.POST, "/api/assignments")
                    .hasAnyRole("DONOR", "ADMIN")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/assignments/*/collect",
                    "/api/assignments/*/deliver"
                ).hasAnyRole("VOLUNTEER", "ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/assignments")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/assignments/volunteer/**")
                    .hasAnyRole("VOLUNTEER", "ADMIN")

                // Notifications
                .requestMatchers(HttpMethod.GET, "/api/notifications")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.POST, "/api/notifications")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/notifications/user/**", "/api/notifications/unread/**", "/api/notifications/unread-count/**")
                    .authenticated()

                // All other API endpoints require authentication
                .anyRequest().authenticated()
            )

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
            List.of("http://localhost:3000")
        );

        configuration.setAllowedMethods(
            List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
