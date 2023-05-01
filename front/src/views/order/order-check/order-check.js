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

const addCommas = n => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
const convertToNumber = string => {
  return parseInt(string.replace(/(,|개|원)/g, ''));
};

fetch('http://34.22.74.213:5000/api/admin/orders', {
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQ5ZDNhOGMyZDFmNzgxYzVlZDIxZTciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODI2Njc3MDd9.kar1R_5ngFjhTX4294Yzzzr1o-8AupiAPSp3kN8unOA',
  },
})
  .then(res => res.json())
  .then(data => {
    console.log(data);
    const orderList = function orderList(item, i) {
      return `
      <div class=listBox>
      <div class="orderList_product_order domain" style="width:180px">
      <p class="orderList_category_order_date">${data[item].createdAt}</p>
      <p class="orderList_category_order_number">${data[item].order_id}</p>
  </div>
  <img src="${data[item].ordered_product[i].image}"class="orderList_product_img domain">
    
  
  <div class="orderList_product_info">
      <div class="orderList_product_info_brand">${data[item].ordered_product[i].maker}</div>
      <div class="orderList_product_info_name">${data[item].ordered_product[i].name}</div>
      <div class="orderList_product_info_desc">${data[item].ordered_product[i].description}</div>
  </div>
  <div class="orderList_product_amount domain">
      
          
                <div class="product_amount">${data[item].ordered_product[i].amount}</div>
            
          
     
  </div>
  <div class="orderList_product_price domain">${
    data[item].ordered_product[i].amount * data[item].ordered_product[i].price
  }</div>
  <div class="orderList_product_state domain">
  <div class="delbox">
        <select class="selected" id="delivery-status">
            <option value="배송 준비 중" selected >배송 준비 중 </option>
            <option value="결제 완료">결제 완료</option>
            <option value="배송 전">배송 전</option>
            <option value="베송 완료">배송 완료</option>
        </select>
    </div></div>
  <div class="orderList_product_delete domain">
      <button class="orderList_product_delete_box">주문취소</button>
      <button class="orderList_fix_box">배송수정</button>
  </div>
      </div>
      
    
  `;
    };

    const orderList_product = document.querySelector('.orderList_product');
    for (let item = 0; item < data.length; item++) {
      let list = data[item];
      for (let i = 0; i < list.ordered_product.length; i++) {
        orderList_product.insertAdjacentHTML('beforeEnd', orderList(item, i));
        // 새로운 orderlist가 추가될 때마다 이벤트 핸들러 추가
      }
    }

    const changeBtn = document.querySelectorAll('.orderList_fix_box');

    for (let i = 0; i < changeBtn.length; i++) {
      changeBtn[i].addEventListener('click', function (e) {
        const select = document.getElementById('delivery-status');
        const selectedOption = select.options[select.selectedIndex];
        const optionValue = selectedOption.innerHTML;
        let productId = e.target.parentElement.parentElement.querySelector(
          '.orderList_category_order_number',
        ).innerHTML;

        console.log(productId);
        fetch(`http://34.22.74.213:5000/api/admin/orders/${productId}`, {
          method: 'PUT',
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQ5ZDNhOGMyZDFmNzgxYzVlZDIxZTciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODI2Njc3MDd9.kar1R_5ngFjhTX4294Yzzzr1o-8AupiAPSp3kN8unOA',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shipping_state: optionValue,
          }),
        }).then(response => console.log(response));
      });
    }

    const delBtn = document.querySelectorAll('.orderList_product_delete_box');

    for (let i = 0; i < delBtn.length; i++) {
      delBtn[i].addEventListener('click', function (e) {
        let productId = e.target.parentElement.parentElement.querySelector(
          '.orderList_category_order_number',
        ).innerHTML;

        const delrow = e.target.parentElement.parentElement;
        console.log(delrow);
        delrow.remove();

        fetch(`http://34.22.74.213:5000/api/admin/orders/${productId}`, {
          method: 'DELETE',
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQ5ZDNhOGMyZDFmNzgxYzVlZDIxZTciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODI2Njc3MDd9.kar1R_5ngFjhTX4294Yzzzr1o-8AupiAPSp3kN8unOA',
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
      });
    }
  });
