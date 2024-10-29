interface CourseScore {
    mon_hoc_id: string;
    diem: number;
}

const fakeScoreData: { HK1: CourseScore[]; HK2: CourseScore[] } = {
    HK1: [
        { mon_hoc_id: "BAS1153", diem: 6.8 },
        { mon_hoc_id: "BAS1161", diem: 5.3 },
        { mon_hoc_id: "INT1313", diem: 8 },
        { mon_hoc_id: "INT1312", diem: 6.8 },
        { mon_hoc_id: "INT1319", diem: 10 },
        { mon_hoc_id: "INT1332", diem: 9.6 },
        { mon_hoc_id: "INT1336", diem: 7.8 },
    ],
    HK2: [
        { mon_hoc_id: "BAS1154", diem: 7.2 },
        { mon_hoc_id: "BAS1162", diem: 6.5 },
        { mon_hoc_id: "INT1314", diem: 8.5 },
        { mon_hoc_id: "INT1313", diem: 5.4 },
        { mon_hoc_id: "INT1320", diem: 9.3 },
        { mon_hoc_id: "INT1333", diem: 8.1 },
        { mon_hoc_id: "INT1337", diem: 6.9 },
    ],
};

export { fakeScoreData };
