package com.kh.app.store.service;

import com.kh.app.store.dto.request.StoreInsertReqDto;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class StoreProductService {
    public void insert(StoreInsertReqDto reqDto, MultipartFile mainImage, List<MultipartFile> subImages) {
    }
}
