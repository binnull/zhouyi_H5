<template>
  <div class="page-bg dog-bg">
    <div class="page">
      <!--加载动画开始-->
      <div class="loading page-base" style="z-index: 1000">
        <div class="loading-left"></div>
        <div class="loadind-right"></div>
        <div class="page-base loading-progress"></div>
        <div class="progress-wall"><span>0%</span></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getWxAuthUrl, getUserInfo} from '../../api.js'
  import store from '../../store.js'

  export default {
    name: "index",
    created() {
      // 检测是否有code
      if (!this.$route.query.code) {
        // 跳转到微信授权页面
        this.$http.get(getWxAuthUrl)
          .then(function (response) {
            console.log(response);
            if (response.data.code === 200) {
              window.location.href = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error);
          });
        // let ua = window.navigator.userAgent.toLowerCase();
        // if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        //
        // }else {
        //   console.log('环境不对')
        // }
      } else {
        // 如果有code 获取用户信息
        this.login()
      }
    },
    methods: {
      login() {
        // 通过cookie获取用户信息
        this.$http.get(getUserInfo)
          .then(function (response) {
            if (response.data.code === 200) {
              this.$store.commit('setUserInfo', response.data.UserInfoVo);
              //回到首页
              this.$router.push({
                path: '/',
              })
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../index/index";
</style>