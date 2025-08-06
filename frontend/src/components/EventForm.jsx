import React, { useState, useEffect } from "react";

const EventForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    startTime: "",
    endTime: "",
  });
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch userId from backend
    if (token) {
      fetch("http://localhost:3000/user/me", { headers: { token } })
        .then(res => res.json())
        .then(data => {
          if (data && data.user && data.user._id) setUserId(data.user._id);
        });
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:3000/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({ ...form, userId }),
      });
      const data = await res.json();
      if (res.status === 201) {
        setMessage("Event created successfully!");
        setForm({ title: "", description: "", date: "", location: "", startTime: "", endTime: "" });
      } else {
        setMessage(data.message || "Event creation failed");
      }
    } catch (err) {
      setMessage("Event creation error");
    }
  };

  return (
    <form
      className="event-form bg-gray-100 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6 max-w-lg mx-auto border-2 "
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
        Create Event
      </h2>
      <div className="mb-5">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Event Name
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter event name"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="mb-5">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Enter event description"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="mb-5">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          Date
        </label>
        <input
          type="date"
          name="date"
          id="date"
          value={form.date}
          onChange={handleChange}
          placeholder="YYYY-MM-DD"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="flex space-x-4 mt-2">
          <label>Start Time</label>
          <input
            type="time"
            name="startTime"
            id="startTime"
            value={form.startTime}
            onChange={handleChange}
            placeholder="HH:MM"
            required
            className=" px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
          />
          <label>End Time</label>
          <input
            type="time"
            name="endTime"
            id="endTime"
            value={form.endTime}
            onChange={handleChange}
            placeholder="HH:MM"
            required
            className=" px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
          />
        </div>
      </div>
      <div className="mb-5">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <input
          type="text"
          name="location"
          id="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Enter event location"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Create Event
      </button>
      {message && <div className="mt-2 text-red-600">{message}</div>}
    </form>
  );
};

export default EventForm;
