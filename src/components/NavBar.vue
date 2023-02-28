<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <RouterLink to="/admin/products" class="navbar-brand"
        >管理後台</RouterLink
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <RouterLink to="/admin/products" class="nav-link">產品</RouterLink>
          <RouterLink to="/admin/orders" class="nav-link">訂單</RouterLink>
          <a class="nav-link" href="#" @click.prevent="logout">登出</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
let Toast = null;

export default {
  methods: {
    logout() {
      document.cookie = 'token=; expires=;';
      Toast.fire({
        icon: 'success',
        title: '已登出',
      });
      this.$router.push('/');
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
