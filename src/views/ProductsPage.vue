<template>
  <div class="container-fluid">
    <h1 class="mt-2">產品列表：</h1>
    <div class="text-end mt-4">
      <button class="btn btn-primary" @click="openModal(true)">
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody v-for="product in products" :key="product">
        <tr>
          <td>{{ product.category }}</td>
          <td>{{ product.title }}</td>
          <td class="text-end">${{ product.origin_price }}</td>
          <td class="text-end">${{ product.price }}</td>
          <td>
            <span v-if="product.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="openModal(false, product)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="openDelModal(product)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <pagination :pages="pages" @change-page="getProducts"></pagination>

    <ProductModal
      :product="tempProduct"
      :isNew="isNew"
      @updateProduct="updateProduct"
      ref="productModal"
    ></ProductModal>

    <DelModal
      :product="tempProduct"
      @del="delProduct"
      ref="delProductModal"
    ></DelModal>
  </div>
</template>

<script>
import ProductModal from '../components/ProductModal.vue';
import DelModal from '../components/DelModal.vue';
import Pagination from '../components/PaginationComp.vue';

const path = import.meta.env.VITE_PATH;
let Toast = null;

export default {
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false,
      pages: {},
    };
  },

  components: {
    ProductModal,
    DelModal,
    Pagination,
  },

  methods: {
    getProducts(page = 1) {
      const loader = this.$loading.show();
      this.$http
        .get(`/api/${path}/admin/products?page=${page}`)
        .then((res) => {
          const { products, pagination } = res.data;
          this.products = products;
          this.pages = pagination;
        })
        .then(() => {
          Toast.fire({
            icon: 'success',
            title: '產品載入成功',
          });
        })
        .catch((err) => {
          this.handleError(err);
        })
        .finally(() => {
          loader.hide();
        });
    },
    openModal(isNew, item) {
      const loader = this.$loading.show();
      if (isNew) {
        this.tempProduct = {};
        this.isNew = true;
      } else {
        this.tempProduct = { ...item };
        this.isNew = false;
      }
      const productComponent = this.$refs.productModal;
      productComponent.openModal();
      loader.hide();
    },
    openDelModal(item) {
      const loader = this.$loading.show();
      this.tempProduct = { ...item };
      this.isNew = false;
      const delProductComponent = this.$refs.delProductModal;
      delProductComponent.openModal();
      loader.hide();
    },
    updateProduct(item) {
      let url = `/api/${path}/admin/product`;
      let httpMethod = 'post';
      let updateData = {
        data: this.tempProduct,
      };
      const productComponent = this.$refs.productModal;

      if (!this.isNew) {
        url = `/api/${path}/admin/product/${item.id}`;
        httpMethod = 'put';
        updateData = {
          data: item,
        };
      }

      this.$http[httpMethod](url, updateData)
        .then((res) => {
          productComponent.hideModal();
          Toast.fire({
            icon: 'success',
            title: `${res.data.message}`,
          }).then(() => {
            this.getProducts();
          });
        })
        .catch((err) => {
          productComponent.hideModal();
          this.handleError(err);
        })
        .then(() => {
          this.getProducts();
        });
    },
    delProduct(item) {
      const delProductComponent = this.$refs.delProductModal;
      this.$http
        .delete(`/api/${path}/admin/product/${item.id}`)
        .then((res) => {
          Toast.fire({
            icon: 'success',
            title: `${res.data.message}`,
          });
          delProductComponent.hideModal();
          this.getProducts();
        })
        .catch((err) => {
          delProductComponent.hideModal();
          this.handleError(err);
          this.getProducts();
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
    this.getProducts();
  },
};
</script>
