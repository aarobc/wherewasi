class MapStuff {

  constructor(map){
    this.gmap = map
    this.circle = false
    this.url = 'http://localhost:5000/mapped'
    this.next = false
    this.markers = []
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

  // function initMap(){
  //   map = new google.maps.Map(document.getElementById('map'), {
  //     zoom: 9,
  //     center: {lat: 40.455307, lng: -111.923218}
  //   })
  // }


  getIt(){

    // let url = next || this.url '/mapped?where=' + this.where()
    // console.log(url)
    //
    // return fetch(url)
    // .then(resp => {
    //   return resp.json()
    // })
    // .then(dat => {
    //   // see if next value exists
    //   let def = false
    //   try{
    //     let def = dat._links.next.href
    //   }
    //   catch(e){
    //     console.log("no more")
    //   }
    //   console.log("try to recurse")
    //   this.getIt(def)
      // if(def){
      //   return getIt(def)
      // }
      return dat._items.map(this.addPoints.bind(this))

    // })
  }

  getPoints(next = false){


    let url = next || this.url '/mapped?where=' + this.where()
    console.log(url)

    return fetch(url)
    .then(resp => {
      return resp.json()
    })
    .then(dat => {
      // see if next value exists
      let def = false
      try{
        let def = dat._links.next.href
      }
      catch(e){
        console.log("no more")
      }
      console.log("try to recurse")
      this.getIt(def)


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
