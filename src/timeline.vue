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
        timeline: {},
        values: {},
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
              min: moment(this.day),
              max: moment(this.day).endOf('day'),
              moveable: false,
          }
      },
      dsray(){

          let d = this.points.map(v => {
              return {
                  x: moment(v.created).local(),
                  y: v.altitude*3.2808 || 4500,
                  group: 0,
                  // label: {content: "herpaderp"}
              }
          })
          // d.push ({
          //     id: 1,
          //     start: new Date(this.options.min),
          //     end: new Date(this.options.max),
          //     content: 'Dynamic event'
          // })
          return d
      },
  },
  mounted(){
      dv = new vis.DataSet([
          {
          id: 1,
          start: new Date((new Date()).getTime() - 60 * 1000),
          end: new Date(),
          content: 'Dynamic event'
      }
      ])

      var options = {
          showCurrentTime: true
      }
      dv = new vis.DataSet(this.dsray)
      console.log("mounted")
      // this.values = new vis.Dataset([])
      console.log("start vis")
      console.log(this.$refs.tml)

      // let g = new vis.Graph2d(this.$refs.tml, dv, this.options)
      let g = new vis.Graph2d(this.$refs.tml, dv, options)

      g.addCustomTime(new Date())
      g.addCustomTime(moment().endOf('day').toDate())
      // g.addCustomTime(new Date(this.config.min))
      // g.on('click', e => {
      //     console.log(e)
      // })
      //
      // g.on('ondrag', e => {
      //     console.log(e)
      // })
      //
      // g.on('timechange', e => {
      //     console.log(e)
      // })

      // set a custom range from -2 minute to +3 minutes current time
      var start = new Date((new Date()).getTime() - 2 * 60 * 1000);
      var end   = new Date((new Date()).getTime() + 3 * 60 * 1000);
      timeline.setWindow(start, end, {animation: false});


      // add event listener
      g.on('timechange', function (event) {

          // var item = dv.get(1);
          console.log(dv)
          console.log(event)
          // if (event.time > item.start) {
          //     item.end = new Date(event.time);
          //     var now = new Date();
          //     if (event.time < now) {
          //         item.content = "Dynamic event (past)";
          //         item.className = 'past';
          //     }
          //     else if (event.time > now) {
          //         item.content = "Dynamic event (future)";
          //         item.className = 'future';
          //     }
          //     else  {
          //         item.content = "Dynamic event (now)";
          //         item.className = 'now';
          //     }

              // dv.update(item)
          // }
      })
  }

  // computed: {
  //     values: () =>{
  //         return {}
  //     }
  // }

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
