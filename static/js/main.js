$(window).load(function () {
  $("#preloader").fadeOut("slow");
  $('.morelink').each(function( index ) {
  var id = $(this).attr('id');
     
      if(id == 'data0'){
         $(this).addClass("Demand_medical_records_read");  
      }
      else if(id == 'data1'){
         $(this).addClass("Acess_wearables_read"); 
      }
      else if(id == 'data2'){
          $(this).addClass("Need_for_transparency_read");
      }
      else if(id == 'data3'){
          $(this).addClass("Correction_of_error_read");
      }
      else if(id == 'data4'){
          $(this).addClass("Rise_for_patients_read");
      }
      else if(id == 'data5'){
          $(this).addClass("Decisions_for_care_read");
      }
      else if(id == 'data6'){
          $(this).addClass("Improve_patient_satisfaction_read");
      }
      else if(id == 'data7'){
          $(this).addClass("Healthcare_organizations_read");
      }  
     
});
});


$(document).ready(function () {
  /*twitter hashtag feed */
  var ws = new WebSocket('wss://twint.netspective.io:8882');
  let count = 0;
  ws.onmessage = function (unblockTweets) {
    const tweets = unblockTweets.data;
    if (count === 0) {
      $(".twitter-loader").hide();
    }
    const tweetId = tweets.split(' ')[0];
    if (count < 50) {
      createTweet(tweetId);
    }
    count = count + 1;
  };
  /*twitter hashtag feed end */
 

$('.readmore-link').each(function( index ) {
      var id = $(this).attr('id');    
      if(id == 'loadMore0'){
         $(this).addClass("Health_information_management_read");  
      }
      else if(id == 'loadMore1'){
         $(this).addClass("Office_of_patient_experience_read"); 
      }
      else if(id == 'loadMore2'){
          $(this).addClass("Regulatory_read");
      }
      else if(id == 'loadMore3'){
          $(this).addClass("Patients_and_carepartners_read");
      }
      else if(id == 'showLess0'){
         $(this).addClass("Health_information_management_show");  
      }
      else if(id == 'showLess1'){
         $(this).addClass("Office_of_patient_experience_show"); 
      }
      else if(id == 'showLess2'){
          $(this).addClass("Regulatory_show");
      }
      else if(id == 'showLess3'){
          $(this).addClass("Patients_and_carepartners_show");
      }
  });

  /*$('#loadMore0').click(function(){
    $("#loadMore0").addClass("Health_information_management_read");
  });
  $('#showLess0').click(function(){
    $("#showLess0").addClass("Health_information_management_show");
  });
   $('#loadMore1').click(function(){
    $("#loadMore1").addClass("Office_of_patient_experience_read");
  });
  $('#showLess1').click(function(){
    $("#showLess1").addClass("Office_of_patient_experience_show");
  });
   $('#loadMore2').click(function(){
    $("#loadMore2").addClass("Regulatory_read");
  });
  $('#showLess2').click(function(){
    $("#showLess2").addClass("Regulatory_show");
  });
   $('#loadMore3').click(function(){
    $("#loadMore3").addClass("Patients_and_carepartners_read");
  });
  $('#showLess3').click(function(){
    $("#showLess3").addClass("Patients_and_carepartners_show");
  });*/
  
  $('ul li a').click(function(){
      $('li a').removeClass("active");
      $(this).addClass("active");
   });
  var pathname = window.location.pathname;
  
  if (pathname == '/faqs/') {
    $('#top-nav').addClass('confirmregistration');
    $('#top-nav').addClass('animated');
    $('#current').addClass('current');
     
    //$('#commonfooter').addClass('confirm-page-footer');
  }
  if(pathname.includes('/news/')) {
    $('#top-nav').addClass('confirmregistration');
    $('#current').removeClass('current');
    $('#news').addClass('current'); 
  }
  if(pathname.includes('/press/')) {
    $('#top-nav').addClass('confirmregistration');
    $('#current').removeClass('current');
    $('#press').addClass('current'); 
  }
  if(pathname.includes('/events/')) {
    $('#top-nav').addClass('confirmregistration');
    $('#current').removeClass('current');
    $('#events').addClass('current'); 
  }
  if(pathname == '/faqs/'){
    $('#current').removeClass('current');
    $('#faq').addClass('current'); 
  }
  if(pathname.includes('/blog/')) {
    $('#top-nav').addClass('confirmregistration');
    $('#current').removeClass('current');
    $('#blog').addClass('current'); 
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
  $('#contact-submit').click(function (e) {
    var first_name = $('#quickname').val();
    var email = $('#quickemail').val();
    var subject = $('#quicksubject').val();
    var message = $('#quickmessage').val();
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
    var description = 'Subject: '+subject;
    description += '&#013;&#010;';
    description += 'Message: '+message;
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
        "data": "{\r\n  \"data\": {\r\n    \"type\": \"Contacts\",\r\n    \"id\": \"" + uid + "\",\r\n    \"attributes\": {\r\n     \"first_name\":\"" + first_name + "\",\r\n     \"email1\":\"" + email + "\"\r\n,\r\n     \"lead_source\":\"Web Site\"\r\n,\r\n     \"title\":\"GEN\"\r\n,\r\n     \"description\":\"" + description + "\"\r\n   }\r\n  }\r\n}\r\n"
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
            $("#contactform").trigger("reset");
            var $success = $('#successfooter'); // get the reference of the div
            $success.show().html('Your Message was sent successfully');
          }
        });
      });
    });
  });
  var showChar = 85;
  var ellipsestext = "....";
  var moretext = "Read More";
  var lesstext = "Show Less";
  var i=0;
  $('.more').each(function (index) {
    var content = $(this).html();
    if (content.length > showChar) {
      //alert(i);
      var c = content.substr(0, showChar);
      //alert(c);
      var h = content.substr(showChar, content.length - showChar);
      //alert(h);
      var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a id="data'+i+'" href="" class="morelink">' + moretext + '</a></span>';

      $(this).html(html);
      i++;
    }
  });
  $(".morelink").click(function () {
    var id = $(this).attr('id');    
    if ($(this).hasClass("less")) {
      $(this).removeClass("less");
        if(id == 'data0'){
          $(this).removeClass("Demand_medical_records_show");
          $(this).addClass("Demand_medical_records_read");  
        }
        else if(id == 'data1'){
          $(this).removeClass("Acess_wearables_show");
          $(this).addClass("Acess_wearables_read");
        }
        else if(id == 'data2'){
          $(this).removeClass("Need_for_transparency_show");
          $(this).addClass("Need_for_transparency_read");
        }
        else if(id == 'data3'){
          $(this).removeClass("Correction_of_error_show");
          $(this).addClass("Correction_of_error_read");
        }
        else if(id == 'data4'){
          $(this).removeClass("Rise_for_patients_show");
          $(this).addClass("Rise_for_patients_read");
        }
        else if(id == 'data5'){
          $(this).removeClass("Decisions_for_care_show");
          $(this).addClass("Decisions_for_care_read");
        }
        else if(id == 'data6'){
          $(this).removeClass("Improve_patient_satisfaction_show");
          $(this).addClass("Improve_patient_satisfaction_read");
        }
        else if(id == 'data7'){
          $(this).removeClass("Healthcare_organizations_show");
          $(this).addClass("Healthcare_organizations_read");
        }
        $(this).html(moretext);
    }else {
      if(id == 'data0'){
         $(this).removeClass("Demand_medical_records_read");
         $(this).addClass("Demand_medical_records_show");  
      }
      else if(id == 'data1'){
         $(this).removeClass("Acess_wearables_read");
         $(this).addClass("Acess_wearables_show"); 
      }
      else if(id == 'data2'){
          $(this).removeClass("Need_for_transparency_read");
          $(this).addClass("Need_for_transparency_show");
      }
      else if(id == 'data3'){
          $(this).removeClass("Correction_of_error_read");
          $(this).addClass("Correction_of_error_show");
      }
      else if(id == 'data4'){
          $(this).removeClass("Rise_for_patients_read");
          $(this).addClass("Rise_for_patients_show");
      }
      else if(id == 'data5'){
          $(this).removeClass("Decisions_for_care_read");
          $(this).addClass("Decisions_for_care_show");
      }
      else if(id == 'data6'){
          $(this).removeClass("Improve_patient_satisfaction_read");
          $(this).addClass("Improve_patient_satisfaction_show");
      }
      else if(id == 'data7'){
          $(this).removeClass("Healthcare_organizations_read");
          $(this).addClass("Healthcare_organizations_show");
      }
      $(this).addClass("less");
      $(this).html(lesstext);
    }
    $(this).parent().prev().toggle();
    $(this).prev().toggle();
    return false;
  });
  
  
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
  function timeSince(date) {
    var seconds = Math.floor((new Date() - new Date(date)) / 1000);
    var duration = getDuration(seconds);
    var suffix = duration.interval > 1 || duration.interval === 0 ? 's' : '';
    return duration.interval + ' ' + duration.epoch + suffix;
  }
  function getDuration(seconds) {
    var epoch, interval;
    var DURATION_IN_SECONDS = {
      epochs: ['year', 'month', 'day', 'hour', 'minute'],
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (var i = 0; i < DURATION_IN_SECONDS.epochs.length; i++) {
      epoch = DURATION_IN_SECONDS.epochs[i];
      interval = Math.floor(seconds / DURATION_IN_SECONDS[epoch]);
      if (interval >= 1) {
        return {
          interval: interval,
          epoch: epoch
        };
      }
    }
  }
  $('#subscribe-submit').prop('disabled', 'disabled');
  $('#subscribe-submit').addClass('is-disabled');
  $('#subscribe').on('blur keyup change', 'textarea,input', function (event) {
    validateForm('#subscribe', '#subscribe-submit');
  });
  $('#contact-submit-live').prop('disabled', 'disabled');
  $('#contact-submit-live').addClass('is-disabled');
  $('#quickcontact').on('blur keyup change', 'textarea,input,select', function (event) {
     quickContactValidation = validateForm('#quickcontact', '#contact-submit-live');
     if((quickContactValidation==true)&&($("#name").val().length > 0)&&($("#email").val().length > 0)&&($("#patientoption").val()=="PA" ||$("#patientoption").val()=="HIM")){ 
        $('#contact-submit-live').prop('disabled', false);
        $('#contact-submit-live').removeClass('is-disabled');
     }
  });
  $('#contact-submit').prop('disabled', 'disabled');
  $('#contact-submit').addClass('is-disabled');
  $('#contactform').on('blur keyup change', 'textarea,input', function (event) {
    validateForm('#contactform', '#contact-submit');
  });
  function validateForm(id,buttonId) {
    var valid = $(id).validate().checkForm();
    if (valid) {
      $(buttonId).prop('disabled', false);
      $(buttonId).removeClass('is-disabled');
      return true;
    } else {
      $(buttonId).prop('disabled', 'disabled');
      $(buttonId).addClass('is-disabled');
      return false;
    }
  }
});

function createTweet(tweetId) {
  twttr.widgets.createTweet(tweetId,
    document.getElementById('twitter_feed'),
    {
      align: 'left'
    })
    .then(function (el) {
      // console.log("Tweet displayed..")
    });
}
function twitterShare(tweet_id, screen_name) {
  if (tweet_id != undefined && screen_name != undefined) {
    if (tweet_id) {
      var url = "https://twitter.com/statuses/" + tweet_id;
      var text = '';
      window.open('https://twitter.com/home?status=' + encodeURIComponent(url), '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
    }
  }

console.log("client_credentials");
}








