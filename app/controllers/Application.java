package controllers;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import play.data.DynamicForm;
import play.data.Form;
import play.mvc.Result;
import service.GoogleService;
import views.html.index;
import views.html.phone;
import db.models.Issue;
import db.models.IssueType;
import db.models.Town;
import db.repositories.IssueTypeRepository;
import db.repositories.TownRepository;
import db.service.IssueService;

@Controller
public class Application extends FixItBaseController {

	private static Logger _logger = LoggerFactory.getLogger(Application.class);

	@Inject
	IssueService _issueService;
	
	@Inject
	TownRepository townRepository;
	
	@Inject
	IssueTypeRepository issueTypeRepository;
	
	@Inject
	GoogleService googleService;
	public Result index() {
		
        return ok(index.render(townRepository.findAll(), issueTypeRepository.findAll()));
	}

    public Result phone() {
        return ok(phone.render(townRepository.findAll(), issueTypeRepository.findAll()));
    }
    
    public Result upload() {
    	IssueType issueType = new IssueType();
    	issueType.setDescription("homeless person");

//    	issueType = _issueService.saveIssueType(issueType);
    	
    	Issue issue = new Issue();
    	issue.setImage("image");
    	issue.setIssueType(issueType.getId());
    	issue.setLatitude(92923.2);
    	issue.setLongitude(123.2);
    	issue.setDescription("i dono");
    	
    	//_issueService.save(issue);
    	
    	Town town = townRepository.findOneByName("Burlington");
    	
//    	return ok("Awesome! " + town.getName() + " has " + town.getPopulation() + " many people");
    	return ok(googleService.getTownNameByLatLong(44.641300, -73.307015));
    }
}
