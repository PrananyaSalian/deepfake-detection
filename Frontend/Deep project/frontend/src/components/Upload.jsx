import { useState } from "react";
import axios from "axios";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-96">
      <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-4" />
      <button className="bg-blue-500 text-white p-2 w-full" onClick={handleUpload}>Detect</button>
      {result && (
        <div className="mt-4">
          <p><strong>Prediction:</strong> {result.label}</p>
          <p><strong>Probability:</strong> {result.probability}</p>
        </div>
      )}
    </div>
  );
}
