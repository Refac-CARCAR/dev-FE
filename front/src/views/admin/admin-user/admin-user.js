const usersContainerBox = document.querySelector('.user_info_category_content');

addAllElements();

function addAllElements() {
    insertUserData();
}

//사용자 정보 받아오기
async function insertUserData() {
    const apiUrl = 'http://34.22.74.213:5000/api/admin/users';
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

    const users = await res.json();
    console.log(users);

    // for (const [index, user] of users) {
    users.forEach((user, index) => {
        const { createdAt, full_name, email, phone_number } = user;
        const date = createdAt.split('T')[0];

        usersContainerBox.insertAdjacentHTML(
            'afterbegin',
            `<div class="user_info" id="usersContainer-${email}">
        <div id="registerDate" class="register_date">
            ${date}
        </div>
        <div id="fullName" class="user_name">${full_name}</div>
        <div id="email" class="user_email">
            ${email}
        </div>
        <div id="phoneNumber" class="user_phone_number">
            ${phone_number}
        </div>
        <button id="deleteBtn-${index}" class="delete_btn">
            회원 정보 삭제
        </button>
    </div>`
        );
        const deleteBtn = usersContainerBox.querySelector(
            `#deleteBtn-${index}`
        );

        async function deleteUserData(e) {
            e.preventDefault();

            const userIdToDelete = { email: email };

            console.log(JSON.stringify(userIdToDelete));
            try {
                // 삭제 진행
                const res = await fetch(
                    'http://34.22.74.213:5000/api/admin/users',
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                        body: JSON.stringify(userIdToDelete),
                    }
                );

                console.log(res);

                location.reload();
            } catch (err) {
                alert(`회원정보 삭제 과정에서 오류가 발생하였습니다: ${err}`);
            }
        }

        deleteBtn.addEventListener('click', deleteUserData);
    });
}
