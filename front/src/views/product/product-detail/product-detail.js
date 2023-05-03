// 숫자에 쉼표를 추가함. (10000 -> 10,000)
const addCommas = n => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 13,000원, 2개 등의 문자열에서 쉼표, 글자 등 제외 후 숫자만 뺴냄
// 예시: 13,000원 -> 13000, 20,000개 -> 20000
const convertToNumber = string => {
  return parseInt(string.replace(/(,|개|원)/g, ''));
};

/* ------------- */

$('.carousel').slick({
  dots: true,
  infinite: true,
  speed: 500,
  fade: true,
  cssEase: 'linear',
  autoplay: true,
  autoplaySpeed: 5000
});

/*--productData--*/
let productData = [];
let productId;

const link = document.location.href.split('/')[4];
console.log(link);

fetch(`http://34.22.74.213:5000/api/product/${link}`, { credential: false })
  .then(res => {
    return res.json();

  })
  .then((json) => {
    productData = json;
    productId = productData.product_id;
    console.log(json);
    document.querySelector('.product_img1').src = productData.image;
    document.querySelector('.product_img2').src = productData.image;
    document.querySelector('.product_name').innerHTML = productData.name;
    document.querySelector('.product_price').innerHTML = "KRW " + addCommas(productData.price);
    document.querySelector('.main_description').innerHTML = productData.description;
    document.querySelector('.maker').innerHTML = "제조사 _ " + productData.maker;

  })
  .catch((error) => console.error(error));


// 비즈니스로직
/**수량조절*/
function setAmount(data) {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  cartItems.push(data);
  localStorage.setItem("cart", JSON.stringify(cartItems));
}

/**장바구니에 추기*/
const addToCart = function (productId, amount) {
  const cartItemInfo = { product_id: productId, amount: amount };
  cartValidate(cartItemInfo)
    .then(result => {   // 중복물건이 없는 경우
      const confirmed = confirm(`${result} /n 장바구니 페이지로 이동하시겠습니까?`);
      if (confirmed) {
        window.location.href = `http://localhost:3000/cart`;
      }
    })
    .catch(error => alert(error)); // 중복물건이 있는 경우
}

/**장바구니 중복여부 검증*/
function cartValidate(item) {
  const cartItemId = item.product_id;
  return new Promise((resolve, reject) => {
    const isCartItemExist = localStorage.getItem(cartItemId);
    if (isCartItemExist !== null) {
      reject('이미 장바구니에 담겨있습니다.');
    } else {
      localStorage.setItem(cartItemId, JSON.stringify(item));
      resolve('장바구니에 성공적으로 추가되었습니다. 페이지에서 확인하시겠습니까?');
    }
  });
}

/*--구매하기--*/
function buyProduct(item) {
  const amountNum = document.querySelector('.product_amount').innerHTML;
  const data = { product_id: item.product_id, amount: amountNum };

  fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      confirm(`주문이 완료되었습니다.`);
      window.location.href = `http://localhost:3000/ordercheck`;

    })
    .catch(error => console.error(error));
}
// Promise 객체를 생성하고
// localStorage에 cartItemId가 있는지 없는지 확인한다
// cartItemId값이 null이 아닌 경우 중복물건이 존재한다는 것을 의미함
// 중복물건이 없는 경우 localStorage에 data 추가



/*--버튼클릭시--*/
const changeBtn = document.querySelector('.amount_done');
changeBtn.addEventListener('click', setAmount);

const addCartBtn = document.querySelector('.add_cart_btn');
addCartBtn.addEventListener('click', addToCart);

const buyBtn = document.querySelector('.buy_btn');
buyBtn.addEventListener('click', buyProduct)


/*--마이페이지 이동--*/
const goToMypage = document.querySelector('#goToMypage');
const currentToken = localStorage.getItem('token');

if (currentToken ===
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
