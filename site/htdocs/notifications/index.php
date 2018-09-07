
<!doctype html>
<html lang="en-gb">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">


<!--
    https://github.com/firebase/quickstart-js/blob/acbb46f441ac7c216730bc07b7371354702a7000/messaging/index.html
    /-->

<link rel="apple-touch-icon" sizes="180x180" href="/images/icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/images/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/images/icons/favicon-16x16.png">
<link rel="manifest" href="/images/icons/site.webmanifest">
<link rel="shortcut icon" href="/images/icons/favicon.ico">
<meta name="msapplication-config" content="/images/icons/browserconfig.xml">
<meta name="theme-color" content="#212121">

<script src="https://www.gstatic.com/firebasejs/5.4.2/firebase.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.4.2/firebase-app.js"></script>
<!-- Add additional services that you want to use -->
<!--<script src="https://www.gstatic.com/firebasejs/5.4.2/firebase-auth.js"></script> /-->
<!--<script src="https://www.gstatic.com/firebasejs/5.4.2/firebase-database.js"></script> /-->
<!--<script src="https://www.gstatic.com/firebasejs/5.4.2/firebase-firestore.js"></script> /-->
<script src="https://www.gstatic.com/firebasejs/5.4.2/firebase-messaging.js"></script>
<!--<script src="https://www.gstatic.com/firebasejs/5.4.2/firebase-functions.js"></script> /-->

<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCGi9Xke9k_3qiaM06M8Yl9ESqAQ5Hpy4Q",
    authDomain: "autumn-earth-notifications.firebaseapp.com",
    databaseURL: "https://autumn-earth-notifications.firebaseio.com",
    projectId: "autumn-earth-notifications",
    storageBucket: "autumn-earth-notifications.appspot.com",
    messagingSenderId: "32321940455"
  };
  firebase.initializeApp(config);


/*
// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '32321940455'
});
*/


// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();

// Add the public key generated from the console here.
messaging.usePublicVapidKey("BFqxZ4uBZ4k5GQqMz2lnUu4jDUfEdHKQBR76RdqT8S1LLtbsSgOl55bL0vTNl07GON9EjS99xrFk5MymJjps2oA");

 const tokenDivId = 'token_div';
  const permissionDivId = 'permission_div';

  function requestPermission() {
    console.log('Requesting permission...');
    // [START request_permission]
    messaging.requestPermission().then(function() {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // [START_EXCLUDE]
      // In many cases once an app has been granted notification permission, it
      // should update its UI reflecting this.
      resetUI();
      // [END_EXCLUDE]
    }).catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
    // [END request_permission]
  }


// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging.getToken().then(function(currentToken) {
  if (currentToken) {
    sendTokenToServer(currentToken);
    updateUIForPushEnabled(currentToken);
  } else {
    // Show permission request.
    console.log('No Instance ID token available. Request permission to generate one.');
    // Show permission UI.
    updateUIForPushPermissionRequired();
    setTokenSentToServer(false);
  }
}).catch(function(err) {
  console.log('An error occurred while retrieving token. ', err);
  showToken('Error retrieving Instance ID token. ', err);
  setTokenSentToServer(false);
});



var getJSONWithParams = function(url, params, successHandler, errorHandler) {
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('POST', url, true);
    xhr.onreadystatechange = function() {
        var status;
        var data;
        // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
        if (xhr.readyState == 4) { // `DONE`
            status = xhr.status;
            var wasParsedOk = true;
            if (status == 200) {
                try {
                    data = JSON.parse(xhr.responseText);
                } catch (e) {
                    // JSON parse error:
                    wasParsedOk = false;
                    errorHandler && errorHandler(status);
                }
                if (wasParsedOk) {
                    successHandler && successHandler(data);
                }
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);
};




function subscribeTokenToTopic(token, topic) {
  fetch('https://iid.googleapis.com/iid/v1/'+token+'/rel/topics/'+topic, {
    method: 'POST',
    headers: new Headers({
 'Content-Type': 'application/json',
      'Authorization': 'key=AAAAB4aJq-c:APA91bGKYLH_-EGXXeXgFljxf69TAQXSWyE2GLLdv3_SSey2yti_caO3mvLr9n-HrxLb1wrFDIi9o_X3Xjj4kKF_kpdZnOtUCSbvi6ydDo5u7csV7RL5IlQG5I0t1t-lPnKqNlT-e0C2'
    })
  }).then(response => {
    if (response.status < 200 || response.status >= 400) {
      console.log('Error subscribing to topic:'+topic,response);
      //+response.status + ' - ' + response.text()+ ' - '+response.json();
    } else {
    console.log('Subscribed to "'+topic+'"');
  }
  }).catch(error => {
    console.log(error);
  })
}


function addToGeneral() {
// subscribe this token to a topic:
// https://firebase.google.com/docs/cloud-messaging/admin/manage-topic-subscriptions
// https://firebase.google.com/docs/cloud-messaging/js/topic-messaging
    messaging.getToken().then(function(currentToken) {
      if (currentToken) {
        //console.log(currentToken);
        subscribeTokenToTopic(currentToken,'general');
      
/*
var theseParams = {
   'Content-Type': 'application/json',
      'Authorization': 'key=AIzaSyCGi9Xke9k_3qiaM06M8Yl9ESqAQ5Hpy4Q'
}


 getJSONWithParams('https://iid.googleapis.com/iid/v1/'+currentToken+'/rel/topics/topic', JSON.stringify(theseParams), function(data) {
       console.log("worked");
    }, function(status) {
        // try again:
         console.log("NOPE didn't work");
    });
*/






}
  }).catch(function(err) {
    console.log('Unable to retrieve refreshed token ', err);
    showToken('Unable to retrieve refreshed token ', err);
  });

}



// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(function() {
  messaging.getToken().then(function(refreshedToken) {
    console.log('Token refreshed.');
    // Indicate that the new Instance ID token has not yet been sent to the
    // app server.
    setTokenSentToServer(false);
    // Send Instance ID token to app server.
    sendTokenToServer(refreshedToken);
     resetUI();
    // ...
  }).catch(function(err) {
    console.log('Unable to retrieve refreshed token ', err);
    showToken('Unable to retrieve refreshed token ', err);
  });
});


  function deleteToken() {
    // Delete Instance ID token.
    // [START delete_token]
    messaging.getToken().then(function(currentToken) {
      messaging.deleteToken(currentToken).then(function() {
        console.log('Token deleted.');
        setTokenSentToServer(false);
        // [START_EXCLUDE]
        // Once token is deleted update UI.
        resetUI();
        // [END_EXCLUDE]
      }).catch(function(err) {
        console.log('Unable to delete token. ', err);
      });
      // [END delete_token]
    }).catch(function(err) {
      console.log('Error retrieving Instance ID token. ', err);
      showToken('Error retrieving Instance ID token. ', err);
    });
  }

  function resetUI() {
    clearMessages();
    showToken('loading...');
    // [START get_token]
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken().then(function(currentToken) {
      if (currentToken) {
        sendTokenToServer(currentToken);
        updateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        updateUIForPushPermissionRequired();
        setTokenSentToServer(false);
      }
    }).catch(function(err) {
      console.log('An error occurred while retrieving token. ', err);
      showToken('Error retrieving Instance ID token. ', err);
      setTokenSentToServer(false);
    });
    // [END get_token]
  }



  // Add a message to the messages element.
  function appendMessage(payload) {
    const messagesElement = document.querySelector('#messages');
    const dataHeaderELement = document.createElement('h5');
    const dataElement = document.createElement('pre');
    dataElement.style = 'overflow-x:hidden;';
    dataHeaderELement.textContent = 'Received message:';
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderELement);
    messagesElement.appendChild(dataElement);
  }
  // Clear the messages element of all children.
  function clearMessages() {
    const messagesElement = document.querySelector('#messages');
    while (messagesElement.hasChildNodes()) {
      messagesElement.removeChild(messagesElement.lastChild);
    }
  }
  function updateUIForPushEnabled(currentToken) {
    showHideDiv(tokenDivId, true);
    showHideDiv(permissionDivId, false);
    showToken(currentToken);
  }
  function updateUIForPushPermissionRequired() {
    showHideDiv(tokenDivId, false);
    showHideDiv(permissionDivId, true);
  }


  function showToken(currentToken) {
    // Show token in console and UI.
    var tokenElement = document.querySelector('#token');
    tokenElement.textContent = currentToken;
  }


  // Send the Instance ID token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
  function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
      console.log('Sending token to server...');
      // TODO(developer): Send the current token to your server.
      setTokenSentToServer(true);
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
    }
  }

  function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
  }
  function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
  }


// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.setBackgroundMessageHandler` handler.
messaging.onMessage(function(payload) {
  console.log('Message received. ', payload);
   appendMessage(payload);
  // ...
});


  function showHideDiv(divId, show) {
    const div = document.querySelector('#' + divId);
    if (show) {
      div.style = 'display: visible';
    } else {
      div.style = 'display: none';
    }
  }

/*
// service worker:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceWorker.min.js', {
    updateViaCache: 'imports',
    scope: '/'
  });
}
*/

</script>
</head>
<body>
  <style>
  h1,h2,h3,h4,h5,h6,p,button,a {
    font-family: arial, helvetica, sans-serif;
  }
  pre {
    background:#cecece;
  }
  </style>

<h2>Notifications</h2>
<h3 id="testing">Checking</h3>
<script>
if ('serviceWorker' in navigator && 'PushManager' in window) {
document.getElementById('testing').innerHTML = 'got it';
} else {
document.getElementById('testing').innerHTML = 'NOT got it';
}
</script>


  <div id="token_div" style="display: none;">
            <h4>Instance ID Token</h4>
            <p id="token" style="word-break: break-all;"></p>
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                    onclick="deleteToken()">Delete Token</button>
          </div>
          <!-- div to display the UI to allow the request for permission to
               notify the user. This is shown if the app has not yet been
               granted permission to notify. -->
          <div id="permission_div" style="display: none;">
            <h4>Needs Permission</h4>
            <p id="token"></p>
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                    onclick="requestPermission()">Request Permission</button>
          </div>
          <!-- div to display messages received by this app. -->
          <div id="messages"></div>


<button id="addToGeneralButton">Add to General Topic</button>


<p>send to individual with</p>
<code><pre>
  curl -X POST -H "Authorization: key=AAAAB4aJq-c:APA91bGKYLH_-EGXXeXgFljxf69TAQXSWyE2GLLdv3_SSey2yti_caO3mvLr9n-HrxLb1wrFDIi9o_X3Xjj4kKF_kpdZnOtUCSbvi6ydDo5u7csV7RL5IlQG5I0t1t-lPnKqNlT-e0C2" -H "Content-Type: application/json" -d '{
  "notification": {
    "body" : "This is a Firebase Cloud Messaging Topic Notification",
    "title" : "FCM Message",
    "icon": "https://www.autumnearth.com/images/icons/android-chrome-512x512.png"
  },
  "to": "f-4dEUI6_LM:APA91bGl_3f8ki4cZ4WP2OG_OJO7AfGF1VXc07dkW295gD_gjPg8g1TaK5C_atg_lKA3_5Es9JIV3GwtyhS7CpAHNgTBvo_eCLwyWAQ-GcAwxdqp_ATL9waJCvY43LALE8YBDGg85LYz"
}' "https://fcm.googleapis.com/fcm/send"
</pre></code>


<p>or to a whole topic</p>
<code><pre>
curl -X POST -H "Authorization: key=AAAAB4aJq-c:APA91bGKYLH_-EGXXeXgFljxf69TAQXSWyE2GLLdv3_SSey2yti_caO3mvLr9n-HrxLb1wrFDIi9o_X3Xjj4kKF_kpdZnOtUCSbvi6ydDo5u7csV7RL5IlQG5I0t1t-lPnKqNlT-e0C2" -H "Content-Type: application/json" -d '{
  "notification": {
    "body" : "This is a Firebase Cloud Messaging Topic Notification",
    "title" : "FCM Message",
    "icon": "https://www.autumnearth.com/images/icons/android-chrome-512x512.png"
  },
  "to": "/topics/general"
}' "https://fcm.googleapis.com/fcm/send"
  </pre></code>


<p>https://stackoverflow.com/questions/48965469/which-token-is-needed-to-send-push-notifications-through-post</p>


<script>
document.getElementById('addToGeneralButton').onclick = addToGeneral;
</script>

    </body>

</html>


