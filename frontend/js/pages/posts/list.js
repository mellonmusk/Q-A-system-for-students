import { fetchPosts, getLikes, getComments, getProfile, getProfileImage } from "../../api/request.js";

const currentUser = JSON.parse(localStorage.getItem('currentUser')); 

document.addEventListener("DOMContentLoaded", async () => {
    const postList = document.querySelector("#post-list");
    const createBtn = document.querySelector("#create-btn");
    const dropdownMenu = document.querySelector("#dropdown-menu");
    const profileImg = document.querySelector("#profile-img");

    const profileImage = await getProfileImage(currentUser.id);
    profileImg.src = profileImage;
    
    // 날짜 및 시간 포맷팅 함수
    const getFormattedDate = (post) => {
        return new Date(post.createdAt).toISOString().replace("T", " ").slice(0, 19);
    }


    // 숫자 단위 변환 함수
    const formatNumber = (num) => {
        if (num >= 100000) return Math.floor(num / 1000) + "k";
        if (num >= 10000) return (num / 1000).toFixed(0) + "k";
        if (num >= 1000) return (num / 1000).toFixed(1) + "k";
        return num;
    };

    const handlePostClick = (event) => {
        const postElement = event.currentTarget;
        const postId = parseInt(postElement.getAttribute("data-id")); // 클릭한 게시글의 ID를 가져옴
        window.location.href = `../../pages/posts/detail.html?postId=${postId}`; // 상세 페이지 이동
    };

    // 게시글 카드 생성 함수  
    const createPostCard = async (post, comments) => {
        const likes = await getLikes(post.id);
        const postStats = `좋아요 ${formatNumber(likes)} | 댓글 ${formatNumber(comments.length)} | 조회수 ${formatNumber(post.views)}`;
        const user = await getProfile(post.authorId);  
        const authorImgUrl = await getProfileImage(post.authorId);
        
        const newPost = document.createElement("div");
        newPost.classList.add("post");
        newPost.setAttribute("data-id", post.id);
        newPost.innerHTML = `
    <h2>${post.title.slice(0, 26)}</h2>
    <p class="meta">${postStats}</p>
    <p class="time">${getFormattedDate(post)}</p> 
    <div class="author-container">
      <img src="${authorImgUrl}" alt="${post.author}의 프로필" class="author-img">
      <p class="author">${user.nickname}</p>
    </div>
    `;
        // 게시글 클릭 시 상세 페이지로 이동
        newPost.addEventListener("click", handlePostClick);
        postList.appendChild(newPost);
    };


    // 게시글 목록 불러오기 및 생성
    (async () => {
        const posts = await fetchPosts(); 
        postList.innerHTML = ""; // 기존 목록 초기화

        for (const post of posts) {
            const comments = await getComments(post);
            await createPostCard(post, comments); // 프로필 데이터 전달
        }
    })();


    // 게시글 작성 버튼 이벤트
    createBtn.addEventListener("click", () => {
        window.location.href = "../../pages/posts/create.html";
    });

    // 드롭다운 메뉴 토글 함수
    const toggleDropdown = () => {
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    }; 

    profileImg.addEventListener("click", toggleDropdown);

    document.addEventListener("click", (event) => {
        if (!event.target.matches("#profile-img")) {
            dropdownMenu.style.display = "none";
        }
    });

    document.querySelector(".logout").addEventListener("click", function() {
        localStorage.clear(); 
    sessionStorage.clear();    
    location.reload(); // 페이지 새로고침
        alert("로그아웃 되었습니다!");
        window.location.href = "../auth/login.html";  
      });
});