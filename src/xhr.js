'use strict';
export default (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      if(this.status === 200) {
        resolve(this.responseText);
      } else {
        reject(`XHR: Error ${this.status}: ${this.statusText} (${url})`);
      }
    })
    xhr.open('GET', url, true);
    xhr.responseType = "text";
    xhr.send();
  });
};
