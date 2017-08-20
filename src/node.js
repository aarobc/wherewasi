let each        = require('mongo-each')
let Promise     = require('bluebird')
let mongoClient = Promise.promisifyAll(require('mongodb')).MongoClient

let dbStr = 'mongodb://mongo:27017/history'



class Modifer{

    constructor(db){
        this.db = db
        this.oldDB = 'points'
        this.newDB = 'mapped'
    }


    remap(){
        return new Promise((resolve, reject) => {

            let cursor = this.db.collection(this.oldDB).find()

            each(cursor, (point, callb) => {

                point.timestamp = Number(point.timestampMs)
                let lat = point.latitudeE7 / 10000000
                let lon = point.longitudeE7 / 10000000

                point.location = [lon, lat]

                delete point.latitudeE7
                delete point.longitudeE7
                delete point._id
                delete point.timestampMs

                this.db.collection(this.newDB).insertAsync(point)
                .then(res => {
                    callb()
                })

            },
            {
                concurrency: 1000,
            }, (err) => {
                console.log(err)
                // resolve(this)
                resolve("done?")
            })
        })
    }

    process(){
        // this.db.collection(this.newDB).createIndex({timestamp: "timestamp"})
        return this.db.collection(this.newDB).createIndexAsync({location: "2dsphere"})
        .then(this.remap.bind(this))
    }
}

runScan = () => {
    return mongoClient.connectAsync(dbStr)
    .then(db => {
        console.log('connected')
        let m = new Modifer(db)
        return m.process()
    })
    .then((pt) => {
        console.log(pt)
        console.log("done")
        process.exit()
    })
    .catch(e => {
        console.log(e)
    })
}

runScan()
