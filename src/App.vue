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

                    <gmap-polyline
                        v-if="plines.length"
                        :path="plines"
                        :editable="false"
                        :draggable="false"
                        :geodesic="true"
                        :options="{geodesic:true, strokeColor:'#FF0000'}"
                    >
                    </gmap-polyline>

            </gmap-map>
        </div>
        <div class="col-4">

            <date-crap v-model="day"></date-crap>

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
import dateCrap from "./dateCrap.vue"
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import timeline from "./timeline.vue"

export default {
  name: 'app',
  components:{
      dateCrap,
      Datepicker,
      timeline
  },
  data () {
    return {
      url:'http://localhost:5000/',
      day: new Date(),
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
          let nv = {
              lat: e.latLng.lat(),
              lng:  e.latLng.lng()
          }
          this.circle = nv
          // this.points.push({position: nv})
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
          this.points = []
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

      },
  },
  watch: {
      day(v){
          this.getOne()
      }

  },
  computed: {
      plines(){
          return this.points.sort((p, p2) => p.created > p2.created)
          .map(p => {return p.position})
      },
      where(){
          let coords = [this.circle.lng, this.circle.lat]
          let data = {
              location: {
                  $near: {
                      $geometry: {
                          type: "Point",
                          coordinates: coords
                      },
                      $maxDistance: this.rad
                  }
              },
              date: this.day.toLocaleDateString('en-US')
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
