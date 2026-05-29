export async function requestDiagnosis(vo, eyeFiles, skinFiles, teethFiles) {
  const fd = new FormData();

  fd.append(
    "data",
    new Blob([JSON.stringify(vo)], {
      type: "application/json",
    }),
  );

  eyeFiles?.forEach((file) => fd.append("eyeFiles", file));
  skinFiles?.forEach((file) => fd.append("skinFiles", file));
  teethFiles?.forEach((file) => fd.append("teethFiles", file));

  return await api.post("petcare/diagnosis", fd);
}
