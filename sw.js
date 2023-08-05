const messages = {
  success: "عملیات با موفقیت انجام شد",
  error: " عملیات انجام نشد ",
};
self.addEventListener("install", function (event) {
  console.info("Event: Install");
  checkNetworkState();
});

self.addEventListener("fetch", async function (event) {
  if (!navigator.onLine && event.request.url.includes("barjavand")) {
    let headers = event.request.headers;
    let reqUrl = event.request.url;
    let method = event.request.method;
    Promise.resolve(event.request.text()).then((payload) => {
      saveIntoIndexedDb(reqUrl, payload, headers, method);
    });
  }
});

self.addEventListener("activate", (event) => {
  console.info("Event: Activate");
  event.waitUntil(self.clients.claim());
});

function checkNetworkState() {
  setInterval(function () {
    if (navigator.onLine) {
      sendOfflinePostRequestsToServer();
    }
  }, 3000);
}

async function sendOfflinePostRequestsToServer() {
  let request = indexedDB.open("TrayTrackingPostDB");
  request.onsuccess = function (event) {
    let db = event.target.result;
    let tx = db.transaction("postrequest", "readwrite");
    let store = tx.objectStore("postrequest");
    let allRecords = store.getAll();
    allRecords.onsuccess = function () {
      if (allRecords.result && allRecords.result.length) {
        let records = allRecords.result;
        const request = fetch(records[0].url, {
          method: records[0].method,
          headers: JSON.parse(records[0].headers),
          body: records[0].payload,
        })
        let resp = sendFetchRequestsToServer(
          request,
          records[0].url,
          records[0].payload,
          records[0].headers,
          records[0].name,
          records[0].method,
          records.slice(1)
        );

        for (let i = 0; i < allRecords.result.length; i++)
          store.delete(allRecords.result[i].id);
      }
    };
  };
  request.onupgradeneeded = function (event) {
    let db = event.target.result;
    db.onerror = function (event) {
      console.log("Why didn't you allow my web app to use IndexedDB?!");
    };

    let objectStore;
    if (!db.objectStoreNames.contains("postrequest")) {
      objectStore = db.createObjectStore("postrequest", {
        keyPath: "id",
        autoIncrement: true,
      });
    } else {
      objectStore = db.objectStoreNames.get("postrequest");
    }
  };
}

function saveIntoIndexedDb(url, payload, headers, method) {
  let myRequest = {
    payload: {},
  };
  if (method === "POST" || method === "PUT") {
    jsonPayLoad = JSON.parse(payload);
    myRequest.payload = JSON.stringify(jsonPayLoad);
    myRequest.name = jsonPayLoad.schema.name;
  } else {
    const name = url?.split("?")[1]?.split("&")[0]?.split("=")[1];
    myRequest.name = name;
  }
  myRequest.url = url;
  myRequest.headers = JSON.stringify([...headers]);
  myRequest.method = method;
  let request = indexedDB.open("TrayTrackingPostDB");
  request.onsuccess = function (event) {
    let db = event.target.result;
    let tx = db.transaction("postrequest", "readwrite");
    let store = tx.objectStore("postrequest");
    store.add(myRequest);
  };
}

async function sendFetchRequestsToServer(
  data,
  reqUrl,
  payload,
  headers,
  name,
  method,
  records
) {
  let promise = Promise.resolve(data)
    .then((response) => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: name,
            isDone: true,
            message: messages.success,
          });
        });
      });
      if (records.length) {
        sendFetchRequestsToServer(
          fetch(records[0].url, {
            method: method,
            headers: JSON.parse(records[0].headers),
            body: records[0].payload,
          }),
          records[0].url,
          records[0].payload,
          records.slice(1)
        );
      }
      console.log(response);
      return true;
    })
    .catch((e) => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: name,
            isDone: false,
            message: messages.error,
          });
        });
      });
      saveIntoIndexedDb(reqUrl, payload, headers);
    });
}
