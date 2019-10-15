using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IyteMenu.Controllers
{
    public class MenusController : Controller
    {
        IyteMenuEntities db = new IyteMenuEntities();

        // GET: Menus
        public ActionResult Index()
        {
            List<Meals> meals = db.Meals.ToList();
            ViewData.Add("Meals", meals);
            List<Restaurants> Restaurants = db.Restaurants.ToList();
            ViewData.Add("Restaurants", Restaurants);
            return View();
        }

        public ActionResult getMenus()
        {
            List<Menus> menus = db.Menus.Where(x => x.RestaurantId==1).ToList();
            List<IyteMenu.Models.Menu> menu = new List<Models.Menu>();
            foreach(Menus m in menus)
            {
                IyteMenu.Models.Menu menu1 = new Models.Menu();
                menu1.start = m.Tarih;
                menu1.end = m.Tarih.AddDays(1);
                menu1.title = m.Yemek;
                menu.Add(menu1);
            }
            String json = JsonConvert.SerializeObject(menu, Formatting.Indented);

            return Json(json,JsonRequestBehavior.AllowGet);
        }

        public ActionResult addMeal(IyteMenu.Models.Menu _menu)
        {
            Menus menu = new Menus();
            menu.Tarih = _menu.start;
            menu.Yemek = _menu.title;
            menu.RestaurantId = 1;

            try
            {
                db.Menus.Add(menu);
                db.SaveChanges();
            } catch(Exception ex) { }

            return Json("");
        }

        public ActionResult getDateMeals(IyteMenu.Models.Menu _menu)
        {
            String json = String.Empty;
            Menus menu = new Menus();
            menu.Tarih = _menu.start;
            menu.Yemek = _menu.title;

            try
            {
                List<Menus> menus = db.Menus.Where(x => x.Tarih == _menu.start.Date).ToList();
                json = JsonConvert.SerializeObject(menus, Formatting.Indented);
            }
            catch (Exception ex) { }

            return Json(json, JsonRequestBehavior.AllowGet);
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
            resCode.resCode = db.SaveChanges();

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