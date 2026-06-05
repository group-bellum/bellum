/* Partner logos are managed here. Update only this list. */
window.partnerLogoItems = [
  { name: "emlakcoin", url: "./assets/images/partners/emlakcoin.jpg", link: "https://www.emlakcoingayrimenkul.com/" },
  { name: "onem classic", url: "./assets/images/partners/onemclassic.jpg", link: "https://www.onemclassic.com/" },
  { name: "lefka", url: "./assets/images/partners/lefka.jpg" , link: "https://lefkadanismanlik.com/" },
  { name: "xxx", url: "./assets/images/partners/xxx.jpg" },
  { name: "xxx", url: "./assets/images/partners/xxx.jpg" },
  { name: "xxx", url: "./assets/images/partners/xxx.jpg" },
  { name: "xxx", url: "./assets/images/partners/xxx.jpg" },
  { name: "xxx", url: "./assets/images/partners/xxx.jpg" },
];

(function () {
  var wrapper = document.getElementById("partnersSwiperWrapper");
  if (!wrapper || !Array.isArray(window.partnerLogoItems)) {
    return;
  }

  var slides = window.partnerLogoItems
    .filter(function (item) {
      return item && item.url;
    })
    .map(function (item, index) {
      var name = item.name || "Partner " + String(index + 1).padStart(2, "0");
      return (
        '<div class="swiper-slide">' +
        '<a href="' + item.link + '" class="partner-card">' +
        '<img src="' + item.url + '" alt="' + name + '" loading="lazy" />' +
        "</a>" +
        "</div>"
      );
    })
    .join("");

  wrapper.innerHTML = slides;
})();
