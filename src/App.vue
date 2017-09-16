<template>
  <div id="app" class="container">
    <h3>Fly History Tool</h3>
    <div class="row">
        <div class="col-8">
            <gmap-map
                @rightclick="rightclick"
                :center="{lat: 40.455307, lng: -111.923218}"
                :zoom="9"
                id="map"
                >



                <gmap-circle v-if="circle.lng"
                    :radius="rad"
                    :center="circle"
                    :options="{editable: true}"
                    @center_changed="updateCenter($event)"
                    @radius_changed="rad = $event"
                    >
                    </gmap-circle>

                    <gmap-marker
                        :key="index"
                        v-for="(m, index) in points"
                        :position="m.position"
                        :clickable="true"
                        :draggable="true"
                        @click="center=m.position"
                        ></gmap-marker>

            </gmap-map>
            <!-- <div ref="map" id="map"></div> -->
        </div>
        <div class="col-4">

            <b-button-toolbar>
                <b-button-group>
                    <b-btn>&lsaquo;</b-btn>
                </b-button-group>
                <b-input-group>
                    <datepicker></datepicker>
                </b-input-group>
                <b-button-group>
                    <b-btn>&rsaquo;</b-btn>
                </b-button-group>
            </b-button-toolbar>

            <b-button @click="getOne">Fetch</b-button>
            {{ circle.lat }}

        </div>
    </div>
    <div class="row">
        <div class="col">
            <timeline></timeline>
        </div>
    </div>
  </div>
</template>

<script>
import MapStuff from "./mapStuff"
import Datepicker from 'vuejs-datepicker'
import timeline from "./timeline.vue"

export default {
  name: 'app',
  components:{
      Datepicker,
      timeline
  },
  data () {
    return {
      url:'http://localhost:5000/',
      day: "",
      begin: {},
      end: {},
      points: [],
      limit: 1000,
      rad: 400,
      circle: {
          lat: 0,
          lng: 0,
      }
    }
  },
  created(){

    // gml.load(google => {
    //
    //     // this.gApi = google
    //     let opts = {
    //         zoom: 9,
    //         center: {lat: 40.455307, lng: -111.923218
    //         }
    //     }
    //
    //     // this.gmap = new google.maps.Map(this.$refs.map, opts)
    //     //
    //     // this.ms = new MapStuff(this.gmap, this.gApi)
    //     // this.ms.goog()
    //     // this.hello()
    // })

  },
  methods: {
      fetch(){
        console.log('fetch...')
      },
      hello(){
          console.log("hello")
      },
      log(val){
        console.log("log")
        console.log(val)
      },
      rightclick(e){
          // console.log(e)
          // console.log("rightclick")
          this.circle.lat = e.latLng.lat()
          this.circle.lng = e.latLng.lng()

          console.log(this.circle)
      },
      fetchPoints(){

      },
      updateCenter(e){
          this.circle = {
              lat: e.lat(),
              lng: e.lng()
          }
      },
      getPoints(addr = false){
          // let url = addr || this.url + "mapped?where=" + this.where()
          let url = addr || this.url + "mapped?where=" + this.where + "&sort=created"
          // let url = addr || `${this.url}points/mapped?aggregate={"$where":${this.where()}}`
          // let url = addr || `${this.url}first?aggregate={"$where":{"altitude":1372}}`
          return fetch(url)
          .then(resp => {
              return resp.json()
          })
          .then(v => {
              v._items = v._items.map(item => {
                  item.position = {lat: item.location[1], lng: item.location[0]}
                  return item
              })
              return v
          })
      },
      getOne(){
          console.log('getOne')
          this.getPoints()
          .then(p => {
              this.points.push.apply(this.points, p._items)
              console.log(p)

          })
          .catch(e => {
              console.log(e)
          })
      },
      setPoints(){

      }

  },
  computed: {
      where(){
          let coords = [this.circle.lng, this.circle.lat]
          let data = {
              location: {
                  $near: {
                      $geometry: {
                          type: "Point",
                          coordinates: coords
                      },
                      $maxDistance: this.circle.rad
                  }
              }
          }
          return JSON.stringify(data)
      },

  }

}
</script>

<style lang="scss">
    #map {
        height: 600px;
        width: 100%;
    }
</style>
