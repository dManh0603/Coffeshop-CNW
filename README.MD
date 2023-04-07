# Coffee Shop Project README

This project is a web-based application for a coffee shop. It allows customers to view the menu, place orders, and pay for their purchases online. The application is built using Express.js, Mongoose, and PayPal Checkout.

## Features

The coffee shop application has the following features:

- **Menu**: Customers can view the coffee shop's menu, including descriptions, prices, and photos of each item.
- **Ordering**: Customers can place orders for delivery. They can select items from the menu, specify any customizations, and add them to their cart.
- **Payment**: Customers can pay for their orders using PayPal Checkout. The application uses the PayPal REST API to handle payments securely.
- **Order Management**: The coffee shop can view and manage orders through an administrative dashboard. They can see new orders as they come in, mark orders as fulfilled, and view order details.

## Installation

To run this application locally, follow these steps:

1. Clone the repository: `git clone https://github.com/dmanh6302/coffee-shop.git`
2. Install the required packages: `npm install`
3. Create a `.env` file in the root directory with the variables coresponde to those in the `.env.example` file
4. Run the development server: `npm run app`

The application should now be accessible at `http://localhost:<your preferred port>`.

## Usage

To use the coffee shop application, follow these steps:

1. Navigate to the application's homepage.
2. Browse the menu and select items to add to your cart.
3. Specify any customizations for your items.
4. Proceed to checkout and enter your payment information.
5. Once your order is placed, you will be redirected to your order history.
6. The coffee shop will fulfill your order and notify you when it is ready for pickup or delivery.

## Credits

This project was created by tremendous efforts of 4:
 - [Đức Mạnh](https://github.com/dmanh6302) (project owner)
 - [Văn Hiếu](https://github.com/vanhieuhp) 
 - [Đạt Trần](https://github.com/Datitneu) 
 - [Triệu Diễn](https://github.com/DucDien2505) 


The following open source libraries were used in this project:

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [PayPal Checkout SDK](https://developer.paypal.com/docs/checkout/)
- [Bootstrap](https://getbootstrap.com/)
- [jQuery](https://jquery.com/)

## Contributing

Contributions to this project are welcome. To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b my-new-feature`
3. Make changes and commit them: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Create a new pull request.
