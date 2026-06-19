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



        if( authorization == null || !authorization.startsWith("Bearer ")  ){
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorization.replace("Bearer ", "");
        
        try{
            if( jwtUtil.isExpired(token) ){
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("""
                {
                    "code":"M002",
                    "message":"토큰이 만료되었습니다."
                }
            """);
                return;
            }
        }catch (Exception e){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("""
                {
                    "code":"M002",
                    "message":"유효하지 않은 토큰입니다."
                }
            """);
            return;
        }
        
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        Authentication authToken = new UsernamePasswordAuthenticationToken(username, null, List.of(new SimpleGrantedAuthority("ROLE_" + role)));
        System.out.println("role = " + role);
        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request , response);

    }

}