/**
 * 
 */

var app = new function() {
		
		_self = this;
		
		_self.$accessDate;
		_self.$userName;
		_self.$logout;
		
		_self.$map;
		_self.$latitude;
		_self.$longitude;
		
		_self.$pCarExitReq;
		_self.$pValet;
		_self.$pCarLoc;
		
		this.initialize = function(){
			_self.initElement();
			_self.bindEvents();
			_self.initData();
		};
		
		this.initElement = function(){
			
			_self.$accessDate = $("#accessDate");
			_self.$userName = $("#userName");
			_self.$logout = $("#logout");
			
			_self.$map = $("#map");
			
			_self.$pCarExitReq = $("#pCarExitReq");
			_self.$pValet = $("#pValet");
			_self.$pCarLoc = $("#pCarLoc");

		};
		
		this.bindEvents = function(){
			
			_self.$logout.on('click',function(){
				
				navigator.notification.confirm(
						MSG_LOGOUT, // message
					     onConfirm,            // callback to invoke with index of button pressed
					     MSG_TITLE_LOGOUT,           // title
					    [MSG_BUTTON_LOGINPAGE,MSG_BUTTON_APPEXIT]     // buttonLabels
				);
				function onConfirm(buttonIndex) {
				    
				    if(buttonIndex == 1){
				    	//_self.$GPS.stopGPSInfo();
				    	logout();
				    }else if(buttonIndex == 2){
				    	//_self.$GPS.stopGPSInfo();
				    	logout();
				    	if(navigator.app){
				    		navigator.app.exitApp();
						}else if(navigator.device){
							navigator.device.exitApp();
						}
				    }
				};

			});
			/* 하단 페이지 이동 */
			// 출차 요청
			_self.$pCarExitReq.on("click", function(e){
				window.location.href = URL_REQUEST_LIST;
			});
			// 발렛
			_self.$pValet.on("click", function(e){
				window.location.href = URL_VALET_MAIN;
			});
			// 차량위치 확인
			_self.$pCarLoc.on("click", function(e){
				window.location.href = URL_VIEW_MAP;
			});
		};
		
		this.initData = function(){
			
			_self.$accessDate.text(window.sessionStorage['accessDate']);
			_self.$userName.text(window.sessionStorage['userName']);
			
			_self.max_height();
			
			var params = new Object();
			params.parkSeqNo = window.sessionStorage['parkSeqNo']
			
			$.ajax({
				url			: URL_VIEW_CAR_MAP,
				method		: METHOD_POST,
				contentType : CONTENT_TYPE,
				dataType 	: DATA_TYPE,
				data		: params,
				success	: function(data){
					if(data != null){
						if(data.latitude != ""){
							_self.$latitude = data.latitude;
							_self.$longitude = data.longitude;
							console.log(_self.$latitude + "\ " +_self.$longitude);
							google.load("maps", "3.8", {"callback": _self.mapLoad, other_params: "sensor=true&language=ko"});
							
						}else{
							alert(data.msg);
						}
					}
					navigator.notification.activityStop();
				},
				error		: function(xhr, status, error){
					alert("error : " + error);
					google.load("maps", "3.8", {"callback": _self.mapLoad, other_params: "sensor=true&language=ko"});
					navigator.notification.activityStop();
				}
			});
		};
		
		this.max_height = function (){
		    var h = $('div[data-role="header"]').outerHeight(true);
		    var f = $('div[data-role="footer"]').outerHeight(true);
		    var w = $(window).height();
		    var s = $('div[class="user_area"]').outerHeight(true);
		    var c = $('div[data-role="content"]');
		    var c_h = c.height();
		    var c_oh = c.outerHeight(true);
		    var c_new = w - h - f -s - c_oh + c_h;
		    var total = h + f + c_oh;
		    if(c_h<c.get(0).scrollHeight){
		        c.height(c.get(0).scrollHeight);
		    }else{
		        c.height(c_new);
		    }
		};
		
		this.mapLoad = function(){
			var map;
			var marker;
			var infowindow;
			
			// 광화문 37.57162, 126.97644
			//var latlng = new google.maps.LatLng(37.571621, 126.976441);
			var latlng = new google.maps.LatLng(new Number(_self.$latitude), new Number(_self.$longitude));
		    var myOptions = {
		      zoom: 15,
		      center: latlng,
		      streetViewControl: true,
		      mapTypeId: google.maps.MapTypeId.ROADMAP,
		      zoomControl: true
		    };
//		    map = new google.maps.Map(_self.$map, myOptions);
		    map = new google.maps.Map(document.getElementById("map"), myOptions);
		    
		    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
		    	 var point = new google.maps.LatLng(new Number(_self.$latitude), new Number(_self.$longitude));
		    	//var point = new google.maps.LatLng(37.571621, 126.976441);
		    	    if(!marker){
		    	        //create marker
		    	        marker = new google.maps.Marker({
		    	            position: point,
		    	            map: map
		    	        });
		    	    }else{
		    	        //move marker to new position
		    	        marker.setPosition(point);
		    	    }
		    	    
		    	    map.panTo(marker.getPosition());
		    }); 
		    
		};
}

$(document).ready(function(){
	document.addEventListener("deviceready", onDeviceReady, false);
	sessionCheck();
});

//PhoneGap is ready function
function onDeviceReady() {
	console.log("parking card onDevieReady");
	app.initialize();
}