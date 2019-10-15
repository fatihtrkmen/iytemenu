using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IyteMenu.Controllers
{
    public class HomeController : Controller
    {
        IyteMenuEntities db = new IyteMenuEntities();
        // GET: Home
        public ActionResult Index()
        {
            loadSiteAttributes();
            return View();
        }

        private void loadSiteAttributes()
        {
            List<Restaurants> restaurants = db.Restaurants.ToList();
            ViewData["RestaurantCount"] = restaurants.Count;
        }
    }
}