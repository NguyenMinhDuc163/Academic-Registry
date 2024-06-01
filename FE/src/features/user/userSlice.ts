import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface IInforUser{
  birth: string
    email: string
    full_name: string
    password: string
    tai_khoan_id: string
    ten_khoa: string
    username:string
    vai_tro: string
}
interface IUserSlice {
    user:IInforUser|null
}

const initialState: IUserSlice = {
  user: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IInforUser|null>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
