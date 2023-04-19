package springTest.com.test.dao;
 
import java.util.List;
import java.util.Map;
 
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
 
 
 
@Component
public class CommonDAO {
    
    @Autowired 
    private SqlSession sqlSession;
    
    public void setSqlSessionTemplate(SqlSession sqlSession)
    {
        this.sqlSession = sqlSession;
        System.out.println(sqlSession);
    }
    
    
    
    // insert DAO
    public int insert(String xmlId, Map<String, Object> paramMap)
    {
        
        return sqlSession.insert(xmlId, paramMap);
    }
    
 
    // update DAO
    public int update(String xmlId, Map<String, Object> paramMap)
    {
        
        return sqlSession.update(xmlId, paramMap);
    }
    
    
    // delete DAO
    public int delete(String xmlId, Map<String, Object> paramMap)
    {
        
        return sqlSession.delete(xmlId, paramMap);
    }
    
    
    // select_one DAO
    public Map<String, Object> selectOne(String xmlId, Map<String, Object> paramMap)
    {
        
        Map<String, Object> map = sqlSession.selectOne(xmlId, paramMap);
        if (map == null) {
            return null;
        } else {
            return map;
        }
        
    }
    
    
    // select_list DAO
    public List<Object> selectList(String xmlId, Map<String, Object> paramMap)
    {
    	
    	return sqlSession.selectList(xmlId,paramMap);
    	
        
    }
    
    
}