package db.models;

import javax.persistence.Id;

import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@TypeAlias("Town")
public class Town {
	
	@Id
	private String id;
	private String name;
	private Double area;
	private Double density;
	private Long population;
	private Double latitude;
	private Double longitude;
	private Double viewPortNorthEastLatitude;
	private Double viewPortSouthWestLatitude;
	private Double viewPortSouthWestLongitude;
	private Double viewPortNorthEastLongitude;
	
	public Double getViewPortNorthEastLatitude() {
		return viewPortNorthEastLatitude;
	}
	public void setViewPortNorthEastLatitude(Double viewPortNorthEastLatitude) {
		this.viewPortNorthEastLatitude = viewPortNorthEastLatitude;
	}
	public Double getViewPortSouthWestLatitude() {
		return viewPortSouthWestLatitude;
	}
	public void setViewPortSouthWestLatitude(Double viewPortSouthWestLatitude) {
		this.viewPortSouthWestLatitude = viewPortSouthWestLatitude;
	}
	public Double getViewPortSouthWestLongitude() {
		return viewPortSouthWestLongitude;
	}
	public void setViewPortSouthWestLongitude(Double viewPortSouthWestLongitude) {
		this.viewPortSouthWestLongitude = viewPortSouthWestLongitude;
	}
	public Double getViewPortNorthEastLongitude() {
		return viewPortNorthEastLongitude;
	}
	public void setViewPortNorthEastLongitude(Double viewPortNorthEastLongitude) {
		this.viewPortNorthEastLongitude = viewPortNorthEastLongitude;
	}
	public Double getLatitude() {
		return latitude;
	}
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}
	public Double getLongitude() {
		return longitude;
	}
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Double getArea() {
		return area;
	}
	public void setArea(Double area) {
		this.area = area;
	}
	public Double getDensity() {
		return density;
	}
	public void setDensity(Double density) {
		this.density = density;
	}
	public Long getPopulation() {
		return population;
	}
	public void setPopulation(Long population) {
		this.population = population;
	}
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
}
