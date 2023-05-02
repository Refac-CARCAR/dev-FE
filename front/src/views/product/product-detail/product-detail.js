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
/** 이 아이의 존재 이유는 무엇인가 */
const productData = [];
/** 이 아이는 왜 먼저 선언해주는가? 전역변수로 사용하려고? 무엇을 위해?? */
let product_id;

/** product path param? 주소/api/product/:product_id 
 *  그런데 url은 위 처럼 안 뜸.. 어케함!?
*/
const link = document.location.href.split('/')[4];
console.log(link);
console.log(req.params);

// 메인페이지에서 클릭한 것과 연동해야 하는데...
fetch(`http://34.22.74.213:5000/api/product/${link}`, { credential: 'omit' })
    .then(res => {
      // fetch로 받아온 response를 javascript 객체인 프로미스를 반환해줌 
      // https://developer.mozilla.org/en-US/docs/Web/API/Response/json
      // '메서드 이름이 json임에도 결과는 JSON이 아니라 JSON을 JavaScript 객체로 파싱한 값을 반환함'
      return res.json();
    })
    .then((json) => {
        productData = json;
        product_id = productData.product_id;
        console.log(json);

        document.querySelector('.product_img1').src = productData.image;
        document.querySelector('.product_img2').src = productData.image;
        document.querySelector('.product_name').innerHTML = productData.name;
        document.querySelector('.product_price').innerHTML = "KRW " + addCommas(productData.price);
        document.querySelector('.main_description').innerHTML = productData.description;
        document.querySelector('.maker').innerHTML = "제조사 _ " + productData.maker;
        
    })
    .catch((error) => console.error(error));


/*--productData--*/
let changeBtn = document.querySelector('.amount_done');

changeBtn.addEventListener('click', function () {
let amountNum = document.querySelector('.product_amount').innerHTML;

document.querySelector('.total_price').innerHTML = "KRW " + addCommas(productData.price * amountNum);
});

/*--장바구니--*/
function addToCart(data) {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  cartItems.push(data);
  localStorage.setItem("cart", JSON.stringify(cartItems));

  //if (data.product_id) {
  //
  //}
}

let addCart = document.querySelector('.add_cart_btn');
addCart.addEventListener('click', function () {
  let amountNum = document.querySelector('.product_amount').innerHTML;

  const data = {product_id: product_id, amount: amountNum};
  addToCart(data);

  window.location.href = `http://localhost:8000/cart`;

});
/*--구매하기--*/
let buy = document.querySelector('.buy_btn');
buy.addEventListener('click', function () {
  let amountNum = document.querySelector('.product_amount').innerHTML;

  const data = {product_id: product_id, amount: amountNum};
  addToCart(data);


  //
  // const pay = document.querySelector('.total_price').innerHTML;
  // 
  //   pay.addEventListener('click', payData);
  //   function payData() {
  //     for (let i = 0; i < check.length; i++) {
  //       let newObj = [];
  //       let payAmount = convertToNumber(amountNum);
  //       let payId = convertToNumber(link);
  //       let obj = {
  //         수량: payAmount,
  //         상품번호: payId,
  //       };
  // 
  //       let payProduct = document.querySelector('.product_name').innerHTML;
  //         if (localStorage.getItem(payProduct)) {
  //           console.log('이미 장바구니에 담겨있습니다.');
  //         } else {
  //           localStorage.setItem(payProduct, JSON.stringify(obj));
  //         }
  //     }
  //   }
  // 
  // window.location.href = `http://localhost:8080/ordercheck`;

});


/*--마이페이지 연결--*/

// 공통된 부분이므로 일단 나중에 하자

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