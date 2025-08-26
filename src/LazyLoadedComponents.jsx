import { lazy } from "react";

// Template 1
export const FirstHomePage = lazy(() =>
  import("./components/user/template1/FirstHomePage")
);
export const HomePage = lazy(() =>
  import("./components/user/template1/HomePage")
);
export const List = lazy(() => import("./components/user/template1/List"));

// Template 2
export const Categories = lazy(() =>
  import("./components/user/template2/Categories")
);
export const SubCatTemp2 = lazy(() =>
  import("./components/user/template2/SubCatTemp2")
);
export const Items = lazy(() => import("./components/user/template2/Items"));

// Template 3
export const Home3 = lazy(() => import("./components/user/template3/Home"));
export const SubCategories = lazy(() =>
  import("./components/user/template3/SubCategories")
);
export const Temp3Items = lazy(() =>
  import("./components/user/template3/Temp3Items")
);

// Template 4
export const Home4 = lazy(() => import("./components/user/template4/Home"));
export const SubCatTemp4 = lazy(() =>
  import("./components/user/template4/SubCatTemp4")
);
export const Temp4Items = lazy(() =>
  import("./components/user/template4/Temp4Items")
);

// Template 5
export const CategoriesTemp5 = lazy(() =>
  import("./components/user/template5/CategoriesTemp5")
);
export const SubCategoriesTemp5 = lazy(() =>
  import("./components/user/template5/SubCategoriesTemp5")
);
export const Temp5Items = lazy(() =>
  import("./components/user/template5/Temp5Items")
);

// Template 6
export const HomeTemp6 = lazy(() =>
  import("./components/user/template6/HomeTemp6")
);
export const CategoriesTemp6 = lazy(() =>
  import("./components/user/template6/CategoriesTemp6")
);
export const SubCategoriesTemp6 = lazy(() =>
  import("./components/user/template6/SubCategoriesTemp6")
);
export const ItemsTemp6 = lazy(() =>
  import("./components/user/template6/ItemsTemp6")
);



