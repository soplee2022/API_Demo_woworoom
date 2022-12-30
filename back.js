/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
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

  // 判斷訂單處理狀態
  const orderStatus = item.paid === true ? '已處理' : '未處理';
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
      <button value="orderStatus" data-num="${index}" data-status="${item.paid}">${orderStatus}</button>
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
      chart1_productsAll();
      chart2_productsAll();
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

// 整理 C3.js 資料

// C3.js 的好朋友 aka 偉大的 Object.entries()
// const test_obj = { x: 1, y: 2 };
// console.log(Object.entries(test_obj));

// Chart1：全產品營收比重
const chart1_productsAll = () => {
  call_data();
  // 把物件資料整理成陣列資料 -> 取得產品品項 & 收入
  const productObj = {};
  let newChart1_ary = [];
  orders_ary.map((item) => {
    item.products.map((訂單品項) => {
      if (productObj[訂單品項.title] === undefined) {
        productObj[訂單品項.title] = 訂單品項.price * 訂單品項.quantity;
      } else {
        productObj[訂單品項.title] += 訂單品項.price * 訂單品項.quantity;
      }
    });
    // console.log(productObj);
    // 做資料關聯
    newChart1_ary = Object.entries(productObj); // 實際擺進 C3.js 的陣列
    // console.log(newChart_ary);
  });

  // 比大小 : 降冪排列
  newChart1_ary.sort((a, b) => b[1] - a[1]);

  // 營收前 3 名 + 其餘類別統整為其他
  if (newChart1_ary.length > 3) {
    let otherRevenue = 0;
    // eslint-disable-next-line array-callback-return
    newChart1_ary.map((item, index) => {
      if (index > 2) {
        otherRevenue += newChart1_ary[index][1];
      }
    });
    newChart1_ary.splice(3, newChart1_ary.length - 1);
    newChart1_ary.push(['其他', otherRevenue]);
    // console.log(newChart1_ary);
  }
  // eslint-disable-next-line no-unused-vars
  const chart1 = c3.generate({
    bindto: '#chart1', // HTML 元素綁定
    data: {
      type: 'pie',
      columns: newChart1_ary,
      colors: {
        pattern: ['#f4cf00', '#7bb001', '#07b6f5', '#f54ea9'],
      },
    },
  });
};

// Chart2：全產品類別營收比重
const chart2_productsAll = () => {
  call_data();
  // 把物件資料整理成陣列資料 -> 取得產品品項 & 收入
  const productObj = {};
  let newChart2_ary = [];
  orders_ary.map((item) => {
    item.products.map((訂單品項) => {
      if (productObj[訂單品項.category] === undefined) {
        productObj[訂單品項.category] = 訂單品項.price * 訂單品項.quantity;
      } else {
        productObj[訂單品項.category] += 訂單品項.price * 訂單品項.quantity;
      }
    });
    // console.log(productObj);
    // 做資料關聯
    newChart2_ary = Object.entries(productObj); // 實際擺進 C3.js 的陣列
    // console.log(newChart_ary);
  });

  // 比大小 : 降冪排列
  newChart2_ary.sort((a, b) => b[1] - a[1]);

  // 營收前 3 名 + 其餘類別統整為其他
  if (newChart2_ary.length > 3) {
    let otherRevenue = 0;
    // eslint-disable-next-line array-callback-return
    newChart2_ary.map((item, index) => {
      if (index > 2) {
        otherRevenue += newChart2_ary[index][1];
      }
    });
    newChart2_ary.splice(3, newChart2_ary.length - 1);
    newChart2_ary.push(['其他', otherRevenue]);
    // console.log(newChart2_ary);
  }
  // eslint-disable-next-line no-shadow, no-unused-vars
  const chart2 = c3.generate({
    bindto: '#chart2', // HTML 元素綁定
    data: {
      type: 'pie',
      columns: newChart2_ary,
      colors: {
        pattern: ['#585123', '#eec170', '#d36135', '#aca691'],
      },
    },
  });
};

getOrderList();
