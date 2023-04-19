/**
 * 차량등록
 */
var app = new function() {
		
		_self = this;
		
		_self.$accessDate;
		_self.$userName;
		_self.$logout;
		
		_self.$GPS;
		
		_self.$carNo;
		_self.$keyNo;
		_self.$carName;
		
		_self.$inCarReg;
		_self.$outCarReg;
		
		_self.$pCarExitReq;
		_self.$pValet;
		_self.$pCarLoc;
		
		_self.$urlParkingIn;
		_self.$urlParkingOut;
		
		_self.$pIssue;
		_self.$statCode;
		
		_self.$parkingAreaName;
		_self.$parkingPlaceNo;
		_self.$parkingAreaNo;
		
		
		this.initialize = function(){
			_self.initElement();
			_self.bindEvents();
			_self.initData();
		};
		
		this.initElement = function(){
			
			_self.$accessDate = $("#accessDate");
			_self.$userName = $("#userName");
			_self.$logout = $("#logout");
			
			_self.$GPS = new CheckGPS();
			
			_self.$carNo = $("#carNo");
			_self.$keyNo = $("#keyNo");
			_self.$carName = $("#carName");
			
			_self.$inCarReg = $("#inCarReg");
			_self.$outCarReg = $("#outCarReg");
			
			_self.$pCarExitReq = $("#pCarExitReq");
			_self.$pValet = $("#pValet");
			_self.$pCarLoc = $("#pCarLoc");
			
			_self.$urlParkingIn = "./parking_finish.html";
			_self.$urlParkingOut = "./parking_out_ok.html";
			_self.$pIssue = $("#pIssue");
			
			//_self.$carNo.focus();
		};
		
		this.initData = function(){
			_self.$accessDate.text(window.sessionStorage['accessDate']);
			_self.$userName.text(window.sessionStorage['userName']);
			
			if(window.sessionStorage['request']){
				_self.$carNo.val(window.sessionStorage['reqCarNo']);
				_self.$keyNo.val(window.sessionStorage['reqKeyNo']);
				if(window.sessionStorage['reqCarName'] != "undefined"){
					_self.$carName.val(window.sessionStorage['reqCarName']);
				}
			}
			
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

			nfc.addTagDiscoveredListener(
					_self.onNfc, 
					function (status) {
						console.log("status : " + status); 
					},
					function (error) {
						alert("error : " + JSON.stringify(error));
					}
				);
			
			
			// 주차등록
			_self.$inCarReg.on("click", function(e){
				if(_self.$mode == REGISTE_MODE_EXIST){
					_self.registeCar(REGISTE_CAR_TYPE_PARKING_IN);
				}else{
					_self.searchCar(REGISTE_CAR_TYPE_PARKING_IN);
				}
			});
			
			// 출차등록
			_self.$outCarReg.on("click", function(e){
				if(_self.$mode == REGISTE_MODE_EXIST){
					_self.registeCar(REGISTE_CAR_TYPE_PARKING_OUT);
				}else{
					_self.searchCar(REGISTE_CAR_TYPE_PARKING_OUT);
					//출차요청에서는 여기탐
				}
				
			});
			
			/* 하단 페이지 이동 */
			// 출차 요청
			_self.$pCarExitReq.on("click", function(e){
				window.location.href = URL_REQUEST_LIST;
			});
			// 발렛
			_self.$pValet.on("click", function(e){
				window.location.href = URL_PARKING_CARD;
			});
			// 차량위치 확인
			_self.$pCarLoc.on("click", function(e){
				if(_self.validate()){
					if(_self.$mode != REGISTE_MODE_EXIST){
						_self.searchCar(REGISTE_CAR_TYPE_PARKING_MAP);
					}else{
						window.location.href = URL_VIEW_MAP;
					}					
				}
			});
			
			/* 발급 버튼 클릭 */
			_self.$pIssue.on("click", function(e){
				//e.preventDefault();
				
				if(_self.validate()){
				    navigator.notification.activityStart();
				 
					var params = new Object();
					params.carNo       = _self.$carNo.val() == "" ? "" :  _self.$carNo.val();
					params.keyNo       = _self.$keyNo.val();
					params.carName     = _self.$carName.val() == "" ? "" :  _self.$carName.val();
					params.ticketCode  = CODE_IS_TICKET_GENARAL;
					params.statCode    = CODE_IS_RECIVE_CAR;
					
					$.ajax({
						url			: URL_REGIST_CARD,
						method		: METHOD_POST,
						contentType : CONTENT_TYPE,
						dataType 	: DATA_TYPE,
						data		: params,
						success	: function(data){
							if(data.success == false && data.success != "undifined"){
								$("#message").html(MSG_ERR_NEW_REGIST_CAR_COMPLET);
					    		$("#popupDialog").popup("open");
							}else{
								$("#message").html(MSG_NEW_REGIST_CAR_COMPLET);
					    		$("#popupDialog").popup("open");
							}
		
							navigator.notification.activityStop();
						},
						error		: function(xhr, status, error){
							//alert("error : " + error);
							$("#message").html("error : " + error);
				    		$("#popupDialog").popup("open");
							navigator.notification.activityStop();
						}
					});
				}
				
				function completeParam(){
					return{
						
						"carNo":_self.$carNo.val(), 
						"nfcNo":_self.$nfcNo.val(), 
						"keyNo":_self.$keyNo.val(), 
						"carName":_self.$carName.val()
					}
				}
				
			});
			
		};
		
		/* 차량 등록 */
		this.registeCar = function(type){
			
			_self.$GPS.gpsStasus(function(){
				 //GPS is enabled!
				if(_self.validate()){
					navigator.notification.activityStart();
					var nextUrl;
					
				
					var params = {};
				  	params.parkSeqNo       = window.sessionStorage['parkSeqNo'];
					params.carNo           = _self.$carNo.val();
					params.carName         = _self.$carName.val() == 'null' ? '' :window.sessionStorage['$carName'];
					params.parkingAreaName = window.sessionStorage['parkingAreaName']=='null' ? '' :window.sessionStorage['parkingAreaName'];
					params.parkingPlaceNo  = window.sessionStorage['parkingPlaceNo']=='null' ? 0 :window.sessionStorage['parkingPlaceNo'];
					params.parkingAreaNo   = window.sessionStorage['parkingAreaNo']=='null' ? 0 :window.sessionStorage['parkingAreaNo'] ;
					
					//alert(window.sessionStorage['parkingAreaNo'])
					//주차등록
					if(type == REGISTE_CAR_TYPE_PARKING_IN){
						params.statCode= CODE_IS_PARKING_IN_ING;
						nextUrl = URL_PARKING_FINISH;
						
						if(_self.$mode == REGISTE_MODE_DIRECT){
							$.ajax({
								url			: URL_REGIST_CAR,
								method		: METHOD_POST,
								contentType : CONTENT_TYPE,
								dataType 	: DATA_TYPE,
								data		: params,
								success	: function(data){
									if(data.message == "success"){
										navigator.notification.activityStop();
										window.sessionStorage['carNo'] = _self.$carNo.val();
										window.sessionStorage['carName'] = _self.$carName.val();
										window.location.href = nextUrl;
									}else{
										navigator.notification.activityStop();
										alert(data.message);
									}
									
								},
								error:function (request, err, ex) {
								      alert(err + " ===>3 " + request.responseText + "\n" + ex);
								      navigator.notification.activityStop();
								     
								    }
								
							});
						}	
						
					}else if(type == REGISTE_CAR_TYPE_PARKING_OUT){
						params.statCode= CODE_IS_PARKING_OUT_ING;
						
						if(_self.$mode == REGISTE_MODE_DIRECT){
							$.ajax({
								url			: URL_DIRECT_OUT_CAR,
								method		: METHOD_POST,
								contentType : CONTENT_TYPE,
								dataType 	: DATA_TYPE,
								data		: params,
								success	: function(data){
									if(data.message == "success"){
										navigator.notification.activityStop();
										window.sessionStorage['carNo'] = _self.$carNo.val();
										window.sessionStorage['carName'] = _self.$carName.val();
										window.location.href = URL_PARKING_OUT_OK;
									}else{
										navigator.notification.activityStop();
										alert(data.message);
									}
									
								},
								error:function (request, err, ex) {
								      alert(err + " ===>3 " + request.responseText + "\n" + ex);
								      navigator.notification.activityStop();
								     
								    }
								
							});
						}
						
						// 출차요청에서 왔으면 출차확인상태로 변경한다.
						if(window.sessionStorage['request'] == true){
							params.reqStatCode = CODE_IS_PARKING_REQ_CONFIRM;
						}
						nextUrl = URL_PARKING_OUT_OK;
					}else{
						nextUrl = "#";
					}	
					
					//if($("#statCode").val() != params.statCode){
					if(_self.$mode != REGISTE_MODE_DIRECT){
						$.ajax({
							url			: URL_REGIST_CAR,
							method		: METHOD_POST,
							contentType : CONTENT_TYPE,
							dataType 	: DATA_TYPE,
							data		: params,
							success	: function(data){
								if(data.message == "success"){
									navigator.notification.activityStop();
									window.sessionStorage['carNo'] = _self.$carNo.val();
									window.sessionStorage['carName'] = _self.$carName.val();
									window.location.href = nextUrl;
								}else{
									navigator.notification.activityStop();
									alert(data.message);
								}
								
							},
							error:function (request, err, ex) {
							      alert(err + " ===>3 " + request.responseText + "\n" + ex);
							      navigator.notification.activityStop();
							     
							    }
							
						});
					}	
					//}else{
					//	window.location.href = nextUrl;
					//}
				}
				function completeParam1(){
					return{
						
						"carNo":_self.$carNo.val(), 
						"keyNo":_self.$keyNo.val(), 
						"carName":_self.$carName.val()
					}
				};
			  },
			  function(){
			    //GPS is disabled!
				  navigator.notification.confirm(
						  MSG_START_GPS, // message
						     onConfirm,            // callback to invoke with index of button pressed
						    'GPS',           // title
						    [MSG_BUTTON_CONFIRM,MSG_BUTTON_CANCEL]     // buttonLabels
						);
					function onConfirm(buttonIndex) {
					    if(buttonIndex == 1){
					    	_self.$GPS.gpsStatusChange();
					    }
					};
				
			  });
			
		}
		/* 차량정보 검색 */
		this.searchCar = function (type){
			
			console.log("ok:" + type)
			var keyNo = $("#keyNo").val();
			var carNo = $("#carNo").val();
			var carName = $("#carName").val();
			
		   
			
			var params = new Object();

			
			if(keyNo == "" && carNo ==""){
				
				$("#message").html(MSG_REQ_CARNO_KEYNO);
				$("#popupDialog").popup("open");

				return;
			}
			
			if(_self.$mode != REGISTE_MODE_DIRECT){
				params.carNo = carNo;
			}
			params.keyNo = keyNo;
			
			console.log("ok2:" + type)
			
			if(type != REGISTE_CAR_TYPE_PARKING_MAP){
				$.ajax({ 
				    url: URL_GET_CAR_INFO,
				    method		: METHOD_POST,
					contentType : CONTENT_TYPE,
					dataType 	: DATA_TYPE,
				    data: params, 
				    success: function(data){
				    	// 데이타가 없을경우
				    	if(data.success==false){
				    		$("#popupDialogNoCar").popup("open");
				    		
				    		return;
				    	}
				    	
				    	// 데이타가 1건일경우
				    	if(data.length == 1){
				    		var result = data[0];
				    		if(result.statCode == CODE_IS_PARKING_OUT_COMPLET && type == REGISTE_CAR_TYPE_PARKING_OUT){
				    			$("#message").html(MSG_ALEADY_COMPLE_PARKING_OUT);
					    		$("#popupDialog").popup("open");
					    		clearStorageData();
					    		_self.$carNo.val("");
					    		_self.$keyNo.val("");
					    		_self.$carName.val("");
					    		return;
				    		}
				    		if(_self.$mode == REGISTE_MODE_DIRECT){
				    			window.sessionStorage['carNo'] = carNo;
				    			window.sessionStorage['carName'] = carName;
				    			$("#carNo").val(carNo);
				    			$("#carName").val(carName);
				    		}else{
				    			$("#carNo").val(result.carNo);
				    			$("#carName").val(result.carName);
				    		}
					    	 $("#parkSeqNo").val(result.parkSeqNo);
					    	 $("#nfcNo").val(result.nfcNo);
					    	 $("#statCode").val(CODE_IS_PARKING_IN_ING);
					    	 _self.setStorageData(result.parkSeqNo
					    			        ,result.carNo
					    			        ,result.carName
					    			        ,result.parkingPlaceNo
					    			        ,result.parkingAreaNo
					    			        ,result.parkingAreaName
					    			        ,result.nfcNo
					    			        ,result.keyNo
					    			        ,result.parkingPlaceName 
					    			        ,result.whileOutYn 
					    	 				)
					    	 _self.registeCar(type);
					    	 
					    	 return;
				    	}
				    	
				    	// 데이타가 여러건을 경우
				    	if(data.length > 1){
				    		$("#carList").children().remove();
				    		for(var rowIdx  = 0 ; rowIdx  < data.length ; rowIdx++){
					    		  
					    		  _self.makeParkingGridHtml(data[rowIdx],type);
					    	}
				    		$("#popupDialogOneMoreCar").popup("open");
				    	}
				    	
				    	
				    } 
					,beforeSend:function(){
				       // $('.wrap-loading').removeClass('display-none');
				    }
				    ,complete:function(){
				       
				       // $('.wrap-loading').addClass('display-none');
				
				    }
				    ,
				    error:function(xhr, status, error){
				    	$("#message").html("error : " + error);
			    		$("#popupDialog").popup("open");
			    		 _self.registeCar(type);
				           
				    }
				  });
			
				}
			
			//지도보기
			if(type == REGISTE_CAR_TYPE_PARKING_MAP){
				$.ajax({ 
				    url: URL_GET_CAR_INFO,
				    method		: METHOD_POST,
					contentType : CONTENT_TYPE,
					dataType 	: DATA_TYPE,
				    data: params, 
				    success: function(data){
				    	// 데이타가 없을경우
				    	if(data.success==false){
				    		$("#message").html(MSG_NO_REG_CAR);
				    		$("#popupDialog").popup("open");
				    		return;
				    	}
				    	
				    	// 데이타가 1건일경우
				    	if(data.length == 1){
				    		var result = data[0];
				    		if(result.statCode == CODE_IS_PARKING_OUT_COMPLET && type == REGISTE_CAR_TYPE_PARKING_OUT){
				    			$("#message").html(MSG_ALEADY_COMPLE_PARKING_OUT);
					    		$("#popupDialog").popup("open");
					    		clearStorageData();
					    		_self.$carNo.val("");
					    		_self.$keyNo.val("");
					    		_self.$carName.val("");
					    		return;
				    		}
				    		if(_self.$mode == REGISTE_MODE_DIRECT){
				    			window.sessionStorage['carNo'] = carNo;
				    			window.sessionStorage['carName'] = carName;
				    			$("#carNo").val(carNo);
				    			$("#carName").val(carName);
				    		}else{
				    			$("#carNo").val(result.carNo);
				    			$("#carName").val(result.carName);
				    		}
				    		
					    	 $("#parkSeqNo").val(result.parkSeqNo);
					    	 $("#keyNo").val(result.keyNo);
					    	 $("#statCode").val(CODE_IS_PARKING_IN_ING);
					    	 _self.setStorageData(result.parkSeqNo
					    			        ,result.carNo
					    			        ,result.carName
					    			        ,result.parkingPlaceNo
					    			        ,result.parkingAreaNo
					    			        ,result.parkingAreaName
					    			        ,result.nfcNo
					    			        ,result.keyNo
					    			        ,result.parkingPlaceName 
					    			        ,result.whileOutYn 
					    	 				)
					    	 window.location.href = URL_VIEW_MAP;				
					    	 				
					    	 return;
				    	}
				    	
				    	// 데이타가 여러건을 경우
				    	if(data.length > 1){
				    		$("#carList").children().remove();
				    		for(var rowIdx  = 0 ; rowIdx  < data.length ; rowIdx++){
					    		  
					    		  _self.makeParkingGridHtml(data[rowIdx],type);
					    	}
				    		$("#popupDialogOneMoreCar").popup("open");
				    	}
				    	
				    	
				    } 
					,beforeSend:function(){
				       // $('.wrap-loading').removeClass('display-none');
				    }
				    ,complete:function(){
				       
				       // $('.wrap-loading').addClass('display-none');
				
				    }
				    ,
				    error:function(xhr, status, error){
				    	$("#message").html("error : " + error);
			    		$("#popupDialog").popup("open");
			    		 _self.registeCar(type);
				           
				    }
				  });
			
				}
			
			
		}
		
		
		this.makeParkingGridHtml = function (data,type){
			var html = '';

			var parkSeqNo = nullToString(data.parkSeqNo);
			var nfcNo = nullToString(data.nfcNo);
			var keyNo = nullToString(data.keyNo);
			var carNo = nullToString(data.carNo);
			var parkingPlaceName = nullToString(data.parkingPlaceName);
			var parkingAreaName = nullToString(data.parkingAreaName);
			var parkingPlaceNo = nullToString(data.parkingPlaceNo);
			var parkingAreaNo = nullToString(data.parkingAreaNo);
			var statCodeName = nullToString(data.statCodeName);
			var reqStatCodeName = nullToString(data.reqStatCodeName);
			var statDatetime = nullToString(data.statDatetime);
			var carName = nullToString(data.carName);
			var driverName = nullToString(data.driverName);
			var memo = nullToString(data.memo);
			var parkingPlaceName = nullToString(data.parkingPlaceName);
			var whileOutYn = nullToString(data.whileOutYn);
	
			statDatetime = getDateToStringTime(statDatetime)
			
			html+='<tr id="'+parkSeqNo+'">';
			html+='	<td class="tc">'+statDatetime+'</td>';
			html+='	<td class="tc"><a href="javascript:_self.beforeRegisteCar(\''+type+'\',\''+parkSeqNo+'\',\''+carNo+'\',\''+carName+'\',\''+parkingPlaceNo+'\',\''+parkingAreaNo+'\',\''+parkingAreaName+'\',\''+nfcNo+'\',\''+keyNo+'\',\''+parkingPlaceName+'\',\''+whileOutYn+'\');">'+parkingPlaceName + '-' + parkingAreaName + '<br>' +carNo+ '</a></td>';
			
			html+='</tr>';
			
			$("#carList").append(html);
			
		}

		/**
		 * 목록에서 선태후 주차등록한다.
		 */
		this.beforeRegisteCar = function (type,parkSeqNo,carNo,carName,parkingPlaceNo,parkingAreaNo,parkingAreaName,nfcNo,keyNo,parkingPlaceName,whileOutYn){
			$("#carNo").val(carNo);
			$("#carName").val(carName);
			$("#parkSeqNo").val(parkSeqNo);
			
			_self.setStorageData(parkSeqNo,carNo,carName,parkingPlaceNo,parkingAreaNo,parkingAreaName,nfcNo,keyNo,parkingPlaceName,whileOutYn)
			
			_self.$mode = REGISTE_MODE_EXIST;
			
			$("#popupDialogOneMoreCar").popup("close");
			//_self.registeCar(type);
		}

		/**
		 * 세션스토리지에 등록
		 */
		this.setStorageData = function (parkSeqNo,carNo,carName,parkingPlaceNo,parkingAreaNo,parkingAreaName,nfcNo,keyNo,parkingPlaceName,whileOutYn){
			if(parkSeqNo!=""){
				window.sessionStorage["parkSeqNo"] = parkSeqNo;
			}
			if(carNo!="" && carNo != 'null'){
				window.sessionStorage["carNo"] = carNo;
			}
			if(carName!="" && carName != 'null'){
				window.sessionStorage["carName"] = carName;
			}
			if(parkingPlaceNo!=""){
				window.sessionStorage["parkingPlaceNo"] = parkingPlaceNo;
			}
			if(parkingAreaNo!=""){
				window.sessionStorage["parkingAreaNo"] = parkingAreaNo;
			}
			if(parkingAreaName!=""){
				window.sessionStorage["parkingAreaName"] = parkingAreaName;
			}
			if(nfcNo!=""){
				window.sessionStorage["nfcNo"] = nfcNo;
			}
			if(keyNo!=""){
				window.sessionStorage["keyNo"] = keyNo;
			}
			if(parkingPlaceName!=""){
				window.sessionStorage["parkingPlaceName"] = parkingPlaceName;
			}
			if(whileOutYn!=""){
				window.sessionStorage["whileOutYn"] = whileOutYn;
			}
		}
		
		
		/*
		 * 메시지 nfcEvent로부터 태그 ID 출력
		 */
		this.onNfc = function(nfcEvent) {
			var tag = nfcEvent.tag;
//			16 : 04059e2a8c3281
//			10 : 1132076783645313 (16자리)
			
			var nfcHex = nfc.bytesToHexString(tag.id);
			var keyNo = parseInt(nfcHex, 16);
			_self.$keyNo.val(keyNo);
			
			navigator.notification.activityStart();
			
			var params = new Object();
			params.keyNo = keyNo;
			
			
			$.ajax({
				url			: URL_GET_CAR_INFO,
				method		: METHOD_POST,
				contentType : CONTENT_TYPE,
				dataType 	: DATA_TYPE,
				data		: params,
				success	: function(data){
					// 데이타가 없을경우
			    	if(data.success==false){
			    		$("#popupDialogNoCar").popup("open");
			    		navigator.notification.activityStop();
			    		_self.$mode = REGISTE_MODE_DIRECT;
			    		return;
			    	}
			    	
			    	// 데이타가 1건일경우
			    	if(data.length == 1){
			    		 var result = data[0];
			    		 var nfcCardCheck = result.nfcCardCheck;
			    		 
			    		 if(nfcCardCheck == 1){
			    			 navigator.notification.activityStop();
			    			 alert(MSG_ALEADY_ISSUED_CARD);
			    			 window.location.href = URL_CAR_REG;
			    			 return;
			    		 }
			    		 
			    		 $("#carNo").val(result.carNo);
				    	 $("#carName").val(result.carName);
				    	 $("#parkSeqNo").val(result.parkSeqNo);
				    	 $("#nfcNo").val(result.nfcNo);
				    	 $("#statCode").val(result.statCode);
				    	 _self.setStorageData(result.parkSeqNo
				    			        ,result.carNo
				    			        ,result.carName
				    			        ,result.parkingPlaceNo
				    			        ,result.parkingAreaNo
				    			        ,result.parkingAreaName
				    			        ,result.nfcNo
				    			        ,result.keyNo
				    			        ,result.parkingPlaceName
				    			        ,result.whileOutYn
				    			        )

				    	 navigator.notification.activityStop();
				    	 
				    	 //데이타가 1건일 경우 등록 모드로 셋팅
				    	 _self.$mode = REGISTE_MODE_EXIST;
				    	 return;
			    	}
			    	
			    	// 데이타가 여러건을 경우
			    	if(data.length > 1){
			    		$("#carList").children().remove();
			    		for(var rowIdx  = 0 ; rowIdx  < data.length ; rowIdx++){
				    		  
				    		  _self.makeParkingGridHtml(data[rowIdx],'');
				    	}
			    		$("#popupDialogOneMoreCar").popup("open");
			    	}
					navigator.notification.activityStop();
				},
				error		: function(xhr, status, error){
					//alert("error : " + error);
					$("#message").html("error : " + error);
		    		$("#popupDialog").popup("open");
					navigator.notification.activityStop();
				}
			});
		};
		
		/* 주차등록, 출차등록 데이터 체크 */
		this.validate = function(){
			if(_self.$carNo.val().trim() == ""){
				//alert('차량번호를 입력하세요');
				//return false;
			}
			if(_self.$keyNo.val().trim() == "" && _self.$carNo.val().trim() == ""){
				$("#message").html(MSG_REQ_CARNO_KEYNO);
	    		$("#popupDialog").popup("open");
	    		return false;
			}
			if(_self.$carName.val().trim() == ""){
				//alert('차종을 입력하세요');
				//return false;
			}
			return true;
		};
		
}

$(document).ready(function(){
	document.addEventListener("deviceready", onDeviceReady, false);
	//navigator.app.overrideBackbutton(false);
	sessionCheck();
});

//PhoneGap is ready function
function onDeviceReady() {
	console.log("parking card onDevieReady");
	app.initialize();
}

