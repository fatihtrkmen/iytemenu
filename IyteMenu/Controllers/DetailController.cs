using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IyteMenu.Controllers
{ 
    public class DetailController : Controller
    {
        IyteMenuEntities db = new IyteMenuEntities();
        // GET: Detail
        public ActionResult Index(int id)
        {

            getRestaurantDetails(id);
            return View();
        }

        private void getRestaurantDetails(int id)
        {
            List<Restaurants> clickedRestaurant = db.Restaurants.Where(x => x.Id == id).ToList();

            List<Meals> Meals = db.Meals.GroupBy(x => x.CategoryId).Select(x => x.FirstOrDefault()).Where(x => x.RestaurantId == id).ToList();
            List<Meals> AllMeals = db.Meals.Where(x => x.RestaurantId == id).ToList();
            List<int> catIds = new List<int>();
            foreach (Meals meals in Meals)
            {
                catIds.Add(meals.CategoryId);
            }

            List<Categories> catsUsedWithDetails = db.Categories.Where(o => catIds.Contains(o.Id)).ToList();

            List<IyteMenu.Models.CategoryWithMeals> list = new List<Models.CategoryWithMeals>();
            for(int i = 0; i < catsUsedWithDetails.Count; i++)
            {
                IyteMenu.Models.CategoryWithMeals c = new Models.CategoryWithMeals();
                c.Meals = new List<Meals>();
                for (int j = 0; j < AllMeals.Count; j++)
                {
                    if (catsUsedWithDetails[i].Id == AllMeals[j].CategoryId) {
                        
                        c.Name = catsUsedWithDetails[i].Name;
                        c.Explanation = catsUsedWithDetails[i].Explanation;
                        c.Meals.Add(AllMeals[j]);
                    }
                }
                list.Add(c);
            }
            ViewData.Add("DistinctCategory",list);
        }
    }
}