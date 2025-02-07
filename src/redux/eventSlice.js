import { createSlice } from '@reduxjs/toolkit';
// const initialState = {
//     events: JSON.parse(localStorage?.getItem("events") || "[]"),
//   };
const eventSlice = createSlice({
    name: 'events',
    initialState:[],
    reducers: {
        addEvent: (state, action) => {
            console.log("addEvent - ", action.payload)
            // const event = {
            //     ...action.payload,
            //     date: new Date(action.payload.date).toISOString()  // ✅ Convert new event date to ISO
            // };
            state?.push(action.payload); 
            localStorage.setItem("events", JSON.stringify(state.events));
        },
        setEvents: (state, action) => {
            console.log("SetEvent - ", action.payload)
            state = action.payload || [];
            localStorage.setItem("events", JSON.stringify(state.events));
        },
    },
});

const sidebarState = createSlice({
    name: 'sidebarState',
    initialState:true,
    reducers: {
        // changeDate: (state, action) => {
        //     state = action.payload
        //     // localStorage.setItem("events", JSON.stringify(state.events));
        // },
        changeSidebar : (state, action)=>{
            // console.log(action.payload)
            state = action.payload
            return action.payload
        }
    },
});

const homeState = createSlice({
    name: 'homeState',
    initialState:'Home',
    reducers: {
        // changeDate: (state, action) => {
        //     state = action.payload
        //     // localStorage.setItem("events", JSON.stringify(state.events));
        // },
        changeHome : (state, action)=>{
            console.log("changeHome - ", action.payload);
            return action.payload || state;
        }
    },
});

export const { setEvents, addEvent } = eventSlice.actions;
export const { changeSidebar } = sidebarState.actions;
export const { changeHome } = homeState.actions;

// Export reducers
export const eventReducer = eventSlice.reducer;
export const sidebarReducer = sidebarState.reducer;
export const homeReducer = homeState.reducer;