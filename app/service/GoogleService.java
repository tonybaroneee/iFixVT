package service;

import java.io.IOException;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

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

import db.models.Town;
import db.repositories.TownRepository;

public class GoogleService {
	@Inject
	TownRepository townRepository;
	
	private final static Logger log = LoggerFactory.getLogger(GoogleService.class);
	public static final String GMAPS_URI = "http://www.google.com/maps/api/geocode/json?";
	public static final String MAPQUEST_URI = "http://open.mapquestapi.com/geocoding/v1/reverse?key=Fmjtd%7Cluubnuuan9%2Crl%3Do5-9uygu0&";
	public String getTownNameByLatLong(Double latitude, Double longitude) {
		
		String reverseGeocode = MAPQUEST_URI + "location=" + latitude + "," + longitude;
		String result = getJsonResult(reverseGeocode);
		if(!"".equals(result)) {
			ObjectMapper mapper = new ObjectMapper();
			try {
				Map<String,Object> userData = mapper.readValue(result, Map.class);
				List locations = ((List)((List<Map>) userData.get("results")).get(0).get("locations"));
				Map location = (Map)locations.get(0);
				String townName = (String)location.get("adminArea5");
				
				return townName;
			} catch (JsonParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (JsonMappingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (Exception e) {
				System.out.println(e.getMessage());
			}
		}

		return "";

	}
	
	public Map<String, Double> getLatLngForTowns() {
		List<Town> towns = townRepository.findAll();
		int count = 0;
		for(Town town : towns) {
			count++;
			try {
				String reverseGeocode = GMAPS_URI + "address=" + URLEncoder.encode(town.getName() + ", VT", "UTF-8") + "&sensor=false";
				String result = getJsonResult(reverseGeocode);
				if(!"".equals(result)) {
					ObjectMapper mapper = new ObjectMapper();
					try {
						Map<String,Object> userData = mapper.readValue(result, Map.class);
						
						Map<String, Double> location = (Map<String, Double>)((Map<String, Object>)((List<Map>)userData.get("results")).get(0).get("geometry")).get("location");
						
						Double lat = location.get("lat");
						Double lng = location.get("lng");
						
						Map<String, Map<String, Double>> viewPort = (Map<String, Map<String, Double>>)((Map<String, Object>)((List<Map>)userData.get("results")).get(0).get("geometry")).get("viewport");
						
						Double nelat = viewPort.get("northeast").get("lat");
						Double nelng = viewPort.get("northeast").get("lng");
						Double swlat = viewPort.get("southwest").get("lat");
						Double swlng = viewPort.get("southwest").get("lng");
						
						town.setLatitude(lat);
						town.setLongitude(lng);
						town.setViewPortNorthEastLatitude(nelat);
						town.setViewPortNorthEastLongitude(nelng);
						town.setViewPortSouthWestLatitude(swlat);
						town.setViewPortSouthWestLongitude(swlng);
						
						townRepository.save(town);
						System.out.println(town.getName() + " : " + count);
						Thread.sleep(250);
					} catch (JsonParseException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					} catch (JsonMappingException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return null;
	}
	private String getJsonResult(String uriString) {
		URI uri;
		String result = "";
		try {
			HttpClient client = new DefaultHttpClient();
			
			uri = new URI(uriString);
			HttpGet addressGet = new HttpGet(uri);
			
			HttpResponse response = client.execute(addressGet);
			
			StringWriter contentWriter = new StringWriter();
			IOUtils.copy(response.getEntity().getContent(), contentWriter);
			result = contentWriter.toString();
//			System.out.println(result);
			
		} catch (URISyntaxException e) {
			log.error("Boned", e);
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
	}
}
