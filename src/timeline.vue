
<template>
    <div>
        <div ref="tml" id="tml">
        </div>
    </div>
</template>

<script>

import vis from "vis"
import "vis/dist/vis.css"
import moment from 'moment'

let dv = {}

let timeline = {}
export default {
  // name: 'timeline',
  data () {
    return {
      // localCopy: [],
        ct: false,
        c: 0,
        d:{
            time: ""
        },
        closest: {
        },
        dsray:[],
        time: "",

        // timeline: {},
        // values: {},
      }
  },
  props: {
      points:{
          type: Array,
          required: true
      },
      day:{
          type: Date,
          required: true
      },
      marker:{
          type: Object,
          required: false
      },
      range:{
          type: Object,
          required: false
      },
  },
  computed:{
      options(){
          return {
              format: {
                  minorLabels: {
                      millisecond:'SSS',
                      second:     's',
                      minute:     'h:mm A',
                      hour:       'h:mm A',
                  },
                  majorLabels: {
                      hour:       'ddd D MMMM',
                      weekday:    'MMMM YYYY',
                      day:        'MMMM YYYY',
                      month:      'YYYY',
                  }
              },
              start: moment(this.day).local().startOf('day').toDate(),
              end: moment(this.day).local().endOf('day').toDate(),

              min: moment(this.day).local().startOf('day').toDate(),
              max: moment(this.day).local().endOf('day').toDate(),
              // moveable: false,
              // showCustomTime: true
              // showCurrentTime: true
          }
      },
  },
  created(){
      // console.log(this.points)
    this.dsray = this.toDsray(this.points)
    // console.log(this.dsray)
  },
  mounted(){
   // create a data set
    let start = moment(this.options.start).add(16, 'hours')
    let end = moment(this.options.start).add(21, 'hours')
    // this.localCopy = JSON.parse(JSON.stringify(this.points))

    // let data = {
    //     group: 1,
    //     x: start.toDate(),
    //     y: 4500,
    //     end: end.toDate(),
    //     style: "bar"
    // }
    // this.dsray = this.toDsray()
    // tot.push(data)

    dv = new vis.DataSet(this.dsray)

  // specify options

  // create a timeline
  timeline = new vis.Graph2d(this.$refs.tml, dv, this.options)
  // timeline = new vis.Timeline(this.$refs.tml, dv, this.options)
  // timeline.setItems(d2)
  // timeline = new vis.Timeline(this.$refs.tml, data, {})

  timeline.addCustomTime(start, 'a')
  timeline.addCustomTime(end, 'b')

  timeline.on('contextmenu',  p => {

      p.event.preventDefault()
      if(this.ct){
          let ct = timeline.setCustomTime(p.time, 'c')
          // console.log("custom time: ")
          // console.log(ct)

      }
      else{
          timeline.addCustomTime(p.time, 'c')
          this.ct = true
      }
      this.c = moment(p.time).unix()
      this.$emit('update:marker', this.findClosest(p.time))
  })

  // add event listener
  timeline.on('timechange', this.timeChange)

  // set a custom range from -2 minute to +3 minutes current time
  // timeline.setWindow(this.options.min, this.options.max, {animation: false});
  },
  methods:{
      toDsray(points){
          // annoy workaround because of weird issue with moment and vue getter
          let p = this.copy(points)
          return p.map(v => {
              return {
                  x: moment(v.created).local().toDate(),
                  y: v.altitude * 3.2808 || 4500,
                  group: 0,
                  position: v.position,
              }
          })
      },
      findClosest(v){

          let ux = moment(v).unix()
          let dex = _.sortedIndexBy(this.points, {unix: ux}, 'unix')

                                    // console.log(dex)
                                    // console.log(moment(v).unix())
        if(Math.abs(this.points[dex].unix - ux) > Math.abs(this.points[dex + 1].unix - ux)){
            console.log(dex)
            dex++
            console.log(dex)
            console.log("eeee")
        }
        this.closest = dex
        // this.closest = this.points[dex].position
        return this.points[dex]

          // let prev
          //
          // for(let index in this.points) {
          //
          //     let val = this.points[index]
          //
          //     let value = Math.abs(moment(val.created).diff(v))
          //
          //     if(prev === undefined){
          //         prev = value
          //         continue
          //     }
          //
          //     if(prev < value){
          //         this.closest = this.dsray[index -1].position
          //         return this.points[index -1]
          //     }
          //     prev = value
          //
          // }
          // return null
      },
      copy(val){
        return JSON.parse(JSON.stringify(val))
      },
      fc: _.throttle(function(o){

                  this.c = moment(o).unix()
                  this.$emit('update:marker', this.findClosest(o))
      }, 300),
      timeChange(event){

          let n = this.copy(this.range)
          // let o = moment(event.time).toDate()
          let o = event.time
          if(event.id == 'a'){
              n.start = o
              this.$emit('update:range', n)

          }

          if(event.id == 'b'){
              n.end = o
              this.$emit('update:range', n)

          }

          if(event.id == 'c'){
              this.fc(o)
          }

      }
  },
  watch: {
      closest: function(v){
        console.log(v)
      },
      c: function(v){
        // console.log(v)
      }
  }
}
</script>

<style lang="scss">
    .vis-item {
        border-color: orange;
        background-color: yellow;
    }

    .vis.timeline .item.past {
        filter: alpha(opacity=50);
        opacity: 0.5;
    }

    .b{
        background-color:red;
    }

    .c{
        background-color:green;
    }
</style>
