using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IyteMenu.Controllers
{

    public class RestaurantsController : Controller
    {
        IyteMenuEntities db = new IyteMenuEntities();
        // GET: Restaurants
        public ActionResult Index()
        {
            getRestaurantInfos();
            return View();
        }

        private void getRestaurantInfos()
        {
            List<Restaurants> restaurants = db.Restaurants.ToList();
            ViewData.Add("Restaurants", restaurants);
        }
    }
}