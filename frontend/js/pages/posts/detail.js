import { fetchPost, deletePost, getComments, getProfile, getLikes, createLike, deleteLike, getPostImage, checkLikeStatus } from "../../api/request.js";
import { renderHeader } from "/js/components/header.js";
import { BASE_URL } from "../../api/config.js";

let postId;
let postData = null;
let isLiked = false; // 초기 좋아요 상태

// 줄바꿈을 <br> 태그로 변환하는 함수
function formatContent(content) {
    return content.replace(/\n/g, "<br>"); // \n을 <br>로 변환
}

async function loadPost() {
    postId = new URLSearchParams(window.location.search).get("postId");
    if (!postId) {
        console.error("게시글 ID가 없습니다.");
        return;
    }

    try {
        postData = await fetchPost(postId);
        const likes = await getLikes(postId);
        const comments = await getComments(postData);
        if (!postData) throw new Error("게시글 데이터를 찾을 수 없습니다.");
        // 조회수 증가
        if (!sessionStorage.getItem(`viewed_${postId}`)) {
            await increaseViewCount(postId, postData.views);
            sessionStorage.setItem(`viewed_${postId}`, true); // 조회수 증가 여부 저장
        }
        // 게시글 정보 업데이트
        document.querySelector(".post-title").textContent = postData.title;
        document.querySelector(".post-author").textContent = postData.author;
        document.querySelector(".post-date").textContent = new Date(postData.createdAt)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

        const image = await getPostImage(postData.id);   
        console.log(image);
        if (image) {
            document.querySelector(".text").innerHTML = formatContent(postData.content);
            document.querySelector(".figure").src = image;
        } else {
            document.querySelector(".post-content").innerHTML = formatContent(postData.content);
        }

        // 통계 업데이트
        document.getElementById("like-count").innerHTML = `${likes} <br> 좋아요`;
        document.getElementById("view-count").innerHTML = `${postData.views} <br> 조회수`;
        document.getElementById("comment-count").innerHTML = `${comments.length} <br> 댓글`;

        // 댓글 목록 렌더링
        renderComments(comments);
    } catch (error) {
        console.error("게시글 불러오기 실패:", error);
    }
}

async function renderComments(comments) {
    const commentList = document.querySelector(".comment-list");
    if (!commentList) return;
    commentList.innerHTML = "";

    for (const comment of comments) {
        const commentItem = document.createElement("li");
        commentItem.classList.add("comment-item");
        commentItem.id = `comment-${comment.id}`;
        const author = await getProfile(comment.authorId);
        commentItem.innerHTML = `
            <div class="comment-meta">
                <span class="comment-author">${author.nickname}</span>
                <span class="comment-date">${new Date(comment.createdAt)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")}</span>
            </div>
            <p class="comment-content">${comment.body}</p>
            <div class="comment-actions">
                <button class="edit-comment" data-id="${comment.id}">수정</button>
                <button class="delete-comment" data-id="${comment.id}">삭제</button>
            </div>
        `;
        commentList.appendChild(commentItem);
    };
}

// 댓글 추가
async function addComment() {
    const commentInput = document.querySelector(".comment-input");
    if (!commentInput) return;

    const content = commentInput.value.trim();
    if (!content) return alert("댓글 내용을 입력하세요.");

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    try {
        await fetch(`${BASE_URL}/posts/${postId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                postId: postData.id,
                authorId: currentUser.id,
                createdAt: new Date().toISOString(),
                body: content
            })
        });
        commentInput.value = "";
        toggleCommentButton();
        updateCommentCount();
        const comments = await getComments(postData);
        renderComments(comments);
    } catch (error) {
        console.error("댓글 추가 실패:", error);
    }
}

// 댓글 수정
async function editComment(commentId) {
    const commentItem = document.getElementById(`comment-${commentId}`);
    if (!commentItem) return;

    const commentContent = commentItem.querySelector(".comment-content");
    if (!commentContent || commentItem.querySelector(".edit-input")) return;

    const oldText = commentContent.innerText;
    commentContent.style.display = "none";

    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = oldText;
    inputField.classList.add("edit-input");

    const saveButton = document.createElement("button");
    saveButton.innerText = "저장";
    saveButton.classList.add("save-comment");
    saveButton.addEventListener("click", () => updateComment(commentId, inputField.value));

    commentItem.appendChild(inputField);
    commentItem.appendChild(saveButton);
}

async function updateComment(commentId, newText) {
    if (!newText.trim()) {
        alert("댓글 내용을 입력하세요!");
        return;
    }
    try {
        await fetch(`${BASE_URL}/comments/${commentId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: commentId, body: newText })
        });
        const comments = await getComments(postData);
        renderComments(comments);

    } catch (error) {
        console.error("댓글 수정 실패:", error);
    }
}

// 댓글 삭제
async function deleteComment(commentId) {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
        await fetch(`${BASE_URL}/comments/${commentId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: commentId })
        });
        updateCommentCount();
        const comments = await getComments(postData);
        renderComments(comments);
    } catch (error) {
        console.error("댓글 삭제 실패:", error);
    }
}

// 댓글 개수 업데이트
async function updateCommentCount() {
    const commentCountElement = document.getElementById("comment-count");
    const comments = await getComments(postData);
    if (commentCountElement) {
        commentCountElement.innerHTML = `${comments.length} <br>댓글`;
    }
}

// 댓글 입력 활성화/비활성화
function toggleCommentButton() {
    const commentInput = document.querySelector(".comment-input");
    const submitButton = document.querySelector(".comment-submit");
    if (!commentInput || !submitButton) return;
    submitButton.disabled = !commentInput.value.trim();
}

// 좋아요 버튼 초기화 (페이지 로드 시)
async function initializeLikeButton() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const likeButton = document.getElementById("like-count");
    if (!likeButton) return; 
    // 서버에서 현재 좋아요 상태를 조회
    isLiked = await checkLikeStatus(postId, currentUser.id);
    console.log(isLiked);

    if (isLiked) {
        likeButton.classList.remove("liked");
        likeButton.style.backgroundColor = "#d2a21f";
    } else {
        likeButton.classList.add("liked");
        likeButton.style.backgroundColor = "white";
    } 
}

// 이벤트 리스너 설정
document.addEventListener("DOMContentLoaded", async () => {
    await loadPost(); 
    renderHeader();
    await initializeLikeButton(); // 좋아요 버튼 초기화
    document.querySelector(".comment-submit")?.addEventListener("click", addComment);
    document.querySelector(".comment-input")?.addEventListener("input", toggleCommentButton);

    document.addEventListener("click", (event) => {
        if (event.target.matches(".edit-comment")) {
            editComment(Number(event.target.dataset.id));
        }
        if (event.target.matches(".delete-comment")) {
            deleteComment(Number(event.target.dataset.id));
        }
    });
});

// 게시글 수정 페이지로 이동
function editPost() {
    const postId = postData.id; // 클릭한 게시글의 ID를 가져옴
    window.location.href = `../../pages/posts/edit.html?id=${postId}`;
}

// 모달 열기 (게시글 삭제 전 확인)
function confirmDelete() {
    const modal = document.getElementById("delete-modal");
    if (modal) {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById("delete-modal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// 게시글 삭제 (확인 버튼 클릭 시)
async function removePost() {
    await deletePost(postId);
    // 게시글 삭제 후 세션 스토리지에서 좋아요 상태 제거 
    sessionStorage.removeItem(`viewed_${postId}`);
    setTimeout(() => {
        window.location.replace("/pages/posts/list.html");
    }, 500);
    alert("게시글이 삭제되었습니다.");
}

/* 조회수 및 좋아요 */

async function increaseViewCount(postId, currentViews) {
    try {
        // 조회수 증가
        const updatedViews = currentViews + 1;
        // 서버에 조회수 업데이트 요청
        await fetch(`${BASE_URL}/posts/${postId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: postId, views: updatedViews }),
        });
        // UI 업데이트
        document.getElementById("view-count").innerHTML = `${updatedViews} <br> 조회수`;
    } catch (error) {
        console.error("조회수 증가 실패:", error);
    }
}

// 좋아요 토글 함수 
async function toggleLike() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    const likeButton = document.getElementById("like-count");
    if (!likeButton) return;

    let likeCount = parseInt(likeButton.textContent.match(/\d+/)[0]);
    // 서버에서 현재 좋아요 상태를 조회
    isLiked = await checkLikeStatus(postId, currentUser.id);
    console.log(isLiked);

    if (isLiked) {
        // 이미 좋아요한 상태이면 취소 
        await deleteLike(postId, currentUser.id);
        likeCount--;
        isLiked = false;
        likeButton.classList.remove("liked");
        likeButton.style.backgroundColor = "white";
    } else {
        // 좋아요하지 않은 상태이면 좋아요 수 증가
        const increased = await createLike(postId, currentUser.id);
        if(!increased) return;
        likeCount++;
        isLiked = true;
        likeButton.classList.add("liked");
        likeButton.style.backgroundColor = "#d2a21f";
    } 
    
    // 서버에 좋아요 수 업데이트 요청
    try {
        const response = await fetch(`${BASE_URL}/posts/${postId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: postId, likes: likeCount }),
        });
        if (response.ok) {
            likeButton.innerHTML = `${formatCount(likeCount)} <br>좋아요`; 
        } else {
            console.error("좋아요 수 업데이트 실패");
            // 실패 시 상태 복원
            isLiked = !isLiked;
        }
    } catch (error) {
        console.error("좋아요 수 업데이트 실패:", error);
        isLiked = !isLiked;
    }
}

function formatCount(num) {
    if (num >= 100000) return (num / 100000).toFixed(0) + "k";
    if (num >= 10000) return (num / 10000).toFixed(0) + "k";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num;
}

window.editPost = editPost;
window.confirmDelete = confirmDelete;
window.closeModal = closeModal;
window.removePost = removePost;
window.toggleCommentButton = toggleCommentButton;
window.editComment = editComment;
window.deleteComment = deleteComment;


document.addEventListener("click", (event) => {
    // 좋아요 버튼 클릭 
    if (event.target.id === "like-count") {
        event.preventDefault();
        toggleLike();
    }

    // 드롭다운 토글 (프로필 이미지 클릭)
    const dropdown = document.getElementById("dropdown-menu");
    if (event.target.matches(".profile-img")) {
        dropdown.style.display =
            dropdown.style.display === "block" ? "none" : "block";
    } else if (dropdown) {
        dropdown.style.display = "none";
    }
});
