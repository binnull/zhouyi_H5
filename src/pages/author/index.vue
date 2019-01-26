<template>
  <div>授权登陆中</div>
</template>

<script>
  import {getWxAuthUrl, getUserInfo} from '../../api.js'
  import store from '../../store.js'

  export default {
    name: "index",
    created() {
      // 检测会员有没有登录
      if (!store.state.user) {
        let ua = window.navigator.userAgent.toLowerCase()
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          // 跳转到微信授权页面
          this.axios.post(getWxAuthUrl)
            .then(function (response) {
              if (response.body.code === 200) {
                window.location.href = response.header.url
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      } else {
        // 如果有token 但是vuex中没有用户登录信息则做登录操作
        this.login()
      }
    },
    methods: {
      login() {
        // 通过cookie获取用户信息
        this.axios.post(getUserInfo)
          .then(function (response) {
            if (response.body.code === 200) {
              this.$store.commit('setUserInfo', response.header.UserInfoVo)
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  }
</script>

<style scoped>

</style>