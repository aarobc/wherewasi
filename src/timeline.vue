
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
        ct: false,
        c: "",
        d:{
            time: ""
        }
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
      dsray(){

          // let i = 2
          return this.points.map(v => {
              return {
                  // id: i++,
                  x: moment(v.created).local(),
                  y: v.altitude*3.2808 || 4500,
                  group: 0,
                  position: v.position,
              }
          })
      },
      closest(){

          if(!this.c){
            return null
          }
          // let copy = JSON.parse(JSON.stringify(this.dsray))

          let x = this.c.unix()
          // console.log(x)
          // return null
          // return copy.sort( (a, b) => {
          let v = this.points.sort( (a, b) => {
              let ay = moment(a.created).diff(this.c)
              let be = moment(b.created).diff(this.c)
              console.log(ay)
              return 0
              // return (Math.abs(x - ay)) - (Math.abs(x - be))
          });

          return null
      },
  },
  mounted(){
   // create a data set
    let start = moment(this.options.start).add(16, 'hours')
    let end = moment(this.options.start).add(21, 'hours')

    let data = {
        group: 1,
        x: start.toDate(),
        y: 4500,
        end: end.toDate(),
        style: "bar"
    }
    let tot = this.dsray
    tot.push(data)

    console.log(tot)
  dv = new vis.DataSet(tot)

  // specify options

  // create a timeline
  timeline = new vis.Graph2d(this.$refs.tml, dv, this.options)
  // timeline = new vis.Timeline(this.$refs.tml, dv, this.options)
  // timeline.setItems(d2)
  // timeline = new vis.Timeline(this.$refs.tml, data, {})

  timeline.addCustomTime(start, 'a')
  timeline.addCustomTime(end, 'b')

  timeline.on('contextmenu',  props => {
      // console.log("event:")
      // console.log(props)

      props.event.preventDefault()
      if(this.ct){
          let ct = timeline.setCustomTime(props.time, 'c')
          // console.log("custom time: ")
          // console.log(ct)

      }
      else{
          timeline.addCustomTime(props.time, 'c')
          this.ct = true
      }
      console.log("bacon")
  })

  // add event listener
  timeline.on('timechange', this.timeChange)

  // set a custom range from -2 minute to +3 minutes current time
  // timeline.setWindow(this.options.min, this.options.max, {animation: false});
  },
  methods:{
      copy(val){
        return JSON.parse(JSON.stringify(val))
      },
      timeChange(event){

          let n = this.copy(this.range)
          let o = moment(event.time)
          if(event.id == 'a'){
              n.start = o
              this.$emit('update:range', n)

          }

          if(event.id == 'b'){
              n.end = o
              this.$emit('update:range', n)

          }

          if(event.id == 'c'){
              this.c = o
          }

      }
  },
  watch: {
      c: function(val, old){
          this.$emit('update:marker', this.closest)
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
