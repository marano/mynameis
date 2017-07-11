import { throttle, each } from 'lodash';

const callbacks = {};

const onWindowResize = throttle(
  function () {
    _.each(callbacks, function (callback, key) {
      if (callback) {
        callback();
      }
    });
  },
  200,
  { leading: false, trailing: true }
);

window.addEventListener(
  'resize',
  onWindowResize,
  true
);

export default function (key, callback) {
  callbacks[key] = callback;
}
