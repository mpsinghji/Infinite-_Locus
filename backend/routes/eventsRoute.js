import express from "express";
import {getAllEvents, createEvent, getEventById, updateEvent, deleteEvent} from "../controllers/eventController.js";
import { authUser } from "../middleware/authUser.js";


const eventrouter = express.Router();
eventrouter.get("/",getAllEvents);
eventrouter.post("/create-event", authUser, createEvent);
eventrouter.get("/get-my-events",authUser, getEventById);
eventrouter.put("/update-event",authUser, updateEvent);
eventrouter.delete("/delete-event", authUser, deleteEvent);


export default eventrouter;