<template>
  <div class="container-fluid">
    <table class="table mt-4">
      <thead>
        <tr>
          <th>購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th>應付金額</th>
          <th>是否付款</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(order, key) in orders" :key="key">
          <tr v-if="orders.length">
            <td>
              {{ this.$moment(order.create_at * 1000).format("YYYY/MM/DD") }}
            </td>
            <td>{{ order.user.email }}</td>
            <td>
              <ul class="list-group list-group-flush">
                <li v-for="(product, i) in order.products" :key="i" class="list-group-item px-0">
                  {{ product.product.title }} 數量：{{ product.qty }}
                  {{ product.product.unit }}
                </li>
              </ul>
            </td>
            <td class="text-right">{{ order.total }}</td>
            <td>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  :id="`paidSwitch${ order.id }`"
                  v-model="order.is_paid"
                  @change="updatePaid(order)"
                />
                <label class="form-check-label" :for="`paidSwitch${ order.id }`"
                  >
                  <span v-if="order.is_paid">已付款</span>
                  <span v-else>未付款</span>
                </label
                >
              </div>
            </td>
            <td>
              <div class="btn-group">
                <button
                  type="button"
                  class="btn btn-outline-primary btn-sm"
                  @click="openModal(order)"
                >
                  檢視
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="openDelModal(order)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <Pagination :pages="pages" @change-page="getOrders"></Pagination>

    <OrderModal
      :order="tempOrder"
      @updatePaid="updatePaid"
      ref="orderModal"
    ></OrderModal>

    <DelModal
      :product="tempProduct"
      @del="delOrder"
      ref="delModal"
    ></DelModal>
  </div>
</template>

<script>
import OrderModal from '../components/OrderModal.vue';
import DelModal from '../components/DelModal.vue';
import Pagination from '../components/PaginationComp.vue';

const path = import.meta.env.VITE_PATH;
let Toast = null;

export default {
  data() {
    return {
      orders: [],
      tempOrder: {},
      pages: {},
    };
  },
  components: {
    OrderModal,
    DelModal,
    Pagination,
  },
  methods: {
    getOrders(page = 1) {
      const loader = this.$loading.show();
      this.$http
        .get(`/api/${path}/admin/orders?page=${page}`)
        .then((res) => {
          const { orders, pagination } = res.data;
          this.orders = orders;
          this.pages = pagination;
        }).then(() => {
          Toast.fire({
            icon: 'success',
            title: '訂單載入成功',
          });
        })
        .catch((err) => {
          this.handleError(err);
        })
        .finally(() => {
          loader.hide();
        });
    },
    openModal(item) {
      const loader = this.$loading.show();
      this.tempOrder = { ...item };
      const orderComponent = this.$refs.orderModal;
      orderComponent.openModal();
      loader.hide();
    },
    openDelModal(item) {
      const loader = this.$loading.show();
      this.tempProduct = { ...item };
      const delComponent = this.$refs.delModal;
      delComponent.openModal();
      loader.hide();
    },
    updatePaid(item) {
      const url = `/api/${path}/admin/order/${item.id}`;
      const updateData = {
        data: {
          is_paid: item.is_paid,
        },
      };
      const orderComponent = this.$refs.orderModal;
      this.$http.put(url, updateData)
        .then((res) => {
          orderComponent.hideModal();
          Toast.fire({
            icon: 'success',
            title: `${res.data.message}`,
          }).then(() => {
            this.getOrders();
          });
        })
        .catch((err) => {
          orderComponent.hideModal();
          this.handleError(err);
        })
        .then(() => {
          this.getOrders();
        });
    },
    delOrder(item) {
      const delComponent = this.$refs.delModal;
      this.$http
        .delete(`/api/${path}/admin/order/${item.id}`)
        .then((res) => {
          Toast.fire({
            icon: 'success',
            title: `${res.data.message}`,
          });
          delComponent.hideModal();
          this.getOrders();
        })
        .catch((err) => {
          delComponent.hideModal();
          this.handleError(err);
          this.getOrders();
        });
    },
    handleError(err) {
      Toast.fire({
        icon: 'error',
        title: `${err.response.data.message}`,
      });
    },
  },

  mounted() {
    Toast = this.$swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', this.$swal.stopTimer);
        toast.addEventListener('mouseleave', this.$swal.resumeTimer);
      },
    });
    this.getOrders();
  },
};
</script>
