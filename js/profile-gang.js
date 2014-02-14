      //Load venues or redirect
      jQuery(document).ready(function(){

        //Animate.css
        $('.gang-tiles div').addClass('animated slideInLeft');



       if (!localStorage.authorization||!localStorage.color||!localStorage.gangster||!localStorage.gang) {
         window.location.replace("splash.html");
       } else {
	   	var color = localStorage.color;
		var gangster = localStorage.gangster;
		
		mixpanel.track("PageLaunch", {page:"gangprofile", gang: color, gangster: gangster});

        //Change color background depending on player's color
        $('body').removeClass().addClass(color)

        //Menu
        new gnMenu( document.getElementById( 'gn-menu' ) );




        //Get Profile
        var authorization=localStorage.authorization;
        var gang = localStorage.gang;
        var endpoint = "http://vm0063.virtues.fi/gangs/"+gang+"/";
        $.ajax({
          type: "GET",
          url: endpoint,
          dataType: 'json',
          beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", authorization);
          }
        }).done(function( data ) {
          //Populate Gang
          $("#name").text(data.name);
          $(".gang-info.members").text(data.gangsters.length)

          //TODO: Compile Members list
          //TODO: Add points
          //TODO Add Best player
          //TODO Add Last Action



        }).fail(function( jqXHR, textStatus ) {
        //TODO fix this
          alert("Error: something went wrong while loading the profile: "+ textStatus);
        });
      }
    });


