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

                <gmap-marker v-if="hasMarker"
                    :position="marker.position"
                    >
                </gmap-marker>


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

            <date-crap v-model="day" v-on:move_search="searchNext($event)" ></date-crap>


            <div class="row">
                <b-button @click="getDay">Fetch</b-button>
                <spinner v-if="loading"></spinner>
            </div>
            <b-table :items="tdata"></b-table>



        </div>
    </div>
    <div class="row">
        <div class="col">
            <timeline :range.sync="range" :marker.sync="marker" :points="points" :day="day" v-if="!loading && points.length"></timeline>
        </div>
    </div>
  </div>
</template>

<script>
import dateCrap from "./dateCrap.vue"
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import timeline from "./timeline.vue"
import Spinner from 'vue-simple-spinner'
import _ from 'lodash'

export default {
  name: 'app',
  components:{
      dateCrap,
      Datepicker,
      timeline,
      Spinner,
  },
  data () {
    return {
      url:'http://localhost:5000/',
      loading: false,
      marker: {},
      day: new Date(),
      range:{
          begin: {},
          end: {},
      },
      points: [],
      limit: 1000,
      rad: 400,
      report: [],
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
      updateCenter(e){
          this.circle = {
              lat: e.lat(),
              lng: e.lng()
          }
      },
      getPoints(addr = false){
          let url = addr || this.url + "mapped?where=" + this.where() + "&sort=created"
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
          this.loading = true
          console.log('getOne')
          this.points = []
          this.getPoints()
          .then(p => {
              this.points.push.apply(this.points, p._items)
              console.log(p)
              this.loading = false

          })
          .catch(e => {
              console.log(e)
              this.loading = false
          })
      },
      recurse(addr = false){
          return this.getPoints(addr)
          // .then(dat => {
          //     this.points.push.apply(points, dat._items)
          //     return dat
          // })
          .then(dat => {
              this.points.push.apply(this.points, dat._items)
              let href = dat._links.next.href
              console.log("recurse?")
              console.log(href)
              if(this.points.length > this.limit){
                  console.log("more than 1k records")
                  return points
              }

              return this.recurse(this.url + href)
          })
          .catch(e => {
              console.log(e)
              return this.points
          })

      },
      getDay(){
          this.loading = true
          console.log('getDay')
          this.points = []
          this.recurse()
          .then(points => {
              this.loading = false
              // console.log(points)
              // return points.map(this.addPoints)
          })
          .catch(e => {
              this.loading = false
              console.log(e)
          })
      },
      searchNext(way){
          this.loading = true

          let sort = ""
          let det = {}
          let v = moment(this.day).add(way, 'days').startOf('day').toDate().toUTCString()
          console.log(v)

          if(way > 0){
              det = {$gt: v}
              sort = 'created'
          }
          else{
              det = {$lt: v}
              sort = '-created'
          }

          let q = {date: null, created: det}
          let url = this.url + "mapped?where=" + this.where(q) + "&sort=" + sort
          console.log(url)
          fetch(url)
          .then(out => {
              return out.json()
          })
          .then(p => {
              // console.log(p._items)
              if(p._items.length){
                  this.day = moment(p._items[0].created).startOf('day').toDate()
                  this.loading = false
                  return
              }
              console.log("nope")
          })
          .catch(e => {
              this.loading = false
          })
      },
      where(d){

          // let date = d || this.day.toLocaleDateString('en-US')
          let when = {
              $gte: this.day.toUTCString(),
              $lt: moment(this.day).endOf('day').toDate().toUTCString()
          }
          console.log(when)

          let data = {
              location: {
                  $near: {
                      $geometry: {
                          type: "Point",
                          coordinates: [this.circle.lng, this.circle.lat]
                      },
                      $maxDistance: this.rad
                  }
              },
                created: when
              // date:  this.day.toLocaleDateString('en-US')
          }

          let com = Object.assign(data, d)
          Object.keys(com).forEach((key) => (com[key] == null) && delete com[key])
          return JSON.stringify(com)
      },
  },
  watch: {
      day(v){
          // this.getOne()
          this.getDay()
      }

  },
  computed: {
      hasMarker(){
          return _.has(this.marker, 'position')
      },
      plines(){
          return this.points.sort((p, p2) => p.created > p2.created)
          .map(p => {return p.position})
      },
      tdata(){
          return [
              {Param: 'Points', value: this.points.length},
              {Param: 'Start', value: moment(this.range.start).format("h:mm a")},
              {Param: 'End', value: moment(this.range.end).format("h:mm a")}
          ]
      }
  }

}
</script>

<style lang="scss">
    #map {
        height: 600px;
        width: 100%;
    }
</style>
