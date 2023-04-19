package springTest.com.test.control;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.file.DirectoryNotEmptyException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.swing.filechooser.FileSystemView;
import javax.xml.bind.DatatypeConverter;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class ImgCon {

	ResourceLoader resourceLoader;
	
    @RequestMapping(value="/testImage.do", method={RequestMethod.GET, RequestMethod.POST})
    public String testImage(HttpServletRequest request, HttpServletResponse response, String img) throws IOException {
		//String imageURL = "https://blog.kakaocdn.net/dn/VIxFi/btqZqqf3QFS/n2otuLtHQo8TQVOwMAmmbk/img.png";
    	String data = img.split(",")[1];
		
    	byte[] imageBytes = DatatypeConverter.parseBase64Binary(data);
		try {
		//	URL imgURL = new URL(imageURL);
			String extension = "jpeg"; // 확장자
			String fileName = "test"; // 이미지 이름
			
			//BufferedImage image = ImageIO.read(imgURL);
			BufferedImage bufImg = ImageIO.read(new ByteArrayInputStream(imageBytes));
			File file = new File("C:/rkdfbdrkd/workspace11.01/testDBProject/src/main/webapp/ia/" + fileName + "." + extension);
			if(!file.exists()) { // 해당 경로의 폴더가 존재하지 않을 경우
				file.mkdirs(); // 해당 경로의 폴더 생성
			}
			
			ImageIO.write(bufImg, extension, file); // image를 file로 업로드
			System.out.println("이미지 업로드 완료!");
		} catch (Exception e) {
			e.printStackTrace();
		}
        return "Image uploaded successfully!";
    }
    @RequestMapping(value="/testImageDelte.do", method={RequestMethod.GET, RequestMethod.POST})
    public String testImageDelte(HttpServletRequest request, HttpServletResponse response, String img) throws IOException {

    	Path filePath = Paths.get("C:/rkdfbdrkd/workspace11.01/testDBProject/src/main/webapp/ia/test.jpeg");
    	
        try {
            // 파일 삭제
            Files.delete(filePath);
			System.out.println("이미지 삭제 완료!");            
        } catch (NoSuchFileException e) {
            System.out.println("삭제하려는 파일/디렉토리가 없습니다");
        } catch (DirectoryNotEmptyException e) {
            System.out.println("디렉토리가 비어있지 않습니다");
        } catch (IOException e) {
            e.printStackTrace();
        }    	
    	
    	return "Image delete successfully!";
    }
}
