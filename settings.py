MONGO_HOST="mongo"
MONGO_PORT=27017
MONGO_DBNAME="history"
ALLOW_UNKNOWN=True
PAGINATION_LIMIT=100
PAGINATION_DEFAULT=100
SCHEMA_ENDPOINT="first"

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
        'source': 'mapped',
        'aggregation': {
            'pipeline': [
                {"$match": "$where$"}
            ]
        }
    }
}
# first = {
#     'datasource': {
#         'aggregation': {
#             'pipeline': [
#                 {"$match": "$where$"},
#                 {"$group": {"datee": "$date"}},
#                 {"$sort":{ "$created": -1}}
#             ]
#         }
#     }
# }
