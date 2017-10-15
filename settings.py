MONGO_HOST="mongo"
MONGO_PORT=27017
MONGO_DBNAME="history"
ALLOW_UNKNOWN=True
PAGINATION_LIMIT=100
PAGINATION_DEFAULT=100
SCHEMA_ENDPOINT="first"

X_DOMAINS='*'
XML=False
X_HEADERS=['X-PINGOTHER', 'Content-Type', 'If-Match']

RESOURCE_METHODS = ['GET', 'POST', 'DELETE']
ITEM_METHODS = ['GET', 'PATCH', 'PUT', 'DELETE']
DOMAIN = {
    'mapped': {
        'allowed_filters' : ['*'],
        'sorting': True,
        'resource_methods': ['GET', 'POST'],
    },
    'days': {
        'allowed_filters' : ['*'],
        'sorting': True,
        'resource_methods': ['GET', 'POST', 'DELETE'],
    }
}

# first = {
#     'datasource': {
#         'source': 'mapped',
#         'aggregation': {
#             'pipeline': [
#                 {"$match": "$where$"}
#             ]
#         }
#     }
# }
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
