<template>
  <div id="app">
    <h3>Fly History Tool</h3>
    <div ref="map" id="map"></div>
  </div>
</template>

<script>
var gml = require("google-maps")
require("./mapStuff.js")

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      m: {}
    }
  },
  created(){
      // TODO: use env variable
    gml.KEY ="AIzaSyDV_hFbkkJB3PmPqV32O8GKvhLueL4CCkM"

    gml.load(google => {
        let opts = {
            zoom: 9,
            center: {lat: 40.455307, lng: -111.923218
            }
        }

        this.m = new google.maps.Map(this.$refs.map, opts);

        this.m = new MapStuff(map)
        m.goog()
    })

      // var map = new google.maps.Map(document.getElementById('map'), {
      //     zoom: 9,
      //     center: {lat: 40.455307, lng: -111.923218}
      // })


  },

}
</script>

<style lang="scss">
    #map {
        height: 800px;
        width: 100%;
    }
</style>
