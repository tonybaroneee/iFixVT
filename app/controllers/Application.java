package controllers;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import play.mvc.Result;
import views.html.index;
import views.html.phone;
import db.models.Issue;
import db.service.IssueService;

@Controller
public class Application extends FixItBaseController {

	private static Logger _logger = LoggerFactory.getLogger(Application.class);

	@Inject
	IssueService _issueService;

	public Result index() {
		Issue issue = new Issue();
		issue.setImageUri("MY URI!!!!");
		_issueService.save(issue);
		
        return ok(index.render());
	}

    public Result addissue() {
        return ok(phone.render());
    }

}
