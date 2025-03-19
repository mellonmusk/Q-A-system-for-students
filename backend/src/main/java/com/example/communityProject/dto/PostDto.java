package com.example.communityProject.dto;

import com.example.communityProject.entity.Image;
import com.example.communityProject.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
public class PostDto {
    private Long id;
    private String title;
    private String content;
    private String image;
//    private Long likes;    // 좋아요 수
    private Long authorId;
    private Long views;
    private LocalDateTime createdAt;

    public static PostDto createPostDto(Post post) {
        return new PostDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                null,
//                post.getPostImage().getFilePath(),
//                post.getLikes(),
                post.getUser().getId(),
                post.getViews(),
                post.getCreatedAt()
        );
    }
}
