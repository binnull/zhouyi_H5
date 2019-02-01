<template>
  <div class="page-bg" :class="step>=7?'pig-bg':'dog-bg'">
    <div class="page">
      <!--加载动画开始-->
      <div class="loading page-base" v-show="step===0||step===1" style="z-index: 1000">
        <div class="loading-left" :class="step===1?'play-move-left':''"></div>
        <div class="loadind-right" :class="step===1?'play-move-right':''"></div>
        <div class="page-base loading-progress" v-show="step===0"></div>
        <div class="progress-wall" v-show="step===0"><span>{{loadProgress|toInt}}%</span></div>
      </div>
      <!--加载动画结束-->
      <!--第一页开始-->
      <div class="first-page page-base" v-show="step===1||step===2||step===3" style="z-index: 801">
        <div class="page-base first-page-back"></div>
        <div class="page-base first-page-dog"></div>
        <div class="page-base first-page-front"></div>
        <div class="btn-bg" @touchstart="playSong">
          <div class="btn"></div>
        </div>
        <div class="first-page-curtain" :class="step===1||step===2?'play-move-up':''" v-show="step===1||step===2"></div>
        <div class="first-page-curtain first-page-curtain-over" v-show="step===3"></div>
      </div>
      <!--第一页结束-->
      <!--第一个视频开始-->
      <div class="dog-video" style="z-index: 900">
        <video id="dogVideo" :src="dogVideo" :class="{'dog-video-show': step === 3}" playsinline type="video/mp4"
               preload="auto" :width="1" :height="1"></video>
      </div>
      <!--第一个视频结束-->
      <!--第二页开始-->
      <div class="first-page page-base" v-show="step===3||step===4||step===5" style="z-index: 800">
        <div class="page-base first-page-back"></div>
        <div class="page-base first-page-dog"></div>
        <div class="page-base first-page-front"></div>
        <div class="input-group">
          <div class="input-bg">
            <div class="sex" @click="handelSexClick()">{{sex}}</div>
            <div class="birthday" @click="handelBirthdayClick()">{{birthday[0]}}.{{birthday[1]}}.{{birthday[2]}}</div>
            <div class="location" @click="handelLocationClick()">{{location[0]}}&nbsp;{{location[1]}}</div>
          </div>
        </div>
        <div class="btn-bg" @touchstart="playSong1">
          <div :class="downloadFlag===true?'btn-kan':'btn'"></div>
        </div>
        <div class="first-page-curtain first-page-curtain-over" v-show="step===4"></div>
        <transition name="fade">
          <div class="wait-video page-base"
               v-show="downloadFlag===false&&audioFinish===true"><img :src="require('./img/black_loading.gif')"/></div>
        </transition>
        <van-popup v-model="sexPickerShow" position="bottom">
          <van-picker show-toolbar :columns="sexList" :visible-item-count="3" @change="onChangeSex" title="性别"
                      @cancel="handelSexClick"
                      @confirm="handelSexClick"/>
        </van-popup>
        <van-popup v-model="birthPickerShow" position="bottom">
          <van-datetime-picker
              v-model="currentDate"
              type="datetime"
              :min-date="minDate"
              :max-date="maxDate"
              title="出生日期"
              @change="onChangeBirthday"
              @cancel="handelBirthdayClick"
              @confirm="handelBirthdayClick"
          />
        </van-popup>
        <van-popup v-model="locationPickerShow" position="bottom">
          <van-picker show-toolbar :columns="cityColumns" @change="onChangeCity" title="出生地"
                      @cancel="handelLocationClick"
                      @confirm="handelLocationClick"/>
        </van-popup>
      </div>
      <!--第二页结束-->
      <!--第二个视频开始-->
      <div class="dog-video detail-dog" v-show="step >= 4" style="z-index: 900">
        <video id="randomVideo" ref="videos" :class="{'dog-video-show': step === 5}" playsinline type="video/mp4"
               preload="auto" :width="1" :height="1"></video>
      </div>
      <!--第二个视频结束-->
      <!--狗年总结开始-->
      <div class="result page-base" style="z-index: 800" v-show="step===6||step===7">
        <img :src="dogResultImg" class="bg-img"/>
        <div class="more">
          <div class="more-bg more-bg-dog" @click="model1Handel"></div>
        </div>
        <div class="left-bottom-group">
          <div class="again-btn again-btn-dog" @touchstart="again"></div>
          <div class="save-btn save-btn-dog" @click="saveDogResult"></div>
        </div>
        <div class="next-btn" :class="pigReady===false?'next-btn-dog':'next-btn-dog-pay'"
             @touchstart="playPigVideo"></div>
        <transition name="fade">
          <div class="detail detail-dog page-base" v-show="model1">
            <div class="close" @click="model1Handel"></div>
            <div class="detail-box">
              <div class="detail-wall">
                <p v-for="text in dogData.AllDuanYuLst">{{text}}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <!--狗年总结结束-->
      <!--猪年视频开始-->
      <div class="dog-video" style="z-index: 900">
        <video id="pigVideo" :src="pigVideo" :class="{'dog-video-show': step === 7}" playsinline type="video/mp4"
               preload="auto" :width="1" :height="1"></video>
      </div>
      <!--猪年视频结束-->
      <!--猪年总结开始-->
      <div class="result page-base" style="z-index: 800" v-show="step===8">
        <img :src="pigResultImg" class="bg-img"/>
        <div class="more">
          <div class="more-bg more-bg-pig" @click="model2Handel"></div>
        </div>
        <div class="left-bottom-group">
          <div class="again-btn again-btn-pig" @click="again"></div>
          <div class="save-btn save-btn-pig" @click="savePigResult"></div>
        </div>
        <div class="next-btn next-btn-pig"></div>
        <transition name="fade">
          <div class="detail detail-pig page-base" v-show="model2">
            <div class="close" @click="model2Handel"></div>
            <div class="detail-box">
              <div class="detail-wall">
                <p v-for="text in pigData.AllDuanYuLst">{{text}}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <!--猪年总结结束-->
    </div>
  </div>
</template>

<script>
  import city from './img/province-city.json'
  import dog_videomp4 from './img/dog_video.mp4'
  import pig_videomp4 from './img/pig_video.mp4'

  import {
    executeForecast,
    getPayForecastTimesParam
  } from '../../api'

  let args = {}
  let wx = require('weixin-js-sdk');
  export default {
    name: 'index',
    data() {
      return {
        step: 0,//当前动画进行到第几步
        song: require('./img/luosheng.mp3'),//锣声
        dogVideo: dog_videomp4,
        randomVideo: '',
        downloadFlag: false,
        audioFinish: false,
        pigVideo: pig_videomp4,
        dogResultImg: '',
        pigResultImg: '',
        sex: '男',
        birthday: ['1994', '04', '01', '15', '23'],
        location: ['安徽', '长丰'],
        model1: false,
        model2: false,
        loadProgress: 0,
        dogData: {},
        pigData: {},
        sexPickerShow: false,
        birthPickerShow: false,
        locationPickerShow: false,
        sexList: ['男', '女'],
        cityColumns: [
          {
            values: Object.keys(city),
            className: 'column1'
          },
          {
            values: city['安徽'],
            className: 'column2',
            defaultIndex: 2
          }
        ],
        minDate: new Date(1970, 1, 1),
        maxDate: new Date(2001, 11, 30),
        currentDate: new Date(),
        pigReady: false
      }
    },
    created: function () {
      let imageAssets = [
        require('./img/index_loading_left.png'),
        require('./img/index_loading_right.png'),
        require('./img/index_loading_progress.gif'),
        require('./img/dog_bg.png'),
        require('./img/first_page_curtain.png'),
        require('./img/first_page_back.png'),
        require('./img/btn.gif'),
        require('./img/first_page_dog.gif'),
        require('./img/first_page_front.png'),
        require('./img/dog_result_bg.jpg'),
        require('./img/dog_result_model.png'),
        require('./img/dog_result_bt1.png'),
        require('./img/dog_result_bt2.png'),
        require('./img/dog-result-btn3.png'),
        require('./img/pig_bg.png'),
        require('./img/pig_result_bg.jpg'),
        require('./img/pig_result_bt1.png'),
        require('./img/pig_result_bt2.png'),
        require('./img/pig_result_bt3.png'),
        require('./img/pig_result_model.png'),
        require('./img/more_pig_result.png'),
        require('./img/qrcode.png'),
      ];
      let videoAssets = [dog_videomp4, pig_videomp4];
      let that = this;
      let totalCount = imageAssets.length + videoAssets.length;
      //监听图片加载
      for (let i = 0; i < imageAssets.length; i++) {
        let img = new Image();
        img.src = imageAssets[i];
        img.onload = function () {
          that.loadProgress += 100 / totalCount;
          if (that.loadProgress > 99) {
            that.loadProgress = 100;
            that.nextStep();
          }
        }
      }
      //监听声音/视频加载
      for (let i = 0; i < videoAssets.length; i++) {
        this.$http.get(videoAssets[i])
          .then(function (response) {
            that.loadProgress += 100 / totalCount;
            if (that.loadProgress > 99) {
              that.loadProgress = 100;
              that.nextStep();
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    mounted() {
    },
    methods: {
      handelSexClick() {
        this.sexPickerShow = !this.sexPickerShow;
      },
      handelBirthdayClick() {
        this.birthPickerShow = !this.birthPickerShow;
      },
      handelLocationClick() {
        this.locationPickerShow = !this.locationPickerShow;
      },
      onChangeSex: function (picker, value, index) {
        this.sex = value;
      },
      onChangeBirthday: function (picker) {
        this.birthday = picker.getValues();
      },
      onChangeCity: function (picker, values) {
        picker.setColumnValues(1, city[values[0]]);
        this.location = picker.getValues();
      },
      getPay() {
        this.$http.get(getPayForecastTimesParam)
          .then(function (response) {
            if (response.data.code === 200) {
              args = response.data.data;
              if (typeof WeixinJSBridge == 'undefined') {
                if (document.addEventListener) {
                  document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
                } else if (document.attachEvent) {
                  document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
                  document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
                }
              } else {
                onBridgeReady()
              }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //获取数据
      getDogData() {
        let birthday = this.birthday[0] + '-' + this.birthday[1] + '-' + this.birthday[2] + ' ' + this.birthday[3] + ':' + this.birthday[4] + ':00';
        let that = this;
        this.$http.get(executeForecast + '?sex=' + this.sex + '&address=' + this.location[0] + this.location[1] + '&birthday=' + birthday + '&forecast_year=2018')
          .then(function (response) {
            if (response.data.code === -101) {
              //未登录 前往授权
              that.getPay();
            }
            if (response.data.code === 200) {
              that.dogData = response.data.data;
              switch (that.dogData.RiZhu) {
                case "甲":
                  that.loadVideo('http://prod-www-annual-forecast.chuangkit.com/1%E7%94%B2%E6%97%A5%E5%B9%B2.mp4');
                  break;
                case "乙":
                  that.loadVideo('http://prod-www-annual-forecast.chuangkit.com/2%E4%B9%99%E6%97%A5%E5%B9%B2.mp4');
                  break;
                case "丙":
                  that.loadVideo('http://prod-www-annual-forecast.chuangkit.com/3%E4%B8%99%E6%97%A5%E5%B9%B2.mp4');
                  break;
                case "丁":
                  that.loadVideo('http://prod-www-annual-forecast.chuangkit.com/1%E7%94%B2%E6%97%A5%E5%B9%B2.mp4');
                  break;
                case "戊":
                  that.loadVideo('http://prod-www-annual-forecast.chuangkit.com/2%E4%B9%99%E6%97%A5%E5%B9%B2.mp4');
                  break;
                case "己":
                  that.loadVideo('http://prod-www-annual-forecast.chuangkit.com/3%E4%B8%99%E6%97%A5%E5%B9%B2.mp4');
                  break;
                case "庚":
                  that.loadVideo('http://prod-www-annual-forecast.chuangkit.com/1%E7%94%B2%E6%97%A5%E5%B9%B2.mp4');
                  break;
                case "辛":
                  that.loadVideo('http://prod-www-annual-forecast.chuangkit.com/2%E4%B9%99%E6%97%A5%E5%B9%B2.mp4');
                  break;
                case "壬":
                  that.loadVideo('http://prod-www-annual-forecast.chuangkit.com/3%E4%B8%99%E6%97%A5%E5%B9%B2.mp4');
                  break;
                case "癸":
                  that.loadVideo('http://prod-www-annual-forecast.chuangkit.com/3%E4%B8%99%E6%97%A5%E5%B9%B2.mp4');
                  break;
              }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //加载随机视频
      loadVideo: function (video) {
        this.$http.get(video)
          .then((res) => {
            this.downloadFlag = true
            this.$refs.videos.src = video;
          })
      },
      //加载界面过渡到第一页
      nextStep() {
        this.step = 1;
        let that = this;
        setTimeout(function () {
          that.step = 2;
        }, 3000);
      },
      //播放锣声
      playSong() {
        let dogvideo = document.getElementById('dogVideo');
        dogvideo.play();
        //狗年视频播放完毕
        let that = this;
        setTimeout(() => {
          this.step = 3;
        }, 20)
        dogvideo.addEventListener("ended", function () {
          that.step = 4;
        })
      },
      //第二次播放锣声
      playSong1() {
        if (this.sex === '' || this.birthday === '' || this.location === '') {
          return;
        }
        //获取数据
        if (this.downloadFlag === true) {
          this.nextStep1();
        } else {
          this.audioFinish = true;
          this.getDogData();
        }
      },
      //音频播放完或视频加载完执行  后完成者触发
      nextStep1() {
        this.audioFinish = false;//重置
        let randomVideo = document.getElementById('randomVideo');
        randomVideo.play();
        setTimeout(() => {
          this.step = 5;
        }, 100)
        let mData = this.dogData.LiuShuZhi.split(','); //数据 顺序不能改变 财道 事业 婚姻 健康 贵人 快乐
        let text = this.dogData.ThreeTiaoZiLst;
        //提前绘制
        this.drawImage(mData, text, 1);
        //狗年视频播放完毕
        let that = this;
        randomVideo.addEventListener("ended", function () {
          that.step = 6;
        })
      },
      drawImage(mData, text, type = 1) {
        let width = window.document.documentElement.getBoundingClientRect().width * 2;
        let multiple = width / 640.0;
        let that = this;
        // 画布宽高
        let w = 640 * multiple;
        let h = 1135 * multiple;
        let canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        let ctx = canvas.getContext('2d');
        //先添加一个背景图
        let img = new Image();
        if (type === 1) {
          img.src = require('./img/dog_result_bg.jpg');
        } else if (type === 2) {
          img.src = require('./img/pig_result_bg.jpg');
        }
        img.onload = function () {
          // 画底图
          ctx.drawImage(img, 0, 0, w, h);
          //画数据
          that.drawRegion(ctx, multiple, mData);
          //画文本
          that.drawText(text,
            ctx, multiple
          );
          //画二维码
          let qrcode = new Image();
          qrcode.src = require('./img/qrcode.png');
          qrcode.onload = function () {
            ctx.drawImage(qrcode, 456 * multiple, 907 * multiple, 137 * multiple, 137 * multiple);
            if (type === 1) {
              that.dogResultImg = canvas.toDataURL("image/png");
            } else if (type === 2) {
              that.pigResultImg = canvas.toDataURL("image/png");
            }
          };
        };
      },
      //绘制数据区域
      drawRegion: function (ctx, multiple, mData) {
        let mCount = 6; //边数
        let mCenterx = multiple * 321; //中心点x
        let mCentery = multiple * 414; //中心点y
        let R = 110 * multiple; //半径
        let mAngle = Math.PI * 2 / mCount; //角度
        // 画点
        ctx.save();
        ctx.fillStyle = "#ff7676";
        for (let i = 0; i < mCount; i++) {
          ctx.beginPath();
          let x = mCenterx + R * Math.sin(mAngle * i) * mData[i] / 100;
          let y = mCentery + R * Math.cos(mAngle * i) * mData[i] / 100;
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();
          ctx.closePath();
        }
        ctx.restore();
        // 画区域
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < mCount; i++) {
          let x = mCenterx + R * Math.sin(mAngle * i) * mData[i] / 100;
          let y = mCentery + R * Math.cos(mAngle * i) * mData[i] / 100;
          ctx.lineTo(x, y);
        }
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fill();
        ctx.restore();
      },
      //绘制文本
      drawText: function (str, ctx, multiple) {
        ctx.save();
        ctx.font = 17 * multiple + 'px Arial';
        ctx.fillStyle = '#666666';
        ctx.lineWidth = 300 * multiple;
        //计算换行
        let initX = 175 * multiple;
        let initY = 650 * multiple;
        let lineHeight = 26 * multiple;
        for (let i = 0; i < str[0].length / 17; i++) {
          //防止文本超出
          if (initY >= 645 * multiple + (24 * multiple) * 8) {
            break;
          }
          ctx.fillText(str[0].substring(i * 17, (i + 1) * 17), initX, initY);
          initY += lineHeight;
        }
        for (let i = 0; i < str[1].length / 17; i++) {
          //防止文本超出
          if (initY >= 645 * multiple + (24 * multiple) * 8) {
            break;
          }
          ctx.fillText(str[1].substring(i * 17, (i + 1) * 17), initX, initY);
          initY += lineHeight;
        }
        for (let i = 0; i < str[2].length / 17; i++) {
          //防止文本超出
          if (initY >= 645 * multiple + (24 * multiple) * 8) {
            break;
          }
          ctx.fillText(str[2].substring(i * 17, (i + 1) * 17), initX, initY);
          initY += lineHeight;
        }
        ctx.restore();
      },
      //再来一次
      again() {
        this.step = 2;
      },
      //保存狗年结果
      saveDogResult() {
      },
      // 保存猪年图片
      savePigResult() {
      },
      getPigVideoData() {
        let birthday = this.birthday[0] + '-' + this.birthday[1] + '-' + this.birthday[2] + ' ' + this.birthday[3] + ':' + this.birthday[4] + ':00';
        this.$http.get(executeForecast + '?sex=' + this.sex + '&address=' + this.location[0] + this.location[1] + '&birthday=' + birthday + '&forecast_year=2019')
          .then((response) => {
            if (response.data.code === -105) {
              //未登录 前往授权
              this.getPay();
            }
            if (response.data.code === 200) {
              this.pigReady = true;
              this.pigData = response.data.data;
              //从上到下，对应的Key，顺序不能改变
              let mData = this.pigData.LiuShuZhi.split(','); //数据 顺序不能改变 财道 事业 婚姻 健康 贵人 快乐
              let text = this.pigData.ThreeTiaoZiLst;
              //提前绘制
              this.drawImage(mData, text, 2);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      playPigVideo() {
        if (this.pigReady) {
          let pigvideo = document.getElementById('pigVideo');
          pigvideo.play();
          setTimeout(() => {
            this.step = 7;
          }, 100)
          pigvideo.addEventListener("ended", () => {
            this.step = 8;
          });
        } else {
          this.getPigVideoData()
        }

      },
      //微信分享
      wxShare() {
        //获取分享的接口暂时还没有 后端放假了。。。
        this.$http.get(getPayForecastTimesParam)
          .then((res) => {
            if (response.data.code === 200) {
              wx.config({
                debug: false, // 开启调试模式,
                appId: response.data.data.appId, // 必填
                timestamp: response.data.data.timeStamp, // 必填，生成签名的时间戳
                nonceStr: response.data.data.nonceStr, // 必填，生成签名的随机串
                signature: response.data.data.signature,// 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
              });
              //处理验证失败的信息
              wx.error(function (res) {
                logUtil.printLog('验证失败返回的信息:', res);
              });
              //处理验证成功的信息
              wx.ready(function () {
                //分享到朋友圈
                wx.onMenuShareTimeline({
                  title: "《说唱先知》你有一份狗年报告等待查收", // 分享标题
                  link: window.location.href.split('#')[0], // 分享链接
                  imgUrl: require("./img/share.jpg"), // 分享图标
                  success: function (res) {
                  },
                  cancel: function (res) {
                  }
                });
                //分享给朋友
                wx.onMenuShareAppMessage({
                  title: "《说唱先知》你有一份狗年报告等待查收", // 分享标题
                  desc: "呦呦切克闹，狗年报告来一套", // 分享描述
                  link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                  imgUrl: require("./img/share.jpg"), // 分享图标
                  type: '', // 分享类型,music、video或link，不填默认为link
                  dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                  success: function (res) {
                  },
                  cancel: function (res) {
                  }
                });
              });
            }
          })
      },
      model1Handel() {
        this.model1 = !this.model1
      },
      model2Handel() {
        this.model2 = !this.model2
      }
    },
    filters: {
      toInt: function (value) {
        return parseInt(value)
      }
    },
  }

  function onBridgeReady() {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
        "appId": args.appId, //公众号名称，由商户传入
        "timeStamp": args.timeStamp, // 支付签名时间戳，
        "nonceStr": args.nonceStr, // 支付签名随机串，
        "package": args.packageId, // 统一支付接口返回的prepay_id参数值，
        "signType": args.signType, // 签名方式
        "paySign": args.paySign, // 支付签名
      },
      function (res) {
        console.log(res)
        if (res.err_msg == "get_brand_wcpay_request：ok") {
          //支付成功后再获取数据
          this.getPigVideoData()
        } else {
        }
      }
    );
  }
</script>

<style lang="less" scoped>
  @import "index";
</style>
