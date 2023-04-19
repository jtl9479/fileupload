<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>THESILLA</title>
	<link rel="stylesheet" href="${contextPath}/css/jquery.mobile-1.4.5.min.css">
	<link rel="stylesheet" href="${contextPath}/css/m_vallet.css">
	<script type="text/javascript" src="${contextPath}/js/jquery-1.11.1.min.js"></script>
	<script type="text/javascript" src="${contextPath}/js/jquery.mobile-1.4.5.min.js"></script>
	<script type="text/javascript" src="${contextPath}/js/json2.js"></script>
	<script type="text/javascript" src="${contextPath}/js/photo.js"></script>
	<script type="text/javascript" src="${contextPath}/js/common.js"></script>
</head>
<body>
	<div data-role="page" class="sub">
		<!--  header -->
		<div data-role="header" data-position="fixed" class="header">
			<h1 class="logo">THE SHILLA</h1>
		</div>
		<!--  /header -->
		<div role="sub" class="ui-content">
			<div class="user_area">
				<div class="user_info">
					<span id="accessDate" class="date"></span>
					<span id="userName" class="name"></span>
				</div>
				<a href="#" id="logout" data-ajax="false" class="ui-btn logout">로그아웃</a>
			</div>
			<h2>사진촬영</h2>
			<div class="sub_content">
				<ul class="photo_area">
					<li><span class="photo_wrap">사진1<img style="width: 100px; height: 100px"  id="carImg1" src="" /></span></li>
					<li><span class="photo_wrap">사진2<img style="width: 100px; height: 100px"  id="carImg2" src="" /></span></li>
					<li><span class="photo_wrap">사진3<img style="width: 100px; height: 100px"  id="carImg3" src="" /></span></li>
					<li><span class="photo_wrap">사진4<img style="width: 100px; height: 100px"  id="carImg4" src="" /></span></li>
				</ul>
				<div class="memo">
					<textarea cols="40" rows="10" name="memo" id="memo" placeholder="메모" class="txt_area"></textarea>
				</div>
				<ul class="ul_btn_area">
					<li><a href="#" id="photoTaken" class="ui-btn ui-btn-b left">사진촬영</a></li>
					<li><a href="#" id="inCarComplete" data-ajax="false" class="ui-btn ui-btn-b right">주차완료</a></li>
				</ul>
			</div>
		</div><!--  /content -->
		<div data-role="footer" class="ui-footer" data-position="fixed">
			<ul>
				<li class="btn_A"><a href="#" id="pCarExitReq" data-ajax="false" class="ui-btn ui-btn-b">출차요청</a></li>
				<li class="btn_B"><a href="#" id="pValet" data-ajax="false" class="ui-btn ui-btn-b rigth">발렛</a></li>
				<li class="btn_C"><a href="#" id="pCarLoc" data-ajax="false" class="ui-btn ui-btn-b right">차량위치확인</a></li>
			</ul>
		</div><!-- /footer -->
		<!--  popup -->
		 <div data-role="popup" id="popupDialog" data-overlay-theme="b" data-theme="b" data-dismissible="false">
	            <div role="main" class="ui-content pop_msg">
	                <p><span id="message"></span></p>
	                <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b btn_pop" data-rel="back">확인</a>
	            </div>
        	</div>  
		<!-- // popup -->
		<div data-role="panel" data-position-fixed="true" data-display="push" data-theme="b" id="nav-panel"></div>
	</div>

</body>
</html>