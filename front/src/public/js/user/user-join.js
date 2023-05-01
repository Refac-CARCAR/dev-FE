// 요소(element), input 혹은 상수
const fullNameInput = document.querySelector('#fullNameInput');
const emailInput = document.querySelector('#emailInput');
const phoneNumberInput = document.querySelector('#phoneNumberInput');
const postalCodeInput = document.querySelector('#postalCodeInput');
const mainAddressInput = document.querySelector('#mainAdressInput');
const detailAddressInput = document.querySelector('#detailAddressInput');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const submitButton = document.querySelector('#submitButton');

//에러메시지 정리
const errors = {
    nameError: '이름은 3자 이상이어야 합니다.',
    emailError: '올바른 이메일 주소를 입력해주세요.',
    phoneNumberError: ' - 를 제외한 올바른 전화번호를 입력해주세요',
    passwordError: '비밀번호는 11자 이상이어야 합니다.',
    confirmPasswordError: '비밀번호가 일치하지 않습니다.',
};

// addAllElements();
addAllEvents();

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
    submitButton.addEventListener('click', handleSubmit);
}

//이름 검사 함수
function validateName() {
    const name = fullNameInput.value.trim();
    const error = document.querySelector('#fullNameInput + .error');
    error.textContent = name && name.length >= 3 ? '' : errors.nameError;
    return !!name && name.length >= 3;
}

//이메일 검사 함수
function validateEmail() {
    const email = emailInput.value.trim();
    const error = document.querySelector('#emailInput + .error');
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    error.textContent = isValidEmail ? '' : errors.emailError;
    return isValidEmail;
}

//전화번호 검사 함수
function validatePhoneNumber() {
    const phoneNumber = phoneNumberInput.value.trim();
    const error = document.querySelector('#phoneNumberInput + .error');
    // const isValidPhoneNumber = /^[0-9]{10,11}$/.test(phoneNumber);
    const isValidPhoneNumber = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/.test(
        phoneNumber
    );
    error.textContent = isValidPhoneNumber ? '' : errors.phoneNumberError;
    return isValidPhoneNumber;
}

//비밀번호 검사 함수
function validatePassword() {
    const password = passwordInput.value.trim();
    const error = document.querySelector('#passwordInput + .error');
    if (password.length < 11) {
        error.textContent = errors.passwordError;
        return false;
    } else {
        error.textContent = '';
        return true;
    }
}

//비밀번호 일치여부 검사 함수
function validatePasswordConfirm() {
    const password = passwordInput.value.trim();
    const passwordConfirm = passwordConfirmInput.value.trim();
    const error = document.querySelector('#passwordConfirmInput + .error');
    if (password !== passwordConfirm) {
        error.textContent = errors.confirmPasswordError;
        return false;
    } else {
        error.textContent = '';
        return true;
    }
}

//빈값 검사
function validateOthers() {
    const postalCode = postalCodeInput.value.trim();
    const mainAdress = mainAddressInput.value.trim();
    const detailAddress = detailAddressInput.value.trim();
    if (!postalCode || !mainAdress || !detailAddress) {
        return false;
    }
    return true;
}

// 모든 조건 검사 함수
function validateAll() {
    const isNameValid = validateName();
    if (!isNameValid) {
        return;
    }
    const isEmailValid = validateEmail();
    if (!isEmailValid) {
        return;
    }
    const isNumberValid = validatePhoneNumber();
    if (!isNumberValid) {
        return;
    }
    const isOthersValid = validateOthers();
    if (!isOthersValid) {
        return;
    }
    const isPasswordValid = validatePassword();
    if (!isPasswordValid) {
        return;
    }
    const isPasswordConfirmValid = validatePasswordConfirm();
    if (!isPasswordConfirmValid) {
        return;
    }

    submitButton.disabled = false;
}

function addAllEventListeners() {
    const inputFields = [
        fullNameInput,
        emailInput,
        passwordInput,
        passwordConfirmInput,
        phoneNumberInput,
        postalCodeInput,
        mainAddressInput,
        detailAddressInput,
    ];

    inputFields.forEach((input) => {
        input.addEventListener('input', validateAll);
        if (input.type === 'email' || input.type === 'password') {
            input.addEventListener('change', validateAll);
        } else {
            input.addEventListener('blur', validateAll);
        }
    });
}

addAllEventListeners();

//회원가입 버튼 클릭 후 input값 초기화
function resetFields() {
    fullNameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    passwordConfirmInput.value = '';
    phoneNumberInput.value = '';
    postalCodeInput.value = '';
    mainAddressInput.value = '';
    detailAddressInput.value = '';
}

// 회원가입 진행
async function handleSubmit(e) {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    const phoneNumber = phoneNumberInput.value;
    const fullName = fullNameInput.value;
    const postalCode = postalCodeInput.value;
    const addressMain = mainAddressInput.value;
    const addressDetail = detailAddressInput.value;

    try {
        const data = {
            fullName,
            email,
            phoneNumber,
            postalCode,
            addressMain,
            addressDetail,
            password,
            passwordConfirm,
            address: {
                postalCode,
                addressMain,
                addressDetail,
            },
        };

        //JSON 만들기
        const dataJson = JSON.stringify(data);
        const apiUrl = 'http://34.22.74.213:5000/api/users/register';

        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: dataJson,
        });
        console.log(res);
        if (res.status === 201) {
            alert('회원가입에 성공하였습니다!');
        } else {
            alert('회원가입에 실패하였습니다...');
        }

        const result = await res.json();
        console.log(result);

        //로그인 페이지 이동
        window.location.href = '/login';
    } catch (err) {
        console.log(err.stack);
        alert(
            `문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`
        );
    }
}
