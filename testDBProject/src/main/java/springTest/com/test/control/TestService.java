package springTest.com.test.control;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
import springTest.com.test.dao.CommonDAO;
 
@Service
public class TestService {
    
    @Autowired private CommonDAO commonDAO;
    
    public void dbtest() {
        
        Map<String, Object> tempMap = new HashMap<String, Object>();
        List<Object> resultList = new ArrayList<Object>();
        
        resultList = commonDAO.selectList("testProjectMapper.selectTable", tempMap);
        System.out.println(resultList);
    }
    
}