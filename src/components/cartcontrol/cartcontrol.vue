<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" @click.stop="decreaseCart($event)" v-show="food.count>0">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.$emit('add', event.target);
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-decrease
      display inline-block
      padding 6px
      .inner
        line-height 24px
        font-size 24px
        color rgb(0, 160, 220)
      &.move-enter-active, &.move-leave-active //（状态2和5）
        transition all .4s
        opacity 1
        transform translate3d(0, 0, 0)
        .inner
          transition all .4s
          display inline-block
          transform rotate(-360deg)
      &.move-enter, &.move-leave-to //（状态1和6）
        opacity 0
        transform translate3d(24px, 0, 0)
        .inner
          transform rotate(0)
    .cart-count
      display inline-block
      vertical-align top
      padding-top 6px
      width 12px
      text-align center
      line-height 24px
      font-size 10px
      color rgb(147, 153, 159)
    .cart-add
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0, 160, 220)
</style>
