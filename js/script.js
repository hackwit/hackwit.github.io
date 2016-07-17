$(document).ready(function () {
	console.log("js works");
  $('[data-toggle="offcanvas"]').click(function () {
  	console.log('clicked offcanvas')
    $('.row-offcanvas').toggleClass('active')
  });
});
