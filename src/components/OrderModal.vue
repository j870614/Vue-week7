<template>
  <div
    id="productModal"
    ref="modal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="productModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            <span>訂單細節</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <h3>用戶資料</h3>
              <table class="table">
                <tbody v-if="tempOrder.user">
                  <tr>
                    <th scope="row">姓名</th>
                    <td class="align-baseline">{{ tempOrder.user.name }}</td>
                  </tr>
                  <tr>
                    <th scope="row">Email</th>
                    <td class="align-baseline">{{ tempOrder.user.email }}</td>
                  </tr>
                  <tr>
                    <th scope="row">電話</th>
                    <td class="align-baseline">{{ tempOrder.user.tel }}</td>
                  </tr>
                  <tr>
                    <th scope="row">地址</th>
                    <td class="align-baseline">{{ tempOrder.user.address }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-sm-8">
              <h3>訂單細節</h3>
              <table class="table">
                <tbody>
                  <tr>
                    <th scope="row">訂單編號</th>
                    <td class="align-baseline">{{ tempOrder.id }}</td>
                  </tr>
                  <tr>
                    <th scope="row">下單時間</th>
                    <td class="align-baseline">
                      {{
                        this.$moment(tempOrder.create_at * 1000).format(
                          "YYYY/MM/DD"
                        )
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">付款狀態</th>
                    <td
                      v-if="tempOrder.is_paid"
                      class="text-success align-baseline"
                    >
                      已付款
                    </td>
                    <td v-else class="text-secondary align-baseline">未付款</td>
                  </tr>
                  <tr>
                    <th scope="row">總金額</th>
                    <td class="align-baseline">{{ tempOrder.total }}</td>
                  </tr>
                </tbody>
              </table>
              <h3>選購商品</h3>
              <table class="table">
                <tbody>
                  <tr v-for="(product, i) in order.products" :key="i">
                    <th scope="row">{{ product.product.title }}</th>
                    <td>{{ product.qty }}/{{ product.product.unit }}</td>
                    <td class="text-end">{{ product.total }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="d-flex justify-content-end">
                <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="isPaid"
                  v-model="tempOrder.is_paid"
                />
                <label class="form-check-label" for="isPaid">
                  <span v-if="tempOrder.is_paid">已付款</span>
                  <span v-else>未付款</span>
                </label>
              </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="$emit('updatePaid', tempOrder)"
          >
            修改付款狀態
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from '@/mixins/modalMixin';

export default {
  mixins: [modalMixin],
  props: ['order'],
  data() {
    return {
      tempOrder: {},
    };
  },
  watch: {
    order() {
      this.tempOrder = this.order;
    },
  },
};
</script>
