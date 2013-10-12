package db.service;

import javax.inject.Inject;

import db.models.Issue;
import db.models.IssueType;
import db.repositories.IssueRepository;
import db.repositories.IssueTypeRepository;

/**
 * @author Keith Buel
 * 
 *         Exposes functions to interact with the user collection in the
 *         database
 */
public class IssueService {

	@Inject
	private IssueRepository _issueRepository;
	@Inject
	private IssueTypeRepository issueTypeRepository;
	
	public Issue save(Issue user) {
		return _issueRepository.save(user);
	}
	
	public IssueType saveIssueType(IssueType issueType) {
		return issueTypeRepository.save(issueType);
	}
}
