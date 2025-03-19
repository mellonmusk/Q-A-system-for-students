import { loginUser } from "../../api/request.js"; 

document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("login-btn");

    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");

    let emailValid = false;
    let passwordValid = false;
    let isValid = false;

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        return passwordRegex.test(password);
    }

    function validateEmailField() {
        const email = emailInput.value.trim();

        if (email === "") {
            emailError.textContent = "올바른 이메일 주소를 입력해주세요.";
            emailValid = false;
        } else if (!validateEmail(email)) {
            emailError.textContent = "유효한 이메일 주소 형식이 아닙니다.";
            emailValid = false;
        } else {
            emailError.textContent = "";
            emailValid = true;
        }

        updateLoginButtonState();
    }

    function validatePasswordField() {
        const password = passwordInput.value.trim();

        if (password === "") {
            passwordError.textContent = "비밀번호를 입력해주세요.";
            passwordValid = false;
        } else if (!validatePassword(password)) {
            passwordError.textContent = "비밀번호는 8~20자, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
            passwordValid = false;
        } else {
            passwordError.textContent = "";
            passwordValid = true;
        }

        updateLoginButtonState();
    }

    function updateLoginButtonState() {
        isValid = emailValid && passwordValid;
        loginBtn.disabled = !isValid;
        loginBtn.style.backgroundColor = isValid ? "#bb9217" : "#e9d8a7";
    }

    // 로그인 검증
    loginBtn.addEventListener("click", async function () {
        if (loginBtn.disabled) return;

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
 
        const user = await loginUser(email, password);

        if (user) {
            // 로그인 성공 시 사용자 정보를 localStorage에 저장
            localStorage.setItem("currentUser", JSON.stringify(user));
            
            alert("로그인 성공");
            window.location.href = "../../../pages/posts/list.html";
        } else {
            passwordError.textContent = "*아이디 또는 비밀번호를 확인해주세요.";
        }
    });

    emailInput.addEventListener("input", validateEmailField);
    passwordInput.addEventListener("input", validatePasswordField);
});
