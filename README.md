# basic-pwa-demo
it's the simplest pwa demo
including a https server and the certification files
basic-pwa-demo

1. add the certificate to broswer trust manually (based on your platform and broswer,for macos and chrome,just add the mydomain.crt to system keyChain and make it trustable )
3. npm install
4. node server.js


you can also create your own certificate with file mydomain.cnf and execute
`openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout mydomain.key -out mydomain.crt -config myopenssl.cnf`




 ## push is a more complex process, so it should have a unique branch 

