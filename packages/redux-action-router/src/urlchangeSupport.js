/* global window */
import urlMapper from 'url-mapper';

function upgradeHistory() {
  window.history.pushState = (f => function pushState() {
    const ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushState'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
  })(window.history.pushState);

  window.history.replaceState = (f => function replaceState() {
    const ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('replaceState'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
  })(window.history.replaceState);
}

let isHistoryUpgraded = false;
export default function init(onChange, urlActionMap) {

  if (!isHistoryUpgraded) {
    upgradeHistory();
    isHistoryUpgraded = true;
  }

  window.addEventListener('popstate', onPopState);
  window.addEventListener('locationchange', onLocationChange);

  function onLocationChange() {
    processUrl();
  }

  function onPopState() {
    window.dispatchEvent(new Event('locationchange'))
  }

  // TODO: Still reload page when user clicks on <a/> tag
  // const mapper = urlMapper({});
  // function onClick({ target }) {
  //   if (target && target.getAttribute) {
  //     const url = target.getAttribute('href');
  //     if (url) {
  //       const clickCurrentUrl = url === window.location.pathname;
  //       if (clickCurrentUrl) {
  //         processUrl();
  //       } else {
  //         const [path] = url.substr(1).split('?');
  //         const matched = mapper.map(path, urlActionMap);
  //         if (matched) {
  //           window.history.pushState(null, '', url.substr(1));
  //           processUrl();
  //         }
  //       }
  //     }
  //   }
  // }

  function processUrl() {
    return onChange(pathAndParamsOnly(window.location.href));
  }

  function cleanUp() {
    window.removeEventListener('popstate', onPopState);
    window.removeEventListener('locationchange', onLocationChange);
  }

  return {
    setUrl(url) {
      window.history.pushState(null, '', url);
    },
    processUrl,
    cleanUp,
  };
}


export function pathAndParamsOnly(url) {
  return url.substr(window.location.href.indexOf(window.location.pathname));
}