const phoneRules = {
  IN: 10,
  SG: 8,
  US: 10,
};

const allowedPaymentModes = ["UPI", "CARD", "NETBANKING", "COD"];

function validateRow(row) {
  const errors = [];

  if (!row.order_id) errors.push("Missing Order ID");

  if (!row.product_id) errors.push("Missing Product ID");

  if (!allowedPaymentModes.includes(row.payment_mode))
    errors.push("Invalid Payment Mode");
  const expectedLength = phoneRules[row.country_code];

  if (!phoneRules[row.country_code]) {
    errors.push("Unsupported Country Code");
  } else if (row.phone?.length !== expectedLength) {
    errors.push("Invalid Phone Number");
  }
  const date = new Date(row.order_date);

  if (isNaN(date.getTime())) {
    errors.push("Invalid Date");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = validateRow;
