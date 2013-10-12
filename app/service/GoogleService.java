package service;

import java.io.IOException;
import java.io.StringWriter;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GoogleService {
	private final static Logger log = LoggerFactory.getLogger(GoogleService.class);
	public String getTownNameByLatLong(Double latitude, Double longitude) {
		URI uri;
		try {
			HttpClient client = new DefaultHttpClient();
			
			uri = new URI("http://www.google.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=false");
			HttpGet addressGet = new HttpGet(uri);
			
			HttpResponse response = client.execute(addressGet);
			
			StringWriter contentWriter = new StringWriter();
			IOUtils.copy(response.getEntity().getContent(), contentWriter);
			String result = contentWriter.toString();
			System.out.println(result);
			return result;
			
		} catch (URISyntaxException e) {
			e.printStackTrace();
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		 
		 

		return "";

	}
}
