/* eslint-disable no-undef */
/* eslint-disable camelcase */
const api_path = 'sop001';
const token = 'QAUmGOmqGMhc1e4clUy24HWNNmn1';
// eslint-disable-next-line quotes
const no_orders = `<h2 class="no_orders"> 目前無訂單 </h2>`;
let newData = [];

// ---------- 後台：訂單功能 ----------
const js_orderList = document.querySelector('.js_orderList');
const js_deleteAllOrderBtn = document.querySelector('.js_deleteAllOrderBtn');
// 函式 => 設定訂單資訊
const set_order_list = (item, index) => {
  const { user } = item;

  // 組時間字串
  const turnTime = new Date(item.createdAt * 1000);
  const orderTime = `${turnTime.getFullYear()}/${turnTime.getMonth() + 1}/${turnTime.getDate()}`;

  // 組產品字串
  let products_str = '';
  item.products.map((item2) => {
    products_str += `<p>${item2.title} * ${item2.quantity}</p>`;
    return products_str;
  });

  str = `<tr>
    <td>${item.id}</td>
    <td>
      <p>${user.name}</p>
      <p>${user.tel}</p>
    </td>
    <td>${user.address}</td>
    <td>${user.email}</td>
    <td>
      <p>${products_str}</p>
    </td>
    <td>${orderTime}</td>
    <td class="orderStatus">
      <button value="orderStatus" data-num="${index}">未處理</button>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" value="刪除" data-num="${index}">
    </td>
  </tr>`;

  return str;
};
// 函式 => 渲染產品列表
const render_order_list = () => {
  let str_all = '';
  orders_ary.map((item, index) => {
    str_all += set_order_list(item, index);
    return str_all;
  });
  js_orderList.innerHTML = str_all;
};
// 函式 => axios 資料傳出來
const call_data = () => {
  console.log(newData);
  console.log(orders_ary);
};
// 函式 => 取得訂單列表
const getOrderList = () => {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => {
      newData = res.data;
      orders_ary = newData.orders;
      const no_data = orders_ary.length === 0;
      console.log(newData);
      call_data();
      // eslint-disable-next-line no-unused-expressions
      no_data ? js_orderList.innerHTML = no_orders : render_order_list();
    });
};

// 監聽 => 點擊修改訂單狀態、刪除訂單
js_orderList.addEventListener('click', (e) => {
  e.preventDefault();
  const { num } = e.target.dataset;
  const { id } = orders_ary[num];
  const statusBtn = e.target.value === 'orderStatus';
  const deleteBtn = e.target.value === '刪除';

  // 點擊修改訂單狀態
  if (statusBtn) {
    // sweet alert 確認是否修改訂單狀態
    swal({
      title: '請確認',
      text: '點擊後將修改訂單狀態',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          swal('完成！訂單狀態已修改', {
            icon: 'success',
          });
          // eslint-disable-next-line no-use-before-define
          editOrderList(id);
        } else {
          swal('已保留原訂單狀態');
        }
      });
  }
  // 點擊刪除訂單
  if (deleteBtn) {
    // sweet alert 確認是否刪除訂單
    swal({
      title: '請確認',
      text: '點擊後將刪除此筆訂單',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          swal('完成！訂單已刪除', {
            icon: 'success',
          });
          // eslint-disable-next-line no-use-before-define
          deleteOrderItem(id);
        } else {
          swal('已保留此筆訂單');
        }
      });
  }
});

// (待修改：paid 狀態改參數)函式 => axios 修改訂單狀態
// eslint-disable-next-line no-unused-vars
const editOrderList = (id) => {
  axios
    .put(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        data: {
          id,
          paid: true,
        },
      },
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => {
      console.log(res.data);
      getOrderList();
    });
};

// 函式 => 刪除全部訂單
// eslint-disable-next-line no-unused-vars
const deleteAllOrder = () => {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => {
      console.log(res.data);
      getOrderList();
    });
};

// 監聽 => 點擊刪除全部訂單
js_deleteAllOrderBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const deleteAll_btn = e.target.value === 'deleteAllOrderBtn';

  if (deleteAll_btn) {
    // sweet alert 確認是否修改訂單狀態
    swal({
      title: '請確認',
      text: '點擊後將刪除所有訂單',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          swal('完成！已刪除所有訂單', {
            icon: 'success',
          });
          deleteAllOrder();
        } else {
          swal('已保留目前訂單');
        }
      });
  }
});

// 函式 => axios 刪除特定訂單
// eslint-disable-next-line no-unused-vars
const deleteOrderItem = (id) => {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`,
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => {
      console.log(res.data);
      getOrderList();
    });
};

// C3.js
// eslint-disable-next-line no-unused-vars
const chart1 = c3.generate({
  bindto: '#chart1', // HTML 元素綁定
  data: {
    type: 'pie',
    columns: [
      ['Louvre 雙人床架', 1],
      ['Antony 雙人床架', 2],
      ['Anty 雙人床架', 3],
      ['其他', 4],
    ],
    colors: {
      'Louvre 雙人床架': '#6a8eae',
      'Antony 雙人床架': '#dddace',
      'Anty 雙人床架': '#80ab82',
      其他: '#423e3b',
    },
  },
});

// eslint-disable-next-line no-unused-vars
const chart2 = c3.generate({
  bindto: '#chart2', // HTML 元素綁定
  data: {
    type: 'pie',
    columns: [
      ['Louvre 雙人床架', 1],
      ['Antony 雙人床架', 2],
      ['Anty 雙人床架', 3],
      ['其他', 4],
    ],
    colors: {
      'Louvre 雙人床架': '#585123',
      'Antony 雙人床架': '#aca691',
      'Anty 雙人床架': '#eec170',
      其他: '#d36135',
    },
  },
});

getOrderList();
