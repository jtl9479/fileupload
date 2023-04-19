package springTest.com.test.control;

import java.awt.image.BufferedImage;
import java.io.File;
import java.net.URL;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;

import net.sf.json.JSONObject;
 
@Controller
public class TestController {
    
    @Autowired private TestService testService;
 
    @RequestMapping(value="/", method={RequestMethod.GET, RequestMethod.POST})
    public String index() {
    	
    	return "index";
    }

    @RequestMapping(value="/photo.do", method={RequestMethod.GET, RequestMethod.POST})
    public String urltest() {
        
        return "photo";
    }
    
    @RequestMapping(value="/index.do", method={RequestMethod.GET, RequestMethod.POST})
    public String urlindex() {
    	
    	return "index";
    }
    @RequestMapping(value="/testView.do", method={RequestMethod.GET, RequestMethod.POST})
    public String urlTest() {
    	
    	testService.dbtest();
    	
    	return "testView";
    }
    @RequestMapping(value="/tset.do", method={RequestMethod.GET, RequestMethod.POST})
    public String tset() {
    	
    	return "tset";
    }

    @RequestMapping(value="/tset2.do", method={RequestMethod.GET, RequestMethod.POST})
    public String tset2() {
    	
    	return "tset2";
    }

    @RequestMapping(value="/file.do", method={RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public JSONObject index_ajax(HttpServletRequest request, HttpServletResponse response) {
    	
    	JSONObject resMap = new JSONObject();
    	
    	resMap.put("res", "ok");
    	return resMap;
    }
    
    @RequestMapping("/uploadPhotos")
    @ResponseBody
    public String uploadPhotos(MultipartHttpServletRequest request) {
      // 이미지 파일을 가져옵니다.
      MultipartFile img1 = request.getFile("img1");
      MultipartFile img2 = request.getFile("img2");
      MultipartFile img3 = request.getFile("img3");
      MultipartFile img4 = request.getFile("img4");
      
      return "success";
    } 
      
    
}