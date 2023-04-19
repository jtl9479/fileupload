/**
 * 
 */

var app = new function() {
		
		_self = this;
		
//		_self.$gpsInterval;
		_self.$lat;
		_self.$lng;
		
		_self.$accessDate;
		_self.$userName;
		_self.$logout;
		
		_self.$GPS;
		
		_self.$carNo;
		_self.$keyNo;
		_self.$valetMemo;
		_self.$parkingAreaName;
		
		_self.$outCarComplete;
		_self.$cancel;
		
		_self.$pCarExitReq;
		_self.$pValet;
		_self.$pCarLoc;
		
		this.initialize = function(){
			_self.initElement();
			_self.bindEvents();
			_self.initData();
			
			_self.$GPS.startGPSInfo();
		};
		
		this.initElement = function(){
			
			_self.$accessDate = $("#accessDate");
			_self.$userName = $("#userName");
			_self.$logout = $("#logout");
			
			_self.$GPS = new CheckGPS();
			
			_self.$carNo = $("#carNo");
			_self.$keyNo = $("#keyNo");
			_self.$valetMemo = $("#valetMemo");
			_self.$parkingAreaName = $("#parkingAreaName");
			
			_self.$outCarComplete = $("#outCarComplete");
			_self.$cancel         = $("#cancel");
			
			_self.$pCarExitReq = $("#pCarExitReq");
			_self.$pValet = $("#pValet");
			_self.$pCarLoc = $("#pCarLoc");
			
			_self.fnGetInCarMemo();
			//_self.$carNo.focus();
		};
		
		this.initData = function(){
			_self.$accessDate.text(window.sessionStorage['accessDate']);
			_self.$userName.text(window.sessionStorage['userName']);
			_self.$carNo.val(window.sessionStorage['carNo']);
			_self.$keyNo.val(window.sessionStorage['keyNo']);
			
			var parkingPlaceName = window.sessionStorage['parkingPlaceName'];
			var parkingAreaName = window.sessionStorage['parkingAreaName'];
			
			if(parkingPlaceName == null || parkingPlaceName == "null"){
				parkingPlaceName = "";
			}
			if(parkingAreaName == null || parkingAreaName == "null"){
				parkingAreaName = "";
			}
			_self.$parkingAreaName.val(parkingPlaceName + '-' + parkingAreaName);
			
			//_self.$valetMemo.html(window.sessionStorage['outMemo'] + "<br/>" + window.sessionStorage['custMemo']); //출차메모 <br/> 고객메모
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
				    	_self.$GPS.stopGPSInfo();
				    	logout();
				    }else if(buttonIndex == 2){
				    	_self.$GPS.stopGPSInfo();
				    	logout();
				    	if(navigator.app){
				    		navigator.app.exitApp();
						}else if(navigator.device){
							navigator.device.exitApp();
						}
				    }
				};


			});

			// 출차완료
			_self.$outCarComplete.on("click", function(e){
				
				if(_self.validate()){
					
					var whileOutYn = window.sessionStorage["whileOutYn"];
					var parkingPlaceName = window.sessionStorage["parkingPlaceName"];
					
					if(window.sessionStorage["outCarMemo"] != null && window.sessionStorage["outCarMemo"] != ''){
						alert(window.sessionStorage["outCarMemo"]);
						window.sessionStorage["outCarMemo"] = '';
					}
					
					
					//잠출일경우
					if("Y" == whileOutYn){
						alert(WHILE_OUT_YN_MSG + "(" + parkingPlaceName + ")");
						
						window.sessionStorage['request'] = true;
						window.sessionStorage['reqCarNo'] = window.sessionStorage["carNo"];
						window.sessionStorage['reqKeyNo'] = window.sessionStorage["keyNo"];
						window.sessionStorage['reqCarName'] = window.sessionStorage["carName"];
						
						navigator.notification.activityStart();
						var params = new Object();
						
						params.parkSeqNo = window.sessionStorage["parkSeqNo"];
//						params.userId = window.sessionStorage["userId"];
						params.reqStatCode = CODE_IS_PARKING_REQ_CONFIRM;
						params.statCode = CODE_IS_PARKING_REQ_CONFIRM;

						$.ajax({
							url			: URL_REGIST_CAR,
							method		: METHOD_POST,
							contentType : CONTENT_TYPE,
							dataType 	: DATA_TYPE,
							data		: params,
							success	: function(data){
								navigator.notification.activityStop();
								window.location.href = URL_CAR_REG;
							},
							error:function (request, err, ex) {
							      alert(err + " ===>3333 " + request.responseText + "\n" + ex);
							      navigator.notification.activityStop();
							     
							}
						});
					}
					
					
					navigator.notification.activityStart();
					
//					_self.stopGPSInfo();
					_self.$GPS.stopGPSInfo();
					
					navigator.geolocation.getCurrentPosition( function(position) {
						_self.$lat = position.coords.latitude;
						_self.$lng = position.coords.longitude;
						
						console.log('current : ' + _self.$lat + ',' + _self.$lng);
						
						
						
					},
					function(error){
						navigator.notification.activityStop();
						alert('error code: ' + error.code    + '\n' + 'message: ' + error.message + '\n');
					});
					
					var params = new Object();
					
					params.parkSeqNo = window.sessionStorage["parkSeqNo"];
//					params.userId = window.sessionStorage["userId"];
					
					params.parkingPlaceNo = window.sessionStorage["parkingPlaceNo"];
					params.parkingAreaName = window.sessionStorage["parkingAreaName"] == 'null' ? '' : window.sessionStorage["parkingAreaName"];
					params.parkingAreaNo = window.sessionStorage["parkingAreaNo"] == 'null' ? 0 : window.sessionStorage["parkingAreaNo"];
					params.statCode = CODE_IS_PARKING_OUT_COMPLET;
					//alert(getSessionData());
					
					if("Y" != whileOutYn){
						$.ajax({
							url			: URL_REGIST_CAR,
							method		: METHOD_POST,
							contentType : CONTENT_TYPE,
							dataType 	: DATA_TYPE,
							data		: params,
							success	: function(data){
								if(data.message == "success"){
									//alert('출차완료');
									_self.$GPS.gpsStasus(function(){
										navigator.notification.confirm(
												MSG_STOP_GPS, // message
												     onConfirm,            // callback to invoke with index of button pressed
												    'GPS',           // title
												    [MSG_BUTTON_CONFIRM,MSG_BUTTON_CANCEL]     // buttonLabels
												);
											function onConfirm(buttonIndex) {
												
												window.sessionStorage['reqCarNo'] = '';
												window.sessionStorage['reqKeyNo'] = '';
												window.sessionStorage['reqCarName'] = '';
												
											    if(buttonIndex == 1){
											    	_self.$GPS.gpsStatusChange();
											    	alert(MSG_COMPLET_PARKING_OUT);
											    	window.location.href = URL_CAR_REG;
	//										    	message(MSG_COMPLET_PARKING_OUT,URL_CAR_REG)
											    }else{
											    	alert(MSG_COMPLET_PARKING_OUT);
											    	window.location.href = URL_CAR_REG;
	//										    	message(MSG_COMPLET_PARKING_OUT,URL_CAR_REG)
											    }
											};
									},
									function(){
										
									});
									//$("#message").html(MSG_COMPLET_PARKING_OUT);
						    		//$("#popupDialog").popup("open");
									//window.location.href = URL_CAR_REG;
								}else{
									alert(data.message);
								}
								navigator.notification.activityStop();
							},
							error		: function(xhr, status, error){
								alert("error : " + error);
								window.location.href = _self.$urlComplet;
								navigator.notification.activityStop();
							}
						});
					}
				}
				
				function completeParam(){
					return{
						"carNo" : _self.$carNo.val(), 
						"keyNo" : _self.$keyNo.val(), 
//						"id"	: window.sessionStorage['userId'],
						"parkSeqNo" : window.sessionStorage['parkSeqNo'],
						"parkDetailSeqNo" : window.sessionStorage['parkDetailSeqNo'],
						"langitude" : _self.$lat,
						"longitude" : _self.$lng
					}
				};
			});
			
			
			/* 하단 페이지 이동 */
			// 출차 요청
			_self.$pCarExitReq.on("click", function(e){
				_self.$GPS.stopGPSInfo();
				window.location.href = "./parking_list.html";
			});
			// 발렛
			_self.$pValet.on("click", function(e){
				_self.$GPS.stopGPSInfo();
				window.location.href = "./car_reg.html";
			});
			// 차량위치 확인
			_self.$pCarLoc.on("click", function(e){
				_self.$GPS.stopGPSInfo();
				window.location.href = "./parking_loc_info.html";
			});
			
			//취소
			_self.$cancel.on("click", function(e){
				_self.cancel();
			});
			
		};
		
		/**
		 * 메모가져오기
		 */
		this.fnGetInCarMemo = function (){
			
//			var userId = window.sessionStorage["userId"];
			var parkSeqNo = window.sessionStorage["parkSeqNo"];

			var params = {parkSeqNo : parkSeqNo };
			var url = contextPath  + "/valet/mobile/anonymous/view.do";
			$.ajax({ 
			    type: "POST", 
			    url: url,
			    data: params, 
			    success: function(data){
			    	// 입차알림 가져오기
			    	_self.$valetMemo.html(data[0].memo)
			    	if(data[0].outMemo!=null){
			    		$("#message").html(data[0].outMemo);
			    		window.sessionStorage["outCarMemo"] = data[0].outMemo;
			    		//document.getElementById("parkingComplet").href="#popupDialog";
			    		$("#popupDialog").popup("open");
			    		//alert(data.inMemo)
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
			      alert(err + " ===>3 " + ex);
			      
			    }
			  });
		};
		
		/**
		 * 취소
		 */
		this.cancel = function (){
			
//			var userId = window.sessionStorage["userId"];
			var parkSeqNo = window.sessionStorage["parkSeqNo"];

			var params = new Object();
			
			params.parkSeqNo = parkSeqNo;
//			params.userId = userId;
			
			$.ajax({ 
			    type: "POST", 
			    url: URL_CANCEL,
			    data: params, 
			    success: function(data){
			    	
			    	//alert(data.message)
			    	message(MSG_CANCEL_OUT,URL_CAR_REG)
			    	//window.location.href = URL_CAR_PHOTO;
			    				    	
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
		
		
		/* 주차등록, 출차등록 데이터 체크 */
		this.validate = function(){
			if(_self.$carNo.val().trim() == ""){
				//alert('차량번호를 입력하세요');
				//return false;
			}
			if(_self.$keyNo.val().trim() == ""){
				//alert('키카드를 입력하세요');
				//return false;
			}
			return true;
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