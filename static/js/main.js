$(window).load(function () {
  $("#preloader").fadeOut("slow");
});

$(document).ready(function () {
  var pathname = window.location.pathname;
  if (pathname == '/faqs/' || pathname.includes('/news/')) {
    $('#top-nav').addClass('confirmregistration');
    $('#top-nav').addClass('animated');
    //$('#commonfooter').addClass('confirm-page-footer');
  }
  if (pathname == '/404.html') {
    $('#top-nav').addClass('confirmregistration');
    $('#top-nav').addClass('animated');
  }

  new WOW().init();

  $('#top-nav').onePageNav({
    currentClass: 'current',
    changeHash: true,
    scrollSpeed: 1200
  });


  //animated header class
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    //console.log(scroll);
    if (scroll > 200) {
      //console.log('a');
      $(".navigation").addClass("animated");
    } else {
      //console.log('a');
      $(".navigation").removeClass("animated");
    }
  });

  $year = $('#countdown_dashboard').data('year');
  $month = $('#countdown_dashboard').data('month');
  $day = $('#countdown_dashboard').data('day');
  $hour = $('#countdown_dashboard').data('hour');
  $min = $('#countdown_dashboard').data('minute');
  $seconds = $('#countdown_dashboard').data('seconds');
  if ($('#countdown_dashboard').length != 0) {
    $('#countdown_dashboard').countDown({
      targetDate: {
        'day': $day,
        'month': $month,
        'year': $year,
        'hour': $hour,
        'min': $min,
        'sec': $seconds,
      },
      omitWeeks: true
    });
  }
  $(".about-slider").owlCarousel(
    {
      singleItem: true,
      pagination: true,
      autoPlay: 5000,
    }
  );
  //contact form validation
  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }
  var uid = uuidv4();
  //alert(uid);
  $('#cntbtn').click(function () {
    $('#patientoption').val('PA').trigger('change');
  })
  $('#hospitalhimbtn').click(function () {
    $('#patientoption').val('HIM').trigger('change');
  })
  $('#contact-submit').click(function (e) {
    var first_name = $('#quickname').val();
    var email = $('#quickemail').val();
    var subject = $('#quicksubject').val();
    var message = $('#message').val();
    var o = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (first_name == '') {
      $('#quicknamealert').css('display', 'block');
      return false;
    }
    else {
      $('#quicknamealert').css('display', 'none');
    }
    if (email == '' || email.search(o) == -1) {
      $('#quickemailalert').css('display', 'block');
      return false;
    }
    else {
      $('#quickemailalert').css('display', 'none');
    }
    if (subject == '') {
      $('#quicksubjectalert').css('display', 'block');
      return false;
    }
    else {
      $('#quicksubjectalert').css('display', 'none');
    }
    if (message == '') {
      $('#messagealert').css('display', 'block');
      return false;
    }
    else {
      $('#messagealert').css('display', 'none');
    }

  });
  $('#subscribe-submit').click(function (e) {
    var first_name = $('#subscribename').val();
    var email = $('#subscribeemail').val();
    var title = $('#title').val();
    var o = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (first_name == '') {
      $('#subscribenamealert').css('display', 'block');
      return false;
    }
    else {
      $('#subscribenamealert').css('display', 'none');
    }
    if (email == '' || email.search(o) == -1) {
      $('#subscribeemailalert').css('display', 'block');
      return false;
    }
    else {
      $('#subscribeemailalert').css('display', 'none');
    }

    var form = new FormData();
    form.append("grant_type", "client_credentials");
    form.append("client_id", "93d80a68-5ad0-878d-a787-5da44425070f");
    form.append("client_secret", "_S9UX^KZ&&t9W(aH");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://crm.unblock.health/Api/access_token",
      "method": "POST",
      "headers": {
        "Accept": "application/vnd.api+json"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {

      var obj = $.parseJSON(response);
      var access_token = obj.access_token;
      var settings = {
        "url": "https://crm.unblock.health/Api/V8/module",
        "method": "POST",
        "headers": {
          "Accept": "application/vnd.api+json",
          "Authorization": "Bearer " + access_token + "",
          "Content-Type": "application/json"
        },
        "processData": false,
        "data": "{\r\n  \"data\": {\r\n    \"type\": \"Contacts\",\r\n    \"id\": \"" + uid + "\",\r\n    \"attributes\": {\r\n     \"first_name\":\"" + first_name + "\",\r\n     \"email1\":\"" + email + "\"\r\n,\r\n     \"lead_source\":\"Web Site\"\r\n,\r\n     \"title\":\"" + title + "\"\r\n   }\r\n  }\r\n}\r\n"
      }

      $.ajax(settings).done(function (response) {
        //console.log(response);
        var contactid = response.data.id;
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://crm.unblock.health/Api/V8/module/Accounts/aba27ce2-d758-bdeb-adef-5da4294bf9e8/relationships",
          "method": "POST",
          "headers": {
            "Accept": "application/vnd.api+json",
            "Authorization": "Bearer " + access_token + "",
            "Content-Type": "application/json"
          },
          "processData": false,
          "data": "{  \r\n   \"data\":{  \r\n         \"type\":\"Contacts\",\r\n         \"id\":\"" + contactid + "\"\r\n\t    \r\n      }\r\n}"
        }

        $.ajax(settings).done(function (response) {
          //console.log(response);
          if (response.meta.message != "") {
            $('#subscribename').val('');
            $('#subscribeemail').val('');
            var $subscribesuccess = $('#subscribesuccess'); // get the reference of the div
            $subscribesuccess.show().html('You have been successfully added to our Mailing List!');
          }
        });
      });
    });
  });
  $('#contact-submit-live').click(function (e) {
    var first_name = $('#name').val();
    var email = $('#email').val();
    var subject = $('#subject').val();
    var patientdetails = $('#patientoption').val();
    var message = $('#message').val();
    var o = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (first_name == '') {
      $('#namealert').css('display', 'block');
      return false;
    }
    else {
      $('#namealert').css('display', 'none');
    }
    if (email == '' || email.search(o) == -1) {
      $('#emailalert').css('display', 'block');
      return false;
    }
    else {
      $('#emailalert').css('display', 'none');
    }
    if (subject == '') {
      $('#subjectalert').css('display', 'block');
      return false;
    }
    else {
      $('#subjectalert').css('display', 'none');
    }
    if (patientdetails == '') {
      $('#patientalert').css('display', 'block');
      return false;
    }
    else {
      $('#patientalert').css('display', 'none');
    }

    var form = new FormData();
    form.append("grant_type", "client_credentials");
    form.append("client_id", "93d80a68-5ad0-878d-a787-5da44425070f");
    form.append("client_secret", "_S9UX^KZ&&t9W(aH");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://crm.unblock.health/Api/access_token",
      "method": "POST",
      "headers": {
        "Accept": "application/vnd.api+json"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {

      var obj = $.parseJSON(response);
      var access_token = obj.access_token;
      var settings = {
        "url": "https://crm.unblock.health/Api/V8/module",
        "method": "POST",
        "headers": {
          "Accept": "application/vnd.api+json",
          "Authorization": "Bearer " + access_token + "",
          "Content-Type": "application/json"
        },
        "processData": false,
        "data": "{\r\n  \"data\": {\r\n    \"type\": \"Contacts\",\r\n    \"id\": \"" + uid + "\",\r\n    \"attributes\": {\r\n     \"first_name\":\"" + first_name + "\",\r\n     \"email1\":\"" + email + "\"\r\n,\r\n     \"lead_source\":\"Web Site\"\r\n,\r\n     \"title\":\"" + patientdetails + "\"\r\n   }\r\n  }\r\n}\r\n"
      }

      $.ajax(settings).done(function (response) {
        //console.log(response);
        var contactid = response.data.id;
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://crm.unblock.health/Api/V8/module/Accounts/aba27ce2-d758-bdeb-adef-5da4294bf9e8/relationships",
          "method": "POST",
          "headers": {
            "Accept": "application/vnd.api+json",
            "Authorization": "Bearer " + access_token + "",
            "Content-Type": "application/json"
          },
          "processData": false,
          "data": "{  \r\n   \"data\":{  \r\n         \"type\":\"Contacts\",\r\n         \"id\":\"" + contactid + "\"\r\n\t    \r\n      }\r\n}"
        }

        $.ajax(settings).done(function (response) {
          //console.log(response);
          if (response.meta.message != "") {
            $('#name').val('');
            $('#email').val('');
            var $success = $('#success'); // get the reference of the div
            $success.show().html('Your Message was sent successfully');
          }
        });
      });
    });
  });
  /*$("#contact-form").validate({
      rules: {
          name: {
              required: true,
              minlength: 2
          },
          message: {
              required: true,
              minlength: 2
          },
          email: {
              required: true,
              email: true
          }
      },
      messages: {
          name: {
              required: "Please enter Your Name",
              minlength: "Your name must consist of at least 2 characters"
          },
          message: {
              required: "Please Write Something",
              minlength: "Your message must consist of at least 2 characters"
          },
          email: "Please enter a valid email address"
      },
      submitHandler: function(form) {
          $(form).ajaxSubmit({
              type:"POST",
              data: $(form).serialize(),
              url:"mail.php",
              success: function() {
                  $('#contact-form :input').attr('disabled', 'disabled');
                  $('#contact-form').fadeTo( "slow", 0.15, function() {
                      $(this).find(':input').attr('disabled', 'disabled');
                      $(this).find('label').css('cursor','default');
                      $('#success').fadeIn();
                  });
              },
              error: function() {
                  $('#contact-form').fadeTo( "slow", 0.15, function() {
                      $('#error').fadeIn();
                  });
              }
          });
      }
  });*/
  var showChar = 85;
  var ellipsestext = "....";
  var moretext = "Read More";
  var lesstext = "Show Less";
  $('.more').each(function () {
    var content = $(this).html();
    if (content.length > showChar) {

      var c = content.substr(0, showChar);
      //alert(c);
      var h = content.substr(showChar, content.length - showChar);
      //alert(h);
      var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

      $(this).html(html);
    }
  });
  $(".morelink").click(function () {
    if ($(this).hasClass("less")) {
      $(this).removeClass("less");
      $(this).html(moretext);
    } else {
      $(this).addClass("less");
      $(this).html(lesstext);
    }
    $(this).parent().prev().toggle();
    $(this).prev().toggle();
    return false;
  });
  /*$('.readmore-link').click(function(e) {
  e.stopPropagation();
  $('.health-cntent').css({
      'height': 'auto'
  })

});
   $('.health-cntent').css({
      'height': '300px'
  })*/
  $('#myList1 li').each(function (index) {
    var size_li = 0;
    var size_li = $("#myList" + index + " li").size();
    //console.log(size_li);
    x = 1;
    $('#myList' + index + ' li:lt(' + x + ')').show();
    $('#showLess' + index).hide();
    $('#loadMore' + index).click(function () {
      $('#loadMore' + index).hide();
      x = (x + 5 <= size_li) ? x + 5 : size_li;
      //console.log(x);
      $('#myList' + index + ' li:lt(' + x + ')').show();
      $('#showLess' + index).show();
    });
    $('#showLess' + index).click(function () {
      $('#showLess' + index).hide();
      x1 = (x - 5 < 0) ? 2 : 1;
      console.log(x1);
      $('#myList' + index + ' li').not(':lt(' + x1 + ')').hide();
      $('#loadMore' + index).show();

    });
  });

  /*size_li = $("#myList0 li").size();
  x=1;
  $('#myList0 li:lt('+x+')').show();
  $('#showLess0').hide();
  $('#loadMore0').click(function () {
      $('#loadMore0').hide();
      x= (x+5 <= size_li) ? x+5 : size_li;
      $('#myList0 li:lt('+x+')').show();
      $('#showLess0').show();
  });
  $('#showLess0').click(function () {
     $('#showLess0').hide();
      x=(x-7<0) ? 1 : x-7;
      $('#myList0 li').not(':lt('+x+')').hide();
      $('#loadMore0').show();
  });

  size_li = $("#myList1 li").size();
  x=1;
  $('#myList1 li:lt('+x+')').show();
  $('#showLess1').hide();
  $('#loadMore1').click(function () {
      $('#loadMore1').hide();
      x= (x+5 <= size_li) ? x+5 : size_li;
      $('#myList1 li:lt('+x+')').show();
      $('#showLess1').show();
  });
  $('#showLess1').click(function () {
     $('#showLess1').hide();
      x=(x-7<0) ? 1 : x-7;
      $('#myList1 li').not(':lt('+x+')').hide();
      $('#loadMore1').show();
  });
  size_li = $("#myList2 li").size();
  x=1;
  $('#myList2 li:lt('+x+')').show();
  $('#showLess2').hide();
  $('#loadMore2').click(function () {
      $('#loadMore2').hide();
      x= (x+5 <= size_li) ? x+5 : size_li;
      $('#myList2 li:lt('+x+')').show();
      $('#showLess2').show();
  });
  $('#showLess2').click(function () {
     $('#showLess2').hide();
      x=(x-7<0) ? 1 : x-7;
      $('#myList2 li').not(':lt('+x+')').hide();
      $('#loadMore2').show();
  });
  size_li = $("#myList3 li").size();
  x=1;
  $('#myList3 li:lt('+x+')').show();
  $('#showLess3').hide();
  $('#loadMore3').click(function () {
      $('#loadMore3').hide();
      x= (x+5 <= size_li) ? x+5 : size_li;
      $('#myList3 li:lt('+x+')').show();
      $('#showLess3').show();
  });
  $('#showLess3').click(function () {
     $('#showLess3').hide();
      x=(x-7<0) ? 1 : x-7;
      $('#myList3 li').not(':lt('+x+')').hide();
      $('#loadMore3').show();
  });*/


});








