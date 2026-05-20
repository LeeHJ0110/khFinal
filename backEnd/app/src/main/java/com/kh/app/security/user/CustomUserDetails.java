package com.kh.app.security.user;

import com.kh.app.member.entity.MemberEntity;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final MemberEntity entity;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + entity.getRole()));
    }

    public String getRole() {
        return entity.getRole().getCode();
    }

    public String getNickname() {
        return entity.getNickname();
    }

    @Override
    public @Nullable String getPassword() {
        return entity.getPassword();
    }

    @Override
    public String getUsername() {
        return entity.getUsername();
    }
}