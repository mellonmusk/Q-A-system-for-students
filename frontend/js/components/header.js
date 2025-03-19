import {getProfileImage} from "../api/request.js";
export async function renderHeader(backPath = "/pages/posts/list.html") {
  const currentUser = JSON.parse(localStorage.getItem('currentUser')); 
  const profileImage = await getProfileImage(currentUser.id);

  const headerHTML = `
    <header class="header"> 
      <span class="back-button">&lt;</span>
      <span>질문 게시판</span>
      <div class="profile-container">
        <img src="${profileImage}" alt="사용자 프로필" class="profile-img" />
        <ul class="dropdown-menu" id="dropdown-menu">
          <li><a href="../users/profile.html" class="edit-profile">회원정보 수정</a></li>
          <li><a href="../users/password.html" class="edit-pw">비밀번호 수정</a></li>
          <li class="logout">로그아웃</li>
        </ul>
      </div>
    </header>
  `;

  // body의 맨 앞에 삽입
  document.body.insertAdjacentHTML('afterbegin', headerHTML);

  const backButton = document.querySelector(".back-button");
  if (backButton) {
      backButton.addEventListener("click", () => {
        window.location.href = backPath;
    });
  }

  document.querySelector(".logout").addEventListener("click", function() {
    localStorage.clear();  
    sessionStorage.clear();    
    location.reload(); // 페이지 새로고침

    alert("로그아웃 되었습니다!");
    window.location.href = "../auth/login.html"; 
  });
} 