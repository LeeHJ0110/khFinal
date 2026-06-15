package com.kh.app.security.config;

import com.kh.app.security.filter.JwtFilter;
import com.kh.app.security.filter.LoginFilter;
import com.kh.app.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    @Bean
    public AuthenticationManager authenticationManager() {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity hs) throws Exception {

        LoginFilter loginFilter =
                new LoginFilter(authenticationManager(), jwtUtil, objectMapper);

        loginFilter.setFilterProcessesUrl("/api/member/login");

        hs
                // csrf off
                .csrf(AbstractHttpConfigurer::disable)

                // form login off
                .formLogin(AbstractHttpConfigurer::disable)

                // http basic off
                .httpBasic(AbstractHttpConfigurer::disable)

                // stateless
                .sessionManagement(
                        x -> x.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 모든 요청 허용
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/member/login",
                                "/api/member/join",
                                "/api/member/check-username",
                                "/api/member/check-nickname",
                                "/api/member/kakao/login",
                                "/api/member/kakao/join",
                                "/api/pet/breed/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        .requestMatchers("/api/mypage/**").authenticated()
                        .requestMatchers("/api/message/**").authenticated()


                        .requestMatchers("/api/admin/message/**")
                        .hasAnyRole("ADMIN", "BOARD", "DOCTOR", "STORE")
                        .requestMatchers("/api/admin/members/profile/**")
                        .hasAnyRole("ADMIN", "BOARD", "DOCTOR", "STORE")

                        .requestMatchers("/api/admin/members/*/role")
                        .hasRole("ADMIN")

                        .requestMatchers("/api/admin/members/*/status")
                        .hasRole("ADMIN")

                        .requestMatchers("/api/admin/members/*/nickname/clean")
                        .hasRole("ADMIN")

                        .requestMatchers("/api/admin/members/**")
                        .hasAnyRole("ADMIN", "BOARD", "DOCTOR", "STORE")

                        .requestMatchers("/api/admin/insurance/**")
                        .hasAnyRole("ADMIN", "DOCTOR")

                        .requestMatchers("/api/admin/delivery/**")
                        .hasAnyRole("ADMIN", "STORE")

                        .requestMatchers("/api/admin/community/blind/**")
                        .hasAnyRole("ADMIN", "BOARD")



                        .anyRequest().authenticated()
                )
                // login filter
                .addFilterAt(
                        loginFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                // jwt filter
                .addFilterBefore(
                        new JwtFilter(jwtUtil),
                        LoginFilter.class
                )

                // cors
                .cors(cors -> cors.configurationSource(request -> {

                    CorsConfiguration config = new CorsConfiguration();

                    config.setAllowedOrigins(List.of(
                            "http://localhost:5173",
                            "http://127.0.0.1:5173",
                            "https://petandifor.store/",
                            "https://www.petandifor.store/"
                    ));

                    config.setAllowedMethods(List.of(
                            "GET",
                            "POST",
                            "PUT",
                            "DELETE",
                            "PATCH",
                            "OPTIONS"
                    ));

                    config.setAllowedHeaders(List.of("*"));

                    config.setAllowCredentials(true);

                    config.setExposedHeaders(List.of("Authorization"));

                    config.setMaxAge(3600L);

                    return config;
                }));

        return hs.build();
    }
}