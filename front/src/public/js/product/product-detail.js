const randomId = () => {
  return Math.random().toString(36).substring(2, 7);
};

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
let product_id;

const link = document.location.href.split('/')[4];
console.log(link);

fetch(`http://34.22.74.213:5000/api/product/${link}`, { credential: false })
    .then(res => {
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