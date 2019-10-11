$(window).load(function() {
    $("#preloader").fadeOut("slow");
});

$(document).ready(function(){
         var pathname = window.location.pathname;
         if(pathname == '/registerconfirm/'){
          $('#top-nav').addClass('confirmregistration');
          $('#commonfooter').addClass('confirm-page-footer');
        }
     new WOW().init();


     $('#top-nav').onePageNav({
        currentClass: 'current',
        changeHash: true,
        scrollSpeed: 1200
    });

     
    //animated header class
 $(window).scroll(function() {    
    var scroll = $(window).scrollTop();
     //console.log(scroll);
    if (scroll > 200) {
        //console.log('a');
        $(".navigation").addClass("animated");
    } else {
        //console.log('a');
        $(".navigation").removeClass("animated");
    }});
    
    $year = $('#countdown_dashboard').data('year');
    $month = $('#countdown_dashboard').data('month');
    $day =  $('#countdown_dashboard').data('day');
    $hour = $('#countdown_dashboard').data('hour');
    $min =  $('#countdown_dashboard').data('minute');
    $seconds = $('#countdown_dashboard').data('seconds');
    if($('#countdown_dashboard').length != 0) {
  

    $('#countdown_dashboard').countDown({
        targetDate: {
            'day':      $day,
            'month':    $month,
            'year':     $year,
            'hour':     $hour,
            'min':      $min,
            'sec':      $seconds,
        },
        omitWeeks: true
    });
}
    $(".about-slider").owlCarousel(
        {
        singleItem: true,
        pagination : true,
        autoPlay : 5000,
        }
    );



    //contact form validation
    function uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    }
   var uid = uuidv4();
   $('#cntbtn').click(function(){ 
    $('#patientoption').val('Patient Advocate').trigger('change');
   })
   $('#hospitalhimbtn').click(function(){ 
    $('#patientoption').val('Hospital HIM').trigger('change');
   })
    $('#contact-submit-live').click(function(e){
      var first_name = $('#name').val();
      var email = $('#email').val();
      var subject = $('#subject').val();
      var patientdetails = $('#patientoption').val();
      var message = $('#message').val();
      var o = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if (first_name == '') {
          $('#namealert').css('display', 'block');
              return  false;
         }
         else {
          $('#namealert').css('display', 'none');
         }
         if (email == '' || email.search(o) == -1 ) {
            $('#emailalert').css('display', 'block');
            return  false;
         }
         else {
            $('#emailalert').css('display', 'none');
          }
         if (subject == '') {
          $('#subjectalert').css('display', 'block');
            return  false;
         }
         else {
          $('#subjectalert').css('display', 'none');
         }
         if (patientdetails == '') {
          $('#patientalert').css('display', 'block');
            return  false;
         }
         else {
          $('#patientalert').css('display', 'none');
         }
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://gqdss-unblockhealth-test.netspective.org/v1alpha1/graphql",
          "method": "POST",
          "headers": {
            "x-hasura-admin-secret": "YZC@5C94484td6LC",
            "content-type": "application/json",
          },
          "processData": false,
          "data": "{\"query\":\"mutation {insert_pre_launch_registration(objects: {email_address: \\\""+email+ "\\\", name: \\\""+first_name+ "\\\", options: \\\""+patientdetails+ "\\\", status: false}) {returning {id}}}\",\"variables\":null}"
        }
        $.ajax(settings).done(function (response) {
          console.log(response);
          var formid = response.data.insert_pre_launch_registration.returning[0].id;
          if(formid!=''){
            var $success = $('#success'); // get the reference of the div
            $success.show().html('Your Message was sent successfully'); // show and set the message
          }
          else {
            var $error = $('#success');
            $error.show().html('Your Message was not sent,please try again'); // show and set the message
          }
        });   
    });
      var query = window.location.search.substring(1);
      if(query!=''){
      var vars = query.split("=");
      var ID= vars[1];
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://gqdss-unblockhealth-test.netspective.org/v1alpha1/graphql",
        "method": "POST",
        "headers": {
          "x-hasura-admin-secret": "YZC@5C94484td6LC",
          "content-type": "application/json",
        },
        "processData": false,
        "data": "{\"query\":\"{\\n  pre_launch_registration(where: {id: {_eq: "+ID+"}}) {\\n    email_address\\n    name\\n    options\\n    status\\n  }\\n}\\n\",\"variables\":null}"
      }
      $.ajax(settings).done(function (response) {
  
        if (response.length == 0 ){ }else {
          var responseName = response.data.pre_launch_registration[0].name;
          var responseEmail = response.data.pre_launch_registration[0].email_address;
          var responsehealthdeatils = response.data.pre_launch_registration[0].options;
          var responsestatus = response.data.pre_launch_registration[0].status;
          //alert(responseName);
          if(responsestatus == false) {
            var form = new FormData();
            form.append("grant_type", "client_credentials");
            form.append("client_id", "7bd2f745-e4e7-139e-cb4e-5d9c611a300d");
            form.append("client_secret", "@8]f+}Z/G/$qV8>V");
            var settings = {
            "async": true,
            "crossDomain": true,
                    "url": "https://crm-test.netspective.org/Api/access_token",
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
              var access_token= obj.access_token;
              var settings = {
                  "url": "https://crm-test.netspective.org/Api/V8/module",
                  "method": "POST",
                  "headers": {
                    "Accept": "application/vnd.api+json",
                    "Authorization": "Bearer "+access_token+"",
                    "Content-Type": "application/json"
                   },
                  "processData": false,
                  "data": "{\r\n  \"data\": {\r\n    \"type\": \"Contacts\",\r\n    \"id\": \""+uid+ "\",\r\n    \"attributes\": {\r\n     \"first_name\":\""+responseName+"\",\r\n     \"email1\":\""+responseEmail+"\"\r\n,\r\n     \"lead_source\":\"Web Site\"\r\n,\r\n     \"title\":\""+responsehealthdeatils+"\"\r\n   }\r\n  }\r\n}\r\n"
                }

                $.ajax(settings).done(function (response) {
                  var contactid = response.data.id;
                  var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://crm-test.netspective.org/Api/V8/module/Accounts/c69ec5eb-f926-2e91-b6b1-5d9c5f808107/relationships",
                    "method": "POST",
                    "headers": {
                      "Accept": "application/vnd.api+json",
                      "Authorization": "Bearer "+access_token+"",
                      "Content-Type": "application/json"
                    },
                    "processData": false,
                    "data": "{  \r\n   \"data\":{  \r\n         \"type\":\"Contacts\",\r\n         \"id\":\""+contactid+"\"\r\n\t    \r\n      }\r\n}"
                  }
                  $.ajax(settings).done(function (response) {
                  //console.log(response);
                     /*if(response.meta.message != ""){
                        var url="https://formspree.io/benson.ap@citrusinformatics.com"; 
                        $('#quickcontact').attr('action', url);
                        $('#quickcontact').submit();
                      }*/
                  });
                });  
            });
          }    
        }
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://gqdss-unblockhealth-test.netspective.org/v1alpha1/graphql",
          "method": "POST",
          "headers": {
          "x-hasura-admin-secret": "YZC@5C94484td6LC",
          "content-type": "application/json",
          },
          "processData": false,
          "data": "{\"query\":\"mutation {update_pre_launch_registration(where: {id: {_eq: "+ID+ "}}, _set: {status: true}) {returning {\\n      id\\n      status\\n    }\\n  }}\",\"variables\":null}\r\n"
        }
        $.ajax(settings).done(function (response) {
          console.log(response);
          if (response.length == 0 ){ }else {
           var confirmstatus = response.data.update_pre_launch_registration.returning[0].status; 
            if(confirmstatus == true){
              var $confirmmsg = $('#confirmmsg'); // get the reference of the div
            $confirmmsg.show().html('Your Have Confirmed the registration'); // show and set the message
            }
          }
        });

    });

}

   var showChar = 85;
    var ellipsestext = "....";
    var moretext = "Read More";
    var lesstext = "Show Less";
    $('.more').each(function() {
      var content = $(this).html();
        if(content.length > showChar) {

          var c = content.substr(0, showChar);
          //alert(c);
          var h = content.substr(showChar, content.length - showChar);
          //alert(h);
          var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

          $(this).html(html);
        }
    });
    $(".morelink").click(function(){
      if($(this).hasClass("less")) {
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
    $('#myList1 li').each(function(index) {
      var size_li =0;
      var size_li = $("#myList"+index+" li").size();
      //console.log(size_li);
      x=1;
      $('#myList'+index+' li:lt('+x+')').show();
      $('#showLess'+index).hide();
      $('#loadMore'+index).click(function () {
        $('#loadMore'+index).hide();
        x= (x+5 <= size_li) ? x+5 : size_li;
        //console.log(x);
        $('#myList'+index+' li:lt('+x+')').show();
        $('#showLess'+index).show();
    });
    $('#showLess'+index).click(function () {
      $('#showLess'+index).hide();
        x1=(x-5<0) ? 2 : 1;
        console.log(x1);
        $('#myList'+index+' li').not(':lt('+x1+')').hide();
        $('#loadMore'+index).show();

      });
    });

    
     
});








