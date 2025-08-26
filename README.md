# Menue Application
The app is built with Reaxt.js.  
we have 3 main actors for the application: 
* Super Admin.
* Admin. 
* User.


## Super Admin Rule: 
The super admin is responsable for adding ` cities, restaurants, restaurant managers, restaurant employees, subsicribtions, templates and emojies for ratings `

### Cities:
super admin can create,update,view,delete and activate or deactivate a city. 
* **create city**: the super admin can create a city by entering the name in English and Arabic languages.   
    frontend path: `/super_admin`   
    api: `/superAdmin_api/add_city`  
* **update city**: the super admin can update a city by updating the name in English and Arabic languages.  
    frontend path:`/super_admin`  
    api:`/super_admin/update_city` 
* **activate or deactivate city**: the super admin can activate a city if it was deactivated and the opisite is right.  
    frontend path:`/super_admin`  
    api:`/active_or_not_city?id={cityId}` 
* **delete city**: super admin can delete city just if it was deactivated.   
    frontend path:`/super_admin`  
    api:`/superAdmin_api/delete_city?id={cityId}`  
* **view city** : super admin can view a city then it will lead to city page where you can find all restaurants in choosen city then you can make any restaurant action as wanted.  
    frontend path: `/suer_admin`.  
    api: `/superAdmin_api/show_city_by_id?id={cityId}`  

### Restaurants:  
Super admin can `view all, create, update, delete, view, activate, deactivate, add employee, add subscribtion, create QR code` which are the available actions on restaurant.  
* **View all restaurant in a city**: super admin an view all restaurant in a city by clicking eye icon in a specific city row in cities table.  
    frontend path:`/super_admin`  
    api:`/superAdmin_api/show_restaurants?page=1&city_id={cityId}&per_page=10`
* **Crate a restaurant**: Super admin can create a restaurant by filing creating restaurant form, the form contains many fields, but before the super admin create a new restaurant he must create template and emoji then he can create a new restaurant.  
    frontend path: `/super_admin/resturants/add`  
    api:`/superAdmin_api/add_restaurant`  
* **Update a restaurant**: super admin can update a restaurant by clicking the Edit icon in a specific restaurant row in restaurants table then it will take him to update page which will contain a form filled by restaurant info, then super admin can update any field he wants.  
    path:`/super_admin/resturants/{restaurant_id}/edit`
    
### Restaurant Managers:  
Super admin can `view all, create, update, delete, view restaurants, activate, deactivate` restaurant managers.

* **View all restaurant managers**: show the paginated list of managers created so far.  
  frontend path: `/super_admin/restaurants_managers`  
  api: `/superAdmin_api/show_restaurant_managers?page=1&per_page=10`

* **Create a restaurant manager**: open the add-manager form and submit the required info (name, phone, e-mail, password).  
  frontend path: `/super_admin/restaurants_managers/add`  
  api: `/superAdmin_api/add_restaurant_manager`

* **Update a restaurant manager**: click the ✏️ icon in the managers table to edit any field.  
  frontend path: `/super_admin/restaurants_managers/{managerId}/edit`  
  api: `/superAdmin_api/update_restaurant_manager?id={managerId}`

* **Activate / deactivate manager**: toggle a manager’s active status.  
  frontend path: `/super_admin/restaurants_managers`  
  api: `/superAdmin_api/active_or_not_restaurant_manager?id={managerId}`

* **Delete manager**: a manager can be deleted only when deactivated.  
  frontend path: `/super_admin/restaurants_managers`  
  api: `/superAdmin_api/delete_restaurant_manager?id={managerId}`

* **View restaurants of a manager**: click the 👁️ icon in the row to see every restaurant the manager owns.  
  frontend path: `/super_admin/restaurants_managers/{managerId}/restaurants`  
  api: `/superAdmin_api/show_restaurants?manager_id={managerId}&page=1&per_page=10`  

### Restaurant Employees (Admins):  
Inside each restaurant the super admin can `view all, add, update, delete, activate, deactivate` its employees.

* **View employees of a restaurant**:  
  frontend path: `/super_admin/city/{cityId}/resturants/{resId}/admins`  
  api: `/superAdmin_api/show_restaurant_employees?restaurant_id={resId}&page=1&per_page=10`

* **Add employee**:  
  frontend path: `/super_admin/city/{cityId}/resturants/{resId}/admins/add`  
  api: `/superAdmin_api/add_restaurant_employee`

* **Update employee**:  
  frontend path: `/super_admin/city/{cityId}/resturants/{resId}/admins/{employeeId}/edit`  
  api: `/superAdmin_api/update_restaurant_employee?id={employeeId}`

* **Activate / deactivate employee**:  
  frontend path: `/super_admin/city/{cityId}/resturants/{resId}/admins`  
  api: `/superAdmin_api/active_or_not_restaurant_employee?id={employeeId}`

* **Delete employee** *(needs to be deactivated first)*:  
  frontend path: `/super_admin/city/{cityId}/resturants/{resId}/admins`  
  api: `/superAdmin_api/delete_restaurant_employee?id={employeeId}`  

### Subscriptions:  
A subscription links a restaurant to one of the predefined packages.  
Super admin can `create, update, renew, cancel, activate, deactivate` subscriptions.

* **View subscriptions of a restaurant**:  
  frontend path: `/super_admin/city/{cityId}/resturants/{resId}/subscriptions`  
  api: `/superAdmin_api/show_subscriptions?restaurant_id={resId}`

* **Create subscription** *(pick a package & dates)*:  
  frontend path: `/super_admin/city/{cityId}/resturants/{resId}/subscriptions/add`  
  api: `/superAdmin_api/add_subscription`

* **Update subscription**:  
  frontend path: `/super_admin/city/{cityId}/resturants/{resId}/subscriptions/{subId}/edit`  
  api: `/superAdmin_api/update_subscription?id={subId}`

* **Activate / deactivate subscription**:  
  frontend path: `/super_admin/city/{cityId}/resturants/{resId}/subscriptions`  
  api: `/superAdmin_api/active_or_not_subscription?id={subId}`

* **Delete subscription** *(allowed only when inactive)*:  
  frontend path: `/super_admin/city/{cityId}/resturants/{resId}/subscriptions`  
  api: `/superAdmin_api/delete_subscription?id={subId}`  

### Templates (Menu themes):  
Super admin maintains the gallery of menu templates used when a new restaurant is created.

* **View all templates**: `/super_admin/menu_template` → `/superAdmin_api/show_templates?page=1&per_page=10`  
* **Add template**: `/super_admin/menu_template/add` → `/superAdmin_api/add_template`  
* **Update template**: `/super_admin/menu_template/{templateId}/edit` → `/superAdmin_api/update_template?id={templateId}`  
* **Activate / deactivate template**: `/super_admin/menu_template` → `/superAdmin_api/active_or_not_template?id={templateId}`  
* **Delete template** *(inactive only)*: `/super_admin/menu_template` → `/superAdmin_api/delete_template?id={templateId}`  

### Emojis (Rating icons):  
Used by customers when submitting dish ratings.

* **View all emojis**: `/super_admin/emojis` → `/superAdmin_api/show_emojis?page=1&per_page=10`  
* **Add emoji** *(upload SVG / PNG)*: `/super_admin/emojis/add` → `/superAdmin_api/add_emoji`  
* **Update emoji**: `/super_admin/emojis/{emojiId}/edit` → `/superAdmin_api/update_emoji?id={emojiId}`  
* **Delete emoji**: `/super_admin/emojis` → `/superAdmin_api/delete_emoji?id={emojiId}`  
---




## Admin Rule  
An **Admin** (sometimes called *restaurant staff* or *waiter supervisor*) is in charge of everything that happens **inside one restaurant**: the live menu, daily orders, tables, take-out, promotions, drivers, analytics, etc.  
Below the capabilities are grouped by feature, following exactly the same bullet-style you used for the **Super Admin** section.

> **Notation**  
> *All admin REST calls are prefixed with* `/admin_api/…` — only the path segment that comes after it is shown in the tables below.  
> The front-end lives under the protected scope `/admin/*`; every page listed here is rendered inside the `<LayoutsAdmin>` shell with automatic permission guards.

---

### Categories  
Admin can `view all, create, update, reorder, activate, deactivate, delete` menu categories.

| Action | Front-end path | API |
|--------|----------------|-----|
| View all categories | `/admin` *(dashboard index)* | `show_admin_categories?page={n}` |
| Create category | `/admin/categories/add` | `add_category` |
| Update category | `/admin/categories/{catId}/edit` | `update_category` |
| Activate / deactivate | `/admin` | `deactivate_category?id={catId}` |
| Delete category *(inactive only)* | `/admin` | `delete_category?id={catId}` |
| Drag-&-drop reorder | `/admin` | `reorder_categories` |

### Sub-categories  
Inside a category the admin can `view, create, update, activate, deactivate, delete`.

| Action | Path | API |
|--------|------|-----|
| View sub-categories | `/admin/category/{catId}` | `show_categories_sub?category_id={catId}` |
| Create sub-category | `/admin/category/{catId}/sub/add` | `add_sub_category` |
| Update sub-category | `/admin/category/{catId}/sub/{subId}/edit` | `update_sub_category` |
| Activate / deactivate | same list | `deactivate_sub_category?id={subId}` |
| Delete sub-category | same list | `delete_sub_category?id={subId}` |

### Items  
Admin can `view, create, update, reorder, activate, deactivate, delete` items that belong to a sub-category.

| Action | Path | API |
|--------|------|-----|
| View items | `/admin/category/{catId}/subCategory/{subId}` | `show_items?subCat_id={subId}&page={n}` |
| Create item | `…/add` | `add_item` |
| Update item | `…/{itemId}/edit` | `update_item` |
| Activate / deactivate | same list | `deactivate_item?id={itemId}` |
| Delete item | same list | `delete_item?id={itemId}` |
| Re-order items | drag on same list | `reorder_items` |

### Tables  
Physical tables can be `listed, created, updated, deleted` and their live status managed.

| Action | Path | API |
|--------|------|-----|
| View tables | `/admin/tables` | `show_tables?page={n}` |
| Create table | `/admin/tables/add` | `add_table` |
| Update table | `/admin/tables/{tableId}/edit` | `update_table` |
| Delete table | list -🗑 | `delete_table?id={tableId}` |
| Change status *(occupied / clean / available)* | list -toggle | `table/{tableId}/update_status?type={status}` |
| Accept / reject table requests | `/admin/requests` | `accept_table_request` / `reject_table_request` |

### Orders & Invoices  
Admin can `take, edit, split, merge, pay, cancel` orders for dine-in & take-out.

| Context | Typical UI | Core APIs |
|---------|------------|-----------|
| **Create dine-in order** | *Quick order* button or inside a table | `add_order` |
| **Update order** *(items / quantities / note)* | Orders list › ✏️ | `update_order` |
| **Delete / cancel** | Orders list › 🗑 | `delete_order?id={orderId}` |
| **Mark as paid / delivered** | status dropdown | `update_status_order_paid?id={orderId}` |
| **Attach order to invoice** | table › *Add to invoice* | `add_invoice_to_table` |
| **Generate invoice (multi-table)** | *Create invoice* modal | `create_table_invoice` |
| **Pay invoice** | Invoice list › 💰 | `update_status_invoice_paid?id={invoiceId}` |
| **Delete invoice** | Invoice list › 🗑 | `delete_invoice_table?id={invoiceId}` |
| **Fetch invoices** | `/admin/invoices` | `show_invoices?page={n}` |

### Take-out Orders  
Admin can `list, filter` real-time take-out orders.

* **View take-out orders**: `/admin/takeoutOrders` → `show_orders_takeout?page={n}`  
* Order details modal: same page › 👁

### Ads / Banners  
Admin can `view, create, update, delete` rotating banners shown on the customer site.

| Action | Path | API |
|--------|------|-----|
| View ads | `/admin/ads` | `show_advertisements?page={n}` |
| Add ad *(image + URL)* | `/admin/ads/add` | `add_advertisement` |
| Update ad | `/admin/ads/{adId}/edit` | `update_advertisement` |
| Delete ad | list -🗑 | `delete_advertisement?id={adId}` |

### Coupons  
Admin can `generate, update, deactivate, delete` discount codes.

| Action | Path | API |
|--------|------|-----|
| View coupons | `/admin/coupon` | `show_coupons?page={n}` |
| Create coupon | `/admin/coupon/add` | `add_coupon` |
| Update coupon | `/admin/coupon/{coupId}/edit` | `update_coupon` |
| Activate / deactivate | list toggle | `deactivate_coupon?id={coupId}` |
| Delete coupon | list -🗑 | `delete_coupon?id={coupId}` |

### Deliveries / Drivers  
Admin can `list, create, update, delete, activate, deactivate` driver accounts and inspect their invoices.

| Action | Path | API |
|--------|------|-----|
| View drivers | `/admin/deliveries` | `show_deliveries?page={n}` |
| Add driver | `/admin/deliveries/add` | `add_delivery` |
| Update driver | `/admin/deliveries/{id}/edit` | `update_delivery` |
| Activate / deactivate | list toggle | `active_delivery?id={id}` |
| Delete driver | list -🗑 | `delete_delivery?id={id}` |
| Driver invoices | row › 👁 | `show_orders_delivery?id={id}` |

### Staff (Restaurant Admins)  
Higher-privilege employees inside the same restaurant. Admin can `view, create, update, deactivate, delete`.

| Action | Path | API |
|--------|------|-----|
| View staff | `/admin/admins` | `show_users?role=employee&page={n}` |
| Add staff | `/admin/admins/add` | `add_user` |
| Update staff | `/admin/admins/{empId}/edit` | `update_user` |
| Activate / deactivate | list toggle | `active_user?id={empId}` |
| Delete staff | list -🗑 | `delete_user?id={empId}` |

### Services & Fees  
Extra fees (e.g. shisha, delivery, service-charge).

| Action | Path | API |
|--------|------|-----|
| View services | `/admin/service` | `show_services?page={n}` |
| Add service | `/admin/service/add` | `add_service` |
| Update service | `/admin/service/{srvId}/edit` | `update_service` |
| Activate / deactivate | list toggle | `toggle_service_status` |
| Delete service | list -🗑 | `delete_service?id={srvId}` |

### News  
Short news posts displayed on the customer site.

| Action | Path | API |
|--------|------|-----|
| View news | `/admin/news` | `get_news?page={n}` |
| Add news | `/admin/news/add` | `add_news` |
| Update | `/admin/news/{newsId}/edit` | `update_news` |
| Delete | list -🗑 | `delete_news?id={newsId}` |

### Rates & Analytics  
* **Ratings dashboard**: `/admin/rates` → `show_rates?page={n}`  
* **Export ratings to Excel**: button in header → `excel`  
* **SMS recharge / withdrawal logs**: same page tabs → `show_recharge`, `show_withdrawals`  

### Inventory  
Daily stock & cost breakdown.  
Path: `/admin/inventory` → export button hits `excel_sales_inventory`.

### Charts  
BI widgets: orders per waiter, sales by hour, best-selling items, etc.  
Path: `/admin/charts` (pure front-end – no dedicated endpoint, data comes from the slices above).

### Profile  
An admin can update their own account information and change password.  
Path: `/admin/profile` → `update_my_profile`.

---


## End User Role

A **User** is the restaurant’s customer. From scanning a QR code at the table or visiting the public link they can explore the live menu, send their order, track its status and leave ratings.
Below the abilities are grouped by feature:  


> **Notation**
> *Every customer REST call is prefixed with* `/user_api/…` — only the part that comes after this prefix is shown in the tables.
> The public front-end lives under the path `/{restaurantSlug}/*`; the responsive pages listed here are rendered inside the `<LayoutsUser>` shell.

---

### 1. On-boarding & Authentication

Customers may order anonymously, but creating an account unlocks order history and faster checkout.

| Action                    | Front-end path   | API                                  |
| ------------------------- | ---------------- | ------------------------------------ |
| Register (phone & OTP)    | `/auth/register` | `register` / `verify_phone`          |
| Log-in (phone + password) | `/auth/login`    | `login`                              |
| Forgot / reset password   | `/auth/forgot`   | `forgot_password` / `reset_password` |
| Log-out                   | header menu      | `logout`                             |

### 2. Browse Menu

The live menu is driven by the data configured by the Admin.

| Action                                             | Path                                   | API                                       |
| -------------------------------------------------- | -------------------------------------- | ----------------------------------------- |
| Fetch restaurant info (logo, cover, working hours) | `/{slug}` *(home)*                     | `show_restaurant?slug={slug}`             |
| View categories grid                               | same page                              | `show_categories?restaurant_id={id}`      |
| Open a category → sub-cats                         | `/{slug}/category/{catId}`             | `show_sub_categories?category_id={catId}` |
| List items inside a sub-cat                        | `/{slug}/category/{catId}/sub/{subId}` | `show_items?subCat_id={subId}&page={n}`   |
| Item details modal                                 | click item card                        | `show_item?id={itemId}`                   |
| Search menu                                        | top search bar                         | `search_menu?restaurant_id={id}&q={text}` |

### 3. Cart

A single persistent cart is kept in localStorage (or the logged-in account).

| Action                  | Path                | API                          |
| ----------------------- | ------------------- | ---------------------------- |
| Add item to cart        | any item card       | `add_item_to_cart`           |
| Change quantity / notes | `/cart`             | `update_cart_item?id={ciId}` |
| Remove item             | `/cart`             | `delete_cart_item?id={ciId}` |
| Clear cart              | footer “Empty cart” | `clear_cart`                 |

### 4. Table Requests (Dine-in)

If the restaurant enabled “order-at-table”, the flow starts with a seat request.

| Action                 | Path                 | API                               |
| ---------------------- | -------------------- | --------------------------------- |
| Ask for a table        | `/requestTable`      | `create_table_request`            |
| Cancel pending request | `/requestTable`      | `cancel_table_request?id={reqId}` |
| See waiter ETA         | banner on every page | `show_table_request?id={reqId}`   |

### 5. Checkout & Orders

Users can send an in-house order (linked to their table) or a take-out order (with address).

| Context                   | Typical UI               | Core APIs                 |
| ------------------------- | ------------------------ | ------------------------- |
| **Place dine-in order**   | `/cart/checkout/table`   | `add_order_table`         |
| **Place take-out order**  | `/cart/checkout/takeout` | `add_order_takeout`       |
| **Apply coupon**          | step 2 “Discount”        | `apply_coupon?code={c}`   |
| **Pay online (stripe)**   | redirect to PSP          | `create_payment_intent`   |
| **See order sent screen** | `/thankYou/{orderId}`    | `show_order?id={orderId}` |

### 6. Order Tracking

Real-time updates via pusher/web-socket; manual refresh falls back to REST.

| Action                      | Path                   | API                             |
| --------------------------- | ---------------------- | ------------------------------- |
| List my orders              | `/orders`              | `show_my_orders?page={n}`       |
| Order details               | `/orders/{orderId}`    | `show_order?id={orderId}`       |
| Cancel order (if still NEW) | detail page › 🗑       | `cancel_my_order?id={orderId}`  |
| Re-order same items         | same page › “Re-order” | `reorder?id={orderId}`          |
| Download invoice PDF        | same page › “Invoice”  | `download_invoice?id={orderId}` |

### 7. Ratings & Reviews

A completed order unlocks per-item and overall experience ratings.

| Action                   | Path                     | API                                                   |
| ------------------------ | ------------------------ | ----------------------------------------------------- |
| Rate items (emoji)       | `/orders/{orderId}/rate` | `add_rate`                                            |
| Update / delete my rate  | same page                | `update_rate?id={rateId}` / `delete_rate?id={rateId}` |
| View public ratings wall | `/{slug}/ratings`        | `show_rates?restaurant_id={id}&page={n}`              |

### 8. Profile & Settings

| Action                    | Path                 | API                                                                       |
| ------------------------- | -------------------- | ------------------------------------------------------------------------- |
| View / edit profile       | `/profile`           | `show_my_profile`, `update_my_profile`                                    |
| Change password           | `/profile/password`  | `change_password`                                                         |
| Manage addresses          | `/profile/addresses` | `add_address`, `update_address?id={addrId}`, `delete_address?id={addrId}` |
| Language toggle (AR / EN) | navbar switch        | local only (no API)                                                       |

---


## Folder Structure:  
Below is a ready-to-drop **`README.md`** section that documents what lives inside the `src/` folder and why.
Feel free to copy-paste it (or let me know if you’d like it tweaked or turned into a standalone file).

---

```text
src/
├── Api/                     # All network layers (Axios instances & base-URL helpers)
│   ├── baseURL.jsx
│   ├── baseURLLocal.jsx
│   └── baseURLTest.jsx
│
├── assets/                  # Static images, icons & illustrations used at runtime
│   └── User/ …              # Organised sub-folders for user-uploaded media
│
├── fonts/                   # Self-hosted web-fonts and `fonts.css`
│
├── Colors.jsx               # Design-token palette (brand & neutral colours)
├── Data.js                  # Small seed / mock data used by demos & tests
│
├── constant/                # Compile-time constants (e.g., `permissions.jsx`)
│
├── context/                 # React Context providers (global state outside Redux)
│   ├── LanguageProvider.jsx
│   ├── WebSocketProvider.jsx
│   └── …
│
├── hooks/                   # Re-usable custom hooks
│   ├── useLocalStorage.jsx
│   ├── useDebounce.jsx
│   └── domain-specific hooks grouped by role (admin, user, …)
│
├── utils/                   # Pure helpers & “dumb” UI utilities
│   ├── 404Page.jsx
│   ├── ProtectedRoute.jsx
│   ├── Pagination.jsx
│   └── …
│
├── components/              # Re-usable, presentation-focused building blocks
│   ├── Admin/               # Widgets only the Admin UI needs
│   ├── user/                # End-user widgets (templates 1-11)
│   ├── super_admin/         # Super-admin widgets
│   ├── Modals/              # Generic & role-based dialog components
│   ├── Tables/              # Data-table variants
│   └── …
│
├── Containers/              # “Smart” components (fetch data, pass to children)
│   ├── RestaurantsContainer/
│   ├── AdsContainer/
│   └── …
│
├── Layouts/                 # Shared page chrome (sidebars, navbars, etc.)
│   ├── LayoutsAdmin.jsx
│   └── LayoutSuperAdmin.jsx
│
├── pages/                   # Route-level views (hooked up in React-Router)
│   ├── Admin/ …             # `/admin/*`
│   ├── user/ …              # `/username/*`
│   └── super_admin/ …       # `/super-admin/*`
│
├── redux/                   # Global state (Redux Toolkit)
│   ├── store/               # Store configuration & middleware
│   └── slice/               # Feature slices, one folder per domain
│       ├── auth/            # Login / token logic
│       ├── orders/          # Orders CRUD
│       └── …
│
├── App.jsx                  # The root component (routes, providers, theme)
├── LazyLoadedComponents.jsx # Dynamic `import()` map for code-splitting
├── main.jsx                 # Vite / React-DOM entry point
└── index.css                # Global CSS reset + utility classes
```

### How to read this layout
**The pages folder** is responsable for main pages in the application like let's say we wanna navigate to cities page in super admin so you will find the page in pages folder under super_admin/cities sub folder, the same for admin and user pages.  
**each page has** a container sometimes the container is in containers folder and sometimes in component folder, with the same example cities page has Cities container, you can find it in container folder or in component folder.  
**each container has** also components you can find those components in component folder for the same example cities container has components you can find them in components folder under super_admin/cities sub folder.

### How backend is build: 
**The application actors** are `user (internal customer/order), customer (external customer/order), admin (can be admin, chief, accounter, barman,...), super_admin` the backend is build in the way that is showen bellow:
each goal has an endpoint like let's say we need to get tables this goal is existed in user and admin role so we have 2 APIs `admin/get_tables` and `user/get_tables` and so on for all goals, another example get categories we have 2 APIs `admin/get_categories` and `user/get_categories` and so on.  

### How is tempaltes is working: 
**We have 11 templates** when the super_admin creates a restaurant he specified the template and it will be stored in the data base as an ID, based that ID the UI will be changed an rendered differently in user interfaces.  

### Summary:
Menue application is an application for restaurants which is designed for goals:  
**Super Admin**: will create cities, restaurant, subscribtion, emojies, ...etc.  
**Admin**: will create categories, sub categories, items, invoices, employees, internal orders, ... etc.  
**User/Customer**: can surf the menue create orders, ... etc.

