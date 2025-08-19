// src/LoginPage.jsx
import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { AiFillEye } from "react-icons/ai";
import logo from "./assets/logo.png";

export default function LoginForm() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      {/* الحاوية الشفافة */}
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-6 sm:p-8 w-[90%] max-w-xs text-center shadow-lg">
        
        {/* الشعار */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full">
            <img src={logo} alt="logo" className="w-16 h-16" />
          </div>
          <h1 className="text-white text-4xl font-bold mt-3">Menu</h1>
        </div>

        {/* حقل اسم المستخدم */}
        <div className="relative mb-4">
          <FaUser
            className="absolute top-1/2 left-4 -translate-y-1/2"
            style={{ color: "#2F4B26" }}
          />
          <input
            type="text"
            placeholder="User Name"
            className="w-full pl-10 pr-3 py-2 rounded-full focus:outline-none italic text-sm"
            style={{
              backgroundColor: "#818360",
              color: "#2F4B26",
            }}
          />
        </div>

        {/* حقل كلمة المرور */}
        <div className="relative mb-2">
          <FaLock
            className="absolute top-1/2 left-4 -translate-y-1/2"
            style={{ color: "#2F4B26" }}
          />
          <input
            type="password"
            placeholder="PassWord"
            className="w-full pl-10 pr-10 py-2 rounded-full focus:outline-none italic text-sm"
            style={{
              backgroundColor: "#818360",
              color: "#2F4B26",
            }}
          />
          <AiFillEye
            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
            style={{ color: "#2F4B26" }}
          />
        </div>

        {/* تذكرني و نسيت كلمة المرور */}
        <div className="flex justify-between items-center text-xs mb-4">
          <label
            className="flex items-center gap-1"
            style={{ color: "#2F4B26" }}
          >
            <input type="checkbox" className="accent-black" />
            Remmber me
          </label>
          <span href="#" className="text-red-500 hover:underline">
            Forgot Password?
          </span>
        </div>

        {/* زر تسجيل الدخول */}
        <button
          className="w-full font-bold py-2 rounded-full hover:opacity-90 transition"
          style={{
            backgroundColor: "#BDD358",
            color: "#2F4B26",
          }}
        >
          LOGIN
        </button>

        {/* OR */}
        <div className="my-3" style={{ color: "#2F4B26" }}>
          OR
        </div>

        {/* رابط إنشاء حساب */}
        <p className="text-xs" style={{ color: "#2F4B26" }}>
          Don't Have an a account?{" "}
          <span href="#" className="text-red-500 hover:underline">
            create an account
          </span>
        </p>
      </div>
    </div>
  );
}
