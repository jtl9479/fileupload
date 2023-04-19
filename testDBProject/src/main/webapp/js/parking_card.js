/**
 * 
 */

var app = new function() {
		
		_self = this;
		
		_self.$accessDate;
		_self.$userName;
		_self.$logout;
		
		_self.$carNo;
		_self.$ticketCode;
		_self.$nfcNo;
		_self.$keyNo;
		_self.$labelNfcNo;
		_self.$labelKeyNo;
		_self.$carName;
		_self.$memo;
		_self.$pIssue;
		
		_self.$pCarExitReq;
		_self.$pValet;
		_self.$pCarLoc;
		
		_self.$selectTag;
		
		this.initialize = function(){
			_self.initElement();
			_self.bindEvents();
			_self.initData();
		};
		
		this.initElement = function(){
			
			_self.$accessDate = $("#accessDate");
			_self.$userName = $("#userName");
			_self.$logout = $("#logout");
			
			_self.$carNo = $("#carNo");
			_self.$ticketCode = $("#ticketCode");
			_self.$nfcNo = $("#nfcNo");
			_self.$keyNo = $("#keyNo");
			_self.$labelNfcNo = $("#labelNfcNo");
			_self.$labelKeyNo = $("#labelKeyNo");
			_self.$carName = $("#carName");
			_self.$memo = $("#memo");
			
			_self.$pIssue = $("#pIssue");
			_self.$pCarExitReq = $("#pCarExitReq");
			_self.$pValet = $("#pValet");
			_self.$pCarLoc = $("#pCarLoc");
			//_self.$carNo.focus();
		};
		
		this.initData = function(){
			_self.$accessDate.text(window.sessionStorage['accessDate']);
			_self.$userName.text(window.sessionStorage['userName']);
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

			
			nfc.addTagDiscoveredListener(
				_self.onNfc, // tag successfully scanned
				function (status) { // 태그가 성공적으로 찾아진다
					console.log("status : " + status); // 성공시 OK
				},
				function (error) { // 리스너가 성공적으로 초기화된다
					alert("error : " + JSON.stringify(error));
				}
			);
			
			
			/* 고객 카드 클릭 */
			_self.$nfcNo.on("click", function(e){
				e.preventDefault();
				_self.$selectTag = $(this);
			});
			
			_self.$labelNfcNo.on("click", function(e){
				_self.$nfcNo.val("");
			});
			
			/* 키카드 클릭 */
			_self.$keyNo.on("click", function(e){
				e.preventDefault();
				_self.$selectTag = $(this);
			});
			
			_self.$labelKeyNo.on("click", function(e){
				_self.$keyNo.val("");
			});
			
			/* 포커스 시 처리 */
			_self.$nfcNo.on("focus", function(e){
				$(this).val("");
				window.sessionStorage['currentFocus'] = "nfcNo";
			});		
			
			/* 포커스 시 처리 */
			_self.$keyNo.on("focus", function(e){
				$(this).val("");
				window.sessionStorage['currentFocus'] = "keyNo";
			});
			
			/* 포커스 시 처리 */
			_self.$nfcNo.on("blur", function(e){
			
				window.sessionStorage['currentFocus'] = "";
			});		
			
			/* 포커스 시 처리 */
			_self.$keyNo.on("blur", function(e){
				
				window.sessionStorage['currentFocus'] = "";
			});

			
			/* 발급 버튼 클릭 */
			_self.$pIssue.on("click", function(e){
				e.preventDefault();
				
				if(_self.validate()){
				    navigator.notification.activityStart();
				 
					var params = new Object();
					
					
					params.carNo       = _self.$carNo.val();
					params.nfcNo       = _self.$nfcNo.val();
					params.keyNo       = _self.$keyNo.val();
					params.carName     = _self.$carName.val();
					params.memo        = _self.$memo.val();
					params.statCode    = CODE_IS_RECIVE_CAR;
					params.ticketCode      = _self.$ticketCode.is(":checked") == true ? '002' : '001';
					
					$.ajax({
						url			: URL_REGIST_CARD,
						method		: METHOD_POST,
						contentType : CONTENT_TYPE,
						dataType 	: DATA_TYPE,
						data		: params,
						success	: function(data){
							if(data.success == false && data.success != "undifined"){
								$("#message").html(MSG_ERR_ISSUE_CARD);
					    		$("#popupDialog").popup("open");
							}else{
								$("#message").html(MSG_ISSUE_CARD);
					    		$("#popupDialog").popup("open");
								_self.clear();
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
				alert(CAR_CARD_LOC_CANNOT);
				return;
//				window.location.href = URL_VIEW_MAP;
			});
		};
		
		/*
		 * 메시지 div의 @nfcEvent로부터 태그 ID 출력
		 */
		this.onNfc = function(nfcEvent) {
			var tag = nfcEvent.tag;
//			console.log(nfc.bytesToHexString(tag.id));
			var tagId = parseInt(nfc.bytesToHexString(tag.id),16);
			//_self.$selectTag.val(tagId);
			
			// nfc카드 체크
			//alert(_self.validNfc(tagId));
			
//			if(!_self.validNfc(tagId)){
//				$("#message").html(MSG_NO_REG_CARD);
//	    		$("#popupDialog").popup("open");
//				return ;
//			}
//			
//			!_self.validNfc(tagId)
//			//alert(_self.validNfc(tagId));
			
			if(tagId ==_self.$nfcNo.val() || tagId==_self.$keyNo.val()){
				$("#message").html(MSG_ALEADY_EXIST_CARD);
	    		$("#popupDialog").popup("open");
	    		
			}else{
				var params = new Object();
				params.nfcNo = tagId;
				$.ajax({
					url			: URL_VALID_NFC_CARD,
					method		: METHOD_POST,
					contentType : CONTENT_TYPE,  
					dataType 	: DATA_TYPE,
					data		:  params ,
					success	: function(data){
						//alert(data.message)
						if(data.message == "success"){
							_self.aleadyIssuedCardCheck(tagId);
						}else{
							$("#message").html(MSG_NO_REG_CARD);
				    		$("#popupDialog").popup("open");
				    		return;
						}
					},
					error		: function(xhr, status, error){
						$("#message").html("error : " + error);
			    		$("#popupDialog").popup("open");
			    		//window.location.href = URL_CAR_REG;
						navigator.notification.activityStop();
					}
				});	
			}
		};
		
		this.aleadyIssuedCardCheck = function(tagId){
			var currentFocus = window.sessionStorage['currentFocus'] == undefined ? "" : window.sessionStorage['currentFocus'];
			
			var params = new Object();
			params.statCode = "021";
			params.nfcNo = tagId;
			params.keyNo = tagId;
			
			               
			// 이미 발급된 카드인지 체크
			$.ajax({
				url			: URL_GET_CAR_INFO_FRONT,
				method		: METHOD_POST,
				contentType : CONTENT_TYPE,  
				dataType 	: DATA_TYPE,
				data		:  params ,
				success	: function(data){
					
					if(data.count > 0){
						$("#message").html(MSG_ALEADY_ISSUED_CARD);
			    		$("#popupDialog").popup("open");
					}else{
						if(currentFocus == ""){
							// 고객카드 빈값 체크
							if(_self.$nfcNo.val()==""){
								_self.$nfcNo.val(tagId);
							}else{
								_self.$keyNo.val(tagId);
							}
						}else{
							if(currentFocus=="nfcNo"){
								_self.$nfcNo.val(tagId);
								_self.$keyNo.focus();

							}else{
								_self.$keyNo.val(tagId);
								_self.$carName.focus();

							}
						}
					}
				},
				error		: function(xhr, status, error){
					$("#message").html("error : " + error);
		    		$("#popupDialog").popup("open");
		    		//window.location.href = URL_CAR_REG;
					navigator.notification.activityStop();
				}
			});
		}
		
		
		/* 발급 시 데이터 체크 */
		this.validate = function(){
			if(_self.$carNo.val().trim() == ""){
				//alert('차령번호를 입력하세요');
				//return false;
			}
			if(_self.$nfcNo.val().trim() == ""){
				//alert('고객카드를 입력하세요');
				$("#message").html(MSG_REQ_NFC_CARD);
	    		$("#popupDialog").popup("open");
				return false;
			}
			if(_self.$keyNo.val().trim() == ""){
				//alert('키카드를 입력하세요');
				$("#message").html(MSG_REQ_KEY_CARD);
	    		$("#popupDialog").popup("open");
				return false;
			}
			if(_self.$carName.val().trim() == ""){
				//alert('차종을 입력하세요');
				//return false;
			}
			return true;
		};
		
		this.isNfcNo = function(tagId){
			if(tagId ==_self.$nfcNo.val() || tagId==_self.$keyNo.val()){
				$("#message").html(MSG_ALEADY_EXIST_CARD);
	    		$("#popupDialog").popup("open");
	    		return true;
			}
			
			return false;
		}
		
		/*
		 * 발급 완료 초기화
		 */
		this.clear = function(){
			$(":text").val("");
			$('input[type="number"]').val("");
			$("#ticketCode").prop("checked",false).checkboxradio("refresh");
			_self.$carNo.focus();
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