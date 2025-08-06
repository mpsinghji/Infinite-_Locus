import express from "express";
import {
  getAllEvents,
  createEvent,
  getEventById,
  getMyEvents,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventRegistrations,
  getMyRegistrations
} from "../controllers/eventController.js";
import { authUser } from "../middleware/authUser.js";

const eventrouter = express.Router();

// Event routes
eventrouter.get("/", authUser, getAllEvents);
eventrouter.post("/", authUser, createEvent);
eventrouter.get("/my", authUser, getMyEvents);
eventrouter.get("/:id", authUser, getEventById);
eventrouter.put("/:id", authUser, updateEvent);
eventrouter.delete("/:id", authUser, deleteEvent);

// Registration routes
eventrouter.post("/register", authUser, registerForEvent);
eventrouter.get("/:id/registrations", authUser, getEventRegistrations);
eventrouter.get("/my-registrations", authUser, getMyRegistrations);

export default eventrouter;