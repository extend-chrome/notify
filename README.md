# Bumble Notify

Send notifications in Chrome Extensions with ease.

This library will derive some notification properties from the manifest.

# Usage

```javascript
notify.create({
  message: 'Click here for awesomeness.',
  onClick: awesomeFn,
  buttons: [
    { title: 'OK', onClick: awesomeFn },
    { title: 'No way', onClick: lameFn },
  ],
})

function awesomeFn() {
  // do something awesome
}

function lameFn() {
  // do something else
}
```
