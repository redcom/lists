var mongo = require('mongodb');
connect = require('connect'),
BSON = mongo.BSONPure;

module.exports = function(app) {

    var mongoUri = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/myList1';
    var database = null;
    var collection = null;
    var dbCollection = 'accounts';
    var AM = {};

    mongo.connect(mongoUri, {},
    dbConnectCallback);

    function dbConnectCallback(error, db) {
        database = db;
        database.addListener('error', handleError);
        database.createCollection(dbCollection, createCollectionCallback);
    };
    function handleError(error) {
        console.log('Error connecting to MongoLab');
    };
    function createCollectionCallback(error, collection) {
        database.collection(dbCollection, collectionCallback);
    };

    function collectionCallback(error, collection) {
        AM.collection = collection;
        // this should run only once to populate initial database
        //populateDB();
    };

    AM.findById = function(req, res) {
        var id = req.params.id;
        AM.collection.findOne({
            '_id': new BSON.ObjectID(id)
        },
        function(err, item) {
            res.send(item);
        });
    };

    AM.findAll = function(req, res) {
        AM.collection.find().toArray(function(err, items) {
            res.send(items);
        });
    };

    AM.loginAccount = function(req, res) {
        var login = req.body;
        loginAccount = { email: login.email, password: login.password };
        AM.collection.findOne(loginAccount, function(err, item) {
            res.send(item);
        });
    };

    AM.addAccount = function(req, res) {
        var account = req.body;
        AM.collection.insert(account, {
            safe: true
        },
        function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    }

    AM.updateAccount = function(req, res) {
        var id = req.params.id;
        var account = req.body;
        delete account._id;
        AM.collection.update({
            '_id': new BSON.ObjectID(id)
        },
        account, {
            safe: true
        },
        function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                res.send(account);
            }
        });
    }

    AM.deleteAccount = function(req, res) {
        var id = req.params.id;
        AM.collection.remove({
            '_id': new BSON.ObjectID(id)
        },
        {
            safe: true
        },
        function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred - ' + err
                });
            } else {
                res.send(req.body);
            }
        });
    }

    /*--------------------------------------------------------------------------------------------------------------------*/
    // Populate database with sample data -- Only used once: the first time the application is started.
    // You'd typically not find this code in a real-life app, since the database would already exist.
    var populateDB = function() {

        var accounts = [{
            email: 'redcom@gmail.com',
            password: 'redcom',
            picture: '',
            role: 'admin'
        },
        {
            email: 'redcom1@gmail.com',
            password: 'redcom1',
            picture: '',
            role: 'admin'
        }];

        AM.collection.insert(accounts, {
            safe: true
        },
        function(err, result) {});

    };

    app.get('/accounts', AM.findAll);
    app.get('/accounts/:id', AM.findById);
    app.post('/accounts', AM.addAccount);
    app.post('/accounts/login', AM.loginAccount);
    app.put('/accounts/:id', AM.updateAccount);
    app.delete('/accounts/:id', AM.deleteAccount);
};

