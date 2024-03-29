// Info.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Siswasd from "../components/Siswasd";

const Info = () => {
  const [guruPembimbing, setGuruPembimbing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Token not found. Please login again.");
        return;
      }

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/siswa/info-pembimbing",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGuruPembimbing(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching guru pembimbing data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen">
      <Siswasd/>
      <div className="ml-8">
        <h1 className="text-4xl font-bold mb-4">Info Guru Pembimbing</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : guruPembimbing &&
          Object.keys(guruPembimbing).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(guruPembimbing).map(([key, guru]) => (
              <div
                key={key}
                className="bg-white p-6 rounded-lg shadow-md mb-4"
              >
                <h2 className="text-2xl font-semibold mb-4">
                  Guru {key}
                </h2>
                <div className="mb-2">
                  <p className="text-gray-600">Nama:</p>
                  <p className="font-semibold">{guru.name}</p>
                </div>
                <div className="mb-2">
                  <p className="text-gray-600">NIP:</p>
                  <p className="font-semibold">{guru.nip}</p>
                </div>
                <div className="mb-2">
                  <p className="text-gray-600">Nomor Telepon:</p>
                  <p className="font-semibold">{guru.nomer_telpon}</p>
                </div>
                <div className="mb-2">
                  <p className="text-gray-600">Email:</p>
                  <p className="font-semibold">{guru.email}</p>
                </div>

                {/* Add more details if needed */}
              </div>
            ))}
          </div>
        ) : (
          <p>Data guru pembimbing tidak tersedia.</p>
        )}
      </div>
    </div>
  );
};

export default Info;
