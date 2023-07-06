# basic-pwa-demo
it's the simplest pwa demo
including a https server and the certification files
basic-pwa-demo

1. add the certificate to broswer trust manually (based on your platform and broswer,for macos and chrome,just add the mydomain.crt to system keyChain and make it trustable )
3. npm install
4. node server.js


you can also create your own certificate with file mydomain.cnf and execute
`openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout mydomain.key -out mydomain.crt -config myopenssl.cnf`



## debugger in pwa
1. better switch button of update on reload in the service worker tab under application (chrome)
2.refer to application -> service worker  (trigger events)
3. refer to application -> background services(record service event trigger)
4. be careful of closing notification(like ‘focus on’)
5. sometimes ,the browser may have something wrong ,like not send or fire events correct, may need reopen it 




## notice
1. the Periodic Background Synchronization is not supported by  many browsers and
i can only guarantee that the code is right, but i haven't seen it triggered by the chrome automatically,only successfully triggered manually









