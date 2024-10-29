import { Autocomplete, Button, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../app/store";
import { setLoading } from "../../features/loading/loadingSlice";
import { env } from "../../services/config";
import ListCourseOpenRegister from "./ListCourseOpenRegister";
import ListCourseRegisted from "./ListCourseRegisted";
import * as XLSX from "xlsx";

const OPTION_COURSE = [{ label: "Môn học theo kì học lớp sinh viên" }];

export interface ICourse {
  bo_mon_id: string;
  mon_hoc_id: string;
  so_tc: string;
  ten_mon_hoc: string;
  ngay: string;
  kip: string;
  tuan: string;
}

export interface ICourseRegisted {
  dang_ki_id: string;
  ki_hoc: string;
  mon_hoc_id: string;
  nam_hoc: string;
  ten_lop: string;
  ten_mon_hoc: string;
}

const CourseRegistration = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [listCourseChecked, setListCourseChecked] = useState<string[]>([]);
  const [listCourseRegisted, setListCourseRegisted] = useState<ICourseRegisted[]>([]);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const getDataCourse = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get(`${env.VITE_API_ENDPOINT}/all-course`);
      setCourses(res.data.object);
    } catch (e) {
      console.log(e);
      setCourses([]);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getDataCourseRegisted = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get(`${env.VITE_API_ENDPOINT}/mon-hoc-dky/${user?.tai_khoan_id}`);
      setListCourseRegisted(res.data.object);
    } catch (e) {
      console.log(e);
      setListCourseRegisted([]);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getDataCourse();
    getDataCourseRegisted();
  }, []);

  const onChecked = (idCourseCheck: string) => {
    if (listCourseChecked.includes(idCourseCheck)) {
      setListCourseChecked(listCourseChecked.filter((id) => id !== idCourseCheck));
      return;
    }
    setListCourseChecked([...listCourseChecked, idCourseCheck]);
  };

  const handleRegisterCourse = async () => {
    dispatch(setLoading(true));
    try {
      await axios.post(`${env.VITE_API_ENDPOINT}/dang-ki`, {
        sinh_vien_id: user?.tai_khoan_id,
        danh_sach_mon_hoc: listCourseChecked,
      });
      getDataCourseRegisted();
      setListCourseChecked([]);
      toast.success("Đăng kí Thành Công");
    } catch (e) {
      toast.error("Thời gian môn học đã bị trùng lặp vui lòng kiểm tra lại");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const exportToExcel = () => {
    const title = [["Học viện Công nghệ Bưu chính Viễn thông"], ["Danh sách môn học đăng ký"]];
    const headers = [["Mã MH", "Tên môn học", "Số tín chỉ", "Ngày", "Kíp học", "Tuần học", "Kỳ học", "Năm học", "Tên lớp"]];

    // Kết hợp dữ liệu từ courses và listCourseRegisted
    const combinedData = listCourseRegisted.map((registed) => {
      const course = courses.find((c) => c.mon_hoc_id === registed.mon_hoc_id);
      return [
        registed.mon_hoc_id,
        registed.ten_mon_hoc,
        course?.so_tc || "",
        course?.ngay || "",
        course?.kip || "",
        course?.tuan || "",
        registed.ki_hoc,
        registed.nam_hoc,
        registed.ten_lop,
      ];
    });

    const worksheetData = [...title, [], ...headers, ...combinedData];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    // Thiết lập định dạng và căn giữa cho tiêu đề
    XLSX.utils.sheet_add_aoa(worksheet, [[""]], { origin: "A3" });
    worksheet["A1"].s = { font: { bold: true, sz: 16 }, alignment: { horizontal: "center" } };
    worksheet["A2"].s = { font: { bold: true, sz: 14 }, alignment: { horizontal: "center" } };
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách đăng ký");
    XLSX.writeFile(workbook, "DanhSachMonHocDangKy.xlsx");
  };

  const onDelete = () => {
    getDataCourse();
    getDataCourseRegisted();
  };

  return (
      <div>
        <div className="bg-mainRed text-[white] font-normal flex justify-between px-[10px] py-[2px] items-center">
          <div>
            <i className="fa-solid fa-atom mr-[10px]"></i>
            <span>ĐĂNG KÝ MÔN HỌC HỌC KỲ 2 - NĂM HỌC 2023-2024</span>
          </div>
          <Button variant="contained" color="primary" onClick={exportToExcel} style={{ backgroundColor: "#df1a42", color: "white" }}>
            Xuất Excel
          </Button>
        </div>

        <Autocomplete
            disablePortal
            options={OPTION_COURSE}
            sx={{ width: 400, "& .MuiAutocomplete-input": { fontSize: 15 } }}
            defaultValue={OPTION_COURSE[0]}
            size="small"
            className="mt-[12px] mx-[6px]"
            onChange={(_e, value) => console.log(value)}
            renderInput={(params) => <TextField {...params} label="Lọc theo môn học" />}
        />

        <div>
          <h1 className="bg-[#7a7a7a1c] mt-[10px] py-[10px] px-[6px] font-semibold">
            Danh sách môn học mở cho đăng ký
          </h1>
          <ListCourseOpenRegister listCourseRegisted={listCourseRegisted} courses={courses} onChecked={onChecked} listCourseChecked={listCourseChecked} />
          {!courses.length && <h1 className="bg-[#7a7a7a1c] text-center py-[6px] italic">Không tìm thấy dữ liệu</h1>}
          <div className="flex justify-end m-[10px]">
            <Button variant="contained" style={{ backgroundColor: "#ad171c" }} size="large" onClick={handleRegisterCourse}>Đăng ký</Button>
          </div>
        </div>

        <div>
          <h1 className="bg-[#7a7a7a1c] mt-[10px] py-[10px] px-[6px] font-semibold">Môn học đã đăng ký :</h1>
          <ListCourseRegisted listCourseRegisted={listCourseRegisted} onDelete={onDelete} />
          {!listCourseRegisted.length && <h1 className="bg-[#7a7a7a1c] text-center py-[6px] italic">Không tìm thấy dữ liệu</h1>}
        </div>
      </div>
  );
};

export default CourseRegistration;
