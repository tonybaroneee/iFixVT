package controllers;

import org.codehaus.jackson.map.ObjectMapper;

import play.mvc.Controller;
import play.mvc.Result;

public class FixItBaseController extends Controller {
	
	protected Result okAsJSON(Object object) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return ok(mapper.writeValueAsString(object));
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
