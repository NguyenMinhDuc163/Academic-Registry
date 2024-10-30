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

  const OPTION_COURSE = [
    { label: "Môn học theo kì học lớp sinh viên" },
    { label: "Môn học mở theo lớp sinh viên" },
    { label: "Môn học trong chương trình đào tạo kế hoạch" },
    { label: "Môn học chưa học trong CTDT kế hoạch" },
    { label: "Môn học sinh viên cần học lại (Đã rớt)" },
    { label: "Lọc theo khoa quản lý môn học" },
  ];

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
    const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [listCourseChecked, setListCourseChecked] = useState<string[]>([]);
    const [listCourseRegisted, setListCourseRegisted] = useState<ICourseRegisted[]>([]);
    const [selectedFilter, setSelectedFilter] = useState(OPTION_COURSE[0].label);
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);

    const getDataCourse = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get(`${env.VITE_API_ENDPOINT}/all-course`);
        setCourses(res.data.object);
        applyFilter(res.data.object, selectedFilter);
      } catch (e) {
        console.log(e);
        setCourses([]);
        setFilteredCourses([]);
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

    useEffect(() => {
      const filtered = courses.filter(
          (course) =>
              course.ten_mon_hoc.toLowerCase().includes(searchQuery.toLowerCase()) ||
              course.mon_hoc_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    }, [searchQuery, courses]);

    const applyFilter = (courses: ICourse[], filter: string) => {
      if (filter === "Môn học trong chương trình đào tạo kế hoạch") {
        setFilteredCourses(courses);
      } else if (filter === "Môn học sinh viên cần học lại (Đã rớt)") {
        const randomCourses = [...courses].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
        setFilteredCourses(randomCourses);
      } else {
        const randomCourses = [...courses].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 6) + 10);
        setFilteredCourses(randomCourses);
      }
    };

    const onFilterChange = (_event: any, value: any) => {
      setSelectedFilter(value.label);
      applyFilter(courses, value.label);
    };

    const calculateTotalCredits = () => {
      return listCourseRegisted.reduce((sum, registed) => {
        const course = courses.find((c) => c.mon_hoc_id === registed.mon_hoc_id);
        return sum + (course ? parseInt(course.so_tc, 10) : 0);
      }, 0);
    };

    const onChecked = (idCourseCheck: string) => {
      if (listCourseChecked.includes(idCourseCheck)) {
        setListCourseChecked(listCourseChecked.filter((id) => id !== idCourseCheck));
      } else {
        setListCourseChecked([...listCourseChecked, idCourseCheck]);
      }
    };

    const handleRegisterCourse = async () => {
      // Tính tổng số tín chỉ hiện tại
      const currentCredits = calculateTotalCredits();

      // Tính tổng số tín chỉ của các môn học sắp đăng ký
      const additionalCredits = listCourseChecked.reduce((sum, courseId) => {
        const course = courses.find((c) => c.mon_hoc_id === courseId);
        return sum + (course ? parseInt(course.so_tc, 10) : 0);
      }, 0);

      // Kiểm tra tổng tín chỉ dự kiến
      if (currentCredits + additionalCredits > 21) {
        toast.warning("Bạn không thể đăng ký quá 21 tín chỉ.");
        return;
      }

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

          <div className="flex mt-[12px] mx-[6px] items-center gap-4">
            <Autocomplete
                disablePortal
                options={OPTION_COURSE}
                sx={{ width: 500 }}
                defaultValue={OPTION_COURSE[2]}
                size="small"
                onChange={onFilterChange}
                renderInput={(params) => <TextField {...params} label="Lọc theo môn học" />}
            />
            <TextField
                label="Tìm kiếm theo tên hoặc mã môn học"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: 400 }}
            />
          </div>

          <div>
            <h1 className="bg-[#7a7a7a1c] mt-[10px] py-[10px] px-[6px] font-semibold">
              Danh sách môn học mở cho đăng ký
            </h1>
            {filteredCourses.length > 0 ? (
                <ListCourseOpenRegister
                    listCourseRegisted={listCourseRegisted}
                    courses={filteredCourses}
                    onChecked={onChecked}
                    listCourseChecked={listCourseChecked}
                />
            ) : (
                <div className="flex justify-center items-center h-[100px]">
                  <p className="text-gray-500 text-lg font-semibold">Không có dữ liệu môn học</p>
                </div>
            )}
            <div className="flex justify-end m-[10px]">
              <Button variant="contained" style={{ backgroundColor: "#ad171c" }} size="large" onClick={handleRegisterCourse}>
                Đăng ký
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-[10px] py-[10px] px-[6px] font-semibold bg-[#7a7a7a1c]">
            <h1>Môn học đã đăng ký :</h1>
            <span>Số tín chỉ đã đăng ký: {calculateTotalCredits()}</span>
          </div>
          <ListCourseRegisted listCourseRegisted={listCourseRegisted} onDelete={onDelete} />
          {!listCourseRegisted.length && <h1 className="bg-[#7a7a7a1c] text-center py-[6px] italic">Không tìm thấy dữ liệu</h1>}
        </div>
    );
  };

  export default CourseRegistration;
