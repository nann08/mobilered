/*! coi-serviceworker v0.1.7 - Guido Zuidhof, licensed under MIT */
let co = "cross-origin-opener-policy";
let ce = "cross-origin-embedder-policy";
let kv = "require-corp";
let v = "same-origin";

if (typeof window === "undefined") {
  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

  self.addEventListener("fetch", function (event) {
    if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
      return;
    }

    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 0) {
            return response;
          }

          const newHeaders = new Headers(response.headers);
          newHeaders.set(co, v);
          newHeaders.set(ce, kv);

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
          });
        })
        .catch((e) => console.error(e))
    );
  });
} else {
  if (window.document && !window.document.currentScript) {
      // This part runs in the main window to register the worker
      const s = document.createElement('script');
      s.src = 'coi-serviceworker.js';
      document.head.appendChild(s);
  } else {
    // Register the worker
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("coi-serviceworker.js").then(
            (registration) => {
                console.log("[COI] Service Worker registered. Reloading to apply isolation...");
                if (!window.crossOriginIsolated) {
                     window.location.reload();
                }
            },
            (err) => {
                console.error("[COI] Service Worker registration failed: ", err);
            }
        );
    }
  }
}
