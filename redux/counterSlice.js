import { createSlice } from '@reduxjs/toolkit'

const initialState = {
 property : {}
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setproperty : (state , property )=>{
      state.property = property.payload;
    },
    clearproperty : (state)=>{
      state.property = {};
    }
  },
})

// Action creators are generated for each case reducer function
export const {  setproperty , clearproperty } = counterSlice.actions

export default counterSlice.reducer