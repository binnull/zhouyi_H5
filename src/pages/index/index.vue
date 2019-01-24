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
      <div class="first-page page-base" v-show="step===1||step===2||step===3" style="z-index: 800">
        <div class="page-base first-page-back"></div>
        <div class="page-base first-page-dog"></div>
        <div class="page-base first-page-front"></div>
        <div class="btn-bg" @click="playSong">
          <div class="btn"></div>
        </div>
        <div class="first-page-curtain" :class="step===1||step===2?'play-move-up':''" v-show="step===1||step===2"></div>
        <div class="first-page-curtain first-page-curtain-over" v-show="step===3"></div>
        <audio :src="song" id="audio" @ended="overAudio"></audio>
      </div>
      <!--第一页结束-->
      <!--第一个视频开始-->
      <div class="dog-video page-base" v-show="step===3" style="z-index: 900">
        <video id="dogVideo" class="page-base" :src="dogVideo"></video>
      </div>
      <!--第一个视频结束-->
      <!--第二页开始-->
      <div class="first-page page-base" v-show="step===3||step===4" style="z-index: 800">
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
        <div class="btn-bg" @click="playSong1">
          <div class="btn"></div>
        </div>
        <div class="first-page-curtain first-page-curtain-over" v-show="step===4"></div>
        <audio :src="song" id="audio1" @ended="overAudio1"></audio>
        <transition name="fade">
          <div class="wait-video page-base"
               v-show="downloadFlag===false&&audioFinish===true"></div>
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
      <div class="dog-video detail-dog page-base" v-show="step===4||step===5" style="z-index: 700">
        <video id="randomVideo" class="page-base" ref="videos"></video>
      </div>
      <!--第二个视频结束-->
      <!--狗年总结开始-->
      <div class="result page-base" style="z-index: 800" v-show="step===6">
        <img :src="dogResultImg" class="bg-img"/>
        <div class="more">
          <div class="more-bg more-bg-dog" @click="model1Handel"></div>
        </div>
        <div class="left-bottom-group">
          <div class="again-btn again-btn-dog" @click="again"></div>
          <div class="save-btn save-btn-dog" @click="saveDogResult"></div>
        </div>
        <div class="next-btn next-btn-dog" @click="playPigVideo"></div>
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
      <div class="dog-video page-base" v-show="step===7" style="z-index: 700">
        <video id="pigVideo" class="page-base" :src="pigVideo"></video>
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

  export default {
    name: 'index',
    data() {
      return {
        step: 0,//当前动画进行到第几步
        song: require('./img/luosheng.mp3'),//锣声
        dogVideo: require('./img/dog_video.mp4'),
        randomVideo: '',
        downloadFlag: false,
        audioFinish: false,
        pigVideo: require('./img/pig_video.mp4'),
        dogResultImg: '',
        pigResultImg: '',
        sex: '男',
        birthday: ['1994', '04', '01', '15', '23'],
        location: ['安徽', '滨州'],
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
            values: city['山东'],
            className: 'column2',
            defaultIndex: 2
          }
        ],
        minDate: new Date(1900, 1, 1),
        maxDate: new Date(),
        currentDate: new Date()
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
        require('./img/second_page_bg.jpg'),
        require('./img/pig_bg.png'),
        require('./img/pig_result_bg.jpg'),
        require('./img/pig_result_bt1.png'),
        require('./img/pig_result_bt2.png'),
        require('./img/pig_result_bt3.png'),
        require('./img/pig_result_model.png'),
        require('./img/more_pig_result.png'),
        require('./img/qrcode.png'),
      ];
      let videoAssets = [require('./img/luosheng.mp3'), require('./img/dog_video.mp4'), require('./img/pig_video.mp4')];

      let that = this;
      let totalCount = imageAssets.length + videoAssets.length;
      //监听图片加载
      for (let i = 0; i < imageAssets.length; i++) {
        let img = new Image();
        img.src = imageAssets[i];
        img.onload = function () {
          that.loadProgress += 100 / totalCount;
          if (that.loadProgress > 90) {
            that.loadProgress = 100;
            that.nextStep();
          }
        }
      }
      //监听声音/视频加载
      for (let i = 0; i < videoAssets.length; i++) {
        let audio = new Audio(videoAssets[i]);
        audio.onloadedmetadata = function () {
          that.loadProgress += 100 / totalCount;
          if (that.loadProgress > 90) {
            that.loadProgress = 100;
            that.nextStep();
          }
        };
      }
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
      //获取数据
      getDogData() {
        this.dogData = {
          LiuShuZhi: "85,70,10,88,65,60",
          RiZhu: "甲",
          ThreeTiaoZiLst: ["此年需要负责的事情容易成倍多，也有好机会增加自己的名声。", "此年容易学习多方面的冷门知识，也易接触神秘知识；也容易拜多人为师。", "此年容易工作踏实，能和领导搞好关系，但得通过钱财的方式。"],
          AllDuanYuLst: ["坤造八字:壬戌年 戊申月 甲子日 辛未时 的甲辰大运，戊戌(2018)流年的批断内容:\u0000", "如有重复内容，则此项当年发生的可能性非常大，请着重注意此项内容\u0000", "1,此年自己的专业技术会得到提升，也利于考学、办理执照等事情。也容易得到长辈的关爱。此年重视精神生活。\u0000", "2,流年重点:此年对工作很是用心，容易对工作付出多，和领导的关系也不错，利用物质的方式和领导搞好关系，容易对自己的事业、地位的提升有好处。\u0000", "3,流年重点:财星动，此年有一定的钱财机会。\u0000", "4,流年重点:此年要格外注意因为自己糊涂，或者被他人忽悠蒙蔽，或者自己大意，比如看不见、看错某些安全提示信息，而导致的意外灾厄！长辈也要防意外之厄！自己的住所、车辆等也容易有损坏等事！\u0000", "5,流年重点:想要孩子的此年容易有怀孕或生孩子之事。未婚者需要谨慎于与异性的接触，否则容易有意外怀孕之事。\u0000", "6,流年重点:此年容易为了挣钱而撇家舍业，也容易因为对钱财看得重而做一些不利与自己的健康的事情，甚至容易为了钱财而做有些突破道德事情。此年也需要注意长辈健康。\u0000", "7,流年重点:此年自己在知识，思想，研究内容等方面，容易发生大的变化，容易开始涉足新的知识领域，居住环境也容易大变化，工作环境也存在变化的可能！\u0000", "8,流年重点:此年在生意成交上要注意是非口舌之事，容易为了钱财，合同额等有一些波折，难谈之事！\u0000", "9,流年重点:此年要着重注意父亲的健康状况，重要！也要注意手术之事。\u0000", "10,流年重点:此年要着重注意母亲的健康状况！也要注意磕碰、流血等事。\u0000", "11,流年重点:重点：此年要注意孝服之事！\u0000", "12,此年容易突然有人给自己增加很多的工作量，让自己负责的事情成倍增加，利于自己名声的培养。\u0000", "13,此年容易开始学习、研究某些方面的冷门专业知识、技术等；也容易对神秘知识(宗教、数术等)产生学习兴趣，是一个涉猎广泛的年份。\u0000", "14,此年是一个和领导搞好关系的好年；上班的人，可以为自己的领导多付出，甚至是送礼之类的；从商的人也可以和辖区官员沟通好关系；但是也要防止被管理者扣钱、罚款的事情\u0000", "15,此年命主容易和人展开事业上的合作,事业上有大的发展之机。\u0000", "16,重点：此年容易因为面临的棘手问题，遇到的麻烦事，繁重的职责等因素，加紧学习、考证，或者容易找靠山化解自己的难题。此年工作中面临的文书工作不少，如投标等。\u0000", "17,重点：此年容易因为研究、学习、取证等因素，加紧学业，看更多的书，学更多的知识。\u0000", "18,重点：此年容易拿钱去学习，或者用钱购买一些证件，证书等，也容易购车、房、家居物品等。\u0000", "19,重点：此年容易因为感到自己经常遇到一些让自己很不爽的、工作和生活中的阻碍、竞争之事，而想通过学习、咨询等方式找到这种不顺和阻碍的答案。是一种不甘落后的表现，希望自己更加的进步而有了上进、学习之心。\u0000", "20,上班的命主，此年有升职、找到好工作的机遇！\u0000", "21,此年命主父亲容易有生病住院之事。\u0000", "22,此年命主父亲容易有官司是非之事。\u0000", "23,此年男性长辈健康不利，容易有身体疼痛难安之事，或者容易有心理难受之事。此年做生意的人容易生意业务改变！\u0000", "24,命主此年容易有不错的发财机会，努力争取会有不错的收获。\u0000", "25,重点提示：逢羊月（农历六月）或其前后、马月（农历五月）或其前后的月份容易有发财、升薪水等好事。\u0000", "26,此年事业至上有高升之象,未婚者恋爱顺利，已婚者感情稳定。\u0000", "27,此年长辈有一定的不利，许多注意身体健康。\u0000", "28,此年钱财容易有大的花费，破耗;此年宜多购置物品，不宜积攒钱财。\u0000", "29,此年虽然钱财有花费，但也有钱财机遇，务必好好争取。\u0000", "\u0000"]
        };
        switch (this.dogData.RiZhu) {
          case "甲":
            this.loadVideo('http://img.aidny.cn/1%E7%94%B2%E6%97%A5%E5%B9%B2.mp4');
            break;
          case "乙":
            this.loadVideo('http://img.aidny.cn/2%E4%B9%99%E6%97%A5%E5%B9%B2.mp4');
            break;
          case "丙":
            this.loadVideo('http://img.aidny.cn/3%E4%B8%99%E6%97%A5%E5%B9%B2.mp4');
            break;
        }
      },
      //加载随机视频
      loadVideo: function (video) {
        let V = new Audio(video);
        let that = this;
        V.onloadedmetadata = function () {
          //判断是否要执行下一步
          that.downloadFlag = true;
          that.$refs.videos.src = V.src;
          if (that.audioFinish === true && that.downloadFlag === true) {
            that.nextStep1();
          }
        };
      },
      //加载界面过渡到第一页
      nextStep() {
        this.step = 1;
        let that = this;
        setTimeout(function () {
          that.step = 2;
        }, 5000);
      },
      //播放锣声
      playSong() {
        document.getElementById('audio').play()
      },
      //锣声播放完毕，下一场景
      overAudio() {
        document.getElementById('audio').pause();
        this.step = 3;
        let dogvideo = document.getElementById('dogVideo');
        dogvideo.play();
        //狗年视频播放完毕
        let that = this;
        dogvideo.addEventListener("ended", function () {
          that.step = 4;
        })
      },
      //第二次播放锣声
      playSong1() {
        if (this.sex === '' || this.birthday === '' || this.location === '') {
          return;
        }
        document.getElementById('audio1').play();
        //获取数据
        this.getDogData();
      },
      //第二次锣声播放完毕，下一场景
      overAudio1() {
        document.getElementById('audio1').pause();
        this.audioFinish = true;
        if (this.audioFinish === true && this.downloadFlag === true) {
          this.nextStep1();
        }
      },
      //音频播放完或视频加载完执行  后完成者触发
      nextStep1() {
        this.audioFinish = false;//重置
        this.step = 5;
        let randomVideo = document.getElementById('randomVideo');
        randomVideo.play();
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
      playPigVideo() {
        this.step = 7;
        let pigvideo = document.getElementById('pigVideo');
        pigvideo.play();
        this.pigData = {
          LiuShuZhi: "85,70,0,88,65,60",
          RiZhu: "甲",
          ThreeTiaoZiLst: ["此年需要负责的事情容易成倍多，也有好机会增加自己的名声。", "此年容易学习多方面的冷门知识，也易接触神秘知识；也容易拜多人为师。", "此年容易工作踏实，能和领导搞好关系，但得通过钱财的方式。"],
          AllDuanYuLst: ["坤造八字:壬戌年 戊申月 甲子日 辛未时 的甲辰大运，戊戌(2018)流年的批断内容:\u0000", "如有重复内容，则此项当年发生的可能性非常大，请着重注意此项内容\u0000", "1,此年自己的专业技术会得到提升，也利于考学、办理执照等事情。也容易得到长辈的关爱。此年重视精神生活。\u0000", "2,流年重点:此年对工作很是用心，容易对工作付出多，和领导的关系也不错，利用物质的方式和领导搞好关系，容易对自己的事业、地位的提升有好处。\u0000", "3,流年重点:财星动，此年有一定的钱财机会。\u0000", "4,流年重点:此年要格外注意因为自己糊涂，或者被他人忽悠蒙蔽，或者自己大意，比如看不见、看错某些安全提示信息，而导致的意外灾厄！长辈也要防意外之厄！自己的住所、车辆等也容易有损坏等事！\u0000", "5,流年重点:想要孩子的此年容易有怀孕或生孩子之事。未婚者需要谨慎于与异性的接触，否则容易有意外怀孕之事。\u0000", "6,流年重点:此年容易为了挣钱而撇家舍业，也容易因为对钱财看得重而做一些不利与自己的健康的事情，甚至容易为了钱财而做有些突破道德事情。此年也需要注意长辈健康。\u0000", "7,流年重点:此年自己在知识，思想，研究内容等方面，容易发生大的变化，容易开始涉足新的知识领域，居住环境也容易大变化，工作环境也存在变化的可能！\u0000", "8,流年重点:此年在生意成交上要注意是非口舌之事，容易为了钱财，合同额等有一些波折，难谈之事！\u0000", "9,流年重点:此年要着重注意父亲的健康状况，重要！也要注意手术之事。\u0000", "10,流年重点:此年要着重注意母亲的健康状况！也要注意磕碰、流血等事。\u0000", "11,流年重点:重点：此年要注意孝服之事！\u0000", "12,此年容易突然有人给自己增加很多的工作量，让自己负责的事情成倍增加，利于自己名声的培养。\u0000", "13,此年容易开始学习、研究某些方面的冷门专业知识、技术等；也容易对神秘知识(宗教、数术等)产生学习兴趣，是一个涉猎广泛的年份。\u0000", "14,此年是一个和领导搞好关系的好年；上班的人，可以为自己的领导多付出，甚至是送礼之类的；从商的人也可以和辖区官员沟通好关系；但是也要防止被管理者扣钱、罚款的事情\u0000", "15,此年命主容易和人展开事业上的合作,事业上有大的发展之机。\u0000", "16,重点：此年容易因为面临的棘手问题，遇到的麻烦事，繁重的职责等因素，加紧学习、考证，或者容易找靠山化解自己的难题。此年工作中面临的文书工作不少，如投标等。\u0000", "17,重点：此年容易因为研究、学习、取证等因素，加紧学业，看更多的书，学更多的知识。\u0000", "18,重点：此年容易拿钱去学习，或者用钱购买一些证件，证书等，也容易购车、房、家居物品等。\u0000", "19,重点：此年容易因为感到自己经常遇到一些让自己很不爽的、工作和生活中的阻碍、竞争之事，而想通过学习、咨询等方式找到这种不顺和阻碍的答案。是一种不甘落后的表现，希望自己更加的进步而有了上进、学习之心。\u0000", "20,上班的命主，此年有升职、找到好工作的机遇！\u0000", "21,此年命主父亲容易有生病住院之事。\u0000", "22,此年命主父亲容易有官司是非之事。\u0000", "23,此年男性长辈健康不利，容易有身体疼痛难安之事，或者容易有心理难受之事。此年做生意的人容易生意业务改变！\u0000", "24,命主此年容易有不错的发财机会，努力争取会有不错的收获。\u0000", "25,重点提示：逢羊月（农历六月）或其前后、马月（农历五月）或其前后的月份容易有发财、升薪水等好事。\u0000", "26,此年事业至上有高升之象,未婚者恋爱顺利，已婚者感情稳定。\u0000", "27,此年长辈有一定的不利，许多注意身体健康。\u0000", "28,此年钱财容易有大的花费，破耗;此年宜多购置物品，不宜积攒钱财。\u0000", "29,此年虽然钱财有花费，但也有钱财机遇，务必好好争取。\u0000", "\u0000"]
        };
        //从上到下，对应的Key，顺序不能改变
        let mData = this.pigData.LiuShuZhi.split(','); //数据 顺序不能改变 财道 事业 婚姻 健康 贵人 快乐
        let text = this.pigData.ThreeTiaoZiLst;
        //提前绘制
        this.drawImage(mData, text, 2);
        //猪年视频播放完毕
        let that = this;
        pigvideo.addEventListener("ended", function () {
          that.step = 8;
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
</script>

<style lang="less" scoped>
  @import "index";
</style>
