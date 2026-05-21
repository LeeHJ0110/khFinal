import api from "../../../app/api/axiosApi";

export async function insertBoard(vo, fileList) {
  const fd = new FormData();

  fd.append(
    "data",
    new Blob([JSON.stringify(vo)], { type: "application/json" }),
  );

  if (fileList && fileList.length > 0) {
    fileList.forEach((file) => {
      fd.append("fileList", file);
    });
  }

  return await api.post(`/schedule`, fd);
}
