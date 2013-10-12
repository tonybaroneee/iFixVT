package db.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import db.models.IssueType;

@Repository
public interface IssueTypeRepository extends MongoRepository<IssueType, String> {

}
