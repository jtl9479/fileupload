<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
	<script type="text/javascript" src="/js/common.js"></script>
	<script  src="http://code.jquery.com/jquery-latest.min.js"></script>
	<script type="text/javascript">
	$( document ).ready(function() {
		
		var img = 'test';
		
		$.ajax({
			url			: '/testImageDelte.do',
			method		: METHOD_POST,
			contentType : CONTENT_TYPE,
			dataType 	: DATA_TYPE,
			data		: {'img':img},
			success	: function(data){
				
			},
			error		: function(xhr, status, error){
			}
		});
		
	});	
	</script>
</head>
<body>
</body>
</html>