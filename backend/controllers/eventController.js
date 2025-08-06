import Event from '../models/eventModel.js';

export const createEvent=async(req , res)=>{
    try{
        if(!req.body.title || !req.body.description || !req.body.date || !req.body.location || !req.body.startTime || !req.body.endTime) {
            return res.status(400).json({message: 'All fields are required'});
        }
        const EventData={
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            location: req.body.location,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            createdAt: new Date(),
            createdBy: req.userId // Assuming you have user authentication middleware
        };
        const newEvent = new  Event({
            ...EventData,
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    }catch(error){
        res.status(400).json({message: error.message});
    }
}


export const getAllEvents=async(req , res)=>{
    try{
        const events = await Event.find().populate('organizer', 'name email');
        res.status(200).json(events);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getEventById=async(req , res)=>{
    try{
        const event = await Event.findById(req.params.id).populate('organizer', 'name email');
        if(!event){
            return res.status(404).json({message: 'Event not found'});
        }
        res.status(200).json(event);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}
export const updateEvent=async(req,res)=>{
    try{
        const event= await Event.findByIdAndUpdate(req.params,req.body,{new: true});
        if(!event){
            return res.status(404).json({message: 'Event not found'});
        }
        res.status(200).json(event);
    }catch(error){
        res.status(400).json({message: error.message});
    }
}


export const deleteEvent=async(req,res)=>{
    try{
        const event= await Event.findByIdAndDelete(req.params.id);
        if(!event){
            return res.status(404).json({message: 'Event not found'});
        }
        res.status(200).json({message: 'Event deleted successfully'});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}