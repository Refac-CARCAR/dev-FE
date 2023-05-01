if (
  currentToken ===
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQ5ZDNhOGMyZDFmNzgxYzVlZDIxZTciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODI2OTc2MjR9.J2Z7Slgjqo_VWl66qn0aGLY-l0ejJ25nhuBtSCU90ZA'
) {
  goToMypage.addEventListener('click', () => {
    window.location.href = '/user-management';
  });
} else {
  goToMypage.addEventListener('click', () => {
    window.location.href = '/mypage';
  });
}

// 이메일 형식인지 확인 (true 혹은 false 반환)
const validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

// 숫자에 쉼표를 추가함. (10000 -> 10,000)
const addCommas = n => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 13,000원, 2개 등의 문자열에서 쉼표, 글자 등 제외 후 숫자만 뺴냄
// 예시: 13,000원 -> 13000, 20,000개 -> 20000
const convertToNumber = string => {
  return parseInt(string.replace(/(,|개|원)/g, ''));
};

// ms만큼 기다리게 함.
const wait = ms => {
  return new Promise(r => setTimeout(r, ms));
};

// 실제 연결할 떈 필요없는 코드(mockdata)
localStorage.removeItem('cart');
const data1 = {
  productId: 'dsgkwn1234',
  amount: 3,
  price: 60000,
  image: 'http://via.placeholder.com/640x360',
  name: 'G90',
  brand: '현대',
  desc: '좋은차',
};
const data2 = {
  productId: 'vgp21nkl3n1',
  amount: 10,
  price: 40000,
  image: 'http://via.placeholder.com/640x360',
  brand: '현대',
  name: '소나타',
  desc: '좋은차',
};
const data3 = {
  productId: 'lkvn1p2n',
  amount: 9,
  price: 500,
  image: 'http://via.placeholder.com/640x360',
  brand: '현대',
  name: 'G80',
  desc: '좋은차',
};
const data4 = {
  productId: '32n1ovn32n',
  amount: 1,
  price: 60000,
  image: 'http://via.placeholder.com/640x360',
  brand: '현대',
  name: '싼타페',
  desc: '좋은차',
};
function addToCart(data) {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  cartItems.push(data);
  localStorage.setItem('cart', JSON.stringify(cartItems));
}
addToCart(data1);
addToCart(data2);
addToCart(data3);
addToCart(data4);

// 처음 페이지가 꾸려질 때 localStorage에 저장된 값을 가져온다.
const products = JSON.parse(localStorage.getItem('cart')) || [];

// 서버랑 통신할 필요없이 localStorage에 저장된 값을 불러와서 작성
const carts = data => {
  let html = '';
  for (let product of data) {
    html += `
<div class=listBox data-id=${product.productId}>
  <div class="cart_product_order domain">
    <input type="checkbox" class="cart_category_listCheckbox">
  </div>

  <div class="cart_product_info">
    <div class="cart_product_info_image">
      <img src="./img/Rolls_Royce-Phantom (2).png"/>
    </div>
    <div class="cart_product_info_text">
      <div class="cart_product_info_brand">${product.brand}</div>
      <div class="cart_product_info_name">${product.name}</div>
    </div>
  </div>

  <div class="cart_product_price domain">${addCommas(product.price)}</div>

  <div class="cart_product_amount domain">
    <div class="cart_product_amount_count">
      <button class="cart_product_amount_count_minus"><p>-</p></button>
      <div class="product_amount">${product.amount}</div>
      <button class="cart_product_amount_count_plus"><p>+</p></button>
    </div>
    <button class="cart_product_amount_change">변경</button>
  </div>

  <div class="cart_product_totalPrice domain">${addCommas(product.amount * product.price)}
  </div>
</div>`;
  }
  return html;
};

const cart_product = document.querySelector('.cart_product');

cart_product.insertAdjacentHTML('beforeEnd', carts(products));

// 상품 금액 그리기
const $checkBoxes = document.querySelectorAll('.cart_category_listCheckbox');
const $checkedPrice = document.getElementById('checked_price');
const $deliveryPrice = document.getElementById('delivery_price');
const $totalPrice = document.getElementById('total_price');
// all check
const $allCheckBox = document.getElementById('allCheck');

let checkedPrice = 0;
const DELIVERY_PRICE = 3000;
let totalPrice = 0;

$checkedPrice.innerText = `${addCommas(checkedPrice)} 원`;
$deliveryPrice.innerText = `${addCommas(DELIVERY_PRICE)} 원`;
$totalPrice.innerText = `${addCommas(totalPrice + DELIVERY_PRICE)} 원`;

for (let checkBox of $checkBoxes) {
  checkBox.addEventListener('click', () => {
    checkedPrice = 0;
    totalPrice = 0;
    $checkBoxes.forEach(checkBox => {
      if (checkBox.checked) {
        const productTotalPrice = checkBox.closest('.listBox').querySelector('.cart_product_totalPrice').textContent;

        checkedPrice += Number(convertToNumber(productTotalPrice));
      } else {
        $allCheckBox.checked = false;
      }
    });
    $checkedPrice.innerText = `${addCommas(checkedPrice)} 원`;
    $totalPrice.innerText = `${addCommas(checkedPrice + DELIVERY_PRICE)} 원`;
  });
}

// 수량 증가 버튼
const plus = document.querySelectorAll('.cart_product_amount_count_plus');

for (let i = 0; i < plus.length; i++) {
  plus[i].addEventListener('click', plusAmount);

  function plusAmount(e) {
    const amount = plus[i].parentNode.querySelector('.product_amount');

    amount.innerHTML = Number(amount.innerHTML) + 1;
  }
}

// 수량 감소 버튼
const minus = document.querySelectorAll('.cart_product_amount_count_minus');

for (let i = 0; i < minus.length; i++) {
  minus[i].addEventListener('click', minusAmount);

  function minusAmount(e) {
    const amount = minus[i].parentNode.querySelector('.product_amount');
    if (Number(amount.innerHTML) > 1) {
      amount.innerHTML = Number(amount.innerHTML) - 1;
    }
  }
}

// 수량 변경 버튼
const changeBtnlist = document.querySelectorAll('.cart_product_amount_change');

// 변경을 누르면 바껴야한다.
for (let changeBtn of changeBtnlist) {
  changeBtn.addEventListener('click', e => {
    const price = changeBtn
      .closest('.listBox')
      .querySelector('.cart_product_price')
      .textContent.replace(/[^0-9]/g, '');
    const amount = changeBtn
      .closest('.cart_product_amount')
      .querySelector('.product_amount')
      .textContent.replace(/[^0-9]/g, '');
    const $totalPriceProduct = changeBtn.closest('.listBox').querySelector('.cart_product_totalPrice');
    $totalPriceProduct.innerText = `${addCommas(Number(amount * price))}`;

    // 위에서 사용된 함수 반복
    checkedPrice = 0;
    totalPrice = 0;
    $checkBoxes.forEach(checkBox => {
      if (checkBox.checked) {
        const productTotalPrice = checkBox.closest('.listBox').querySelector('.cart_product_totalPrice').textContent;

        checkedPrice += Number(convertToNumber(productTotalPrice));
      }
    });
    $checkedPrice.innerText = `${addCommas(checkedPrice)} 원`;
    $totalPrice.innerText = `${addCommas(checkedPrice + DELIVERY_PRICE)} 원`;
  });
}

// all check
$allCheckBox.addEventListener('click', e => {
  $checkBoxes.forEach(checkBox => {
    checkBox.checked = e.target.checked;
  });

  const $newCheckBoxes = e.target.closest('.cart').querySelectorAll('.cart_category_listCheckbox');

  checkedPrice = 0;
  totalPrice = 0;
  $newCheckBoxes.forEach(checkBox => {
    if (checkBox.checked) {
      const productTotalPrice = checkBox.closest('.listBox').querySelector('.cart_product_totalPrice').textContent;

      checkedPrice += Number(convertToNumber(productTotalPrice));
    }
  });
  $checkedPrice.innerText = `${addCommas(checkedPrice)} 원`;
  $totalPrice.innerText = `${addCommas(checkedPrice + DELIVERY_PRICE)} 원`;
});

// delete product
const $deletBtn = document.querySelector('#deleteBtn');

$deletBtn.addEventListener('click', e => {
  $checkBoxes.forEach(checkBox => {
    if (checkBox.checked) {
      const deleteProduct = checkBox.closest('.listBox').remove();
      console.log(deleteProduct);
    }
  });

  const $newCheckBoxes = e.target.closest('.cart').querySelectorAll('.cart_category_listCheckbox');

  checkedPrice = 0;
  totalPrice = 0;
  $newCheckBoxes.forEach(checkBox => {
    if (checkBox.checked) {
      const productTotalPrice = checkBox.closest('.listBox').querySelector('.cart_product_totalPrice').textContent;

      checkedPrice += Number(convertToNumber(productTotalPrice));
    }
  });
  $checkedPrice.innerText = `${addCommas(checkedPrice)} 원`;
  $totalPrice.innerText = `${addCommas(checkedPrice + DELIVERY_PRICE)} 원`;
});

// fetch

const $paymentBtn = document.getElementById('payment-btn');

$paymentBtn.addEventListener('click', e => {
  const datas = [];

  const $newCheckBoxes = document.querySelectorAll('.cart_category_listCheckbox');
  $newCheckBoxes.forEach(checkBox => {
    if (checkBox.checked) {
      const productId = checkBox.closest('.listBox').dataset.id;
      const amount = Number(checkBox.closest('.listBox').querySelector('.product_amount').textContent);

      const data = { productId, amount };

      datas.push(data);
    }
  });

  fetch('https://example.com/api/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: 'https://example.com/payment' }),
  })
    .then(response => {
      // fetch 요청이 성공적으로 처리되었을 때의 코드
    })
    .catch(error => {
      // fetch 요청 처리 중 에러가 발생했을 때의 코드
    });
});

const goToMypage = document.querySelector('#goToMypage');
const currentToken = localStorage.getItem('token');

if (
  currentToken ===
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQ5ZDNhOGMyZDFmNzgxYzVlZDIxZTciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODI2OTc2MjR9.J2Z7Slgjqo_VWl66qn0aGLY-l0ejJ25nhuBtSCU90ZA'
) {
  goToMypage.addEventListener('click', () => {
    window.location.href = '/user-management';
  });
} else {
  goToMypage.addEventListener('click', () => {
    window.location.href = '/mypage';
  });
}
