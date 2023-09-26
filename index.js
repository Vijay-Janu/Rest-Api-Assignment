let SERVER_NAME = 'user-api'
let PORT = 5000;
let HOST = '127.0.0.1';

let getTotalCounter = 0;
let postTotalCounter = 0;

let errors = require('restify-errors');
let restify = require('restify')

  // Get a persistence engine for the products
  , productsSave = require('save')('products')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('**** Resources: ****')
  console.log('********************')
  console.log(' /products')
  console.log(' /products/:id')  
})
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Get all products in the system
server.get('/products', function (req, res, next) {
  console.log('GET /products');
  //console.log(routeRequestCounts);
  getTotalCounter++;
  console.log('GET:' + getTotalCounter, 'POST:' + postTotalCounter);

  // Find every entity within the given collection
  productsSave.find({}, function (error, products) {

    // Return all of the products in the system
    res.send(products)
  })
})
// Get a single product by their user id
server.get('/products/:id', function (req, res, next) {
  console.log('GET /products/:id params=>' + JSON.stringify(req.params));

  // Find a single product by their id within save
  productsSave.findOne({ _id: req.params.id }, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    if (product) {
      // Send the product if no issues
      res.send(product)
    } else {
      // Send 404 header if the user doesn't exist
      res.send(404)
    }
  })
})

// Create a new product
server.post('/products', function (req, res, next) {
  console.log('POST /products params=>' + JSON.stringify(req.params));
  console.log('POST /products body=>' + JSON.stringify(req.body));


  let newProduct = {
    productname: req.body.productname, 
    price: req.body.price,
    quantity: req.body.quantity
  }

  // Create the product using the persistence engine
  productsSave.create( newProduct, function (error, product) {
  //totalCount++;
  //console.log('totalCount:' + totalCount);
  // console.log(routeRequestCounts);
  postTotalCounter++;
  console.log('GET:' + getTotalCounter, 'POST:' + postTotalCounter);

// If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    // Send the product if no issues
    res.send(201, product)
  })
})

// Update a product by their id
server.put('/products/:id', function (req, res, next) {
  console.log('POST /products params=>' + JSON.stringify(req.params));
  console.log('POST /products body=>' + JSON.stringify(req.body));
  
  let newProduct = {
    _id: req.body.id,
    productname: req.body.productname, 
    price: req.body.price,
    quantity: req.body.price
  }
  
  // Update the product with the persistence engine
  productsSave.update(newProduct, function (error, product) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
})// Delete product with the given id
server.del('/products', function (req, res, next) {
  console.log('DELETE /products');

  productsSave.deleteMany({}, function (error) {
    
    if (error) return next(new Error(JSON.stringify(error.errors)))

    //Send a 204 response
    res.send(204)
  

  })

  
})
