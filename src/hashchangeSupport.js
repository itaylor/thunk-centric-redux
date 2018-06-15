/* global window */
let skipNext = 0;
export default function init(onChange) {
  skipNext = 0;
  window.addEventListener('hashchange', onHashChange);
  window.addEventListener('click', onClick);

  function onClick({ target }) {
    if (target && target.getAttribute) {
      const clickCurrentUrl = target.getAttribute('href') === window.location.hash;
      if (clickCurrentUrl) {
        processUrl();
      }
    }
  }

  function onHashChange() {
    if (skipNext) {
      skipNext--;
      return null;
    }
    return processUrl();
  }

  function processUrl() {
    return onChange(hashOnly(window.location.href));
  }

  function cleanUp() {
    window.removeEventListener('hashchange', onHashChange);
    window.removeEventListener('click', onClick);
  }

  return {
    setUrl(url) {
      const loc = window.location.href;
      const newUrl = `${removeHash(loc)}#${hashOnly(url)}`;
      if (newUrl !== loc) {
        skipNext++;
        window.location.href = newUrl;
      }
    },
    processUrl,
    cleanUp,
  };
}


export function hashOnly(url) {
  return url.replace(/.*?#/, '');
}

function removeHash(url) {
  return url.replace(/#.*/, '');
}
