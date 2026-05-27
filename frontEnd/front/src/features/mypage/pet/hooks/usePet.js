import { useEffect, useState } from "react";
import { createPet, getBreedList, getMyPetList } from "../api/petApi";

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

  async function fetchBreedList() {
    try {
      const response = await getBreedList();
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

  useEffect(() => {
    fetchMyPetList();
    fetchBreedList();
  }, []);

  const selectedPet = petList[selectedPetIndex] || null;

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
  };
}
