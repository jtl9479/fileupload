/**
 * 입차 등록
 * 주차정보 등록
 */

var app = new function() {
		
		_self = this;
		
		_self.$accessDate;
		_self.$userName;
		_self.$logout;

		_self.$GPS;
		
		_self.$carNo;
		_self.$carName;
		_self.$parkingPlaceNo;
		_self.$parkingNo;
		
		_self.$memo;
		_self.$semiParkYn;
		
		_self.$parkingAreaName;	
	   	_self.$parkingAreaNo;	
	   	_self.$parkSeqNo;	
	 	_self.$statCode;
	 	_self.$parkingAreaSelectYn;
	 	
		
		_self.$photoTaken;
		_self.$inCarComplete;
		_self.$cancel;
		
		_self.$pCarExitReq;
		_self.$pValet;
		_self.$pCarLoc;
		
		
		_self.$arrayParkingPlaceList;
		
		this.initialize = function(){
			_self.initElement();
			_self.bindEvents();
			_self.initData();
			
			_self.$GPS.startGPSInfo();
		};
		
		this.initElement = function(){
			
			_self.$accessDate = $("#accessDate");
			_self.$userName   = $("#userName");
			_self.$logout     = $("#logout");
			
			_self.$GPS = new CheckGPS();
			
			_self.$carNo          = $("#carNo");
			_self.$carName        = $("#carName");
			_self.$parkingPlaceNo = $("#parkingPlaceNo");
			_self.$parkingNo      = $("#parkingNo");
			_self.$memo           = $("#memo");
			_self.$semiParkYn     = $("#semiParkYn");
			
			_self.$photoTaken     = $("#photoTaken");
			_self.$inCarComplete  = $("#inCarComplete");
			_self.$cancel         = $("#cancel");
			
			_self.$pCarExitReq    = $("#pCarExitReq");
			_self.$pValet         = $("#pValet");
			_self.$pCarLoc        = $("#pCarLoc");
			
			_self.$arrayParkingPlaceList = new Array();
			
			_self.getParkingPlaceList();
			
			_self.fnGetInCarMemo();
		};
		
		this.initData = function(){
			//getSessionData()
			_self.$accessDate.text(window.sessionStorage['accessDate']);
			_self.$userName.text(window.sessionStorage['userName']);
			_self.$carNo.val(window.sessionStorage['carNo']);
			_self.$carName.val(window.sessionStorage['carName']=='null' ? '' : window.sessionStorage['carName']);
		}
		
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
			
			//취소
			_self.$cancel.on("click", function(e){
				_self.cancel();
			});
				
			// 사진촬영
			_self.$photoTaken.on("click", function(e){
				if(_self.validate()){
					
					// 주차장 번호 셋팅
					window.sessionStorage["parkingPlaceNo"] = $("#parking").val();
					
					// 주차구역 셋팅
					if($("#parkingAreaSelectYn").val()=="N"){
						window.sessionStorage["parkingAreaName"] = $("#parkingAreaName").val();
						window.sessionStorage["parkingAreaNo"] = "";
					}else{
						var selectText = $("select[name='parkingArea'] option:selected").text();
						var selectVal = $("select[name='parkingArea'] option:selected").val()
						window.sessionStorage["parkingAreaName"] = selectText;
						window.sessionStorage["parkingAreaNo"] = selectVal;
					}

					window.sessionStorage["memo"] = $("#memo").val();
					
					window.sessionStorage["parkingPlaceNo"] = $("#parkingPlaceNo option:selected").val();
					window.sessionStorage["parkingNo"]      = _self.$parkingNo.val();
					window.sessionStorage["parkingMemo"]    = _self.$memo.val();
					window.sessionStorage["parkingSemi"]    =  _self.$semiParkYn.is(":checked") == true ? true : false;
					
					window.sessionStorage["carNo"]      = _self.$carNo.val();
					window.sessionStorage["carName"]    = _self.$carName.val();
					
					_self.$GPS.stopGPSInfo();
					window.location.href = URL_CAR_PHOTO;
				}
			});
			
			// 주차 완료
			_self.$inCarComplete.on("click", function(e){
				if(_self.validate()){
					navigator.notification.activityStart();
					
					// 주차구역 셋팅
				  	if(_self.$parkingAreaNo == "undefined") _self.$parkingAreaNo = 0;
					if($("#parkingAreaSelectYn").val()=="N"){
						_self.$parkingAreaName = $("#parkingAreaName").val();
						_self.$parkingAreaNo = "";
						
					}else{
						_self.$parkingAreaName = $("select[name='parkingArea'] option:selected").text();
						_self.$parkingAreaNo = $("select[name='parkingArea'] option:selected").val()
					}
					
					window.sessionStorage['parkingPlaceNo'] = $("#parkingPlaceNo option:selected").val();
					window.sessionStorage['parkingAreaName'] = _self.$parkingAreaName;
					window.sessionStorage['parkingAreaNo'] = _self.$parkingAreaNo;

					var params = new Object();

					params.statCode        = CODE_IS_PARKING_IN_COMPLET;
					params.parkingPlaceNo  = window.sessionStorage['parkingPlaceNo'];
					params.parkingAreaName = window.sessionStorage['parkingAreaName'];
					params.parkingAreaNo   = window.sessionStorage['parkingAreaNo'];
					params.memo            = _self.$memo.val();
					params.semiParkYn      = _self.$semiParkYn.is(":checked") == true ? 'Y' : 'N';
					
					params.parkSeqNo       = window.sessionStorage['parkSeqNo'];
//					params.userId          = window.sessionStorage['userId'];
					params.carNo           = _self.$carNo.val();
					params.carName         = _self.$carName.val();
					
					//getSessionData();
					

					_self.$GPS.stopGPSInfo();
//					this.currentLocation = function(){
					navigator.geolocation.getCurrentPosition( function(position) {
						_self.$lat = position.coords.latitude;
						_self.$lng = position.coords.longitude;
						
						console.log('current : ' + _self.$lat + ',' + _self.$lng);
						
					},
					function(error){
						navigator.notification.activityStop();
			    		message('error code: ' + error.code    + '\n' + 'message: ' + error.message + '\n','')
					});
//					};
					
					
					if(window.sessionStorage["inCarMemo"] != null && window.sessionStorage["inCarMemo"] != ''){
						alert(window.sessionStorage["inCarMemo"]);
						window.sessionStorage["inCarMemo"] = '';
					}
					
					$.ajax({
						url			: URL_REGIST_CAR,
						method		: METHOD_POST,
						contentType : CONTENT_TYPE,  
						dataType 	: DATA_TYPE,
						data		:  params ,
						success	: function(data){
							if(data.message == "success"){
								window.sessionStorage['inMemo'] = data.inMemo;
								window.sessionStorage['custMemo'] = data.custMemo;
								window.sessionStorage['parkSeqNo'] = data.parkSeqNo;
								window.sessionStorage['parkDetailSeqNo'] = data.parkDetailSeqNo;
								//alert('주차완료');
								clearStorageData();
								
								//window.location.href = URL_CAR_REG;
								//alert(MSG_COMPLET_PARKING_IN + "/" +URL_CAR_REG )
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
										    	alert(MSG_COMPLET_PARKING_IN);
										    	window.location.href = URL_CAR_REG;
//										    	message(MSG_COMPLET_PARKING_IN,URL_CAR_REG)
										    }else{
										    	alert(MSG_COMPLET_PARKING_IN);
										    	window.location.href = URL_CAR_REG;
//										    	message(MSG_COMPLET_PARKING_IN,URL_CAR_REG)
										    }
										};
								},
								function(){
									
								});
								

							}else{
								alert(data.message);
							}
							navigator.notification.activityStop();
						},
						error		: function(xhr, status, error){
				    		message("error : " + error,'')
							navigator.notification.activityStop();
						}
					});
				}
				
				function completeParam(){
					return{
//						"id" : window.sessionStorage['userId'], 
						"carNo" : window.sessionStorage['carNo'], 
						"parkingPlaceNo" : $("#parkingPlaceNo option:selected").val(), 
						"memo" : _self.$memo.val(),
						"semiParkYn" : _self.$semiParkYn.is(":checked") == true ? 'Y' : 'N',
						"parkSeqNo" : window.sessionStorage['parkSeqNo'],
						"parkDetailSeqNo" : window.sessionStorage['parkDetailSeqNo'],
						"langitude" : _self.$lat,
						"longitude" : _self.$lng
					}
				};
			});
			
			// 주차완료
			
			
			/**
			 * 주차장 선택시 주차구역을 가져온다.
			 */
			_self.$parkingPlaceNo.on("change", function(e){

				var parkingAreaCheck = false;
				
				// 주차구역관리여부 체크후 select 표시
				for(var i = 0 ; i < _self.$arrayParkingPlaceList.length ; i++){
					var value = _self.$arrayParkingPlaceList[i];
					if(value.parkingPlaceNo==$(this).val()  && value.parkingAreaYn == "Y"){
						_self.getParkingPlaceAreaList($(this).val());
						$("#parkingAreaNameViewTitle").hide();
						$("#parkingAreaNameView").hide();
						$("#parkingAreaViewTitle").show();
						$("#parkingAreaView").show();
						$("#parkingAreaSelectYn").val("Y");
						parkingAreaCheck = true;
						parkingAreaSelectYn
						
						return;
					}
				}
				
				// 주차구역 input 박스 활성화
				$("#parkingAreaViewTitle").hide();
				$("#parkingAreaView").hide();
				
				$("#parkingAreaNameViewTitle").show();
				$("#parkingAreaNameView").show();
				
				$("#parkingAreaSelectYn").val("N");

			});

			
			
			/* 하단 페이지 이동 */
			// 출차 요청
			_self.$pCarExitReq.on("click", function(e){
				_self.$GPS.stopGPSInfo();
				window.location.href = URL_REQUEST_LIST;
			});
			// 발렛
			_self.$pValet.on("click", function(e){
				_self.$GPS.stopGPSInfo();
				window.location.href = URL_VALET_MAIN;
			});
			// 차량위치 확인
			_self.$pCarLoc.on("click", function(e){
				_self.$GPS.stopGPSInfo();
				window.location.href = URL_VIEW_MAP;
			});
			
			this.sendVales = function(){
				return{
					
				}
			}
			
		};
		
		//var arrayParkingPlaceList = new Array();
		/**
		 * 주차장 목록 가져오기
		 */
		this.getParkingPlaceList = function (){
			
//			var userId = window.sessionStorage["userId"];
			var params = new Object();
			
			var url = URL_GET_PARKING_PLACE_LIST;
			$.ajax({ 
		      type: "POST", 
		      url: url,
		      data: params, 
		      success: function(result){

		    	  for(var rowIdx  = 0 ; rowIdx  < result.length ; rowIdx++){
		    		  
		    		  var data = result[rowIdx];
		    		  $("#parkingPlaceNo").append("<option value='"+data.parkingPlaceNo+"'>"+data.parkingPlaceName+"("+data.parkingPlaceNo+")</option>");
		    		  
		    		  var parkingPlaceInfo = new Object();
		              
		    		  parkingPlaceInfo.parkingPlaceNo = data.parkingPlaceNo;
		    		  parkingPlaceInfo.parkingAreaYn = data.parkingAreaYn;
		                 
		    		  _self.$arrayParkingPlaceList.push(parkingPlaceInfo);
		    	  }

		      } ,
		      error:function (request, err, ex) {
		    	  message("error : " + ex,'')
		      }
		    });	
		}	
		
		/**
		 * 주차구역 목록 가져오기
		 */
		this.getParkingPlaceAreaList = function (no){
			
			
			var parkingPlaceNo = no;
			
			var params = {parkingPlaceNo : parkingPlaceNo};
			
			var url = URL_GET_PARKING_AREA_LIST;
			$.ajax({ 
		      type: "POST", 
		      url: url,
		      data: params, 
		      success: function(result){
		    	  $("select[name='parkingArea'] option").remove();
		    	  $("#parkingArea").append("<option value=''>"+"선택"+"</option>");
		    	  for(var rowIdx  = 0 ; rowIdx  < result.length ; rowIdx++){
		    		  $("#parkingArea").append("<option value='"+result[rowIdx].parkingAreaNo+"'>"+result[rowIdx].parkingAreaName+"</option>");
		    	  }
		      } ,
		      error:function (request, err, ex) {
				       message("error : " + ex,'')
		      }
		    });	
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
			    	
			    	var inMemo = null;
			    	var custMemo = null;
			    	
			    	// 입차알림 가져오기
			    	if(data[0].inMemo!=null){
//			    		message(data[0].inMemo,'');
			    		inMemo = "입차메모:" + data[0].inMemo + "\n" + "\n"; 
			    		window.sessionStorage["inCarMemo"] = data[0].inMemo;
			    	}
			    	
			    	// 고객메모 가져오기
			    	if(data[0].custMemo!=null){
			    		custMemo = "고객메모:" + data[0].custMemo;
			    	}
			    	
			    	if(inMemo != null || custMemo != null){
			    		if(inMemo != null && custMemo != null){
			    			alert(inMemo + custMemo);
			    		}
			    		if(inMemo == null && custMemo != null){
			    			alert(custMemo);
			    		}
			    		if(inMemo != null && custMemo == null){
			    			alert(inMemo);
			    		}
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
			    	message(MSG_CANCEL_IN,URL_CAR_REG)
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
		
		/* 데이터 체크 */
		this.validate = function(){
			//if(_self.$parkingNo.val().trim() == ""){
				//alert('주차구역을 등록하세요');
				//return false;
			//}
			//if(_self.$memo.val().trim() == ""){
				//alert('메모를 등록하세요');
				//return false;
			//}
			
			// 주차장 및 주차구역 입력
			if($("#parkingPlaceNo").val()=='0'){
				message(MSG_REQ_PARKING_PLACE,'')
				return;
			}
			
			// 주차구역 체크
			if($("#parkingAreaSelectYn").val()=="N"){
				if($("#parkingAreaName").val()=='' ){
					message(MSG_REQ_PARKING_AREA,'')
					return;
				}
			}else{
				if($("#parkingArea").val()=='0' ){
					message(MSG_REQ_PARKING_AREA,'')
					return;
				}
				if($("#parkingArea").val()=='' ){
					message(MSG_REQ_PARKING_AREA_SELECT,'')
					return;
				}
			}
			
			return true;
		};
		
}

$(document).ready(function(){
	document.addEventListener("deviceready", onDeviceReady, false);
	$("#parkingAreaViewTitle").hide();
	$("#parkingAreaView").hide();
	sessionCheck();
	
});

//PhoneGap is ready function
function onDeviceReady() {
	console.log("parking card onDevieReady");
	app.initialize();
}