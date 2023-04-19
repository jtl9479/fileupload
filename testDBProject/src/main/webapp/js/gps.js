function CheckGPS() {
	
	this.gpsInterval  = null;
	this.lat = null;
	this.lng = null;
}

CheckGPS.prototype.startGPSInfo = function(){
	
	this.gpsInterval = setInterval(function(){ gpsTimer() }, 5000 );
	
	function gpsTimer(){
		
		var d = new Date();
		console.log('getTimer start -------- : ' + d.toLocaleTimeString());
		navigator.geolocation.getCurrentPosition( function(position) {
			this.lat = position.coords.latitude;
			this.lng = position.coords.longitude;
			
			console.log('gpsInfo current : ' + this.lat + ',' + this.lng);
			
			var params = new Object();
			params.parkSeqNo = window.sessionStorage["parkSeqNo"];
			params.userId = window.sessionStorage["userId"];
			params.latitude = this.lat;
			params.longitude = this.lng;
			
			$.ajax({
				url			: URL_REGIST_GPS,
				method		: METHOD_POST,
				contentType : CONTENT_TYPE,  
				dataType 	: DATA_TYPE,
				data		: params,
				success	: function(data){
					if(data.msg == "success"){
						console.log('parkingOut getTimer success');
					}else{
						console.log('etc msg : ' + data.msg);
					}
//					navigator.notification.activityStop();
				},
				error		: function(xhr, status, error){
					console.log('gpsInfo ajax error : ' + error);
					//alert('gpsInfo ajax error : ' + error);
				}
			});
			
			function locationTracParam(){
				return{
					"carNo"	: window.sessionStorage['carNo'],
					"parkSeqNo" : window.sessionStorage['parkSeqNo'],
					"parkDetailSeqNo" : window.sessionStorage['parkDetailSeqNo'],
					"userId" : window.sessionStorage["userId"],
					"langitude" : this.lat,
					"longitude" : this.lng
				}
			};
			
		},
		function(error){
			console.log('location error code: ' + error.code    + '\n' + 'message: ' + error.message + '\n');
			//alert('location error code: ' + error.code    + '\n' + 'message: ' + error.message + '\n');
		},
		{timeout:5000}
		);
	};
}

CheckGPS.prototype.stopGPSInfo = function(){
	console.log('stopGPSInfo---------');
	
	clearInterval(this.gpsInterval);
};

CheckGPS.prototype.gpsStasus = function(success, error, message) {
	  cordova.exec(success, error, "CheckGPS", "gpsStatus", [message]);
	};

	CheckGPS.prototype.gpsStatusChange = function(success, error, message) {
	  cordova.exec(null, null, "CheckGPS", "gpsStatusChange", [message]);
	};
	
//module.exports = new CheckGPS();