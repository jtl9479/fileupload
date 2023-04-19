var contextFilePath="http://valet.shilla.net/common";
var contextPath="https://valet.shilla.net/common";

var URL_REQUEST_LIST = "./parking_list.html";
var URL_VALET_MAIN   = "./car_reg.html";
var URL_VIEW_MAP     = "./parking_loc_info.html";
var URL_LOGOUT       = "./login.html";
var URL_CAR_REG      = "./car_reg.html";
var URL_CAR_PHOTO    = "./photo.html";
var URL_PARKING_CARD = "./parking_card.html";
var URL_PARKING_FINISH = "./parking_finish.html";
var URL_PARKING_OUT_OK =  "./parking_out_ok.html";

var URL_VALID_MOBILE_PHONE = contextPath + "/identity/anonymous/mobile/validMobilePhoneNo.do";
var URL_VALID_NFC_CARD = contextPath + "/identity/anonymous/mobile/validNfcNo.do";
var URL_REGIST_CARD  = contextPath + "/valet/mobile/anonymous/frontRegist.do";
var URL_GET_CAR_INFO = contextPath + "/valet/mobile/anonymous/view.do";
var URL_GET_CAR_INFO_FRONT = contextPath + "/valet/mobile/anonymous/frontCardCheck.do";
var URL_REGIST_CAR   = contextPath + "/valet/mobile/anonymous/registeCar.do";
var URL_REGIST_GPS   = contextPath + "/valet/mobile/anonymous/registeCarLocation.do";
var URL_REGIST_PHOTO = contextFilePath + "/valet/mobile/anonymous/registeCarPhotoSaveOne.do";
var URL_LOGIN        = contextPath + "/identity/anonymous/mobile/login.do";
var URL_REGIST_LOGOUT= contextPath + "/identity/anonymous/mobile/loginout.do";
var URL_VIEW_CAR_MAP = contextPath  + "/valet/mobile/anonymous/viewmap.do";
var URL_REQUEST_GET_LIST = contextPath + "/valet/mobile/anonymous/requestList.do";
var URL_GET_PARKING_PLACE_LIST = contextPath + "/valet/mobile/anonymous/parkingPlaceList.do";
var URL_GET_PARKING_AREA_LIST  = contextPath + "/valet/mobile/anonymous/parkingPlaceAreaList.do";
var URL_CANCEL = contextPath  + "/valet/mobile/anonymous/cancel.do";
var URL_VIEW = contextPath  + "/valet/mobile/anonymous/view.do";
var URL_REQUEST_OUT_LIST = contextPath + "/valet/mobile/anonymous/requestList.do"
var URL_DIRECT_OUT_CAR = contextPath + "/valet/mobile/anonymous/directOutCar.do"
var URL_SESSION_CHECK = contextPath + "/identity/anonymous/mobile/sessionCheck.do"

var MSG_LOGOUT   = "로그아웃 하시겠습니까?";
var MSG_REQ_ID   = "아이디를 입력해주세요.";
var MSG_REQ_PASS = "비밀번호를 입력해주세요.";
var MSG_WRONG_ID_PASS = "아이비/비밀번호가 가 틀립니다.<br><br>아이디/비밀번호를 확인하세요.";
var MSG_NO_SUPPORT    = "현재 브라우저는 WebStorage를 지원하지 않습니다";

var MSG_REQ_NFC_CARD = "고객카드를 입력하세요.";
var MSG_REQ_KEY_CARD = "키카드를 입력하세요.";

var MSG_ALEADY_EXIST_CARD  = "이미 입력된 카드입니다.";
var MSG_ALEADY_ISSUED_CARD = "이미 발급된 카드입니다.";
var MSG_ALEADY_COMPLE_PARKING_OUT = "이미 출차완료된 차량입니다.";
var MSG_ISSUE_CARD        = "발급 요청이 완료 되었습니다";
var MSG_REQ_PARKING_PLACE = "주차장을 선택해주세요.";
var MSG_REQ_PARKING_AREA  = "주차구역을 입력해주세요.";
var MSG_REQ_PARKING_AREA_SELECT  = "주차구역을 선택해주세요.";

var MSG_ERR_ISSUE_CARD = "오류로 발급이 취소되었습니다.";
var MSG_ERR_NEW_REGIST_CAR_COMPLET = "오류로 챠량등록이 취소되었습니다.";
var MSG_ERR_START   = "오류로 앱을 시작할수 없습니다. 관리자에게 문의하시기 바랍니다.";

var MSG_REQ_CARNO_KEYNO = "차량번호 혹은 키번호를 입력하셔야 합니다.";
var MSG_NEW_REGIST_CAR_COMPLET = "챠량을 등록하였습니다.";
var MSG_START_GPS = "무선네트워크 사용과 GPS를 작동하셔야 합니다";
var MSG_STOP_GPS  = "밧데리 소모방지를 위해서 GPS를 작동을 멈추셔야 합니다";

var MSG_REGIST_CAR_PHOTO = "주차완료 처리를 합니다.";

var MSG_REQLIST_IS_ZERO = "출차요청내역이 없습니다.";

var MSG_COMPLET_PARKING_OUT = "출차완료 처리를 하였습니다.";
var MSG_COMPLET_PARKING_IN  = "주차완료 처리를 하였습니다.";

var MSG_TITLE_LOGOUT   = "로그아웃";
var MSG_BUTTON_CONFIRM = "확인";
var MSG_BUTTON_CANCEL  = "취소";
var MSG_BUTTON_LOGINPAGE = "로그인페이지로 이동";
var MSG_BUTTON_APPEXIT   = "앱종료하기";

var MSG_UNVALID_PHONE = "인증되지 않은 휴대폰입니다. 등록 후 사용하시기 바랍니다.";

var MSG_REQ_PHOTO = "사진을 한장 이상 등록하셔야 합니다.";

var MSG_NO_REG_CARD = "등록되지 않은 NFC카드 입니다.<br><br> 등록 후 사용하시기 바랍니다."

var MSG_CANCEL_IN = "입차를 취소합니다.";
var MSG_CANCEL_OUT = "출차를 취소합니다.";

var WHILE_OUT_YN_MSG = "잠출 요청된 차량입니다.";
var WHILE_OUT_YN_CAR = "(잠출)";

var CAR_LIST_LOC_CANNOT = "출차요청 화면에서는 차량위치를 확인할수 없습니다."
var CAR_CARD_LOC_CANNOT = "접수 화면에서는 차량위치를 확인할수 없습니다."

var MSG_NO_REG_CAR = "입차차량이 아닙니다.<br><br> 차량번호를 확인해 주세요."
	

var CODE_IS_RECIVE_CAR         = "000";
var CODE_IS_PARKING_IN_ING     = "010"
var CODE_IS_PARKING_IN_COMPLET = "011";

var CODE_IS_PARKING_OUT_ING     = "020"
var CODE_IS_PARKING_OUT_COMPLET = "021"
	
var CODE_IS_PARKING_REQ_CONFIRM = "011";

var CODE_IS_TICKET_GENARAL = "001";

var REGISTE_CAR_TYPE_PARKING_IN  = "IN";
var REGISTE_CAR_TYPE_PARKING_OUT = "OUT";
var REGISTE_CAR_TYPE_PARKING_MAP  = "MAP";

var REGISTE_MODE_EXIST = "EXIST";
var REGISTE_MODE_NEW = "NEW";
var REGISTE_MODE_DIRECT = "DIRECT";

var METHOD_POST  = "post";
var DATA_TYPE    = "json";
var CONTENT_TYPE = "application/x-www-form-urlencoded; charset=UTF-8";

var LOGIN_TYPE_FRONT = "front";
var LOGIN_TYPE_VALET = "valet";


function viewLoginInfo(){
	// Check browser support
	if (typeof(Storage) != "undefined") {

	    // Retrieve
	    $("#userName").html(localStorage.getItem("userName"));
	    $("#logindate").html(localStorage.getItem("logindate"));
	    
	    $("#userId").val(localStorage.getItem("userId"));
	    $("#parkSeqNo").val(localStorage.getItem("parkSeqNo"));
	} else {
	    //document.getElementById("userName").innerHTML = "Sorry, your browser does not support Web Storage...";
	}
}

function getDateToStringTime(){
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	var hour = d.getHours();
	var minutes = d.getMinutes();
	var second = d.getSeconds();

	return year + "-" + preZero(month) + "-" + preZero(day) + " "  +  preZero(hour)  + ":" + preZero(minutes) + ":"  + preZero(second);
}

function preZero(val){
	
	var str = val + "";

	if(str.length == 1){
		str = '0' + str;
	}
	return str;
}

function getDateToStringHour(datetime){
	var d = new Date();
	d.setTime(datetime);
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	
	var hour = d.getHours().toString();
	if(hour.length == 1){
		hour = "0" + hour;
	}
	var minutes = d.getMinutes().toString();
	if(minutes.length == 1){
		minutes = "0" + minutes;
	}
	
	var second = d.getSeconds();

	return hour  + ":" + minutes;
}

function nullToString(str){

	return (str == null ? "" : str);
}

function logoutConfirm(){
	
}
function logout(){
	
	
	var userId = window.sessionStorage['userId'];
	var params = new Object();
	params.seqNo = window.sessionStorage['seqNo'];
	params.loginId = window.sessionStorage['userId'];
	
	$.ajax({ 
		url         : URL_REGIST_LOGOUT,
		method		: METHOD_POST,
		contentType : CONTENT_TYPE,
		dataType 	: DATA_TYPE,						    
	    data: params, 
	    success: function(data){
	    	
	    } 
		,beforeSend:function(){
	       // $('.wrap-loading').removeClass('display-none');
	    }
	    ,complete:function(){
	       
	       // $('.wrap-loading').addClass('display-none');
	
	    }
	    ,
	    error:function (request, err, ex) {
	      
	     
	    }
	  });
	sessionStorage.clear();
	window.sessionStorage['userId'] = userId
	window.location.href = URL_LOGOUT;
}

function getSessionData(){
	
	var data = "";
	
	data += "parkSeqNo" + " : " + window.sessionStorage["parkSeqNo"] + "\n";
	data += "carNo" + " : " + window.sessionStorage["carNo"] + "\n";
	data += "carName" + " : " + window.sessionStorage["carName"] + "\n";
	data += "parkingPlaceNo" + " : " + window.sessionStorage["parkingPlaceNo"] + "\n";
	data += "parkingAreaNo" + " : " + window.sessionStorage["parkingAreaNo"] + "\n";
	data += "parkingAreaName" + " : " + window.sessionStorage["parkingAreaName"] + "\n";
	data += "nfcNo" + " : " + window.sessionStorage["nfcNo"]  + "\n";
	data += "keyNo" + " : " + window.sessionStorage["keyNo"]  + "\n";
	
//	alert(data);
}

function clearStorageData(){
	window.sessionStorage["parkSeqNo"] = "";
	window.sessionStorage["carNo"] = "";
	window.sessionStorage["carName"] = "";
	window.sessionStorage["parkingPlaceNo"] = "";
	window.sessionStorage["parkingAreaNo"] = "";
	window.sessionStorage["parkingAreaName"] = "";
	window.sessionStorage["nfcNo"] = "";
	window.sessionStorage["keyNo"] = "";
	
	window.sessionStorage["reqCarNo"] = "";
	window.sessionStorage["reqCarName"] = "";
	window.sessionStorage["reqKeyNo"] = "";
}

function message(massage,url){
	$("#popupDialogUrl").attr("href",url);
	$("#message").html(massage);
	//document.getElementById("parkingComplet").href="#popupDialog";
	$("#popupDialog").popup("open");
	if(url != ""){
		window.location.href=url;
	}
	
}


function disableBackKeyButton(doc){
	doc.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown(){
}

function sessionCheck(){
	
	var params = new Object();
	params.session = '';
	
	$.ajax({
		url			: URL_SESSION_CHECK,
		method		: METHOD_POST,
		contentType : CONTENT_TYPE,
		dataType 	: DATA_TYPE,
		data		: params,
		success	: function(data){

			if(data.message == "success"){
				
			}else{
				alert('로그인 후 이용가능합니다.');
				window.location.href = URL_LOGOUT;
			}

			
		},
		error		: function(xhr, status, error){
			alert("error : " + error);
			//$("#message").html("error : " + error);
    		//$("#popupDialog").popup("open");
    		alert(MSG_ERR_START);
    		if(navigator.app){
	    		navigator.app.exitApp();
			}else if(navigator.device){
				navigator.device.exitApp();
			}
			

			
		}
	});
}

function maxLengthCheck(object){
	   if (object.value.length > object.maxLength){
	    object.value = object.value.slice(0, object.maxLength);
	   }    
	  }
