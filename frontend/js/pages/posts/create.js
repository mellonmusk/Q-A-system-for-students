import { renderHeader } from '/js/components/header.js';
import { createPost, uploadPostImage } from "../../api/request.js";

renderHeader();  // 공통 헤더 삽입 

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const fileInput = document.getElementById("picture-upload");
const submitBtn = document.getElementById("complete");

const submitError = document.getElementById("submit-error");
let isValid = false;

function validateInputs() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    isValid = title.length > 0 && content.length > 0;

    submitError.textContent = isValid ? "" : "*제목과 내용을 모두 작성해주세요.";
    submitBtn.disabled = !isValid;
}

titleInput.addEventListener("input", function () {
    if (titleInput.value.length > 26) {
        titleInput.value = titleInput.value.slice(0, 26);
    }
    validateInputs();
});

contentInput.addEventListener("input", validateInputs);

fileInput.addEventListener("change", function () {
    const fileName = this.files.length > 0 ? this.files[0].name : "파일을 선택해주세요.";
    document.getElementById("file-name").textContent = fileName;
});
 

// 게시글 작성 및 제출 처리
submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const title = titleInput.value;
    const content = contentInput.value;
    const authorId = currentUser.id;
    const created_at = new Date(Date.now()).toISOString();
    const views = 0;
    const likes = 0;
    
    const postData = {
        authorId, title, content, created_at, likes, views
    };

    const postedData = await createPost(postData); 

    // 파일 가져오기
    const file = fileInput.files[0];
 
    if (file) {
        const response = await uploadPostImage(file, postedData.id); // 서버에 파일 업로드
        if (response.ok) {
            const result = await response.json();
            postedData.profileImage = result.filePath; // 서버에서 반환한 이미지 URL 추가
            console.log(JSON.stringify(postedData));
        } else {
            console.error("파일 업로드 실패");
            alert("게시글 이미지 업로드 중 오류가 발생했습니다.");
            return;
        }
    }
    // 제목이나 내용이 비어있으면 에러 메시지 출력
    if (titleInput.value.trim() === "" || contentInput.value.trim() === "") {
        helperText.classList.remove("hidden");
    } else {
        window.location.href = "../posts/list.html";
    }
});

document.addEventListener("click", (event) => {
    const dropdown = document.getElementById("dropdown-menu");

    if (event.target.matches(".profile-img")) {
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    } else if (dropdown) {
        dropdown.style.display = "none";
    }
});
