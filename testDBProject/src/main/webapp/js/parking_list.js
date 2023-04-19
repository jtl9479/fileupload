/**
 * 
 */

var app = new function() {
		
		_self = this;
//		
		_self.$accessDate;
		_self.$userName;
		_self.$logout;
		
		_self.$GPS;
		
		_self.$list_template;
		_self.$table_list;
		_self.$list_templateTr;
		
		_self.$pCarExitReq;
		_self.$pValet;
		_self.$pCarLoc;
		
		_self.$urlAjax;
		
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
			
			_self.$list_template = $("#list_template");
			_self.$list_templateTr = $("#list_template").find("tr");
			_self.$table_list = $("#table_list");
			
			_self.$pCarExitReq = $("#pCarExitReq");
			_self.$pValet = $("#pValet");
			_self.$pCarLoc = $("#pCarLoc");
			
			_self.$urlAjax =  contextPath + "/valet/mobile/anonymous/requestList.do";
		};
		
		this.initData = function(){
			
			_self.$accessDate.text(window.sessionStorage['accessDate']);
			_self.$userName.text(window.sessionStorage['userName']);
			var params = new Object();
			//params.userId = window.sessionStorage['userId'];
			//console.log("userid:" + window.sessionStorage['userId']);
			//alert(params.userId);
			$.ajax({
				url			: URL_REQUEST_OUT_LIST,
				method		: METHOD_POST,
				contentType : CONTENT_TYPE,
				dataType 	: DATA_TYPE,
				data		: params,
				success	: function(data){
					//alert(data.length)

					if(data.length > 0){
						
						$.each(data, function(){
							
							var parkingPlaceName = this.parkingPlaceName;
							var parkingAreaName = this.parkingAreaName;
							var carNo = this.carNo;
							
							if(parkingPlaceName == null || parkingPlaceName == ''){
								parkingPlaceName = '';
							}
							if(parkingAreaName == null || parkingAreaName == ''){
								parkingAreaName = '';
							}
							if(carNo == null || carNo == ''){
								carNo = '';
							}
							
							var tr = _self.$list_templateTr.clone();
							tr.attr('data-carNo', this.carNo);
							tr.attr('data-carName', this.carName);
							tr.attr('data-keyNo', this.keyNo);
							tr.attr('data-retDt', this.retDt);
							tr.attr('data-parkingPlaceNo', this.parkingPlaceNo);
							tr.attr('data-reqStatCodeName', this.reqStatCodeName);
							tr.attr('data-parkingPlaceName', this.parkingPlaceName);
							tr.attr('data-parkingAreaNo', this.parkingAreaNo == undefined ? 0 : this.parkingAreaNo );
							tr.attr('data-parkingAreaName', this.parkingAreaName);
							tr.attr('data-parkSeqNo', this.parkSeqNo);
							tr.attr('data-outMemo', this.outMemo);
							tr.attr('data-parkDetailSeqNo', this.parkDetailSeqNo);
							//alert(this.parkingPlaceName);
							tr.children("th").html(getDateToStringHour(this.reqDatetime));
							tr.find("#parkingPlaceName").html(parkingPlaceName + "-" + parkingAreaName);
							tr.find("#carNo").html(carNo);
							
							if("Y" == this.whileOutYn){
								tr.find("#reqStatCodeName").html(this.reqStatCodeName + '<br>' + WHILE_OUT_YN_CAR);
							}else{
								tr.find("#reqStatCodeName").html(this.reqStatCodeName);
							}
							
							tr.on("click",function(){
								$this = $(this);
								console.log('carNo : ' + $this.attr('data-carNo'));
								console.log('keyCardNo : ' + $this.attr('data-keyCardNo'));
								console.log('retDt : ' + $this.attr('data-retDt'));
								console.log('parkingPlaceNo : ' + $this.attr('data-parkingPlaceNo'));
								console.log('parkingPlaceName : ' + $this.attr('data-parkingPlaceName'));
								console.log('parkingNo : ' + $this.attr('data-parkingNo'));
								console.log('parkingName : ' + $this.attr('data-parkingName'));
								console.log('parkSeqNo : ' + $this.attr('data-parkSeqNo'));
								console.log('parkDetailSeqNo : ' + $this.attr('data-parkDetailSeqNo'));
								
								_self.$GPS.gpsStasus(function(){
								    //GPS is enabled!
									window.sessionStorage['carNo'] = $this.attr('data-carNo');
									window.sessionStorage['carName'] = $this.attr('data-carName');
									window.sessionStorage['keyNo'] = $this.attr('data-keyNo');
									window.sessionStorage['retDt'] = $this.attr('data-retDt');
									window.sessionStorage['parkingPlaceNo'] = $this.attr('data-parkingPlaceNo');
									window.sessionStorage['parkingPlaceName'] = $this.attr('data-parkingPlaceName');
									window.sessionStorage['parkingAreaNo'] = $this.attr('data-parkingAreaNo');
									window.sessionStorage['parkingAreaName'] = $this.attr('data-parkingAreaName');
									window.sessionStorage['parkSeqNo'] = $this.attr('data-parkSeqNo');
									window.sessionStorage['outMemo'] = $this.attr('data-outMemo');
									window.sessionStorage['parkDetailSeqNo'] = $this.attr('data-parkDetailSeqNo');
									
									// 출차등록
									var params = {};
								  	params.parkSeqNo       = window.sessionStorage['parkSeqNo'];
									params.carNo           = window.sessionStorage['carNo'] == 'undefined' ? '' : window.sessionStorage['carNo'];
									params.carName         = window.sessionStorage['carName'] == 'undefined' ? '' : window.sessionStorage['carName'];
									//params.userId          = window.sessionStorage['userId'];
									params.parkingAreaName = window.sessionStorage['parkingAreaName'] == 'undefined' ? '' : window.sessionStorage['parkingAreaName'];
									params.parkingPlaceNo  = window.sessionStorage['parkingPlaceNo'] == 'undefined' ? '' : window.sessionStorage['parkingPlaceNo'];
									params.parkingAreaNo   = window.sessionStorage['parkingAreaNo']=='null' ? 0 :window.sessionStorage['parkingAreaNo'] ;
									
									params.statCode= CODE_IS_PARKING_OUT_ING;
									
									//alert(getSessionData());
									$.ajax({
										url			: URL_REGIST_CAR,
										method		: METHOD_POST,
										contentType : CONTENT_TYPE,
										dataType 	: DATA_TYPE,
										data		: params,
										success	: function(data){
											if(data.message == "success"){
												window.sessionStorage['request'] = true;
												window.sessionStorage['reqCarNo'] = window.sessionStorage['carNo'];
												window.sessionStorage['reqKeyNo'] = window.sessionStorage['keyNo'];
												window.sessionStorage['reqCarName'] = window.sessionStorage['carName'];
												window.sessionStorage['parkingPlaceName'] = window.sessionStorage['parkingPlaceName'];
												window.sessionStorage['parkingAreaName'] = window.sessionStorage['parkingAreaName'];
												window.location.href = URL_VALET_MAIN;
											}else{
												alert(data.message);
											}
											navigator.notification.activityStop();
										},
										error:function (request, err, ex) {
										      alert(err + " ===>3 " + request.responseText + "\n" + ex);
										      navigator.notification.activityStop();
										     
										    }
										
									});
									
									
									//window.location.href = "./parking_out_ok.html";
								  },
								  function(){
								    //GPS is disabled!
									  navigator.notification.confirm(
											    '무선네트워크 사용과 GPS를 작동하셔야 합니다', // message
											     onConfirm,            // callback to invoke with index of button pressed
											    'GPS',           // title
											    ['확인','취소']     // buttonLabels
											);
										function onConfirm(buttonIndex) {
										    if(buttonIndex == 1){
										    	_self.$GPS.gpsStatusChange();
										    }
										};
								  });
								
							});
							
							_self.$table_list.append(tr);
							
						});
					}else{
						alert(MSG_REQLIST_IS_ZERO);
						
					}
					navigator.notification.activityStop();
				},
				error		: function(xhr, status, error){
					alert("error : " + error);
					navigator.notification.activityStop();
				}
			});
			
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
			/* 하단 페이지 이동 */
			// 출차 요청
			_self.$pCarExitReq.on("click", function(e){
				window.location.href = "./parking_list.html";
			});
			// 발렛
			_self.$pValet.on("click", function(e){
				window.location.href = "./car_reg.html";
			});
			// 차량위치 확인
			_self.$pCarLoc.on("click", function(e){
				alert(CAR_LIST_LOC_CANNOT);
				return;
			});
				
		};
		
}

$(document).ready(function(){
	document.addEventListener("deviceready", onDeviceReady, false);
	sessionCheck();
});

//PhoneGap is ready function
function onDeviceReady() {
	console.log("parking list onDevieReady");
	app.initialize();
}