package db.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import db.models.Issue;

/**
 * @author Keith Buel
 * 
 *         Tell someone from the future what this does.
 */
@Repository
public interface IssueRepository extends MongoRepository<Issue, String> {

}
