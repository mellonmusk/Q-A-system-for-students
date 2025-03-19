import { updatePassword, getProfileImage } from "../../api/request.js";

const currentUser = JSON.parse(localStorage.getItem('currentUser')); 

document.addEventListener("DOMContentLoaded", async () => {
    const passwordInput = document.getElementById("password");
    const passwordCheckInput = document.getElementById("password-check");
    const updateBtn = document.getElementById("update-btn");
    const dropdownMenu = document.querySelector("#dropdown-menu");
    const mainBtn = document.querySelector(".homepage");
    const profileImg = document.querySelector("#profile-img");
    
    const profileImage = await getProfileImage(currentUser.id);
    profileImg.src = profileImage;
    const profileId = currentUser.id;
    
    // 홈페이지 이동
    if (mainBtn) {
        mainBtn.addEventListener("click", () => {
            window.location.href = "/pages/posts/list.html";
        });
    }

    // 오류 메시지 설정 및 제거
    const setError = (id, message) => {
        document.getElementById(id).textContent = message;
    };

    const clearError = (id) => {
        document.getElementById(id).textContent = "";
    };

    // 폼 유효성 검사 및 업데이트 버튼 활성화
    const validateForm = () => {
        const isValid =
            passwordInput.value && !document.getElementById("password-error").textContent &&
            passwordCheckInput.value && !document.getElementById("password-check-error").textContent;

        if (updateBtn) updateBtn.disabled = !isValid;
    };

    // 비밀번호 유효성 검사
    passwordInput.addEventListener("input", () => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;

        if (!passwordInput.value) {
            setError("password-error", "*비밀번호를 입력해주세요.");
        } else if (!passwordPattern.test(passwordInput.value)) {
            setError("password-error", "*비밀번호는 8자 이상, 20자 이하이며 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.");
        } else {
            clearError("password-error");
        }

        validateForm();
    });

    // 비밀번호 확인 검사
    passwordCheckInput.addEventListener("input", () => {
        if (!passwordCheckInput.value) {
            setError("password-check-error", "*비밀번호를 한 번 더 입력해 주세요.");
        } else if (passwordInput.value !== passwordCheckInput.value) {
            setError("password-check-error", "*비밀번호가 다릅니다.");
        } else {
            clearError("password-check-error");
        }

        validateForm();
    });

    // 비밀번호 업데이트 버튼 클릭 이벤트
    updateBtn.addEventListener("click", async () => {
        if (!updateBtn.disabled) {
            const newPassword = passwordInput.value;
            
            try {
                const result = await updatePassword(profileId, newPassword);
                if (result) {
                    alert("비밀번호 업데이트 완료");
                    window.location.href = "profile.html";
                } else {
                    alert("비밀번호 변경 중 오류가 발생했습니다.");
                }
            } catch (error) {
                console.error("비밀번호 변경 오류:", error);
                alert("비밀번호 변경 중 오류가 발생했습니다.");
            }
        }
    });

    // 드롭다운 메뉴 토글 함수
    const toggleDropdown = () => {
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    }; 

    // 프로필 이미지 클릭 시 드롭다운 표시/숨김
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
