package controllers;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import play.mvc.Result;
import db.models.Issue;
import db.repositories.TownRepository;
import db.service.IssueService;

@Controller
public class ReportController extends FixItBaseController {

	private static Logger _logger = LoggerFactory.getLogger(ReportController.class);

	@Inject
	IssueService _issueService;

	@Inject
	TownRepository townRepository;

	public Result basic() {
		List<Issue> issues = _issueService.getAllIssuesWithoutPictures();
		return okAsJSON(issues);
	}
	
	public Result basicHeatMap() {

		HashMap<String, Integer> heatMap = new HashMap<String, Integer>();
		
		List<Issue> issues = _issueService.getAllIssuesWithoutPictures();

		for (Issue issue : issues) {
			double lat = new BigDecimal(issue.getLatitude()).setScale(3, RoundingMode.FLOOR).doubleValue();
			double lng = new BigDecimal(issue.getLongitude()).setScale(3, RoundingMode.FLOOR).doubleValue();
			
			String key = lat + ":" + lng;
			if( !heatMap.containsKey(key) ) {
				heatMap.put(key, 1);
			} else {
				heatMap.put(key, heatMap.get(key) + 1);
			}
		}

		heatMap.put("45.000:-75.000", 5);
		
		return okAsJSON(heatMap);
	}
}

