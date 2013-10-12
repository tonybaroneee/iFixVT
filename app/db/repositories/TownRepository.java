package db.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import db.models.Town;

@Repository
public interface TownRepository extends MongoRepository<Town, String> {

	Town findOneByName(String string);

}
