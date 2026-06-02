import { useEffect, useState } from "react";
import {
  changeDefaultDeliveryAddress,
  createDeliveryAddress,
  deleteDeliveryAddress,
  getDeliveryAddressList,
  updateDeliveryAddress,
} from "../api/deliveryAddressApi";

export default function useDeliveryAddress() {
  const [deliveryList, setDeliveryList] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchDeliveryList() {
    try {
      setLoading(true);

      const response = await getDeliveryAddressList();

      setDeliveryList(response.data || []);
      return response.data || [];
    } catch (err) {
      console.error(err);
      setDeliveryList([]);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateDelivery(data) {
    try {
      await createDeliveryAddress(data);
      await fetchDeliveryList();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async function handleUpdateDelivery(deliveryAddressId, data) {
    try {
      await updateDeliveryAddress(deliveryAddressId, data);
      await fetchDeliveryList();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async function handleDeleteDelivery(deliveryAddressId) {
    try {
      await deleteDeliveryAddress(deliveryAddressId);
      await fetchDeliveryList();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async function handleChangeDefault(deliveryAddressId) {
    try {
      await changeDefaultDeliveryAddress(deliveryAddressId);
      await fetchDeliveryList();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  useEffect(() => {
    fetchDeliveryList();
  }, []);

  return {
    deliveryList,
    loading,
    fetchDeliveryList,
    handleCreateDelivery,
    handleUpdateDelivery,
    handleDeleteDelivery,
    handleChangeDefault,
  };
}
