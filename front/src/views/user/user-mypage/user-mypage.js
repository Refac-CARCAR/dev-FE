addAllElements();

// 요소 삽입 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllElements() {
    insertUserData();
    insertLatestOrder();
}

const setUserData = (selector, text) => {
    document.querySelector(selector).textContent = text;
};

//사용자 정보 받아오기
async function insertUserData() {
    const apiUrl = 'http://34.22.74.213:5000/api/users/info';

    const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRhMGJkNmMyZDFmNzgxYzVlZDIyNGEiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY4MjU3NDMwM30.bgUqu4-l9mveMUFdPxVR4A0CbWVzuuuzQMk1_OF0aFE`,
        },
    });

    // 응답 코드가 4XX 계열일 때 (400, 403 등)
    if (!res.ok) {
        const errorContent = await res.json();
        const { reason } = errorContent;

        throw new Error(reason);
    }

    const userData = await res.json();
    const {
        full_name,
        email,
        phone_number,
        address: { postal_code, address_main, address_detail },
    } = userData;

    console.log(userData);
    setUserData('.user_name', full_name);
    setUserData('.user_email', email);
    setUserData('.user_phone_number', phone_number);
    setUserData(
        '.user_address',
        `${postal_code} ${address_main} ${address_detail}`
    );

    return userData;
}

//최신 주문 정보 받아오기

const setOrderListData = (selector, text) => {
    document.querySelector(selector).textContent = text;
};

async function insertLatestOrder() {
    const apiUrl = 'http://34.22.74.213:5000/api/orders';

    const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRhMGJkNmMyZDFmNzgxYzVlZDIyNGEiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY4MjU3NDMwM30.bgUqu4-l9mveMUFdPxVR4A0CbWVzuuuzQMk1_OF0aFE`,
        },
    });

    // 응답 코드가 4XX 계열일 때 (400, 403 등)
    if (!res.ok) {
        const errorContent = await res.json();
        const { reason } = errorContent;

        throw new Error(reason);
    }
    const orders = await res.json();
    console.log(orders);

    console.log(orders);
    const {
        createdAt,
        order_id,
        ordered_product: { product_id, amount, image, _id },
        shipping_status,
        total_price,
    } = orders[0];

    console.log(orders[0]);
    setOrderListData('.order_date', createdAt);
    setOrderListData('.order_number', order_id);
    setOrderListData('.product_img', 'image');
    setOrderListData('.product_category', _id);
    setOrderListData('.product_name', product_id);
    setOrderListData('.product_amount', amount);
    setOrderListData('.payment_amount', total_price);
    setOrderListData('.payment_status', shipping_status);
}


