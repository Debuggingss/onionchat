# onionchat
Simple Socket.IO Chat Room

I took https://github.com/souvik-pl/chatRoom as a base and it helped a lot!

Note: This is a WIP project and I will update it pretty frequently.

Requirements:
- Node.js
- express
- socket.io

Ability to add unlimited commands very easily.

## For Tor:

If you are using this over Tor I highly suggest you to route it through nginx reverse proxy.
Note: I am not a Tor expert myself but this looks much safer than just setting the app's port to the hidden service port.

(If you find any issues in the nginx config down below, please let me know.)

You will need to add this to your `server` block in your nginx sites-enabled config:
```
location /chat {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

location /socket.io/ {
    proxy_pass http://localhost:3000/socket.io/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```
