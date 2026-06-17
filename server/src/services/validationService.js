const phoneRules = {
  IN: 10,
  SG: 8,
  US: 10,
};

const allowedPaymentModes = ["UPI", "CARD", "NETBANKING", "COD"];

function validateRow(row) {
  const errors = [];

  const orderId = row.order_id?.trim();
  const productId = row.product_id?.trim();
  const paymentMode = row.payment_mode?.trim().toUpperCase();
  const countryCode = row.country_code?.trim().toUpperCase();
  const phone = row.phone?.trim();
  const orderDate = row.order_date?.trim();

  if (!orderId) errors.push("Missing Order ID");

  if (!productId) errors.push("Missing Product ID");

  if (!allowedPaymentModes.includes(paymentMode)) {
    errors.push("Invalid Payment Mode");
  }

  const expectedLength = phoneRules[countryCode];

  if (!expectedLength) {
    errors.push("Unsupported Country Code");
  } else if (!phone || phone.length !== expectedLength) {
    errors.push("Invalid Phone Number");
  }

  const date = new Date(orderDate);

  if (!orderDate || isNaN(date.getTime())) {
    errors.push("Invalid Date");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = validateRow;
