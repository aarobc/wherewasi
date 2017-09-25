
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
      }
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
              moveable: false,
              // showCustomTime: true
              // showCurrentTime: true
          }
      },
      dsray(){

          // let i = 2
          let d = this.points.map(v => {
              return {
                  // id: i++,
                  x: moment(v.created).local(),
                  y: v.altitude*3.2808 || 4500,
                  group: 0,
              }
          })
          return d
      },
  },
  mounted(){
   // create a data set
    let start = moment(this.options.start).add(2, 'hours')
    let end = moment(this.options.end).subtract(5, 'hours')

    let data = {
        group: 1,
        x: start.toDate(),
        y: 0,
        end: end.toDate(),
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

  // timeline.addCustomTime(start, 'a')
  // timeline.addCustomTime(end, 'b')
  timeline.on('contextmenu',  props => {
      console.log(props)
      props.event.preventDefault()
      try{
          let ct = timeline.getCustomTime('a')
          console.log(ct)
      }
      catch(e){
          console.log('Right click!')
          timeline.addCustomTime(start, 'a')
      }
  })

  // add event listener
  timeline.on('timechange',event => {


      let item = dv.get(1);
      console.log(item)
      if(event.id == 'a'){
          item.x = moment(event.time)

      }

      // if(event.id == 'b'){
      //     item.end = moment(event.time)
      // }
      dv.update(item)
  })

  // set a custom range from -2 minute to +3 minutes current time
  // timeline.setWindow(this.options.min, this.options.max, {animation: false});
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
</style>
