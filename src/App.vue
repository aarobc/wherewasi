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
                <b-button @click="air">Fetch</b-button>
                <b-button @click="addDay">Add</b-button>
                <b-button @click="makeCsv">to CSV</b-button>
                <a :href="csv" ref="dll" target="_blank" download="data.csv">test</a>
                <spinner v-if="loading"></spinner>
            </div>
            <b-table :items="tdata" >
            </b-table>



        </div>
    </div>
    <div class="row">
        <div class="col">
            <timeline :range.sync="range" :marker.sync="marker" :points="points" :day="day" v-if="!loading && points.length"></timeline>
        </div>
    </div>
    <div class="row">
        <div class="timeline">
            <b-table :items="resTable" :fields="resTableFields">
                <template slot="delete" scope="data">
                    <b-button @click="rm(data)">X</b-button>
                </template>
            </b-table>
        </div>
    </div>
  </div>
</template>

<script>
import dateCrap from "./dateCrap.vue"
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
require ('moment-duration-format')
import timeline from "./timeline.vue"
import Spinner from 'vue-simple-spinner'
import _ from 'lodash'
import axios from 'axios'

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
      csv: "",
      allInRange: false,
      url:'http://localhost:5000/',
      loading: false,
      marker: {},
      day: new Date(),
      range:{
          start: moment().startOf('day').add(16, 'hours').toDate(),
          end: moment().startOf('day').add(21, 'hours').toDate(),
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
      rm(row){
        this.report.splice(row.index, 1)
      },
      makeCsv(){
          let keys = Object.keys(this.resTable[0])
          let h = keys.join(',')
          console.log(h)
          let lineArray = ["data:text/csv;charset=utf-8," + h];
          this.resTable.forEach((v, index) => {
              let infoArray = Object.values(v).map(JSON.stringify)
              let line = infoArray.join(",")
              lineArray.push(line)
          })
          let csvContent = lineArray.join("\n")
          this.csv = encodeURI(csvContent)
          console.log(this.$refs.dll)
          // this.$refs.dll.click()
      },
      addDay(){
          console.log(this.fd)
          axios.post(this.url + 'days', this.fd)
          .then(out => {
              console.log(out)
          })
        this.report.push(this.fd)
      },
      air(){
        this.allInRange = true
        this.points = []
        this.getDay()
        this.allInRange = false
      },

      reporter(d){

          let r = {
              date:d.date,
              time:d.date,
          }
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
              // console.log(p)
              this.loading = false

          })
          .catch(e => {
              // console.log(e)
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
              // console.log("recurse?")
              // console.log(href)
              if(this.points.length > this.limit){
                  console.log("more than 1k records")
                  return points
              }

              return this.recurse(this.url + href)
          })
          .catch(e => {
              // console.log(e)
              return this.points
          })

      },
      getDay(){
          this.loading = true
          // console.log('getDay')
          this.points = []
          this.recurse()
          .then(points => {
              this.points = this.points.map(item => {
                  item.created = moment(item.created).local()
                  item.unix = moment(item.created).local().unix()
                    return item
              })
              // this.points.sort((a, b) => {
              //     return a.unix < b.unix
              // })
              this.points = _.sortBy(this.points, ['unix'])

              // this.points.sort((a, b) => moment(a).isBefore(b))
              this.loading = false
              // console.log(points)
              // return points.map(this.addPoints)
          })
          .catch(e => {
              this.loading = false
              // console.log(e)
          })
      },
      searchNext(way){
          this.loading = true

          let sort = ""
          let det = {}
          let v = moment(this.day).add(way, 'days').startOf('day').toDate().toUTCString()
          // console.log(v)

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
          // console.log(url)
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
              // console.log("nope")
          })
          .catch(e => {
              this.loading = false
          })
      },
      where(d){

          // let date = d || this.day.toLocaleDateString('en-US')
          let created = {
              $gte: this.day.toUTCString(),
              $lt: moment(this.day).endOf('day').toDate().toUTCString()
          }

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
                created: created
              // date:  this.day.toLocaleDateString('en-US')
          }

          if(this.allInRange){
              delete data.location
              data.created = {
                  $gte: moment(this.range.start).local().toDate().toUTCString(),
                  $lt: moment(this.range.end).local().toDate().toUTCString()
              }
          }

          let com = Object.assign(data, d)
          Object.keys(com).forEach((key) => (com[key] == null) && delete com[key])
          // console.log(com)
          return JSON.stringify(com)
      },
  },
  watch: {
      day(v){
          let d = moment(v).local().startOf('day')
          console.log(d)
          let start = moment(this.range.start).startOf('day').diff(this.range.start)
          let end = moment(this.range.end).startOf('day').diff(this.range.end)
          // TODO: complain about moment durations in this situation
          let sd = moment.duration(Math.abs(start))
          let ed = moment.duration(Math.abs(end))


          this.range.start = d.clone().add(sd).local().toDate()
          this.range.end = d.clone().add(ed).local().toDate()
          // this.getOne()
          this.getDay()
      }

  },
  computed: {
      hasMarker(){
          return _.has(this.marker, 'position')
      },
      plines(){
          return this.points.map(p => p.position)
      },
      duration(){
          return moment.duration(moment(this.range.start).diff(this.range.end))
      },
      total(){
          return this.report.reduce((carry, item) => {
              return carry.add(item.duration)
          }, moment.duration())
      },
      fd(){
          return {
              day: this.day,
              start: moment(this.range.start).format("h:mm a"),
              end: moment(this.range.end).format("h:mm a"),
              maxAlt: this.maxAlt,
              duration: moment.duration(moment(this.range.end).diff(this.range.start)),
              total: this.total.format("h:mm a"),
          }
      },
      tdata(){
          let res = [
              {Param: 'Points', value: this.points.length},
              {Param: 'Day', value: moment(this.day).format('dddd')},
              {Param: 'Start', value: this.fd.start},
              {Param: 'End', value: this.fd.end},
              // {Param: 'Max Altitude', value: this.maxAlt},
              {Param: 'Duration', value: this.fd.duration.format('h [hrs], m [min]')},
              {Param: 'Total', value: moment.duration(this.total).format('h [hrs], m [min]')},
          ]
          if(this.maxAlt){
              res.push({Param: 'Max Altitude', value: this.maxAlt})
          }
          return res
      },
      resTable(){
          return this.report.map(item => {
              return{
                  Day: moment(item.day).format('d MMM YYYY'),
                  Start: item.start,
                  End: item.end,
                  Duration: moment.duration(item.duration).format('h [hrs], m [min]'),
                  MaxAlt: item.maxAlt,
              }
          })
          return []
      },
      resTableFields(){
          let fields = []
          try{
              fields = Object.keys(this.resTable[0])
              fields.push('delete')
          }
          catch(e) {
              return []
          }
              return fields
      },
      maxAlt(){
          // let s = this.points.concat().
          let m = _.maxBy(this.points, o => o.altitude)
          if(m){
              return Math.round(m.altitude * 3.2808)
          }
          return undefined
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
