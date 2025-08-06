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
    <div className="flex justify-center items-center py-8 bg-gradient-to-br from-blue-50 to-blue-100">
      <form
        className="w-full max-w-lg bg-white shadow-xl rounded-2xl px-10 pt-8 pb-10 border border-blue-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-8 text-blue-700 text-center">Create Event</h2>
        <div className="mb-6">
          <label htmlFor="title" className="block text-base font-medium text-gray-700 mb-2">Event Name</label>
          <input
            type="text"
            name="title"
            id="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter event name"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-base font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            id="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter event description"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="date" className="block text-base font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            name="date"
            id="date"
            value={form.date}
            onChange={handleChange}
            placeholder="YYYY-MM-DD"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <div className="flex space-x-4 mt-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                id="startTime"
                value={form.startTime}
                onChange={handleChange}
                placeholder="HH:MM"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                id="endTime"
                value={form.endTime}
                onChange={handleChange}
                placeholder="HH:MM"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="location" className="block text-base font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            name="location"
            id="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Enter event location"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Create Event
        </button>
        {message && <div className="mt-4 text-red-600 text-center">{message}</div>}
      </form>
    </div>
  );
};

export default EventForm;
