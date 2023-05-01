const login = document.querySelector('#login');
const join = document.querySelector('#join');
const cart = document.querySelector('#cart');

fetch('http://34.22.74.213:5000/api/admin/orders', { credential: false })
  .then(res => res.json())
  .then(data => {
    const token = localStorage.getItem('token');
    if (token) {
      login.innerHTML = '마이페이지';
      join.innerHTML = '장바구니';
      cart.innerHTML = '';

      login.addEventListener('click', function () {
        window.location.href = '#'; //마이 페이지 경로 넣어야함
      });

      join.addEventListener('click', function () {
        window.location.href = '#'; //장바구니 경로 넣어야함
      });
    } else {
      login.innerHTML = '로그인';
      join.innerHTML = '회원가입';
      cart.innerHTML = '장바구니';

      login.addEventListener('click', function () {
        window.location.href = '#'; // 로그인 페이지 경로 넣어야함
      });
      join.addEventListener('click', function () {
        window.location.href = '#'; // 회원가입 경로 넣어야함
      });
      cart.addEventListener('click', function () {
        window.location.href = '#'; // 로그인 페이지 경로 넣어야함
      });
    }
  });
