const kcClientId = document.querySelector('meta[name="kc-client-id"]').content;
const kcRealm = document.querySelector('meta[name="kc-realm"]').content;

if (kcClientId && kcRealm) {
  const kc = new Keycloak({ realm: kcRealm, clientId: kcClientId });

  window.onload = function () {
    kc.init({ messageReceiveTimeout: 100000 }).then(() => {
      if (kc.authenticated) {
        showName();
        document.getElementById("user").style.display = "block";
      } else {
        document.getElementById("anonymous").style.display = "block";
      }
    });
  };

  function showName() {
    const name = kc.idTokenParsed.name || kc.idTokenParsed.preferred_username;
    document.getElementById("name").textContent = `Hello ${name}`;
  }

  function showIdToken() {
    show(kc.idTokenParsed);
  }

  function showAccessToken() {
    show(kc.tokenParsed);
  }

  function updateToken() {
    kc.updateToken(-1).then(() => {
      showIdToken();
      showName();
    });
  }

  function login() {
    kc.login();
  }

  function logout() {
    kc.logout();
  }

  function show(content) {
    if (typeof content === "object") {
      content = JSON.stringify(content, null, 2);
    }
    document.getElementById("content").textContent = content;
  }
}
