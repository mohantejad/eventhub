"use client";

// ClientHeader syncs Redux auth state with localStorage and renders the Header

import Header from "./Header";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/authSlice";

export default function ClientHeader() {
  const dispatch = useDispatch();

  useEffect(() => {
    // On mount, check for user in localStorage and update Redux state if found
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(loginSuccess({ user: JSON.parse(storedUser) }));
    }
  }, [dispatch]);

  // Render the main Header component
  return <Header />;
}
