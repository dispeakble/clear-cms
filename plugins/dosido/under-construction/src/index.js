'use strict';

var http = require( "http" ),
  pathUtils = require( "path" ),
  express = require( "express" ),
  app = express(),
  PORT = process.env.public_port || 3000,
  appDir = pathUtils.resolve( __dirname, "public" );

app.use( express.static( appDir ) );

http.createServer( app ).listen( PORT, function() {
  console.log( "Express server listening on port " + PORT );
  console.log( "http://localhost:" + PORT );
} );