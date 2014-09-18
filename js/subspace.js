
jQuery(document).ready(function(){

      if (!localStorage.authorization||!localStorage.color||!localStorage.gangster||!localStorage.gang) {
        window.location.replace("splash.html");
      } else if (!localStorage.venueid) {
	  window.location = "index.html";
	  }else{
	  
	  	var color = localStorage.color;
		var gangster = localStorage.gangster;
		mixpanel.track("PageLaunch", {page:"subspace", gang: color, gangster: gangster}); 
		
		//first check if the gangster is busted or interrupted
		
        
		var checker = bustCheck();
        registerSpray(checker);
         

		//Change color background depending on player's color
        $('body').removeClass().addClass(color)

}});

      // Showing and hiding text elements
      jQuery(document).ready(function() {
	  
        // jQuery("p#prepare").fadeIn(1000);
        jQuery("p#prepare").delay(1000).fadeOut(3000);
        // jQuery("p#progress").delay(5000).fadeIn(1000);
        setTimeout(function() {
        window.location.href = "index.html";
         }, 6000); //gives time for ajax calls before redirect to home
    });
        
       
//Checks weather the player is busted, interrupted or getting points
function bustCheck(){
        	   
		var gangster = localStorage.gangster;
        var authorization=localStorage.authorization;
        var endpoint = "http://vm0063.virtues.fi/gangsters/"+gangster+"/";
        $.ajax({
          type: "GET",
          url: endpoint,
		  async: false, 
          dataType: 'json',
          beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", authorization);
          }
        }).done(function( data ) {   
               var checker = parseInt(data.bustedviapolice); //first check if busted  
			   
			   if (checker === 1){
			   var bustedornot = checker;
			   localStorage.setItem('wassit',bustedornot);
			   registerBust();
               return;			               //breaks if busted -30 p
			   }
			   
               var interruptionn = localStorage.getItem('checker');
			   if (interruptionn != null){             //
	           var bustedornot = 2;
			   registerInterruption();
			   return;                    //breaks if interrupted 0 p
			   }
			                                       
			   if (checker === 0){
			   var bustedornot = checker;
			   localStorage.setItem('wassit',bustedornot);
			   return bustedornot;                    //breaks if spaying was a success -30 p
			   }
			   
			   }).fail(function( jqXHR, textStatus ) {
              //TODO fix these and place redirect to index and clean venue id from local storage
                alert("Third Error: Something went wrong with bustcheck");
              });
			  
}

function registerBust() {

                $("#spray-text").append("<p id='progress'>Oh no, got busted and loosed 30 p!</p>");   
		       var gangster = localStorage.gangster;
			   var color = localStorage.color;
               var authorization=localStorage.authorization;
               var endpoint = "http://vm0063.virtues.fi/gangsters/"+gangster+"/";
			   localStorage.points  = Number(localStorage.points) - 30;
               localStorage.busted = Number(localStorage.busted) + 1;
               var data =  {
                      points: localStorage.points,
                      busted: localStorage.busted,
					  spraying: 0,
					  bustedviapolice: 0
                  }
				  

			   $.ajax({
               type: "PATCH",
               url: endpoint,
		       async: false, 
               dataType: 'json',
			   data: data,
               beforeSend: function (xhr) {
               xhr.setRequestHeader ("Authorization", authorization);
                 }
               }).done(function( data ) {
			   
               var venue2 = JSON.parse(localStorage.getItem('venueid')); 
		       var venue = parseInt(venue2);
               var gangsterowns2 = JSON.parse(localStorage.getItem('gangsterowns')); 
		       var gangsterowns = parseInt(gangsterowns2);
		       var endpoint = "http://vm0063.virtues.fi/venues/"+venue+"/";
               var data =  {
				sprayinginitialized:0,
				gangsterSpraying: 0,
				gangster: gangsterowns 
               }
			   
              $.ajax({
                type: "PATCH",
                url: endpoint,
                dataType: 'json',
				async: false,
                data: data,
                beforeSend: function (xhr) {
                  xhr.setRequestHeader ("Authorization", authorization);
                }
               }).done(function( data ){
			   
			   mixpanel.track("GotBusted", {gang: color, gangster: gangster, venue: venue});
			   
			     }).fail(function( jqXHR, textStatus ) {
                 alert("Second for venue: Something went wrong with bustcheck");
                 });
				 });
				 }
		
function registerInterruption() {
        
		     //Interrupted spraying event
		$("#spray-text").append("<p id='progress'>All good</p>");
		var authorization=localStorage.authorization;
		var color = localStorage.color;
        var venue2 = JSON.parse(localStorage.getItem('venueid')); 
		var venue = parseInt(venue2);
        var gangsterowns2 = JSON.parse(localStorage.getItem('gangsterowns')); 
		var gangsterowns = parseInt(gangsterowns2);
		var endpoint = "http://vm0063.virtues.fi/venues/"+venue+"/";
        var data =  {
				sprayinginitialized:0,
				gangsterSpraying: 0,
				gangster: gangsterowns 
            }
              $.ajax({
                type: "PATCH",
                url: endpoint,
                dataType: 'json',
				async: false,
                data: data,
                beforeSend: function (xhr) {
                  xhr.setRequestHeader ("Authorization", authorization);
                }
               }).done(function( data ){
			  
              var gangster = localStorage.gangster; 
              var endpoint2 = "http://vm0063.virtues.fi/gangsters/"+gangster+"/";
              var data =  {                  
					  spraying: 0,
					  bustedviapolice: 0
                  }
             
              $.ajax({
                type: "PATCH",
                url: endpoint2,
                dataType: 'json',
				async: false,
                data: data,
                beforeSend: function (xhr) {
                  xhr.setRequestHeader ("Authorization", authorization);
                }
               }).done(function( data ) {

				}).fail(function( jqXHR, textStatus ) {
              //TODO fix these and place redirect to index and clean venue id from local storage
                alert("First Error: something went wrong while updating the location: "+ textStatus);
              }); 

              }).fail(function( jqXHR, textStatus ) {
              //TODO fix this
                alert("Second Error: something went wrong while updating the location: "+ textStatus);
              });	  
		}
		
function registerSpray(){
        var authorization=localStorage.authorization;
        var gangster = localStorage.gangster;
		
		localStorage.removeItem('gangsterowns');
		localStorage.setItem('gangsterowns',JSON.stringify(gangster)); //shifts the ownership
		var color = localStorage.color;
        var venue2 = JSON.parse(localStorage.getItem('venueid')); 
		var venue = parseInt(venue2);
        var now = moment().format();
		var endpoint = "http://vm0063.virtues.fi/venues/"+venue+"/";
        var data =  {
                gangster: gangster,
                latestEditTimestamp: now,
				sprayinginitialized:0,
				gangsterSpraying: 0
            }
		mixpanel.track("SprayingFinalised", {Time:now, gang: color, gangster: gangster, venue: venue});

        $.ajax({
          type: "PATCH",
          url: endpoint,
          dataType: 'json',
		  async: false,
          data: data,
          beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", authorization);
          }
        }).done(function( data ) {
              localStorage.points  = Number(localStorage.points) + 100;
              localStorage.tags_created = Number(localStorage.tags_created ) + 1;
              var endpoint = "http://vm0063.virtues.fi/gangsters/"+gangster+"/";
              var now = moment().format();
              var data =  {
                      points: localStorage.points,
                      tags_created: localStorage.tags_created,
                      last_action: now,
					  bustedviapolice: 0,
					  spraying: 0
                  }
             
              $.ajax({
                type: "PATCH",
                url: endpoint,
                dataType: 'json',
				async: false,
                data: data,
                beforeSend: function (xhr) {
                  xhr.setRequestHeader ("Authorization", authorization);
                }
               
               }).done(function( data ) {
			    
				$("spray-text").append("<p id='progress'>All good <span>You win 100 p!</span></p>");
            
				}).fail(function( jqXHR, textStatus ) {
              //TODO fix these and place redirect to index and clean venue id from local storage
                alert("First Error: something went wrong while updating the location: "+ textStatus);
              });
        }).fail(function( jqXHR, textStatus ) {
        //TODO fix this
          alert("Error: something went wrong while updating the location: "+ textStatus);
        });
     }