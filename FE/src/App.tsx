import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./page/home-page/Home";
import BaseLayout from "./BaseLayout/BaseLayout";
import { ROUTES } from "./until/CONSTANS";
import UserInfor from "./page/userinfo-page/UserInfor";
import Schedule from "./page/Schedule/Schedule";
import Score from "./page/Score/Score";
import CourseRegistration from "./page/CourseRegistration/CourseRegistration";
import Auth from "./BaseLayout/Auth";
function App() {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
       <Route path="" element={<Auth/>}>
       <Route path={ROUTES.USER_INFOR} element={<UserInfor />} />
        <Route path={ROUTES.SCHEDULE} element={<Schedule />} />
        <Route path={ROUTES.SCORE} element={<Score />} />
        <Route
          path={ROUTES.COURSE_REGISTRATION}
          element={<CourseRegistration />}
        />
       </Route>
      </Route>
    </Routes>
  );
}

export default App;
