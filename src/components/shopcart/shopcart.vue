<template>
  <div>
    <!--购物车-->
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleList">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount>0}">
              <span class="icon-shopping_cart" :class="{'highlight': totalCount>0}"></span>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight': totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click="pay">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
      </div>
      <!--滚动的小球-->
      <div class="ball-container">
        <transition-group v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter" name="drop">
          <div class="ball" v-for="(ball,index) in balls" v-show="ball.show" :key="index">
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
      <!--购物车详情-->
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food border-1px" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @add="drop"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!--购物详情背景-->
    <transition name="fade">
      <div class="list-mark" v-show="listShow" @click="fold=true"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';

  export default {
      props: {
        selectFoods: {
          type: Array,
          default() {
              return [];
          }
        },
        deliveryPrice: {
          type: Number,
          default: 0
        },
        minPrice: {
          type: Number,
          default: 0
        }
      },
      components: {
        cartcontrol
      },
      data() {
        return {
          // 五个球，代表在过渡时间内，最多可以执行五次动画
          balls: [
            {
              show: false
            },
            {
              show: false
            },
            {
              show: false
            },
            {
              show: false
            },
            {
              show: false
            }
          ],
          dropBalls: [],
          fold: true  // 折叠状态
        };
      },
      computed: {
        totalPrice() {
          let total = 0;
          this.selectFoods.forEach((food) => {
             total += food.price * food.count;
          });
          return total;
        },
        totalCount() {
          let count = 0;
          this.selectFoods.forEach((food) => {
             count += food.count;
          });
          return count;
        },
        payDesc() {
            if (this.totalPrice === 0) {
               return `￥${this.minPrice}元起送`;
            } else if (this.totalPrice < this.minPrice) {
                return `还差${this.minPrice - this.totalPrice}元起送`;
            } else {
                return '去结算';
            }
        },
        payClass() {
            if (this.totalPrice < this.minPrice) {
              return 'not-enough';
            } else {
              return 'enough';
            }
        },
        listShow() {
            // 总数为0，折叠且不见
            if (!this.totalCount) {
                this.fold = true;
                return false;
            }
            // 总数不为0，折叠状态不见，非折叠状态可见
            let show = !this.fold;
            // 在购物详情第一次显示时，实例化滚动实例
            if (show) {
              this.$nextTick(() => {
                if (!this.scroll) {
                  this.scroll = new BScroll(this.$refs.listContent, {
                    click: true
                  });
                } else {
                  this.scroll.refresh();
                }
              });
            }
            return show;
        }
      },
      methods: {
        drop(el) {
          for (let i = 0; i < this.balls.length; i++) {
            let ball = this.balls[i];
            if (!ball.show) {
              ball.show = true;
              ball.el = el;
              this.dropBalls.push(ball);
              return;
            }
          }
        },
        toggleList() {
          if (!this.totalCount) {
              return;
          }
          this.fold = !this.fold;
        },
        empty() {
          this.selectFoods.forEach((food) => {
            food.count = 0;
          });
        },
        pay() {
          if (this.totalPrice < this.minPrice) {
              return;
          }
          window.alert(`总共支付${this.totalPrice}元`);
        },
        // 对应css的enter
        beforeEnter(el) {
          let count = this.balls.length;
          while (count--) {
            let ball = this.balls[count];
            if (ball.show) {
              // 获取某个元素相对于视窗的位置集合
              let rect = ball.el.getBoundingClientRect();
              let x = rect.left - 32;
              let y = -(window.innerHeight - rect.top - 22);
              // el.style.display = '';
              el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
              el.style.transform = `translate3d(0, ${y}px, 0)`;
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
              inner.style.transform = `translate3d(${x}px, 0, 0)`;
            }
          }
        },
        // 对应css的enter-active
        enter(el) {
          // eslint-disable-next-line no-unused-vars
          let rf = el.offsetHeight; // 触发浏览器重绘
          this.$nextTick(() => {
            el.style.webkitTransform = `translate3d(0, 0, 0)`;
            el.style.transform = `translate3d(0, 0, 0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(0, 0, 0)`;
            inner.style.transform = `translate3d(0, 0, 0)`;
          });
        },
        // 对应css的enter-to
        afterEnter(el) {
          let ball = this.dropBalls.shift();
          if (ball) {
            ball.show = false;
            el.style.display = 'none';
          }
        }
      }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';

  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      color rgba(255, 255, 255, .4)
      .content-left
        flex 1
        font-size 0
        background #141d27
        .logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -12px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            background #2b343c
            text-align center
            &.highlight
              background rgb(0, 160, 220)
            .icon-shopping_cart
              font-size 24px
              color #80858a
              line-height 44px
              &.highlight
                color #fff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            background-color rgb(240,20,20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, .4)
        .price
          display inline-block
          margin-top 12px
          margin-left 12px
          padding-right 12px
          line-height 24px
          border-right 1px solid rgba(255, 255, 255, .1)
          font-size 16px
          font-weight 700
          &.highlight
            color #fff
        .desc
          display inline-block
          margin-left 12px
          font-size 14px
          line-height 48px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          background #2b343c
          text-align center
          font-size 12px
          font-weight 700
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff
    .ball-container
      .ball
        position fixed
        z-index 200
        left 32px
        bottom 22px
        .inner
          width 16px
          height 16px
          border-radius 50%
          background-color rgb(0, 160, 222)
        &.drop-enter-active, &.drop-leave-active
          transition all .5s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            transition all .5s linear
    .shopcart-list
      position absolute
      left 0
      top 0
      z-index -1
      width 100%
      transform translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition all .5s
        transform translate3d(0, -100%, 0) // 动画的最终状态必须是元素的原始状态
      &.fold-enter, &.fold-leave-to
        transform translate3d(0, 0, 0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7, 17, 27, .1)
        .title
          float left
          font-size 14px
          color rgb(7, 17, 27)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)
      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #fff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7, 17, 27, .1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7, 17, 27)
          .price
            position: absolute
            right 90px
            bottom 13px
            line-height 24px
            font-weight 700
            font-size 14px
            color rgb(240, 20, 20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px
  .list-mark
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 20
    background rgba(7, 17, 27, .8)
    &.fade-enter-active, &.fade-leave-active
      transition all 0.5s
      opacity 1
      background rgba(7, 17, 27, .8)
    &.fade-enter, &.fade-leave-to
      opacity 0
      background rgba(7, 17, 27, 0)
</style>
