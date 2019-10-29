const formatter = {
  formatCurrency: value => {
    return new Intl.NumberFormat("us-Us", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(value);
  }
};

export default formatter;
