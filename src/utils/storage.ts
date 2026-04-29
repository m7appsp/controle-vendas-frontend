export const getSales = () => {
  const data = localStorage.getItem("sales");
  return data ? JSON.parse(data) : [];
};

export const saveSale = (sale: any) => {
  const sales = getSales();
  sales.push(sale);
  localStorage.setItem("sales", JSON.stringify(sales));
};