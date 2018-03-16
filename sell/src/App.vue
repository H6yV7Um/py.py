<template>
<div>
    <v-header></v-header>
    <v-tab></v-tab>
 <!--    <content></content> -->



</div>
 
</template>

<script>
import header from './components/header'
import tab from './components/tab'
export default {
  name: 'app',
  components: {
    'v-header': header,
    'v-tab': tab
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
