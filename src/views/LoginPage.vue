<template>
  <div class="container">
    <h1 class="text-center">登入</h1>
    <div class="row justify-content-center">
      <v-form ref="form" class="col-md-6" v-slot="{ errors }" @submit="login">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <v-field
            id="email"
            name="email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors['email'] }"
            placeholder="請輸入 Email"
            rules="email|required"
            v-model="user.username"
          ></v-field>
          <error-message name="email" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">密碼</label>
          <v-field
            id="password"
            name="密碼"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors['密碼'] }"
            placeholder="請輸入密碼"
            rules="required"
            v-model="user.password"
          ></v-field>
          <error-message name="密碼" class="invalid-feedback"></error-message>
        </div>
        <div class="text-end">
          <button type="submit" class="btn btn-lg btn-primary">登入</button>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
const url = import.meta.env.VITE_URL;
let Toast = null;

export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },

  methods: {
    login() {
      this.$http
        .post(`${url}/admin/signin`, this.user)
        .then((res) => {
          const { message, token, expired } = res.data;
          document.cookie = `token=${token}; expires=${new Date(expired)};`;
          Toast.fire({
            icon: 'success',
            title: `${message}`,
          });
          this.$router.push('/admin/products');
        })
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            title: `${err.response.data.message}`,
          });
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
  },
};
</script>
