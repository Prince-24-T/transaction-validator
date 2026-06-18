const phoneRules = {
  IN: 10,
  SG: 8,
  US: 10,
  UK: 10,
  AE: 9,
  AU: 9,
  CA: 10,
};

const allowedPaymentModes = ["UPI", "CARD", "NETBANKING", "COD"];
const supportedDateFormats = [
  "YYYY-MM-DD",
  "YYYY-MM-DD HH:mm:ss",
  "DD-MM-YYYY",
  "DD-MM-YYYY HH:mm:ss",
  "MM/DD/YYYY",
  "MM/DD/YYYY HH:mm:ss",
];
const supportedTimeFormats = ["HH:mm", "HH:mm:ss"];

function isValidDateParts(year, month, day, hour = 0, minute = 0, second = 0) {
  const date = new Date(year, month - 1, day, hour, minute, second);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hour &&
    date.getMinutes() === minute &&
    date.getSeconds() === second
  );
}

function validateDateTime(value) {
  const checks = [
    {
      regex: /^(\d{4})-(\d{2})-(\d{2})$/,
      map: ([, year, month, day]) => [year, month, day],
    },
    {
      regex: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
      map: ([, year, month, day, hour, minute, second]) => [
        year,
        month,
        day,
        hour,
        minute,
        second,
      ],
    },
    {
      regex: /^(\d{2})-(\d{2})-(\d{4})$/,
      map: ([, day, month, year]) => [year, month, day],
    },
    {
      regex: /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
      map: ([, day, month, year, hour, minute, second]) => [
        year,
        month,
        day,
        hour,
        minute,
        second,
      ],
    },
    {
      regex: /^(\d{2})\/(\d{2})\/(\d{4})$/,
      map: ([, month, day, year]) => [year, month, day],
    },
    {
      regex: /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
      map: ([, month, day, year, hour, minute, second]) => [
        year,
        month,
        day,
        hour,
        minute,
        second,
      ],
    },
  ];

  return checks.some(({ regex, map }) => {
    const match = value.match(regex);

    if (!match) return false;

    const parts = map(match).map(Number);

    return isValidDateParts(...parts);
  });
}

function validateTime(value) {
  const match = value.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);

  if (!match) return false;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = match[3] === undefined ? 0 : Number(match[3]);

  return (
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59 &&
    second >= 0 &&
    second <= 59
  );
}

function validateRow(row) {
  const errors = [];

  const orderId = row.order_id?.trim();
  const productId = row.product_id?.trim();
  const paymentMode = row.payment_mode?.trim().toUpperCase();
  const countryCode = row.country_code?.trim().toUpperCase();
  const phone = row.phone?.replace(/\D/g, "");
  const orderDate = row.order_date?.trim();
  const orderTime = row.order_time?.trim();

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

  if (!orderDate || !validateDateTime(orderDate)) {
    errors.push(
      `Invalid Date. Supported formats: ${supportedDateFormats.join(", ")}`,
    );
  }

  if (orderTime && !validateTime(orderTime)) {
    errors.push(
      `Invalid Time. Supported formats: ${supportedTimeFormats.join(", ")}`,
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    normalizedRow: {
      order_id: orderId,
      product_id: productId,
      payment_mode: paymentMode,
      phone,
      country_code: countryCode,
      order_date: orderDate,
      ...(row.order_time !== undefined ? { order_time: orderTime } : {}),
    },
  };
}

module.exports = validateRow;
