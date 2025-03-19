import { BASE_URL } from "./config.js"; 

// 게시글 목록 가져오기 (GET)
export async function fetchPosts() {
  try {
    const response = await fetch(`${BASE_URL}/posts`); 
    const posts = await response.json();
    console.log(posts);
    return posts;
  } catch (error) {
    console.error("게시글 가져오기 실패:", error);
    alert("게시글 목록을 가져오는 도중 오류가 발생했습니다.");
  }
}

// 게시글 작성 (POST)
export async function createPost(postData) {
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( postData ),
    });   
    if (!response.ok) {
      throw new Error(`서버 응답 실패: ${response.status}`);
    }
    const post = await response.json();
    console.log(post);
    return post;
  } catch (error) {
    console.error("게시글 작성 실패:", error);
    alert("게시글 작성 중 오류가 발생했습니다.");
  }
}

// 게시글 상세보기 (GET)
export async function fetchPost(id) { 
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`); 
    if (!response.ok) throw new Error("게시글을 찾을 수 없음");
    const post = await response.json();
    console.log(post);
    return post;
  } catch (error) {
    console.error("게시글 가져오기 실패:", error);
    alert("게시글을 가져오는 중 오류가 발생했습니다.");
  }
}

// 게시글 수정하기 (PATCH)
export async function updatePost(id, updatedData) {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) throw new Error("게시글 수정 실패");

    const updatedPost = await response.json();
    console.log("게시글 수정 완료:", updatedPost);
    return updatedPost;
  } catch (error) {
    console.error("게시글 수정 중 오류 발생:", error);
    alert("게시글 수정 중 오류가 발생했습니다.");
  }
}

// 게시글 삭제하기 (DELETE)
export async function deletePost(id) {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({id}),
    });

    if (!response.ok) throw new Error("게시글 삭제 실패");

    console.log(`게시글 ${id} 삭제 완료`);
    return true;
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    alert("게시글 삭제 중 오류가 발생했습니다.");
    return false;
  }
}

// 게시글 좋아요 수 가져오기 (GET)
export async function getLikes(postId) {
    try {
        const response = await fetch(`${BASE_URL}/posts/${postId}/likes`);

        if (!response.ok) {
            throw new Error("게시글 업데이트 실패");
        }
        
        return await response.json(); // 좋아요 개수 반환
    } catch (error) {
        console.error("좋아요 가져오기 실패:", error);
        alert("좋아요 수를 가져오는 중 오류가 발생했습니다.");
    }
}

// 게시글 좋아요 (POST)
export async function createLike(postId, userId) {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( {postId, userId} ),
    });   
    if(response.status === 409){
      console.log("already liked");
      return null;
    }
    if (!response.ok) {
      throw new Error(`좋아요를 누를 수 없음: ${response.status}`);
    }
    const post = await response.json();
    return post;
  } catch (error) {
    console.error("좋아요 실패:", error);
    alert("좋아요를 누를 수 없습니다.");
  }
}

// 게시글 좋아요 취소(DELETE)
export async function deleteLike(postId, userId) {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}/likes/${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({postId, userId}),
    });

    if (!response.ok) throw new Error("좋아요 삭제 실패");

    console.log(`게시글 ${postId}의 ${userId}가 누른 좋아요 삭제 완료`);
    return true;
  } catch (error) {
    console.error("좋아요 삭제 중 오류 발생:", error);
    alert("좋아요 취소 중 오류가 발생했습니다.");
    return false;
  }
}

// 좋아요 여부 조회 (GET)
export async function checkLikeStatus(postId, userId) {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}/likes/${userId}`);
    if (!response.ok) {
      throw new Error(`좋아요 여부 조회 실패: ${response.status}`);
    }
    const isLiked = await response.json();
    return isLiked;
  } catch (error) {
    console.error("좋아요 여부 조회 실패:", error);
    return false;
  }
}

// 프로필 목록 가져오기 (GET) 
export async function getProfiles() {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    const profiles = await response.json();
    return profiles;
  } catch (error) {
    console.error("프로필 가져오기 실패:", error);
    alert("프로필 목록을 가져오는 중 오류가 발생했습니다."); 
  }
}

// 프로필 업데이트 (PATCH) 
export async function updateProfile(profileId, profileData) {
  try {
    const response = await fetch(`${BASE_URL}/users/${profileId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error("프로필 업데이트 실패");
    }

    const updatedProfile = await response.json();
    return updatedProfile;
  } catch (error) {
    console.error("프로필 업데이트 실패:", error);
    alert("프로필 업데이트 중 오류가 발생했습니다.");
    return null;
  }
}

// 비밀번호 변경 (PATCH)
export async function updatePassword(profileId, newPassword) {
    try {
        const response = await fetch(`${BASE_URL}/users/${profileId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: profileId, password: newPassword }) // 비밀번호만 업데이트
        });

        if (!response.ok) {
            throw new Error("비밀번호 변경 실패");
        }

        const updatedProfile = await response.json();
        return updatedProfile;
    } catch (error) {
        console.error("비밀번호 변경 실패:", error);
        alert("비밀번호 변경 중 오류가 발생했습니다.");
        return null;
    }
}

// 프로필 정보 가져오기 (기존 사용자 정보 조회)
export async function getProfile(profileId) {
    try {
        const response = await fetch(`${BASE_URL}/users/${profileId}`);

        if (!response.ok) {
            throw new Error("프로필 조회 실패");
        }

        const profile = await response.json();
        return profile;
    } catch (error) {
        console.error("프로필 조회 실패:", error);
        alert("프로필 조회 중 오류가 발생했습니다.");
        return null;
    }
}

// 중복 이메일 또는 닉네임 체크
export async function checkDuplicate(field, value) {
    try {
        const response = await fetch(`${BASE_URL}/users`);
        const users = await response.json();
        const user = users.find((u) => u[field] === value);
        return user != undefined; // 중복이 있으면 true, 없으면 false 반환
    } catch (error) {
        console.error("중복 확인 실패:", error);
        alert("계정정보 중복 확인 중 오류가 발생했습니다.");
        return false;
    }
}

// 회원가입 (POST)
export async function registerUser(email, password, nickname) {
    try {
        // 이메일과 닉네임 중복 검사
        const isEmailDuplicate = await checkDuplicate("email", email);
        const isNicknameDuplicate = await checkDuplicate("nickname", nickname);

        if (isEmailDuplicate) {
            throw new Error("이미 사용 중인 이메일입니다.");
        }
        if (isNicknameDuplicate) {
            throw new Error("이미 사용 중인 닉네임입니다.");
        }

        // 새 사용자 추가
        const response = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password, // 비밀번호 해싱 필요 
                nickname 
            })
        });

        if (!response.ok) {
            throw new Error("회원가입 실패");
        }

        const newUser = await response.json();
        return newUser;
    } catch (error) {
        console.error("회원가입 오류:", error);
        alert("회원가입 중 오류가 발생했습니다.");
        return null;
    }
}
 
// 회원탈퇴 (DELETE)
export async function deleteUser(userId) {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error("사용자 삭제 실패");

    console.log(`사용자 ${userId} 삭제 완료`);
    localStorage.clear();  
    sessionStorage.clear();    
    location.reload(); // 페이지 새로고침
    alert("회원 탈퇴가 완료되었습니다.");
    return true;
  } catch (error) {
    console.error("사용자 삭제 중 오류 발생:", error);
    alert("탈퇴 처리 중 오류가 발생했습니다.");
    return false;
  }
}

export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/users`);
  const users = await response.json();

  const user = users.find((u) => u.email === email && u.password === password);
  console.log(user);
  return user || null; // 로그인 성공 시 사용자 객체 반환, 실패 시 null 반환
}
/*
export async function setToken(email, password) {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    console.error('로그인 실패:', response.statusText);
    return null;
  }
  const token = await response.text();
  console.log(token); 
  if (response) {
    localStorage.setItem('jwt', token); // JWT 토큰을 로컬 스토리지에 저장
  } else {
    console.error('토큰이 응답에 없습니다.');
    return null;
  }

  return token;
}


export async function authFetch(url, options = {}) { 

  if (!token) {
    console.error('인증 토큰이 없습니다. 로그인하세요.');
    return null;
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, // JWT를 Authorization 헤더에 추가
  };

  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...options.headers }, // 기존 headers와 병합
  });

  if (response.status === 401) {
    console.error('인증 실패: 토큰이 유효하지 않음');
    return null;
  }

  return response.json();
}


export async function getUser() {
  return authFetch(`${BASE_URL}/users/me`);
}

export function logoutUser() {
  localStorage.removeItem('jwt'); // JWT 토큰 삭제
  console.log('로그아웃되었습니다.');
}

*/

// 댓글 목록 가져오기 (GET)
export async function getComments(post) {
  try { 
    const response = await fetch(`${BASE_URL}/posts/${post.id}/comments`); 
    const comments = await response.json();
    console.log(comments);
    return comments;
  } catch (error) {
    console.error("댓글 목록 가져오기 실패:", error);
    alert("댓글 목록을 가져오는 도중 오류가 발생했습니다.");
  }
}

// 게시글 이미지 파일을 서버로 업로드 
export async function uploadPostImage(file, postId) {
  const formData = new FormData();
  formData.append("file", file); 

  try {
      const response = await fetch(`${BASE_URL}/images/post/${postId}`, { 
          method: "POST",
          body: formData,
      });
      return response;
  } catch (error) {
      console.error("업로드 중 오류 발생:", error);
      alert("사진 업로드 중 오류가 발생했습니다.");
  }
}


// 프로필 이미지 파일을 서버로 업로드 
export async function uploadProfileImage(file, userId) {
  const formData = new FormData();
  formData.append("file", file); 

  try {
      const response = await fetch(`${BASE_URL}/images/user/${userId}`, { 
          method: "POST",
          body: formData,
      });
      return response;
  } catch (error) {
      console.error("업로드 중 오류 발생:", error);
      alert("사진 업로드 중 오류가 발생했습니다.");
  }
}
 
// 프로필 이미지 가져오기
export async function getProfileImage(id) {
  try {
      const response = await fetch(`${BASE_URL}/images/user/${id}`);

      if (!response.ok) {
          throw new Error("이미지를 불러올 수 없습니다.");
      }
      const blob = await response.blob(); 
      const imageUrl = URL.createObjectURL(blob); 
      return imageUrl;
      
  } catch (error) {
      console.error("이미지 로드 실패:", error);
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s"; 
  }
}
// 게시글 이미지 가져오기
export async function getPostImage(id) {
  try {
      const response = await fetch(`${BASE_URL}/images/post/${id}`);

      if (!response.ok ) {
          throw new Error("이미지를 불러올 수 없습니다.");
      }
      if(response.status == 204) return null;
      const blob = await response.blob(); 
      const imageUrl = URL.createObjectURL(blob); 
      return imageUrl;
      
  } catch (error) {
      console.error("이미지 로드 실패:", error);
      alert("이미지 로딩에 실패했습니다.")
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s"; 
  }
}

