/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
// 請代入自己的網址路徑
const api_path = 'sop001';
const token = 'QAUmGOmqGMhc1e4clUy24HWNNmn1';

let newData = [];
const js_productList = document.querySelector('.js_productList');
const js_product_filter = document.querySelector('.js_product_filter');
const js_carts = document.querySelector('.js_carts');
let product_ary = [];
const js_delete_all_carts = document.querySelector('.js_delete_all_carts');

// ---------- 產品功能 ----------

// 函式 => axios 資料傳出來
const call_data = () => {
  console.log(newData);
  console.log(newData.products);
};
// 函式 => 設定產品資訊
const set_str = (item, index) => {
  const price = item.price.toLocaleString();
  const origin_price = item.origin_price.toLocaleString();
  str = `<li class="productCard">
  <h4 class="productType">新品</h4>
  <img
    src="${item.images}"
    alt="">
  <button class="addCardBtn" data-num="${index}" value="加入購物車">加入購物車</button>
  <h3>${item.title}</h3>
  <del class="originPrice">NT$${origin_price}</del>
  <p class="nowPrice">NT$${price}</p>
</li>`;
  return str;
};
// 函式 => 渲染產品列表
const render_product_list = () => {
  let str_all = '';
  product_ary.map((item, index) => {
    str_all += set_str(item, index);
  });
  js_productList.innerHTML = str_all;
};
// 函式 => 取得產品列表
const getProductList = () => {
  axios
    .get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then((res) => {
      newData = res.data;
      product_ary = newData.products;
      call_data();
      render_product_list();
    })
    .catch((err) => {
      console.log(err.res.data);
    });
};

// 函式 => 篩選產品
const filter_product_list = (category) => {
  let str_all = '';
  product_ary.filter((item) => {
    if (category === '全部') {
      str_all += set_str(item);
    } else if (category === item.category) {
      str_all += set_str(item);
    }
  });
  js_productList.innerHTML = str_all;
};
// 監聽 => 按類別切換產品列表
js_product_filter.addEventListener('change', (e) => {
  const category = e.target.value;
  filter_product_list(category);
});

// ---------- 購物車功能 ----------
let cartList = [];
let cartList_obj = {};
let final_total;

// 函式 => 取得購物車列表
const getCartList = () => {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then((res) => {
      cartList = res.data.carts;
      cartList_obj = res.data;
      final_total = cartList_obj.finalTotal;
      console.log(cartList);
      render_cart_list();
    });
};
// 函式 => 設定購物車資訊
const set_carts = (item, index) => {
  const price = item.product.price.toLocaleString();

  let product_total = item.product.price * item.quantity;
  product_total = product_total.toLocaleString();

  const set_carts = `<tr><td>
    <div class="cardItem-title">
      <img src="${item.product.images}" alt="">
      <p>${item.product.title}</p>
    </div>
  </td>
  <td>NT$${price}</td>
  <td>${item.quantity}</td>
  <td>NT$${product_total}</td>
  <td>
  <button class="delete-icons" value="刪除" data-num="${index}">
    刪除
  </button>
</td></tr>`;

  return set_carts;
};
// 函式 => 設定購物車總表
const set_carts_total = () => {
  final_total = final_total.toLocaleString();
  const set_carts_total = `<tr>
  <td>
    <button class="delete-icons">刪除所有品項</button>
  </td>
  <td></td>
  <td></td>
  <td>
    <p>總金額</p>
  </td>
  <td>NT$${final_total}</td>
</tr>`;

  return set_carts_total;
};
// 函式 => 渲染購物車列表
const render_cart_list = () => {
  let str_all = '';
  let str_total = '';
  cartList.map((item, index) => {
    str_all += set_carts(item, index);
    str_total = set_carts_total();
  });
  js_carts.innerHTML = str_all;
  js_delete_all_carts.innerHTML = str_total;
};

// 監聽 => 點擊加入購物車
js_productList.addEventListener('click', (e) => {
  e.preventDefault();
  const { num } = e.target.dataset;
  const { id } = product_ary[num];
  let itemNum = 1;
  // 增加同商品購物車數量
  cartList.map((item) => {
    const checkId = id === item.product.id;
    if (checkId) { itemNum += item.quantity; }
  });
  // sweet alert (UX：減少等待期，通知綁在監聽)
  swal({
    title: '完成！',
    text: '商品已加入購物車',
    icon: 'success',
  });
  addCartItem(id, itemNum);
});

// 函式 => 加入購物車
const addCartItem = (id, num) => {
  axios
    .post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
      data: {
        productId: id,
        quantity: num,
      },
    })
    .then((res) => {
      console.log(res.data);
      getCartList();
    });
};

// 函式 => 刪除購物車內特定產品
const deleteCartItem = (cartId) => {
  axios
    .delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
    .then((res) => {
      console.log(res.data);
      getCartList();
    });
};

// 監聽 => 點擊刪除購物車內特定產品
js_carts.addEventListener('click', (e) => {
  e.preventDefault();
  const { num } = e.target.dataset;
  const { id } = cartList[num];
  // sweet alert 確認是否刪除商品 (UX：減少等待期，通知綁在監聽)
  if (deleteCartItem) {
    swal({
      title: '確定要刪除商品？',
      text: '商品從購物車移除後，你必須重新選擇數量、品項',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          swal('完成！商品已從購物車移除', {
            icon: 'success',
          });
          deleteCartItem(id);
        } else {
          swal('商品將保留在購物車內');
        }
      });
  }
});

// 函式 => 清除購物車內全部產品
const deleteAllCartList = () => {
  axios
    .delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then((res) => {
      console.log(res.data);
      getCartList();
    });
};
// 監聽 => 點擊清除購物車內全部產品
js_delete_all_carts.addEventListener('click', (e) => {
  e.preventDefault();
  // sweet alert 確認是否刪除商品 (UX：減少等待期，通知綁在監聽)
  if (deleteCartItem) {
    swal({
      title: '確定要刪除全部商品？',
      text: '點擊確認後，購物車將被清空',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          swal('完成！購物車已清空', {
            icon: 'success',
          });
          deleteAllCartList();
        } else {
          swal('商品將保留在購物車內');
        }
      });
  }
});

// ---------- 購物車功能 ----------
const js_order_section = document.querySelector('.js_order_section');
const order_name = document.querySelector('#customerName');
const order_tel = document.querySelector('#customerPhone');
const order_email = document.querySelector('#customerEmail');
const order_address = document.querySelector('#customerAddress');
const order_tradeWay = document.querySelector('#tradeWay');

// 監聽 => 填寫購買訂單
js_order_section.addEventListener('click', (e) => {
  // 寫入訂購資訊
  const name = order_name.value;
  const tel = order_tel.value;
  const email = order_email.value;
  const address = order_address.value;
  const payment = order_tradeWay.value;

  // 送出訂單
  const sent_btn = e.target.value === '送出預訂資料';
  const cart_empty = cartList.length === 0;
  if (sent_btn) {
    if (cart_empty) {
      swal({
        title: '訂單未送出',
        text: '請將商品加入購物車',
        icon: 'error',
        button: '關閉',
      });
    } else {
      swal({
        title: '完成！',
        text: '訂單已送出',
        icon: 'success',
        button: '完成',
      });
      createOrder(name, tel, email, address, payment);
    }
  }
});
// 函式 => 送出購買訂單
const createOrder = (name, tel, email, address, payment) => {
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
      {
        data: {
          user: {
            name,
            tel,
            email,
            address,
            payment,
          },
        },
      },
    ).then((res) => {
      console.log(res.data);
      getCartList();
    })
    .catch((error) => {
      console.log(error.res.data);
    });
};

// 取得訂單列表
// eslint-disable-next-line no-unused-vars
function getOrderList() {
  axios.get(
    `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        Authorization: token,
      },
    },
  )
    .then((response) => {
      console.log(response.data);
    });
}

// 修改訂單狀態
// eslint-disable-next-line no-unused-vars
function editOrderList(orderId) {
  axios.put(
    `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      data: {
        id: orderId,
        paid: true,
      },
    },
    {
      headers: {
        Authorization: token,
      },
    },
  )
    .then((response) => {
      console.log(response.data);
    });
}

// 刪除全部訂單
// eslint-disable-next-line no-unused-vars
function deleteAllOrder() {
  axios.delete(
    `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        Authorization: token,
      },
    },
  )
    .then((response) => {
      console.log(response.data);
    });
}

// 刪除特定訂單
// eslint-disable-next-line no-unused-vars
function deleteOrderItem(orderId) {
  axios.delete(
    `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
    {
      headers: {
        Authorization: token,
      },
    },
  )
    .then((response) => {
      console.log(response.data);
    });
}

getProductList();
getCartList();
