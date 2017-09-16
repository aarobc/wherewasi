<template>
    <div>
        bacon
        <div ref="tml" id="tml">
        </div>
    </div>
</template>

<script>

import vis from "vis"
import "vis/dist/vis.css"

let items = new vis.DataSet([
    {id: 1, content: 'item 1', start: '2013-04-20'},
    {id: 2, content: 'item 2', start: '2013-04-14'},
    {id: 3, content: 'item 3', start: '2013-04-18'},
    {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
    {id: 5, content: 'item 5', start: '2013-04-25'},
    {id: 6, content: 'item 6', start: '2013-04-27'}
])

let timeline = {}
export default {
  // name: 'timeline',
  data () {
    return {
      timeline: {},
      values: {},
      options: {
          start: new Date('December 17, 1995 03:24:00'),
          end: new Date()
      },
    }
  },
  mounted(){
      console.log("mounted")
      // this.values = new vis.Dataset([])
      // let tml = document.querySelector('#tml')
      setTimeout(() =>{
          console.log("start vis")
          console.log(this.$refs.tml)
          let b = new vis.Timeline(this.$refs.tml, items, {})
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
