// 요소(element), input 혹은 상수
const fullNameInput = document.querySelector('#fullNameInput');
const userEmail = document.querySelector('#user_email');
const phoneNumberInput = document.querySelector('#phoneNumberInput');
const postalCodeInput = document.querySelector('#postalCodeInput');
const mainAddressInput = document.querySelector('#mainAdressInput');
const detailAddressInput = document.querySelector('#detailAddressInput');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const saveButton = document.querySelector('#save_button');
const deleteUser = document.querySelector('#delete_user');

//회원정보 수정 기능

//에러메시지 정리
const errors = {
    nameError: '이름은 3자 이상이어야 합니다.',
    phoneNumberError: '올바른 전화번호를 입력해주세요.',
    passwordError: '비밀번호는 11자 이상이어야 합니다.',
    confirmPasswordError: '비밀번호가 일치하지 않습니다.',
};

addAllElements();
addAllEventListeners();

// 요소 삽입 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllElements() {
    insertUserData();
}

//이름 검사 함수
function validateName() {
    const name = fullNameInput.value.trim();
    const error = document.querySelector('#fullNameInput + .error');
    error.textContent = name && name.length >= 3 ? '' : errors.nameError;
    return !!name && name.length >= 3;
}

//비밀번호 검사 함수
function validatePasswordConfirm() {
    const password = passwordConfirmInput.value.trim();
    const error = document.querySelector('#passwordConfirmInput + .error');
    if (password.length < 11) {
        error.textContent = errors.passwordError;
        return false;
    } else {
        error.textContent = '';
        return true;
    }
}

//전화번호 검사 함수
function validatePhoneNumber() {
    const phoneNumber = phoneNumberInput.value.trim();
    const error = document.querySelector('#phoneNumberInput + .error');
    const isValidPhoneNumber = /^[0-9]{10,11}$/.test(phoneNumber);
    error.textContent = isValidPhoneNumber ? '' : errors.phoneNumberError;
    return isValidPhoneNumber;
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
    const isPasswordConfirmValid = validatePasswordConfirm();
    if (!isPasswordConfirmValid) {
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

    saveButton.disabled = false;
}

function addAllEventListeners() {
    const inputFields = [
        fullNameInput,
        passwordConfirmInput,
        phoneNumberInput,
        postalCodeInput,
        mainAddressInput,
        detailAddressInput,
    ];

    inputFields.forEach((input) => {
        input.addEventListener('input', validateAll);
        if (input.type === 'password') {
            input.addEventListener('change', validateAll);
        } else {
            input.addEventListener('blur', validateAll);
        }
    });
}

//저장하기 버튼 클릭 후 input값 초기화
function resetFields() {
    fullNameInput.value = '';
    passwordInput.value = '';
    passwordConfirmInput.value = '';
    phoneNumberInput.value = '';
    postalCodeInput.value = '';
    mainAddressInput.value = '';
    detailAddressInput.value = '';
}

const setUserData = (selector, text) => {
    document.querySelector(selector).textContent = text;
};

//기존 회원 정보 받아오기
async function insertUserData() {
    const apiUrl = 'http://34.22.74.213:5000/api/users/info';

    const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    // 응답 코드가 4XX 계열일 때 (400, 403 등)
    if (!res.ok) {
        const errorContent = await res.json();
        const { reason } = errorContent;

        throw new Error(reason);
    }

    const userData = await res.json();
    const { email } = userData;

    setUserData('.user_email', email);
}

async function saveUserData(e) {
    e.preventDefault();

    const fullName = fullNameInput.value;
    //이전에 입력된 비밀번호 검사는 백엔드 단에서?
    const currentPassword = passwordInput.value;
    const passwordToChange = passwordConfirmInput.value;
    const phoneNumber = phoneNumberInput.value;
    const postalCode = postalCodeInput.value;
    const addressMain = mainAddressInput.value;
    const addressDetail = detailAddressInput.value;

    const data = {
        fullName,
        currentPassword,
        passwordToChange,
        phoneNumber,
        postalCode,
        addressMain,
        addressDetail,
    };

    console.log(data);

    try {
        const apiUrl = 'http://34.22.74.213:5000/api/users/info';
        const res = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorContent = await res.json();
            const { reason } = errorContent;
            throw new Error(reason);
        }
        console.log(res);
        alert('회원정보가 수정되었습니다.');
        resetFields();
    } catch (err) {
        alert(`회원정보 저장 과정에서 오류가 발생하였습니다: ${err}`);
    }
}
saveButton.addEventListener('click', saveUserData);

//------------------------------------------

//회원탈퇴 기능 구현

// db에서 회원정보 삭제
async function deleteUserData(e) {
    e.preventDefault();

    const currentPassword = deleteUser.value;
    const data = { password: currentPassword };

    try {
        // 삭제 진행
        const response = await fetch(
            'http://34.22.74.213:5000/api/users/info',
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result); // DELETE 메서드 결과 로그 출력

        // 삭제 성공
        alert('회원 정보가 안전하게 삭제되었습니다.');

        // 토큰 삭제
        localStorage.removeItem('token');

        // window.location.href = '/';
    } catch (err) {
        alert(`회원정보 삭제 과정에서 오류가 발생하였습니다: ${err}`);
    }
}
deleteUser.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        deleteUserData(e);
    }
});
