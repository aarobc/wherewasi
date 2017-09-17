<template>
    <div id="app" class="container">
        <b-button-toolbar>
            <b-button-group>
                <b-btn
                    @click="mvDate(-1)"
                    >&lsaquo;</b-btn>
            </b-button-group>
            <b-input-group>
                <datepicker v-model="day"></datepicker>
            </b-input-group>
            <b-button-group>
                <b-btn
                    @click="mvDate(1)"

                    >&rsaquo;</b-btn>
            </b-button-group>
        </b-button-toolbar>
    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'

export default {
  components:{
      Datepicker
  },
  data () {
    return {
      day: new Date(),
    }
  },
  props: {
      value:{}
  },
  mounted(){
      this.day = this.value
  },
  watch: {
      value (value){
          this.day = value
          // this.$emit('input', value)
      }
  },
  methods: {
      mvDate(way){
          // this.day.setDate(this.day.getDate() + way)
          // this.day = moment(this.day).add(way, 'days').toDate()
          // this.$emit('input', this.day)
          this.$emit('move_search', way)

      }
  }
}

</script>

<style lang="scss">
</style>
