import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import Charts from "./Charts";
import { fakeScoreData } from "./fakeScoreData"; // Import dữ liệu giả

const KI_HOC = [
  { label: "HK1" },
  { label: "HK2" },
];

interface ChartData {
  labels: string[];
  scores: number[];
}

const UserInfor = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [selectedKiHoc, setSelectedKiHoc] = useState<"HK1" | "HK2">("HK1");
  const [chartData, setChartData] = useState<ChartData>({ labels: [], scores: [] });

  const updateChartData = (kiHoc: "HK1" | "HK2") => {
    const data = fakeScoreData[kiHoc] || [];
    const labels = data.map((item) => item.mon_hoc_id);
    const scores = data.map((item) => item.diem);
    setChartData({ labels, scores });
  };

  useEffect(() => {
    updateChartData(selectedKiHoc);
  }, [selectedKiHoc]);

  return (
      <div className="shadow-md py-[6px] px-[10px] flex justify-between">
        <div className="w-[50%]">
          <div className="shadow-md border-[1px] border-[#cccc] ">
            <h1 className="text-mainRed font-semibold border-b-[1px] px-[10px] py-[6px] border-[#cccc]">
              Thông tin sinh viên
            </h1>
            <div className="px-[10px] py-[6px] ">
              <div className="flex">
                <p className="w-[200px]">Mã SV</p>
                <p>{user?.tai_khoan_id}</p>
              </div>
              <div className="flex">
                <p className="w-[200px]">Họ và tên</p>
                <p>{user?.full_name}</p>
              </div>
              <div className="flex">
                <p className="w-[200px]">Ngày sinh</p>
                <p>{user?.birth}</p>
              </div>
              <div className="flex">
                <p className="w-[200px]">Email</p>
                <p>{user?.email}</p>
              </div>
              <div className="flex">
                <p className="w-[200px]">Hiện diện</p>
                <p>Đang học</p>
              </div>
            </div>
          </div>

          {/* Thông tin khóa học */}
          <div className="shadow-md border-[1px] mt-[20px] border-[#cccc] ">
            <h1 className="text-mainRed font-semibold border-b-[1px] px-[10px] py-[6px] border-[#cccc]">
              Thông tin khoá học
            </h1>
            <div className="px-[10px] py-[6px] ">
              <div className="flex">
                <p className="w-[200px]">Ngành</p>
                <p>Điện tử viễn thông</p>
              </div>
              <div className="flex">
                <p className="w-[200px]">Khoa</p>
                <p>Điện tử viễn thông</p>
              </div>
              <div className="flex">
                <p className="w-[200px]">Bậc hệ đào tạo</p>
                <p>ĐHCQ (4,5 năm)</p>
              </div>
              <div className="flex">
                <p className="w-[200px]">Niên khóa</p>
                <p>2021-2026</p>
              </div>
            </div>
          </div>
        </div>

        <div className="shadow-lg w-[50%] ml-[10px]">
          <div className="flex items-center border-b-[1px] border-b-[#cccc] pb-[10px] ">
            <h1 className="text-mainRed font-semibold px-[10px] py-[6px] mt-[10px]">
              Kết quả học tập
            </h1>
            <Autocomplete
                disablePortal
                options={KI_HOC}
                sx={{ width: 300, "& .MuiAutocomplete-input": { fontSize: 15 } }}
                defaultValue={KI_HOC[0]}
                size="small"
                onChange={(_, value) => {
                  const kiHocLabel = value?.label as "HK1" | "HK2";
                  setSelectedKiHoc(kiHocLabel);
                  updateChartData(kiHocLabel);
                }}
                renderInput={(params) => <TextField {...params} label="Kì Học" />}
            />
          </div>
          <Charts labels={chartData.labels} scores={chartData.scores} />
        </div>
      </div>
  );
};

export default UserInfor;
