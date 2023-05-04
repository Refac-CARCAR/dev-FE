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

const link = document.location.href.split('/')[4];
console.log(link);

/** 상위스코프에 먼저 let으로 선언해둔다 */
let productData;

fetch(`http://34.64.92.127:5000/api/product/${link}`, { credential: false })
  .then(res => {
    return res.json();

  })
  .then((json) => {
    /** fetch해서 받아온 데이터를 상위스코프에 할당한다.
     *  이제 바깥에서도 "productData.속성"을 사용할 수 있다.
     */
    productData = json;
    document.querySelector('.product_img1').src = productData.image;
    document.querySelector('.product_img2').src = productData.image;
    document.querySelector('.product_name').innerHTML = productData.name;
    document.querySelector('.product_price').innerHTML = "KRW " + addCommas(productData.price);
    document.querySelector('.main_description').innerHTML = productData.description;
    document.querySelector('.maker').innerHTML = "제조사 _ " + productData.maker;
  })

/**장바구니 중복여부 검증*/
/**장바구니에 추기*/

const addToCart = function (item) {
  const cartItemInfo = item;
  cartValidate(cartItemInfo)
    .then(result => {   // 중복물건이 없는 경우
      const confirmed = confirm(`${result}`);
      if (confirmed) {
        window.location.href = `http://localhost:3000/cart`;
      }
    })
    .catch(error => alert(error)); // 중복물건이 있는 경우
}

function cartValidate(item) {
  const cartItemId = item.product_id;
  return new Promise((resolve, reject) => {
    const isCartItemExist = localStorage.getItem(cartItemId);
    if (isCartItemExist === null) {
      //장바구니에 이 상품이 존재하지 않으면~
      localStorage.setItem(cartItemId, JSON.stringify(item));
      resolve('장바구니에 성공적으로 추가되었습니다. 페이지에서 확인하시겠습니까?');
    } else {
      reject('이미 장바구니에 담겨있습니다.');
    }
  });
}

/*--구매하기--*/
function buyProduct(item) {
  const data = [];
  const amountNum = document.querySelector('.product_amount').innerHTML;
  const productId = item.product_id;

  data.push({ product_id: productId, amount: amountNum, });

  fetch('http://34.64.92.127:5000/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      /** 로그인 안했어도 주문완료? 내가 쓴 코드인지 아침에 다시 살펴보기*/
      confirm(`주문이 완료되었습니다.`);
      window.location.href = `http://34.64.92.127:5000/api/ordercheck`;
    })
    .catch(error => console.error(error));
}


/** 수량조절 */
function countDown() {
  /** 수량 표기 p태그 */
  const productAmountNum = document.querySelector(".product_amount");
  /** 수량표기 p태그 안 숫자 */
  let num = parseInt(productAmountNum.innerHTML);
  // 0 이하로 내려가지 않게 설정
  if (num <= 1) return alert('최소 수량은 1개입니다.');
  num -= 1;
  productAmountNum.innerText = num;
  totalPrice = totalPrice - productPrice;
  document.querySelector('.total_price').innerHTML = "KRW " + addCommas(totalPrice);
}

function countUp() {
  const productAmountNum = document.querySelector(".product_amount");
  let num = parseInt(productAmountNum.innerHTML);
  num += 1;
  productAmountNum.innerText = num;
  totalPrice = totalPrice + productPrice;
  document.querySelector('.total_price').innerHTML = "KRW " + addCommas(totalPrice);
}
/*--버튼클릭시--*/
const minusBtn = document.querySelector('.cart_product_amount_count_minus');
minusBtn.addEventListener('click', countDown);

const plusBtn = document.querySelector('.cart_product_amount_count_plus');
plusBtn.addEventListener('click', countUp);

/**장바구니에서 최대한 서버와의 통신을 줄이기 위해 상품정보를 모두 보냈습니다*/
const addCartBtn = document.querySelector('.add_cart_btn');
addCartBtn.addEventListener('click', () => addToCart(productData));

const buyBtn = document.querySelector('.buy_btn');
buyBtn.addEventListener('click', () => buyProduct(productData));


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
