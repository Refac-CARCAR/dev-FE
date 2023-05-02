// 숫자에 쉼표를 추가함. (10000 -> 10,000)
/** 상품 가격 표기법(xx,xxx) */
const addCommas = (n) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/* ------------- */

const productList = document.getElementById('new_product_area');
let productData = []; // 상품데이터 배열로 받아오기

fetch('http://34.22.74.213:5000/api' + '/product', { credential: 'omit' })
    .then((res) => {
        return res.json();
        //fetch로 받아온 response를 json형태로 바꿔준다.
    })
    .then((data) => {
        const productData = data.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        const newProductData = [];
        for (let i = 0; i < 6; i++) {
            newProductData.push(productData[i]);
        }
        //New Arriaval 이기 때문에 createdAt이 제일 최신인것 6개를 push 했다.
        //new Date() 로 감싸줘야 비교가 가능하다고 한다.

        newProductData.forEach((product) => {
            const productElement = document.createElement('div');
            productElement.className = 'new_product';
            productElement.setAttribute('data-id', product['product_id']);
            const productImage = document.createElement('img');
            productImage.className = 'new_img';
            const productTextArea = document.createElement('div');
            productTextArea.className = 'new_product_info';
            const productName = document.createElement('p');
            productName.className = 'list_name';
            const productDescription = document.createElement('p');
            productDescription.className = 'list_sub';
            const productPrice = document.createElement('p');
            productPrice.className = 'list_price';

            productImage.src += product.image;
            productName.innerHTML += product.name;
            productDescription.innerHTML += product.description;
            productPrice.innerHTML += 'KRW ' + addCommas(product.price);

            productList.appendChild(productElement);
            productElement.append(productImage, productTextArea);
            productTextArea.append(
                productName,
                productDescription,
                productPrice
            );

            productElement.addEventListener('click', function (e) {
                e.preventDefault();
                // 클릭 이벤트가 발생한 요소의 data-id 속성 값을 가져옵니다.
                const productId = this.getAttribute('data-id');
                // 해당 ID로 이동합니다.
                location.href = `http://34.22.74.213:5000/api/product/${productId}`;
                // 일단은 vm 사이트가 없으니 임시로 백엔드 서버로 보내겠습니다.
            });
        })
    })
    .catch((error) => console.error(error));

    // 제이쿼리 플러그인인 듯 한데 왜 함수가 아니라고 error가 뜨는가
$('.carousel').slick({
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 3000,
});

const goToMypage = document.querySelector('#goToMypage');
const currentToken = localStorage.getItem('token');

// 관리자토큰이라면 ? /user-management : /mypage
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
