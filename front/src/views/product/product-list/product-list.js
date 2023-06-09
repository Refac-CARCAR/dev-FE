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

const categoryName = document.getElementById("page_name_text");
const productList = document.getElementById("product_list_area");

let productData = [];  // 상품데이터 배열로 받아오기

const link = document.location.href.split('/')[4];
console.log(link);

fetch(`http://34.22.74.213:5000/api/product`, { credential: false })
  .then(res => {
    return res.json();
  })
  .then((json) => {
    productData = json;
    console.log(productData);

    document.querySelector('#category_title').innerHTML = 'All'

    productData.forEach((product) => {
      const productElement = document.createElement('div');
      productElement.className = 'product_list_item';
      productElement.setAttribute('data-id', product['product_id']);
      // const productLink = document.createElement('a');
      const productImageArea = document.createElement('div');
      productImageArea.className = 'item_img';
      const productImage = document.createElement('img');
      const productTextArea = document.createElement('div');
      productTextArea.className = 'item_text';
      const productName = document.createElement('p');
      productName.className = 'list_name';
      const productDescription = document.createElement('p');
      productDescription.className = 'list_sub';
      const productPrice = document.createElement('p');
      productPrice.className = 'list_price';

      productImage.src += product.image;
      productName.innerHTML += product.name;
      productDescription.innerHTML += product.description;
      productPrice.innerHTML += "KRW " + addCommas(product.price);

      productList.appendChild(productElement);
      productElement.append(productImageArea, productTextArea);
      productImageArea.appendChild(productImage);
      productTextArea.append(productName, productDescription, productPrice);

      productElement.addEventListener('click', function (e) {
        e.preventDefault();
        // 클릭 이벤트가 발생한 요소의 data-id 속성 값을 가져옵니다.
        const productId = this.getAttribute('data-id');
        // 해당 ID로 이동합니다.
        location.href = `http://localhost:8000/product/${productId}`;
      });
    })
  })
  .catch((error) => console.error(error));

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