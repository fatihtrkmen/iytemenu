using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IyteMenu.Controllers
{
    public class MealsController : Controller
    {
        IyteMenuEntities db = new IyteMenuEntities();
        // GET: Meals
        public ActionResult Index()
        {
            List<Meals> meals = db.Meals.ToList();
            ViewData.Add("Meals", meals);
            return View();
        }

        public ActionResult DeleteMeal(int _id)
        {
            Meals m = db.Meals.Where(p => p.Id == _id).ToList()[0];
            db.Meals.Remove(m);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        public ActionResult EditMeal(IyteMenu.Meals _meal)
        {
            IyteMenu.Models.ResCode resCode = new Models.ResCode();
            db.Meals.Add(_meal);
            db.Entry(_meal).State = System.Data.Entity.EntityState.Modified;
            resCode .resCode= db.SaveChanges();

            String json = JsonConvert.SerializeObject(resCode, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public ActionResult AddMeal(IyteMenu.Meals _meal)
        {
            IyteMenu.Models.ResCode resCode = new Models.ResCode();
            db.Meals.Add(_meal);
            db.Entry(_meal).State = System.Data.Entity.EntityState.Added;
            resCode.resCode = db.SaveChanges();

            String json = JsonConvert.SerializeObject(resCode, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}