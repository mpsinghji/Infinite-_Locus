import eventModel from '../models/eventModel.js';
import Event from '../models/eventModel.js';
import Registration from '../models/registrationModel.js';
import userModel from '../models/userModel.js';

// Helper: Check if user is organizer
const isOrganizer = async (userId) => {
    const user = await userModel.findById(userId);
    return user && user.role === 'organizer';
};

export const createEvent = async (req, res) => {
    try {
        if (!req.body.title || !req.body.description || !req.body.date || !req.body.location || !req.body.startTime || !req.body.endTime) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const EventData = {
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            location: req.body.location,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            createdAt: new Date(),
            createdBy: req.body.userId
        };
        const newEvent = new Event(EventData);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllEvents = async (req, res) => {
    try {
        const events = await eventModel.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.body.userId });
        // For each event, get registrations
        const eventsWithRegistrations = await Promise.all(events.map(async (event) => {
            const registrations = await Registration.find({ event: event._id }).populate('user', 'name email');
            return {
                ...event.toObject(),
                registrations,
                registrationsCount: registrations.length
            };
        }));
        res.status(200).json(eventsWithRegistrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (String(event.createdBy) !== req.body.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        Object.assign(event, req.body);
        await event.save();
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (String(event.createdBy) !== req.body.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await event.remove();
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Registration endpoints
export const registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.body.userId;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        // Prevent duplicate registration
        const existing = await Registration.findOne({ user: userId, event: eventId });
        if (existing) {
            return res.status(400).json({ message: 'Already registered' });
        }
        const registration = new Registration({ user: userId, event: eventId });
        await registration.save();
        event.registrationsCount += 1;
        await event.save();
        res.status(201).json({ message: 'Registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getEventRegistrations = async (req, res) => {
    try {
        const eventId = req.params.id;
        const registrations = await Registration.find({ event: eventId }).populate('user', 'name email');
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyRegistrations = async (req, res) => {
    try {
        const userId = req.body.userId;
        const registrations = await Registration.find({ user: userId }).populate('event');
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};