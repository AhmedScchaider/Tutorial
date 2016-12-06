if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Pendaftaran berhasil
      console.log('Pendaftaran ServiceWorker berhasil : ', registration.scope);
    }).catch(function(err) {
      // Pendaftaran gagal
      console.log('Pendaftaran ServiceWorker gagal: ', err);
    });
  });
}
