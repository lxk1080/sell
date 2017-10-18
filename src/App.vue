<template>
  <div id="app">
    <v-header></v-header>
    <div class="tab">
      ...

    </div>
    <div class="content">
      ...

    </div>
  </div>
</template>

<script>
  import header from './components/header/header.vue';

  export default {
    components: {
      'v-header': header
    }
  };
</script>

<style>

</style>
