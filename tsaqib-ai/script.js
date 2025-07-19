const upload = document.getElementById("upload");
const preview = document.getElementById("preview");
const generateBtn = document.getElementById("generateBtn");

generateBtn.addEventListener("click", () => {
  const file = upload.files[0];
  if (!file) return alert("Pilih gambar dulu!");

  const formData = new FormData();
  formData.append("file", file);

  fetch("https://api.anime-example.com/generate", { // Ganti dengan URL API kamu
    method: "POST",
    body: formData
  })
    .then(res => res.blob())
    .then(blob => {
      preview.src = URL.createObjectURL(blob);
    })
    .catch(err => {
      alert("Gagal mengubah gambar.");
      console.error(err);
    });
});