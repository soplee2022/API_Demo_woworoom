/* eslint-disable no-undef */
/* eslint-disable camelcase */
const api_path = 'sop001';
const token = 'QAUmGOmqGMhc1e4clUy24HWNNmn1';

let newData = [];

// ---------- 後台：訂單功能 ----------

// 函式 => axios 資料傳出來
const call_data = () => {
  console.log(newData);
  console.log(newData.products);
};

// 函式 => 取得訂單列表
// eslint-disable-next-line no-unused-vars
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
      product_ary = newData.products;
      console.log(newData);
      call_data();
    });
};

// 修改訂單狀態
// eslint-disable-next-line no-unused-vars
function editOrderList(orderId) {
  axios
    .put(
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
  axios
    .delete(
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
  axios
    .delete(
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

// C3.js
// const chart = c3.generate({
//   bindto: '#chart', // HTML 元素綁定
//   data: {
//     type: 'pie',
//     columns: [
//       ['Louvre 雙人床架', 1],
//       ['Antony 雙人床架', 2],
//       ['Anty 雙人床架', 3],
//       ['其他', 4],
//     ],
//     colors: {
//       'Louvre 雙人床架': '#DACBFF',
//       'Antony 雙人床架': '#9D7FEA',
//       'Anty 雙人床架': '#5434A7',
//       其他: '#301E5F',
//     },
//   },
// });

getOrderList();
