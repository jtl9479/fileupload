<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
<form action="/admin/goods/goodsRegister" method="post" autocomplete="off" enctype="multipart/form-data">
    <div class="card-footer text-muted">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroupFileAddon01">Upload</span>
            </div>
            <div class="custom-file">
                <input accept="*" type="file" id="inputGroupFile01" name="file" class="custom-file-input"
                    aria-describedby="inputGroupFileAddon01" />
                <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
            </div>
        </div>
        <div class="select_img">
            <img src="" />
        </div>
        <script>
            $("#inputGroupFile01").change(function () {
                if (this.files && this.files[0]) {
                    var reader = new FileReader;
                    reader.onload = function (data) {
                        $(".select_img img").attr("src", data.target.result).width(500);
                    }
                    reader.readAsDataURL(this.files[0]);
                }
            });
        </script>
        <div>
            <button type="submit" id="register_Btn" class="btn btn-primary">등록</button>
        </div>
    </div>
</form>
</body>
</html>