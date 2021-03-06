package db.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import db.models.Issue;

/**
 * @author Keith Buel
 * 
 *         Tell someone from the future what this does.
 */
@Repository
public interface IssueRepository extends MongoRepository<Issue, String> {

	@Query(value="{}", fields= "{ image: 0 }")
	List<Issue> findAllWithoutPictures();

	@Query(value="{townName: ?0}", fields= "{ image: 0 }")
	List<Issue> findByTownNameWithoutPictures(String townName);

	@Query(value="{issueTypeId: ?0}", fields= "{ image: 0 }")
	List<Issue> findIssuesByTypeIdWithoutPictures(String id);

}
