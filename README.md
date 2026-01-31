PROJECT SCOPE 
A basic food delivery platform with two user types only:
1.	Customers - Browse restaurants, order food
2.	Restaurant Owners - Manage menu, process orders
Admin panel removed - Can be added later if needed
SIMPLIFIED FUNCTIONAL REQUIREMENTS
Core Features (Must Have):
1.	Authentication: Register/Login with role selection
2.	Customer: Browse restaurants, view menu, add to cart, place order
3.	Restaurant: Add menu items, view orders, update order status
4.	Order Tracking: Simple status updates



















FILE STRUCTURE
text
food-delivery-app/
├── index.html                    # Landing page
├── login.html                    # Login
├── signup.html                   # Signup
├── home.html                     # Customer home
├── menu.html                     # Restaurant menu
├── cart.html                     # Shopping cart
├── checkout.html                 # Checkout
├── orders.html                   # Customer orders
├── restaurant-dashboard.html     # Restaurant main page
├── restaurant-menu.html          # Restaurant menu management
├── restaurant-orders.html        # Restaurant order management
├── css/
│   └── style.css                 # Will Be added at the end
├── js/
│   ├── firebase.js               # Firebase config
│   ├── auth.js                   # Authentication
│   ├── home.js                   # Home page logic
│   ├── menu.js                   # Menu page logic
│   ├── cart.js                   # Cart logic
│   ├── checkout.js               # Checkout logic
│   ├── orders.js                 # Customer orders
│   ├── restaurant-dashboard.js   # Restaurant dashboard
│   ├── restaurant-menu.js        # Menu management
│   └── restaurant-orders.js      # Order management
└── README.md








PAGE-BY-PAGE REQUIREMENTS 
1. index.html (Landing Page)
Elements:
•	App name/logo
•	Tagline: "Order food online"
•	Two buttons: "Order Food" (→ login), "Add Restaurant" (→ signup)
•	Simple footer
2. login.html
Elements:
•	Email input
•	Password input
•	Login button
•	Link to signup page
•	Error message area
3. signup.html
Elements:
•	Name
•	Email
•	Password
•	Confirm Password
•	Role selection (Customer / Restaurant Owner)
•	Signup button
•	Link to login page
4. home.html (Customer Dashboard)
Elements:
Header:
•	Welcome message
•	Simple search bar (optional)
•	Cart icon with count
Main:
•	Grid of restaurant cards:
o	Restaurant image
o	Name
o	Cuisine type
o	Delivery time
o	"Order Now" button
Footer:
•	Home | Orders | Cart | Logout
5. menu.html (Restaurant Menu)
Elements:
•	Restaurant name banner
•	Menu category tabs (All, Mains, Sides, Drinks)
•	Menu items grid:
o	Item image
o	Name
o	Price
o	"Add to Cart" button
•	Floating cart summary at bottom
6. cart.html
Elements:
•	List of cart items:
o	Item name
o	Quantity (+/- buttons)
o	Price
o	Remove button
•	Order summary:
o	Subtotal
o	Delivery fee
o	Total
•	"Proceed to Checkout" button
7. checkout.html
Elements:
•	Delivery address input
•	Phone number input
•	Order review (items list)
•	Total amount
•	"Place Order" button (Cash on Delivery only)
8. orders.html (Customer Orders)
Elements:
•	Two tabs: "Active Orders" | "Past Orders"
•	Order cards showing:
o	Restaurant name
o	Order ID
o	Items count
o	Total
o	Status (Pending → Preparing → Delivered)
o	Order date
9. restaurant-dashboard.html
Elements:
•	Restaurant name
•	Online/Offline toggle
•	Stats: Today's orders, Today's revenue
•	Quick links: Manage Menu, View Orders
•	Recent orders list (last 5)
10. restaurant-menu.html (Menu Management)
Elements:
•	"Add New Item" button
•	List of menu items:
o	Item name
o	Category
o	Price
o	Availability toggle
o	Edit button
o	Delete button
•	Add/Edit form modal
11. restaurant-orders.html
Elements:
•	Order status tabs: New, Preparing, Completed
•	Order cards:
o	Order ID
o	Customer name
o	Items list
o	Total
o	Status buttons (Accept → Preparing → Complete)
o	Order time











SIMPLIFIED FIREBASE STRUCTURE
Collections:
text
users/
  └── {userId}
      ├── name: string
      ├── email: string
      ├── role: "customer" | "restaurant"
      └── createdAt: timestamp

restaurants/
  └── {restaurantId}
      ├── name: string
      ├── ownerId: string
      ├── cuisine: string
      ├── address: string
      ├── phone: string
      ├── isOpen: boolean
      └── createdAt: timestamp

menuItems/
  └── {itemId}
      ├── restaurantId: string
      ├── name: string
      ├── price: number
      ├── category: string
      ├── imageUrl: string (optional)
      └── isAvailable: boolean

orders/
  └── {orderId}
      ├── customerId: string
      ├── restaurantId: string
      ├── items: array
          ├── itemId: string
          ├── name: string
          ├── quantity: number
          ├── price: number
      ├── total: number
      ├── deliveryAddress: string
      ├── status: "pending" | "preparing" | "delivered"
      └── createdAt: timestamp
