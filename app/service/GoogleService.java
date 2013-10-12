package service;

import java.io.IOException;
import java.io.StringWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GoogleService {
	private final static Logger log = LoggerFactory.getLogger(GoogleService.class);
	public String getTownNameByLatLong(Double latitude, Double longitude) {
		URI uri;
		String result = "";
		try {
			HttpClient client = new DefaultHttpClient();
			
			uri = new URI("http://www.google.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=false&types=political");
			HttpGet addressGet = new HttpGet(uri);
			
			HttpResponse response = client.execute(addressGet);
			
			StringWriter contentWriter = new StringWriter();
			IOUtils.copy(response.getEntity().getContent(), contentWriter);
			result = contentWriter.toString();
			System.out.println(result);
			
		} catch (URISyntaxException e) {
			e.printStackTrace();
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		 
		if(!"".equals(result)) {
			ObjectMapper mapper = new ObjectMapper();
			try {
				Map<String,Object> userData = mapper.readValue(result, Map.class);
				List<Map<String, Object>> address = (List<Map<String, Object>>)((List<Map>)userData.get("results")).get(0).get("address_components");
				
				for(Map<String, Object> map : address) {
					if(((List<String>)map.get("types")).contains("locality")) {
						return (String)map.get("long_name");
					}
				}
				System.out.println(userData);
			} catch (JsonParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (JsonMappingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		return "";

	}
}
