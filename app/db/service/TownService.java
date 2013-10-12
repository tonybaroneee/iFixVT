package db.service;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import db.models.Town;
import db.repositories.TownRepository;

/**
 * @author Keith Buel
 * 
 */
public class TownService {

	@Inject
	private TownRepository _townRepository;

	public Map<String, Town> getAllTownNamesMap() {

		Map<String, Town> townNameMap = new HashMap<String, Town>();

		for (Town town : _townRepository.findAll()) {
			townNameMap.put(town.getName(), town);
		}

		return townNameMap;
	}

}
