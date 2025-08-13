import { useState, useRef, useEffect } from "react";
import {
  Upload,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getData, uploadFile } from "../api/ExcelPageApi";
import { toast } from "react-toastify";

export default function ExcelTable() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [originalData, setOriginalData] = useState({
    data: [],
    total: 0,
    totalPages: 0,
  });
const [selected, setSelected] = useState(100); // default 100
  //   const [toasts, setToasts] = useState([])
  // const [trigger, setTrigger] = useState(false);
//   const pageSize = 100;

  console.log("originalData", originalData);
  const options = [100, 500, 1000];

  const fileInputRef = useRef(null);

  // Simple toast function
  //   const showToast = (message, type = "success") => {
  //     const id = Math.random().toString(36).substr(2, 9)
  //     const newToast = { id, message, type }
  //     setToasts((prev) => [...prev, newToast])
  //     setTimeout(
  //       () => {
  //         setToasts((prev) => prev.filter((toast) => toast.id !== id))
  //       },
  //       type === "success" ? 3000 : 5000,
  //     )
  //   }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resData = await getData();
        console.log("resData", resData);

        if (resData && resData.data) {
          setOriginalData(resData);
          setData(resData.data);
          console.log("resData", resData);
        } else {
          // Handle case where API returns array directly
          const dataArray = Array.isArray(resData) ? resData : [];
          setOriginalData({
            data: dataArray,
            total: dataArray.length,
            totalPages: Math.ceil(dataArray.length / selected),
          });
          console.log("dataArray", dataArray);
          setData(dataArray);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
        toast.error(err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await uploadFile(file);
      toast.success(response.message);
      const resData = await getData();

      if (resData && resData.data) {
        setOriginalData(resData);
        setData(resData.data);
        // setTrigger(true)
      } else {
        const dataArray = Array.isArray(resData) ? resData : [];
        setOriginalData({
          data: dataArray,
          total: dataArray.length,
          totalPages: Math.ceil(dataArray.length / selected),
        });
        setData(dataArray);
      }

      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
      toast.error(err.message, "error");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFileUpload(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const totalPages =
    originalData.totalPages || Math.ceil(data.length / selected);
  const startIndex = (currentPage - 1) * selected;
  const currentData = data.slice(startIndex, startIndex + selected);
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const totalRecords = originalData.total || data.length;

  console.log("data is", data);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Toast notifications */}
      {/* <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded-lg shadow-lg text-white font-medium animate-in slide-in-from-right ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div> */}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Excel Data Manager
            </h1>
            <p className="text-slate-600">
              Upload and manage your Excel files with ease
            </p>
          </div>

          {/* Upload Box */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div
              className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 ${
                isDragOver
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
              } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={isLoading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex items-center justify-center space-x-3">
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    <span className="text-blue-600 font-medium">
                      Uploading...
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-slate-500" />
                    <span className="text-slate-700 font-medium">
                      Upload new Excel file
                    </span>
                  </>
                )}
              </div>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-6 py-2 text-left text-sm font-semibold text-slate-700 border-b border-slate-200"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Loading ? (
                  <tr>
                    <td
                      colSpan={columns.length || 1}
                      className="py-10 text-center"
                    >
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-2" />
                      <span className="text-blue-600 font-medium">
                        Data is loading...
                      </span>
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-slate-50">
                      {columns.map((col) => (
                        <td
                          key={col}
                          className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap"
                        >
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length || 1}
                      className="py-10 text-center text-slate-500"
                    >
                      No data available. Upload an Excel file to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
            {totalRecords > 0 && (
    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
      
      {/* Showing text */}
      <div className="text-sm text-slate-600">
        Showing {startIndex + 1} to{" "}
        {Math.min(startIndex + selected, totalRecords)} of{" "}
        {totalRecords} results
      </div>

      {/* Dropdown */}
      <div className="relative flex items-center gap-1 w-58">
      <label htmlFor="" className="w-full block text-lg text-gray-600">Select Limit</label>
        <select
          value={selected}
          onChange={(e) => {
            setSelected(Number(e.target.value)); // ✅ Convert to number
            setCurrentPage(1); // ✅ Reset to first page when changing page size
          }}
          className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
          ▼
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let startPage = Math.max(currentPage - 2, 1);
          const endPage = Math.min(startPage + 4, totalPages);

          if (endPage - startPage < 4) {
            startPage = Math.max(endPage - 4, 1);
          }

          const pageNum = startPage + i;
          if (pageNum > totalPages) return null;

          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-2 text-sm rounded-lg ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-300 hover:bg-slate-50"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )}
        </div>
      </div>
    </div>
  );
}
