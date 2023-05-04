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
/*--상품사진 넘기는 기능--*/
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
// fetch 함수에서만 쓰이므로 fetch 지역변수로 써도 될 것 같은데??
// let productData = [];
/** 다양한 함수에서 활용되므로 전역변수로 선언 (그런데 let? 다른 상품일 경우 바뀌어야해서!)*/
let productId;
let totalPrice;
let productPrice;
let productImage;
let productName;

/** url에서 얻어온 product_id */
const link = document.location.href.split('/')[4];

fetch(`http://34.22.74.213:5000/api/product/${link}`, { credential: 'omit' })
  .then(res => {
    return res.json();
  })
  .then((json) => {
    const productData = json;
    productId = productData.product_id;
    totalPrice = productData.price;
    productPrice = productData.price;
    productImage = productData.image;
    document.querySelector(".product_amount").innerHTML = 1;
    document.querySelector('.product_img1').src = productData.image;
    document.querySelector('.product_img2').src = productData.image;
    document.querySelector('.product_name').innerHTML = productData.name;
    document.querySelector('.product_price').innerHTML = "KRW " + addCommas(productData.price);
    document.querySelector('.main_description').innerHTML = productData.description;
    document.querySelector('.maker').innerHTML = "제조사 _ " + productData.maker;
    // TOTAL PRICE 
    document.querySelector('.total_price').innerHTML = "KRW " + addCommas(totalPrice);
  })
  .then(() => {
    /*-----비즈니스로직------*/
    /** 수량조절 */
     /** 수량 표기 p태그 */
    const productAmountNum = document.querySelector(".product_amount");
    /** 수량표기 p태그 안 숫자 */
    let num = parseInt(productAmountNum.innerHTML);
    function countDown() {
      // 0 이하로 내려가지 않게 설정
      if (num <= 1) return alert('최소 수량은 1개입니다.');
      num -= 1;
      productAmountNum.innerText = num;
      totalPrice = totalPrice - productPrice;
      document.querySelector('.total_price').innerHTML = "KRW " + addCommas(totalPrice);
    }

    function countUp() {
      num += 1;
      productAmountNum.innerText = num;
      totalPrice = totalPrice + productPrice;
      document.querySelector('.total_price').innerHTML = "KRW " + addCommas(totalPrice);
    }

    /**장바구니 중복여부 검증*/
    function cartValidate(cartInfo) {
        return new Promise((resolve, reject) => {
        const isCartItemExist = localStorage.getItem(productId);
        if (isCartItemExist === null) {
          //장바구니에 이 상품이 존재하지 않으면~
          localStorage.setItem(productId, JSON.stringify(cartInfo));
          resolve('장바구니에 성공적으로 추가되었습니다.');
        } else {
          reject('이미 장바구니에 담겨있습니다.');
        }
      });
    }

    /**장바구니에 추기*/
    const addToCart = function() {
      const cartInfo = {
        "product_id": productId,
        "amount": num,
        "total_price": totalPrice,  
      }
      cartValidate(cartInfo)
      .then(result => {   // 중복물건이 없는 경우
        const confirmed = confirm(`${result} 장바구니 페이지로 이동하시겠습니까?`);
        if (confirmed) {
          window.location.href = `http://localhost:3000/cart`;
        }
      })
      .catch(error => alert(error)); // 중복물건이 있는 경우
    }

/*--유빈님 작업--*/
// 비즈니스로직

/*--구매하기--*/
function buyProduct(item) {
  const data = []
  const amountNum = document.querySelector('.product_amount').innerHTML;
  const url = window.location.href;
  const productId = url.split('product/')[1].slice(0, -1);
  console.log(productId)
  data.push({ product_id: productId, amount: amountNum });

  fetch('/api/orders', {
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

    /*--버튼클릭시--*/
    const minusBtn = document.querySelector('.cart_product_amount_count_minus');
    minusBtn.addEventListener('click', countDown);

    const plusBtn = document.querySelector('.cart_product_amount_count_plus');
    plusBtn.addEventListener('click', countUp);

    // 변경 버튼이 필요한가? -> 누르면 TOTAL PRICE가 바뀌게!?
    // const changeBtn = document.querySelector('.amount_done');
    // changeBtn.addEventListener('click', setAmount);

    const addCartBtn = document.querySelector('.add_cart_btn');
    addCartBtn.addEventListener('click', addToCart);

    const buyBtn = document.querySelector('.buy_btn');
    buyBtn.addEventListener('click', buyProduct)
  })
  .catch((error) => console.error(error));




/*--마이페이지 이동--*/
const goToMypage = document.querySelector('#goToMypage');
const currentToken = localStorage.getItem('token');

// 프론트에서 token을 가지고 관리자임을 확인하는 방법은 무엇일까?
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
