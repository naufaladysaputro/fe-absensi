// src/pages/ClassPage.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import Layout from "../../components/Layout";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiEye } from "react-icons/fi";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { API_URL } from "../../config";
import { log } from "console";

interface Class {
  id: number;
  nama_kelas: string;
  selection_id: number;
}

interface Selection {
  id: number;
  nama_rombel: string;
}

const ClassPage = () => {
  const [kelasRombel, setKelasRombel] = useState<string>("");
  const [classData, setClassData] = useState<any[]>([]);
  const [selectionData, setSelectionData] = useState<Selection[]>([]);
  const [formData, setFormData] = useState({ nama_kelas: "", selections_id: 0 });
  const [formSelection, setFormSelection] = useState({ nama_rombel: "" });
  const [formSchedule, setFormSchedule] = useState({ classes_id: "", schedule: "" });

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSelection, setSelectedSelection] = useState<Selection | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const token = Cookies.get("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [classRes, selectionRes] = await Promise.all([axios.get(`${API_URL}/api/classes`, { headers }), axios.get(`${API_URL}/api/selections`, { headers })]);
      setClassData(classRes.data.data);
      setSelectionData(selectionRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "nama_kelas" || name === "selections_id") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormSelection((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedClass) {
        await axios.put(`${API_URL}/api/classes/${selectedClass.id}`, formData, { headers });
        Swal.fire("Berhasil", "Data kelas diperbarui", "success");
      } else {
        await axios.post(`${API_URL}/api/classes`, formData, { headers });
        Swal.fire("Berhasil", "Data kelas ditambahkan", "success");
      }
      fetchData();
      handleCloseClass();
    } catch (err: any) {
      Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan", "error");
    }
  };

  const handleSubmitSelection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedSelection) {
        await axios.put(`${API_URL}/api/selections/${selectedSelection.id}`, formSelection, { headers });
        Swal.fire("Berhasil", "Data rombel diperbarui", "success");
      } else {
        await axios.post(`${API_URL}/api/selections`, formSelection, { headers });
        Swal.fire("Berhasil", "Data rombel ditambahkan", "success");
      }
      fetchData();
      handleCloseSelection();
    } catch (err: any) {
      Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan", "error");
    }
  };

  const handleEditClass = (item: any) => {
    setSelectedClass(item);
    setFormData({ nama_kelas: item.nama_kelas, selections_id: item.selections_id });
    setIsEditMode(true);
    setIsClassModalOpen(true);
  };

  const handleEditSelection = (item: Selection) => {
    setSelectedSelection(item);
    setFormSelection({ nama_rombel: item.nama_rombel });
    setIsEditMode(true);
    setIsSelectionModalOpen(true);
  };

  const handleDeleteClass = async (id: number) => {
    if (confirm("Yakin hapus kelas?")) {
      await axios.delete(`${API_URL}/api/classes/${id}`, { headers });
      fetchData();
    }
  };

  const handleDeleteSelection = async (id: number) => {
    if (confirm("Yakin hapus rombel?")) {
      await axios.delete(`${API_URL}/api/selections/${id}`, { headers });
      fetchData();
    }
  };

  const handleCloseClass = () => {
    setIsClassModalOpen(false);
    setIsEditMode(false);
    setFormData({ nama_kelas: "", selections_id: 0 });
    setSelectedClass(null);
  };

  const handleCloseSelection = () => {
    setIsSelectionModalOpen(false);
    setIsEditMode(false);
    setFormSelection({ nama_rombel: "" });
    setSelectedSelection(null);
  };

  const handleScheduleClass = async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/api/schedules/${id}`, { headers });
      const scheduleData = response.data.data;
      console.log(scheduleData.schedule_path);

      Swal.fire({
        title: "Jadwal Kelas",
        html: `<img src="${scheduleData.schedule_path ? `${API_URL}/schedules/${scheduleData.schedule_path}" alt="Jadwal" style="max-width:100%;"/>` : "Jadwal Belum ditambahkan"}</pre>`,
        // html: `<pre>${scheduleData.schedule_path ? scheduleData.schedule_path : 'Jadwal Belum ditambahkan'}</pre>`,
        showCloseButton: true,
        focusConfirm: false,
      });
    } catch (err: any) {
      Swal.fire("Gagal", "Jadwal Belum ditambahkan", "error");
    }
  };

  const handleEditScheduleClass = async (id: number, id_schedule: number) => {
    try {
      const response = await axios.get(`${API_URL}/api/schedules/${id}`, { headers });
      const scheduleData = response.data.data;
      console.log(scheduleData.schedule_path);

      Swal.fire({
        title: "Jadwal Kelas",
        html: `<img src="${scheduleData.schedule_path ? `${API_URL}/schedules/${scheduleData.schedule_path}" alt="Jadwal" style="max-width:100%;"/>` : "Jadwal Belum ditambahkan"}</pre>`,
        // html: `<pre>${scheduleData.schedule_path ? scheduleData.schedule_path : 'Jadwal Belum ditambahkan'}</pre>`,
        showCloseButton: true,
        focusConfirm: false,
      });
    } catch (err: any) {
      Swal.fire("Gagal", "Jadwal Belum ditambahkan", "error");
    }
  };

  const handleAddScheduleClass = async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/api/schedules/${id}`, { headers });
      const scheduleData = response.data.data;
      console.log(scheduleData.schedule_path);

      Swal.fire({
        title: "Jadwal Kelas",
        html: `<img src="${scheduleData.schedule_path ? `${API_URL}/schedules/${scheduleData.schedule_path}" alt="Jadwal" style="max-width:100%;"/>` : "Jadwal Belum ditambahkan"}</pre>`,
        // html: `<pre>${scheduleData.schedule_path ? scheduleData.schedule_path : 'Jadwal Belum ditambahkan'}</pre>`,
        showCloseButton: true,
        focusConfirm: false,
      });
    } catch (err: any) {
      Swal.fire("Gagal", "Jadwal Belum ditambahkan", "error");
    }
  };

  // Fungsi untuk buka modal jadwal dan set kelas_id di formSchedule
  const handleOpenScheduleModal = (kelas: any) => {
    setFormSchedule((prev) => ({ ...prev, classes_id: kelas.id }));
if (kelas && kelas.selection) {
    setKelasRombel(`${kelas.nama_kelas} - ${kelas.selection.nama_rombel}`);
  }    setIsScheduleModalOpen(true);
    const latestSchedule = kelas.schedule?.[0]; // Ambil schedule pertama (jika ada)

  if (latestSchedule && latestSchedule.schedule_path) {
    setLogoPreview(`${API_URL}/schedules/${latestSchedule.schedule_path}`);
    setIsEditMode(true);
  } else {
    setLogoPreview(null);
    setIsEditMode(false);
  }

    // setSelectedFile(null);
  };

  // Fungsi untuk handle perubahan file gambar jadwal
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit jadwal (upload gambar)
  const handleSubmitSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      Swal.fire("Error", "Harap pilih file gambar jadwal terlebih dahulu", "error");
      return;
    }

    try {
      const formDataSchedule = new FormData();
      formDataSchedule.append("classes_id", formSchedule.classes_id);
      formDataSchedule.append("schedule", selectedFile);

      await axios.post(`${API_URL}/api/schedules/upsert`, formDataSchedule, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire("Berhasil", "Jadwal berhasil disimpan", "success");
      fetchData();
      handleCloseSchedule();
    } catch (err: any) {
      Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan", "error");
    }
  };

  // Fungsi close modal jadwal
  const handleCloseSchedule = () => {
    setIsScheduleModalOpen(false);
    setIsEditMode(false);
    setFormSchedule({ classes_id: "", schedule: "" });
    setLogoPreview(null);
    setSelectedFile(null);
    setKelasRombel("")
  };
  return (
    <Layout>
      <div className="p-4 space-y-8 bg-gray-100">
        {/* Kelas Section */}
        <div>
          <div className="flex justify-between mb-2">
            <h2 className="text-xl font-bold">Data Kelas</h2>
            <button onClick={() => setIsClassModalOpen(true)} className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-1">
              <FiPlus /> Tambah Kelas
            </button>
          </div>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2">Nama Kelas</th>
                <th className="border p-2">Rombel</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-gray-100">
              {classData.map((item: any, i) => (
                <tr key={item.id}>
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{item.nama_kelas}</td>
                  <td className="border p-2">{item.selection.nama_rombel || "-"}</td>
                  <td className="border p-2 flex gap-2">
                    <button onClick={() => handleEditClass(item)}>
                      <FiEdit2 />
                    </button>
                    <button onClick={() => handleDeleteClass(item.id)}>
                      <FiTrash2 className="text-red-500" />
                    </button>
                    {item.schedule?.length != 0 && (
                      <button onClick={() => handleScheduleClass(item.schedule[0].id)} className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded transition" aria-label="Lihat Jadwal">
                        <FiEye className="text-blue-500" />
                      </button>
                    )}

                    {item.schedule?.length === 0 ? (
                      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition" onClick={() => handleOpenScheduleModal(item)}>
                        <FiPlus className="inline mr-1" /> Tambah Jadwal
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          // contoh kalau mau langsung edit jadwal juga bisa ditambahkan
                          handleOpenScheduleModal(item);
                          setIsEditMode(true);
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                      >
                        <FiEdit2 className="inline mr-1" /> Edit Jadwal
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rombel Section */}
        <div>
          <div className="flex justify-between mb-2">
            <h2 className="text-xl font-bold">Data Rombel</h2>
            <button onClick={() => setIsSelectionModalOpen(true)} className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-1">
              <FiPlus /> Tambah Rombel
            </button>
          </div>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2">Nama Rombel</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-gray-100">
              {selectionData.map((item, i) => (
                <tr key={item.id}>
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{item.nama_rombel}</td>
                  <td className="border p-2 flex gap-2">
                    <button onClick={() => handleEditSelection(item)}>
                      <FiEdit2 />
                    </button>
                    <button onClick={() => handleDeleteSelection(item.id)}>
                      <FiTrash2 className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Kelas */}
        {isClassModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
              <button className="absolute top-2 right-2" onClick={handleCloseClass}>
                <FiX />
              </button>
              <h3 className="text-lg font-bold mb-4">{isEditMode ? "Edit Kelas" : "Tambah Kelas"}</h3>
              <form onSubmit={handleSubmitClass} className="space-y-4">
                <div>
                  <label>Nama Kelas</label>
                  <input name="nama_kelas" value={formData.nama_kelas} onChange={handleInput} required className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label>Pilih Rombel</label>
                  <select name="selections_id" value={formData.selections_id} onChange={handleInput} required className="w-full border p-2 rounded">
                    <option value="">-- Pilih --</option>
                    {selectionData.map((rombel) => (
                      <option key={rombel.id} value={rombel.id}>
                        {rombel.nama_rombel}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  {isEditMode ? "Update" : "Simpan"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal Rombel */}
        {isSelectionModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
              <button className="absolute top-2 right-2" onClick={handleCloseSelection}>
                <FiX />
              </button>
              <h3 className="text-lg font-bold mb-4">{isEditMode ? "Edit Rombel" : "Tambah Rombel"}</h3>
              <form onSubmit={handleSubmitSelection} className="space-y-4">
                <div>
                  <label>Nama Rombel</label>
                  <input name="nama_rombel" value={formSelection.nama_rombel} onChange={handleInput} required className="w-full border p-2 rounded" />
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                  {isEditMode ? "Update" : "Simpan"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal Jadwal */}
        {isScheduleModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
              <button className="absolute top-2 right-2" onClick={handleCloseSchedule}>
                <FiX />
              </button>
              <h3 className="text-lg font-bold mb-4">Tambah / Edit Jadwal Kelas</h3>
              <form onSubmit={handleSubmitSchedule} className="space-y-4">
                <div>
                  {/* <label>Kelas ID</label> */}
                  <input hidden name="classes_id" value={formSchedule.classes_id} className="w-full border p-2 rounded bg-gray-200" />
                </div>
                <div>
                  <label>Kelas</label>
                  <input readOnly name="classes" value={kelasRombel} className="w-full border p-2 rounded bg-gray-200" />
                </div>
                <div>
                  <label>Preview Jadwal</label>
                  <div style={{ marginBottom: "10px", border: "1px solid #eee", padding: "10px", minHeight: "150px" }}>
                    {logoPreview ? <img src={logoPreview} alt="Preview Jadwal" className="max-w-full mx-auto" /> : <p className="text-gray-500 text-center">Belum ada preview</p>}
                  </div>
                  <input type="file" accept="image/png, image/jpg, image/jpeg, image/gif, image/svg+xml" onChange={handleLogoChange} className="w-full" required={!logoPreview} />
                  <span className="text-sm text-secondary">(.png, .jpg, .jpeg, .gif, .svg)</span>
                </div>

                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                  Simpan Jadwal
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClassPage;
