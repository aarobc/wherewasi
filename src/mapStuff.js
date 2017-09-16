class MapStuff {

  constructor(map){
    this.gmap = map
    this.circle = false
    this.url = 'http://localhost:5000/'
    this.next = false
    this.markers = []
    this.limit = 1001
  }

  where(){
    let coords = [this.circle.center.lng(), this.circle.center.lat()]
    let data = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coords
          },
          $maxDistance: this.circle.getRadius()
        }
      }
    }


    return JSON.stringify(data)
  }


  recurse(points = [], addr = false){
    return this.getPoints(addr)
    .then(dat => {
      points.push.apply(points, dat._items)
      return dat
    })
    .then(dat => {
        let href = dat._links.next.href
        if(points.length > this.limit){
          console.log("more than 1k records")
          return points
        }

        return this.recurse(points, this.url + href)
    })
    .catch(e => {
        return points
    })

  }

  getOne(){
    this.getPoints()
    .then(this.groupDate)
    .then(points => {
      console.log(points)
      return points.map(this.addPoints.bind(this))
    })
    .catch(e => {
      console.log(e)
    })
  }

  getMost(){
    this.recurse()
    .then(this.groupDate)
    .then(points => {
      console.log(points)
      return points.map(this.addPoints.bind(this))
    })
    .catch(e => {
      console.log(e)
    })
  }

  groupDate(all){
   // all.sort((a,b) => {
   //    return a.created > b.created
   // })
   let first = all[0]

   return all.filter(point => {
    return first.date == point.date
   })
  }

  getPoints(addr = false){


    // 2011
    // let url = addr || this.url + "mapped?where=" + this.where()
    let url = addr || this.url + "mapped?where=" + this.where() + "&sort=created"
    // let url = addr || `${this.url}points/mapped?aggregate={"$where":${this.where()}}`
    // let url = addr || `${this.url}first?aggregate={"$where":{"altitude":1372}}`
    // console.log(url)
    // console.log("")

    return fetch(url)
    .then(resp => {
      return resp.json()
    })
    // .catch(e => {
    //   console.log(e)
    //   return
    // })
  }



  addPoints(xy){

    let where = {lat: xy.location[1], lng: xy.location[0]}
    let marker = new google.maps.Marker({
      position: where,
      map: this.gmap
    });
    this.markers.push(marker)

    this.gmap.panTo(where)
    return "12"
  }

  clearMarkers(){
    this.markers.map(mark => {
      mark.visible = false
      mark.setMap(null)
    })
  }

  goog(){
    //Add listener
    google.maps.event.addListener(this.gmap, "rightclick", event => {
      console.log('rightclick')
      var latitude = event.latLng.lat()
      var longitude = event.latLng.lng()

      if(this.circle){
        return
      }

      this.circle = new google.maps.Circle({
        map: this.gmap,
        radius: 100,
        center: event.latLng,
        fillColor: '#777',
        fillOpacity: 0.1,
        strokeColor: '#AA0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        draggable: true,
        editable: true
      });


      google.maps.event.addListener(this.circle, 'radius_changed', () => {
        // console.log(this.circle)
        // console.log(this.circle.getRadius())
        this.clearMarkers()
        this.getIt()
        // do the thing here
      });

      google.maps.event.addListener(this.circle, 'dragend', () => {
        // console.log("dragend")
        this.clearMarkers()
        this.getIt()
      });

    })
  }
}

module.exports = {MapStuff: MapStuff}

