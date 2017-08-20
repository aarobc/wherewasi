MONGO_HOST="mongo"
MONGO_PORT=27017
MONGO_DBNAME="history"
ALLOW_UNKNOWN=True

X_DOMAINS='*'

DOMAIN = {
    'mapped': {
        'allowed_filters' : ['*'],
        'sorting': True,
        'resource_methods': ['GET', 'POST'],


    }
}
