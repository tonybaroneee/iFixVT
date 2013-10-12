package controllers;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import play.mvc.Result;
import views.html.index;
import views.html.phone;
import db.models.Issue;
import db.models.IssueType;
import db.models.Town;
import db.repositories.TownRepository;
import db.service.IssueService;

@Controller
public class Application extends FixItBaseController {

	private static Logger _logger = LoggerFactory.getLogger(Application.class);

	@Inject
	IssueService _issueService;
	
	@Inject
	TownRepository townRepository;
	
	public Result index() {
        return ok(index.render());
	}

    public Result phone() {
        return ok(phone.render());
    }
    
    public Result upload() {
    	IssueType issueType = new IssueType();
    	issueType.setDescription("Abandoned Bicycle");
    	
//    	issueType = _issueService.saveIssueType(issueType);
    	
    	Issue issue = new Issue();
    	issue.setImageUri("IMAGEURI");
    	issue.setIssueType(issueType.getId());
    	issue.setLatitude(12.2);
    	issue.setLongitude(222.2);
    	issue.setDescription("OMG BIKE");
    	
//    	_issueService.save(issue);
    	
    	Town town = townRepository.findOneByName("Burlington");
    	
    	return ok("Awesome! " + town.getName() + " has " + town.getPopulation() + " many people");
    }

}
