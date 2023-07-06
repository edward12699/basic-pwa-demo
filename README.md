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

 1. you may encounter a warn message "Vapid subject points to a localhost web URI, which is unsupported by Apple's push notification server and will result in a BadJwtToken error when sending notifications."
 if using chrome or firefox, you can ignore the warn ,cause it only block safari
besides, the web-push library seems not support APN(the apple's own Push Notification service )
  
  the demo only provides the basic function , you may need improve it to satisfy APN' needs


2. the notification may not send as soon as "res.sendStatus(201);"  it's based on the browser and sometimes may encounter a timeout, it has something to do with your net condition

3. registration.pushManager.subscribe 
  When you call registration.pushManager.subscribe() in the Chrome browser, you are actually asking for user permission to send push notifications to users without opening the browser. During this process, the browser communicates with Google's push server to create an object called a push subscription. （so network is need, ）  
  different browsers may use different push services. For example, Firefox uses Mozilla's autopush service. But regardless of the service used, pushManager.subscribe() works similarly.
  it's a little complex to deal with the difference between browsers, Chrome and Firefox support sending push notifications using VAPID (Voluntary Application Server Recognition) keys, while Safari requires Apple Push Notification Service (APNs).
  if wanna using push cross browsers, the recommended approach is to use a service that supports *multi-platform* push, such as Firebase Cloud Messaging (FCM) or OneSignal and “极光推送” in china;These services all support VAPID and APNs, and provide easy-to-use APIs and SDKs to enable cross-browser push notifications.

  In a production environment, you might need to handle more complex situations, such as handling updates to push subscriptions, dealing with compatibility issues across different browsers, or personalizing push notifications based on user preferences.

  Besides while these multi-platforms push services  handles many compatibility issues, in practice you may still need special handling for specific behavior in certain browsers. For example, you might need to write additional code to handle notification permission prompts for some browsers, or handle specific restrictions on how some browsers display notifications.


  







