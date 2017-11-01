<template>
  <div>
    <div class="goods">
      <!--菜单列表-->            <!--实例化dom对象-->
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item" :class="{'current': currentIndex===index}" @click="selectMenu(index,$event)">
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <!--食品展示-->
      <div class="foods-wrapper" ref="foodWrapper">
        <ul>
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title border-1px">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item border-1px" @click="setCurrentFood(food, $event)">
                <div class="icon">
                  <img :src="food.icon" alt="icon" width="57" height="57">
                </div>
                <div class="content">
                  <div class="name">{{food.name}}</div>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}件</span><!--
                 --><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now"><span class="currency">￥</span>{{food.price}}</span><!--
                 --><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" @add="_drop"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!--购物车-->
      <shopcart ref="shopcart" :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
    <!--商品详情-->
    <food ref="food" :food="currentFood" @add="_drop"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from '../shopcart/shopcart.vue';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import food from '../food/food.vue';

  const ERR_OK = 0;

  export default {
      props: {
          seller: {
              type: Object
          }
      },
      data() {
          return {
            goods: [],
            listHeight: [],
            scrollY: 0,
            currentFood: {}
          };
      },
      computed: {
        // 随着滚动时scrollY的改变，实时返回当前索引
        currentIndex() {
            for (let i = 0; i < this.listHeight.length; i++) {
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i + 1];
                if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                    return i;
                }
            }
            return 0;
        },
        selectFoods() {
            let selectFoods = [];
            this.goods.forEach((good) => {
                good.foods.forEach((food) => {
                  if (food.count) {
                    selectFoods.push(food);
                  }
                });
            });
            return selectFoods;
        }
      },
      created() {
          this.$http.get('/api/goods').then((res) => {
              res = res.body;
              if (res.errno === ERR_OK) {
                  this.goods = res.data;
                  // 在修改数据之后立即使用这个方法，获取更新后的 DOM
                  this.$nextTick(() => {
                      this._initScroll();
                      this._calculateHeight();
                  });
              }
          });
          this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      },
      methods: {
          // 编码规范，规定下划线开头的方法为组件私有方法，不被父组件所调用
          _initScroll() {
              this.menuScroll = new BScroll(this.$refs.menuWrapper, { /* vue获取dom对象 */
                  click: true  // 设置dom对象可点击
              });
              this.foodScroll = new BScroll(this.$refs.foodWrapper, {
                  click: true,
                  probeType: 3  // 开启滚动时记录位置的功能
              });
              // 滚动时监听位置
              this.foodScroll.on('scroll', (pos) => {
                  this.scrollY = Math.abs(Math.round(pos.y));
              });
          },
          // 获取每个food-list的高度
          _calculateHeight() {
              let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
              let height = 0;
              this.listHeight.push(height);
              for (let i = 0; i < foodList.length; i++) {
                  let item = foodList[i];
                  height += item.clientHeight;
                  this.listHeight.push(height);
              }
          },
          _drop(target) {
            // 异步执行下落动画
            this.$nextTick(() => {
              this.$refs.shopcart.drop(target);
            });
          },
          selectMenu(index, event) {
              // _constructed是better-scroll的属性，原生的click事件不存在此属性
              if (!event._constructed) {
                  return;
              }
              let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
              let el = foodList[index];
              this.foodScroll.scrollToElement(el, 100); // 利用better-scroll插件，滚动到指定元素，第二个参数是时间
          },
          setCurrentFood(food, event) {
            if (!event._constructed) {
              return;
            }
            this.currentFood = food;
            this.$refs.food.show();
          }
      },
      components: {
          shopcart,
          cartcontrol,
          food
      }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';
  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background-color #f3f5f7
      .menu-item
        display table
        width 56px
        height 54px
        padding 0 12px
        line-height 14px
        &.current
          position relative
          z-index 10
          margin-top -1px
          background #fff
          font-weight 700
          .text
            border-none()
        .text
          display table-cell
          vertical-align middle
          font-size 12px
          border-1px(rgba(7, 17, 27, .1));
          .icon
            display inline-block
            margin-right 2px
            vertical-align top
            width 12px
            height 12px
            background-size 12px 12px
            background-repeat no-repeat
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
    .foods-wrapper
      flex 1
      .title
        margin-left 14px
        margin-right 14px
        height 26px
        line-height 26px
        border-1px(rgba(7, 17, 27, .1))
        font-size 12px
        font-weight 700
        color rgb(147, 153, 159)
      .food-item
        display flex
        margin 10px
        padding-bottom 10px
        border-1px(rgba(7, 17, 27, .1))
        &:last-child
          margin-bottom 0
          border-none()
        .icon
          flex 0 0 57px
          margin-right 10px
          img
            border-radius 2px
        .content
          flex 1
          .name
            margin 2px 0 8px 0
            line-height 14px
            font-size 14px
            color rgb(7, 17 ,27)
          .desc, .extra
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
          .desc
            margin-bottom 8px
          .extra
            .count
              margin-right 12px
          .price
            font-weight 700
            line-height 24px
            .now
              margin-right 14px
              font-size 14px
              color rgb(240, 20, 20)
              .currency
                font-size 10px
            .old
              text-decoration line-through
              font-size 10px
              color rgb(147, 153, 159)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px
</style>
