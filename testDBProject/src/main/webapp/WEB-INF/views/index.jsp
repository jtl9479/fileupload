<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
	<script type="text/javascript" src="${contextPath}/js/jquery-1.11.1.min.js"></script>
	<script type="text/javascript" src="${contextPath}/js/jquery.mobile-1.4.5.min.js"></script>
	<script type="text/javascript">
	$(document).ready(function(){
		$('#photoTaken').on("click", function(e){
		
				
	
		
		});
	});
	
	</script>
</head>
<body>
	<div class="sub_content">
			<ul class="photo_area">
				<li><span class="photo_wrap">사진1<img style="width: 100px; height: 100px"  id="carImg1" src="C:\test\images" alt="안됨"/></span></li>
			</ul>
			<div class="memo">
				<textarea cols="40" rows="10" name="memo" id="memo" placeholder="메모" class="txt_area"></textarea>
			</div>
			<ul class="ul_btn_area">
				<li><a href="#" id="photoTaken" class="ui-btn ui-btn-b left">사진촬영1</a></li>
				<li><a href="#" id="inCarComplete" data-ajax="false" class="ui-btn ui-btn-b right">주차완료</a></li>
			</ul>
		</div>
</body>
</html>