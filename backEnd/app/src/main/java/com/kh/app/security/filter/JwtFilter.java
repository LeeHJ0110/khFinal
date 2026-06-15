package com.kh.app.security.filter;

import com.kh.app.security.jwt.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        System.out.println("authorization = " + authorization);



        if( authorization == null || !authorization.startsWith("Bearer ")  ){
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorization.replace("Bearer ", "");

        if( jwtUtil.isExpired(token) ){
            filterChain.doFilter(request, response);
            return;
        }

        String username = jwtUtil.getUsername(token);
        System.out.println("username = " + username);
        String role = jwtUtil.getRole(token);

        Authentication authToken = new UsernamePasswordAuthenticationToken(username, null, List.of(new SimpleGrantedAuthority("ROLE_" + role)));
        System.out.println("role = " + role);
        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request , response);

    }

}