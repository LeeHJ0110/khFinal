import { useEffect, useState } from "react";
import {
  createPet,
  deletePet,
  getBreedList,
  getMyPetList,
  updatePet,
  changeRepresentPet,
} from "../api/petApi";
export default function usePet() {
  const [petList, setPetList] = useState([]);
  const [breedList, setBreedList] = useState([]);
  const [selectedPetIndex, setSelectedPetIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchMyPetList() {
    try {
      setLoading(true);
      setError("");

      const response = await getMyPetList();
      const list = response.data || [];

      setPetList(list);

      const representIndex = list.findIndex((pet) => pet.representYn === "Y");
      setSelectedPetIndex(representIndex >= 0 ? representIndex : 0);

      return list;
    } catch (err) {
      console.error(err);
      setError("반려동물 목록 조회에 실패했습니다.");
      setPetList([]);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function fetchBreedList(petType = "D") {
    try {
      const response = await getBreedList(petType);
      setBreedList(response.data || []);
      return response.data || [];
    } catch (err) {
      console.error(err);
      setBreedList([]);
      return [];
    }
  }
  async function handleCreatePet(formData) {
    try {
      setLoading(true);
      setError("");

      const response = await createPet(formData);

      await fetchMyPetList();

      return response.data;
    } catch (err) {
      console.error(err);
      setError("반려동물 등록에 실패했습니다.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  function selectPet(index) {
    if (index < 0 || index >= petList.length) return;
    setSelectedPetIndex(index);
  }

  function nextPet() {
    if (petList.length === 0) return;
    setSelectedPetIndex((prev) => (prev + 1) % petList.length);
  }

  async function handleUpdatePet(petId, formData) {
    try {
      setLoading(true);

      await updatePet(petId, formData);

      await fetchMyPetList();

      return true;
    } catch (err) {
      console.error(err);

      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePet(petId) {
    try {
      setLoading(true);

      await deletePet(petId);

      await fetchMyPetList();

      return true;
    } catch (err) {
      console.error(err);

      return false;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyPetList();
    fetchBreedList("D");
  }, []);

  const selectedPet = petList[selectedPetIndex] || null;

  async function handleRepresentPet(petId) {
    try {
      await changeRepresentPet(petId);

      await fetchMyPetList();

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  return {
    petList,
    breedList,
    selectedPet,
    selectedPetIndex,
    hasPet: petList.length > 0,
    loading,
    error,

    fetchMyPetList,
    fetchBreedList,
    handleCreatePet,
    selectPet,
    nextPet,
    handleUpdatePet,
    handleDeletePet,
    handleRepresentPet,
  };
}
