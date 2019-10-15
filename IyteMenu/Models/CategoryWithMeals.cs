using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IyteMenu.Models
{
    public class CategoryWithMeals
    {
        public String Name { get; set; }
        public String Explanation { get; set; }
        public List<Meals> Meals { get; set; }
    }
}