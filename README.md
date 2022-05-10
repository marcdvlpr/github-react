<h1 align="center">Food Delivery Server</h1>

Food Delivery Server is the backend for the [Food Delivery App](https://github.com/mdossantosdev/food-delivery-app) (React Native mobile app).

## 🛠️ Built With

- TypeScript
- Node.js
- Express
- MongoDB
- Twilio API
- JSON Web Token
- Docker

## 🚀 Getting Started

### Prerequisites

- Node.js
- Docker

### Installation

1. Get a free API Key at [Twilio](https://www.twilio.com)

2. Clone the repository

```sh
git clone https://github.com/mdossantosdev/food-delivery-server.git
```

3. Go into food-delivery-server

```sh
cd food-delivery-server
```

4. Copy the `.env.sample` file to `.env` and fill it

```sh
cp .env.sample .env
```

```
DB_CLUSTER=your_db_cluster
DB_NAME=your_db_name
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
TOKEN_LIFE=24h
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

5. Run the Docker container

```sh
docker-compose up
```

6. The API should now be running at http://localhost:8000

## 📚 API Endpoints

### Admin
`POST /api/v1/admin/merchant` : Create a new merchant

`GET /api/v1/admin/merchants` : Get a list of all existing merchants

`GET /api/v1/admin/merchant/:id` : Get a specific merchant by ID

`GET /api/v1/admin/transactions` : Get a list of all existing transactions

`GET /api/v1/admin/transaction/:id` : Get a specific transaction by ID

`PUT /api/v1/admin/deliver/verify` : Verify a deliverer by updating their verification status

`GET /api/v1/admin/delivers` : Get a list of all existing deliverers

`POST /api/v1/admin/category` : Create a new category

### Customer
`POST /api/v1/user/register` : Create a new customer

`PATCH /api/v1/user/verify` : Verify the phone number

`POST /api/v1/user/login`: Login as a customer

`GET /api/v1/user/otp` : Get a new OTP for user verification

`GET /api/v1/user/profile` : Get the customer's profile

`PATCH /api/v1/user/profile` : Edit the customer's profile

`POST /api/v1/user/create-order` : Create a new order

`GET /api/v1/user/orders` : Get all orders placed by the customer

`GET /api/v1/user/order/:id` : Get a specific order by ID

`PATCH /api/v1/user/order/:id` : Update the status of a specific order by ID

`POST /api/v1/user/cart` : Add a food item to the customer's cart

`GET /api/v1/user/cart` : Get the items in the customer's cart

`DELETE /api/v1/user/cart` : Empty the customer's cart

`GET /api/v1/user/offer/verify/:id` : Verify the validity of an offer by ID

`POST /api/v1/user/create-payment` : Create a payment transaction

### Delivery
`POST /api/v1/deliver/register` : Create a new deliverer

`POST /api/v1/deliver/login` : Login as a deliverer

`GET /api/v1/deliver/profile` : Get the deliverer's profile

`PATCH /api/v1/deliver/profile` : Edit the deliverer's profile

`PATCH /api/v1/deliver/update-status` : Updates the availability status and location of the deliverer

### Merchant
`POST /api/v1/merchant/login` : Login as a merchant

`GET /api/v1/merchant/profile` : Get the merchant's profile

`PATCH /api/v1/merchant/profile` : Update merchant's profile information

`PATCH /api/v1/merchant/coverimage` : Update merchant's cover image URL

`PATCH /api/v1/merchant/service` : Update merchant's service availability and location

`POST /api/v1/merchant/food` : Create a new food item for the merchant

`GET /api/v1/merchant/food` : Get all food items associated with the merchant

`GET /api/v1/merchant/orders` : Get all orders associated with the merchant

`GET /api/v1/merchant/order/:id` : Get details of a specific order by ID

`PUT /api/v1/merchant/order/:id/process` : Update status and remarks of a specific order by ID

`POST /api/v1/merchant/offer` : Create a new offer for the merchant

`GET /api/v1/merchant/offers` : Get offers associated with the merchant

`PUT /api/v1/merchant/offer/:id` : Update an existing offer by ID

### Shop
`GET /api/v1/shop/categories` : Get available food categories from the shop

`GET /api/v1/shop/top-restaurants/:postalCode` : Get top restaurants based on the postal code

`GET /api/v1/shop/foods30min/:postalCode` : Get food items deliverable within 30 minutes in a postal code

`GET /api/v1/shop/search/:postalCode` : Search for food items in restaurants within a postal code

`GET /api/v1/shop/restaurant/:id` : Get detailed information about a specific restaurant by ID

`GET /api/v1/shop/offers/:postalCode` : Get active offers based on the postal code

## © License

This project is licensed under the [MIT License](LICENSE).
