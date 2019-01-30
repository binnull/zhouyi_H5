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
      //先获取用户信息
      this.login();
    },
    methods: {
      login() {
        // 通过cookie获取用户信息
        let that = this;
        this.$http.get(getUserInfo)
          .then(function (response) {
            if (response.data.code === -101) {
              //未登录 前往授权
              that.author();
            }
            if (response.data.code === 200) {
              //登录成功 保存个人信息
              store.commit('setUserInfo', response.data.data);
              //回到首页
              that.$router.push({
                path: '/',
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      author() {
        // 跳转到微信授权页面
        this.$http.get(getWxAuthUrl)
          .then(function (response) {
            if (response.data.code === 200) {
              window.location.href = response.data.data
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