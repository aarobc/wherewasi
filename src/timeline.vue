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
          }
      },
      dsray(){

          return this.points.map(v => {

              return {
                  x: moment(v.created).local(),
                  y: v.altitude*3.2808 || 4500,
                  group: 0,
                  // label: {content: "herpaderp"}
              }
          })
      },
      dv(){
          return new vis.DataSet(this.dsray)
      }
  },
  mounted(){
      let dv = new vis.DataSet(this.dsray)
      console.log("mounted")
      // this.values = new vis.Dataset([])
      setTimeout(() =>{
          console.log("start vis")
          console.log(this.$refs.tml)
          let b = new vis.Graph2d(this.$refs.tml, this.dv, this.options)
      }, 900)
  },

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
</style>
