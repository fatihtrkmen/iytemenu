using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IyteMenu.Controllers
{
    public class MyRestaurantsController : Controller
    {
        IyteMenuEntities db = new IyteMenuEntities();
        // GET: Restaurants
        public ActionResult Index()
        {
            List<Restaurants> Restaurants = db.Restaurants.ToList();
            ViewData.Add("Restaurants", Restaurants);
            return View();
        }

        public ActionResult DeleteRestaurant(int _id)
        {
            Restaurants m = db.Restaurants.Where(p => p.Id == _id).ToList()[0];
            db.Restaurants.Remove(m);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        public ActionResult EditRestaurant(IyteMenu.Restaurants _Restaurant)
        {
            IyteMenu.Models.ResCode resCode = new Models.ResCode();
            db.Restaurants.Add(_Restaurant);
            db.Entry(_Restaurant).State = System.Data.Entity.EntityState.Modified;
            resCode.resCode = db.SaveChanges();

            String json = JsonConvert.SerializeObject(resCode, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getRestaurant(int _id)
        {
            Restaurants m = db.Restaurants.Where(p => p.Id == _id).ToList()[0];
            String json = JsonConvert.SerializeObject(m, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}