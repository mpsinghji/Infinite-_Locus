import mongoose from 'mongoose';
const eventSchema = new mongoose.Schema({
    title : {type:String , required:true},
    description : {type:String , required:true},
    date : {type:Date , required:true},
    location : {type:String , required:true},
    startTime:{type:String, required:true},
    endTime:{type:String, required:true},
    createdAt : {type:Date , default:Date.now},
    createdBy : {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    registrationsCount: {type: Number, default: 0}
});
export default mongoose.model('Event', eventSchema);