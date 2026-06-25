import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../auth/authSlice";
import type { AppDispatch } from "../app/store";

const Logout = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(logout());

        localStorage.clear(); // 🔥 safest

        window.location.href = "/";
    }, []);

    return null;
};

export default Logout;