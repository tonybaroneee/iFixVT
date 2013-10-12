package db.models;

public class Town {
	private String name;
	private Double area;
	private Double density;
	private Long population;
	
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
	
}
