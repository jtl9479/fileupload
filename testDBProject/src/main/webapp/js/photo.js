/**
 * 
 */

var app = new function() {
		
		_self = this;
		
		_self.$accessDate;
		_self.$userName;
		_self.$logout;
		
		_self.$memo;
		
		_self.$photoTaken;
		_self.$inCarComplete;
		
		_self.$pCarExitReq;
		_self.$pValet;
		_self.$pCarLoc;
		
		_self.$lat;
		_self.$lng;    	
		
		var fileArray;
		
		this.initialize = function(){
			_self.initElement();
			_self.bindEvents();
			_self.initData();
		};
		
		this.initElement = function(){
			
			_self.$accessDate = $("#accessDate");
			_self.$userName = $("#userName");
			_self.$logout = $("#logout");
			
			_self.$memo = $("#memo");
			
			_self.$photoTaken = $("#photoTaken");
			_self.$inCarComplete = $("#inCarComplete");
			
			_self.$pCarExitReq = $("#pCarExitReq");
			_self.$pValet = $("#pValet");
			_self.$pCarLoc = $("#pCarLoc");
		};
		
		this.initData = function(){
			_self.$accessDate.text(window.sessionStorage['accessDate']);
			_self.$userName.text(window.sessionStorage['userName']);
			_self.$memo.val(window.sessionStorage['memo']);
			
		}
		
		this.bindEvents = function(){
			
			// 사진촬영
			_self.$photoTaken.on("click", function(e){

				fileArray = new Array();

				navigator.camera.getPicture(onSuccess, onFail, {
				     quality: 100,
				     destinationType: Camera.DestinationType.FILE_URI,
				     sourceType : Camera.PictureSourceType.CAMERA,
				     targetWidth : 800,
				     targetHeight : 800,
				     correctOrientation: true
				   });
				
				function onSuccess(imageURI) {
					
					var obj = {};
					var lastIndex = imageURI.lastIndexOf('/');
					var strFileName = imageURI.substring(lastIndex + 1, imageURI.length);
					obj.path = imageURI;
					obj.name = strFileName;
					
					fileArray.push(obj);
					
					if(fileArray.length < 4){
						navigator.camera.getPicture(onSuccess, onFail, {
						     quality: 100,
						     destinationType: Camera.DestinationType.FILE_URI,
						     sourceType : Camera.PictureSourceType.CAMERA,
						     targetWidth : 800,
						     targetHeight : 800,
						     correctOrientation: true
						   });
					}else{
						setImage();
					}
			   };

			   function onFail(message) {
				   if(message == "Camera cancelled."){
					   setImage();
				   }
				   else{
					   alert('Failed because: ' + message);
				   }
			   };
			   
			   function setImage(){
				 for(var i = 0; i < fileArray.length; i++){
					   $("#carImg" + Number(i+1)).attr('src', fileArray[i].path);
				   }
			   };
				   
			});
			
			// 주차완료
			_self.$inCarComplete.on("click", function(e){
				//e.preventDefault();
				
				if(_self.validate()){
				}
			});
			
			
			
			/* 하단 페이지 이동 */
			// 출차 요청
			_self.$pCarExitReq.on("click", function(e){
				e.preventDefault();
				window.location.href = "./parking_list.html";
			});
			// 발렛
			_self.$pValet.on("click", function(e){
				e.preventDefault();
				window.location.href = "./car_reg.html";
			});
			// 차량위치 확인
			_self.$pCarLoc.on("click", function(e){
				e.preventDefault();
				window.location.href = "./parking_loc_info.html";
			});
			
		};
		
		/**
		 * 주차완료 정보 등록
		 */
		this.registeCar = function(){

	    	var parkingAreaNo = window.sessionStorage["parkingAreaNo"];	
	    	
	    	if(parkingAreaNo == "undefined") parkingAreaNo = 0;

	  		var params = new Object();
			params.carNo           = window.sessionStorage['carNo'];
			params.carName           = window.sessionStorage['carName'];
			params.parkingPlaceNo  = window.sessionStorage["parkingPlaceNo"];	// 주차장 번호
			params.parkingAreaName = window.sessionStorage["parkingAreaName"];
			params.semiParkYn      = window.sessionStorage["semiParkYn"];
//			params.userId          = window.sessionStorage['userId'];
			params.parkSeqNo       = window.sessionStorage["parkSeqNo"];		//주차번호
	  		params.parkingAreaNo   = parkingAreaNo;
			params.memo            = _self.$memo.val();
			params.langitude       = _self.$lat;
			params.longitude       = _self.$lng;
			params.statCode        = CODE_IS_PARKING_IN_COMPLET;
			
		  	$.ajax({ 
		  	    type: "POST", 
		  	    url: URL_REGIST_CAR,
		  	    data: params, 
		  	    success: function(data){
		  	    	
		  	    	console.log('current : ' + _self.$lat + ',' + _self.$lng);
					$.each(fileArray, function(idx, value){
						var file = fileArray[idx];
						_self.uploadFile(file, idx);
//							alert("file : " + fileArray[0].path);
					});
					navigator.notification.activityStop();
					//$("#message").html(MSG_REGIST_CAR_PHOTO);
		    		//$("#popupDialog").popup("open");
					//window.location.href = URL_CAR_REG;
					clearStorageData();
					_self.$GPS.gpsStasus(function(){
						navigator.notification.confirm(
								MSG_STOP_GPS, // message
								     onConfirm,            // callback to invoke with index of button pressed
								    'GPS',           // title
								    [MSG_BUTTON_CONFIRM,MSG_BUTTON_CANCEL]     // buttonLabels
								);
							function onConfirm(buttonIndex) {
							    if(buttonIndex == 1){
							    	_self.$GPS.gpsStatusChange();
							    	alert(MSG_REGIST_CAR_PHOTO);
							    	window.location.href = URL_CAR_REG;
							    	
//							    	message(MSG_REGIST_CAR_PHOTO,URL_CAR_REG)
							    }else{
							    	alert(MSG_REGIST_CAR_PHOTO);
							    	window.location.href = URL_CAR_REG;
							    	
//							    	message(MSG_REGIST_CAR_PHOTO,URL_CAR_REG)
							    }
							};
					},
					function(){
						
					});
					
		  	    	
		  	    } 
		  		,beforeSend:function(){
		  	       // $('.wrap-loading').removeClass('display-none');
		  	    }
		  	    ,complete:function(){
		  	       
		  	       // $('.wrap-loading').addClass('display-none');
		  	
		  	    }
		  	    ,
		  	    error:function (request, err, ex) {
		  	      alert(err + " ===>3 " + ex);
		  	     
		  	    }
		  	});
		}
		
		this.uploadFile =  function (mediaFile, idx) {
			

			var maxIdx = idx + 1;
			//var ft = new FileTransfer(); 코르도바
            var path = mediaFile.path;
            var name = mediaFile.name;
			
			//var options = new FileUploadOptions(); 코르도바
			options.fileKey = "fileData1";
			//options.fileKey = path;
			options.fileName = name;
			options.mimeType = "image/jpeg";
			
			//alert("filename : " + path)
			// 특정 파라미터 전송
			var params = new Object();
			params.carNo = window.sessionStorage['carNo'];
			params.parkingPlaceNo = window.sessionStorage["parkingPlaceNo"];	// 주차장 번호
			params.parkingNo = window.sessionStorage["parkingNo"];		//주차구역번호
			params.memo = _self.$memo.val();
			params.semiParkYn = window.sessionStorage["parkingSemi"];
//			params.id = window.sessionStorage['userId'];
			params.parkSeqNo = window.sessionStorage["parkSeqNo"];		//주차번호
			params.parkDetailSeqNo = window.sessionStorage["parkDetailSeqNo"];	//주차상세번호
			params.langitude = _self.$lat;
			params.longitude = _self.$lng;
			
			console.log("lat : " + params.lat + " ,lng : " + params.lng + " ,photoMemo : " + params.photoMemo );
			console.log( "parking : " + params.parking + " ,parkingArea : " + params.parkingArea + " ,parkingMemo : " + params.parkingMemo + " ,parkingSemi : " + params.parkingSemi);
			
			options.params = params;
			
			ft.upload(path, URL_REGIST_PHOTO,
            function(result) {
                console.log('Upload success: ' + result.responseCode);
                console.log(result.bytesSent + ' bytes sent');
                
                if(maxIdx == fileArray.length){
                	navigator.notification.alert(
	                		'사진을 전송하였습니다!',		//message
	                		'',							// callback
	                		'전송완료',					// title
	                		'확인'						// buttonName
	                );
                	navigator.notification.activityStop();
                }
            },
            function(error) {
                console.log('Error uploading file ' + path + ': ' + error.code);
                navigator.notification.alert( 
                		'사진을 전송할 수 없습니다!', 
                		'', 
                		'전송실패', 
                		'확인' 
                );
                navigator.notification.activityStop();
            },
            options);
	    }
		
		/**
		 * 메모가져오기
		 */
		this.fnGetInCarMemo = function (){
			
//			var userId = window.sessionStorage["userId"];
			var parkSeqNo = window.sessionStorage["parkSeqNo"];

			var params = new Object();
			
			params.parkSeqNo = parkSeqNo;
//			params.userId = userId;
			
			$.ajax({ 
			    type: "POST", 
			    url: URL_VIEW,
			    data: params, 
			    success: function(data){
			    	// 입차알림 가져오기
			    	
			    	if(data[0].inMemo!=null){

			    		message(data[0].inMemo,'')
			    	}
			    	//alert(data[0].memo);
			    	if(data[0].memo!=null){
			    		_self.$memo.val(data[0].memo);
			    	}
			    	
			    } 
				,beforeSend:function(){
			       // $('.wrap-loading').removeClass('display-none');
			    }
			    ,complete:function(){
			       
			       // $('.wrap-loading').addClass('display-none');
			
			    }
			    ,
			    error:function (request, err, ex) {
			      message("error : " + ex,'')
			      
			    }
			  });
		};
		
		this.validate = function(){
			if(typeof fileArray === 'undefined' || fileArray.length < 1){
				//alert('사진 한장 이상 등록하세요');MSG_REQ_PHOTO
				message(MSG_REQ_PHOTO,'')
				return true;
			}
			if(_self.$memo.val().trim() == ""){
				//alert('메모를 입력하세요');
				//return false;
			}
			return true;
		};
		
}

$(document).ready(function(){
	//onDeviceReady()
	app.initialize();
});

//PhoneGap is ready function
function onDeviceReady() {
	app.initialize();
}