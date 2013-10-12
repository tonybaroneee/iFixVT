package db.service;

import javax.inject.Inject;

import db.models.Issue;
import db.repositories.IssueRepository;

/**
 * @author Keith Buel
 * 
 *         Exposes functions to interact with the user collection in the
 *         database
 */
public class IssueService {

	@Inject
	private IssueRepository _issueRepository;

	
	public Issue save(Issue user) {
		return _issueRepository.save(user);
	}
}
