let uploadedImageData = null;

document.getElementById('upload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    uploadedImageData = ev.target.result;
    document.getElementById('original').src = uploadedImageData;
  };
  reader.readAsDataURL(file);
});

document.getElementById('generateBtn').addEventListener('click', async () => {
  if (!uploadedImageData) {
    alert("Silakan upload gambar terlebih dahulu!");
    return;
  }

  document.getElementById('edited').src = "https://i.gifer.com/ZKZg.gif";

  try {
    const res = await fetch('http://localhost:5000/generate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ image: uploadedImageData })
    });
    const data = await res.json();
    if (data.image) {
      document.getElementById('edited').src = data.image;
    } else {
      throw new Error("No image returned");
    }
  } catch (err) {
    console.error(err);
    alert("Gagal menghasilkan gambar AI.");
    document.getElementById('edited').src = "https://via.placeholder.com/300x400?text=Error";
  }
});