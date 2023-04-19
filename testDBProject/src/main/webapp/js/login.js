/**
 * 
 */

var app = new function() {
		
		_self = this;
		
		_self.$userId;
		_self.$password;
		_self.$passwordHash;
		_self.$mobile;

		_self.$contentType;
		_self.$nextUrl;
		
		this.initialize = function(){
			_self.initElement();
			_self.initData();
			_self.bindEvents();
		};
		
		
		
		this.initElement = function(){
			_self.$userId         = $("#userId");
			_self.$password       = $("#password");

		
			var telephoneNumber = cordova.require("cordova/plugin/telephonenumber");
			telephoneNumber.get(function(result) {
			        console.log("result = " + result);
			        
			        _self.$mobile = 0 + "" + result.substring(3);

			        _self.validateMobilePhone(_self.$mobile);
			    }, function() {
			        console.log("error");
			       
			    });
;
			
			
			_self.$userId.focus();
		};
		
		this.initData = function(){
			_self.$userId.val(window.sessionStorage['userId']);
			
			
		};
		
		this.bindEvents = function(){
			
			$("#pReceive").on("click", function(){
				
				_self.doLogin(LOGIN_TYPE_FRONT);
			});
			
			$("#pValet").on("click", function(){
				_self.doLogin(LOGIN_TYPE_VALET);
			});
		};
		
		// 로그인 처리
		this.doLogin = function(loginType){
			if(_self.validate()){
				navigator.notification.activityStart();
				
				var params = new Object;
				params.loginId      = _self.$userId.val();
				params.passwordHash = _self.$passwordHash;
				params.mobile       = _self.$mobile;
				params.loginType    = loginType;
				
				if(loginType == LOGIN_TYPE_FRONT){
					_self.$nextUrl = URL_PARKING_CARD; 
				}else{
					_self.$nextUrl = URL_CAR_REG;
				}
				
				$.ajax({
					url			: URL_LOGIN,
					method		: METHOD_POST,
					contentType : CONTENT_TYPE,
					dataType 	: DATA_TYPE,
					data		: params,
					success	: function(data){
						
						
						var count = data.count;

						
						if(data.message == "fail" && typeof count == "undefined" && typeof data.errorMsg == "undefined"){
					
							$("#message").html(MSG_WRONG_ID_PASS);
				    		$("#popupDialog").popup("open");
				    		
				    	}else if(data.message == "fail" && typeof count != "undefined"){
				    		
				    		if(count > 0){
				    			$("#message").html(MSG_WRONG_ID_PASS + '(' + count + '회 실패)');
				    		}else{
				    			$("#message").html(MSG_WRONG_ID_PASS);
				    		}
				    		$("#popupDialog").popup("open");
				    		
				    	}else if(data.message == "fail" && typeof data.errorMsg != "undefined"){
				    		
							$("#message").html(data.errorMsg);
							$("#popupDialog").popup("open");

						}else{
				    		if('localStorage' in window && window['localStorage'] !== null){
				    			var user = data.user;
				   		    	window.sessionStorage["userId"] = user.userId;
				   		    	window.sessionStorage["accessDate"] = getDateToStringTime();
				   		    	window.sessionStorage["userName"] = user.userName;
				   		    	window.sessionStorage["seqNo"] = data.seqNo;
								window.location.href = _self.$nextUrl
							}else{
								$("#message").html(MSG_NO_SUPPORT);
					    		$("#popupDialog").popup("open");
							}
				    		
				    	}
						
						

						navigator.notification.activityStop();
					},
					error		: function(xhr, status, error){
						$("#message").html("error : " + error);
			    		$("#popupDialog").popup("open");

						navigator.notification.activityStop();
					}
				});
			}
		}
		
		this.validate = function(){
			if(_self.$userId.val().trim() == ""){
				$("#message").html(MSG_REQ_ID);
	    		$("#popupDialog").popup("open");
				_self.$userId.focus();
				return false;
			}
			if(_self.$password.val().trim() == ""){
				$("#message").html(MSG_REQ_PASS);
	    		$("#popupDialog").popup("open");
				_self.$password.focus();
				return false;
			}
			_self.$passwordHash = sha1Hash(_self.$password.val())
			return true;
		};
	
		this.validateMobilePhone = function(mobilePhoneNo){
			
			var params = new Object();
			params.mobile = mobilePhoneNo;
			
			$.ajax({
				url			: URL_VALID_MOBILE_PHONE,
				method		: METHOD_POST,
				contentType : CONTENT_TYPE,
				dataType 	: DATA_TYPE,
				data		: params,
				success	: function(data){

					if(data.message == "success"){
						//alert(data.message);
					}else{
						alert(MSG_UNVALID_PHONE);
						if(navigator.app){
				    		navigator.app.exitApp();
						}else if(navigator.device){
							navigator.device.exitApp();
						}
					}

					
				},
				error		: function(xhr, status, error){
		    		alert(MSG_ERR_START);
		    		if(navigator.app){
			    		navigator.app.exitApp();
					}else if(navigator.device){
						navigator.device.exitApp();
					}
					

					
				}
			});
		}
		
}

$(document).ready(function(){
	document.addEventListener("deviceready", onDeviceReady, false);
	//document.addEventListener("backbutton", onBackKeyDown, false);
	disableBackKeyButton(document);
});

//PhoneGap is ready function
function onDeviceReady() {
	console.log("login onDevieReady");
	app.initialize();
}

