using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IyteMenu.Controllers
{
    public class MyCategoriesController : Controller
    {
        IyteMenuEntities db = new IyteMenuEntities();
        // GET: Categories
        public ActionResult Index()
        {
            List<Categories> Categories = db.Categories.ToList();
            ViewData.Add("Categories", Categories);
            return View();
        }

        public ActionResult DeleteCategory(int _id)
        {
            Categories m = db.Categories.Where(p => p.Id == _id).ToList()[0];
            db.Categories.Remove(m);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        public ActionResult EditCategory(IyteMenu.Categories _Category)
        {
            IyteMenu.Models.ResCode resCode = new Models.ResCode();
            db.Categories.Add(_Category);
            db.Entry(_Category).State = System.Data.Entity.EntityState.Modified;
            resCode.resCode = db.SaveChanges();

            String json = JsonConvert.SerializeObject(resCode, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public ActionResult AddCategory(IyteMenu.Categories _Category)
        {
            IyteMenu.Models.ResCode resCode = new Models.ResCode();
            db.Categories.Add(_Category);
            db.Entry(_Category).State = System.Data.Entity.EntityState.Added;
            resCode.resCode = db.SaveChanges();

            String json = JsonConvert.SerializeObject(resCode, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}