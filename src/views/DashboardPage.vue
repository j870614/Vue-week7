<template>
  <div>
    <Navbar></Navbar>
    <router-view v-if="status"></router-view>
  </div>
</template>

<script>
import Navbar from '../components/NavBar.vue';

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      status: false,
    };
  },

  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      '$1',
    );

    this.$http.defaults.headers.common.Authorization = token;
    this.$http.defaults.baseURL = import.meta.env.VITE_URL;

    this.$http.post('/api/user/check')
      .then(() => {
        this.status = true;
      }).catch(() => {
        this.$router.push('/');
      });
  },

};
</script>
