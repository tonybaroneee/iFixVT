package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;
import views.html.heatmap;

public class Application extends Controller {

    public static Result index() {
        return ok(index.render("Your mom's new application is ready."));
    }

    public static Result heatmap() {
        return ok(heatmap.render());
    }
}
