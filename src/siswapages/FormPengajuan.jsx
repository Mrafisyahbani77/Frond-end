import React, { useState, useEffect, useRef } from "react";
import Siswasd from "../components/Siswasd";
import Api from "../Api";
import Swal from "sweetalert2";

const FormPengajuan = ({ onClose }) => {
  const initialFormState = {
    nama: "",
    nisn: "",
    cv: "",
    portofolio: "",
    email: "",
    alamat: "",
    file_cv: null,
    file_portofolio: null,
    daftarSiswa: [],
    filteredDaftarSiswa: [],
    selectedSiswa: null,
    isFilled: false,
  };

  const [forms, setForms] = useState([initialFormState]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    Api.getDaftarSiswa()
      .then((response) => {
        setForms((prevForms) =>
          prevForms.map((form) => ({
            ...form,
            daftarSiswa: response.data,
            filteredDaftarSiswa: response.data,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching daftar siswa:", error);
      });

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleNamaChange = (e, index) => {
    const searchTerm = (e.target.value || "").toLowerCase();
    const filteredSiswa = forms[index].daftarSiswa.filter(
      (siswa) => siswa.name.toLowerCase().startsWith(searchTerm)
    );
    setForms((prevForms) =>
      prevForms.map((form, idx) =>
        idx === index
          ? {
              ...form,
              filteredDaftarSiswa: filteredSiswa,
              nama: e.target.value,
              selectedSiswa: null,
              isFilled: true,
            }
          : form
      )
    );
    setShowDropdown(true);
  };

  const handleSiswaSelect = (selectedId, index) => {
    const selected = forms[index].daftarSiswa.find(
      (siswa) => siswa.id === selectedId
    );
    setForms((prevForms) =>
      prevForms.map((form, idx) =>
        idx === index
          ? {
              ...form,
              selectedSiswa: selected,
              nama: selected.name,
              nisn: selected.nisn,
              isFilled: true,
            }
          : form
      )
    );
    setShowDropdown(false);
  };

  const handleInputChange = (e, fieldName, index) => {
    const value = e.target.value;
    setForms((prevForms) =>
      prevForms.map((form, idx) =>
        idx === index ? { ...form, [fieldName]: value, isFilled: true } : form
      )
    );
  };

  const handleFileInputChange = (e, fieldName, index) => {
    const file = e.target.files[0];
    setForms((prevForms) =>
      prevForms.map((form, idx) =>
        idx === index ? { ...form, [fieldName]: file, isFilled: true } : form
      )
    );
  };

  const addForm = () => {
    setForms((prevForms) => {
      const lastForm = prevForms[prevForms.length - 1];
      return [
        ...prevForms,
        {
          ...initialFormState,
          daftarSiswa: lastForm.daftarSiswa,
          filteredDaftarSiswa: lastForm.filteredDaftarSiswa,
        },
      ];
    });
  };

  const removeForm = (index) => {
    setForms((prevForms) => prevForms.filter((form, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    try {
      const allFormsFilled = forms.every((form) => form.isFilled);

      if (!allFormsFilled) {
        Swal.fire({
          icon: "warning",
          title: "Pengisian Formulir Belum Lengkap",
          text: "Mohon lengkapi semua formulir sebelum mengirim pengajuan.",
        });
        return;
      }

      setIsSubmitting(true);

      const promises = forms.map(async (form) => {
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const authToken = localStorage.getItem("token");
        formData.append("nisn", form.nisn); 
        const response = await Api.submitPengajuan(authToken, formData);
        console.log(response.data);
      });

      await Promise.all(promises);

      setForms([initialFormState]);
      setIsSubmitting(false);

      Swal.fire({
        icon: "success",
        title: "Pengajuan Berhasil",
        text: "Pengajuan Anda telah berhasil dikirim.",
      });
    } catch (error) {
      console.error("Error submitting pengajuan:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={formRef} className="flex h-screen">
      <Siswasd />
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="text-2xl font-bold mb-4">Form Pengajuan PKL</h3>

        {forms.map((form, index) => (
          <div key={index} className="mb-8">
            <label className="block text-sm font-semibold mb-2">Nama:</label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={
                  form.selectedSiswa ? form.selectedSiswa.name : form.nama
                }
                onChange={(e) => handleNamaChange(e, index)}
                list={`daftarSiswa-${index}`}
              />
              {showDropdown && form.filteredDaftarSiswa.length > 0 && (
                <ul className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-md">
                  {form.filteredDaftarSiswa.map((siswa) => (
                    <li
                      key={siswa.id}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      onClick={() => handleSiswaSelect(siswa.id, index)}
                    >
                      {siswa.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label className="block text-sm font-semibold mt-4 mb-2">NISN:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={form.nisn}
              onChange={(e) => handleInputChange(e, "nisn", index)}
            />

            <label className="block text-sm font-semibold mt-4 mb-2">CV:</label>
            <div className="flex">
              <input
                type="text"
                placeholder="Link CV atau unggah file"
                className="flex-1 p-2 border rounded"
                value={form.cv}
                onChange={(e) => handleInputChange(e, "cv", index)}
              />
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileInputChange(e, "file_cv", index)}
                className="ml-2 p-2 border rounded"
              />
            </div>

            <label className="block text-sm font-semibold mt-4 mb-2">
              Portofolio:
            </label>
            <div className="flex">
              <input
                type="text"
                placeholder="Link Portofolio atau unggah file"
                className="flex-1 p-2 border rounded"
                value={form.portofolio}
                onChange={(e) => handleInputChange(e, "portofolio", index)}
              />
              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  handleFileInputChange(e, "file_portofolio", index)
                }
                className="ml-2 p-2 border rounded"
              />
            </div>

            <label className="block text-sm font-semibold mt-4 mb-2">Email Perusahaan:</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={form.email}
              onChange={(e) => handleInputChange(e, "email", index)}
            />

            <label className="block text-sm font-semibold mt-4 mb-2">Alamat Perusahaan:</label>
            <textarea
              className="w-full p-2 border rounded"
              value={form.alamat}
              onChange={(e) => handleInputChange(e, "alamat", index)}
            />

            <button
              onClick={() => removeForm(index)}
              className="bg-red-500 text-white py-2 px-4 rounded mr-2 hover:bg-red-600"
            >
              Hapus Form
            </button>
          </div>
        ))}

        <div className="mt-6">
          <button
            onClick={addForm}
            className="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600"
          >
            Tambah Form
          </button>
          <button
            onClick={handleSubmit}
            className={`bg-green-500 text-white py-2 px-4 rounded mr-2 hover:bg-green-600 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sedang Mengirim..." : "Kirim Pengajuan"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPengajuan;