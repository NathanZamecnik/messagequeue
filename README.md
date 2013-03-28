messagequeue
============

Small node program that can be used to demonstrate MongoDB findAndModify() as well as putting a server under heavy load until indexes are built.

To Use:
You only really need to use index.js.  The others will simply double or triple the load if you want to really go for it.  The index file can be modified to listen on a different port (each index file wil have to have the node server listen on different ports) and also change the mongod port you are connecting to.  In addition, you can connect to a replica set (commented out by default) or a single mongod or mongod.  

This little schema actually doesn't shard at this point as there isn't a good shard key.  Either create a dummy, random field or possibly use MongoDB hashed sharding in 2.4?
