import api from "../../../app/api/axios";

export function getAdminDeliveries(params) {
  return api.get("/admin/deliveries", { params });
}

export function getAdminDeliveryDetail(deliveryId) {
  return api.get(`/admin/deliveries/${deliveryId}`);
}

export function startShippingBulk(data) {
  return api.put("/admin/deliveries/shipping", data);
}
