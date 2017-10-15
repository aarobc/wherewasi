<template>
    <b-table :items="resTable" :fields="resTableFields">
        <template slot="delete" scope="data">
            <b-button @click="rm(data)">X</b-button>
        </template>
    </b-table>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
export default {
    data(){
        return {
            url:'http://localhost:5000/',
            report: [],
        }
    },
    computed: {
      total(){
          return this.report.reduce((carry, item) => {
              return carry.add(item.duration)
          }, moment.duration())
      },
      resTable(){
          return this.report.map(item => {
              return{
                  Day: moment(item.day).format('d MMM YYYY'),
                  Start: item.start,
                  End: item.end,
                  Duration: moment.duration(item.duration).format('h [hrs], m [min]'),
                  MaxAlt: item.maxAlt,
                  _id: item._id,
                  _etag: item._etag,
              }
          })
          return []
      },
      resTableFields(){
          let fields = []
          try{
              fields = Object.keys(this.resTable[0])
              fields.push('delete')
              _.remove(fields, item => item == '_id' || item == '_etag')
          }
          catch(e) {
              return []
          }

          return fields.reduce((stay, item) => {
              stay[item] = {
                label: item,
                sortable: true,
              }
              return stay
          },{})
              // return fields
      },

    },
    mounted(){
        this.getData()
    },
    methods: {
        getData(){

          axios.get(this.url + 'days')
          .then(out => {
              this.report = out.data._items
          })
        },
        rm(row){
            let conf = {headers: {
                'If-Match': row.item._etag,
            }}
            axios.delete(this.url + 'days/' + row.item._id, conf)
            .then(resp => {
                console.log(resp)
                setTimeout(this.getData, 300)
                // this.getData()
            })
            // this.report.splice(row.index, 1)
        },

    }

}
</script>
