<template>
  <section id="app">
    <nav class="navbar navbar-light bg-white" style="border-bottom: solid .1px #f3f3f3">
      <a class="navbar-brand" href="#">
        <h3>Radiobases</h3>
      </a>
      <i class="fas fa-broadcast-tower fa-2x float-right"></i>
    </nav>
    <div class="container-fluid mt-5">
      <router-view></router-view>
    </div>
  </section>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}

</script>
