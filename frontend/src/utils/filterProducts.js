export const buildCompanyList = (products) => ['All', ...new Set(products.map((item) => item.company))];
