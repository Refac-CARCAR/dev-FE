const addCommas = n => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

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
const link = document.location.href.split('/')[4];
console.log(link);

// fetch(`http://34.22.74.213:5000/api/orders/${link}`, {
//   method: 'GET',
//   headers: {
//     Authorization:
//       'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRhMDNhOWMyZDFmNzgxYzVlZDIyMTYiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY4MjY2NDA0MX0.VEQ0UwdMImlquDWiWgGxkxRlUCg7AfobfrO55Cr7Zns',
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     order_id: link,
//   }),
// }).then(response => console.log(response));

fetch(`http://34.22.74.213:5000/api/orders/${link}`, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRhMDNhOWMyZDFmNzgxYzVlZDIyMTYiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY4MjY2NDA0MX0.VEQ0UwdMImlquDWiWgGxkxRlUCg7AfobfrO55Cr7Zns`,
  },
})
  .then(res => res.json())
  .then(data => {
    console.log(data);
    // Use the orderId to retrieve the order details from the server
    const orderNum = document.querySelector('#ordernumber');
    orderNum.innerHTML = data.order_id;
    const orderDate = document.querySelector('#orderdate');
    orderDate.innerHTML = data.createdAt;
    const customer = document.getElementsByClassName('customer');
    for (let i = 0; i < customer.length; i++) {
      customer[i].innerHTML = data.user_id;
    }
    const orderState = document.querySelector('#orderstate');
    orderState.innerHTML = data.shipping_status;
    const totalPrice = document.querySelector('#totalprice');
    totalPrice.innerHTML = addCommas(data.total_price);
    const postal = document.querySelector('#postal');
    postal.value = data.address.postal_code;
    const address = document.querySelector('#address');
    address.value = data.address.address_main;
    const detailaddress = document.querySelector('#detailaddress');
    detailaddress.value = data.address.address_detail;
    const contact = document.querySelector('#contact');
    contact.innerHTML = data.user_phone;
    const orderList = function orderList(i) {
      return `
    <div class="orderProduct_content">
        <div class="orderProduct_content_column">
          <div class="orderProduct_content_column_info">
            
           <div class="orderProduct_content_column_info_image">
              <img src="${data.ordered_product[i].image}" />
           </div>

            <div class="orderProduct_content_column_info_text">
              <div class="orderProduct_content_column_info_text_brand">${data.ordered_product[i].maker}</div>
              <div class="orderProduct_content_column_info_text_name">${data.ordered_product[i].name}</div>
              <div class="orderProduct_content_column_info_text_desc">${data.ordered_product[i].description}</div>
            </div>
          </div>
        </div>
        <div class="orderProduct_content_column">
          <div class="orderProduct_content_column_statement">
            <div class="orderProduct_content_column_statement_list product_margin">${data.ordered_product[i].amount}</div>
            <div class="orderProduct_content_column_statement_list product_margin">${data.ordered_product[i].total_price}</div>
            <div class="orderProduct_content_column_statement_list product_margin">${data.shipping_status}</div>
          </div>
        </div>
      </div>
    `;
    };

    const orderProduct = document.querySelector('.orderProduct');
    for (let i = 0; i < data.ordered_product.length; i++) {
      orderProduct.insertAdjacentHTML('beforeEnd', orderList(i));
    }
    const btn = document.querySelector('#changeAddress');
    btn.addEventListener('click', function () {
      if (data.shipping_status == '배송준비중') {
        postal.value = postal.value;
        address.value = address.value;
        detailaddress.value = detailaddress.value;
        console.log(postal.value);
        console.log(address.value);
        console.log(detailaddress.value);
        fetch(`http://34.22.74.213:5000/api/orders/${link}`, {
          method: 'PUT',
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRhMDNhOWMyZDFmNzgxYzVlZDIyMTYiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY4MjY2NDA0MX0.VEQ0UwdMImlquDWiWgGxkxRlUCg7AfobfrO55Cr7Zns',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: {
              postal_code: postal.value,
              address_main: address.value,
              address_detail: detailaddress.value,
            },
          }),
        }).then(response => console.log(response));
      }
    });
    const priceText = document.querySelector('.priceBox-category_text');
    priceText.innerHTML = `상품금액 ${addCommas(data.total_price)} + 배송비 3,000 = 합계 : ${addCommas(
      Number(data.total_price) + 3000,
    )}`;
    const delBtn = document.querySelector('#orderDelete-btn');
    delBtn.addEventListener('click', delorder);
    function delorder() {
      fetch(`http://34.22.74.213:5000/api/orders/${link}`, {
        method: 'DELETE',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRhMDNhOWMyZDFmNzgxYzVlZDIyMTYiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY4MjY2NDA0MX0.VEQ0UwdMImlquDWiWgGxkxRlUCg7AfobfrO55Cr7Zns',
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          console.log('DELETE request successful');
        })
        .catch(error => {
          console.error('There was a problem with the DELETE request:', error);
        });
    }
  });
