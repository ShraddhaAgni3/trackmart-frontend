import api from "./api";

/* GET ALL PRODUCTS */

export const getProducts = (filters = {}, token = null) => {

  const query = new URLSearchParams(filters).toString();

  return api.get(`/products?${query}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {}
  });

};


/* CREATE PRODUCT */

export const createProduct = (data, token) => {
  return api.post("/products", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

};


/* GET SINGLE PRODUCT */

export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};
