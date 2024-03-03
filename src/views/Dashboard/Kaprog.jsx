import React, { useState, useEffect } from "react";
import Api from "../../Api";
import Laykap from "../../components/Laykap";
import { FaUserGraduate, FaChalkboardTeacher, FaBook } from "react-icons/fa";

const KaprogDashboard = () => {
  document.title ="KaprogDashboard";

  const [totalUsersRole3, setTotalUsersRole3] = useState(0);
  const [totalUsersRole4, setTotalUsersRole4] = useState(0);
  const [totalJurnals, setTotalJurnals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get("/api/kaprog/dashboard");
        setTotalUsersRole3(response.data.total_users_role_3);
        setTotalUsersRole4(response.data.total_users_role_4);
        setTotalJurnals(response.data.total_jurnals);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Laykap>
        <div className="flex flex-col flex-1 p-8 transition-all">
          <p className="text-2xl font-bold mb-4">Selamat Datang Di Kaprog Dashboard</p>
          <div className="grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-42 mt-12">
             <div className="card border-0 shadow w-full h-full p-4 bg-primary flex items-center">
              <div className="card-body text-center flex items-center">
                <FaChalkboardTeacher size={20} className="mr-2" />
                <h6 className="text-sm">Total Pembimbing:</h6>
                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  <h5 className="font-extrabold text-center"> {totalUsersRole3}</h5>
                )}
              </div>
            </div>
            <div className="card border-0 shadow w-full h-full p-4 bg-secondary flex items-center">
              <div className="card-body text-center flex items-center">
                <FaUserGraduate size={20} className="mr-2" />
                <h6 className="text-sm">Total Siswa:</h6>
                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  <h5 className="font-extrabold text-center"> {totalUsersRole4}</h5>
                )}
              </div>
            </div>
            <div className="card border-0 shadow w-full h-full p-4 bg-tertiary flex items-center">
              <div className="card-body text-center flex items-center">
                <FaBook size={20} className="mr-2" />
                <h6 className="text-sm">Total Jurnal Seluruh Siswa:</h6>
                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  <h5 className="font-extrabold text-center"> {totalJurnals}</h5>
                )}
              </div>
            </div>
          </div>
        </div>
      </Laykap>
    </div>
  );
};

export default KaprogDashboard;
