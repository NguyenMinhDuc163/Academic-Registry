import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ILoadingSlice {
  isLoading: boolean;
  isLogin:boolean;
}

const initialState: ILoadingSlice = {
  isLoading: true,
  isLogin:false
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
  },
});

export const { setLoading,setIsLogin } = loadingSlice.actions;
export default loadingSlice.reducer;
