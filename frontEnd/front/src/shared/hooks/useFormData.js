import { useState } from "react";

export default function useFormData(initialState) {
  const [formData, setFormData] = useState(initialState);

  function handleChange(evt) {
    setFormData((prev) => {
      return { ...prev, [evt.target.name]: evt.target.value };
    });
  }

  function resetFormData() {
    setFormData(initialState);
  }

  return { formData, handleChange, resetFormData };
}
