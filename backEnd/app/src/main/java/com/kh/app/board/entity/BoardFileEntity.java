package com.kh.app.board.entity;

//import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "BOARD_IMAGE")
@AttributeOverrides({
        @AttributeOverride(name = "createdAt", column = @Column(name = "UPLOAD_AT", nullable = false, updatable = false))
})
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class BoardFileEntity  { //extends BaseEntity

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOARD_FILE_ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BOARD_ID", nullable = false)
    private BoardEntity board;

    @Column(name = "IMAGE_ORIGIN_NAME", nullable = false, length = 4000)
    private String imageOriginName;

    @Column(name = "IMAGE_CHANGED_NAME", nullable = false, length = 4000)
    private String imageChangedName;

    @Column(name = "BOARD_FILE_SIZE", nullable = false)
    private Long boardFileSize;

    @Column(name = "BOARD_FILE_ORDER")
    private Integer boardFileOrder;

    public static BoardFileEntity from(BoardEntity board, MultipartFile file, String changedName, Integer order) {
        return BoardFileEntity.builder()
                .board(board)
                .imageOriginName(file.getOriginalFilename())
                .imageChangedName(changedName)
                .boardFileSize(file.getSize())
                .boardFileOrder(order)
                .build();
    }
}