import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../../services/config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setLoading } from "../../features/loading/loadingSlice";
import { fake_data } from "./fake_data";
import * as XLSX from "xlsx";

const Score = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const [listScore, setListScore] = useState<any[]>([]);

  const getScore = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(
          `${env.VITE_API_ENDPOINT}/diem?sinh_vien_id=${user?.tai_khoan_id}`
      );
      setListScore(res.data.object && res.data.object.length > 0 ? res.data.object : fake_data);
    } catch (e) {
      console.log(e);
      setListScore(fake_data);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Tiêu đề
    const title = [
      ["Học viện Công nghệ Bưu chính Viễn thông"],
      ["Bảng điểm"],
      [],
    ];

    const headers = [
      ["STT", "Nhóm", "Tên môn học", "Số tín chỉ", "Điểm cuối kỳ", "Điểm hệ số 10", "Điểm hệ số 4", "Điểm bằng chữ"],
    ];

    const data = listScore.map((item, index) => [
      index + 1,
      item.group,
      item.name,
      item.stc,
      item.result_end,
      item.score_10,
      item.score_4,
      item.score_c,
    ]);

    const worksheetData = [...title, ...headers, ...data];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Định dạng tiêu đề
    worksheet["A1"].s = {
      font: { bold: true, sz: 16 }, // Font size lớn hơn và in đậm
      alignment: { horizontal: "center", vertical: "center" },
    };
    worksheet["A2"].s = {
      font: { bold: true, sz: 14 }, // Font size nhỏ hơn một chút
      alignment: { horizontal: "center", vertical: "center" },
    };

    // Hợp nhất ô cho tiêu đề
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Merge cho "Học viện Công nghệ Bưu chính Viễn thông"
      { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // Merge cho "Bảng điểm"
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Scores");
    XLSX.writeFile(workbook, "Bang_diem.xlsx");
  };

  useEffect(() => {
    getScore();
  }, []);

  return (
      <div>
        <div className="bg-mainRed text-white font-normal flex justify-between px-[10px] py-[2px] items-center">
          <div>
            <i className="fa-solid fa-atom mr-[10px]"></i>
            <span>XEM ĐIỂM</span>
          </div>
          <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            Xuất Excel
          </button>
        </div>

        <table className="w-full rounded-t-md overflow-hidden mt-[40px]">
          <thead>
          <tr className="flex bg-mainRed text-white text-center justify-between border-[#CCCC]">
            <th className="border-[1px] flex-[1] font-normal">STT</th>
            <th className="border-[1px] flex-[1] font-normal">Mã MH</th>
            <th className="font-normal border-[1px] flex-[1]">Nhóm Tổ</th>
            <th className="font-normal border-[1px] flex-[5]">Tên môn học</th>
            <th className="font-normal border-[1px] flex-[1]">Số TC</th>
            <th className="font-normal border-[1px] flex-[1]">Điểm Thi Cuối</th>
            <th className="font-normal border-[1px] flex-[1]">Điểm TK (10)</th>
            <th className="font-normal border-[1px] flex-[1]">Điểm TK (4)</th>
            <th className="font-normal border-[1px] flex-[1]">Điểm TK (C)</th>
          </tr>
          </thead>
          <tbody>
          {listScore.map((item, idx) => (
              <tr key={idx} className="flex text-black text-center justify-between border-[#CCCC]">
                <td className="border-[1px] flex-[1] font-normal">{idx + 1}</td>
                <td className="border-[1px] flex-[1] font-normal">{item.id}</td>
                <td className="font-normal border-[1px] flex-[1]">{item.group}</td>
                <td className="font-normal border-[1px] flex-[5]">{item.name}</td>
                <td className="font-normal border-[1px] flex-[1]">{item.stc}</td>
                <td className="font-normal border-[1px] flex-[1]">{item.result_end}</td>
                <td className="font-normal border-[1px] flex-[1]">{item.score_10}</td>
                <td className="font-normal border-[1px] flex-[1]">{item.score_4}</td>
                <td className="font-normal border-[1px] flex-[1]">{item.score_c}</td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default Score;
