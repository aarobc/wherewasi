MONGO_HOST="mongo"
MONGO_PORT=27017
MONGO_DBNAME="history"
ALLOW_UNKNOWN=True
PAGINATION_LIMIT=100
PAGINATION_DEFAULT=100
# QUERY_MAX_RESULTS=100

X_DOMAINS='*'

DOMAIN = {
    'mapped': {
        'allowed_filters' : ['*'],
        'sorting': True,
        'resource_methods': ['GET', 'POST'],


    }
}

first = {
    'datasource': {
        'aggregation': {
            'pipeline': [
               { '$match':{
                    'location': {
                        '$near': {
                            '$geometry': {
                                'type': "Point",
                                'coordinates': ["$lng", "$lat"]
                            },
                            '$maxDistance': this.circle.getRadius()
                        }
                    }
                }},
                {"$group": {

                }}

            ]
        }
    }
}
