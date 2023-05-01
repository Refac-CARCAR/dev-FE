// 요소(element), input 혹은 상수
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const loginButton = document.querySelector('#loginButton');
const joinButton = document.querySelector('#joinButton');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
    loginButton.addEventListener('click', handleSubmit);
    joinButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/join';
    });
}

// 로그인 진행
async function handleSubmit(e) {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    // 잘 입력했는지 확인
    const isEmailValid = validateEmail(email);
    const isPasswordValid = password.length >= 11;
    const error = document.querySelector('.error');

    if (!isEmailValid || !isPasswordValid) {
        error.textContent =
            '비밀번호가 11글자 이상인지, 이메일 형태가 맞는지 확인해 주세요.';
        return false;
    }

    // 로그인 api 요청
    try {
        const data = { email, password };

        //JSON 만들기
        const dataJson = JSON.stringify(data);
        const apiUrl = 'http://34.22.74.213:5000/api/users/login';

        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: dataJson,
        });

        if (!res.ok) {
            // 응답이 실패한 경우
            throw new Error('로그인에 실패하였습니다.');
        }

        const result = await res.json();
        const token = result.token;
        console.log(token);

        //관리자토큰 구분 필요경우
        // const { token, isAdmin } = result;

        // 로그인 성공, 토큰을 로컬 스토리지에 저장
        localStorage.setItem('token', token);

        // 로그인 성공
        // admin(관리자) 일 경우, localStorage 기록함
        // if (isAdmin) {
        //     localStorage.setItem('admin', 'admin');
        // }

        await alert('로그인에 성공하였습니다!');
        // 기본 페이지로 이동
        window.location.href = '/';
    } catch (err) {
        console.error(err.stack);
        alert(
            `문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`
        );
    }
}

// 이메일 형식인지 확인 (true 혹은 false 반환)
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
