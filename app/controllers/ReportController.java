package controllers;

import java.util.LinkedHashMap;
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
    	
		LinkedHashMap<String, Object> retval = new LinkedHashMap<String, Object>();

		return okAsJSON(issues);
    }
}
